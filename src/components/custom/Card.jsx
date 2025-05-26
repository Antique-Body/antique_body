"use client";

import { BrandLogo } from "..";
import "../components.scss";

export const Card = ({
    children,
    topBorderColor,
    width = "90%",
    maxWidth,
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
    // Animation props
    animate = false,
    animationVariant = "fadeIn",
    // Additional style props
    glowEffect = false,
    glowColor = "#FF7800",
    glowIntensity = "0.2",
    borderWidth = "1px",
    backdropBlur = "",
    hoverScale = "",
    textGradient = false,
    // New props for border radius control
    noTopRightRadius = false,
    noBottomRightRadius = false,
    noTopLeftRadius = false,
    noBottomLeftRadius = false,
    // Remove these props from being passed to DOM
    ...otherProps
}) => {
    // Remove any remaining custom props that shouldn't go to DOM
    const { accentColor: _, ...finalProps } = otherProps;

    // Set styles based on variant
    let variantClassName = "";

    // Animation variants
    const animationVariants = {
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
        },
        slideUp: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        },
        slideIn: {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        },
        scale: {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        },
        pulse: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { duration: 0.5 },
                boxShadow: `0 0 20px rgba(255,120,0,${glowIntensity})`,
            },
        },
    };

    if (variant === "clientCard") {
        // Client card styling
        borderColor = "#2a2a2a";
        bgGradientFrom = "rgba(17,17,17,0.8)";
        bgGradientTo = "rgba(24,24,24,0.9)";
        borderTop = false;
        padding = "12px"; // No padding to allow for custom inner layout
        borderRadius = "14px";
        shadow = "0 8px 16px rgba(0,0,0,0.2)";
        variantClassName = "z-20 backdrop-blur-sm transition-all duration-300";

        // Apply hover effects if hover prop is true
        if (hover) {
            hoverBorderColor = hoverBorderColor || "#FF6B00";
            hoverShadow = hoverShadow || "0 12px 24px rgba(0,0,0,0.3), 0 6px 12px rgba(255,107,0,0.1)";
            hoverBgGradientFrom = "rgba(22,22,22,0.9)";
            hoverBgGradientTo = "rgba(28,28,28,0.95)";
        }
    } else if (variant === "darkStrong") {
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
        // maxWidth = "100%";
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
        hoverTranslateY = "-2px";
        hoverBorderColor = "#FF6B00";
        hoverBgGradientFrom = "rgba(25,25,25,0.6)";
        hoverBgGradientTo = "rgba(28,28,28,0.6)";
        hoverShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
        variantClassName = "text-center cursor-pointer border border-dashed transition-all duration-300";
    } else if (variant === "glass") {
        // New glass morphism card style
        borderColor = "rgba(255,255,255,0.1)";
        bgGradientFrom = "rgba(18,18,18,0.6)";
        bgGradientTo = "rgba(24,24,24,0.6)";
        backdropBlur = "md";
        borderRadius = "20px";
        shadow = "0 10px 30px rgba(0,0,0,0.1)";
        hoverBorderColor = "rgba(255,120,0,0.5)";
        hoverShadow = "0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(255,120,0,0.1)";
        variantClassName = "backdrop-blur-md";
    } else if (variant === "premium") {
        // Premium card with gold accent
        borderColor = "#3a3a3a";
        bgGradientFrom = "rgba(28,28,28,0.95)";
        bgGradientTo = "rgba(24,24,24,0.95)";
        borderRadius = "16px";
        shadow = "0 10px 25px rgba(0,0,0,0.4)";
        padding = "24px";
        glowEffect = true;
        glowColor = "rgba(255,185,0,0.15)";
        variantClassName = "relative overflow-hidden";
    } else {
        // Default card styling improvements
        borderRadius = "16px";
        shadow = "0 10px 20px rgba(0,0,0,0.3)";
        bgGradientFrom = "rgba(18,18,18,0.95)";
        bgGradientTo = "rgba(24,24,24,0.95)";
        variantClassName = "backdrop-blur-sm";

        if (hover) {
            hoverTranslateY = "-3px";
            hoverBorderColor = "#FF7800";
            hoverShadow = "0 15px 30px rgba(0,0,0,0.4), 0 5px 15px rgba(255,120,0,0.15)";
            hoverBgGradientFrom = "rgba(22,22,22,0.95)";
            hoverBgGradientTo = "rgba(28,28,28,0.95)";
            variantClassName += " transition-all duration-300 ease-in-out";
        }
    }

    // If hover is true and no variant-specific hover effects are set
    if (hover && !hoverBorderColor) {
        hoverBorderColor = "#FF6B00";
        hoverShadow = "0 15px 30px -10px rgba(255,107,0,0.2)";
        variantClassName += " transition-all duration-300 ease-in-out";
    }

    // Add backdrop blur class if specified
    if (backdropBlur) {
        variantClassName += ` backdrop-blur-${backdropBlur}`;
    }

    // Add glow effect class if specified
    const glowStyles = glowEffect
        ? {
              boxShadow: `0 0 20px ${glowColor}`,
          }
        : {};

    // Calculate the Card component based on animation settings

    // Set animation props
    const animProps = animate
        ? {
              initial: "hidden",
              animate: "visible",
              variants: animationVariants[animationVariant] || animationVariants.fadeIn,
          }
        : {};

    // Calculate border radius string
    let borderRadiusValue = borderRadius;
    if (noTopLeftRadius && noTopRightRadius && noBottomRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `0px 0px 0px 0px`;
    } else if (noTopLeftRadius && noTopRightRadius && noBottomRightRadius) {
        borderRadiusValue = `0px 0px 0px ${borderRadius}`;
    } else if (noTopLeftRadius && noTopRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `0px 0px ${borderRadius} 0px`;
    } else if (noTopLeftRadius && noBottomRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `0px ${borderRadius} 0px 0px`;
    } else if (noTopRightRadius && noBottomRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `${borderRadius} 0px 0px 0px`;
    } else if (noTopLeftRadius && noTopRightRadius) {
        borderRadiusValue = `0px 0px ${borderRadius} ${borderRadius}`;
    } else if (noTopLeftRadius && noBottomRightRadius) {
        borderRadiusValue = `0px ${borderRadius} 0px ${borderRadius}`;
    } else if (noTopLeftRadius && noBottomLeftRadius) {
        borderRadiusValue = `0px ${borderRadius} ${borderRadius} 0px`;
    } else if (noTopRightRadius && noBottomRightRadius) {
        borderRadiusValue = `${borderRadius} 0px 0px ${borderRadius}`;
    } else if (noTopRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `${borderRadius} 0px ${borderRadius} 0px`;
    } else if (noBottomRightRadius && noBottomLeftRadius) {
        borderRadiusValue = `${borderRadius} ${borderRadius} 0px 0px`;
    } else if (noTopLeftRadius) {
        borderRadiusValue = `0px ${borderRadius} ${borderRadius} ${borderRadius}`;
    } else if (noTopRightRadius) {
        borderRadiusValue = `${borderRadius} 0px ${borderRadius} ${borderRadius}`;
    } else if (noBottomRightRadius) {
        borderRadiusValue = `${borderRadius} ${borderRadius} 0px ${borderRadius}`;
    } else if (noBottomLeftRadius) {
        borderRadiusValue = `${borderRadius} ${borderRadius} ${borderRadius} 0px`;
    }

    return (
        <div
            className={`relative z-10 flex flex-col ${
                variant?.startsWith("dark")
                    ? ""
                    : variant === "entityCard"
                    ? "text-left"
                    : variant === "planCard" || variant === "createPlanCard" || variant === "clientCard"
                    ? "text-left"
                    : "items-center text-center"
            } overflow-hidden ${variantClassName} ${className} min-h-max ${
                hoverTranslateY ? `hover:translate-y-[${hoverTranslateY}]` : ""
            } transition-all duration-300`}
            style={{
                width: width,
                maxWidth: maxWidth,
                padding: padding,
                backgroundImage: `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`,
                borderRadius: borderRadiusValue,
                boxShadow: shadow,
                border: `${borderWidth} solid ${borderColor}`,
                "--hover-border-color": hoverBorderColor || borderColor,
                "--hover-shadow": hoverShadow || shadow,
                "--hover-bg-from": hoverBgGradientFrom || bgGradientFrom,
                "--hover-bg-to": hoverBgGradientTo || bgGradientTo,
                "--hover-scale": hoverScale || "1",
                transition: "all 0.3s ease",
                ...glowStyles,
            }}
            onMouseEnter={(e) => {
                if (hoverBorderColor) e.currentTarget.style.borderColor = hoverBorderColor;
                if (hoverShadow) e.currentTarget.style.boxShadow = hoverShadow;
                if (hoverBgGradientFrom && hoverBgGradientTo) {
                    e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${hoverBgGradientFrom}, ${hoverBgGradientTo})`;
                }
                if (hoverTranslateY) {
                    e.currentTarget.style.transform = `translateY(${hoverTranslateY})`;
                }
                if (hoverScale) {
                    e.currentTarget.style.transform = `scale(${hoverScale}) ${
                        hoverTranslateY ? `translateY(${hoverTranslateY})` : ""
                    }`;
                }
                if (glowEffect) {
                    e.currentTarget.style.boxShadow = `0 0 30px ${glowColor}`;
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = borderColor;
                e.currentTarget.style.boxShadow = shadow;
                e.currentTarget.style.backgroundImage = `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientTo})`;
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                if (glowEffect) {
                    e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}`;
                }
            }}
            {...animProps}
            {...finalProps}
        >
            {borderTop && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7800] via-[#FFA500] to-[#FF7800] marble-effect" />
            )}

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

            {/* Wrap children with text gradient if enabled */}
            {textGradient ? (
                <div className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                    {children}
                </div>
            ) : (
                children
            )}
        </div>
    );
};

