import React from "react";
import { Link } from "react-router-dom";

function ComingSoon() {
    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <h1 className="text-3xl font-semibold text-gray-900">Coming Soon</h1>
                <p className="mt-3 text-sm text-gray-600">
                    This page is under development and will be available shortly.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Go Dashboard
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                        Go Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
