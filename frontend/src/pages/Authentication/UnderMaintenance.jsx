import React from "react";
import { Link } from "react-router-dom";

function UnderMaintenance() {
    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <h1 className="text-3xl font-semibold text-gray-900">Under Maintenance</h1>
                <p className="mt-3 text-sm text-gray-600">
                    We are currently performing scheduled maintenance. Please check back soon.
                </p>
                <div className="mt-6">
                    <Link
                        to="/login"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default UnderMaintenance;
