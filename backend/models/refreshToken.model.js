import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
        tokenHash: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        revokedAt: { type: Date, default: null },
        replacedByTokenHash: { type: String, default: null },
        createdByIp: { type: String, default: "" },
        revokedByIp: { type: String, default: "" },
    },
    { timestamps: true },
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
