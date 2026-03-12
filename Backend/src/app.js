const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "https://hungry-hub-byhn.vercel.app",
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

const router = require("../src/routers/auth.router");

app.use("/api", router);

module.exports = app;