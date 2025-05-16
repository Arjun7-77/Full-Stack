const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


// Models
const Project = require('./models/project');
const Contact = require('./models/contact');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/CSS/JS

// Connect to MongoDB
mongoose.connect('mongodb+srv://arjunksc43:arjun@cluster0.fbmjlbx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

/* ------------------ PROJECT ROUTES ------------------ */

// GET all projects
app.get('/api/services', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new project
app.post('/api/services', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const newProject = new Project({ title, description });
    await newProject.save();
    res.status(201).json({ message: 'Project added!', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Error saving project' });
  }
});

/* ------------------ CONTACT ROUTE ------------------ */

// POST: Save contact form data
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message saved to MongoDB' });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






