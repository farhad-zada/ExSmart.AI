const express = require("express");
const path = require("path");
const fs = require("fs");
const chatController = require("./controllers/chatController");
// const youtubeController = require("./controllers/youtubeController");

const port = 3000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).render("index");
});

// made to test youtube endpoint
// app.get("/yt", youtubeController.search);

// talks to chat and makes roadmap if needed

let id = 0;
app.post(
  "/",
  (req, res, next) => {
    req.params.id = id;
    id++, next();
  },
  chatController.userInput,
  chatController.chat,
  chatController.proccessFunctionCall,
  chatController.chatResponse
);

// app.post("/:id", (req, res) => {
//   const data = JSON.parse(
//     fs.readFileSync(`${__dirname}/data/tmp-response.json`)
//   );
//   res.status(200).json(data);
// });

app.get("/get_data", chatController.getConversations);
app.listen(port, () => console.log(`App listening in port: ${port}`));
