import React from "react";

export const WelcomeCard = ({ title, subtitle, icon }) => {
  return (
    <div
      className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden border border-[#222] w-full text-center min-h-max
      "
      style={{
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
      }}>
      <div
        className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#FF7800] via-[#FFD700] to-[#FF7800] bg-[length:200%_100%]"
        style={{
          animation: "shimmer 2s infinite linear",
        }}></div>
      <div className="text-2xl sm:text-3xl font-bold mb-2">{title}</div>
      <div className="text-[#aaa] text-base mb-4">{subtitle}</div>
      <div
        className="relative inline-block mt-2 mb-1 w-[60px] h-[60px] bg-gradient-to-br from-[#FF7800] to-[#FF9A00] rounded-full flex justify-center items-center"
        style={{
          boxShadow: "0 5px 15px rgba(255, 120, 0, 0.3)",
        }}>
        {icon}
      </div>
    </div>
  );
};
