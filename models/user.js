const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
});

module.exports = model('User', userSchema);
