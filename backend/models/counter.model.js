import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        default: null,
        index: true,
    },
    seq: { type: Number, default: 0 },
});

counterSchema.index({ name: 1, storeId: 1 }, { unique: true });

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
