import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            unique: true,
            enum: ["admin", "manager", "cashier", "staff"],
        },
        permissions: { type: Object, default: {} },
    },
    { timestamps: true },
);

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);

export default RolePermission;
