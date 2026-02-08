import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        sku: { type: String, unique: true, sparse: true },
        description: { type: String, trim: true },
        type: {
            type: String,
            enum: ["food", "beverage", "retail", "service", "other"],
            default: "retail",
            index: true,
        },
        category: { type: String, required: true, trim: true, index: true },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
            index: true,
        },
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            default: null,
            index: true,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        price: { type: Number, required: true, min: 0 },
        taxRate: { type: Number, default: 0 },
        gstRate: { type: Number, default: 0 },
        hsn: { type: String, trim: true },
        trackStock: { type: Boolean, default: true },
        stockQty: { type: Number, default: 0, min: 0 },
        unit: { type: String, default: "pcs" },
        image: { type: String },
        publicId: { type: String },
        isActive: { type: Boolean, default: true, index: true },
        isDeleted: { type: Boolean, default: false, index: true },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
