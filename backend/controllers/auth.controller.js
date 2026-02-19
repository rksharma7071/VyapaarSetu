import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import Store from "../models/store.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import { connectDB } from "../config/database.js";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

function generateSessionId() {
    return crypto.randomUUID();
}

function createAccessToken(user) {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            storeId: user.storeId,
            sid: user.sessionId || "",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" },
    );
}

async function createRefreshToken(user, reqIp) {
    const token = crypto.randomBytes(40).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
        createdByIp: reqIp || "",
    });
    return token;
}

async function handleAuthSignUp(req, res) {
    const { email, password, name, role, storeId } = req.body;

    try {
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }],
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        if (storeId) {
            const store = await Store.findById(storeId);
            if (!store) {
                return res.status(400).json({ message: "Invalid storeId" });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            role: role || "customer",
            storeId: storeId || null,
        });

        await newUser.save();

        newUser.sessionId = generateSessionId();
        await newUser.save();

        const token = createAccessToken(newUser);
        const refreshToken = await createRefreshToken(newUser, req.ip);
        res.json({
            token,
            refreshToken,
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                storeId: newUser.storeId || null,
                subscriptionActive: false,
            },
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message || "Server error",
        });
    }
}

async function handleAuthLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide email and password." });
    }

    try {
        await connectDB();

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        if (user.isActive === false) {
            return res.status(403).json({ message: "Account is deactivated." });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect." });
        }

        // 3. Generate JWT token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in .env file");
            return res.status(500).json({ message: "Server config error." });
        }

        user.sessionId = generateSessionId();
        await RefreshToken.updateMany(
            { userId: user._id, revokedAt: null },
            { $set: { revokedAt: new Date(), revokedByIp: req.ip || "" } },
        );
        await user.save();
        const token = createAccessToken(user);
        const refreshToken = await createRefreshToken(user, req.ip);

        // 4. Respond with token and user info
        const storeId = user.storeId || null;
        let subscriptionActive = false;
        if (storeId) {
            const storeDoc = await Store.findById(storeId).lean();
            if (storeDoc?.subscriptionStatus === "active") {
                subscriptionActive = !storeDoc.subscriptionEnd
                    ? true
                    : new Date(storeDoc.subscriptionEnd) > new Date();
            }
        }

        return res.json({
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                storeId: user.storeId || null,
                subscriptionActive,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function handleAuthChangePassword(req, res) {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({
            message: "Please provide email, old password, and new password.",
        });
    }

    try {
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Old password is incorrect." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: "Password changed successfully." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

async function handleAuthRequestOTP(req, res) {
    const { email } = req.body;
    await connectDB();
    // console.log("email: ", email);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // console.log("user: ", user);

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Password Reset" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color:#333;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>Your OTP code is:</p>
      <h1 style="background:#f4f4f4; display:inline-block; padding:10px 20px; border-radius:5px; color:#333;">
        ${otp}
      </h1>
      <p style="margin-top:20px;">⚠️ This OTP will expire in <b>5 minutes</b>.</p>
      <p>If you didn’t request a password reset, you can safely ignore this email.</p>
      <br/>
      <p style="color:#888;">— Your App Team</p>
    </div>
  `,
    });

    res.json({ message: "OTP sent successfully" });
}

async function handleAuthVerifyOTP(req, res) {
    const { email, otp } = req.body;
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otpVerifiedAt = new Date();
    await user.save();
    res.json({ message: "OTP verified, you can reset password now" });
}

async function handleAuthResetPassword(req, res) {
    const { email, password } = req.body;
    await connectDB();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const verifiedAt = user.otpVerifiedAt ? new Date(user.otpVerifiedAt) : null;
    if (!verifiedAt || Date.now() - verifiedAt.getTime() > 10 * 60 * 1000) {
        return res.status(400).json({ message: "OTP verification required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;
    user.otpVerifiedAt = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
}

async function handleAuthRefresh(req, res) {
    try {
        await connectDB();

        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }
        const tokenHash = hashToken(refreshToken);
        const existing = await RefreshToken.findOne({ tokenHash });
        if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        const user = await User.findById(existing.userId);
        if (!user || user.isActive === false) {
            return res.status(401).json({ message: "Invalid user" });
        }

        existing.revokedAt = new Date();
        existing.revokedByIp = req.ip || "";
        await existing.save();

        const newAccessToken = createAccessToken(user);
        const newRefreshToken = await createRefreshToken(user, req.ip);
        return res.json({ token: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        return res.status(500).json({ message: "Failed to refresh token" });
    }
}

async function handleAuthLogout(req, res) {
    try {
        await connectDB();

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        await RefreshToken.updateMany(
            { userId, revokedAt: null },
            { $set: { revokedAt: new Date(), revokedByIp: req.ip || "" } },
        );
        await User.findByIdAndUpdate(userId, { sessionId: generateSessionId() });
        return res.json({ message: "Logged out" });
    } catch (error) {
        return res.status(500).json({ message: "Logout failed" });
    }
}

export {
    handleAuthSignUp,
    handleAuthLogin,
    handleAuthChangePassword,
    handleAuthRequestOTP,
    handleAuthVerifyOTP,
    handleAuthResetPassword,
    handleAuthRefresh,
    handleAuthLogout,
};
