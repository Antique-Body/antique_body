"use client";
import { ThemeContext } from "@/app/utils/themeConfig";
import { cn } from "@/lib/utils";
import { useContext } from "react";

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
  const { theme } = useContext(ThemeContext);

  // Base styles applied to all buttons
  const baseStyles = `font-medium cursor-pointer transition-all relative focus:outline-none focus:ring-2 focus:ring-opacity-50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none`;

  // Size variations
  const sizes = {
    small: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base font-semibold",
    compact: "min-w-[50px] h-[36px] px-2.5 py-1.5 text-xs",
  };

  // Make sure we can access the necessary styles
  if (!theme) {
    return null;
  }

  // Custom styles with inline styling for theme properties
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          color: "#FFFFFF",
          border: "none",
          boxShadow: `0 4px 12px ${theme.colors.primary}40`,
          transition: `all 0.3s ${theme.design.animation}`,
          borderRadius: theme.design.borderRadius,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.background.light,
          color: theme.colors.text.primary,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 4px 12px ${theme.colors.background.dark}20`,
          transition: `all 0.3s ${theme.design.animation}`,
          borderRadius: theme.design.borderRadius,
        };
      case "outline":
        return {
          backgroundColor: `${theme.colors.primary}10`,
          color: theme.colors.primary,
          border: `1.5px solid ${theme.colors.primary}`,
          boxShadow: `0 2px 8px ${theme.colors.primary}20`,
          transition: `all 0.3s ${theme.design.animation}`,
          borderRadius: theme.design.borderRadius,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: theme.colors.text.secondary,
          border: "none",
          transition: `all 0.3s ${theme.design.animation}`,
          "&:hover": {
            backgroundColor: `${theme.colors.primary}15`,
          },
          borderRadius: theme.design.borderRadius,
        };
      case "accent":
        return {
          background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`,
          color: "#FFFFFF",
          border: "none",
          boxShadow: `0 4px 12px ${theme.colors.accent}40`,
          transition: `all 0.3s ${theme.design.animation}`,
          borderRadius: theme.design.borderRadius,
        };
      case "tab":
        return {
          backgroundColor: "transparent",
          color: isActive ? theme.colors.primary : theme.colors.text.secondary,
          borderBottom: isActive ? `2px solid ${theme.colors.primary}` : "none",
          borderRadius: "0",
          transition: `all 0.3s ${theme.design.animation}`,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          color: "#FFFFFF",
          border: "none",
          boxShadow: `0 4px 12px ${theme.colors.primary}40`,
          transition: `all 0.3s ${theme.design.animation}`,
          borderRadius: theme.design.borderRadius,
        };
    }
  };

  const getHoverStyles = () => {
    if (disabled || loading) return {};

    switch (variant) {
      case "primary":
        return {
          ":hover": {
            boxShadow: `0 6px 16px ${theme.colors.primary}60`,
            transform: "translateY(-2px)",
            filter: "brightness(1.05)",
          },
        };
      case "secondary":
        return {
          ":hover": {
            boxShadow: `0 6px 16px ${theme.colors.background.dark}30`,
            transform: "translateY(-2px)",
            backgroundColor: `${theme.colors.background.light}ee`,
          },
        };
      case "outline":
        return {
          ":hover": {
            boxShadow: `0 4px 12px ${theme.colors.primary}30`,
            transform: "translateY(-2px)",
            backgroundColor: `${theme.colors.primary}20`,
          },
        };
      case "ghost":
        return {
          ":hover": {
            backgroundColor: `${theme.colors.primary}15`,
            color: theme.colors.primary,
          },
        };
      case "accent":
        return {
          ":hover": {
            boxShadow: `0 6px 16px ${theme.colors.accent}60`,
            transform: "translateY(-2px)",
            filter: "brightness(1.05)",
          },
        };
      case "tab":
        return {
          ":hover": {
            color: theme.colors.primary,
          },
        };
      default:
        return {
          ":hover": {
            boxShadow: `0 6px 16px ${theme.colors.primary}60`,
            transform: "translateY(-2px)",
          },
        };
    }
  };

  const contentClasses = "flex items-center justify-center gap-1.5";
  const variantStyles = getVariantStyles();
  const hoverStyles = getHoverStyles();

  return (
    <button
      className={cn(
        baseStyles,
        size === "compact" ? sizes.compact : sizes[size],
        fullWidth && "w-full",
        className
      )}
      style={{
        ...variantStyles,
        ...hoverStyles,
        transform: disabled || loading ? "none" : undefined,
        cursor: disabled ? "not-allowed" : loading ? "wait" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {/* Visible content */}
      <div className={contentClasses} style={{ opacity: loading ? 0.5 : 1 }}>
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>

      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor:
                variant === "outline" ? theme.colors.primary : "#FFFFFF",
              borderTopColor: "transparent",
            }}
          ></div>
        </div>
      )}

      {/* Subtle gradient overlay for depth */}
      {(variant === "primary" || variant === "accent") && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-[inherit]"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)`,
            borderRadius: "inherit",
          }}
        />
      )}
    </button>
  );
};
