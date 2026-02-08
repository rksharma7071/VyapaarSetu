import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Order from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";

const getRazorpayMode = () => {
    const mode = process.env.RAZORPAY_MODE;
    if (mode === "test" || mode === "live") return mode;
    const keyId = process.env.RAZORPAY_KEY_ID || "";
    return keyId.startsWith("rzp_test") ? "test" : "live";
};

export async function createRazorpayOrder(req, res) {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys not configured" });
        }
        const { orderId } = req.body;
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });

        const order = await Order.findOne({ _id: orderId, storeId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const mode = getRazorpayMode();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.total * 100),
            currency: "INR",
            receipt: `ORD-${order.orderNumber}`,
            notes: { orderId: order._id.toString() },
        });

        let payment = await Payment.findOne({ orderId: order._id, storeId });
        if (!payment) {
            payment = await Payment.create({
                orderId: order._id,
                storeId: order.storeId,
                provider: "razorpay",
                status: "pending",
                amount: order.total,
                currency: "INR",
                gatewayOrderId: razorpayOrder.id,
                gatewayPayload: razorpayOrder,
                mode,
            });
        } else {
            payment.provider = "razorpay";
            payment.status = "pending";
            payment.amount = order.total;
            payment.currency = "INR";
            payment.gatewayOrderId = razorpayOrder.id;
            payment.gatewayPayload = razorpayOrder;
            payment.mode = mode;
            await payment.save();
        }

        order.paymentMethod = "razorpay";
        order.paymentStatus = "unpaid";
        order.paymentMode = mode;
        order.paymentRecordId = payment._id;
        order.paymentDetails = {
            razorpayOrderId: razorpayOrder.id,
            mode,
        };
        await order.save();

        res.json({ success: true, razorpayOrder });
    } catch (error) {
        console.error("Razorpay order error:", error);
        res.status(500).json({
            message: error?.message || "Failed to create Razorpay order",
        });
    }
}

export async function verifyRazorpayPayment(req, res) {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys not configured" });
        }
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature)
            return res
                .status(400)
                .json({ message: "Invalid payment signature" });

        const existingPayment = await Payment.findOne({
            transactionId: razorpay_payment_id,
        });

        if (existingPayment) {
            return res.json({
                success: true,
                message: "Payment already verified",
                payment: existingPayment,
            });
        }

        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const order = await Order.findOne({ _id: orderId, storeId });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const mode = getRazorpayMode();
        let payment = await Payment.findOne({ orderId: order._id, storeId });
        if (!payment) {
            payment = await Payment.create({
                orderId: order._id,
                storeId: order.storeId,
                provider: "razorpay",
                status: "paid",
                amount: order.total,
                transactionId: razorpay_payment_id,
                gatewayOrderId: razorpay_order_id,
                gatewaySignature: razorpay_signature,
                currency: "INR",
                mode,
            });
        } else {
            payment.status = "paid";
            payment.transactionId = razorpay_payment_id;
            payment.gatewayOrderId = razorpay_order_id;
            payment.gatewaySignature = razorpay_signature;
            payment.mode = mode;
            await payment.save();
        }

        // order.status = "fulfilled";
        order.paymentId = razorpay_payment_id;
        order.paymentStatus = "paid";
        order.paymentMethod = "razorpay";
        order.paymentMode = mode;
        order.paymentRecordId = payment._id;
        order.paymentDetails = {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            mode,
        };
        await order.save();

        res.json({ success: true, payment });
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({
            message: error?.message || "Payment verification failed",
        });
    }
}
