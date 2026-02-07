import mongoose from "mongoose";

const purchaseItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        qtyOrdered: { type: Number, required: true, min: 0 },
        qtyReceived: { type: Number, default: 0, min: 0 },
        costPrice: { type: Number, default: 0, min: 0 },
        taxRate: { type: Number, default: 0, min: 0 },
        discount: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 },
    },
    { _id: false },
);

const purchaseOrderSchema = new mongoose.Schema(
    {
        poNumber: { type: String, required: true, unique: true, index: true },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "ordered", "partial", "received", "cancelled"],
            default: "draft",
        },
        items: { type: [purchaseItemSchema], required: true },
        subtotal: { type: Number, default: 0, min: 0 },
        taxTotal: { type: Number, default: 0, min: 0 },
        discountTotal: { type: Number, default: 0, min: 0 },
        grandTotal: { type: Number, default: 0, min: 0 },
        expectedAt: { type: Date, default: null },
        receivedAt: { type: Date, default: null },
        notes: { type: String },
    },
    { timestamps: true },
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);

export default PurchaseOrder;
