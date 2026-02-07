import mongoose from "mongoose";
import PurchaseOrder from "../models/purchaseOrder.model.js";
import Counter from "../models/counter.model.js";
import InventoryBatch from "../models/inventoryBatch.model.js";
import { incrementInventory } from "../utils/inventory.js";
import Supplier from "../models/supplier.model.js";

async function nextPoNumber() {
    const counter = await Counter.findOneAndUpdate(
        { name: "purchase_order" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
    );
    return `PO-${counter.seq}`;
}

export async function getPurchaseOrders(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const query = { storeId };
        const pos = await PurchaseOrder.find(query)
            .populate("supplierId", "name")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: pos });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch purchase orders" });
    }
}

export async function getPurchaseOrderById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const po = await PurchaseOrder.findOne({
            _id: req.params.id,
            storeId,
        }).populate(
            "supplierId",
            "name",
        );
        if (!po) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: po });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch purchase order" });
    }
}

export async function createPurchaseOrder(req, res) {
    try {
        const {
            supplierId,
            items,
            expectedAt,
            notes,
            subtotal,
            taxTotal,
            discountTotal,
            grandTotal,
        } = req.body;
        const storeId = req.user?.storeId;

        if (!storeId || !supplierId || !items?.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const supplier = await Supplier.findOne({ _id: supplierId, storeId });
        if (!supplier) {
            return res.status(400).json({ message: "Supplier not found" });
        }

        const poNumber = await nextPoNumber();
        const po = await PurchaseOrder.create({
            poNumber,
            storeId,
            supplierId,
            items,
            expectedAt,
            notes,
            subtotal,
            taxTotal,
            discountTotal,
            grandTotal,
            status: "ordered",
        });

        res.status(201).json({ success: true, data: po });
    } catch (error) {
        res.status(500).json({ message: "Failed to create purchase order" });
    }
}

export async function updatePurchaseOrder(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const po = await PurchaseOrder.findOneAndUpdate(
            { _id: req.params.id, storeId },
            req.body,
            { new: true },
        );
        if (!po) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: po });
    } catch (error) {
        res.status(500).json({ message: "Failed to update purchase order" });
    }
}

export async function receivePurchaseOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { batches } = req.body;
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const po = await PurchaseOrder.findOne({ _id: id, storeId }).session(session);
        if (!po) return res.status(404).json({ message: "Not found" });
        if (!batches?.length)
            return res.status(400).json({ message: "No batches provided" });

        for (const batch of batches) {
            const {
                productId,
                batchNo,
                expiryDate,
                qtyReceived,
                costPrice,
                mrp,
            } = batch;

            if (!productId || !batchNo || !qtyReceived) {
                continue;
            }

            await InventoryBatch.create(
                [
                    {
                        storeId: po.storeId,
                        productId,
                        supplierId: po.supplierId,
                        batchNo,
                        expiryDate,
                        qty: qtyReceived,
                        costPrice,
                        mrp,
                    },
                ],
                { session },
            );

            await incrementInventory(po.storeId, productId, Number(qtyReceived));

            const item = po.items.find(
                (i) => String(i.productId) === String(productId),
            );
            if (item) {
                item.qtyReceived = Math.min(
                    item.qtyOrdered,
                    item.qtyReceived + Number(qtyReceived),
                );
            }
        }

        const allReceived = po.items.every(
            (i) => i.qtyReceived >= i.qtyOrdered,
        );
        po.status = allReceived ? "received" : "partial";
        po.receivedAt = new Date();

        await po.save({ session });
        await session.commitTransaction();

        res.json({ success: true, data: po });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Failed to receive purchase order" });
    } finally {
        session.endSession();
    }
}
