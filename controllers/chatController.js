const { OpenAI } = require("openai");
require("dotenv").config();
const youtubeController = require("./youtubeController");

const systemPrompt = `You are a happy assistant whose name is Chatty that puts a positive spin on everything. 
You are a good and helpful assistant. Make stept-by-step comprehensive roadmaps for users when needed. Use 
lots of relevant emojis in your responses.`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_EXSMART,
});

const functions = require("../functions/index");

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
exports.userInput = async (req, res, next) => {
  const id = req.params.id;

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
  }
  if (!content) {
    res.status(400).json({
      message: "invalid request",
    });
  }

  conversations[id].push({ role: "user", content });
  next();
};

// handles chatting with GPT
exports.chat = async (req, res, next) => {
  const id = req.params.id;

  try {
    console.log("waiting for chat...");
    req.response = await chat(conversations[id]);
    if (!req.response) {
      return res.status(500).json({
        message:
          "Something went very wrong! Please contact farhad.szd@gmail.com",
      });
    }
    conversations[id].push(req.response.choices[0].message);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went very wrong! Please contact farhad.szd@gmail.com",
    });
  }
};

// processes function_call if exists
exports.proccessFunctionCall = async (req, res, next) => {
  if (!req.response.choices[0].message.function_call) {
    return next();
  }
  console.log("processing function call");

  const arguments = JSON.parse(
    req.response.choices[0].message.function_call.arguments
  );

  console.log("searching youtube...");

  const searchResults = await Promise.all(
    arguments.steps.map((step) =>
      youtubeController.search(step.youtube_search_string)
    )
  );

  youtubeEmbeddings = searchResults.map((rslt) =>
    rslt.data.items.map((item) => {
      return `https://www.youtube.com/embed/${item.id.videoId}`;
    })
  );

  arguments.steps.map(
    (step, i) => (arguments.steps[i].youtube_embedding = youtubeEmbeddings[i])
  );
  req.response.choices[0].message.function_call.arguments = arguments;

  next();
};

// sends a response back
exports.chatResponse = async (req, res, next) => {
  const id = req.params.id;
  conversations[id].push(req.response.choices[0].message);

  res.status(200).json(req.response.choices[0].message);
  console.log("response sent succesfully");
};

// returns conversations as whole
exports.getConversations = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
};

// testing youtbe
// exports.ytTest = async (req, res, next) => {
//   const query = req.body.userInput;
//   await processCreateRoadmap(query);
//   res.json({ role: "server", content: "Testing..." });
// };
