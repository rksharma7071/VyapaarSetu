import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createUser: { type: Boolean, default: false },
    updateUser: { type: Boolean, default: false },
    deleteUser: { type: Boolean, default: false },
    readUser: { type: Boolean, default: false },
    createProduct: { type: Boolean, default: false },
    updateProduct: { type: Boolean, default: false },
    deleteProduct: { type: Boolean, default: false },
    readProduct: { type: Boolean, default: false },
    createOrder: { type: Boolean, default: false },
    updateOrder: { type: Boolean, default: false },
    deleteOrder: { type: Boolean, default: false },
    readOrder: { type: Boolean, default: false },
    createCustomer: { type: Boolean, default: false },
    updateCustomer: { type: Boolean, default: false },
    deleteCustomer: { type: Boolean, default: false },
    readCustomer: { type: Boolean, default: false },
    createInventory: { type: Boolean, default: false },
    updateInventory: { type: Boolean, default: false },
    deleteInventory: { type: Boolean, default: false },
    readInventory: { type: Boolean, default: false },
    createDiscount: { type: Boolean, default: false },
    updateDiscount: { type: Boolean, default: false },
    deleteDiscount: { type: Boolean, default: false },
    readDiscount: { type: Boolean, default: false },
    createSupplier: { type: Boolean, default: false },
    updateSupplier: { type: Boolean, default: false },
    deleteSupplier: { type: Boolean, default: false },
    readSupplier: { type: Boolean, default: false },
    createPurchaseOrder: { type: Boolean, default: false },
    updatePurchaseOrder: { type: Boolean, default: false },
    deletePurchaseOrder: { type: Boolean, default: false },
    readPurchaseOrder: { type: Boolean, default: false },
    readReport: { type: Boolean, default: false },
    readInvoice: { type: Boolean, default: false },
    createReturn: { type: Boolean, default: false },
    readReturn: { type: Boolean, default: false },
    readPayment: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String },
        role: { type: String, default: "customer" },
        isActive: { type: Boolean, default: true },
        sessionId: { type: String, default: "" },
        storeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Store" }],
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            default: null,
        },
        otp: { type: String, default: false },
        otpExpiry: { type: Date, default: null },
        otpVerifiedAt: { type: Date, default: null },
    },
    { timestamps: true },
);

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const Permission = mongoose.model("Permission", permissionSchema);
const User = mongoose.model("User", userSchema);
const Address = mongoose.model("Address", addressSchema);

export { User, Permission, Address };
