import mongoose from "mongoose";

const idempotencyKeySchema = new mongoose.Schema(
    {
        key: { type: String, required: true },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        method: { type: String, required: true },
        path: { type: String, required: true },
        responseStatus: { type: Number, default: 200 },
        responseBody: { type: Object, default: {} },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

idempotencyKeySchema.index({ key: 1, method: 1, path: 1, storeId: 1 }, { unique: true });

const IdempotencyKey = mongoose.model("IdempotencyKey", idempotencyKeySchema);

export default IdempotencyKey;
