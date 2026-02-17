import React, { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/UI/Input";
import { useAlert } from "../../components/UI/AlertProvider";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notify } = useAlert();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "Email, password and confirm password are required.",
            });
            return;
        }
        if (password !== confirmPassword) {
            notify({
                type: "warning",
                title: "Password mismatch",
                message: "Password and confirm password must match.",
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
                email: email.trim(),
                password,
            });
            notify({
                type: "success",
                title: "Password reset",
                message: "Password changed successfully.",
            });
            navigate("/success?type=password-reset");
        } catch (error) {
            notify({
                type: "error",
                title: "Reset failed",
                message: error.response?.data?.message || "Unable to reset password.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-between flex-col py-6 md:py-20"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div>
                <img src="logo.png" alt="Company Logo" loading="lazy" className="h-14" />
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-lg px-8 py-6 shadow border border-gray-200 p-4 m-4 w-md">
                <div className="font-semibold text-2xl mb-2">Reset Password</div>
                <div className="text-gray-500 mb-4 text-sm">
                    Set a new password for your account.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block mb-2" htmlFor="email">
                            Email<span className="text-red-500 pl-1">*</span>
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative mb-3">
                        <label className="block mb-2" htmlFor="password">
                            New Password<span className="text-red-500 pl-1">*</span>
                        </label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pr-14"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <label className="block mb-2" htmlFor="confirmPassword">
                            Confirm Password<span className="text-red-500 pl-1">*</span>
                        </label>
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pr-14"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500"
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                    <div className="text-center text-sm text-gray-500">
                        Back to <Link to="/login" className="text-dark">Login</Link>
                    </div>
                </form>
            </div>
            <div className="text-sm text-gray-500">
                Copyrights © {new Date().getFullYear()} - <Link to="/">VyapaarSetu</Link>
            </div>
        </div>
    );
}

export default ResetPassword;
