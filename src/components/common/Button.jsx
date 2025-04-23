"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Button = ({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    "px-6 py-2 rounded font-medium transition-all duration-300 disabled:opacity-50";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white hover:from-[#ff5f00] hover:to-[#ff7800]",
    outline: "border border-[#ff7800] text-white hover:bg-[#ff7800]",
    secondary:
      "bg-[#1a1a1a] text-white border border-[#333] hover:border-[#ff7800]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};
