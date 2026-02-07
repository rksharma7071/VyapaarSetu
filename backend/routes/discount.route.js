import express from "express";
import {
    applyDiscount,
    createDiscount,
    deleteDiscount,
    getAllDiscount,
    getDiscountById,
    updateDiscount,
} from "../controllers/discount.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readDiscount"), getAllDiscount)
    .post(authMiddleware, authorizePermission("createDiscount"), createDiscount);

router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readDiscount"), getDiscountById)
    .patch(authMiddleware, authorizePermission("updateDiscount"), updateDiscount)
    .delete(authMiddleware, authorizePermission("deleteDiscount"), deleteDiscount);

router.post("/apply", authMiddleware, authorizePermission("readDiscount"), applyDiscount);

export default router;
