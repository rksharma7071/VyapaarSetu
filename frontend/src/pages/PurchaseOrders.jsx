import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function PurchaseOrders() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [supplierId, setSupplierId] = useState("");
    const [items, setItems] = useState([
        { productId: "", qtyOrdered: 1, costPrice: 0, taxRate: 0 },
    ]);
    const { notify } = useAlert();

    const load = async () => {
        const [poRes, supRes, prodRes] = await Promise.all([
            axios.get(
                `${API_URL}/purchase-order${storeId ? `?storeId=${storeId}` : ""}`,
            ),
            axios.get(
                `${API_URL}/supplier${storeId ? `?storeId=${storeId}` : ""}`,
            ),
            axios.get(
                `${API_URL}/product${storeId ? `?storeId=${storeId}` : ""}`,
            ),
        ]);
        setOrders(poRes.data.data || []);
        setSuppliers(supRes.data.data || []);
        setProducts(prodRes.data.data?.products || []);
    };

    useEffect(() => {
        load();
    }, [storeId]);

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            { productId: "", qtyOrdered: 1, costPrice: 0, taxRate: 0 },
        ]);
    };

    const updateItem = (idx, key, value) => {
        setItems((prev) =>
            prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
        );
    };

    const create = async () => {
        if (!supplierId) {
            notify({
                type: "warning",
                title: "Supplier required",
                message: "Select a supplier.",
            });
            return;
        }
        if (!items.length || items.some((i) => !i.productId)) {
            notify({
                type: "warning",
                title: "Products required",
                message: "Add products to create a purchase order.",
            });
            return;
        }

        const subtotal = items.reduce(
            (sum, i) => sum + Number(i.qtyOrdered) * Number(i.costPrice),
            0,
        );
        const taxTotal = items.reduce(
            (sum, i) =>
                sum + (Number(i.qtyOrdered) * Number(i.costPrice) * Number(i.taxRate || 0)) / 100,
            0,
        );
        const grandTotal = subtotal + taxTotal;

        try {
            await axios.post(`${API_URL}/purchase-order`, {
                storeId,
                supplierId,
                items,
                subtotal,
                taxTotal,
                discountTotal: 0,
                grandTotal,
            });
            setSupplierId("");
            setItems([{ productId: "", qtyOrdered: 1, costPrice: 0, taxRate: 0 }]);
            notify({
                type: "success",
                title: "Purchase order created",
                message: "Purchase order created successfully.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Create failed",
                message: error.response?.data?.message || "Failed to create purchase order.",
            });
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Purchase Orders</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex gap-3">
                    <select
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Select supplier</option>
                        {suppliers.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={addItem}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm size-10"
                    >
                        +
                    </button>
                    <button
                        onClick={create}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                    >
                        Create
                    </button>
                </div>
                {items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-3">
                        <select
                            value={item.productId}
                            onChange={(e) =>
                                updateItem(idx, "productId", e.target.value)
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
                            value={item.qtyOrdered}
                            onChange={(e) =>
                                updateItem(idx, "qtyOrdered", e.target.value)
                            }
                            placeholder="Qty"
                        />
                        <Input
                            type="number"
                            value={item.costPrice}
                            onChange={(e) =>
                                updateItem(idx, "costPrice", e.target.value)
                            }
                            placeholder="Cost"
                        />
                        <Input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) =>
                                updateItem(idx, "taxRate", e.target.value)
                            }
                            placeholder="Tax %"
                        />
                    </div>
                ))}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">PO</th>
                            <th className="text-left px-4 py-3">Supplier</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((po) => (
                            <tr key={po._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{po.poNumber}</td>
                                <td className="px-4 py-3">{po.supplierId?.name || "-"}</td>
                                <td className="px-4 py-3">{po.status}</td>
                                <td className="px-4 py-3">₹{po.grandTotal}</td>
                            </tr>
                        ))}
                        {!orders.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No purchase orders
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PurchaseOrders;
