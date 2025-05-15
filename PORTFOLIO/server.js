const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve your HTML/CSS/JS

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/projectsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));






const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/contact');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Message received!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
