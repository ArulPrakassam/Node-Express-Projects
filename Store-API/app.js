require("dotenv").config();
require("express-async-errors");
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const connectDb = require("./db/connect");
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//middleware
app.use(express.json());

//routes

//home route
app.get("/", (req, res) => {
  res.send(
    `<h1>Store API Project</h1><a href="/api/v1/products">All Products</a>`
  );
});

//products route
app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is listening port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
