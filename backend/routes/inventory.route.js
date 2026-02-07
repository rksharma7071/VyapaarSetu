import express from "express";
import {
    createBatch,
    createStockAdjustment,
    getBatches,
    getExpiredStock,
    getInventory,
    getLowStock,
    upsertInventory,
} from "../controllers/inventory.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readInventory"), getInventory)
    .post(authMiddleware, authorizePermission("updateInventory"), upsertInventory);
router
    .route("/batches")
    .get(authMiddleware, authorizePermission("readInventory"), getBatches)
    .post(authMiddleware, authorizePermission("updateInventory"), createBatch);
router
    .route("/adjustments")
    .post(authMiddleware, authorizePermission("updateInventory"), createStockAdjustment);
router
    .route("/low-stock")
    .get(authMiddleware, authorizePermission("readInventory"), getLowStock);
router
    .route("/expired")
    .get(authMiddleware, authorizePermission("readInventory"), getExpiredStock);

export default router;
