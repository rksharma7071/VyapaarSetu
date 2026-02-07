import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const subscriptionActive = user?.subscriptionActive;
    const storeId = user?.storeId;

    if (!token) return <Navigate to="/login" replace />;
    if (!storeId) return <Navigate to="/store-setup" replace />;
    if (!subscriptionActive) return <Navigate to="/pricing" replace />;
    return <Outlet />;
}

export default ProtectedRoute;
