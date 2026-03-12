require("dotenv").config();
const express = require("express"); // Express import karna zaroori hai
const cors = require("cors");       // Vercel se connect karne ke liye
const app = require("./src/app");
const connectdb = require("./src/database/db");

// Render apne aap PORT assign karta hai, isliye process.env.PORT zaroori hai
const port = process.env.PORT || 3000;

// CORS Middleware: Iske bina Vercel ka frontend data nahi khinch payega
app.use(cors({
    origin: "*", // Abhi ke liye sab allow hai, baad mein yahan Vercel ka link daal sakte hain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Database Connection
connectdb();

// Default Route (Taaki browser mein "Not Found" na aaye)
app.get("/", (req, res) => {
    res.send("HungryHub Backend is Live and Running!");
});

// Server Start
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});