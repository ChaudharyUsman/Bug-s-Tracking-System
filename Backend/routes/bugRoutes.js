const express = require('express');
const router = express.Router();
const { 
  createBug,
  fetchAllBug,
  fetchBugById,
  updateBug,
  deleteBug } = require('../controller/bugController');
const upload = require('../middleware/multer');
const verifyJWT = require('../middleware/verifyJWT')

router.post('/',verifyJWT,upload.single('screenshot'),createBug);
router.get('/',verifyJWT,fetchAllBug);
router.get('/:id',verifyJWT,fetchBugById);
router.put('/:id',verifyJWT,upload.single('screenshot'),updateBug); 
router.delete('/:id',verifyJWT,deleteBug);

module.exports= router;
