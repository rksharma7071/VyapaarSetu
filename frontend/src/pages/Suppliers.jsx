import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

function Suppliers() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        gstin: "",
        phone: "",
        email: "",
        state: "",
    });

    const load = async () => {
        const res = await axios.get(
            `${API_URL}/supplier${storeId ? `?storeId=${storeId}` : ""}`,
        );
        setItems(res.data.data || []);
    };

    useEffect(() => {
        load();
    }, [storeId]);

    const create = async () => {
        if (!form.name) return alert("Supplier name required");
        await axios.post(`${API_URL}/supplier`, {
            ...form,
            storeId,
        });
        setForm({ name: "", gstin: "", phone: "", email: "", state: "" });
        load();
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Suppliers</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Input
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Supplier name"
                    />
                    <Input
                        value={form.gstin}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, gstin: e.target.value }))
                        }
                        placeholder="GSTIN"
                    />
                    <Input
                        value={form.phone}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="Phone"
                    />
                    <Input
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="Email"
                    />
                    <Input
                        value={form.state}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, state: e.target.value }))
                        }
                        placeholder="State"
                    />
                    <button
                        onClick={create}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                    >
                        Add Supplier
                    </button>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">GSTIN</th>
                            <th className="text-left px-4 py-3">Phone</th>
                            <th className="text-left px-4 py-3">State</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((s) => (
                            <tr key={s._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{s.name}</td>
                                <td className="px-4 py-3">{s.gstin || "-"}</td>
                                <td className="px-4 py-3">{s.phone || "-"}</td>
                                <td className="px-4 py-3">{s.state || "-"}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No suppliers
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Suppliers;
