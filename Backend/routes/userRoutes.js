const express = require('express');
const router = express.Router();
const { FetchUser, FetchUserID, updateUser, deleteUser } = require('../controller/userController');//createUser,
const roleBase = require('../middleware/roleBase');
const verifyJWT = require('../middleware/verifyJWT');

// router.post('/users', verifyJWT, roleBase(['admin']), createUser);

router.get('/users', verifyJWT, FetchUser);
router.get('/users/:id',verifyJWT, FetchUserID);
router.put('/users/:id',verifyJWT, updateUser);
router.delete('/users/:id',verifyJWT, deleteUser);

module.exports = router;

