import express from "express";
import { createReturn, getReturns } from "../controllers/return.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import authorizePermission from "../middlewares/authorizePermission.js";

const router = express.Router();

router
    .route("/")
    .get(authMiddleware, authorizePermission("readReturn"), getReturns)
    .post(authMiddleware, authorizePermission("createReturn"), createReturn);

export default router;
