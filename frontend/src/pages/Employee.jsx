import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";

function Employee() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier",
    });
    const [selectedUserId, setSelectedUserId] = useState("");
    const [permissions, setPermissions] = useState({});
    const [editing, setEditing] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });

    const load = async () => {
        const res = await axios.get(`${API_URL}/user`);
        setUsers(res.data || []);
    };

    useEffect(() => {
        load();
    }, []);

    const currentUser = useMemo(
        () => JSON.parse(localStorage.getItem("user") || "null"),
        [],
    );

    const permissionKeys = useMemo(
        () => [
            "readProduct",
            "createProduct",
            "updateProduct",
            "deleteProduct",
            "readOrder",
            "createOrder",
            "updateOrder",
            "deleteOrder",
            "readCustomer",
            "createCustomer",
            "updateCustomer",
            "deleteCustomer",
            "readInventory",
            "createInventory",
            "updateInventory",
            "deleteInventory",
            "readDiscount",
            "createDiscount",
            "updateDiscount",
            "deleteDiscount",
            "readSupplier",
            "createSupplier",
            "updateSupplier",
            "deleteSupplier",
            "readPurchaseOrder",
            "createPurchaseOrder",
            "updatePurchaseOrder",
            "deletePurchaseOrder",
            "readInvoice",
            "readReport",
            "createReturn",
            "readReturn",
            "readPayment",
        ],
        [],
    );

    const loadPermissions = async (userId) => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_URL}/user/permission/${userId}`);
            setPermissions(res.data || {});
        } catch (error) {
            setPermissions({ userId });
        }
    };

    const create = async () => {
        if (!form.name || !form.email || !form.password)
            return alert("Fill name, email, password");
        await axios.post(`${API_URL}/user`, form);
        setForm({ name: "", email: "", password: "", role: "cashier" });
        load();
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Employees</div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Input
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Name"
                    />
                    <Input
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="Email"
                    />
                    <Input
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        placeholder="Password"
                    />
                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, role: e.target.value }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="cashier">Cashier</option>
                        <option value="staff">Staff</option>
                    </select>
                </div>
                <button
                    onClick={create}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                >
                    Add Employee
                </button>
            </div>

            {currentUser?.role === "admin" && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                    <div className="font-semibold">Staff Permissions</div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <select
                            value={selectedUserId}
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedUserId(id);
                                loadPermissions(id);
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">Select staff</option>
                            {users.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={async () => {
                                if (!selectedUserId) return;
                                await axios.post(`${API_URL}/user/permission`, {
                                    userId: selectedUserId,
                                    ...permissions,
                                });
                                alert("Permissions updated");
                            }}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            Save Permissions
                        </button>
                    </div>
                    {selectedUserId && (
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            {permissionKeys.map((key) => (
                                <label key={key} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={!!permissions[key]}
                                        onChange={(e) =>
                                            setPermissions((prev) => ({
                                                ...prev,
                                                [key]: e.target.checked,
                                            }))
                                        }
                                    />
                                    {key}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Email</th>
                            <th className="text-left px-4 py-3">Role</th>
                            {currentUser?.role === "admin" && (
                                <th className="text-left px-4 py-3">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t border-gray-300">
                                <td className="px-4 py-3">{u.name}</td>
                                <td className="px-4 py-3">{u.email}</td>
                                <td className="px-4 py-3">{u.role}</td>
                                {currentUser?.role === "admin" && (
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() =>
                                                setEditing({
                                                    id: u._id,
                                                    name: u.name,
                                                    email: u.email,
                                                    role: u.role,
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
                                                        "Delete this employee?",
                                                    )
                                                )
                                                    return;
                                                await axios.delete(
                                                    `${API_URL}/user/${u._id}`,
                                                );
                                                load();
                                            }}
                                            className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {!users.length && (
                            <tr>
                                <td className="px-4 py-6 text-gray-500" colSpan={4}>
                                    No employees
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {currentUser?.role === "admin" && editing.id && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
                    <div className="font-semibold">Edit Employee</div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <Input
                            value={editing.name}
                            onChange={(e) =>
                                setEditing((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Name"
                        />
                        <Input
                            value={editing.email}
                            onChange={(e) =>
                                setEditing((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            placeholder="Email"
                        />
                        <select
                            value={editing.role}
                            onChange={(e) =>
                                setEditing((prev) => ({
                                    ...prev,
                                    role: e.target.value,
                                }))
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="cashier">Cashier</option>
                            <option value="staff">Staff</option>
                        </select>
                        <button
                            onClick={async () => {
                                await axios.patch(
                                    `${API_URL}/user/${editing.id}`,
                                    {
                                        name: editing.name,
                                        email: editing.email,
                                        role: editing.role,
                                    },
                                );
                                setEditing({ id: "", name: "", email: "", role: "" });
                                load();
                            }}
                            className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Employee;
