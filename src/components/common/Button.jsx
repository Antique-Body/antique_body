"use client";
import { cn } from "@/lib/utils";

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "default",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  type = "button",
  onClick,
  isActive = false,
  ...props
}) => {
  // Base styles applied to all buttons
  const baseStyles =
    "font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg relative focus:outline-none focus:ring-2 focus:ring-[#FF7800]/30";

  // Size variations - adjusted for better proportions
  const sizes = {
    small: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-2.5 text-base",
    compact: "min-w-[50px] h-[36px] px-2.5 py-1.5 text-xs",
  };

  // Style variations - enhanced with improved gradients and transitions
  const variants = {
    // Main variants with refined styles
    primary:
      "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] text-white hover:from-[#FF5F00] hover:to-[#FF7800] hover:shadow-md hover:shadow-[#FF7800]/20 transform hover:-translate-y-[1px]",
    secondary:
      "bg-[#242424] text-white border border-[#333] hover:border-[#FF7800] transform hover:-translate-y-[1px] hover:shadow-sm",
    outline:
      "border border-[#FF7800] text-[#FF7800] bg-[rgba(255,107,0,0.07)] hover:bg-[rgba(255,107,0,0.15)] transform hover:-translate-y-[1px]",

    // Modal variants
    modalCancel:
      "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 transform hover:-translate-y-[1px]",
    modalConfirm:
      "bg-orange-500 hover:bg-orange-600 text-white shadow shadow-orange-500/20 transform hover:-translate-y-[1px]",

    // Nutrition page variants - improved contrast and transitions
    orangeOutline:
      "bg-[rgba(255,107,0,0.07)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] hover:text-[#FF9A00] transform hover:-translate-y-[1px]",
    outlineOrange:
      "bg-[rgba(255,107,0,0.07)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] hover:text-[#FF9A00] transform hover:-translate-y-[1px]",
    orangeFilled:
      "bg-[#FF6B00] text-white hover:bg-[#FF9A00] transform hover:-translate-y-[1px] hover:shadow-sm hover:shadow-[#FF7800]/20",
    compactOrange:
      "bg-[#FF6B00] text-white hover:bg-[#FF9A00] text-xs font-medium transform hover:-translate-y-[1px]",
    orangeText:
      "text-[#FF6B00] hover:text-[#FF9A00] bg-transparent hover:bg-transparent p-0",

    // Water tracker variants
    blueOutline:
      "bg-[rgba(0,149,255,0.07)] border border-[rgba(0,149,255,0.3)] text-blue-400 hover:bg-[rgba(0,149,255,0.15)] transform hover:-translate-y-[1px]",

    // Dashboard variants - improved visibility and interaction states
    ghost: "text-gray-400 hover:text-white hover:bg-[#2a2a2a] bg-transparent",
    ghostOrange:
      "text-[#FF6B00] hover:text-[#FF9A00] hover:bg-[rgba(255,107,0,0.07)] bg-transparent",
    subtle:
      "text-white/80 hover:text-white border border-[#444] hover:border-[#666] transform hover:-translate-y-[1px]",

    // Tab variants
    tab: "py-2 px-3 font-medium text-sm border-b-2 whitespace-nowrap bg-transparent rounded-none",
  };

  const contentClasses = "flex items-center justify-center gap-1.5";

  return (
    <button
      className={cn(
        baseStyles,
        size === "compact" ? sizes.compact : sizes[size],
        variants[variant],
        variant === "tab" &&
          (isActive
            ? "border-[#FF6B00] text-[#FF6B00]"
            : "border-transparent text-gray-400 hover:text-white"),
        fullWidth && "w-full",
        className,
      )}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {/* Visible content */}
      <div className={contentClasses} style={{ opacity: loading ? 0 : 1 }}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>

      {/* Loading spinner overlay - refined spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </div>
      )}
    </button>
  );
};
