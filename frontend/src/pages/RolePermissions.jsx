import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/api";

const roleLabels = {
    admin: "Admin",
    manager: "Manager",
    cashier: "Cashier",
    staff: "Staff",
};

const permissionConfig = [
    {
        label: "Products",
        actions: [
            { key: "readProduct", label: "Read" },
            { key: "createProduct", label: "Create" },
            { key: "updateProduct", label: "Update" },
            { key: "deleteProduct", label: "Delete" },
        ],
    },
    {
        label: "Orders",
        actions: [
            { key: "readOrder", label: "Read" },
            { key: "createOrder", label: "Create" },
            { key: "updateOrder", label: "Update" },
            { key: "deleteOrder", label: "Delete" },
        ],
    },
    {
        label: "Customers",
        actions: [
            { key: "readCustomer", label: "Read" },
            { key: "createCustomer", label: "Create" },
            { key: "updateCustomer", label: "Update" },
            { key: "deleteCustomer", label: "Delete" },
        ],
    },
    {
        label: "Inventory",
        actions: [
            { key: "readInventory", label: "Read" },
            { key: "createInventory", label: "Create" },
            { key: "updateInventory", label: "Update" },
            { key: "deleteInventory", label: "Delete" },
        ],
    },
    {
        label: "Discounts",
        actions: [
            { key: "readDiscount", label: "Read" },
            { key: "createDiscount", label: "Create" },
            { key: "updateDiscount", label: "Update" },
            { key: "deleteDiscount", label: "Delete" },
        ],
    },
    {
        label: "Suppliers",
        actions: [
            { key: "readSupplier", label: "Read" },
            { key: "createSupplier", label: "Create" },
            { key: "updateSupplier", label: "Update" },
            { key: "deleteSupplier", label: "Delete" },
        ],
    },
    {
        label: "Purchase Orders",
        actions: [
            { key: "readPurchaseOrder", label: "Read" },
            { key: "createPurchaseOrder", label: "Create" },
            { key: "updatePurchaseOrder", label: "Update" },
            { key: "deletePurchaseOrder", label: "Delete" },
        ],
    },
    {
        label: "Returns",
        actions: [
            { key: "readReturn", label: "Read" },
            { key: "createReturn", label: "Create" },
        ],
    },
    {
        label: "Reports",
        actions: [{ key: "readReport", label: "Read" }],
    },
    {
        label: "Invoices",
        actions: [{ key: "readInvoice", label: "Read" }],
    },
    {
        label: "Payments",
        actions: [{ key: "readPayment", label: "Read" }],
    },
    {
        label: "Users/Employees",
        actions: [
            { key: "readUser", label: "Read" },
            { key: "createUser", label: "Create" },
            { key: "updateUser", label: "Update" },
            { key: "deleteUser", label: "Delete" },
        ],
    },
];

function RolePermissions() {
    const user = useMemo(
        () => JSON.parse(localStorage.getItem("user") || "null"),
        [],
    );
    const [rolePermissions, setRolePermissions] = useState({});
    const [selectedRole, setSelectedRole] = useState("admin");
    const [permissions, setPermissions] = useState({});
    const [saving, setSaving] = useState(false);

    const roles = useMemo(
        () => ["admin", "manager", "cashier", "staff"],
        [],
    );

    const load = async () => {
        const res = await axios.get(`${API_URL}/role-permission`);
        const data = res?.data?.data || [];
        const map = {};
        data.forEach((item) => {
            map[item.role] = item.permissions || {};
        });
        setRolePermissions(map);
        setSelectedRole((prev) => (map[prev] ? prev : "admin"));
    };

    useEffect(() => {
        if (user?.role !== "admin") return;
        load();
    }, [user]);

    useEffect(() => {
        setPermissions(rolePermissions[selectedRole] || {});
    }, [rolePermissions, selectedRole]);

    const togglePermission = (key) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const save = async () => {
        setSaving(true);
        try {
            await axios.patch(`${API_URL}/role-permission/${selectedRole}`, {
                permissions,
            });
            await load();
        } finally {
            setSaving(false);
        }
    };

    if (user?.role !== "admin") {
        return (
            <div className="bg-gray-50 px-8 py-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
                    Permission denied.
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 px-8 py-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xl font-semibold text-gray-900">
                        Role Permissions
                    </div>
                    <div className="text-sm text-gray-500">
                        Manage access by role (Admin, Manager, Cashier, Staff)
                    </div>
                </div>
                <button
                    onClick={save}
                    disabled={saving}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                            selectedRole === role
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {roleLabels[role]}
                    </button>
                ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {permissionConfig.map((section) => (
                        <div key={section.label} className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-3 text-sm font-semibold text-gray-900">
                                {section.label}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {section.actions.map((action) => {
                                    const active = !!permissions[action.key];
                                    return (
                                        <button
                                            key={action.key}
                                            onClick={() => togglePermission(action.key)}
                                            className={`rounded-full border px-3 py-1 text-xs transition ${
                                                active
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RolePermissions;
