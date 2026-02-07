import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, index: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        gstin: { type: String, trim: true },
        address: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: { type: String, trim: true },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
            index: true,
        },
        notes: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

customerSchema.index({ storeId: 1, phone: 1 }, { unique: true });
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
