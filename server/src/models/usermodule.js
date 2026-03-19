const { Schema, Types } = require("mongoose");

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true


    },
    email:{
        type:String,
        required: true,
        unique:true

    },
    password:{
        type:String
    },
    

    
});
const usermodel=mongoose.model("user",userSchema);
module.exports=usermodel;

