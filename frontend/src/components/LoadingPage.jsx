import React from "react";

function LoadingPage() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="rounded-xl bg-white px-6 py-5 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
                    <div className="text-sm font-semibold text-gray-800">Loading...</div>
                </div>
            </div>
        </div>
    );
}

export default LoadingPage;
