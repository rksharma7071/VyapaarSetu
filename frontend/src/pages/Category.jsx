import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

function Category() {
    const storeId = useSelector((state) => state.stores.selectedStoreId);
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [editing, setEditing] = useState({ id: "", name: "", slug: "" });

    const load = async () => {
        const res = await axios.get(
            `${API_URL}/category${storeId ? `?storeId=${storeId}` : ""}`,
        );
        setItems(res.data.data || []);
    };

    useEffect(() => {
        load();
    }, [storeId]);

    const create = async () => {
        if (!name || !slug) return alert("Name and slug required");
        await axios.post(`${API_URL}/category`, {
            name,
            slug,
            storeId,
        });
        setName("");
        setSlug("");
        load();
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Categories</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex gap-3">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category name"
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
            {editing.id && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                    <div className="font-semibold">Edit Category</div>
                    <div className="flex gap-3">
                        <Input
                            value={editing.name}
                            onChange={(e) =>
                                setEditing((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Category name"
                        />
                        <Input
                            value={editing.slug}
                            onChange={(e) =>
                                setEditing((prev) => ({
                                    ...prev,
                                    slug: e.target.value,
                                }))
                            }
                            placeholder="Slug"
                        />
                        <button
                            onClick={async () => {
                                await axios.patch(
                                    `${API_URL}/category/${editing.id}`,
                                    {
                                        name: editing.name,
                                        slug: editing.slug,
                                    },
                                );
                                setEditing({ id: "", name: "", slug: "" });
                                load();
                            }}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            Save
                        </button>
                        <button
                            onClick={() =>
                                setEditing({ id: "", name: "", slug: "" })
                            }
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Slug</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{c.name}</td>
                                <td className="px-4 py-3">{c.slug}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() =>
                                            setEditing({
                                                id: c._id,
                                                name: c.name,
                                                slug: c.slug,
                                            })
                                        }
                                        className="mr-2 rounded-lg border border-gray-300 px-3 py-1 text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (
                                                !window.confirm(
                                                    "Delete this category?",
                                                )
                                            )
                                                return;
                                            await axios.delete(
                                                `${API_URL}/category/${c._id}`,
                                            );
                                            load();
                                        }}
                                        className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!items.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={3}>
                                    No categories
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Category;
