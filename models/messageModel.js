const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    user_id: String, //TODO:
    id: String,
    object: String,
    created: Number,
    model: String,
    choices: [
      {
        index: Number,
        message: {
          role: {
            type: String,
            enum: ["system", "assistant", "user"],
            required: [true, "role not provided"],
          },
          content: {
            type: String,
            default: "no content",
          },
          function_call: {
            name: String,
            arguments: String,
          },
        },
        finish_reason: String,
      },
    ],
    usage: {
      prompt_tokens: Number,
      completion_tokens: Number,
      total_tokens: Number,
    },
  },
  {
    toJson: {
      virtuals: true,
    },
    toString: {
      virtuals: true,
    },
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
