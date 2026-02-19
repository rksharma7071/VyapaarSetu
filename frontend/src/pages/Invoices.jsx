import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import { openInvoiceWindow } from "../utils/invoice";

function Invoices() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const stores = useSelector((state) => state.stores.items);
    const store = useMemo(
        () => stores.find((s) => s._id === storeId),
        [stores, storeId],
    );
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_URL}/invoice${storeId ? `?storeId=${storeId}` : ""}`)
            .then((res) => setItems(res.data.data || []));
    }, [storeId]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Invoices</div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Invoice</th>
                            <th className="text-left px-4 py-3">Order</th>
                            <th className="text-left px-4 py-3">Customer</th>
                            <th className="text-left px-4 py-3">Total</th>
                            <th className="text-left px-4 py-3">PDF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((inv) => (
                            <tr key={inv._id} className="border-t border-gray-200">
                                <td className="px-4 py-3">{inv.invoiceNumber}</td>
                                <td className="px-4 py-3">
                                    {inv.orderId?.orderNumber || inv.orderId}
                                </td>
                                <td className="px-4 py-3">
                                    {inv.customer?.name || "-"}
                                </td>
                                <td className="px-4 py-3">₹{inv.grandTotal}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() =>
                                            openInvoiceWindow({
                                                invoice: inv,
                                                store,
                                                orderNumber:
                                                    inv.orderId?.orderNumber ||
                                                    inv.orderId,
                                            })
                                        }
                                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs"
                                    >
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No invoices
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Invoices;
