const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const Task = require('../models/Task');
const User = require('../models/User'); 

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, status, priority, dueDate, assigneeEmail } = req.body;
  const userIdFromToken = req.user.id;
  const userEmailFromToken = req.user.email; 

  if (!title) {
    return res.status(400).json({ msg: 'Title is required' });
  }

  try {
    const newTask = new Task({
      user: userIdFromToken, 
      creatorEmail: userEmailFromToken, 
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null, // Mongoose handles Date conversion
      assigneeEmail,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Create Task Error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    res.status(500).send('Server Error on task creation');
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    const tasks = await Task.find({ user: userIdFromToken }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Get Tasks Error:', err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const userIdFromToken = req.user.id;
  const { title, description, status, priority, dueDate, assigneeEmail } = req.body;

  try {

    let task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user.toString() !== userIdFromToken) {
      return res.status(401).json({ msg: 'User not authorized to update this task' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (assigneeEmail !== undefined) task.assigneeEmail = assigneeEmail;
   
    const updatedTask = await task.save(); 
   
    res.json(updatedTask);
  } catch (err) {
    console.error('Update Task Error:', err.message);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation Error', errors: err.errors });
    }
    if (err.kind === 'ObjectId' && err.path === '_id') { 
        return res.status(400).json({ msg: 'Invalid Task ID format' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const userIdFromToken = req.user.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.user.toString() !== userIdFromToken) {
      return res.status(401).json({ msg: 'User not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(taskId); 

    res.json({ msg: 'Task removed successfully' });
  } catch (err) {
    console.error('Delete Task Error:', err.message);
     if (err.kind === 'ObjectId' && err.path === '_id') {
        return res.status(400).json({ msg: 'Invalid Task ID format' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;