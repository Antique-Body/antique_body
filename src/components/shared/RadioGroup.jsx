import React from "react";

/**
 * Radio group component for single selections
 */
export const RadioGroup = ({ label, description, options, value, onChange, columns = 1 }) => {
    return (
        <div className="mb-6">
            {label && <label className="block text-gray-300 mb-2">{label}</label>}
            {description && <p className="text-sm text-gray-400 mb-2">{description}</p>}

            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            value === option
                                ? "bg-[rgba(255,107,0,0.15)] border-[#FF6B00]"
                                : "bg-[rgba(26,26,26,0.7)] border-[#333] hover:border-gray-400"
                        }`}
                        onClick={() => onChange(option)}
                    >
                        <div className="flex items-center">
                            <div
                                className={`w-4 h-4 rounded-full mr-2 ${value === option ? "bg-[#FF6B00]" : "bg-[#333]"}`}
                            ></div>
                            <span>{option}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
