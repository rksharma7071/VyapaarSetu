import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Counter from "../models/counter.model.js";

async function getAllOrder(req, res) {
    try {
        const orders = await Order.find({})
            .populate("customerId", "name email")
            .populate("items.productId", "name price")
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

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const order = await Order.findById(id)
            .populate("customerId", "name email")
            .populate("items.productId", "name price");

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

async function createOrder(req, res) {
    try {
        const {
            customerId,
            items,
            tax = 0,
            discount = 0,
            paymentMethod,
            notes,
        } = req.body;

        if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: "POS order must have at least one item",
            });
        }

        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            const qty = item.qty || 1;

            if (product.stockQty < qty) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            const unitPrice = product.price;
            const totalPrice = qty * unitPrice;

            subtotal += totalPrice;

            product.stockQty -= qty;
            await product.save();

            orderItems.push({
                productId: product._id,
                name: product.name,
                qty,
                unitPrice,
                totalPrice,
            });
        }

        const total = subtotal + Number(tax) - Number(discount);

        const counter = await Counter.findOneAndUpdate(
            { name: "pos_order" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );

        const order = await Order.create({
            orderNumber: counter.seq.toString(),
            customerId,
            items: orderItems,
            subtotal,
            tax,
            discount,
            total,
            paymentMethod,
            paymentStatus: "paid",
            status: "completed",
            notes,
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
            message: "Internal Server Error",
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

        const order = await Order.findById(id).session(session);
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
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stockQty: item.qty } },
                    { session },
                );
            }
        }

        // ✅ Update order fields
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (paymentMethod) order.paymentMethod = paymentMethod;
        if (notes !== undefined) order.notes = notes;

        await order.save({ session });
        await session.commitTransaction();

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

        const order = await Order.findById(id).session(session);

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
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stockQty: item.qty } },
                { session },
            );
        }

        order.status = "cancelled";
        order.paymentStatus = "unpaid";

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

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
