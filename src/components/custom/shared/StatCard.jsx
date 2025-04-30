import React from "react";

export const StatCard = ({ label, value, subtext }) => (
  <div className="rounded-xl border border-[#333] bg-[rgba(30,30,30,0.8)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B00]">
    <p className="mb-1 text-xs text-gray-400">{label}</p>
    <p className="text-lg font-bold">{value}</p>
    {subtext && <p className="text-xs text-gray-300">{subtext}</p>}
  </div>
);
