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
  // Hover props
  hoverTranslateY = "",
  hoverBorderColor = "",
  hoverShadow = "",
  hoverBgGradientFrom = "",
  hoverBgGradientTo = "",
  ...otherProps
}) => {
  return (
    <div
      className={`relative z-10 backdrop-blur-sm overflow-hidden flex flex-col items-center text-center ${className} min-h-max ${
        hoverTranslateY && `hover:translate-y-[${hoverTranslateY}]`
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
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        if (hoverBorderColor) e.currentTarget.style.borderColor = hoverBorderColor;
        if (hoverShadow) e.currentTarget.style.boxShadow = hoverShadow;
        if (hoverBgGradientFrom && hoverBgGradientTo) {
          e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${hoverBgGradientFrom}, ${hoverBgGradientTo})`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = shadow;
        e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`;
      }}
      {...otherProps}>
      {borderTop && <div className="marble-effect"></div>}

      {topBorderColor && (
        <div
          className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r bg-[length:200%_100%]"
          style={{
            backgroundImage: `linear-gradient(to right, ${topBorderColor}, ${
              topBorderColor === "#ff7800" ? "#ffa500" : topBorderColor
            }, ${topBorderColor})`,
          }}></div>
      )}

      {showLogo && <BrandLogo logoTagline={logoTagline} />}

      {children}
    </div>
  );
};