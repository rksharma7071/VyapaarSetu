import mongoose from "mongoose";

const inventoryBatchSchema = new mongoose.Schema(
    {
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            index: true,
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            default: null,
        },
        batchNo: { type: String, required: true, trim: true },
        expiryDate: { type: Date, default: null },
        qty: { type: Number, required: true, min: 0 },
        costPrice: { type: Number, default: 0, min: 0 },
        mrp: { type: Number, default: 0, min: 0 },
        receivedAt: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

inventoryBatchSchema.index(
    { storeId: 1, productId: 1, batchNo: 1 },
    { unique: true },
);

const InventoryBatch = mongoose.model("InventoryBatch", inventoryBatchSchema);

export default InventoryBatch;
