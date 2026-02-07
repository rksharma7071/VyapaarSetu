import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        reason: { type: String },
        taxableValue: { type: Number, required: true, min: 0 },
        cgst: { type: Number, default: 0, min: 0 },
        sgst: { type: Number, default: 0, min: 0 },
        igst: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const returnSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        items: { type: [returnItemSchema], required: true },
        refundMethod: {
            type: String,
            enum: ["cash", "card", "upi", "razorpay"],
            required: true,
        },
        refundAmount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ["requested", "approved", "rejected", "completed"],
            default: "requested",
        },
        notes: { type: String },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true },
);

const Return = mongoose.model("Return", returnSchema);

export default Return;
