import express from "express";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";
import { getActivityLog } from "../controllers/activityLog.controller.js";

const router = express.Router();

router.route("/").get(authMiddleware, authorizePermission("readReport"), getActivityLog);

export default router;
