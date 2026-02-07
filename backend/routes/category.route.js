import express from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoryById,
    updateCategory,
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readProduct"), getCategories)
    .post(authMiddleware, authorizePermission("createProduct"), createCategory);
router
    .route("/:id")
    .get(authMiddleware, authorizePermission("readProduct"), getCategoryById)
    .patch(authMiddleware, authorizePermission("updateProduct"), updateCategory)
    .delete(authMiddleware, authorizePermission("deleteProduct"), deleteCategory);

export default router;
