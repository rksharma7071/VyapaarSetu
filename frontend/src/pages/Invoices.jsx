import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";

function Invoices() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
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
                            <tr key={inv._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{inv.invoiceNumber}</td>
                                <td className="px-4 py-3">{inv.orderId}</td>
                                <td className="px-4 py-3">
                                    {inv.customer?.name || "-"}
                                </td>
                                <td className="px-4 py-3">₹{inv.grandTotal}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            const win = window.open("", "_blank");
                                            if (!win) return;
                                            win.document.write(`
                                                <html>
                                                <head><title>Invoice ${inv.invoiceNumber}</title></head>
                                                <body>
                                                    <h2>Invoice ${inv.invoiceNumber}</h2>
                                                    <p>Customer: ${inv.customer?.name || "-"}</p>
                                                    <p>Total: ₹${inv.grandTotal}</p>
                                                    <hr />
                                                    <table border="1" cellpadding="6" cellspacing="0">
                                                        <thead>
                                                            <tr>
                                                                <th>Item</th>
                                                                <th>Qty</th>
                                                                <th>Price</th>
                                                                <th>Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${(inv.items || [])
                                                                .map(
                                                                    (it) =>
                                                                        `<tr>
                                                                            <td>${it.name}</td>
                                                                            <td>${it.qty}</td>
                                                                            <td>₹${it.unitPrice}</td>
                                                                            <td>₹${it.total}</td>
                                                                        </tr>`,
                                                                )
                                                                .join("")}
                                                        </tbody>
                                                    </table>
                                                </body>
                                                </html>
                                            `);
                                            win.document.close();
                                            win.print();
                                        }}
                                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs"
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
