import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function ManageStock() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [batch, setBatch] = useState({
        productId: "",
        batchNo: "",
        expiryDate: "",
        qty: 0,
    });
    const [adjustment, setAdjustment] = useState({
        productId: "",
        qtyChange: 0,
        reason: "audit",
    });
    const [permission, setPermission] = useState(null);
    const [selectedInventory, setSelectedInventory] = useState([]);
    const [bulkAdjust, setBulkAdjust] = useState({
        qtyChange: 0,
        reason: "audit",
    });
    const { notify } = useAlert();

    const load = async () => {
        const [invRes, prodRes] = await Promise.all([
            axios.get(`${API_URL}/inventory?storeId=${storeId}`),
            axios.get(`${API_URL}/product?storeId=${storeId}`),
        ]);
        setInventory(invRes.data.data || []);
        setProducts(prodRes.data.data?.products || []);
    };

    useEffect(() => {
        if (storeId) load();
    }, [storeId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) return;
        if (user?.role === "admin") return setPermission({ admin: true });
        axios
            .get(`${API_URL}/user/permission/${user.id}`)
            .then((res) => setPermission(res.data || {}))
            .catch(() => setPermission({}));
    }, []);

    const addBatch = async () => {
        if (!batch.productId || !batch.batchNo || !batch.qty) {
            notify({
                type: "warning",
                title: "Missing details",
                message: "Fill batch details.",
            });
            return;
        }
        try {
            await axios.post(`${API_URL}/inventory/batches`, {
                storeId,
                ...batch,
            });
            setBatch({ productId: "", batchNo: "", expiryDate: "", qty: 0 });
            notify({
                type: "success",
                title: "Batch added",
                message: "Inventory batch created successfully.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Add batch failed",
                message: error.response?.data?.message || "Failed to add batch.",
            });
        }
    };

    const addAdjustment = async () => {
        if (!adjustment.productId || !adjustment.qtyChange) {
            notify({
                type: "warning",
                title: "Missing details",
                message: "Fill adjustment details.",
            });
            return;
        }
        try {
            await axios.post(`${API_URL}/inventory/adjustments`, {
                storeId,
                ...adjustment,
            });
            setAdjustment({ productId: "", qtyChange: 0, reason: "audit" });
            notify({
                type: "success",
                title: "Adjustment saved",
                message: "Stock adjustment recorded.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Adjustment failed",
                message: error.response?.data?.message || "Failed to adjust stock.",
            });
        }
    };

    const canAdjust = permission?.admin || permission?.updateInventory;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedInventory(inventory.map((i) => i.productId?._id).filter(Boolean));
        } else {
            setSelectedInventory([]);
        }
    };

    const handleSelectOne = (productId) => {
        setSelectedInventory((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId],
        );
    };

    const handleBulkAdjust = async () => {
        if (!canAdjust) {
            notify({
                type: "warning",
                title: "Permission denied",
                message: "You don’t have access to adjust stock.",
            });
            return;
        }
        if (!selectedInventory.length) return;
        if (!bulkAdjust.qtyChange) {
            notify({
                type: "warning",
                title: "Quantity required",
                message: "Qty change required.",
            });
            return;
        }
        try {
            await Promise.all(
                selectedInventory.map((productId) =>
                    axios.post(`${API_URL}/inventory/adjustments`, {
                        storeId,
                        productId,
                        qtyChange: bulkAdjust.qtyChange,
                        reason: bulkAdjust.reason,
                    }),
                ),
            );
            setSelectedInventory([]);
            setBulkAdjust({ qtyChange: 0, reason: "audit" });
            notify({
                type: "success",
                title: "Bulk adjustment complete",
                message: "Stock updated for selected items.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Bulk adjustment failed",
                message:
                    error.response?.data?.message ||
                    "Failed to update stock in bulk.",
            });
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Manage Stock</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="font-semibold">Add Batch</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <select
                        value={batch.productId}
                        onChange={(e) =>
                            setBatch((b) => ({ ...b, productId: e.target.value }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Select product</option>
                        {products.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <Input
                        value={batch.batchNo}
                        onChange={(e) =>
                            setBatch((b) => ({ ...b, batchNo: e.target.value }))
                        }
                        placeholder="Batch No"
                    />
                    <Input
                        type="date"
                        value={batch.expiryDate}
                        onChange={(e) =>
                            setBatch((b) => ({
                                ...b,
                                expiryDate: e.target.value,
                            }))
                        }
                    />
                    <Input
                        type="number"
                        value={batch.qty}
                        onChange={(e) =>
                            setBatch((b) => ({ ...b, qty: e.target.value }))
                        }
                        placeholder="Qty"
                    />
                </div>
                <button
                    onClick={addBatch}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    Add Batch
                </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="font-semibold">Stock Adjustment</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <select
                        value={adjustment.productId}
                        onChange={(e) =>
                            setAdjustment((a) => ({
                                ...a,
                                productId: e.target.value,
                            }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Select product</option>
                        {products.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <Input
                        type="number"
                        value={adjustment.qtyChange}
                        onChange={(e) =>
                            setAdjustment((a) => ({
                                ...a,
                                qtyChange: e.target.value,
                            }))
                        }
                        placeholder="Qty Change"
                    />
                    <select
                        value={adjustment.reason}
                        onChange={(e) =>
                            setAdjustment((a) => ({
                                ...a,
                                reason: e.target.value,
                            }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="audit">Audit</option>
                        <option value="damage">Damage</option>
                        <option value="expiry">Expiry</option>
                        <option value="theft">Theft</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <button
                    onClick={addAdjustment}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    Apply Adjustment
                </button>
            </div>

            {canAdjust && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                    <div className="font-semibold">Bulk Stock Adjustment</div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                            type="number"
                            value={bulkAdjust.qtyChange}
                            onChange={(e) =>
                                setBulkAdjust((b) => ({
                                    ...b,
                                    qtyChange: e.target.value,
                                }))
                            }
                            placeholder="Qty Change"
                        />
                        <select
                            value={bulkAdjust.reason}
                            onChange={(e) =>
                                setBulkAdjust((b) => ({
                                    ...b,
                                    reason: e.target.value,
                                }))
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="audit">Audit</option>
                            <option value="damage">Damage</option>
                            <option value="expiry">Expiry</option>
                            <option value="theft">Theft</option>
                            <option value="other">Other</option>
                        </select>
                        <button
                            onClick={handleBulkAdjust}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            Apply to Selected
                        </button>
                    </div>
                    <div className="text-xs text-gray-500">
                        Selected: {selectedInventory.length}
                    </div>
                </div>
            )}

            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={
                                        inventory.length > 0 &&
                                        selectedInventory.length ===
                                            inventory
                                                .map((i) => i.productId?._id)
                                                .filter(Boolean).length
                                    }
                                />
                            </th>
                            <th className="text-left px-4 py-3">Product</th>
                            <th className="text-left px-4 py-3">Stock</th>
                            <th className="text-left px-4 py-3">Reorder Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((i) => (
                            <tr key={i._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedInventory.includes(
                                            i.productId?._id,
                                        )}
                                        onChange={() =>
                                            handleSelectOne(i.productId?._id)
                                        }
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {i.productId?.image ? (
                                            <img
                                                src={i.productId.image}
                                                alt={i.productId?.name || "Product"}
                                                className="h-10 w-10 rounded-lg border border-gray-300 object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-xs font-semibold text-gray-500">
                                                {i.productId?.name?.[0] || "P"}
                                            </div>
                                        )}
                                        <span>{i.productId?.name || "-"}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{i.stockQty}</td>
                                <td className="px-4 py-3">{i.reorderLevel}</td>
                            </tr>
                        ))}
                        {!inventory.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No inventory
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageStock;
