"use client";
import React from "react";

export const TextArea = ({
    id,
    name,
    label,
    register,
    rules = {},
    error,
    required = false,
    className = "",
    placeholder = "",
    subLabel = "",
    rows = 4,
}) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-300 mb-2" htmlFor={id}>
                    {label}
                </label>
            )}
            {subLabel && <p className="text-sm text-gray-400 mb-2">{subLabel}</p>}
            <textarea
                id={id}
                name={name}
                rows={rows}
                placeholder={placeholder}
                {...register(name, rules)}
                className={`w-full p-2 bg-[#1a1a1a] border border-[#333] rounded focus:outline-none focus:border-[#ff7800] text-white cursor-pointer ${className}`}
                required={required}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
};
