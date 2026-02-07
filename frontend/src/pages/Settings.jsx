import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

function Settings() {
    const [stores, setStores] = useState([]);
    const [form, setForm] = useState({
        name: "",
        code: "",
        gstin: "",
        state: "",
        city: "",
    });

    const load = async () => {
        const res = await axios.get(`${API_URL}/store`);
        setStores(res.data.data || []);
    };

    useEffect(() => {
        load();
    }, []);

    const create = async () => {
        if (!form.name || !form.code) return alert("Name and code required");
        await axios.post(`${API_URL}/store`, form);
        setForm({ name: "", code: "", gstin: "", state: "", city: "" });
        load();
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Settings</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="font-semibold">Stores</div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                    <Input
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Store name"
                    />
                    <Input
                        value={form.code}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, code: e.target.value }))
                        }
                        placeholder="Code"
                    />
                    <Input
                        value={form.gstin}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, gstin: e.target.value }))
                        }
                        placeholder="GSTIN"
                    />
                    <Input
                        value={form.state}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, state: e.target.value }))
                        }
                        placeholder="State"
                    />
                    <Input
                        value={form.city}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, city: e.target.value }))
                        }
                        placeholder="City"
                    />
                </div>
                <button
                    onClick={create}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    Add Store
                </button>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Code</th>
                            <th className="text-left px-4 py-3">GSTIN</th>
                            <th className="text-left px-4 py-3">State</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((s) => (
                            <tr key={s._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{s.name}</td>
                                <td className="px-4 py-3">{s.code}</td>
                                <td className="px-4 py-3">{s.gstin || "-"}</td>
                                <td className="px-4 py-3">{s.state || "-"}</td>
                            </tr>
                        ))}
                        {!stores.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No stores
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Settings;
