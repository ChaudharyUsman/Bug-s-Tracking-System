const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  qas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  developers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);
