import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";

function Reports() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [summary, setSummary] = useState(null);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        if (!storeId) return;
        axios
            .get(`${API_URL}/report/sales-summary?storeId=${storeId}`)
            .then((res) => {
                setSummary(res.data.data.summary);
                setTopProducts(res.data.data.topProducts || []);
            });
    }, [storeId]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Reports</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 border-gray-300">
                    <div className="text-sm text-gray-500">Total Sales</div>
                    <div className="text-xl font-semibold">
                        ₹{summary?.totalSales || 0}
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 border-gray-300">
                    <div className="text-sm text-gray-500">Orders</div>
                    <div className="text-xl font-semibold">
                        {summary?.totalOrders || 0}
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 border-gray-300">
                    <div className="text-sm text-gray-500">Tax</div>
                    <div className="text-xl font-semibold">
                        ₹{summary?.totalTax || 0}
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 border-gray-300">
                    <div className="text-sm text-gray-500">Discount</div>
                    <div className="text-xl font-semibold">
                        ₹{summary?.totalDiscount || 0}
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="px-4 py-3 font-semibold">Top Products</div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Product</th>
                            <th className="text-left px-4 py-3">Qty</th>
                            <th className="text-left px-4 py-3">Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts.map((p) => (
                            <tr key={p._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{p.name}</td>
                                <td className="px-4 py-3">{p.qty}</td>
                                <td className="px-4 py-3">₹{p.sales}</td>
                            </tr>
                        ))}
                        {!topProducts.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={3}>
                                    No data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reports;
