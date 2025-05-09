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
        "font-medium cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl relative";

    // Size variations
    const sizes = {
        small: "px-3 py-1.5 text-sm",
        default: "px-6 py-2.5",
        large: "px-8 py-3 text-lg",
        compact: "min-w-[60px] h-[42px] px-3 py-2 text-sm",
    };

    // Style variations
    const variants = {
        // Main variants
        primary: "bg-gradient-to-r from-[#FF7800] to-[#FF5F00] text-white hover:from-[#FF5F00] hover:to-[#FF7800] hover:shadow-lg hover:shadow-[#FF7800]/20 transform hover:-translate-y-[2px]",
        secondary: "bg-[#1A1A1A] text-white border border-[#333] hover:border-[#FF7800] transform hover:-translate-y-[2px] hover:shadow-md",
        outline: "border border-[#FF7800] text-[#FF7800] hover:bg-[rgba(255,107,0,0.15)] transform hover:-translate-y-[2px]",

        // Modal variants
        modalCancel: "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 transform hover:-translate-y-[2px]",
        modalConfirm: "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 transform hover:-translate-y-[2px]",

        // Nutrition page variants
        orangeOutline:
            "bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] hover:bg-[rgba(255,107,0,0.25)] hover:text-[#FF9A00] transform hover:-translate-y-[2px]",
        orangeFilled: "bg-[#FF6B00] text-white hover:bg-[#FF9A00] transform hover:-translate-y-[2px] hover:shadow-md hover:shadow-[#FF7800]/20",
        compactOrange: "bg-[#FF6B00] text-white hover:bg-[#FF9A00] text-xs font-medium transform hover:-translate-y-[2px]",
        orangeText: "text-[#FF6B00] hover:text-[#FF9A00] bg-transparent hover:bg-transparent p-0",

        // Water tracker variants
        blueOutline:
            "bg-[rgba(0,149,255,0.15)] border border-[rgba(0,149,255,0.3)] text-blue-400 hover:bg-[rgba(0,149,255,0.25)] transform hover:-translate-y-[2px]",

        // Dashboard variants
        ghost: "text-gray-400 hover:text-white hover:bg-[#333] bg-transparent",
        ghostOrange: "text-[#FF6B00] hover:text-[#FF9A00] hover:bg-transparent bg-transparent",
        subtle: "text-white/80 hover:text-white border border-[#444] hover:border-[#666] transform hover:-translate-y-[2px]",

        // Tab variants
        tab: "py-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap bg-transparent rounded-none",
    };

    const contentClasses = "flex items-center justify-center gap-2";

    return (
        <button
            className={cn(
                baseStyles,
                size === "compact" ? sizes.compact : sizes[size],
                variants[variant],
                variant === "tab" &&
                    (isActive ? "border-[#FF6B00] text-[#FF6B00]" : "border-transparent text-gray-400 hover:text-white"),
                fullWidth && "w-full",
                className
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

            {/* Loading spinner overlay */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
            )}
        </button>
    );
};
