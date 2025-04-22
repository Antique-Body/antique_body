import React from "react";

export const BrandLogo = ({ size = "medium" }) => {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        className={sizes[size]}>
        <defs>
          <linearGradient
            id="orangeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop offset="0%" stopColor="#FF7800" />
            <stop offset="100%" stopColor="#FF9A00" />
          </linearGradient>
        </defs>
        <path
          fill="url(#orangeGradient)"
          d="M200 0C89.5 0 0 89.5 0 200s89.5 200 200 200 200-89.5 200-200S310.5 0 200 0zm0 360c-88.4 0-160-71.6-160-160S111.6 40 200 40s160 71.6 160 160-71.6 160-160 160z"
        />
        <path
          fill="url(#orangeGradient)"
          d="M200 80c-66.3 0-120 53.7-120 120s53.7 120 120 120 120-53.7 120-120-53.7-120-120-120zm0 200c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"
        />
        <circle fill="url(#orangeGradient)" cx="200" cy="200" r="40" />
      </svg>
      <span className="text-xl font-bold bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
        AntiqueBody
      </span>
    </div>
  );
};
