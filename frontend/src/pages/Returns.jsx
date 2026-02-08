import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function Returns() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        orderId: "",
        productId: "",
        qty: 1,
        unitPrice: 0,
        refundMethod: "cash",
    });
    const { notify } = useAlert();

    const load = async () => {
        const [retRes, orderRes, prodRes] = await Promise.all([
            axios.get(
                `${API_URL}/return${storeId ? `?storeId=${storeId}` : ""}`,
            ),
            axios.get(`${API_URL}/order`),
            axios.get(`${API_URL}/product${storeId ? `?storeId=${storeId}` : ""}`),
        ]);
        setItems(retRes.data.data || []);
        setOrders(orderRes.data.data || orderRes.data || []);
        setProducts(prodRes.data.data?.products || []);
    };

    useEffect(() => {
        load();
    }, [storeId]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Returns</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="font-semibold">Create Return</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Order</label>
                        <select
                            value={form.orderId}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, orderId: e.target.value }))
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">Select order</option>
                            {orders.map((o) => (
                                <option key={o._id} value={o._id}>
                                    {o.orderNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Product</label>
                        <select
                            value={form.productId}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, productId: e.target.value }))
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
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Quantity</label>
                        <Input
                            type="text"
                            value={form.qty}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, qty: e.target.value }))
                            }
                            placeholder="Qty"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Unit Price</label>
                        <Input
                            type="text"
                            value={form.unitPrice}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    unitPrice: e.target.value,
                                }))
                            }
                            placeholder="Unit Price"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Refund Method</label>
                        <select
                            value={form.refundMethod}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    refundMethod: e.target.value,
                                }))
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="upi">UPI</option>
                            <option value="razorpay">Razorpay</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        if (!form.orderId || !form.productId) {
                            notify({
                                type: "warning",
                                title: "Missing fields",
                                message: "Order and product required.",
                            });
                            return;
                        }
                        const total = Number(form.qty) * Number(form.unitPrice);
                        try {
                            await axios.post(`${API_URL}/return`, {
                                orderId: form.orderId,
                                items: [
                                    {
                                        productId: form.productId,
                                        name:
                                            products.find((p) => p._id === form.productId)
                                                ?.name || "",
                                        qty: Number(form.qty),
                                        unitPrice: Number(form.unitPrice),
                                        taxableValue: total,
                                        cgst: 0,
                                        sgst: 0,
                                        igst: 0,
                                        total,
                                    },
                                ],
                                refundMethod: form.refundMethod,
                                refundAmount: total,
                            });
                            setForm({
                                orderId: "",
                                productId: "",
                                qty: 1,
                                unitPrice: 0,
                                refundMethod: "cash",
                            });
                            notify({
                                type: "success",
                                title: "Return processed",
                                message: "Return processed successfully.",
                            });
                            load();
                        } catch (error) {
                            notify({
                                type: "error",
                                title: "Return failed",
                                message:
                                    error.response?.data?.message ||
                                    "Failed to process return.",
                            });
                        }
                    }}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    Process Return
                </button>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Order</th>
                            <th className="text-left px-4 py-3">Refund</th>
                            <th className="text-left px-4 py-3">Method</th>
                            <th className="text-left px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((r) => (
                            <tr key={r._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{r.orderId}</td>
                                <td className="px-4 py-3">₹{r.refundAmount}</td>
                                <td className="px-4 py-3">{r.refundMethod}</td>
                                <td className="px-4 py-3">{r.status}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No returns
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Returns;
