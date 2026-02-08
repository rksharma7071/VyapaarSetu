import ActivityLog from "../models/activityLog.model.js";
import { User } from "../models/user.model.js";

export async function logActivity({
    storeId,
    userId,
    action,
    entityType,
    entityId,
    message,
    meta = {},
}) {
    try {
        if (!storeId || !action || !entityType || !message) return;

        let actorName = meta.actorName;
        let actorRole = meta.actorRole;

        if (userId && (!actorName || !actorRole)) {
            const user = await User.findById(userId).select("name role").lean();
            actorName = actorName || user?.name || "";
            actorRole = actorRole || user?.role || "";
        }

        await ActivityLog.create({
            storeId,
            userId: userId || null,
            actorName: actorName || "System",
            actorRole: actorRole || "system",
            action,
            entityType,
            entityId: entityId || null,
            message,
            meta,
        });
    } catch (error) {
        console.error("Activity log error:", error);
    }
}
