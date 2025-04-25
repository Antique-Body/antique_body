import React from "react";

/**
 * Reusable form field component with consistent styling
 */
export const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    options = [],
    min,
    max,
    className = "",
}) => {
    if (type === "select") {
        return (
            <div className={`mb-4 ${className}`}>
                {label && <label className="block text-gray-300 mb-2">{label}</label>}
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                    required={required}
                >
                    <option value="">{placeholder || "Select an option"}</option>
                    {options.map((option, index) => (
                        <option key={index} value={typeof option === "object" ? option.value : option}>
                            {typeof option === "object" ? option.label : option}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className={`mb-4 ${className}`}>
                {label && <label className="block text-gray-300 mb-2">{label}</label>}
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                    placeholder={placeholder}
                    required={required}
                    rows="4"
                ></textarea>
            </div>
        );
    }

    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-gray-300 mb-2">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
            />
        </div>
    );
};
