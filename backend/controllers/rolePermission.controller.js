import RolePermission from "../models/rolePermission.model.js";
import { defaultMatrix, ensureRolePermissions } from "../utils/rolePermissionDefaults.js";

export async function getRolePermissions(req, res) {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        await ensureRolePermissions();
        const roles = await RolePermission.find({}).lean();
        res.json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch role permissions" });
    }
}

export async function updateRolePermissions(req, res) {
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        const { role } = req.params;
        const { permissions } = req.body;
        if (!role || !permissions) {
            return res.status(400).json({ message: "role and permissions required" });
        }
        const updated = await RolePermission.findOneAndUpdate(
            { role },
            { permissions },
            { new: true, upsert: true },
        );
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update role permissions" });
    }
}

export { defaultMatrix };
