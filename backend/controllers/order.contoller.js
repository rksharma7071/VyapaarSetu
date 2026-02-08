import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Counter from "../models/counter.model.js";
import Store from "../models/store.model.js";
import { decrementInventoryWithBatches, incrementInventory } from "../utils/inventory.js";
import Invoice from "../models/invoice.model.js";
import Customer from "../models/customer.model.js";
import { logActivity } from "../utils/activityLog.js";
import Inventory from "../models/inventory.model.js";
import { Payment } from "../models/payment.model.js";

async function getAllOrder(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        const orders = await Order.find({ storeId })
            .populate("customerId", "name email")
            .populate("items.productId", "name price image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await Order.findOne({ _id: id, storeId })
            .populate("customerId", "name email")
            .populate("items.productId", "name price image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Get order error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const round2 = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

async function createOrder(req, res) {
    try {
        const {
            customerId,
            customer,
            items,
            tax = 0,
            discount = 0,
            paymentMethod,
            notes,
        } = req.body;
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }

        if (!storeId || !mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid store ID",
            });
        }

        if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        if (customerId) {
            const customerDoc = await Customer.findOne({
                _id: customerId,
                storeId,
            });
            if (!customerDoc) {
                return res.status(400).json({
                    success: false,
                    message: "Customer does not belong to this store",
                });
            }
        }

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "POS order must have at least one item",
            });
        }

        const store = await Store.findById(storeId);
        const storeState = store?.state || "";
        const storeDefaultTaxRate = Number(store?.defaultTaxRate || 0);
        const customerState = customer?.state || "";
        const isInterstate =
            storeState && customerState
                ? storeState.toLowerCase() !== customerState.toLowerCase()
                : false;

        let subtotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;
        let igstTotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findOne({
                _id: item.productId,
                storeId,
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            const qty = item.qty || 1;

            const inventoryItem = await Inventory.findOne({
                storeId,
                productId: product._id,
            }).lean();
            const availableQty = inventoryItem?.stockQty ?? product.stockQty ?? 0;

            if (availableQty < qty) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            const unitPrice = round2(product.price);
            const totalPrice = round2(qty * unitPrice);

            subtotal = round2(subtotal + totalPrice);

            try {
                await decrementInventoryWithBatches(storeId, product._id, qty);
            } catch (err) {
                return res.status(400).json({
                    success: false,
                    message: err?.message || `Insufficient stock for ${product.name}`,
                });
            }

            let cgst = 0;
            let sgst = 0;
            let igst = 0;
            const gstRate = Number(
                product.gstRate ||
                product.taxRate ||
                storeDefaultTaxRate ||
                0,
            );
            if (gstRate > 0) {
                if (isInterstate) {
                    igst = round2((totalPrice * gstRate) / 100);
                } else {
                    cgst = round2((totalPrice * gstRate) / 200);
                    sgst = round2((totalPrice * gstRate) / 200);
                }
            }
            cgstTotal = round2(cgstTotal + cgst);
            sgstTotal = round2(sgstTotal + sgst);
            igstTotal = round2(igstTotal + igst);

            orderItems.push({
                productId: product._id,
                name: product.name,
                qty,
                unitPrice,
                totalPrice,
                hsn: product.hsn,
                gstRate,
                cgst,
                sgst,
                igst,
            });
        }

        const taxTotal = round2(cgstTotal + sgstTotal + igstTotal);
        const total = round2(subtotal + taxTotal - Number(discount));

        const counter = await Counter.findOneAndUpdate(
            { name: "pos_order", storeId },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );

        const order = await Order.create({
            orderNumber: counter.seq.toString(),
            storeId,
            customerId,
            customer,
            items: orderItems,
            subtotal,
            tax: taxTotal,
            discount,
            total,
            cgstTotal,
            sgstTotal,
            igstTotal,
            paymentMethod,
            paymentStatus: paymentMethod === "razorpay" ? "unpaid" : "paid",
            status: "completed",
            notes,
        });

        if (paymentMethod !== "razorpay") {
            const payment = await Payment.create({
                orderId: order._id,
                storeId: order.storeId,
                provider: paymentMethod,
                status: "paid",
                amount: total,
                currency: "INR",
                mode: "offline",
            });
            order.paymentRecordId = payment._id;
            order.paymentMode = "offline";
            order.paymentDetails = {
                provider: paymentMethod,
                status: "paid",
            };
            await order.save();
        }

        const existingInvoice = await Invoice.findOne({ orderId: order._id });
        if (!existingInvoice) {
            const invoiceNumber = await Counter.findOneAndUpdate(
                { name: "invoice", storeId },
                { $inc: { seq: 1 } },
                { new: true, upsert: true },
            );

            await Invoice.create({
                invoiceNumber: `INV-${invoiceNumber.seq}`,
                orderId: order._id,
                storeId,
                customer,
                items: orderItems.map((i) => ({
                    productId: i.productId,
                    name: i.name,
                    hsn: i.hsn,
                    qty: i.qty,
                    unitPrice: i.unitPrice,
                    discount: 0,
                    taxableValue: i.totalPrice,
                    gstRate: i.gstRate,
                    cgst: i.cgst,
                    sgst: i.sgst,
                    igst: i.igst,
                    total: i.totalPrice + i.cgst + i.sgst + i.igst,
                })),
                subtotal,
                discountTotal: discount,
                taxableTotal: subtotal,
                cgstTotal,
                sgstTotal,
                igstTotal,
                grandTotal: total,
            });
        }

        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "create",
            entityType: "order",
            entityId: order._id,
            message: `New order created: ${order.orderNumber}`,
            meta: { total },
        });

        return res.status(201).json({
            success: true,
            message: "POS order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Create POS order error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal Server Error",
        });
    }
}

