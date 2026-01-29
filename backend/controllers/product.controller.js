import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find({})
                .select(
                    "_id slug name sku description type category price taxRate trackStock stockQty unit image isActive",
                )
                .lean()
                .skip(skip)
                .limit(limit)
                .exec(),
            Product.countDocuments({}),
        ]);

        return res.status(200).json({
            success: true,
            data: {
                products,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while fetching products",
        });
    }
};

export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({ slug });
        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server error while fetching product",
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {
            slug,
            name,
            sku,
            description,
            type,
            category,
            price,
            taxRate,
            trackStock,
            stockQty,
            unit,
            isActive,
        } = req.body;

        if (!slug || !name || !category || !price) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: slug, name, category and price are required.",
            });
        }

        const parsedPrice = Number(price);
        const parsedTaxRate = Number(taxRate ?? 0);
        const parsedStockQty = Number(stockQty ?? 0);

        // ✅ Image already uploaded by Multer
        const image = req.file ? req.file.path : null; // Cloudinary URL
        const publicId = req.file ? req.file.filename : null; // Cloudinary public_id

        const product = await Product.create({
            slug,
            name,
            sku,
            description,
            type,
            category,
            price: isNaN(parsedPrice) ? 0 : parsedPrice,
            taxRate: isNaN(parsedTaxRate) ? 0 : parsedTaxRate,
            trackStock: trackStock ?? true,
            stockQty: isNaN(parsedStockQty) ? 0 : parsedStockQty,
            unit,
            image,
            publicId,
            isActive: isActive ?? true,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error("Create Product error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;

        const {
            name,
            sku,
            description,
            type,
            category,
            price,
            taxRate,
            trackStock,
            stockQty,
            unit,
            isActive,
            newSlug,
        } = req.body;

        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // 🔁 Slug update with uniqueness check
        if (newSlug && newSlug !== slug) {
            const slugExists = await Product.findOne({ slug: newSlug });
            if (slugExists) {
                return res.status(400).json({
                    success: false,
                    message: "Slug already exists",
                });
            }
            product.slug = newSlug;
        }

        // 🔢 Parse numeric fields
        const parsedPrice = price !== undefined ? Number(price) : product.price;

        const parsedTaxRate =
            taxRate !== undefined ? Number(taxRate) : product.taxRate;

        const parsedStockQty =
            stockQty !== undefined ? Number(stockQty) : product.stockQty;

        // 🖼️ Image update (CloudinaryStorage handles upload)
        if (req.file) {
            // Delete old image from Cloudinary
            if (product.publicId) {
                await cloudinary.uploader.destroy(product.publicId);
            }

            // Multer already uploaded the new image
            product.image = req.file.path; // secure_url
            product.publicId = req.file.filename; // public_id
        }

        // ✏️ Update fields (partial update)
        product.name = name ?? product.name;
        product.sku = sku ?? product.sku;
        product.description = description ?? product.description;
        product.type = type ?? product.type;
        product.category = category ?? product.category;
        product.price = isNaN(parsedPrice) ? product.price : parsedPrice;
        product.taxRate = isNaN(parsedTaxRate)
            ? product.taxRate
            : parsedTaxRate;
        product.trackStock =
            trackStock !== undefined ? trackStock : product.trackStock;
        product.stockQty = isNaN(parsedStockQty)
            ? product.stockQty
            : parsedStockQty;
        product.unit = unit ?? product.unit;
        product.isActive = isActive !== undefined ? isActive : product.isActive;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        console.error("Update Product error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const publicIds = [];

        if (product.publicId) {
            publicIds.push(product.publicId);
        }

        let cloudinaryResults = [];

        if (publicIds.length > 0) {
            cloudinaryResults = await Promise.all(
                publicIds.map((publicId) =>
                    cloudinary.uploader
                        .destroy(publicId, { invalidate: true })
                        .then((result) => ({
                            publicId,
                            status: "fulfilled",
                            result,
                        }))
                        .catch((error) => ({
                            publicId,
                            status: "rejected",
                            error: error?.message || String(error),
                        })),
                ),
            );
        }

        await Product.deleteOne({ slug });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            cloudinaryResults,
        });
    } catch (error) {
        console.error("Delete Product error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        });
    }
};
