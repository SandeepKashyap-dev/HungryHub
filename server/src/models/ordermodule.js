const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: [
        {
            _id: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],
    deliveryInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "card", "upi"],
        default: "cod"
    },
    total: Number,
    status: {
        type: String,
        enum: ["pending", "processing", "delivered", "cancelled"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
