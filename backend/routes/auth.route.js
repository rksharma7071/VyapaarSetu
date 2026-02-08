import express from "express";

const router = express.Router();
import {
    handleAuthLogin,
    handleAuthSignUp,
    handleAuthChangePassword,
    handleAuthRequestOTP,
    handleAuthVerifyOTP,
    handleAuthResetPassword,
    handleAuthRefresh,
    handleAuthLogout,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authentication.js";
import rateLimit from "../middlewares/rateLimit.js";

const authLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 });

router.route("/signup").post(authLimiter, handleAuthSignUp);
router.route("/login").post(authLimiter, handleAuthLogin);
router.route("/change-password").post(authLimiter, handleAuthChangePassword);
router.route("/request-otp").post(authLimiter, handleAuthRequestOTP);
router.route("/verify-otp").post(authLimiter, handleAuthVerifyOTP);
router.route("/reset-password").post(authLimiter, handleAuthResetPassword);
router.route("/refresh").post(handleAuthRefresh);
router.route("/logout").post(authMiddleware, handleAuthLogout);

export default router;
