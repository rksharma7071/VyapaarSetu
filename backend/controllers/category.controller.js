import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { logActivity } from "../utils/activityLog.js";

export async function getCategories(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const query = { storeId };
        const categories = await Category.find(query).sort({ name: 1 });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories" });
    }
}

export async function getCategoryById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const category = await Category.findOne({ _id: req.params.id, storeId });
        if (!category) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch category" });
    }
}

export async function createCategory(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const category = await Category.create({ ...req.body, storeId });
        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "create",
            entityType: "category",
            entityId: category._id,
            message: `Category created: ${category.name}`,
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category" });
    }
}

export async function updateCategory(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const existing = await Category.findOne({ _id: req.params.id, storeId });
        if (!existing) return res.status(404).json({ message: "Not found" });

        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, storeId },
            req.body,
            { new: true },
        );
        if (!category) return res.status(404).json({ message: "Not found" });

        if (existing.name !== category.name) {
            await Product.updateMany(
                { storeId, categoryId: category._id },
                { $set: { category: category.name } },
            );
        }
        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "update",
            entityType: "category",
            entityId: category._id,
            message: `Category updated: ${category.name}`,
        });
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ message: "Failed to update category" });
    }
}

export async function deleteCategory(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const category = await Category.findOne({ _id: req.params.id, storeId });
        if (!category) return res.status(404).json({ message: "Not found" });

        let uncategorized = await Category.findOne({
            storeId,
            name: "Uncategorized",
        });
        if (!uncategorized) {
            uncategorized = await Category.create({
                name: "Uncategorized",
                slug: "uncategorized",
                storeId,
            });
        }

        await Product.updateMany(
            { storeId, categoryId: category._id },
            { $set: { categoryId: uncategorized._id, category: uncategorized.name } },
        );

        await Category.findOneAndDelete({ _id: req.params.id, storeId });
        await logActivity({
            storeId,
            userId: req.user?.id,
            action: "delete",
            entityType: "category",
            entityId: category._id,
            message: `Category deleted: ${category.name}`,
        });
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete category" });
    }
}
