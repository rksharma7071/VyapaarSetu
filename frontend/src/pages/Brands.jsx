import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function Brands() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const { notify } = useAlert();

    const load = async () => {
        const res = await axios.get(
            `${API_URL}/brand${storeId ? `?storeId=${storeId}` : ""}`,
        );
        setItems(res.data.data || []);
    };

    useEffect(() => {
        load();
    }, [storeId]);

    const create = async () => {
        if (!name || !slug) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "Name and slug required.",
            });
            return;
        }
        try {
            await axios.post(`${API_URL}/brand`, {
                name,
                slug,
                storeId,
            });
            setName("");
            setSlug("");
            notify({
                type: "success",
                title: "Brand added",
                message: "Brand created successfully.",
            });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Create failed",
                message: error.response?.data?.message || "Failed to create brand.",
            });
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Brands</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex gap-3">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Brand name"
                    />
                    <Input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Slug"
                    />
                    <button
                        onClick={create}
                        className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Slug</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{c.name}</td>
                                <td className="px-4 py-3">{c.slug}</td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={2}>
                                    No brands
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Brands;
