const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ROUTES
const linkRoutes = require("./routes/linkRoutes");
const authRoutes = require("./routes/authRoutes");

// REDIRECT CONTROLLER
const { redirectToOriginal } = require("./controllers/linkController");

// MIDDLEWARE

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ROUTES

// AUTH ROUTES
app.use("/auth", authRoutes);

// MAIN API ROUTES (ALL FEATURES INSIDE THIS)
app.use("/api", linkRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("URL Shortener API running");
});

// REDIRECT ROUTE

app.get("/:shortCode", redirectToOriginal);

module.exports = app;
