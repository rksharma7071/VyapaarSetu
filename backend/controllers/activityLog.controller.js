import ActivityLog from "../models/activityLog.model.js";

export async function getActivityLog(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }

        const limit = Math.min(parseInt(req.query.limit || "200", 10), 500);
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const skip = (page - 1) * limit;
        const { from, to } = req.query;

        const query = { storeId };
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const [items, total] = await Promise.all([
            ActivityLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            ActivityLog.countDocuments(query),
        ]);

        return res.status(200).json({
            success: true,
            data: items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch activity log" });
    }
}
