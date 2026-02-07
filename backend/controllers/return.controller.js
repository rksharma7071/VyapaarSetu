import Return from "../models/return.model.js";
import Order from "../models/order.model.js";
import InventoryBatch from "../models/inventoryBatch.model.js";
import { incrementInventory } from "../utils/inventory.js";

export async function getReturns(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const query = { storeId };
        const returns = await Return.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: returns });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch returns" });
    }
}

export async function createReturn(req, res) {
    try {
        const { orderId, items, refundMethod, refundAmount, notes } = req.body;
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const order = await Order.findOne({ _id: orderId, storeId });
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (!items?.length)
            return res.status(400).json({ message: "No items provided" });

        const ret = await Return.create({
            orderId,
            storeId: order.storeId,
            items,
            refundMethod,
            refundAmount,
            notes,
            status: "completed",
        });

        for (const item of items) {
            const qty = Number(item.qty || 0);
            if (qty <= 0) continue;
            await incrementInventory(order.storeId, item.productId, qty);
            await InventoryBatch.create({
                storeId: order.storeId,
                productId: item.productId,
                batchNo: `RETURN-${ret._id}`,
                qty,
                expiryDate: null,
                costPrice: 0,
                mrp: item.unitPrice || 0,
            });
        }

        res.status(201).json({ success: true, data: ret });
    } catch (error) {
        res.status(500).json({ message: "Failed to create return" });
    }
}
