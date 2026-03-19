require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = require("./src/app");
const connectdb = require("./src/database/db");

const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

connectdb();

app.get("/", (req, res) => {
    res.send("HungryHub Backend is Live and Running!");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});