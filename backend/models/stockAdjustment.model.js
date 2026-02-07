import mongoose from "mongoose";

const stockAdjustmentSchema = new mongoose.Schema(
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
        batchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InventoryBatch",
            default: null,
        },
        qtyChange: { type: Number, required: true },
        reason: {
            type: String,
            enum: [
                "audit",
                "damage",
                "expiry",
                "theft",
                "transfer",
                "return",
                "other",
            ],
            default: "other",
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

const StockAdjustment = mongoose.model(
    "StockAdjustment",
    stockAdjustmentSchema,
);

export default StockAdjustment;
