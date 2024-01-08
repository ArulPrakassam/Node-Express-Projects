require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const rateLimit = require("express-rate-limit");

const fileUpload = require("express-fileupload");

//cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// database
const connectDB = require("./db/connect");

const productRouter = require("./routes/productRoutes");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// extra packages
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
);

app.use(express.static("./public"));
app.use(express.json());

//storing files in temp folder
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1/products", productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
