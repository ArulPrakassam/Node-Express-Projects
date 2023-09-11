//it is used to put our json data to database
require("dotenv").config();

const connectDb = require("./db/connect");
const Product = require("./models/product");

const jsonProducts = require("./products.json");

const start = async () => {
  try {
    await connectDb(process.env.MONOGO_URL);
    console.log("success");
    await Product.deleteMany();
    await Product.create(jsonProducts);
    //exit without errors
    process.exit(0);
  } catch (error) {
    console.log(error);
    //exit with errors
    process.exit(1);
  }
};
start();
