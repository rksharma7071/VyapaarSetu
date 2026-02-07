import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";

function LowStocks() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!storeId) return;
        axios
            .get(`${API_URL}/inventory/low-stock?storeId=${storeId}`)
            .then((res) => setItems(res.data.data || []));
    }, [storeId]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Low Stocks</div>
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
                        {items.map((i) => (
                            <tr key={i._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{i.productId?.name}</td>
                                <td className="px-4 py-3">{i.stockQty}</td>
                                <td className="px-4 py-3">{i.reorderLevel}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={3}>
                                    No low stock items
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LowStocks;
