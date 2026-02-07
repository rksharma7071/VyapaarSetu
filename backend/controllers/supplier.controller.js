import Supplier from "../models/supplier.model.js";

export async function getSuppliers(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const query = { storeId };
        const suppliers = await Supplier.find(query).sort({ name: 1 });
        res.json({ success: true, data: suppliers });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch suppliers" });
    }
}

export async function getSupplierById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const supplier = await Supplier.findOne({ _id: req.params.id, storeId });
        if (!supplier) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch supplier" });
    }
}

export async function createSupplier(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const supplier = await Supplier.create({ ...req.body, storeId });
        res.status(201).json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ message: "Failed to create supplier" });
    }
}

export async function updateSupplier(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const supplier = await Supplier.findOneAndUpdate(
            { _id: req.params.id, storeId },
            req.body,
            { new: true },
        );
        if (!supplier) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, data: supplier });
    } catch (error) {
        res.status(500).json({ message: "Failed to update supplier" });
    }
}

export async function deleteSupplier(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const supplier = await Supplier.findOneAndDelete({
            _id: req.params.id,
            storeId,
        });
        if (!supplier) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, message: "Supplier deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete supplier" });
    }
}
