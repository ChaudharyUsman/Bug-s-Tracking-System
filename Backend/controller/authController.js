const User = require('../models/user');
const Project = require('../models/project');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and Password are required" });

    const foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate Tokens
    const accessToken = jwt.sign(
      { UserInfo: { _id: foundUser._id, email: foundUser.email, role: foundUser.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '3d' }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Fetch projects assigned to user
    const projects = await Project.find({
      $or: [
        { managers: foundUser._id },
        { qas: foundUser._id },
        { developers: foundUser._id }
      ]
    });

    res.cookie('jwt', refreshToken, { 
  httpOnly: true, 
  secure: true,       
  sameSite: 'None',   
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.json({ 
      id: foundUser._id, 
      email: foundUser.email, 
      role: foundUser.role, 
      accessToken,
      projects 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleNewUser = async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Name, Email, Role, and Password are required" });

    const allowedRoles = ['manager', 'qa', 'dev', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const duplicate = await User.findOne({ email });
    if (duplicate) return res.sendStatus(409); // Conflict

    const hashedPwd = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      email,
      password: hashedPwd,
      role
    });

    const { password: _, refreshToken, ...userData } = result.toObject();
    res.status(201).json({ success: `New ${role} ${name} created`, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin, handleNewUser };
