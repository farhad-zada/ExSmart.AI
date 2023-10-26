const express = require("express");
const generateId = require("../utils/generateId");
const chatController = require(`${__dirname}/../controllers/chatController`);

const router = express.Router();

let id = 0;

router
  .route("/")
  .get(generateId, chatController.tars)
  .post(
    chatController.userInput,
    chatController.chat,
    chatController.proccessFunctionCall,
    chatController.chatResponse
  );

module.exports = router;
