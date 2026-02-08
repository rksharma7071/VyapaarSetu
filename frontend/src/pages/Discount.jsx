import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function Discount() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        discount_code: "",
        discount_type: "percentage",
        amount: 0,
        starts_at: "",
        ends_at: "",
        usage_limit: "",
        active: true,
    });
    const [editingId, setEditingId] = useState(null);
    const { notify } = useAlert();

    const load = async () => {
        const res = await axios.get(`${API_URL}/discount`);
        setItems(res.data || []);
    };

    useEffect(() => {
        load();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm({
            discount_code: "",
            discount_type: "percentage",
            amount: 0,
            starts_at: "",
            ends_at: "",
            usage_limit: "",
            active: true,
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.discount_code || form.amount === "" || form.amount === null) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "Code and amount are required.",
            });
            return;
        }

        const payload = {
            ...form,
            usage_limit:
                form.usage_limit === "" ? null : Number(form.usage_limit),
            amount: Number(form.amount),
        };

        try {
            if (editingId) {
                await axios.patch(`${API_URL}/discount/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/discount`, payload);
            }
            resetForm();
            notify({
                type: "success",
                title: editingId ? "Discount updated" : "Discount created",
                message: "Discount saved successfully.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Save failed",
                message: error.response?.data?.message || "Failed to save discount.",
            });
        }
    };

    const handleEdit = (d) => {
        setEditingId(d._id);
        setForm({
            discount_code: d.discount_code,
            discount_type: d.discount_type,
            amount: d.amount,
            starts_at: d.starts_at ? d.starts_at.slice(0, 10) : "",
            ends_at: d.ends_at ? d.ends_at.slice(0, 10) : "",
            usage_limit: d.usage_limit ?? "",
            active: !!d.active,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this discount?")) return;
        try {
            await axios.delete(`${API_URL}/discount/${id}`);
            notify({
                type: "success",
                title: "Discount deleted",
                message: "Discount deleted successfully.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Delete failed",
                message: error.response?.data?.message || "Failed to delete discount.",
            });
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Discounts</div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Input
                        name="discount_code"
                        value={form.discount_code}
                        onChange={handleChange}
                        placeholder="Code (e.g. SAVE10)"
                    />
                    <select
                        name="discount_type"
                        value={form.discount_type}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed_amount">Fixed Amount</option>
                    </select>
                    <Input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                    />
                    <Input
                        type="date"
                        name="starts_at"
                        value={form.starts_at}
                        onChange={handleChange}
                    />
                    <Input
                        type="date"
                        name="ends_at"
                        value={form.ends_at}
                        onChange={handleChange}
                    />
                    <Input
                        type="number"
                        name="usage_limit"
                        value={form.usage_limit}
                        onChange={handleChange}
                        placeholder="Usage Limit"
                    />
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={handleChange}
                        />
                        Active
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            {editingId ? "Update" : "Create"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Code</th>
                            <th className="text-left px-4 py-3">Type</th>
                            <th className="text-left px-4 py-3">Amount</th>
                            <th className="text-left px-4 py-3">Usage</th>
                            <th className="text-left px-4 py-3">Active</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((d) => (
                            <tr key={d._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{d.discount_code}</td>
                                <td className="px-4 py-3">{d.discount_type}</td>
                                <td className="px-4 py-3">
                                    {d.discount_type === "percentage"
                                        ? `${d.amount}%`
                                        : `₹${d.amount}`}
                                </td>
                                <td className="px-4 py-3">
                                    {d.used_count || 0}/{d.usage_limit ?? "∞"}
                                </td>
                                <td className="px-4 py-3">
                                    {d.active ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleEdit(d)}
                                        className="mr-2 rounded-lg border border-gray-300 px-3 py-1 text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(d._id)}
                                        className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={6}>
                                    No discounts yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Discount;
