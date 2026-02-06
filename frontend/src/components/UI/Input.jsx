import React from "react";

function Input({
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
    className = "",
}) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
        />
    );
}

export default Input;
