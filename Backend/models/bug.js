const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  deadline: {
    type: Date,
  },
  screenshot: {
    type: String,
  },
  types: {
    type: String,
    enum: ['feature', 'bug'],
    required: true,
  },
  status: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const validStatuses = {
          feature: ['new', 'started', 'completed'],
          bug: ['new', 'started', 'resolved'],
        };
        const type = this.get('types') || this.types;
        return (validStatuses[type] || []).includes(value);
      },
      message: (props) =>
        `${props.value} is not a valid status for type ${props.instance?.types || 'unknown'}`,
    },
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    required: true,
  },

  assignedDeveloper: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false
  }
});

module.exports = mongoose.model('bug', bugSchema);
