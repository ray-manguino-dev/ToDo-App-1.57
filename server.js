const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper: read tasks from file
const readTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Helper: write tasks to file
const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ToDo App API is running', version: '1.0.0' });
});

// POST /api/tasks - create a new task
app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// GET /api/tasks - list all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// PATCH /api/tasks/:id - update task completion
app.patch('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const { id } = req.params;
  const { completed } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks[taskIndex].completed = completed;
  writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const deleted = tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  res.json(deleted[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`ToDo App server running on port ${PORT}`);
});

module.exports = app;
