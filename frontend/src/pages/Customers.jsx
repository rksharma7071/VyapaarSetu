import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

function Customers() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/customer`).then((res) => {
            setItems(res.data.data || []);
        });
    }, []);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Customers</div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Phone</th>
                            <th className="text-left px-4 py-3">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c._id} className="border-t border-gray-200">
                                <td className="px-4 py-3">{c.name}</td>
                                <td className="px-4 py-3">{c.phone}</td>
                                <td className="px-4 py-3">{c.email || "-"}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={3}>
                                    No customers
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Customers;
