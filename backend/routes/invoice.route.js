import express from "express";
import {
    createInvoiceFromOrder,
    getInvoiceById,
    getInvoices,
} from "../controllers/invoice.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readInvoice"), getInvoices)
    .post(authMiddleware, authorizePermission("readInvoice"), createInvoiceFromOrder);
router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readInvoice"), getInvoiceById);

export default router;
