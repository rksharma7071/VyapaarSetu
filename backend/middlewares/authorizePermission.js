import { Permission } from "../models/user.model.js";
import RolePermission from "../models/rolePermission.model.js";

const authorizePermission = (permissionKey) => {
    return async (req, res, next) => {
        try {
            if (req.user?.role === "admin") return next();

            if (!req.user?.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (req.user?.role === "staff" && permissionKey.startsWith("delete")) {
                return res.status(403).json({ message: "Permission denied" });
            }

            const rolePermission = await RolePermission.findOne({
                role: req.user.role,
            }).lean();

            if (rolePermission?.permissions?.[permissionKey]) {
                return next();
            }

            const permission = await Permission.findOne({
                userId: req.user.id,
            }).lean();

            if (!permission || !permission[permissionKey]) {
                return res.status(403).json({ message: "Permission denied" });
            }

            return next();
        } catch (error) {
            return res.status(500).json({ message: "Permission check failed" });
        }
    };
};

export default authorizePermission;
