import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";

function StoreSetup() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    const [form, setForm] = useState({
        name: "",
        code: "",
        state: "",
        city: "",
        gstin: "",
    });
    const [loading, setLoading] = useState(false);

    if (!token || !user) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                <div>Please login first.</div>
            </div>
        );
    }
    if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.code) {
            alert("Store name and code are required");
            return;
        }
        try {
            setLoading(true);
            const storeRes = await axios.post(`${API_URL}/store`, form);
            const storeId = storeRes.data?.data?._id;
            if (!storeId) throw new Error("Store creation failed");

            await axios.patch(`${API_URL}/user/${user.id}`, { storeId });

            const updatedUser = { ...user, storeId, subscriptionActive: false };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            navigate("/pricing");
        } catch (error) {
            alert("Store setup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh w-full bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-xl border border-gray-200 p-8 shadow">
                <div className="text-2xl font-semibold mb-2">Create Store</div>
                <div className="text-gray-600 mb-6">
                    Add your store details to continue.
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Store name"
                    />
                    <Input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="Store code"
                    />
                    <Input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="State"
                    />
                    <Input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City"
                    />
                    <Input
                        name="gstin"
                        value={form.gstin}
                        onChange={handleChange}
                        placeholder="GSTIN (optional)"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
                    >
                        {loading ? "Saving..." : "Continue to Pricing"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default StoreSetup;
