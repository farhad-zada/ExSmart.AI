const { MongoClient, ServerApiVersion } = require("mongodb");

const MONGODB_SECURE_URI = process.env.MONGODB_SECURE_URI;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const client = new MongoClient(
  MONGODB_SECURE_URI.replace(/<password>/, MONGODB_PASSWORD),
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

module.exports = client;
