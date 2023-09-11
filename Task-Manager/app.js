const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
require("dotenv").config();
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

//middleware

app.use(express.static("./public"));
app.use(express.json());

app.use("/api/v1/tasks", tasks);

app.use(notFound);

//error middleware by us
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    //first we connect to our database then we start the server
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log("Server connected");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
