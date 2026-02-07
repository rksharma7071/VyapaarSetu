import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/razorpay.controller.js";
import authMiddleware from "../middlewares/authentication.js";


const router = express.Router();

router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify-payment", authMiddleware, verifyRazorpayPayment);

export default router;
