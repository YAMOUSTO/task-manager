require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 

connectDB(); 


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));   
app.use('/api/tasks', require('./routes/tasks')); 

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'Task Manager API is running!' });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
 });