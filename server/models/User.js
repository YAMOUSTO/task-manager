// server/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures emails are unique
    lowercase: true, // Store emails in lowercase
    trim: true,
  },
  passwordHash: { // We will store the hashed password, not the plain text
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default value will be the current date/time
  },
  // You can add more fields later, like profilePictureUrl, roles, etc.
});

// Mongoose automatically creates a collection named 'users' (plural, lowercase)
// if the model is named 'User'.
module.exports = mongoose.model('User', UserSchema);