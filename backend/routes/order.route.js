import express from "express";
import {
    createOrder,
    deleteOrder,
    getAllOrder,
    getOrderById,
    updateOrder,
} from "../controllers/order.contoller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readOrder"), getAllOrder)
    .post(authMiddleware, authorizePermission("createOrder"), createOrder);

router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readOrder"), getOrderById)
    .patch(authMiddleware, authorizePermission("updateOrder"), updateOrder)
    .delete(authMiddleware, authorizePermission("deleteOrder"), deleteOrder);

export default router;
