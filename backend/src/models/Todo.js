const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  deadline: { type: Date, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);