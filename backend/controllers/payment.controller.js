import Order from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import mongoose from "mongoose";

async function getAllPayment(req, res) {
    const storeId = req.user?.storeId;
    if (!storeId) {
        return res.status(403).json({ message: "Store not linked" });
    }
    const payments = await Payment.find({ storeId });
    return res.json(payments || []);
}

async function getPaymentById(req, res) {
    const storeId = req.user?.storeId;
    if (!storeId) {
        return res.status(403).json({ message: "Store not linked" });
    }
    const cart = await Payment.findOne({ _id: req.params.id, storeId });
    return res.json(cart);
}

async function createPayment(req, res) {
    try {
        const { orderId, provider, status, amount, transactionId, currency } =
            req.body;

        if (
            !orderId ||
            !provider ||
            !status ||
            !amount ||
            !currency
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingOrder = await Order.findById(orderId);

        if (!existingOrder) {
            return res.status(404).json({ message: "Order does not exist" });
        }
        const storeId = existingOrder.storeId;

        const payment = await Payment.create({
            orderId,
            storeId,
            provider,
            status,
            amount,
            transactionId: transactionId || null,
            currency,
        });

        return res.status(201).json({
            message: "Payment successfully created",
            payment,
        });
    } catch (error) {
        console.error("Create Payment Error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

async function deletePayment(req, res) {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json("Invalid Order Id");
        }
        const storeId = req.user?.storeId;
        if (!storeId) {
            return res.status(403).json({ message: "Store not linked" });
        }
        const payment = await Payment.findOne({ _id: id, storeId });
        if (!payment) {
            return res.status(404).json("Payment not found.");
        }
        await Payment.findOneAndDelete({ _id: id, storeId });
        return res.status(200).json({
            status: "success",
            message: "Payment deleted successfully.",
        });
    } catch (error) {
        console.log("Delete payment error:", error);
        return res.status(500).json("Internal Server Error.");
    }
}

export { getAllPayment, getPaymentById, createPayment, deletePayment };
