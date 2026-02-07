import React, { useEffect, useMemo, useState } from "react";
import { FaAngleUp, FaArrowUpRightDots } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalTax: 0,
        totalDiscount: 0,
    });
    const [orders, setOrders] = useState([]);
    const [store, setStore] = useState(null);

    useEffect(() => {
        if (!storeId) return;
        const load = async () => {
            const [reportRes, orderRes, storeRes] = await Promise.all([
                axios.get(`${API_URL}/report/sales-summary?storeId=${storeId}`),
                axios.get(`${API_URL}/order?storeId=${storeId}`),
                axios.get(`${API_URL}/store/${storeId}`),
            ]);
            setSummary(reportRes.data.data.summary);
            setOrders(orderRes.data.data || orderRes.data);
            setStore(storeRes.data.data);
        };
        load();
    }, [storeId]);

    const { labels, series } = useMemo(() => {
        const days = 30;
        const labelsArr = [];
        const totals = new Array(days).fill(0);
        const today = new Date();
        for (let i = days - 1; i >= 0; i -= 1) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            labelsArr.push(
                d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
            );
        }
        orders.forEach((o) => {
            const d = new Date(o.createdAt);
            const diff = Math.floor((today - d) / 86400000);
            const idx = days - 1 - diff;
            if (idx >= 0 && idx < days) {
                totals[idx] += Number(o.total || 0);
            }
        });
        return { labels: labelsArr, series: totals };
    }, [orders]);

    const data = {
        labels,
        datasets: [
            {
                label: "Sales (₹)",
                data: series,
                borderColor: "#0ea5e9",
                backgroundColor: "rgba(14,165,233,0.15)",
                tension: 0.35,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false,
        },

        plugins: {
            legend: {
                position: "top",
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    font: {
                        size: 12,
                        weight: "500",
                    },
                    color: "#374151", // gray-700
                },
            },

            tooltip: {
                backgroundColor: "#111827", // gray-900
                titleColor: "#ffffff",
                bodyColor: "#e5e7eb",
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context) =>
                        `₹${context.parsed.y.toLocaleString()}`,
                },
            },
        },

        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#6b7280", // gray-500
                    font: {
                        size: 12,
                    },
                },
            },

            y: {
                beginAtZero: true,
                grid: {
                    color: "#e5e7eb", // gray-200
                    drawBorder: false,
                },
                ticks: {
                    color: "#6b7280",
                    font: {
                        size: 12,
                    },
                    callback: (value) =>
                        value >= 1000
                            ? `₹${value / 1000}k`
                            : `₹${value}`,
                },
            },
        },
    };

    return (
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 sm:px-8 sm:py-6 custom-scrollbar">
            <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="text-sm text-gray-500">Store</div>
                    <div className="text-xl font-semibold text-gray-900">
                        {store?.name || "Select a store"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {store?.city || ""} {store?.state ? `• ${store.state}` : ""}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-2">
                            ₹{summary.totalSales?.toLocaleString() || 0}
                        </h2>
                        <div className="flex items-center gap-2 mt-3 text-sm">
                            <FaAngleUp className="text-green-500" />
                            <span className="text-green-600 font-semibold">Live</span>
                            <span className="text-gray-500">updated today</span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <FaArrowUpRightDots className="text-3xl mb-2 text-sky-600" />
                        <h2 className="text-2xl font-bold">{summary.totalOrders}</h2>
                        <p className="text-sm text-gray-500 mt-1">Orders</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <GiTakeMyMoney className="text-3xl mb-2 text-emerald-600" />
                        <h2 className="text-2xl font-bold">₹{summary.totalTax}</h2>
                        <p className="text-sm text-gray-500 mt-1">Tax Collected</p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <p className="text-sm text-gray-500">Discount Given</p>
                        <h2 className="text-2xl font-bold">₹{summary.totalDiscount}</h2>
                        <p className="text-sm text-gray-500 mt-1">Total Discount</p>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Sales & Earnings (Last 30 Days)
                        </h3>
                        <span className="text-sm text-gray-500">
                            Updated in real-time
                        </span>
                    </div>
                    <div className="h-80">
                        <Line options={options} data={data} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
