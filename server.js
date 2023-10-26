const path = require("path");
const express = require("express");

const cookieParser = require("cookie-parser");
const { default: rateLimit } = require("express-rate-limit");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require("./utils/errorHandler");
const logError = require("./utils/logError");
const { default: mongoose } = require("mongoose");
// const helmet = require("helmet");
const chatRoutes = require(path.join(__dirname, "routes", "chatRoutes.js"));

// const mongoclient = require(path.join(__dirname, "database", "MongoDB.js"));

mongoose.connect(
  process.env.MONGODB_SECURE_URI.replace(
    /<password>/,
    process.env.MONGODB_PASSWORD
  )
);

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

app.use(limiter);

app.use(cors());
// app.use(helmet());
app.options("*", cors());

app.use(chatRoutes);
app.use(logError);
app.use(errorHandler);

app.listen(port, () => console.log(`App listening in port: ${port}`));
