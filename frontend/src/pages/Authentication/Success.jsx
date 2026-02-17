import React from "react";
import { Link, useSearchParams } from "react-router-dom";

function Success() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const message =
        type === "password-reset"
            ? "Your password has been reset successfully."
            : "Operation completed successfully.";

    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <h1 className="text-3xl font-semibold text-emerald-600">Success</h1>
                <p className="mt-3 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Go Login
                    </Link>
                    <Link
                        to="/"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                    >
                        Go Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Success;
