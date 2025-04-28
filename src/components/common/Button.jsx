"use client";
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
    "px-6 py-2 rounded font-medium transition-all duration-300 disabled:opacity-50 cursor-pointer hover:scale-[1.02]";
  const variants = {
    primary:
      "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] text-white hover:from-[#FF5F00] hover:to-[#FF7800]",
    outline: "border border-[#FF7800] text-white hover:bg-[#FF7800]",
    secondary:
      "bg-[#1A1A1A] text-white border border-[#333] hover:border-[#FF7800]",
    modalCancel:
      "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300",
    modalConfirm:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
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
