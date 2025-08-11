const Bug = require('../models/bug');
const fs = require('fs');
const path = require('path');

// Create a Bug
exports.createBug = async (req, res) => {
  try {
    const { title, description, deadline, types, status, project, assignedDeveloper } = req.body;
    const screenshot = req.file ? req.file.filename : null;

    const newBug = new Bug({
      title,
      description,
      deadline,
      types,
      status,
      project,
      assignedDeveloper,
      screenshot,
    });

    await newBug.save();
    res.status(201).json({ message: 'Bug created successfully', bug: newBug });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all Bugs
exports.fetchAllBug = async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = {};

    if (projectId) {
      filter.project = projectId;
    }
    const bugs = await Bug.find(filter)
      .populate('project')
      .populate('assignedDeveloper'); 
    res.status(200).json(bugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Bug by ID
exports.fetchBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('project')
      .populate('assignedDeveloper');
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.status(200).json(bug);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update Bug
exports.updateBug = async (req, res) => {
  try {
    const { title, description, deadline, types, status, project, assignedDeveloper } = req.body;

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (deadline) updatedFields.deadline = deadline;
    if (types) updatedFields.types = types;
    if (status) updatedFields.status = status;
    if (project) updatedFields.project = project;
    if (assignedDeveloper) updatedFields.assignedDeveloper = assignedDeveloper;

    if (req.file) {
      updatedFields.screenshot = req.file.filename;

      const oldBug = await Bug.findById(req.params.id);
      if (oldBug && oldBug.screenshot) {
        const oldPath = path.join(__dirname, "./public", oldBug.screenshot);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true } 
    )
      .populate('project')
      .populate('assignedDeveloper');

    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    res.status(200).json({ message: 'Bug updated successfully', bug });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Bug
exports.deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    if (bug.screenshot) {
      const filePath = path.join(__dirname, "./public", bug.screenshot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
