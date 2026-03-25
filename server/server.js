console.log("🚀 Starting HungryHub Backend Server...");

require("dotenv").config();
const express = require("express");
const app = require("./src/app");
const connectdb = require("./src/database/db");

const port = process.env.PORT || 3000;

console.log("📦 Connecting to database...");
connectdb();

app.get("/", (req, res) => {
    res.send("HungryHub Backend is Live and Running!");
});

setTimeout(() => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`✅ Server is running on port ${port}`);
        console.log(`http://localhost:${port}`);
    });
}, 2000);