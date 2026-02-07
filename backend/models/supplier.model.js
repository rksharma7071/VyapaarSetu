import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        gstin: { type: String, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        addressLine1: { type: String, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, default: "India" },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            index: true,
            required: true,
        },
        isActive: { type: Boolean, default: true },
        notes: { type: String },
    },
    { timestamps: true },
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
