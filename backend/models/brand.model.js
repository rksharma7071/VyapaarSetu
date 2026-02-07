import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true, index: true },
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

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
