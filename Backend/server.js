require("dotenv").config();
const app= require("./src/app");
const connectdb = require("./src/database/db");
const mongoose = require("./src/database/db");
const route= require("./src/routers/auth.router");
const port=3000;

connectdb();
app.listen(port,()=>{
    console.log("Server running at localhost:3000");
});