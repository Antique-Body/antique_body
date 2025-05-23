"use client";

import { ThemeContext } from "@/app/utils/themeConfig";
import { useContext } from "react";
import { BrandLogo } from "..";
import "../components.scss";

export const Card = ({
  children,
  variant = "default",
  className = "",
  borderTop = true,
  showLogo = false,
  logoTagline = "",
  hover = false,
  elevation = "md",
  ...props
}) => {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || {
    colors: {
      primary: "#FF6B00",
      secondary: "#FF8C00",
      accent: "#FFA500",
      background: {
        light: "#1A1A1A",
        dark: "#121212",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#A0A0A0",
      },
      border: "#333333",
    },
    design: {
      borderRadius: "8px",
      shadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      animation: "ease-in-out",
    },
  };

  // Shadow intensity based on elevation
  const elevationShadows = {
    none: "none",
    sm: `0 4px 8px ${theme.colors.background.dark}20`,
    md: `0 8px 16px ${theme.colors.background.dark}25`,
    lg: `0 12px 24px ${theme.colors.background.dark}30`,
    xl: `0 20px 30px ${theme.colors.background.dark}40`,
  };

  // Base styles
  const baseStyles = {
    backgroundColor: theme.colors.background.light,
    borderColor: theme.colors.border,
    borderRadius: theme.design.borderRadius,
    boxShadow: elevationShadows[elevation],
    transition: `all 0.4s ${theme.design.animation}`,
    position: "relative",
    overflow: "hidden",
    border: "1px solid transparent",
  };

  // Variant styles
  const variantStyles = {
    default: {
      padding: "24px",
      backgroundColor: theme.colors.background.light,
    },
    dark: {
      backgroundColor: theme.colors.background.dark,
      padding: "24px",
      border: `1px solid ${theme.colors.background.dark}`,
    },
    glass: {
      backgroundColor: `${theme.colors.background.light}99`,
      backdropFilter: "blur(12px)",
      padding: "24px",
      border: `1px solid ${theme.colors.background.light}30`,
    },
    premium: {
      padding: "32px",
      border: `2px solid ${theme.colors.accent}40`,
      boxShadow: `0 15px 30px ${theme.colors.accent}30`,
      background: `linear-gradient(135deg, ${theme.colors.background.dark} 0%, ${theme.colors.background.light} 100%)`,
    },
    highlight: {
      padding: "24px",
      border: `1px solid ${theme.colors.primary}30`,
      boxShadow: `0 12px 24px ${theme.colors.primary}20`,
      background: `linear-gradient(145deg, ${theme.colors.background.light}, ${theme.colors.background.dark})`,
    },
  };

  // Hover styles
  const hoverStyles = hover
    ? {
        transform: "translateY(-6px)",
        boxShadow: `0 20px 30px ${theme.colors.primary}25`,
        borderColor: `${theme.colors.primary}50`,
      }
    : {};

  return (
    <div
      className={`card-component relative ${className}`}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...hoverStyles,
      }}
      {...props}
    >
      {/* Subtle background gradient for premium and highlight variants */}
      {(variant === "premium" || variant === "highlight") && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              variant === "premium"
                ? `radial-gradient(circle at top right, ${theme.colors.accent}, transparent 70%)`
                : `radial-gradient(circle at top right, ${theme.colors.primary}, transparent 70%)`,
          }}
        />
      )}

      {borderTop && (
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{
            background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})`,
            borderTopLeftRadius: theme.design.borderRadius,
            borderTopRightRadius: theme.design.borderRadius,
          }}
        />
      )}

      {/* Inner border effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          borderRadius: `calc(${theme.design.borderRadius} - 1px)`,
          border:
            variant === "glass"
              ? `1px solid ${theme.colors.primary}10`
              : `1px solid ${theme.colors.background.dark}10`,
          opacity: 0.5,
        }}
      />

      {showLogo && (
        <div className="mb-6 text-center relative z-10">
          <BrandLogo />
          {logoTagline && (
            <p
              className="mt-2 text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              {logoTagline}
            </p>
          )}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
