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
    // console.log(result);
    console.log("connected!");

    Message.aggregate([
      {
        $group: {
          _id: null, // Group by user_id
          total_tokens: { $sum: "$usage.total_tokens" }, // Sum total_tokens within each group
        },
      },
    ])
      .then((result) => {
        result[0].cost = (result[0].total_tokens / 1000) * 0.002;
        console.log(result);
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
        mongoose
          .disconnect()
          .then((result) => {
            console.log("disconnected");
          })
          .catch((err) => {
            console.log(err);
          });
      });
  })
  .catch((err) => {
    console.log(err);
  });
