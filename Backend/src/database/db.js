const mongoose =require("mongoose");

function connectdb(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{})
    .catch((err)=>{})
    
}
module.exports = connectdb;