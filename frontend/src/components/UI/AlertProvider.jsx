import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import Alert from "./Alert";

const AlertContext = createContext(null);

export function useAlert() {
    const ctx = useContext(AlertContext);
    if (!ctx) {
        throw new Error("useAlert must be used within AlertProvider");
    }
    return ctx;
}

const DEFAULT_AUTO_CLOSE = {
    success: 3000,
};

function AlertProvider({ children }) {
    const [alerts, setAlerts] = useState([]);

    const removeAlert = useCallback((id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    const notify = useCallback((payload) => {
        const id = crypto.randomUUID();
        const type = payload.type || "info";
        const autoClose =
            payload.autoClose ??
            DEFAULT_AUTO_CLOSE[type] ??
            undefined;

        const next = {
            id,
            type,
            title: payload.title,
            message: payload.message,
            dismissible:
                payload.dismissible !== undefined ? payload.dismissible : true,
            autoClose,
        };

        setAlerts((prev) => [next, ...prev]);
        return id;
    }, []);

    const value = useMemo(() => ({ notify, removeAlert }), [notify, removeAlert]);

    return (
        <AlertContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed right-4 top-21 z-50 flex w-full max-w-sm flex-col gap-3">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        {...alert}
                        onClose={() => removeAlert(alert.id)}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
}

export default AlertProvider;
