import Inventory from "../models/inventory.model.js";
import InventoryBatch from "../models/inventoryBatch.model.js";
import StockAdjustment from "../models/stockAdjustment.model.js";
import { ensureInventoryItem, incrementInventory } from "../utils/inventory.js";

export async function getInventory(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const { productId } = req.query;
        const query = { storeId };
        if (productId) query.productId = productId;
        const items = await Inventory.find(query)
            .populate("productId", "name sku price gstRate hsn")
            .sort({ updatedAt: -1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch inventory" });
    }
}

export async function upsertInventory(req, res) {
    try {
        const { productId, reorderLevel, minStock, maxStock } =
            req.body;
        const storeId = req.user?.storeId;
        if (!storeId || !productId) {
            return res
                .status(400)
                .json({ message: "productId is required" });
        }
        const item = await ensureInventoryItem(storeId, productId);
        if (reorderLevel !== undefined) item.reorderLevel = reorderLevel;
        if (minStock !== undefined) item.minStock = minStock;
        if (maxStock !== undefined) item.maxStock = maxStock;
        await item.save();
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ message: "Failed to update inventory" });
    }
}

export async function getBatches(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const { productId } = req.query;
        const query = { storeId };
        if (productId) query.productId = productId;
        const batches = await InventoryBatch.find(query)
            .populate("productId", "name sku")
            .sort({ expiryDate: 1, createdAt: 1 });
        res.json({ success: true, data: batches });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch batches" });
    }
}

export async function createBatch(req, res) {
    try {
        const {
            productId,
            supplierId,
            batchNo,
            expiryDate,
            qty,
            costPrice,
            mrp,
        } = req.body;
        const storeId = req.user?.storeId;

        if (!storeId || !productId || !batchNo || qty === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const batch = await InventoryBatch.create({
            storeId,
            productId,
            supplierId,
            batchNo,
            expiryDate,
            qty,
            costPrice,
            mrp,
        });

        await incrementInventory(storeId, productId, Number(qty));

        res.status(201).json({ success: true, data: batch });
    } catch (error) {
        res.status(500).json({ message: "Failed to create batch" });
    }
}

export async function createStockAdjustment(req, res) {
    try {
        const { productId, batchId, qtyChange, reason, notes } =
            req.body;
        const storeId = req.user?.storeId;
        if (!storeId || !productId || qtyChange === undefined) {
            return res
                .status(400)
                .json({ message: "Missing required fields" });
        }

        if (batchId) {
            const batch = await InventoryBatch.findById(batchId);
            if (!batch)
                return res.status(404).json({ message: "Batch not found" });
            batch.qty = Math.max(0, batch.qty + Number(qtyChange));
            await batch.save();
        }

        await incrementInventory(storeId, productId, Number(qtyChange));

        const adjustment = await StockAdjustment.create({
            storeId,
            productId,
            batchId: batchId || null,
            qtyChange,
            reason,
            notes,
        });

        res.status(201).json({ success: true, data: adjustment });
    } catch (error) {
        res.status(500).json({ message: "Failed to adjust stock" });
    }
}

export async function getLowStock(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId)
            return res.status(403).json({ message: "Store not linked" });

        const items = await Inventory.find({
            storeId,
            $expr: { $lte: ["$stockQty", "$reorderLevel"] },
        }).populate("productId", "name sku");
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch low stock" });
    }
}

export async function getExpiredStock(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId)
            return res.status(403).json({ message: "Store not linked" });

        const today = new Date();
        const batches = await InventoryBatch.find({
            storeId,
            expiryDate: { $lte: today },
            qty: { $gt: 0 },
        }).populate("productId", "name sku");

        res.json({ success: true, data: batches });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expired stock" });
    }
}
