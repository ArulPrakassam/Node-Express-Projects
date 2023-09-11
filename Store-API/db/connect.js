const mongoose = require("mongoose");

const connectDB = (url) => {
  //this will return promise
  return mongoose.connect(url);
};

module.exports = connectDB;
