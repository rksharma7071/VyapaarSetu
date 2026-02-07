import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductBySlug,
} from "../controllers/product.controller.js";
import upload from "../config/multer.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readProduct"), getAllProducts)
    .post(
        authMiddleware,
        authorizePermission("createProduct"),
        upload.single("image"),
        createProduct,
    );

router
    .route("/:slug")
    .get(authMiddleware, authorizePermission("readProduct"), getProductBySlug)
    .patch(
        authMiddleware,
        authorizePermission("updateProduct"),
        upload.single("image"),
        updateProduct,
    )
    .delete(authMiddleware, authorizePermission("deleteProduct"), deleteProduct);

export default router;
