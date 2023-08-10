const mongoose = require("mongoose");
const { Schema } = mongoose;
const TasksSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  dueDate: {
    type: String,
    default: "General",
  },
  status: {
    type: String,
    default: "General",
  },
  assignedUser: {
    type: String,
    default: "General",
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("tasks", TasksSchema);
