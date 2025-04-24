import React from "react";
import { SpinnerIcon, GreekPatternIcon } from "../common/Icons";

export function GreekButton({
  children,
  isSelected,
  isLoading,
  onClick,
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`py-3 px-6 rounded-lg font-medium text-center text-base transition-all relative overflow-hidden
        ${
          isSelected ? "bg-[#ff7800] text-white" : "bg-[#252525] text-[#ff7800]"
        }
        ${isLoading ? "cursor-wait" : "cursor-pointer"}
        ${className}`}>
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <SpinnerIcon />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}

      {isSelected && !isLoading && <GreekPatternIcon />}
    </button>
  );
}
