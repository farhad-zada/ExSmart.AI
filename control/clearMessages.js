const Message = require("../models/messageModel"); // Assuming your model file is in the same directory
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    process.env.MONGODB_SECURE_URI.replace(
      /<password>/,
      process.env.MONGODB_PASSWORD
    )
  )
  .then((result) => {
    console.log("connected!");
    Message.deleteMany()
      .then((result) => {
        console.log("deleted all");
        mongoose
          .disconnect()
          .then((result) => {
            console.log("disconnected");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
