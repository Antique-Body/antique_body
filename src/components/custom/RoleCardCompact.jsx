import React, { useState, memo, useCallback } from "react";
import {
  ClientIcon,
  GreekPatternBorder,
  SoloIcon,
  TrainerIcon,
} from "@/components/common/Icons";
import { useState } from "react";

const roleIcons = {
  trainer: TrainerIcon,
  client: ClientIcon,
  user: UserIcon,
  admin: AdminIcon
};

const RoleCardCompact = ({
  role,
  isSelected,
  onClick,
  title,
  description,
  loading,
  special,
}) => {
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
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
        isSelected
          ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-300 ring-opacity-50"
          : special
          ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500 border-2 border-orange-500"
          : "bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500 hover:border-orange-400 border border-zinc-700"
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform, opacity' }}>
      <GreekPatternBorder isVisible={isSelected || isHovered} />
      <div className="flex flex-col items-center relative z-10">
        <div
          className={`relative transition-transform duration-300 ${
            isHovered ? "scale-110" : ""
          }`}>
          <Icon className={`h-20 w-20 ${loading ? "animate-pulse" : ""}`} />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <h3
          className={`mt-4 text-2xl font-bold spartacus-font tracking-wide ${
            isSelected ? "text-white" : "text-orange-500"
          }`}>
          {title}
        </h3>
        <p
          className={`mt-3 text-sm text-center max-w-xs ${
            isSelected ? "text-white" : "text-gray-300"
          }`}>
          {description}
        </p>
        <span
          className={`mt-4 inline-block px-4 py-2 rounded-md text-base font-bold capitalize tracking-wider transition-all duration-300 ${
            isSelected
              ? "bg-orange-400 bg-opacity-30 text-white shadow-inner border border-orange-300 border-opacity-40 backdrop-blur-sm"
              : "bg-gradient-to-r from-zinc-800 to-zinc-900 text-orange-400 border border-orange-500 border-opacity-40 hover:border-orange-400 hover:text-orange-300 hover:shadow-lg hover:shadow-orange-500/20"
          } ${isHovered ? "scale-105" : ""}`}>
          {role.toLowerCase()}
        </span>
      </div>

      {special && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
          SPECIAL
        </div>
      )}

      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-orange-500 opacity-20 blur-xl -z-10"></div>
      )}
      <GreekPatternBorder
        position="bottom"
        isVisible={isSelected || isHovered}
      />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(RoleCardCompact);
