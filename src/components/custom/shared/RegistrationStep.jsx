import React from "react";

/**
 * A wrapper component for registration steps that provides consistent styling
 */
export const RegistrationStep = ({ title, description, children }) => (
  <div className="mb-6 rounded-xl border border-[#333] bg-[rgba(30,30,30,0.5)] p-5">
    {title && <h2 className="mb-4 text-xl font-medium text-[#FF6B00]">{title}</h2>}
    {description && <p className="mb-3 text-sm text-gray-400">{description}</p>}
    {children}
  </div>
);
