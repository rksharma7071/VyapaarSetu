import Inventory from "../models/inventory.model.js";
import InventoryBatch from "../models/inventoryBatch.model.js";

export async function ensureInventoryItem(storeId, productId) {
    let item = await Inventory.findOne({ storeId, productId });
    if (!item) {
        item = await Inventory.create({ storeId, productId, stockQty: 0 });
    }
    return item;
}

export async function incrementInventory(storeId, productId, qty) {
    const item = await ensureInventoryItem(storeId, productId);
    item.stockQty = Math.max(0, item.stockQty + qty);
    await item.save();
    return item;
}

export async function decrementInventoryWithBatches(storeId, productId, qty) {
    if (qty <= 0) return;

    const batches = await InventoryBatch.find({
        storeId,
        productId,
        qty: { $gt: 0 },
        isActive: true,
    }).sort({ expiryDate: 1, createdAt: 1 });

    if (!batches.length) {
        const item = await ensureInventoryItem(storeId, productId);
        if (item.stockQty < qty) {
            throw new Error("Insufficient stock");
        }
        item.stockQty = Math.max(0, item.stockQty - qty);
        await item.save();
        return item;
    }

    let remaining = qty;
    for (const batch of batches) {
        if (remaining <= 0) break;
        const take = Math.min(batch.qty, remaining);
        batch.qty -= take;
        remaining -= take;
        await batch.save();
    }

    if (remaining > 0) {
        throw new Error("Insufficient batch stock");
    }

    const item = await ensureInventoryItem(storeId, productId);
    item.stockQty = Math.max(0, item.stockQty - qty);
    await item.save();
    return item;
}
