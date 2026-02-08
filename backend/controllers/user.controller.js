import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Permission } from "../models/user.model.js";
import RolePermission from "../models/rolePermission.model.js";
import { ensureRolePermissions } from "../utils/rolePermissionDefaults.js";

async function handleGetAllUsers(req, res) {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
        return res.status(403).json({ message: "Admin or manager access only" });
    }
    const storeId = req.user?.storeId;
    const query = { storeId };
    if (req.user?.role === "manager") {
        query.role = { $ne: "admin" };
    }
    const users = await User.find(query);
    return res.json(users);
}

async function handleCreateNewUser(req, res) {
    try {
        if (req.user?.role !== "admin" && req.user?.role !== "manager") {
            return res.status(403).json({ message: "Admin or manager access only" });
        }
        const body = req.body;

        if (
            !body.email ||
            !body.password ||
            !body.name ||
            !body.role
        ) {
            return res.status(400).json({ message: "All fields are required..." });
        }

        const result = await User.create({
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            name: body.name,
            role: body.role || "cashier",
            storeId: req.user?.storeId || null,
        });

        return res
            .status(201)
            .json({ message: "User created successfully", user: result });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function handleGetUserUinsgId(req, res) {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
        return res.status(403).json({ message: "Admin or manager access only" });
    }
    const storeId = req.user?.storeId;
    const user = await User.findOne({ _id: req.params.id, storeId });
    if (req.user?.role === "manager" && user?.role === "admin") {
        return res.status(403).json({ message: "Permission denied" });
    }
    return res.json(user);
}

async function handleUpdateUserUsingId(req, res) {
    try {
        if (req.user?.role !== "admin" && req.user?.role !== "manager") {
            return res.status(403).json({ message: "Admin or manager access only" });
        }
        const { id } = req.params;
        const { email, name, role, storeId, isActive } = req.body;

        const user = await User.findOne({ _id: id, storeId: req.user?.storeId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.user?.role === "manager" && user?.role === "admin") {
            return res.status(403).json({ message: "Permission denied" });
        }

        if (email) user.email = email;
        if (name) user.name = name;
        if (role) user.role = role;
        if (storeId !== undefined) user.storeId = storeId;
        if (isActive !== undefined) user.isActive = isActive;

        const updatedUser = await user.save();

        return res.json({
            status: "success",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            },
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function handleDeleteUserUsingId(req, res) {
    if (req.user?.role !== "admin" && req.user?.role !== "manager") {
        return res.status(403).json({ message: "Admin or manager access only" });
    }
    const user = await User.findOne({ _id: req.params.id, storeId: req.user?.storeId });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (req.user?.role === "manager" && user?.role === "admin") {
        return res.status(403).json({ message: "Permission denied" });
    }
    await User.findOneAndDelete({ _id: req.params.id, storeId: req.user?.storeId });
    return res.json({
        status: "success",
        message: "User deleted successfully",
    });
}

const permissionFields = [
    "createUser",
    "updateUser",
    "deleteUser",
    "readUser",
    "createProduct",
    "updateProduct",
    "deleteProduct",
    "readProduct",
    "createOrder",
    "updateOrder",
    "deleteOrder",
    "readOrder",
    "createCustomer",
    "updateCustomer",
    "deleteCustomer",
    "readCustomer",
    "createInventory",
    "updateInventory",
    "deleteInventory",
    "readInventory",
    "createDiscount",
    "updateDiscount",
    "deleteDiscount",
    "readDiscount",
    "createSupplier",
    "updateSupplier",
    "deleteSupplier",
    "readSupplier",
    "createPurchaseOrder",
    "updatePurchaseOrder",
    "deletePurchaseOrder",
    "readPurchaseOrder",
    "readReport",
    "readInvoice",
    "createReturn",
    "readReturn",
    "readPayment",
];

const toBool = (v) => v === true || v === "true" || v === 1 || v === "1";

async function handleUpdatePermission(req, res) {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        const body = req.body;
        const userId = body.userId;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format" });
        }

        const updateFields = {};
        permissionFields.forEach((k) => {
            if (body[k] !== undefined && body[k] !== null) {
                updateFields[k] = toBool(body[k]);
            }
        });
        const targetUser = await User.findById(userId).select("role");
        if (targetUser?.role === "staff") {
            Object.keys(updateFields).forEach((key) => {
                if (key.startsWith("delete")) {
                    updateFields[key] = false;
                }
            });
        }
        const existing = await Permission.findOne({ userId }).lean();

        if (existing) {
            if (Object.keys(updateFields).length === 0) {
                return res
                    .status(400)
                    .json({ message: "No permission fields provided to update" });
            }

            const updated = await Permission.findOneAndUpdate(
                { userId },
                { $set: updateFields },
                { new: true }
            ).lean();

            return res.status(200).json({
                message: "Permission updated successfully",
                permission: updated,
            });
        }

        const payload = { userId };
        permissionFields.forEach((k) => {
            if (updateFields[k] !== undefined) {
                payload[k] = updateFields[k];
            } else if (body[k] !== undefined && body[k] !== null) {
                payload[k] = toBool(body[k]);
            } else {
                payload[k] = false;
            }
        });

        const created = await Permission.create(payload);

        return res.status(201).json({
            message: "Permission created successfully",
            permission: created,
        });
    } catch (error) {
        console.error("handleUpdatePermission error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function handleAllPermission(req, res) {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    const permission = await Permission.find({});
    return res.json(permission);
}

async function handleGetPermissionUsingId(req, res) {
    try {
        const userId = req.params.id;
        if (req.user?.role !== "admin" && String(req.user?.id) !== String(userId)) {
            return res.status(403).json({ message: "Admin access only" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const targetUser = await User.findById(userId).select("role").lean();
        const role = targetUser?.role || req.user?.role;
        await ensureRolePermissions();
        const rolePermission = await RolePermission.findOne({ role }).lean();

        if (rolePermission?.permissions) {
            return res.status(200).json(rolePermission.permissions);
        }

        const permission = await Permission.findOne({ userId }).lean();
        if (permission) {
            return res.status(200).json(permission);
        }

        return res
            .status(404)
            .json({ message: "Permission not found for this user" });
    } catch (error) {
        console.error("Error fetching permission:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export {
    handleGetAllUsers,
    handleCreateNewUser,
    handleGetUserUinsgId,
    handleUpdateUserUsingId,
    handleDeleteUserUsingId,
    handleGetPermissionUsingId,
    handleUpdatePermission,
    handleAllPermission,
};
