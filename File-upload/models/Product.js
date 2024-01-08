const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
  },
  image: {
    type: String,
    required: [true, "Upload your image"],
  },
});

module.exports = mongoose.model("Product", ProductSchema);
