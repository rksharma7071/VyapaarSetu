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
        hsn: { type: String },
        gstRate: { type: Number, default: 0 },
        cgst: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        igst: { type: Number, default: 0 },
    },
    { _id: false },
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            index: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: false,
            index: true,
        },
        customer: {
            name: { type: String },
            phone: { type: String },
            email: { type: String },
            gstin: { type: String },
            address: { type: String },
            state: { type: String },
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
        cgstTotal: { type: Number, default: 0, min: 0 },
        sgstTotal: { type: Number, default: 0, min: 0 },
        igstTotal: { type: Number, default: 0, min: 0 },
        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card", "razorpay"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid"],
            default: "paid",
        },
        paymentId: { type: String },
        paymentRecordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },
        paymentMode: {
            type: String,
            enum: ["test", "live", "offline"],
            default: "offline",
        },
        paymentDetails: { type: mongoose.Schema.Types.Mixed },
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

orderSchema.index({ storeId: 1, orderNumber: 1 }, { unique: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
