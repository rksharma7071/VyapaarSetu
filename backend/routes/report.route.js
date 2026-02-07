import express from "express";
import { getSalesSummary } from "../controllers/report.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/sales-summary")
    .get(authMiddleware, authorizePermission("readReport"), getSalesSummary);

export default router;
