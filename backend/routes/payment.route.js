import express from "express";
import {
    createPayment,
    deletePayment,
    getAllPayment,
    getPaymentById,
} from "../controllers/payment.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readPayment"), getAllPayment)
    .post(authMiddleware, authorizePermission("readPayment"), createPayment);

router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readPayment"), getPaymentById)
    .delete(authMiddleware, authorizePermission("readPayment"), deletePayment);

export default router;
