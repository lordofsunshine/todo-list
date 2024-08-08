(async () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
  const { marked } = require('marked');
  const session = require('express-session');
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const bcrypt = require('bcrypt');
  const crypto = require('crypto');

  const chalk = await import('chalk');

  const app = express();
  const port = process.env.PORT || 3000;

  const requiredEnv = ['MONGO_URI', 'SESSION_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL'];
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      console.error(chalk.default.red.bold(`ERROR: ${key} is not defined in .env file. Please set it and restart the server.`));
      process.exit(1);
    }
  });

  console.log(chalk.default.green.bold(`
   .----------------.  .----------------.  .----------------.  .----------------. 
  | .--------------. || .--------------. || .--------------. || .--------------. |
  | |  _________   | || |     ____     | || |  ________    | || |     ____     | |
  | | |  _   _  |  | || |   .'    \`.   | || | |_   ___ \`.  | || |   .'    \`.   | |
  | | |_/ | | \_|  | || |  /  .--.  \\  | || |   | |   \`. \\ | || |  /  .--.  \\  | |
  | |     | |      | || |  | |    | |  | || |   | |    | | | || |  | |    | |  | |
  | |    _| |_     | || |  \\  \`--'  /  | || |  _| |___.' / | || |  \\  \`--'  /  | |
  | |   |_____|    | || |   \`.____.'   | || | |________.'  | || |   \`.____.'   | |
  | |              | || |              | || |              | || |              | |
  | '--------------' || '--------------' || '--------------' || '--------------' |
   '----------------'  '----------------'  '----------------'  '----------------' 
  `));

  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.static('public'));

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const db = client.db('todoDB');
        const user = await db.collection('users').findOne({ email });
        if (!user) return done(null, false, { message: 'Incorrect email.' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const db = client.db('todoDB');
        let user = await db.collection('users').findOne({ googleId: profile.id });
        if (!user) {
          user = {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          };
          await db.collection('users').insertOne(user);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const db = client.db('todoDB');
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.set('view engine', 'ejs');
  app.set('views', './views');

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };

  app.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/panel');
    }
    res.render('index', { title: 'Welcome to ToDo' });
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/register', (req, res) => {
    res.render('register');
  });

  app.get('/panel', ensureAuthenticated, async (req, res) => {
    try {
      const db = client.db('todoDB');
      const priorityMap = {
        'High': 3,
        'Medium': 2,
        'Low': 1
      };
      const tasks = await db.collection('tasks')
        .find({ userId: req.user._id })
        .toArray();
      tasks.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority] || a.order - b.order);
      tasks.forEach(task => {
        task.content = marked.parse(task.content);
      });
      res.render('panel', {
        title: 'Your ToDo',
        tasks: tasks,
        user: req.user
      });
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      email,
      password: hashedPassword,
    };

    try {
      const db = client.db('todoDB');
      await db.collection('users').insertOne(user);
      res.redirect('/login');
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.post('/login', passport.authenticate('local', {
    successRedirect: '/panel',
    failureRedirect: '/login',
  }));

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }),
    (req, res) => {
      res.redirect('/panel');
    }
  );

  app.post('/add', ensureAuthenticated, async (req, res) => {
    try {
      const db = client.db('todoDB');
      const lastTask = await db.collection('tasks').find({ userId: req.user._id }).sort({ order: -1 }).limit(1).toArray();
      const order = lastTask.length > 0 ? lastTask[0].order + 1 : 0;
      await db.collection('tasks').insertOne({
        title: req.body.title,
        content: req.body.content,
        priority: req.body.priority || 'Medium',
        completed: false,
        order: order,
        userId: req.user._id
      });
      res.redirect('/panel');
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
      const db = client.db('todoDB');
      await db.collection('tasks').updateOne(
        { _id: new ObjectId(req.params.id), userId: req.user._id },
        { $set: {
          title: req.body.title,
          content: req.body.content,
          priority: req.body.priority,
          completed: req.body.completed === 'true'
        }}
      );
      res.redirect('/panel');
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
      const db = client.db('todoDB');
      await db.collection('tasks').deleteOne({ _id: new ObjectId(req.params.id), userId: req.user._id });
      res.sendStatus(204);
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.post('/reorder', ensureAuthenticated, async (req, res) => {
    try {
      const db = client.db('todoDB');
      const tasks = req.body.tasks;
      for (const task of tasks) {
        await db.collection('tasks').updateOne(
          { _id: new ObjectId(task.id), userId: req.user._id },
          { $set: { order: task.order } }
        );
      }
      res.sendStatus(200);
    } catch (error) {
      console.error(chalk.default.red.bold(error));
      res.sendStatus(500);
    }
  });

  app.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(chalk.default.red.bold(err));
        return next(err);
      }
      res.redirect('/');
    });
  });

  app.listen(port, () => {
    console.log(chalk.default.green.bold(`App is running on http://localhost:${port}`));
  });
})();