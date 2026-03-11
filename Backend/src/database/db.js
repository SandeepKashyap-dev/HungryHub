const mongoose =require("mongoose");

function connectdb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((err)=>{
console.log("There was an error", err);
    }
)
    
}
module.exports = connectdb;