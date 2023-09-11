const mongoose = require("mongoose");

//accept only these things in our database
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide value"],
    trim: true,
    //maxlength:[20, 'name cannot be more than 20 characters]
  },
  completed: {
    type: Boolean,
    default: false, //default value
  },
});

module.exports = mongoose.model("Task", TaskSchema);
