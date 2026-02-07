import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true, index: true },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
