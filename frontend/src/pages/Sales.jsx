import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";

function Sales() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/order`).then((res) => {
            const data = res.data.data || res.data;
            const filtered = storeId
                ? data.filter((o) => o.storeId === storeId)
                : data;
            setOrders(filtered);
        });
    }, [storeId]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Sales</div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Order</th>
                            <th className="text-left px-4 py-3">Customer</th>
                            <th className="text-left px-4 py-3">Total</th>
                            <th className="text-left px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{o.orderNumber}</td>
                                <td className="px-4 py-3">
                                    {o.customer?.name || "-"}
                                </td>
                                <td className="px-4 py-3">₹{o.total}</td>
                                <td className="px-4 py-3">{o.status}</td>
                            </tr>
                        ))}
                        {!orders.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No sales yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Sales;
