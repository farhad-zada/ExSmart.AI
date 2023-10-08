const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

const ytKey = process.env.YT_KEY;
const ytURL = "https://www.googleapis.com/youtube/v3";

exports.search = async (query) => {
  const url = `${ytURL}/search?type=video&q=${query}`;
  const params = { key: ytKey };

  try {
    const response = await axios.get(url, {
      params,
    });

    return response;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
