import React, { useState } from "react";
import axios from "axios";
import { HiOutlineMail } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/UI/Input";
import { useAlert } from "../../components/UI/AlertProvider";

function ForgotPassword() {
    const navigate = useNavigate();
    const { notify } = useAlert();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            notify({
                type: "warning",
                title: "Email required",
                message: "Please enter your email address.",
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/request-otp`, {
                email: email.trim(),
            });
            notify({
                type: "success",
                title: "OTP sent",
                message: "We sent an OTP to your email.",
            });
            navigate(`/verification?email=${encodeURIComponent(email.trim())}`);
        } catch (error) {
            notify({
                type: "error",
                title: "Request failed",
                message: error.response?.data?.message || "Unable to send OTP",
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
                <div className="font-semibold text-2xl mb-2">Forgot Password?</div>
                <div className="text-gray-500 mb-4 text-sm">
                    Enter your registered email. We will send an OTP to reset your password.
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="relative mb-4">
                        <label className="block mb-2" htmlFor="email">
                            Email Address<span className="text-red-500 pl-1">*</span>
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pr-14"
                        />
                        <span className="absolute right-3 bottom-2 rounded-md px-2 py-1 text-lg font-medium text-gray-500">
                            <HiOutlineMail />
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                    <div className="text-center text-sm text-gray-500">
                        Return to <Link to="/login" className="text-dark">Login</Link>
                    </div>
                </form>
            </div>
            <div className="text-sm text-gray-500">
                Copyrights © {new Date().getFullYear()} - <Link to="/">VyapaarSetu</Link>
            </div>
        </div>
    );
}

export default ForgotPassword;
