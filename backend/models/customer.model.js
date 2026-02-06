import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, unique: true, index: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        notes: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true },
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
