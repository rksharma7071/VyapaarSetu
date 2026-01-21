import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductBySlug,
} from "../controllers/product.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router
    .route("/")
    .get(getAllProducts)
    .post(upload.single("image"), createProduct);

router
    .route("/:slug")
    .get(getProductBySlug)
    .patch(upload.single("image"), updateProduct)
    .delete(deleteProduct);

export default router;
