import React from "react";

/**
 * Radio group component for single selections
 */
export const RadioGroup = ({ label, description, options, value, onChange, columns = 1 }) => (
    <div className="mb-6">
        {label && <label className="mb-2 block text-gray-300">{label}</label>}
        {description && <p className="mb-2 text-sm text-gray-400">{description}</p>}

        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`cursor-pointer rounded-lg border p-3 transition-all ${
                        value === option
                            ? "border-[#FF6B00] bg-[rgba(255,107,0,0.15)]"
                            : "border-[#333] bg-[rgba(26,26,26,0.7)] hover:border-gray-400"
                    }`}
                    onClick={() => onChange(option)}
                >
                    <div className="flex items-center">
                        <div className={`mr-2 h-4 w-4 rounded-full ${value === option ? "bg-[#FF6B00]" : "bg-[#333]"}`}></div>
                        <span>{option}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
