const path = require("path");
const express = require("express");
const chatController = require("./controllers/chatController");
const cookieParser = require("cookie-parser");
const { default: rateLimit } = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require("./utils/errorHandler");
const logError = require("./utils/logError");
// const helmet = require("helmet");

const port = process.env.PORT || 3000;

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

app.post(
  "/",
  chatController.userInput,
  chatController.chat,
  chatController.proccessFunctionCall,
  chatController.chatResponse
);

app.post("/get_data", chatController.getConversations);

app.use(logError);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening in port: ${port}`));
