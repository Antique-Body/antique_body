"use client";
import React from "react";

export const FormCard = ({ title, children, className = "" }) => (
  <div
    className={`rounded-xl border border-[#333] bg-[rgba(30,30,30,0.5)] p-5 ${className}`}
  >
    {title && (
      <h2 className="mb-4 text-xl font-medium text-[#FF6B00]">{title}</h2>
    )}
    {children}
  </div>
);
