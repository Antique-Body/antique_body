"use client";
import React from "react";

export const FormCard = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-[rgba(30,30,30,0.5)] p-5 rounded-xl border border-[#333] ${className}`}>
            {title && <h2 className="text-xl font-medium mb-4 text-[#FF6B00]">{title}</h2>}
            {children}
        </div>
    );
};
