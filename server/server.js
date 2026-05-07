require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

// STARTUP FUNCTION

const startServer = async () => {
  try {
    // CONNECT DATABASE
    await connectDB();
    console.log("MongoDB connected successfully");

    // CONNECT REDIS (optional)
    try {
      await connectRedis();
      console.log("Redis connected successfully");
    } catch (redisError) {
      console.warn(
        "Redis connection failed (continuing without cache):",
        redisError.message
      );
    }

    // START SERVER
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `Environment: ${process.env.NODE_ENV || "development"}`
      );
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();