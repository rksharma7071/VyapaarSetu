import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Input from "../UI/Input";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/order`);
            const data = res?.data?.data || [];
            setOrders(data);
            if (!selectedId && data.length) setSelectedId(data[0]._id);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return orders;
        return orders.filter((o) => {
            const name = o.customer?.name || o.customerId?.name || "";
            const phone = o.customer?.phone || o.customerId?.phone || "";
            const orderNo = o.orderNumber || "";
            return (
                String(orderNo).toLowerCase().includes(q) ||
                name.toLowerCase().includes(q) ||
                phone.toLowerCase().includes(q)
            );
        });
    }, [orders, search]);

    const selectedOrder = useMemo(
        () => filtered.find((o) => o._id === selectedId) || filtered[0],
        [filtered, selectedId],
    );

    useEffect(() => {
        if (selectedOrder?._id) setSelectedId(selectedOrder._id);
    }, [selectedOrder]);

    return (
        <div className="flex h-full flex-col gap-4">
            <div className="rounded-xl border border-gray-300 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-lg font-semibold">POS Orders</div>
                        <div className="text-xs text-gray-500">
                            Recent orders and special order details
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by order, customer, phone"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-72"
                        />
                        <button
                            onClick={load}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
                <div className="w-full lg:w-2/5 rounded-xl border border-gray-300 bg-white p-3 overflow-y-auto">
                    {filtered.length === 0 && (
                        <div className="p-4 text-sm text-gray-500">No orders found.</div>
                    )}
                    <div className="space-y-2">
                        {filtered.map((order) => (
                            <button
                                key={order._id}
                                onClick={() => setSelectedId(order._id)}
                                className={`w-full rounded-lg border px-3 py-3 text-left ${
                                    selectedId === order._id
                                        ? "border-primary bg-primary/10"
                                        : "border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <div className="font-semibold">
                                        Order #{order.orderNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                    {order.customer?.name || order.customerId?.name || "Walk-in"}
                                    {order.customer?.phone || order.customerId?.phone
                                        ? ` · ${order.customer?.phone || order.customerId?.phone}`
                                        : ""}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5">
                                        {order.status}
                                    </span>
                                    <span className="font-semibold text-primary">
                                        ₹{order.total}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-3/5 rounded-xl border border-gray-300 bg-white p-4 overflow-y-auto">
                    {!selectedOrder && (
                        <div className="text-sm text-gray-500">
                            Select an order to view details.
                        </div>
                    )}
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <div className="text-lg font-semibold">
                                        Order #{selectedOrder.orderNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs">
                                        {selectedOrder.paymentMethod || "-"}
                                    </span>
                                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs">
                                        {selectedOrder.paymentStatus || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="text-xs text-gray-500">Customer</div>
                                    <div className="text-sm font-medium">
                                        {selectedOrder.customer?.name || selectedOrder.customerId?.name || "Walk-in"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {selectedOrder.customer?.phone || selectedOrder.customerId?.phone || "-"}
                                    </div>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="text-xs text-gray-500">Status</div>
                                    <div className="text-sm font-medium capitalize">
                                        {selectedOrder.status}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Items: {selectedOrder.items?.length || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200">
                                <div className="border-b border-gray-200 px-3 py-2 text-sm font-semibold">
                                    Items
                                </div>
                                <div className="divide-y">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={`${item.productId?._id || item.productId}-${idx}`} className="flex items-center justify-between px-3 py-2 text-sm">
                                            <div className="flex items-center gap-3">
                                                {item.productId?.image ? (
                                                    <img
                                                        src={item.productId.image}
                                                        alt={item.name}
                                                        className="h-10 w-10 rounded-lg border border-gray-300 object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-xs font-semibold text-gray-500">
                                                        {item.name?.[0] || "P"}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm">₹{item.totalPrice ?? item.unitPrice * item.qty}</div>
                                                {item.gstRate ? (
                                                    <div className="text-xs text-gray-500">GST {item.gstRate}%</div>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-3">
                                <div className="text-sm font-semibold mb-2">Totals</div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span>₹{selectedOrder.discount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>CGST</span>
                                        <span>₹{selectedOrder.cgstTotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>SGST</span>
                                        <span>₹{selectedOrder.sgstTotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>IGST</span>
                                        <span>₹{selectedOrder.igstTotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.notes ? (
                                <div className="rounded-lg border border-gray-200 p-3">
                                    <div className="text-xs text-gray-500">Notes</div>
                                    <div className="text-sm">{selectedOrder.notes}</div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Orders;
