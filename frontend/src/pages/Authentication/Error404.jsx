import React from "react";
import { Link, useLocation } from "react-router-dom";

function Error404() {
    const location = useLocation();

    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <p className="text-sm font-semibold text-red-600">404</p>
                <h1 className="mt-1 text-3xl font-semibold text-gray-900">Page Not Found</h1>
                <p className="mt-3 text-sm text-gray-600">
                    We could not find <span className="font-medium">{location.pathname}</span>.
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

export default Error404;
