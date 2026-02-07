import mongoose from "mongoose";
import Order from "../models/order.model.js";

export async function getSalesSummary(req, res) {
    try {
        const { from, to } = req.query;
        const storeId = req.user?.storeId;
        if (!storeId)
            return res.status(403).json({ message: "Store not linked" });

        const fromDate = from ? new Date(from) : new Date(Date.now() - 7 * 864e5);
        const toDate = to ? new Date(to) : new Date();

        const match = {
            storeId: new mongoose.Types.ObjectId(storeId),
            createdAt: { $gte: fromDate, $lte: toDate },
            status: "completed",
        };

        const [summary] = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    totalTax: { $sum: "$tax" },
                    totalDiscount: { $sum: "$discount" },
                },
            },
        ]);

        const topProducts = await Order.aggregate([
            { $match: match },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    name: { $first: "$items.name" },
                    qty: { $sum: "$items.qty" },
                    sales: { $sum: "$items.totalPrice" },
                },
            },
            { $sort: { sales: -1 } },
            { $limit: 10 },
        ]);

        res.json({
            success: true,
            data: {
                summary: summary || {
                    totalSales: 0,
                    totalOrders: 0,
                    totalTax: 0,
                    totalDiscount: 0,
                },
                topProducts,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reports" });
    }
}
