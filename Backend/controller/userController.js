const User = require('../models/user');
const bcrypt = require('bcrypt');

// read all users
const FetchUser = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// fetch one user

const FetchUserID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update user

const updateUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete user

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(400).json({ message: 'User Not Found' });

    res.status(200).json({ message: `User ${deleted.name} delete` });

  } catch (err) {
    res.status(500).json({ message: err.message });

  }
}

module.exports = {
  FetchUser,
  FetchUserID,
  updateUser,
  deleteUser
}


