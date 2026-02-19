import React from "react";
import { Link } from "react-router-dom";

function EmailVerification() {
    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <h1 className="text-2xl font-semibold text-gray-900">Verify Your Email</h1>
                <p className="mt-3 text-sm text-gray-600">
                    We have sent a verification link to your email address. Please
                    check your inbox and spam folder.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Go Login
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                        Back to Register
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
