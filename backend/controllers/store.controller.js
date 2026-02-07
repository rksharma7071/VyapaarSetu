import Store from "../models/store.model.js";

export async function getStores(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        const stores = await Store.find({ _id: storeId }).sort({ createdAt: -1 });
        res.json({ success: true, data: stores });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stores" });
    }
}

export async function getStoreById(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        if (String(req.params.id) !== String(storeId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const store = await Store.findById(req.params.id);
        if (!store) return res.status(404).json({ message: "Store not found" });
        res.json({ success: true, data: store });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch store" });
    }
}

export async function createStore(req, res) {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        if (req.user?.storeId) {
            return res.status(400).json({ message: "Store already linked" });
        }
        const store = await Store.create(req.body);
        res.status(201).json({ success: true, data: store });
    } catch (error) {
        res.status(500).json({ message: "Failed to create store" });
    }
}

export async function updateStore(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        if (String(req.params.id) !== String(storeId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!store) return res.status(404).json({ message: "Store not found" });
        res.json({ success: true, data: store });
    } catch (error) {
        res.status(500).json({ message: "Failed to update store" });
    }
}

export async function deleteStore(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        if (String(req.params.id) !== String(storeId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) return res.status(404).json({ message: "Store not found" });
        res.json({ success: true, message: "Store deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete store" });
    }
}

export async function activateSubscription(req, res) {
    try {
        const storeId = req.user?.storeId;
        if (!storeId) return res.status(403).json({ message: "Store not linked" });
        if (String(req.params.id) !== String(storeId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const { months = 1 } = req.body || {};
        const store = await Store.findById(id);
        if (!store) return res.status(404).json({ message: "Store not found" });

        const now = new Date();
        const base =
            store.subscriptionEnd && store.subscriptionEnd > now
                ? store.subscriptionEnd
                : now;
        const end = new Date(base);
        end.setMonth(end.getMonth() + Number(months || 1));

        store.subscriptionStatus = "active";
        store.subscriptionEnd = end;
        await store.save();

        res.json({
            success: true,
            data: {
                storeId: store._id,
                subscriptionStatus: store.subscriptionStatus,
                subscriptionEnd: store.subscriptionEnd,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to activate subscription" });
    }
}
