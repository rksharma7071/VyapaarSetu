import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../store/ordersSlice";
import { LuArrowLeft } from "react-icons/lu";
import axios from "axios";
import Textarea from "../components/UI/Textarea";
import { openInvoiceWindow } from "../utils/invoice";
import { useAlert } from "../components/UI/AlertProvider";

function OrderById() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const stores = useSelector((state) => state.stores.items);
    const store = useMemo(
        () => stores.find((s) => s._id === storeId),
        [stores, storeId],
    );

    const { selectedOrder, loading, error } = useSelector(
        (state) => state.orders
    );
    const [showReturn, setShowReturn] = useState(false);
    const [refundMethod, setRefundMethod] = useState("cash");
    const [returnNotes, setReturnNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [permission, setPermission] = useState(null);
    const { notify } = useAlert();

    const refundAmount = useMemo(() => {
        if (!selectedOrder?.items?.length) return 0;
        return selectedOrder.items.reduce(
            (sum, item) => sum + Number(item.totalPrice || 0),
            0,
        );
    }, [selectedOrder]);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user?.id) return;
        if (user?.role === "admin") return setPermission({ admin: true });
        axios
            .get(`${import.meta.env.VITE_API_URL}/user/permission/${user.id}`)
            .then((res) => setPermission(res.data || {}))
            .catch(() => setPermission({}));
    }, []);

    if (loading) {
        return null;
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600">
                ⚠️ {error}
            </div>
        );
    }

    if (!selectedOrder) return null;

    const canReturn =
        selectedOrder?.status !== "refunded" &&
        (permission?.admin || permission?.createReturn);
    const canPrintInvoice = permission?.admin || permission?.readInvoice;

    const handleReturnOrder = async () => {
        if (!window.confirm("Confirm return for this order?")) return;
        try {
            setSubmitting(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/return`, {
                orderId: selectedOrder._id,
                items: selectedOrder.items.map((item) => ({
                    productId: item.productId?._id || item.productId,
                    name: item.name,
                    qty: Number(item.qty || 0),
                    unitPrice: Number(item.unitPrice || 0),
                    taxableValue: Number(item.totalPrice || 0),
                    cgst: Number(item.cgst || 0),
                    sgst: Number(item.sgst || 0),
                    igst: Number(item.igst || 0),
                    total: Number(item.totalPrice || 0),
                })),
                refundMethod,
                refundAmount,
                notes: returnNotes,
            });
            notify({
                type: "success",
                title: "Return processed",
                message: "Return processed successfully.",
            });
            setShowReturn(false);
            setReturnNotes("");
            navigate("/returns");
        } catch (err) {
            notify({
                type: "error",
                title: "Return failed",
                message: err.response?.data?.message || "Failed to process return.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrintInvoice = async () => {
        try {
            setInvoiceLoading(true);
            const orderId = selectedOrder._id;
            let invoice = null;

            try {
                const invRes = await axios.get(
                    `${import.meta.env.VITE_API_URL}/invoice?storeId=${storeId}`,
                );
                const list = invRes.data.data || [];
                invoice = list.find((i) => {
                    const invOrderId =
                        i.orderId?._id || i.orderId?.id || i.orderId;
                    return String(invOrderId) === String(orderId);
                });
            } catch {
                invoice = null;
            }

            if (!invoice) {
                const createRes = await axios.post(
                    `${import.meta.env.VITE_API_URL}/invoice`,
                    { orderId },
                );
                invoice = createRes.data.data || createRes.data;
            }

            openInvoiceWindow({
                invoice,
                store,
                orderNumber: selectedOrder.orderNumber,
            });
        } catch (err) {
            notify({
                type: "error",
                title: "Invoice failed",
                message: err.response?.data?.message || "Failed to generate invoice.",
            });
        } finally {
            setInvoiceLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100"
                    >
                        <LuArrowLeft />
                    </button>
                    <h1 className="text-xl font-semibold">
                        Order #{selectedOrder.orderNumber}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {canPrintInvoice && (
                        <button
                            onClick={handlePrintInvoice}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                            disabled={invoiceLoading}
                        >
                            {invoiceLoading ? "Preparing..." : "Print Invoice"}
                        </button>
                    )}
                    {canReturn && (
                        <button
                            onClick={() => setShowReturn((v) => !v)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm"
                        >
                            Return Order
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Payment</p>
                        <p className="font-medium capitalize">
                            {selectedOrder.paymentMethod}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium capitalize">
                            {selectedOrder.status}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold">₹{selectedOrder.total}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {showReturn && canReturn && (
                <div className="bg-white rounded-lg border border-gray-300 p-4 space-y-3">
                    <div className="font-semibold">Return Confirmation</div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600">Refund Method</label>
                            <select
                                value={refundMethod}
                                onChange={(e) => setRefundMethod(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                                <option value="razorpay">Razorpay</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-600">Refund Amount</label>
                            <div className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                                ₹{refundAmount}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">Notes</label>
                        <Textarea
                            value={returnNotes}
                            onChange={(e) => setReturnNotes(e.target.value)}
                            placeholder="Reason for return (optional)"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowReturn(false)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReturnOrder}
                            disabled={submitting}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            {submitting ? "Processing..." : "Confirm Return"}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Item</th>
                            <th className="px-4 py-2 text-center">Qty</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {selectedOrder.items.map((item) => (
                            <tr key={item.productId?._id || item.productId}>
                                <td className="px-4 py-2">
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
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    {item.qty}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    ₹{item.unitPrice}
                                </td>
                                <td className="px-4 py-2 text-right font-medium">
                                    ₹{item.totalPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderById;
