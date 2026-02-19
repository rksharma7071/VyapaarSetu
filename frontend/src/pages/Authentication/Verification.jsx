import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/UI/Input";
import { useAlert } from "../../components/UI/AlertProvider";

function Verification() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { notify } = useAlert();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !otp.trim()) {
            notify({
                type: "warning",
                title: "Missing fields",
                message: "Email and OTP are required.",
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
                email: email.trim(),
                otp: otp.trim(),
            });
            notify({
                type: "success",
                title: "OTP verified",
                message: "Set your new password now.",
            });
            navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
        } catch (error) {
            notify({
                type: "error",
                title: "Verification failed",
                message: error.response?.data?.message || "Invalid or expired OTP.",
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
                <div className="font-semibold text-2xl mb-2">OTP Verification</div>
                <div className="text-gray-500 mb-4 text-sm">
                    Enter the OTP sent to your email.
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
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="otp">
                            OTP<span className="text-red-500 pl-1">*</span>
                        </label>
                        <Input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <div className="text-center text-sm text-gray-500">
                        Didn’t receive OTP? <Link to="/forgot-password" className="text-dark">Resend</Link>
                    </div>
                </form>
            </div>
            <div className="text-sm text-gray-500">
                Copyrights © {new Date().getFullYear()} - <Link to="/">VyapaarSetu</Link>
            </div>
        </div>
    );
}

export default Verification;
