"use client";

import { useCallback, useState } from "react";

import { AdminIcon, ClientIcon, GreekPatternBorder, TrainerIcon, UserIcon } from "@/components/common/Icons";

const roleIcons = {
  trainer: TrainerIcon,
  client: ClientIcon,
  user: UserIcon,
  admin: AdminIcon,
};

export const RoleCardCompact = ({ role, isSelected, onClick, title, description, loading, special }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = roleIcons[role];

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!loading) {
      onClick();
    }
  }, [loading, onClick]);

  if (!Icon) {
    console.error(`No icon found for role: ${role}`);
    return null;
  }

  return (
    <div
      className={`relative cursor-pointer rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 ${
        isSelected
          ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-300 ring-opacity-50"
          : special
            ? "border-2 border-orange-500 bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500"
            : "border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500 hover:border-orange-400"
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform, opacity" }}
    >
      <GreekPatternBorder isVisible={isSelected || isHovered} />
      <div className="relative z-10 flex flex-col items-center">
        <div className={`relative transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
          <Icon className={`h-20 w-20 ${loading ? "animate-pulse" : ""}`} />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-3 h-6 w-6 animate-spin rounded-full border-white border-t-transparent"></div>
            </div>
          )}
        </div>
        <h3
          className={`spartacus-font mt-4 text-2xl font-bold tracking-wide ${
            isSelected ? "text-white" : "text-orange-500"
          }`}
        >
          {title}
        </h3>
        <p className={`mt-3 max-w-xs text-center text-sm ${isSelected ? "text-white" : "text-gray-300"}`}>
          {description}
        </p>
        <span
          className={`mt-4 inline-block rounded-md px-4 py-2 text-base font-bold capitalize tracking-wider transition-all duration-300 ${
            isSelected
              ? "border border-orange-300 border-opacity-40 bg-orange-400 bg-opacity-30 text-white shadow-inner backdrop-blur-sm"
              : "border border-orange-500 border-opacity-40 bg-gradient-to-r from-zinc-800 to-zinc-900 text-orange-400 hover:border-orange-400 hover:text-orange-300 hover:shadow-lg hover:shadow-orange-500/20"
          } ${isHovered ? "scale-105" : ""}`}
        >
          {role.toLowerCase()}
        </span>
      </div>

      {special && (
        <div className="absolute -right-2 -top-2 rotate-12 transform rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">
          SPECIAL
        </div>
      )}

      {isSelected && <div className="absolute inset-0 -z-10 rounded-xl bg-orange-500 opacity-20 blur-xl"></div>}
      <GreekPatternBorder position="bottom" isVisible={isSelected || isHovered} />
    </div>
  );
};