async function updateOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        const order = await Order.findOne({ _id: id, storeId }).session(session);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const { status, paymentStatus, paymentMethod, notes } = req.body;

        const prevStatus = order.status;

        // ❌ Invalid transitions
        if (status === "cancelled" && prevStatus === "refunded") {
            return res.status(400).json({
                success: false,
                message: "Refunded orders cannot be cancelled",
            });
        }

        if (status === "refunded" && prevStatus === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled orders cannot be refunded",
            });
        }

        /**
         * 🔄 RESTORE STOCK
         * Only when:
         * completed → cancelled
         * completed → refunded
         */
        const shouldRestoreStock =
            (status === "cancelled" || status === "refunded") &&
            prevStatus === "completed";

        if (shouldRestoreStock) {
            for (const item of order.items) {
                await incrementInventory(order.storeId, item.productId, item.qty);
            }
        }

        // ✅ Update order fields
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (paymentMethod) order.paymentMethod = paymentMethod;
        if (notes !== undefined) order.notes = notes;

        await order.save({ session });
        await session.commitTransaction();

        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "update",
            entityType: "order",
            entityId: order._id,
            message: `Order updated: ${order.orderNumber}`,
            meta: { status: order.status, paymentStatus: order.paymentStatus },
        });

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Update POS order error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    } finally {
        session.endSession();
    }
}

async function deleteOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        const order = await Order.findOne({ _id: id, storeId }).session(session);

        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.status === "refunded") {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Refunded orders cannot be cancelled",
            });
        }

        for (const item of order.items) {
            await incrementInventory(order.storeId, item.productId, item.qty);
        }

        order.status = "cancelled";
        order.paymentStatus = "unpaid";

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "update",
            entityType: "order",
            entityId: order._id,
            message: `Order cancelled: ${order.orderNumber}`,
            meta: { status: order.status, paymentStatus: order.paymentStatus },
        });

        return res.status(200).json({
            success: true,
            message: "Order cancelled and stock restored successfully",
            data: order,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Delete POS order error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export { getAllOrder, getOrderById, createOrder, updateOrder, deleteOrder };
