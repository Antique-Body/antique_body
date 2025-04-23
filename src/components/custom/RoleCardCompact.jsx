import React, { useState } from "react";
import {
  TrainerIcon,
  ClientIcon,
  SoloIcon,
  GreekPatternBorder,
} from "@/components/common/Icons";

const ROLE_ICONS = {
  TRAINER: TrainerIcon,
  CLIENT: ClientIcon,
  SOLO: SoloIcon,
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
  const Icon = ROLE_ICONS[role];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
        isSelected
          ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-300 ring-opacity-50"
          : special
          ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500 border-2 border-orange-500"
          : "bg-gradient-to-br from-zinc-800 to-zinc-900 text-orange-500 hover:border-orange-400 border border-zinc-700"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
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
          className={`mt-4 inline-block px-4 py-1 rounded-full text-base font-bold capitalize tracking-wide ${
            isSelected
              ? "bg-white bg-opacity-30 text-white shadow-inner"
              : "bg-orange-500 bg-opacity-20 text-white border border-orange-400 border-opacity-40"
          }`}>
          {role.toLowerCase()}
        </span>
      </div>
      <GreekPatternBorder
        position="bottom"
        isVisible={isSelected || isHovered}
      />

      {special && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
          SPECIAL
        </div>
      )}

      {isSelected && (
        <div className="absolute inset-0 rounded-xl bg-orange-500 opacity-20 blur-xl -z-10"></div>
      )}
    </div>
  );
};

export default RoleCardCompact;
