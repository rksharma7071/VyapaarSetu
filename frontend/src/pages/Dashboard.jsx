import React from "react";
import { FaAngleUp, FaArrowUpRightDots } from "react-icons/fa6";
import { GiTakeMyMoney } from "react-icons/gi";
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
    const data = {
        labels: [
            "01", "02", "03", "04", "05", "06", "07",
            "08", "09", "10", "11", "12", "13", "14",
            "15", "16", "17", "18", "19", "20", "21",
            "22", "23", "24", "25", "26", "27", "28",
            "29", "30"
        ],
        datasets: [
            {
                label: "Net Sales ($)",
                data: [
                    120, 165, 210, 185, 240, 310, 270,
                    290, 345, 410, 360, 395, 430, 480,
                    450, 520, 495, 560, 530, 610, 580,
                    650, 620, 690, 640, 710, 680, 750,
                    720, 820
                ],
                borderColor: "#6366f1",
                backgroundColor: "rgba(99,102,241,0.15)",
                tension: 0,
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
                        `$${context.parsed.y.toLocaleString()}`,
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
                    callback: (value) => `$${value / 1000}k`,
                },
            },
        },
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-gray-600">
                <span className="font-semibold text-gray-900">
                    Hi John Smilga,
                </span>{" "}
                here’s what’s happening with your store today.
            </div>

            <div className="grid grid-cols-8 gap-6">
                <div className="col-span-4 rounded-xl border border-gray-200 bg-white p-6 flex justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Weekly Earnings</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                            $95,000.45
                        </h2>
                        <div className="flex items-center gap-2 mt-3 text-sm">
                            <FaAngleUp className="text-green-500" />
                            <span className="text-green-600 font-semibold">48%</span>
                            <span className="text-gray-500">
                                increase from last week
                            </span>
                        </div>
                    </div>
                    <img src="earning.png" alt="Earning" className="h-20" />
                </div>

                <div className="col-span-2 rounded-xl bg-indigo-600 text-white p-6">
                    <FaArrowUpRightDots className="text-3xl mb-4 opacity-80" />
                    <h2 className="text-3xl font-bold">10,000+</h2>
                    <p className="text-sm opacity-80 mt-1">Total Sales</p>
                </div>

                <div className="col-span-2 rounded-xl bg-emerald-600 text-white p-6">
                    <GiTakeMyMoney className="text-3xl mb-4 opacity-80" />
                    <h2 className="text-3xl font-bold">800+</h2>
                    <p className="text-sm opacity-80 mt-1">
                        Purchased Goods
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Sales Analytics
                    </h3>
                    <span className="text-sm text-gray-500">
                        Last 7 Months
                    </span>
                </div>
                <div className="h-80">
                    <Line options={options} data={data} />
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
