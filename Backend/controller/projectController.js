const Project = require('../models/project');

exports.createProject = async (req, res) => {
  const { title, description, managers = [], qas = [], developers = [] } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const newProject = new Project({
      title,
      description,
      managers,
      qas,
      developers,
    });

    await newProject.save();
    res.status(201).json({ 
      message: 'Project created successfully', 
      project: newProject 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.fetchAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('managers', 'email')
      .populate('qas', 'email')
      .populate('developers', 'email');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// user projects
exports.fetchAssignedProjects = async (req, res) => {
  try {
    const userId = req.user._id; 
    const role = req.user.role;

    let query = {};
    if (role === 'manager') query = { managers: userId };
    else if (role === 'qa') query = { qas: userId };
    else if (role === 'dev') query = { developers: userId };
    else if (role === 'admin') query = {}; 

    const projects = await Project.find(query)
      .populate('managers', 'email')
      .populate('qas', 'email')
      .populate('developers', 'email');

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('managers', 'email')
      .populate('qas', 'email')
      .populate('developers', 'email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, managers, qas, developers } = req.body;

    const updatedFields = { title, description, managers, qas, developers };

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


