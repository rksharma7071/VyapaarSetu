import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

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

    const addBatch = async () => {
        if (!batch.productId || !batch.batchNo || !batch.qty)
            return alert("Fill batch details");
        await axios.post(`${API_URL}/inventory/batches`, {
            storeId,
            ...batch,
        });
        setBatch({ productId: "", batchNo: "", expiryDate: "", qty: 0 });
        load();
    };

    const addAdjustment = async () => {
        if (!adjustment.productId || !adjustment.qtyChange)
            return alert("Fill adjustment details");
        await axios.post(`${API_URL}/inventory/adjustments`, {
            storeId,
            ...adjustment,
        });
        setAdjustment({ productId: "", qtyChange: 0, reason: "audit" });
        load();
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

            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Product</th>
                            <th className="text-left px-4 py-3">Stock</th>
                            <th className="text-left px-4 py-3">Reorder Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((i) => (
                            <tr key={i._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">
                                    {i.productId?.name || "-"}
                                </td>
                                <td className="px-4 py-3">{i.stockQty}</td>
                                <td className="px-4 py-3">{i.reorderLevel}</td>
                            </tr>
                        ))}
                        {!inventory.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={3}>
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
