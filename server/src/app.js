const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hungry-hub-byhn.vercel.app",
    "https://hungry-hub-gxn9.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

const router = require("../src/routers/auth.router");

app.use("/api", router);

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
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

module.exports = app;