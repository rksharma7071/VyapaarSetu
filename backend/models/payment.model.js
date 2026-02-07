import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },

        provider: {
            type: String,
            required: true,
            enum: ["cash", "card", "upi", "razorpay"],
        },

        status: {
            type: String,
            required: true,
            enum: ["pending", "paid", "failed", "refunded"],
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        transactionId: {
            type: String,
            unique: true,
            sparse: true,
        },

        currency: {
            type: String,
            default: "INR",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export { Payment };
