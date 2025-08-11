const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    unique : true 
  },
  password: {
    type: String,
    require: true
    
  },
  role: {
    type: String,
    enum: ['manager', 'qa', 'dev','admin'],
    require : true
  },
  refreshToken: String
})

module.exports = mongoose.model('user', userSchema);