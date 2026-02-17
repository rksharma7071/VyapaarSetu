import React from "react";

function Input({
    type = "text",
    id,
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
    className = "",
    ...rest
}) {
    return (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            {...rest}
            className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm placeholder-gray-400 transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
        />
    );
}

export default Input;
