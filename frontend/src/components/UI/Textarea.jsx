import React from "react";

function Textarea({
    id,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 3,
    disabled = false,
    className = "",
}) {
    return (
        <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
        />
    );
}

export default Textarea;
