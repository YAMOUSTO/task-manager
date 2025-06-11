// server/config/db.js
const mongoose = require('mongoose');
// No need to require('dotenv').config() here if server.js does it first.
// However, it's safe if you want to ensure MONGO_URI is available if this file is ever run alone.
// require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // If .env is in server/

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in your environment variables. Please check your server/.env file.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;