const express = require('express');
const router = express.Router();
const {
  createProject,
  fetchAllProjects,
  fetchProjectById,
  fetchAssignedProjects,
  updateProject,
  deleteProject } = require('../controller/projectController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/', verifyJWT, createProject);
router.get('/', verifyJWT, fetchAllProjects);
router.get('/:id', verifyJWT, fetchProjectById);
router.get('/assigned', verifyJWT, fetchAssignedProjects);
router.put('/:id', verifyJWT, updateProject);
router.delete('/:id', verifyJWT, deleteProject);


module.exports = router;

