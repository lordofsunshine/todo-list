# ToDo List

## Description

This is a task management application (ToDo) built using Node.js, Express, and MongoDB. It provides users with the ability to add, edit, and delete tasks, as well as manage their priorities. It includes user authentication and registration, as well as Google sign-in functionality.

## Key Features

- **User Authentication and Registration:** Users can register, log in, and log out.
- **Google Sign-In:** Supports authentication via Google for user convenience.
- **Task Management:** Allows adding new tasks, editing existing ones, deleting tasks, and changing their order. Tasks can be assigned priorities: High, Medium, and Low.
- **Data Storage:** Utilizes MongoDB to store user and task information.
- **Markdown Parsing:** Tasks can include descriptions in Markdown format, which is converted to HTML for better display.

## Preview 
## Home Page
<img src="https://cdn.glitch.global/4297ee09-1258-4bd4-a51a-260a1ee900ff/c904c019-54cf-4781-8b08-87268b34fdce.image.png?v=1723127196819" alt="Preview" />

## Login Page
<img src="https://cdn.glitch.global/4297ee09-1258-4bd4-a51a-260a1ee900ff/fa7ff021-5a39-4700-986e-935a2e32cb0e.image.png?v=1723127232954" alt="Preview" />

## Panel Page
<img src="https://cdn.glitch.global/4297ee09-1258-4bd4-a51a-260a1ee900ff/e069e34d-2de7-4e8a-8236-d9b204b06574.image.png?v=1723127277352" alt="Preview" />

## Installation and Setup

1. **Clone the repository:**
   ```
   git clone https://github.com/lordofsunshine/todo-list.git
   cd todo-list
   ```
   
2. Install dependencies:
 
```
npm install
```

3. Create a .env file:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
PORT=3000
```

4. Start the server:
```
npm start
```

5. Open the application in your browser:
Navigate to http://localhost:3000 in your web browser.

# Common Issues and Solutions
- **Missing .env file or incorrect environment variable values:** Ensure that all environment variables are defined in the `.env` file and contain correct values. Check that the MongoDB URI and Google API keys are accurate.
- **Database connection errors:** Verify that the MongoDB URI is correct and that your database is accessible. Check network settings and permissions.
- **Google Authentication errors:** Ensure that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` are correctly configured and match your project settings in the Google Cloud Console.
- **Server startup errors:** If the server fails to start, check that all dependencies are correctly installed and that you are using a supported version of Node.js.

## Project Development
This project will continue to evolve. New features, UI improvements, and security enhancements are planned. Contributions and suggestions are welcome!
## License
MIT License
