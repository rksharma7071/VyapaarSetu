import express from "express";
import {
    createPurchaseOrder,
    getPurchaseOrderById,
    getPurchaseOrders,
    receivePurchaseOrder,
    updatePurchaseOrder,
} from "../controllers/purchaseOrder.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readPurchaseOrder"), getPurchaseOrders)
    .post(authMiddleware, authorizePermission("createPurchaseOrder"), createPurchaseOrder);
router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readPurchaseOrder"), getPurchaseOrderById)
    .patch(authMiddleware, authorizePermission("updatePurchaseOrder"), updatePurchaseOrder);
router
    .route("/:id/receive")
    .post(authMiddleware, authorizePermission("updatePurchaseOrder"), receivePurchaseOrder);

export default router;
