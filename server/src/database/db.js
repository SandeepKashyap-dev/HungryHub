const mongoose =require("mongoose");

function connectdb(){
    console.log("Attempting to connect to MongoDB...");
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("✓ MongoDB Connected Successfully!");
    })
    .catch((err)=>{
        console.error("✗ MongoDB Connection Error:", err.message);
    })
    
}
module.exports = connectdb;