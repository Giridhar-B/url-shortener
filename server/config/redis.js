const { createClient } = require("redis");

let client;

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.log("Redis URL not found, skipping Redis...");
      return;
    }

    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) =>
      console.log("Redis Error:", err.message)
    );

    await client.connect();

  } catch (err) {
    console.log("Redis connection failed");
  }
};

const getRedisClient = () => client;

module.exports = { connectRedis, getRedisClient };