import express from "express";
import authMiddleware from "../middlewares/authentication.js";
import {
    getRolePermissions,
    updateRolePermissions,
} from "../controllers/rolePermission.controller.js";

const router = express.Router();

router.route("/").get(authMiddleware, getRolePermissions);
router.route("/:role").patch(authMiddleware, updateRolePermissions);

export default router;
