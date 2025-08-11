const express = require('express');
const router = express.Router();
const {handleLogin,handleNewUser} = require('../controller/authController');

router.post('/login',handleLogin);
router.post('/createNewUser',handleNewUser);

module.exports=router;