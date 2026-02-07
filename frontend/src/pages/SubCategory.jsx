import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

function SubCategory() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);
    const [parents, setParents] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentId, setParentId] = useState("");

    const load = async () => {
        const res = await axios.get(
            `${API_URL}/category${storeId ? `?storeId=${storeId}` : ""}`,
        );
        const data = res.data.data || [];
        setItems(data.filter((c) => c.parentId));
        setParents(data.filter((c) => !c.parentId));
    };

    useEffect(() => {
        load();
    }, [storeId]);

    const create = async () => {
        if (!name || !slug || !parentId)
            return alert("Name, slug, parent required");
        await axios.post(`${API_URL}/category`, {
            name,
            slug,
            parentId,
            storeId,
        });
        setName("");
        setSlug("");
        setParentId("");
        load();
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Sub Categories</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex gap-3">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sub category name"
                    />
                    <Input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="Slug"
                    />
                    <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="">Select parent</option>
                        {parents.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
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
                            <th className="text-left px-4 py-3">Parent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{c.name}</td>
                                <td className="px-4 py-3">
                                    {parents.find((p) => p._id === c.parentId)?.name || "-"}
                                </td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={2}>
                                    No sub categories
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SubCategory;
