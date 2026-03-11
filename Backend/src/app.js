const express= require("express");
const cors =require("cors");
const app=express();
app.use(express.json());
const router= require("../src/routers/auth.router");
app.use(cors());
app.use("/api",router);


module.exports=app;