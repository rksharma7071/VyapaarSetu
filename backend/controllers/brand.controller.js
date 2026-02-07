import Brand from "../models/brand.model.js";

export async function getBrands(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const query = { storeId };
        const brands = await Brand.find(query).sort({ name: 1 });
        res.json({ success: true, data: brands });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brands" });
    }
}

export async function getBrandById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const brand = await Brand.findOne({ _id: req.params.id, storeId });
        if (!brand) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brand" });
    }
}

export async function createBrand(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const brand = await Brand.create({ ...req.body, storeId });
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ message: "Failed to create brand" });
    }
}

export async function updateBrand(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const brand = await Brand.findOneAndUpdate(
            { _id: req.params.id, storeId },
            req.body,
            { new: true },
        );
        if (!brand) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ message: "Failed to update brand" });
    }
}

export async function deleteBrand(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const brand = await Brand.findOneAndDelete({ _id: req.params.id, storeId });
        if (!brand) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, message: "Brand deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete brand" });
    }
}
