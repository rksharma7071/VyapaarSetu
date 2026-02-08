import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
    {
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
        actorName: { type: String, default: "" },
        actorRole: { type: String, default: "" },
        action: { type: String, required: true },
        entityType: { type: String, required: true },
        entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
        message: { type: String, required: true },
        meta: { type: Object, default: {} },
    },
    { timestamps: true },
);

activityLogSchema.index({ storeId: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
