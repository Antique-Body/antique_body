"use client";

import { ThemeContext } from "@/app/utils/themeConfig";
import { useContext } from "react";

export const Text = ({
  children,
  variant = "body",
  className = "",
  style = {},
  color = "primary",
  weight = "normal",
  align = "left",
  size = "base",
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  // Size variations
  const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  // Weight variations
  const weights = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  // Alignment variations
  const alignments = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "h1":
        return {
          fontSize: "2.5rem",
          fontWeight: 700,
          lineHeight: 1.2,
          color: theme.colors.text.primary,
        };
      case "h2":
        return {
          fontSize: "2rem",
          fontWeight: 600,
          lineHeight: 1.3,
          color: theme.colors.text.primary,
        };
      case "h3":
        return {
          fontSize: "1.75rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: theme.colors.text.primary,
        };
      case "h4":
        return {
          fontSize: "1.5rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: theme.colors.text.primary,
        };
      case "h5":
        return {
          fontSize: "1.25rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: theme.colors.text.primary,
        };
      case "h6":
        return {
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: 1.4,
          color: theme.colors.text.primary,
        };
      case "subtitle":
        return {
          fontSize: "1.125rem",
          fontWeight: 500,
          lineHeight: 1.5,
          color: theme.colors.text.secondary,
        };
      case "body":
        return {
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: theme.colors.text.primary,
        };
      case "caption":
        return {
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: theme.colors.text.secondary,
        };
      case "button":
        return {
          fontSize: "0.875rem",
          fontWeight: 500,
          lineHeight: 1.5,
          color: theme.colors.text.primary,
        };
      default:
        return {
          fontSize: "1rem",
          fontWeight: 400,
          lineHeight: 1.5,
          color: theme.colors.text.primary,
        };
    }
  };

  // Get color based on theme
  const getColor = () => {
    switch (color) {
      case "primary":
        return theme.colors.text.primary;
      case "secondary":
        return theme.colors.text.secondary;
      case "accent":
        return theme.colors.accent;
      default:
        return color;
    }
  };

  const baseStyles = {
    ...getVariantStyles(),
    color: getColor(),
    transition: `all 0.3s ${theme.design.animation}`,
  };

  return (
    <div
      className={`${sizes[size]} ${weights[weight]} ${alignments[align]} ${className}`}
      style={{ ...baseStyles, ...style }}
      {...props}
    >
      {children}
    </div>
  );
};
