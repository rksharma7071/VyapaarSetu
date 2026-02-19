import React from "react";
import { Link } from "react-router-dom";

function Error500() {
    return (
        <div
            className="min-h-dvh w-full bg-cover bg-center flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-xl border border-gray-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur-md">
                <p className="text-sm font-semibold text-red-600">500</p>
                <h1 className="mt-1 text-3xl font-semibold text-gray-900">Something Went Wrong</h1>
                <p className="mt-3 text-sm text-gray-600">
                    The server encountered an unexpected error. Please try again.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                        Try Again
                    </button>
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

export default Error500;
