import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";
import Input from "../components/UI/Input";
import { useAlert } from "../components/UI/AlertProvider";

function Employee() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "cashier",
    });
    const [editing, setEditing] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });
    const [permission, setPermission] = useState(null);
    const { notify } = useAlert();

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

    useEffect(() => {
        if (!currentUser?.id) return;
        if (currentUser?.role === "admin") return setPermission({ admin: true });
        axios
            .get(`${API_URL}/user/permission/${currentUser.id}`)
            .then((res) => setPermission(res.data || {}))
            .catch(() => setPermission({}));
    }, [currentUser]);

    const canCreateUser = permission?.admin || permission?.createUser;
    const canUpdateUser = permission?.admin || permission?.updateUser;
    const canDeleteUser = permission?.admin || permission?.deleteUser;
    const canReadUser = permission?.admin || permission?.readUser;

    const create = async () => {
        if (!form.name || !form.email || !form.password) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "Fill name, email, and password.",
            });
            return;
        }
        try {
            await axios.post(`${API_URL}/user`, form);
            setForm({ name: "", email: "", password: "", role: "cashier" });
            notify({ type: "success", title: "Employee added", message: "New employee created successfully." });
            load();
        } catch (error) {
            notify({
                type: "error",
                title: "Create failed",
                message: error.response?.data?.message || "Failed to add employee.",
            });
        }
    };

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="text-xl font-semibold text-gray-900">Employees</div>
            {canCreateUser && (
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
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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
            )}
            {canReadUser && (
                <div className="rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Role</th>
                                {(canUpdateUser || canDeleteUser) && (
                                    <th className="text-left px-4 py-3">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t border-gray-200">
                                    <td className="px-4 py-3">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{u.role}</td>
                                    {(canUpdateUser || canDeleteUser) && (
                                        <td className="px-4 py-3">
                                            {canUpdateUser && (
                                                <button
                                                    onClick={() =>
                                                        setEditing({
                                                            id: u._id,
                                                            name: u.name,
                                                            email: u.email,
                                                            role: u.role,
                                                        })
                                                    }
                                                    className="mr-2 rounded-lg border border-gray-200 px-3 py-1 text-xs"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDeleteUser && (
                                                <button
                                                    onClick={async () => {
                                                        if (
                                                            !window.confirm(
                                                                "Delete this employee?",
                                                            )
                                                        )
                                                            return;
                                                        try {
                                                            await axios.delete(
                                                                `${API_URL}/user/${u._id}`,
                                                            );
                                                            notify({
                                                                type: "success",
                                                                title: "Employee deleted",
                                                                message: "Employee removed successfully.",
                                                            });
                                                            load();
                                                        } catch (error) {
                                                            notify({
                                                                type: "error",
                                                                title: "Delete failed",
                                                                message: error.response?.data?.message || "Failed to delete employee.",
                                                            });
                                                        }
                                                    }}
                                                    className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            )}
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
            )}

            {canUpdateUser && editing.id && (
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
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="cashier">Cashier</option>
                            <option value="staff">Staff</option>
                        </select>
                        <button
                            onClick={async () => {
                                try {
                                    await axios.patch(
                                        `${API_URL}/user/${editing.id}`,
                                        {
                                            name: editing.name,
                                            email: editing.email,
                                            role: editing.role,
                                        },
                                    );
                                    setEditing({ id: "", name: "", email: "", role: "" });
                                    notify({
                                        type: "success",
                                        title: "Employee updated",
                                        message: "Employee details updated successfully.",
                                    });
                                    load();
                                } catch (error) {
                                    notify({
                                        type: "error",
                                        title: "Update failed",
                                        message: error.response?.data?.message || "Failed to update employee.",
                                    });
                                }
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
