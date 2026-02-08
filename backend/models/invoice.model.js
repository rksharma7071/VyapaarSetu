import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        hsn: { type: String },
        qty: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        taxableValue: { type: Number, required: true, min: 0 },
        gstRate: { type: Number, default: 0, min: 0 },
        cgst: { type: Number, default: 0, min: 0 },
        sgst: { type: Number, default: 0, min: 0 },
        igst: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },
    },
    { _id: false },
);

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: { type: String, required: true },
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
        customer: {
            name: { type: String },
            phone: { type: String },
            email: { type: String },
            gstin: { type: String },
            address: { type: String },
            state: { type: String },
        },
        items: { type: [invoiceItemSchema], required: true },
        subtotal: { type: Number, required: true, min: 0 },
        discountTotal: { type: Number, default: 0, min: 0 },
        taxableTotal: { type: Number, required: true, min: 0 },
        cgstTotal: { type: Number, default: 0, min: 0 },
        sgstTotal: { type: Number, default: 0, min: 0 },
        igstTotal: { type: Number, default: 0, min: 0 },
        grandTotal: { type: Number, required: true, min: 0 },
        status: { type: String, enum: ["issued", "cancelled"], default: "issued" },
        issuedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

invoiceSchema.index({ storeId: 1, invoiceNumber: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
