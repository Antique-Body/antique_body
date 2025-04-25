import React from "react";

export const StatCard = ({ label, value, subtext }) => {
    return (
        <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:-translate-y-1">
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className="text-lg font-bold">{value}</p>
            {subtext && <p className="text-xs text-gray-300">{subtext}</p>}
        </div>
    );
};
