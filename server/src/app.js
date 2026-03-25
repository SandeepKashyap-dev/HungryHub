const express = require("express");
const cors = require("cors");

const app = express();

// Middleware - Order matters!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://hungry-hub-byhn.vercel.app",
    "https://hungry-hub-gxn9.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const router = require("../src/routers/auth.router");

app.use("/api", router);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.post("/api/test", (req, res) => {
  console.log("Test endpoint hit - req.body:", req.body);
  res.json({ 
    status: "OK", 
    message: "Test endpoint working",
    receivedData: req.body 
  });
});

app.get("/db-health", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const state = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    res.json({ dbStatus: states[state], message: "DB check" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler - must be before error handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found", 
    path: req.path,
    method: req.method 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    message: err.message || "Server error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

module.exports = app;