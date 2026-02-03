import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
            index: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,

            validate: [
                (v) => v.length > 0,
                "POS order must have at least one item",
            ],
        },
        subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid"],
            default: "paid",
        },
        status: {
            type: String,
            enum: ["completed", "cancelled", "refunded"],
            default: "completed",
            index: true,
        },
        notes: { type: String },
        placedAt: { type: Date, default: Date.now, index: true },
    },
    { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
