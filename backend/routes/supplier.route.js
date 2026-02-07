import express from "express";
import {
    createSupplier,
    deleteSupplier,
    getSupplierById,
    getSuppliers,
    updateSupplier,
} from "../controllers/supplier.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readSupplier"), getSuppliers)
    .post(authMiddleware, authorizePermission("createSupplier"), createSupplier);
router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readSupplier"), getSupplierById)
    .patch(authMiddleware, authorizePermission("updateSupplier"), updateSupplier)
    .delete(authMiddleware, authorizePermission("deleteSupplier"), deleteSupplier);

export default router;
