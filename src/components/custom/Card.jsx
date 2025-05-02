"use client";

import { BrandLogo } from "..";
import "../components.scss";

export const Card = ({
  children,
  topBorderColor,
  width = "90%",
  maxWidth = "500px",
  padding = "30px 30px",
  bgGradientFrom = "#0f0f0f",
  bgGradientTo = "#1a1a1a",
  borderRadius = "15px",
  shadow = "0 15px 25px rgba(0,0,0,0.6)",
  borderColor = "#222",
  className = "",
  borderTop = true,
  showLogo = false,
  logoTagline = "",
  // New variant and hover props
  variant,
  hover = false,
  // Hover props
  hoverTranslateY = "",
  hoverBorderColor = "",
  hoverShadow = "",
  hoverBgGradientFrom = "",
  hoverBgGradientTo = "",
  ...otherProps
}) => {
  // Set styles based on variant
  let variantClassName = "";

  if (variant === "darkStrong") {
    // Base dashboard styling
    borderColor = "#222";
    bgGradientFrom = "rgba(20,20,20,0.95)";
    bgGradientTo = "rgba(20,20,20,0.95)";
    borderTop = false;
    padding = "24px"; // p-6
    borderRadius = "16px"; // rounded-2xl
    shadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"; // shadow-lg
    variantClassName = "z-30 backdrop-blur-lg";

    // Apply hover effects if hover prop is true
    if (hover && !hoverBorderColor) {
      hoverBorderColor = "#FF6B00";
      hoverShadow = "0 15px 30px -10px rgba(255,107,0,0.2)";
      variantClassName += " transition-all duration-300 ease-in-out";
    }
  } else if (variant === "dark") {
    // New dark variant styling
    borderColor = "#333";
    bgGradientFrom = "rgba(30,30,30,0.8)";
    bgGradientTo = "rgba(30,30,30,0.8)";
    borderTop = false;
    padding = "16px"; // p-4
    borderRadius = "16px"; // rounded-2xl
    shadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"; // shadow-lg
    variantClassName = "backdrop-blur-lg";

    // Apply hover effects if hover prop is true
    if (hover && !hoverBorderColor) {
      hoverBorderColor = "#FF6B00";
      hoverShadow = "0 15px 30px -10px rgba(255,107,0,0.2)";
      variantClassName += " transition-all duration-300 ease-in-out";
    }
  } else if (variant === "entityCard") {
    // Trainer card specific styling
    borderColor = "#333";
    bgGradientFrom = "rgba(30,30,30,0.8)";
    bgGradientTo = "rgba(30,30,30,0.8)";
    borderTop = false;
    padding = "20px"; // p-5
    borderRadius = "16px"; // rounded-2xl
    shadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"; // shadow-lg
    hoverTranslateY = "-3px";
    hoverBorderColor = "#FF6B00";
    hoverShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"; // shadow-xl
    variantClassName =
      "flex flex-row gap-5 overflow-hidden relative w-full max-w-full md:w-[calc(50%-10px)] md:min-w-[450px] transition-all duration-300 group";
  } else if (variant === "planCard") {
    // Specific styling for plan cards based on the screenshots
    borderColor = "#333";
    bgGradientFrom = "rgba(20,20,20,0.95)";
    bgGradientTo = "rgba(22,22,22,0.95)";
    borderTop = false;
    padding = "0"; // No padding to allow for custom inner layout
    borderRadius = "12px";
    shadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
    width = "100%";
    maxWidth = "100%";
    hoverTranslateY = "-2px";
    hoverBorderColor = "#FF6B00";
    hoverShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
    variantClassName = "text-left overflow-hidden relative transition-all duration-300";
  } else if (variant === "createPlanCard") {
    // Styling for the "Create New Plan" card
    borderColor = "#333";
    bgGradientFrom = "rgba(20,20,20,0.5)";
    bgGradientTo = "rgba(22,22,22,0.5)";
    borderTop = false;
    padding = "24px";
    borderRadius = "12px";
    shadow = "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)";
    width = "100%";
    maxWidth = "100%";
    hoverTranslateY = "-2px";
    hoverBorderColor = "#FF6B00";
    hoverBgGradientFrom = "rgba(25,25,25,0.6)";
    hoverBgGradientTo = "rgba(28,28,28,0.6)";
    hoverShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
    variantClassName = "text-center cursor-pointer border border-dashed transition-all duration-300";
  }

  // If hover is true and no variant-specific hover effects are set
  if (hover && !hoverBorderColor) {
    hoverBorderColor = "#FF6B00";
    hoverShadow = "0 15px 30px -10px rgba(255,107,0,0.2)";
    variantClassName += " transition-all duration-300 ease-in-out";
  }

  return (
    <div
      className={`relative z-10 flex flex-col ${variant?.startsWith("dark") ? "" : variant === "entityCard" ? "text-left" : variant === "planCard" || variant === "createPlanCard" ? "text-left" : "items-center text-center"} overflow-hidden ${variantClassName} ${className} min-h-max ${
        hoverTranslateY ? `hover:translate-y-[${hoverTranslateY}]` : ""
      } transition-all duration-300`}
      style={{
        width: width,
        maxWidth: maxWidth,
        padding: padding,
        backgroundImage: `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`,
        borderRadius: borderRadius,
        boxShadow: shadow,
        border: `1px solid ${borderColor}`,
        "--hover-border-color": hoverBorderColor || borderColor,
        "--hover-shadow": hoverShadow || shadow,
        "--hover-bg-from": hoverBgGradientFrom || bgGradientFrom,
        "--hover-bg-to": hoverBgGradientTo || bgGradientTo,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        if (hoverBorderColor) e.currentTarget.style.borderColor = hoverBorderColor;
        if (hoverShadow) e.currentTarget.style.boxShadow = hoverShadow;
        if (hoverBgGradientFrom && hoverBgGradientTo) {
          e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${hoverBgGradientFrom}, ${hoverBgGradientTo})`;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = shadow;
        e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`;
      }}
      {...otherProps}
    >
      {borderTop && <div className="marble-effect"></div>}

      {topBorderColor && (
        <div
          className="absolute left-0 top-0 h-[5px] w-full bg-gradient-to-r bg-[length:200%_100%]"
          style={{
            backgroundImage: `linear-gradient(to right, ${topBorderColor}, ${
              topBorderColor === "#ff7800" ? "#ffa500" : topBorderColor
            }, ${topBorderColor})`,
          }}
        ></div>
      )}

      {/* Add left orange bar for trainer card variant */}
      {variant === "entityCard" && (
        <div className="absolute left-0 top-0 h-full w-1 scale-y-[0.4] transform bg-[#FF6B00] transition-transform duration-300 ease-in-out hover:scale-y-100 group-hover:scale-y-100"></div>
      )}

      {/* Add left orange bar for plan card variant */}
      {variant === "planCard" && <div className="absolute left-0 top-0 h-full w-1 bg-[#FF6B00]"></div>}

      {showLogo && <BrandLogo logoTagline={logoTagline} />}

      {children}
    </div>
  );
};
