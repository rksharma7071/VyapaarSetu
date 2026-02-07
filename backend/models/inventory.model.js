import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
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
        stockQty: { type: Number, default: 0, min: 0 },
        reorderLevel: { type: Number, default: 0, min: 0 },
        minStock: { type: Number, default: 0, min: 0 },
        maxStock: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

inventorySchema.index({ storeId: 1, productId: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
