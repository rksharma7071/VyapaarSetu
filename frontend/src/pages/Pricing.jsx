import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import { useNavigate } from "react-router-dom";

function Pricing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleSubscribe = async () => {
        if (!user?.storeId) return alert("Store not linked to account");
        try {
            setLoading(true);
            const res = await axios.post(
                `${API_URL}/store/${user.storeId}/subscribe`,
                { months: 1 },
            );
            const updated = {
                ...user,
                subscriptionActive: true,
            };
            localStorage.setItem("user", JSON.stringify(updated));
            navigate("/");
        } catch (error) {
            alert("Subscription activation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh w-full bg-gray-50 flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-xl border border-gray-200 p-8 shadow">
                <div className="text-2xl font-semibold mb-2">Subscription</div>
                <div className="text-gray-600 mb-6">
                    Your store needs an active monthly subscription to access the
                    POS.
                </div>
                <div className="rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="text-sm text-gray-500 mb-2">Plan</div>
                    <div className="text-3xl font-semibold">₹21</div>
                    <div className="text-sm text-gray-500">per month</div>
                </div>
                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                    {loading ? "Activating..." : "Pay ₹21 / month"}
                </button>
            </div>
        </div>
    );
}

export default Pricing;
