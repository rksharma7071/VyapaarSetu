import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

function groupByMonth(items) {
    const groups = new Map();
    items.forEach((item) => {
        const date = new Date(item.createdAt);
        const label = date.toLocaleString("en-IN", {
            month: "long",
            year: "numeric",
        });
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label).push(item);
    });
    return Array.from(groups.entries());
}

function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/activity-log?limit=200`);
            setLogs(res?.data?.data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const grouped = useMemo(() => groupByMonth(logs), [logs]);

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div>
                <div className="text-xl font-semibold text-gray-900">
                    Store Activity Log
                </div>
                <div className="text-sm text-gray-500">
                    Recent changes across products, orders, and system updates
                </div>
            </div>

            {!loading && !logs.length && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    No activity yet.
                </div>
            )}

            {!loading && logs.length > 0 && (
                <div className="space-y-6">
                    {grouped.map(([month, items]) => (
                        <div key={month} className="rounded-lg border border-gray-200 bg-white">
                            <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
                                {month}
                            </div>
                            <div className="divide-y divide-gray-200">
                                {items.map((log) => {
                                    const time = new Date(log.createdAt).toLocaleString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });
                                    return (
                                        <div key={log._id} className="flex flex-col gap-1 px-4 py-3">
                                            <div className="text-sm text-gray-900">{log.message}</div>
                                            <div className="text-xs text-gray-500">
                                                {time} · {log.actorName || "System"} ({log.actorRole || "system"})
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityLog;
