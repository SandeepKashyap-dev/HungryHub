const mongoose = require("mongoose");

const foodschema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    restaurant: String,
    category: String,
    isPopular: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("Food", foodschema);