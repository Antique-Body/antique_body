import React from "react";

export const Button = ({
  onClick,
  disabled,
  children,
  variant = "primary",
  className = "",
  leftIcon,
  rightIcon,
}) => {
  const baseStyle =
    "px-8 py-3 rounded-xl transition-all flex items-center justify-center";

  const variants = {
    primary: disabled
      ? "bg-[#333] text-[#888] cursor-not-allowed"
      : "bg-gradient-to-r from-[#FF7800] to-[#FF9A00] hover:shadow-[0_5px_15px_rgba(255,120,0,0.3)] hover:translate-y-[-2px]",
    secondary: "bg-[#111] border border-[#333] hover:border-[#444] text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
