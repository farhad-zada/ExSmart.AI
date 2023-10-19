const { OpenAI } = require("openai");
require("dotenv").config();
const youtubeController = require("./youtubeController");
const _ = require("lodash");
const functions = require("../functions/index");
const catchAsync = require("../utils/catchAsync");

const systemPrompt = `You are a happy assistant whose name is Chatty that puts a positive spin on everything. 
You are a good and helpful assistant. Make stept-by-step comprehensive roadmaps for users when needed. Use 
lots of relevant emojis in your responses.`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_EXSMART,
});

const conversations = {};

// gets response from OpenAI GPT
async function chat(messages) {
  try {
    return await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo-16k-0613",
      temperature: 0,
      frequency_penalty: 0,
      functions,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
}

// checks if there is a user input and converts it into GPT message
exports.userInput = catchAsync(async (req, res, next) => {
  const id = req.cookies.id;

  // throw new Error("something");
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "ID needed to coninue or start a conversation",
    });
  }
  const content = req.body.userInput;
  console.log("checking user input...");
  if (!conversations[id]) {
    conversations[id] = [{ role: "system", content: systemPrompt }];
    conversations[id].push({
      role: "assistant",
      content: "Hi! How can I help you today? ✨",
    });
  }
  if (!content) {
    res.status(400).json({
      message: "invalid request",
    });
  }

  conversations[id].push({ role: "user", content });
  next();
});

// handles chatting with GPT
exports.chat = catchAsync(async (req, res, next) => {
  const id = req.cookies.id;

  console.log("waiting for chat...");
  const response = await chat(conversations[id]);
  if (!response) {
    return res.status(500).json({
      message: "Something went wrong at generating response!",
    });
  }
  conversations[id].push(response.choices[0].message);
  req.message = _.cloneDeep(response.choices[0].message);
  next();
});

// processes function_call if exists
exports.proccessFunctionCall = catchAsync(async (req, res, next) => {
  if (!req.message.function_call) {
    return next();
  }
  console.log("processing function call");

  const arguments = JSON.parse(req.message.function_call.arguments);

  console.log("searching youtube...");

  const searchResults = await Promise.all(
    arguments.steps.map((step) =>
      youtubeController.search(step.youtube_search_string, arguments.language)
    )
  );

  youtubeEmbeddings = searchResults.map((rslt) => {
    try {
      return rslt.data.items.map((item) => {
        return `https://www.youtube.com/embed/${item.id.videoId}`;
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  arguments.steps.map(
    (step, i) => (arguments.steps[i].youtube_embedding = youtubeEmbeddings[i])
  );
  req.message.function_call.arguments = arguments;

  next();
});

// sends a response back
exports.chatResponse = catchAsync(async (req, res, next) => {
  res.status(200).json(req.message);
  console.log("response sent succesfully");
});

// returns conversations as whole
exports.getConversations = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});
