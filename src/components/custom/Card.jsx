"use client";


export const Card = ({
  children,
  topBorderColor,
  width = "90%",
  maxWidth = "500px",
  padding = "40px 30px",
  bgGradientFrom = "#0f0f0f",
  bgGradientTo = "#1a1a1a",
  borderRadius = "15px",
  shadow = "0 15px 25px rgba(0,0,0,0.6)",
  borderColor = "#222",
  className = "",
  ...otherProps
}) => {
  return (
    <div
      className={`relative z-10 backdrop-blur-sm overflow-hidden ${className}`}
      style={{
        width: width,
        maxWidth: maxWidth,
        padding: padding,
        backgroundImage: `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`,
        borderRadius: borderRadius,
        boxShadow: shadow,
        border: `1px solid ${borderColor}`,
      }}
      {...otherProps}>
      {/* Optional top border */}
      {topBorderColor && (
        <div
          className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r bg-[length:200%_100%]"
          style={{
            backgroundImage: `linear-gradient(to right, ${topBorderColor}, ${
              topBorderColor === "#ff7800" ? "#ffa500" : topBorderColor
            }, ${topBorderColor})`,
          }}></div>
      )}
      {children}
    </div>
  );
};
