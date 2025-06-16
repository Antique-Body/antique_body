"use client";

import { cn } from "@/lib/utils";

export const Text = ({
  children,
  variant = "body",
  size,
  weight = "normal",
  color = "default",
  className = "",
  gradient = false,
  gradientFrom = "#FF7800",
  gradientTo = "#FF9A00",
  truncate = false,
  as: Component = "p",
  ...props
}) => {
  // Size variations
  const sizes = {
    // Heading sizes
    h1: "text-4xl md:text-5xl",
    h2: "text-3xl md:text-4xl",
    h3: "text-2xl md:text-3xl",
    h4: "text-xl md:text-2xl",
    h5: "text-lg md:text-xl",
    h6: "text-base md:text-lg",

    // Body text sizes
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  // Font weight variations
  const weights = {
    thin: "font-thin",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  // Color variations
  const colors = {
    default: "text-white",
    muted: "text-white/80",
    subtle: "text-gray-400",
    primary: "text-[#FF7800]",
    secondary: "text-[#FF9A00]",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-500",
    info: "text-blue-400",
  };

  // Variant presets
  const variants = {
    h1: `${sizes.h1} ${weights.bold} tracking-tight`,
    h2: `${sizes.h2} ${weights.bold} tracking-tight`,
    h3: `${sizes.h3} ${weights.semibold}`,
    h4: `${sizes.h4} ${weights.semibold}`,
    h5: `${sizes.h5} ${weights.semibold}`,
    h6: `${sizes.h6} ${weights.semibold}`,
    body: `${sizes.base} ${weights.normal}`,
    bodyLarge: `${sizes.lg} ${weights.normal}`,
    bodySmall: `${sizes.sm} ${weights.normal}`,
    caption: `${sizes.xs} ${weights.normal}`,
    label: `${sizes.sm} ${weights.medium}`,
  };

  // Determine the appropriate component based on variant
  let ElementType = Component;
  if (!Component || Component === "p") {
    if (variant === "h1") ElementType = "h1";
    else if (variant === "h2") ElementType = "h2";
    else if (variant === "h3") ElementType = "h3";
    else if (variant === "h4") ElementType = "h4";
    else if (variant === "h5") ElementType = "h5";
    else if (variant === "h6") ElementType = "h6";
    else ElementType = "p";
  }

  return (
    <ElementType
      className={cn(
        variants[variant],
        size && sizes[size],
        weight !== "normal" && weights[weight],
        color !== "default" && colors[color],
        truncate && "truncate",
        gradient && "bg-clip-text text-transparent",
        className
      )}
      style={
        gradient
          ? {
              backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
            }
          : {}
      }
      {...props}
    >
      {children}
    </ElementType>
  );
};
