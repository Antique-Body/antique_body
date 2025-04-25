import React from "react";

/**
 * Dynamic fields component for adding/removing multiple text fields
 */
export const DynamicFields = ({ label, description, fields, onFieldChange, onAddField, onRemoveField, placeholder }) => {
    return (
        <div className="mb-6">
            {label && <label className="block text-gray-300 mb-2">{label}</label>}
            {description && <p className="text-sm text-gray-400 mb-2">{description}</p>}

            {fields.map((field) => (
                <div key={field.id} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={field.value}
                        onChange={(e) => onFieldChange(field.id, e.target.value)}
                        className="flex-1 p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                        placeholder={placeholder}
                    />
                    <button
                        type="button"
                        onClick={() => onRemoveField(field.id)}
                        className="p-3 rounded-lg bg-[#333] text-gray-300 hover:bg-[#444] transition-colors"
                        disabled={fields.length <= 1}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={onAddField}
                className="mt-2 py-2 px-4 flex items-center text-sm bg-[rgba(40,40,40,0.7)] hover:bg-[rgba(60,60,60,0.7)] rounded-lg transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Another
            </button>
        </div>
    );
};
