import React from "react";

/**
 * A wrapper component for registration steps that provides consistent styling
 */
export const RegistrationStep = ({ title, description, children }) => {
    return (
        <div className="bg-[rgba(30,30,30,0.5)] p-5 rounded-xl border border-[#333] mb-6">
            {title && <h2 className="text-xl font-medium mb-4 text-[#FF6B00]">{title}</h2>}
            {description && <p className="text-sm text-gray-400 mb-3">{description}</p>}
            {children}
        </div>
    );
};
