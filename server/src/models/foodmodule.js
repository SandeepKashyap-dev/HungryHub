const mongoose = require("mongoose");

const foodschema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    category: String,
    isPopular: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            rating: { type: Number, required: true }
        }
    ]
})

module.exports = mongoose.model("Food", foodschema);