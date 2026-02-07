import express from "express";
import {
    createBrand,
    deleteBrand,
    getBrandById,
    getBrands,
    updateBrand,
} from "../controllers/brand.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readProduct"), getBrands)
    .post(authMiddleware, authorizePermission("createProduct"), createBrand);
router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readProduct"), getBrandById)
    .patch(authMiddleware, authorizePermission("updateProduct"), updateBrand)
    .delete(authMiddleware, authorizePermission("deleteProduct"), deleteBrand);

export default router;
