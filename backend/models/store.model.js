import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        code: { type: String, required: true, unique: true, trim: true },
        gstin: { type: String, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        addressLine1: { type: String, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        country: { type: String, default: "India" },
        isActive: { type: Boolean, default: true },
        suspendedReason: { type: String, default: "" },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        timezone: { type: String, default: "Asia/Kolkata" },
        subscriptionStatus: {
            type: String,
            enum: ["active", "inactive", "cancelled"],
            default: "inactive",
        },
        subscriptionEnd: { type: Date, default: null },
        defaultTaxRate: { type: Number, default: 0, min: 0 },
    },
    { timestamps: true },
);

const Store = mongoose.model("Store", storeSchema);

export default Store;
