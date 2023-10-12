const express = require("express");
const path = require("path");
const fs = require("fs");
const chatController = require("./controllers/chatController");
// const youtubeController = require("./controllers/youtubeController");
const cookieParser = require("cookie-parser");
// const { default: helmet } = require("helmet");
const { default: rateLimit } = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();

const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "public", "views"));
app.set("view engine", "pug");

app.use(express.json());

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// app.use(helmet());

app.use(limiter);

app.use(cors());

app.options("*", cors());

let id = 0;

app.get("/", (req, res) => {
  id++;
  res.cookie("id", `${id}`, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: false,
  });
  res.status(200).render("index");
});

app.get("/test", (req, res) => {
  id++;
  res.render("index", { id: 12 });
});

// made to test youtube endpoint
// app.get("/yt", youtubeController.search);

// talks to chat and makes roadmap if needed

app.post(
  "/",
  chatController.userInput,
  chatController.chat,
  chatController.proccessFunctionCall,
  chatController.chatResponse
);

app.post("/test", (req, res) => {
  res
    .status(200)
    .json(JSON.parse(fs.readFileSync(`${__dirname}/data/tmp-response.json`)));
});

// app.post("/:id", (req, res) => {
//   const data = JSON.parse(
//     fs.readFileSync(`${__dirname}/data/tmp-response.json`)
//   );
//   res.status(200).json(data);
// });

app.get("/get_data", chatController.getConversations);

app.listen(port, () => console.log(`App listening in port: ${port}`));
