import React, { useEffect, useMemo, useState } from "react";
import {
    FiCheckCircle,
    FiAlertTriangle,
    FiInfo,
    FiXCircle,
    FiX,
} from "react-icons/fi";

const TYPE_STYLES = {
    success: {
        icon: FiCheckCircle,
        bg: "bg-emerald-500 dark:bg-emerald-600",
        border: "border-emerald-200 dark:border-emerald-300",
        text: "text-emerald-900 dark:text-emerald-100",
        iconClass: "text-emerald-600 dark:text-emerald-300",
    },
    error: {
        icon: FiXCircle,
        bg: "bg-rose-50 dark:bg-rose-600",
        border: "border-rose-200 dark:border-rose-300",
        text: "text-rose-900 dark:text-rose-100",
        iconClass: "text-rose-600 dark:text-rose-300",
    },
    warning: {
        icon: FiAlertTriangle,
        bg: "bg-amber-50 dark:bg-amber-600",
        border: "border-amber-200 dark:border-amber-300",
        text: "text-amber-900 dark:text-amber-100",
        iconClass: "text-amber-600 dark:text-amber-300",
    },
    info: {
        icon: FiInfo,
        bg: "bg-sky-50 dark:bg-sky-600",
        border: "border-sky-200 dark:border-sky-300",
        text: "text-sky-900 dark:text-sky-100",
        iconClass: "text-sky-600 dark:text-sky-300",
    },
};

function Alert({
    type = "info",
    title,
    message,
    dismissible = true,
    autoClose,
    onClose,
}) {
    const [closing, setClosing] = useState(false);
    const styles = TYPE_STYLES[type] || TYPE_STYLES.info;
    const Icon = styles.icon;
    const role = type === "error" ? "alert" : "status";

    const messageLines = useMemo(() => {
        if (Array.isArray(message)) return message;
        if (typeof message === "string") return message.split("\n");
        return [String(message || "")];
    }, [message]);

    useEffect(() => {
        if (!autoClose) return undefined;
        const timer = setTimeout(() => setClosing(true), autoClose);
        return () => clearTimeout(timer);
    }, [autoClose]);

    useEffect(() => {
        if (!closing) return undefined;
        const timer = setTimeout(() => onClose?.(), 220);
        return () => clearTimeout(timer);
    }, [closing, onClose]);

    const handleClose = () => setClosing(true);

    return (
        <div
            role={role}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={`pointer-events-auto w-full max-w-sm rounded-xl border p-4 shadow-sm transition-all duration-200 ${
                closing
                    ? "opacity-0 translate-y-2"
                    : "opacity-100 translate-y-0"
            } ${styles.bg} ${styles.border} ${styles.text}`}
        >
            <div className="flex items-start gap-3">
                <Icon className={`mt-0.5 h-5 w-5 ${styles.iconClass}`} />
                <div className="flex-1">
                    {title ? (
                        <div className="text-sm font-semibold">{title}</div>
                    ) : null}
                    <div className="text-sm text-current whitespace-pre-line">
                        {messageLines.map((line, idx) => (
                            <div key={`${idx}-${line}`}>{line}</div>
                        ))}
                    </div>
                </div>
                {dismissible ? (
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Dismiss alert"
                        className="ml-2 rounded-md p-1 text-current/70 transition hover:text-current focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}

export default Alert;
