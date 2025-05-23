"use client";

import { useEffect, useState } from "react";
import { Button } from "../common/Button";
import { Text } from "../common/Text";
import { Card } from "./Card";

// Function to determine if a color is dark
const isDarkColor = (hexColor) => {
  // Remove hash if present
  const hex = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance using the formula for relative luminance
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if the color is dark (luminance < 0.5)
  return luminance < 0.5;
};

// Function to generate a contrasting text color
const getContrastingTextColor = (backgroundColor) => {
  return isDarkColor(backgroundColor) ? "#FFFFFF" : "#000000";
};

// Function to create a harmonized palette
const harmonizeColors = (primaryColor) => {
  // Remove hash if present
  const hex = primaryColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Create complementary color (shift hue by 180 degrees)
  // First convert RGB to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const delta = max - min;

  let h, s, l;
  l = (max + min) / 2;

  if (delta === 0) {
    h = 0;
    s = 0;
  } else {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    if (max === r / 255) {
      h = (g / 255 - b / 255) / delta + (g < b ? 6 : 0);
    } else if (max === g / 255) {
      h = (b / 255 - r / 255) / delta + 2;
    } else {
      h = (r / 255 - g / 255) / delta + 4;
    }

    h = h * 60;
  }

  // Create complementary (opposite) color
  let compH = (h + 180) % 360;

  // Create analogous colors (adjacent on color wheel)
  let analogous1H = (h + 30) % 360;
  let analogous2H = (h - 30 + 360) % 360;

  // Convert HSL back to RGB and then to hex
  function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  const complementary = rgbToHex(...hslToRgb(compH, s, l));
  const analogous1 = rgbToHex(...hslToRgb(analogous1H, s, l));
  const analogous2 = rgbToHex(...hslToRgb(analogous2H, s, l));

  // Create darker and lighter versions for backgrounds
  function adjustLuminance(color, factor) {
    const hex = color.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));

    return rgbToHex(r, g, b);
  }

  const darker = adjustLuminance(primaryColor, 0.2);
  const lighter = adjustLuminance(primaryColor, 1.8);

  return {
    primary: primaryColor,
    secondary: analogous1,
    accent: complementary,
    dark: darker,
    light: lighter,
    // Add text colors based on backgrounds
    textOnDark: getContrastingTextColor(darker),
    textOnLight: getContrastingTextColor(lighter),
  };
};

// Helper to safely update nested objects
const updateNestedObject = (obj, path, value) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
};

const ColorInput = ({ label, value, onChange, className = "", theme }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center justify-between">
      <label
        className="block text-sm font-medium flex items-center"
        style={{ color: theme.colors.text.primary }}
      >
        <div
          className="w-4 h-4 mr-2 rounded"
          style={{
            backgroundColor: value,
            boxShadow: `0 0 6px ${value}80`,
          }}
        />
        {label}
      </label>
      <span
        className="text-xs px-2 py-1 rounded font-mono"
        style={{
          color: value,
          backgroundColor: `rgba(0,0,0,0.3)`,
          border: `1px solid ${value}40`,
          boxShadow: `inset 0 0 3px ${value}40`,
        }}
      >
        {value}
      </span>
    </div>
    <div className="flex gap-3 items-center">
      <div className="relative group">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 opacity-0 absolute inset-0 cursor-pointer z-10"
        />
        <div
          className="w-12 h-12 rounded-lg overflow-hidden border shadow-inner group-hover:scale-105 transition transform"
          style={{
            borderColor: "rgba(255,255,255,0.1)",
            boxShadow: `0 0 10px ${value}60`,
          }}
        >
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: value,
            boxShadow: `0 0 5px ${value}`,
          }}
        />
      </div>
      <div className="relative flex-1 group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-opacity-10 focus:outline-none focus:ring transition-all font-mono text-sm"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            borderColor: value,
            color: theme.colors.text.primary,
            boxShadow: `0 0 0 1px ${value}40 inset`,
            border: `1px solid ${value}60`,
          }}
        />
        <div
          className="absolute inset-0 rounded-lg opacity-5 group-hover:opacity-10 pointer-events-none transition-opacity"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  </div>
);

const ColorGroup = ({ title, colors, onChange, theme }) => (
  <Card
    variant="dark"
    className="p-5 overflow-hidden"
    borderTop={false}
    elevation="sm"
    style={{
      background: `linear-gradient(145deg, ${theme.colors.background.dark}, ${
        theme.colors.background.dark === "#000000"
          ? "#111"
          : theme.colors.background.dark
      }ee)`,
      borderRadius: theme.design.borderRadius,
      border: `1px solid ${
        theme.colors.background.dark === "#000000"
          ? "#222222"
          : theme.colors.background.dark
      }`,
    }}
  >
    <h4
      className="text-sm font-medium mb-4 pb-3 border-b border-opacity-10 flex items-center"
      style={{
        borderColor: "rgba(255,255,255,0.1)",
        color: theme.colors.text.primary,
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: theme.colors.primary }}
      />
      {title}
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {colors.map((color) => (
        <ColorInput
          key={color.path}
          label={color.label}
          value={color.value}
          onChange={(value) => onChange(color.path, value)}
          theme={theme}
        />
      ))}
    </div>
  </Card>
);

// Add immediately after other utility functions
const createColorModeToggle = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="p-2 rounded-full bg-white/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="h-4 w-8 bg-gray-700 rounded-full relative">
        <div className="absolute inset-y-0 left-0 w-4 h-4 bg-white rounded-full transform transition-transform"></div>
      </div>
      <div className="p-2 rounded-full bg-black/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-blue-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </div>
  );
};

export const ThemeCustomizer = ({
  customTheme,
  onColorChange,
  onApply,
  isLoading,
  selectorTheme,
}) => {
  // Use passed selectorTheme or default to orange theme
  const uiTheme = selectorTheme || {
    colors: {
      primary: "#FF7800",
      secondary: "#FF5F00",
      accent: "#FFB800",
      background: {
        light: "#1a1a1a",
        dark: "#0a0a0a",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#CCCCCC",
      },
      border: "#333333",
    },
    design: {
      borderRadius: "16px",
      shadow: "0 10px 20px rgba(0,0,0,0.3)",
      animation: "ease-in-out",
    },
  };

  const [activeTab, setActiveTab] = useState("colors");
  const [previewTheme, setPreviewTheme] = useState(customTheme);
  const [suggestedColors, setSuggestedColors] = useState(null);
  const [colorMode, setColorMode] = useState("dark"); // "dark" or "light"
  const [harmonizationLevel, setHarmonizationLevel] = useState(50); // 0-100
  const [originalTheme, setOriginalTheme] = useState(customTheme); // Store original theme

  // Update preview theme whenever customTheme changes
  useEffect(() => {
    setPreviewTheme(customTheme);
    setOriginalTheme(customTheme); // Store the original theme when it changes
  }, [customTheme]);

  // Generate suggested colors when primary color changes
  useEffect(() => {
    if (customTheme?.colors?.primary) {
      const newSuggestedColors = harmonizeColors(customTheme.colors.primary);
      setSuggestedColors(newSuggestedColors);
    }
  }, [customTheme?.colors?.primary]);

  const handleColorChange = (path, value) => {
    // Create a new theme object with the updated value
    const updatedTheme = {
      ...customTheme,
      colors: {
        ...customTheme.colors,
        [path.split(".")[1]]:
          path.split(".").length === 2
            ? value
            : {
                ...customTheme.colors[path.split(".")[1]],
                [path.split(".")[2]]:
                  path.split(".").length === 3
                    ? value
                    : {
                        ...customTheme.colors[path.split(".")[1]][
                          path.split(".")[2]
                        ],
                        [path.split(".")[3]]: value,
                      },
              },
      },
    };

    // Update the preview theme immediately for better UX
    setPreviewTheme(updatedTheme);

    // Call the parent's onColorChange to update the theme
    onColorChange(path, value);
  };

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    const newMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newMode);

    // Swap background colors
    const darkBg = customTheme.colors.background.dark;
    const lightBg = customTheme.colors.background.light;

    // In light mode, light background becomes main background
    if (newMode === "light") {
      handleColorChange("colors.background.dark", lightBg);
      handleColorChange("colors.background.light", "#FFFFFF");
      // Adjust text colors for light mode
      handleColorChange("colors.text.primary", "#000000");
      handleColorChange("colors.text.secondary", "#666666");
    } else {
      // In dark mode, dark background is main background
      handleColorChange("colors.background.dark", "#0A0A0A");
      handleColorChange("colors.background.light", darkBg);
      // Adjust text colors for dark mode
      handleColorChange("colors.text.primary", "#FFFFFF");
      handleColorChange("colors.text.secondary", "#CCCCCC");
    }
  };

  // Apply suggested harmonious palette with enhanced control
  const applyHarmonizedColors = () => {
    if (!suggestedColors || !customTheme) return;

    // Calculate strength of harmonization (0-100%)
    const strength = harmonizationLevel / 100;

    // Blend current colors with harmonized ones based on strength
    const blendColor = (color1, color2, ratio) => {
      // Remove hash and convert to RGB
      const hex1 = color1.replace("#", "");
      const hex2 = color2.replace("#", "");

      const r1 = parseInt(hex1.substring(0, 2), 16);
      const g1 = parseInt(hex1.substring(2, 4), 16);
      const b1 = parseInt(hex1.substring(4, 6), 16);

      const r2 = parseInt(hex2.substring(0, 2), 16);
      const g2 = parseInt(hex2.substring(2, 4), 16);
      const b2 = parseInt(hex2.substring(4, 6), 16);

      // Blend RGB values based on ratio
      const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio);

      // Convert back to hex
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
    };

    // Create a new theme object with harmonized colors
    const harmonizedTheme = {
      ...customTheme,
      colors: {
        primary: blendColor(
          customTheme.colors.primary,
          suggestedColors.primary,
          strength
        ),
        secondary: blendColor(
          customTheme.colors.secondary,
          suggestedColors.secondary,
          strength
        ),
        accent: blendColor(
          customTheme.colors.accent,
          suggestedColors.accent,
          strength
        ),
        background: {
          dark: blendColor(
            customTheme.colors.background.dark,
            suggestedColors.dark,
            strength
          ),
          light: blendColor(
            customTheme.colors.background.light,
            suggestedColors.light,
            strength
          ),
        },
        text: {
          primary: getContrastingTextColor(
            blendColor(
              customTheme.colors.background.dark,
              suggestedColors.dark,
              strength
            )
          ),
          secondary:
            getContrastingTextColor(
              blendColor(
                customTheme.colors.background.dark,
                suggestedColors.dark,
                strength
              )
            ) === "#FFFFFF"
              ? "#CCCCCC"
              : "#666666",
        },
        border: isDarkColor(
          blendColor(
            customTheme.colors.background.dark,
            suggestedColors.dark,
            strength
          )
        )
          ? "#333333"
          : "#DDDDDD",
      },
    };

    // Update preview theme immediately
    setPreviewTheme(harmonizedTheme);

    // Update the theme through the parent component
    onColorChange("colors", harmonizedTheme.colors);
  };

  // Update the handleDiscardChanges function
  const handleDiscardChanges = async () => {
    console.log("Discard Changes clicked");

    try {
      // Fetch the last saved theme from the database
      const response = await fetch("/api/theme");
      if (!response.ok) {
        throw new Error("Failed to fetch saved theme");
      }

      const savedTheme = await response.json();
      console.log("Fetched saved theme:", savedTheme);

      // Update the preview theme immediately
      setPreviewTheme(savedTheme);

      // Create a complete theme update object
      const completeThemeUpdate = {
        name: savedTheme.name,
        colors: {
          primary: savedTheme.colors.primary,
          secondary: savedTheme.colors.secondary,
          accent: savedTheme.colors.accent,
          border: savedTheme.colors.border,
          background: {
            light: savedTheme.colors.background.light,
            dark: savedTheme.colors.background.dark,
          },
          text: {
            primary: savedTheme.colors.text.primary,
            secondary: savedTheme.colors.text.secondary,
          },
        },
        design: {
          borderRadius: savedTheme.design.borderRadius,
          shadow: savedTheme.design.shadow,
          animation: savedTheme.design.animation,
        },
      };

      console.log("Complete theme update:", completeThemeUpdate);

      // Update the parent component's theme
      onColorChange("theme", completeThemeUpdate);

      // Reset harmonization level
      setHarmonizationLevel(50);

      // Force a re-render of the color inputs
      setSuggestedColors(null);

      // Regenerate suggested colors
      if (savedTheme?.colors?.primary) {
        const newSuggestedColors = harmonizeColors(savedTheme.colors.primary);
        setSuggestedColors(newSuggestedColors);
      }
    } catch (error) {
      console.error("Error resetting theme:", error);
    }
  };

  // Group colors for easier management
  const mainColors = [
    {
      label: "Primary",
      path: "colors.primary",
      value: customTheme.colors.primary,
    },
    {
      label: "Secondary",
      path: "colors.secondary",
      value: customTheme.colors.secondary,
    },
    {
      label: "Accent",
      path: "colors.accent",
      value: customTheme.colors.accent,
    },
    {
      label: "Border",
      path: "colors.border",
      value: customTheme.colors.border,
    },
  ];

  const backgroundColors = [
    {
      label: "Light Background",
      path: "colors.background.light",
      value: customTheme.colors.background.light,
    },
    {
      label: "Dark Background",
      path: "colors.background.dark",
      value: customTheme.colors.background.dark,
    },
  ];

  const textColors = [
    {
      label: "Primary Text",
      path: "colors.text.primary",
      value: customTheme.colors.text.primary,
    },
    {
      label: "Secondary Text",
      path: "colors.text.secondary",
      value: customTheme.colors.text.secondary,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div
        className="flex space-x-1 p-1.5 rounded-lg relative overflow-hidden"
        style={{
          backgroundColor: `${uiTheme.colors.background.dark}`,
          border: `1px solid ${
            uiTheme.colors.background.dark === "#000000"
              ? "#222222"
              : uiTheme.colors.background.dark
          }`,
          boxShadow: `0 4px 10px rgba(0,0,0,0.2)`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at right bottom, ${uiTheme.colors.primary}10, transparent 70%)`,
          }}
        />
        <Button
          variant={activeTab === "colors" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveTab("colors")}
          className="text-sm flex-1 relative z-10"
          style={
            activeTab === "colors"
              ? {
                  background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                  color: "#FFFFFF",
                  boxShadow: `0 2px 8px ${uiTheme.colors.primary}40`,
                }
              : {
                  color: uiTheme.colors.text.secondary,
                  backgroundColor:
                    activeTab !== "colors"
                      ? `${uiTheme.colors.background.dark}80`
                      : "transparent",
                }
          }
        >
          <Text
            variant="button"
            color={activeTab === "colors" ? "primary" : "secondary"}
          >
            <div className="flex items-center justify-center">
              <span className="mr-1.5">🎨</span>
              Colors
            </div>
          </Text>
        </Button>
        <Button
          variant={activeTab === "design" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveTab("design")}
          className="text-sm flex-1 relative z-10"
          style={
            activeTab === "design"
              ? {
                  background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                  color: "#FFFFFF",
                  boxShadow: `0 2px 8px ${uiTheme.colors.primary}40`,
                }
              : {
                  color: uiTheme.colors.text.secondary,
                  backgroundColor:
                    activeTab !== "design"
                      ? `${uiTheme.colors.background.dark}80`
                      : "transparent",
                }
          }
        >
          <Text
            variant="button"
            color={activeTab === "design" ? "primary" : "secondary"}
          >
            <div className="flex items-center justify-center">
              <span className="mr-1.5">✨</span>
              Design
            </div>
          </Text>
        </Button>
        <Button
          variant={activeTab === "preview" ? "primary" : "ghost"}
          size="small"
          onClick={() => setActiveTab("preview")}
          className="text-sm flex-1 relative z-10"
          style={
            activeTab === "preview"
              ? {
                  background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                  color: "#FFFFFF",
                  boxShadow: `0 2px 8px ${uiTheme.colors.primary}40`,
                }
              : {
                  color: uiTheme.colors.text.secondary,
                  backgroundColor:
                    activeTab !== "preview"
                      ? `${uiTheme.colors.background.dark}80`
                      : "transparent",
                }
          }
        >
          <Text
            variant="button"
            color={activeTab === "preview" ? "primary" : "secondary"}
          >
            <div className="flex items-center justify-center">
              <span className="mr-1.5">👁️</span>
              Preview
            </div>
          </Text>
        </Button>
      </div>

      {/* Colors Tab Content */}
      {activeTab === "colors" && (
        <div className="space-y-6">
          {/* Color preview strip */}
          <div className="flex rounded-xl overflow-hidden mb-4 h-14 relative">
            <div
              className="h-full flex-1 relative overflow-hidden"
              style={{ background: customTheme.colors.primary }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white text-shadow">
                  PRIMARY
                </span>
              </div>
            </div>
            <div
              className="h-full flex-1 relative overflow-hidden"
              style={{ background: customTheme.colors.secondary }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white text-shadow">
                  SECONDARY
                </span>
              </div>
            </div>
            <div
              className="h-full flex-1 relative overflow-hidden"
              style={{ background: customTheme.colors.accent }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white text-shadow">
                  ACCENT
                </span>
              </div>
            </div>
          </div>

          {/* Dark/Light Mode Toggle */}
          <div
            className="p-5 rounded-lg flex items-center justify-between relative overflow-hidden"
            style={{
              backgroundColor: `rgba(255,255,255,0.05)`,
              borderRadius: uiTheme.design.borderRadius,
              border: `1px solid ${uiTheme.colors.border}40`,
              boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
            }}
          >
            {/* Gradient header */}
            <div
              className="absolute top-0 left-0 h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
              }}
            />

            <div className="flex items-center relative z-10">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-lg"
                style={{
                  background:
                    colorMode === "dark"
                      ? `linear-gradient(135deg, #1E293B, #334155)`
                      : `linear-gradient(135deg, #FDB813, #F5E050)`,
                }}
              >
                {colorMode === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FDB813"
                    className="w-5 h-5"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                )}
              </div>
              <div>
                <div
                  className="font-medium text-base"
                  style={{ color: uiTheme.colors.text.primary }}
                >
                  {colorMode === "dark" ? "Dark Mode" : "Light Mode"}
                </div>
                <div
                  className="text-xs"
                  style={{ color: uiTheme.colors.text.secondary }}
                >
                  {colorMode === "dark"
                    ? "Optimized for dark backgrounds"
                    : "Optimized for light backgrounds"}
                </div>
              </div>
            </div>

            <div
              className="flex items-center cursor-pointer relative z-10"
              onClick={toggleColorMode}
            >
              <div
                className="h-7 w-14 rounded-full relative flex items-center p-1 shadow-inner"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  transition: `all 0.3s ${uiTheme.design.animation}`,
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                {/* Track highlights */}
                <div
                  className="absolute inset-y-0 left-1 flex items-center opacity-50"
                  style={{
                    color:
                      colorMode === "light"
                        ? "#FFFFFF"
                        : uiTheme.colors.text.secondary,
                    transform: "translateX(1px)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                  </svg>
                </div>

                <div
                  className="absolute inset-y-0 right-1 flex items-center opacity-50"
                  style={{
                    color:
                      colorMode === "dark"
                        ? "#FFFFFF"
                        : uiTheme.colors.text.secondary,
                    transform: "translateX(-1px)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div
                  className="absolute w-5 h-5 rounded-full bg-white transform transition-transform shadow-lg"
                  style={{
                    left: colorMode === "dark" ? "auto" : "2px",
                    right: colorMode === "light" ? "auto" : "2px",
                    transition: `all 0.3s ${uiTheme.design.animation}`,
                    backgroundColor:
                      colorMode === "dark" ? "#1a365d" : "#FDB813",
                    border: "2px solid white",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Color Harmonization Control */}
          <div
            className="rounded-lg relative overflow-hidden mt-6"
            style={{
              backgroundColor: `rgba(255,255,255,0.05)`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.2)`,
              border: `1px solid ${uiTheme.colors.primary}30`,
            }}
          >
            {/* Gradient header */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(to right, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
              }}
            />

            <div className="p-5 space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.896-1.207 8.026 8.026 0 00-4.513-4.513A18.75 18.75 0 008.475 11.7l-.278.5a5.26 5.26 0 013.601 3.602l.502-.278zM6.75 13.5A3.75 3.75 0 003 17.25a1.5 1.5 0 01-1.601 1.497.75.75 0 00-.7 1.123 5.25 5.25 0 009.8-2.62 3.75 3.75 0 00-3.75-3.75z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <Text
                      variant="body"
                      className="font-medium text-base"
                      style={{ color: uiTheme.colors.text.primary }}
                    >
                      Color Harmonization
                    </Text>
                    <Text
                      variant="caption"
                      style={{ color: uiTheme.colors.text.secondary }}
                      className="text-xs"
                    >
                      Adjust to create balanced color schemes
                    </Text>
                  </div>
                </div>
                <div
                  className="px-2.5 py-1 rounded text-xs font-medium shadow-sm"
                  style={{
                    backgroundColor: `${uiTheme.colors.primary}20`,
                    color: uiTheme.colors.primary,
                    border: `1px solid ${uiTheme.colors.primary}40`,
                  }}
                >
                  {harmonizationLevel}%
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Text
                  variant="caption"
                  style={{ color: uiTheme.colors.text.secondary }}
                  className="whitespace-nowrap font-medium"
                >
                  Subtle
                </Text>
                <div className="flex-1 h-7 rounded-full relative overflow-hidden mx-1">
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundColor: `rgba(0,0,0,0.2)`,
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  />
                  <div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${harmonizationLevel}%`,
                      background: `linear-gradient(to right, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                      transition: "width 0.3s ease",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={harmonizationLevel}
                    onChange={(e) =>
                      setHarmonizationLevel(parseInt(e.target.value))
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute top-1/2 rounded-full w-6 h-6 shadow-lg transform -translate-y-1/2 flex items-center justify-center pointer-events-none"
                    style={{
                      backgroundColor: "#FFF",
                      left: `calc(${harmonizationLevel}% - 10px)`,
                      transition: "left 0.3s ease",
                      border: `2px solid ${uiTheme.colors.primary}`,
                      zIndex: 5,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: uiTheme.colors.primary,
                      }}
                    />
                  </div>
                </div>
                <Text
                  variant="caption"
                  style={{ color: uiTheme.colors.text.secondary }}
                  className="whitespace-nowrap font-medium"
                >
                  Strong
                </Text>
              </div>

              <button
                className="w-full py-3 mt-1 rounded-lg transition-all flex items-center justify-center text-sm font-medium relative overflow-hidden"
                onClick={applyHarmonizedColors}
                style={{
                  background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 12px ${uiTheme.colors.primary}30`,
                  borderRadius: "8px",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-10" />
                <div className="relative z-10 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Apply Harmonized Colors
                </div>
              </button>
            </div>
          </div>

          {/* Suggested Color Palette */}
          {suggestedColors && (
            <div
              className="overflow-hidden rounded-lg relative border mt-6"
              style={{
                borderColor: `${uiTheme.colors.border}50`,
                backgroundColor: `rgba(255,255,255,0.02)`,
                boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
              }}
            >
              <div
                className="p-3 text-xs font-medium flex items-center justify-between"
                style={{
                  backgroundColor: `${uiTheme.colors.background.light}80`,
                  borderBottom: `1px solid ${uiTheme.colors.border}30`,
                }}
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={uiTheme.colors.primary}
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Suggested Harmony
                </div>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${uiTheme.colors.primary}15`,
                    color: uiTheme.colors.primary,
                  }}
                >
                  AI-Generated
                </span>
              </div>
              <div className="flex h-12">
                <div
                  className="flex-1 relative group overflow-hidden"
                  style={{ background: suggestedColors.primary }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
                      Primary
                    </span>
                  </div>
                </div>
                <div
                  className="flex-1 relative group overflow-hidden"
                  style={{ background: suggestedColors.secondary }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
                      Secondary
                    </span>
                  </div>
                </div>
                <div
                  className="flex-1 relative group overflow-hidden"
                  style={{ background: suggestedColors.accent }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
                      Accent
                    </span>
                  </div>
                </div>
                <div
                  className="flex-1 relative group overflow-hidden"
                  style={{ background: suggestedColors.dark }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
                      Dark
                    </span>
                  </div>
                </div>
                <div
                  className="flex-1 relative group overflow-hidden"
                  style={{ background: suggestedColors.light }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
                      Light
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <ColorGroup
            title="Main Colors"
            colors={mainColors}
            onChange={handleColorChange}
            theme={uiTheme}
          />

          <ColorGroup
            title="Background Colors"
            colors={backgroundColors}
            onChange={handleColorChange}
            theme={uiTheme}
          />

          <ColorGroup
            title="Text Colors"
            colors={textColors}
            onChange={handleColorChange}
            theme={uiTheme}
          />

          {/* Color relationship tip */}
          <div
            className="p-3 rounded-lg text-xs"
            style={{
              backgroundColor: uiTheme.colors.background.light,
              color: uiTheme.colors.text.secondary,
              border: `1px solid ${uiTheme.colors.border}`,
            }}
          >
            <p
              className="mb-1 font-medium"
              style={{ color: uiTheme.colors.primary }}
            >
              Pro Tip:
            </p>
            <p>
              When you change background colors, text colors will automatically
              adjust for optimal contrast. You can always override them
              manually.
            </p>
          </div>
        </div>
      )}

      {/* Design Tab Content */}
      {activeTab === "design" && (
        <div className="space-y-6">
          <Card
            variant="dark"
            className="p-5 overflow-hidden relative"
            borderTop={false}
            elevation="sm"
            style={{
              background: `linear-gradient(145deg, ${
                uiTheme.colors.background.dark
              }, ${
                uiTheme.colors.background.dark === "#000000"
                  ? "#111"
                  : uiTheme.colors.background.dark
              }ee)`,
              borderRadius: uiTheme.design.borderRadius,
              border: `1px solid ${
                uiTheme.colors.background.dark === "#000000"
                  ? "#222222"
                  : uiTheme.colors.background.dark
              }`,
            }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${uiTheme.colors.primary}50, transparent 70%)`,
              }}
            />

            <h4
              className="text-sm font-medium mb-5 pb-3 border-b border-opacity-10 flex items-center"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: uiTheme.colors.text.primary,
              }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: uiTheme.colors.primary }}
              />
              Design Settings
            </h4>

            <div className="space-y-5">
              <div>
                <label
                  className="block text-sm font-medium mb-2 flex justify-between items-center"
                  style={{ color: uiTheme.colors.text.primary }}
                >
                  <div className="flex items-center">
                    <span
                      className="w-4 h-4 mr-2 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${uiTheme.colors.primary}20`,
                        color: uiTheme.colors.primary,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 15.25a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 10a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1V10z" />
                      </svg>
                    </span>
                    <span>Border Radius</span>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      color: uiTheme.colors.primary,
                      backgroundColor: `${uiTheme.colors.primary}15`,
                      border: `1px solid ${uiTheme.colors.primary}30`,
                    }}
                  >
                    {customTheme.design.borderRadius}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={customTheme.design.borderRadius}
                    onChange={(e) =>
                      handleColorChange("design.borderRadius", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-30 appearance-none"
                    style={{
                      backgroundColor: `rgba(0,0,0,0.2)`,
                      borderColor: uiTheme.colors.border,
                      color: uiTheme.colors.text.primary,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(
                        uiTheme.colors.text.secondary
                      )}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="0">None (0px)</option>
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="16px">Extra Large (16px)</option>
                    <option value="24px">Round (24px)</option>
                  </select>
                  <div
                    className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${uiTheme.colors.primary}30, transparent)`,
                      borderRadius: "inherit",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2 flex justify-between items-center"
                  style={{ color: uiTheme.colors.text.primary }}
                >
                  <div className="flex items-center">
                    <span
                      className="w-4 h-4 mr-2 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${uiTheme.colors.primary}20`,
                        color: uiTheme.colors.primary,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Shadow Style</span>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      color: uiTheme.colors.primary,
                      backgroundColor: `${uiTheme.colors.primary}15`,
                      border: `1px solid ${uiTheme.colors.primary}30`,
                    }}
                  >
                    {customTheme.design.shadow === "none"
                      ? "None"
                      : "Shadow Applied"}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={customTheme.design.shadow}
                    onChange={(e) =>
                      handleColorChange("design.shadow", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-30 appearance-none"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderColor: uiTheme.colors.border,
                      color: uiTheme.colors.text.primary,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(
                        uiTheme.colors.text.secondary
                      )}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="none">None</option>
                    <option value="0 2px 4px rgba(0,0,0,0.1)">Subtle</option>
                    <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                    <option value="0 10px 15px rgba(0,0,0,0.1)">Strong</option>
                    <option value="0 20px 25px rgba(0,0,0,0.1)">
                      Extra Strong
                    </option>
                  </select>
                  <div
                    className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${uiTheme.colors.primary}30, transparent)`,
                      borderRadius: "inherit",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2 flex justify-between items-center"
                  style={{ color: uiTheme.colors.text.primary }}
                >
                  <div className="flex items-center">
                    <span
                      className="w-4 h-4 mr-2 flex items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${uiTheme.colors.primary}20`,
                        color: uiTheme.colors.primary,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Animation Style</span>
                  </div>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      color: uiTheme.colors.primary,
                      backgroundColor: `${uiTheme.colors.primary}15`,
                      border: `1px solid ${uiTheme.colors.primary}30`,
                    }}
                  >
                    {customTheme.design.animation}
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={customTheme.design.animation}
                    onChange={(e) =>
                      handleColorChange("design.animation", e.target.value)
                    }
                    className="w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-30 appearance-none"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.2)",
                      borderColor: uiTheme.colors.border,
                      color: uiTheme.colors.text.primary,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(
                        uiTheme.colors.text.secondary
                      )}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option value="ease">Smooth</option>
                    <option value="ease-in">Ease In</option>
                    <option value="ease-out">Ease Out</option>
                    <option value="ease-in-out">Ease In Out</option>
                    <option value="cubic-bezier(0.4, 0, 0.2, 1)">Custom</option>
                  </select>
                  <div
                    className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${uiTheme.colors.primary}30, transparent)`,
                      borderRadius: "inherit",
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div
            className="rounded-xl p-5 mt-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, ${customTheme.colors.primary}, ${customTheme.colors.secondary})`,
              borderRadius: customTheme.design.borderRadius,
              boxShadow:
                customTheme.design.shadow !== "none"
                  ? customTheme.design.shadow
                  : `0 10px 25px rgba(0,0,0,0.2)`,
            }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-20" />
            <div className="relative z-10">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: customTheme.design.borderRadius,
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  transform: "perspective(500px) rotateX(10deg)",
                  transition: `all 0.5s ${customTheme.design.animation}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: customTheme.design.borderRadius,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <div className="text-center text-white font-medium">
                <div>
                  Border Radius:{" "}
                  <strong>{customTheme.design.borderRadius}</strong>
                </div>
                <div className="text-sm mt-1 opacity-80">
                  Shadow:{" "}
                  {customTheme.design.shadow === "none" ? "None" : "Applied"}
                </div>
                <div className="text-sm mt-1 opacity-80">
                  Animation: {customTheme.design.animation}
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-4 mt-4 rounded-lg relative overflow-hidden"
            style={{
              backgroundColor: uiTheme.colors.background.light,
              border: `1px solid ${uiTheme.colors.border}20`,
              borderRadius: uiTheme.design.borderRadius,
            }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: `linear-gradient(135deg, ${uiTheme.colors.primary}50, transparent 70%)`,
              }}
            />
            <div
              className="flex items-center text-sm"
              style={{ color: uiTheme.colors.text.secondary }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mr-2 flex-shrink-0"
                style={{ color: uiTheme.colors.primary }}
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="relative z-10">
                Design settings affect all UI elements, including buttons,
                cards, and inputs.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab Content */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div
            className="p-6 rounded-xl relative overflow-hidden mb-4"
            style={{
              backgroundColor: previewTheme.colors.background.dark,
              borderRadius: previewTheme.design.borderRadius,
              boxShadow: previewTheme.design.shadow,
            }}
          >
            <h3
              className="text-lg font-bold mb-4 relative z-10"
              style={{ color: previewTheme.colors.text.primary }}
            >
              Live Preview
            </h3>
            <div
              className="absolute top-0 right-0 w-40 h-40 opacity-10"
              style={{
                background: `radial-gradient(circle, ${previewTheme.colors.primary}, transparent 70%)`,
                transform: "translate(30%, -30%)",
              }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - light theme */}
            <div
              className="rounded-xl p-6 space-y-5 relative overflow-hidden"
              style={{
                backgroundColor: previewTheme.colors.background.light,
                borderRadius: previewTheme.design.borderRadius,
                boxShadow: previewTheme.design.shadow,
                border: `1px solid ${previewTheme.colors.border}`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-[0.07] pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${previewTheme.colors.primary}, transparent 70%)`,
                  transform: "translate(30%, -30%)",
                }}
              />

              <h4
                className="font-medium text-lg relative"
                style={{ color: previewTheme.colors.text.primary }}
              >
                Light Mode
              </h4>

              {/* Card Example */}
              <div
                className="rounded-lg p-4 border relative overflow-hidden"
                style={{
                  borderColor: previewTheme.colors.border,
                  transition: `all 0.3s ${previewTheme.design.animation}`,
                  boxShadow: `0 2px 10px ${previewTheme.colors.primary}20`,
                  borderRadius: previewTheme.design.borderRadius,
                }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{
                    background: `linear-gradient(to right, ${previewTheme.colors.primary}, ${previewTheme.colors.secondary})`,
                  }}
                />
                <h5
                  className="text-sm font-medium mb-2"
                  style={{ color: previewTheme.colors.text.primary }}
                >
                  Card Title
                </h5>
                <p
                  className="text-xs mb-3"
                  style={{ color: previewTheme.colors.text.secondary }}
                >
                  This is a sample card with theme styling applied to it.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 text-xs rounded-lg transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${previewTheme.colors.primary}, ${previewTheme.colors.secondary})`,
                      color: "#FFFFFF",
                      borderRadius: previewTheme.design.borderRadius,
                      transition: `all 0.3s ${previewTheme.design.animation}`,
                      boxShadow: `0 2px 5px ${previewTheme.colors.primary}30`,
                    }}
                  >
                    Submit
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs rounded-lg border transition-all"
                    style={{
                      borderColor: previewTheme.colors.border,
                      color: previewTheme.colors.text.primary,
                      borderRadius: previewTheme.design.borderRadius,
                      transition: `all 0.3s ${previewTheme.design.animation}`,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Form Example */}
              <div>
                <label
                  className="block text-sm mb-2 font-medium"
                  style={{ color: previewTheme.colors.text.primary }}
                >
                  Email
                </label>
                <input
                  type="text"
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 rounded-lg border mb-3 text-sm"
                  style={{
                    borderColor: previewTheme.colors.border,
                    borderRadius: previewTheme.design.borderRadius,
                    color: previewTheme.colors.text.primary,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                    backgroundColor: `${previewTheme.colors.background.light}`,
                  }}
                />
                <button
                  className="w-full py-2.5 text-sm font-medium rounded-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${previewTheme.colors.primary}, ${previewTheme.colors.secondary})`,
                    color: "#FFFFFF",
                    borderRadius: previewTheme.design.borderRadius,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                    boxShadow: `0 2px 8px ${previewTheme.colors.primary}30`,
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Right column - dark theme */}
            <div
              className="rounded-xl p-6 space-y-5 relative overflow-hidden"
              style={{
                backgroundColor: previewTheme.colors.background.dark,
                borderRadius: previewTheme.design.borderRadius,
                boxShadow: previewTheme.design.shadow,
                border: `1px solid ${
                  previewTheme.colors.background.dark === "#000000"
                    ? "#222222"
                    : previewTheme.colors.background.dark
                }`,
              }}
            >
              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-40 h-40 opacity-[0.07] pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${previewTheme.colors.accent}, transparent 70%)`,
                  transform: "translate(30%, -30%)",
                }}
              />

              <h4
                className="font-medium text-lg relative"
                style={{ color: previewTheme.colors.text.primary }}
              >
                Dark Mode
              </h4>

              {/* Stats Example */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-lg p-3 text-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${previewTheme.colors.primary}20, ${previewTheme.colors.secondary}20)`,
                    borderRadius: previewTheme.design.borderRadius,
                    boxShadow: `0 2px 8px ${previewTheme.colors.primary}15`,
                    border: `1px solid ${previewTheme.colors.primary}20`,
                  }}
                >
                  <p
                    className="text-xs mb-1 font-medium"
                    style={{ color: previewTheme.colors.text.secondary }}
                  >
                    Total Users
                  </p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: previewTheme.colors.primary }}
                  >
                    2,543
                  </p>
                </div>
                <div
                  className="rounded-lg p-3 text-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${previewTheme.colors.secondary}20, ${previewTheme.colors.accent}20)`,
                    borderRadius: previewTheme.design.borderRadius,
                    boxShadow: `0 2px 8px ${previewTheme.colors.secondary}15`,
                    border: `1px solid ${previewTheme.colors.secondary}20`,
                  }}
                >
                  <p
                    className="text-xs mb-1 font-medium"
                    style={{ color: previewTheme.colors.text.secondary }}
                  >
                    Active Now
                  </p>
                  <p
                    className="text-xl font-bold"
                    style={{ color: previewTheme.colors.secondary }}
                  >
                    128
                  </p>
                </div>
              </div>

              {/* Menu Example */}
              <div
                className="rounded-lg overflow-hidden border"
                style={{
                  borderColor: `${previewTheme.colors.border}50`,
                  borderRadius: previewTheme.design.borderRadius,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
                }}
              >
                <div
                  className="p-3 border-b flex items-center"
                  style={{
                    borderColor: `${previewTheme.colors.border}30`,
                    backgroundColor: previewTheme.colors.background.dark,
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: previewTheme.colors.text.primary }}
                  >
                    Navigation
                  </p>
                </div>
                <div
                  className="p-2"
                  style={{
                    background: `linear-gradient(to bottom, ${
                      previewTheme.colors.background.dark
                    }, ${
                      previewTheme.colors.background.dark === "#000000"
                        ? "#111"
                        : previewTheme.colors.background.dark
                    }ee)`,
                  }}
                >
                  <div
                    className="p-2.5 rounded mb-1.5 flex items-center"
                    style={{
                      backgroundColor: `${previewTheme.colors.primary}15`,
                      borderRadius: previewTheme.design.borderRadius,
                      borderLeft: `3px solid ${previewTheme.colors.primary}`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{
                        backgroundColor: previewTheme.colors.primary,
                        boxShadow: `0 0 5px ${previewTheme.colors.primary}80`,
                      }}
                    />
                    <p
                      className="text-xs font-medium"
                      style={{ color: previewTheme.colors.text.primary }}
                    >
                      Dashboard
                    </p>
                  </div>
                  <div className="p-2.5 rounded mb-1.5 flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2 opacity-60"
                      style={{
                        backgroundColor: previewTheme.colors.text.secondary,
                      }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: previewTheme.colors.text.secondary }}
                    >
                      Settings
                    </p>
                  </div>
                  <div className="p-2.5 rounded flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2 opacity-60"
                      style={{
                        backgroundColor: previewTheme.colors.text.secondary,
                      }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: previewTheme.colors.text.secondary }}
                    >
                      Profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Component Preview Section */}
          <div
            className="rounded-xl p-6 space-y-5 relative overflow-hidden mt-6"
            style={{
              background: `linear-gradient(145deg, ${
                previewTheme.colors.background.dark
              }, ${
                previewTheme.colors.background.dark === "#000000"
                  ? "#111"
                  : previewTheme.colors.background.dark
              }ee)`,
              borderRadius: previewTheme.design.borderRadius,
              boxShadow: previewTheme.design.shadow,
              border: `1px solid ${
                previewTheme.colors.background.dark === "#000000"
                  ? "#222222"
                  : previewTheme.colors.background.dark
              }`,
            }}
          >
            <h4
              className="font-medium text-lg mb-4 pb-2 border-b relative"
              style={{
                color: previewTheme.colors.text.primary,
                borderColor: `${previewTheme.colors.border}30`,
              }}
            >
              UI Components
            </h4>

            {/* Buttons Row */}
            <div className="mb-6">
              <h5
                className="text-sm font-medium mb-3"
                style={{ color: previewTheme.colors.text.secondary }}
              >
                Buttons
              </h5>
              <div className="flex flex-wrap gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${previewTheme.colors.primary}, ${previewTheme.colors.secondary})`,
                    color: "#FFFFFF",
                    borderRadius: previewTheme.design.borderRadius,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                    boxShadow: `0 2px 8px ${previewTheme.colors.primary}30`,
                  }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg border transition-all"
                  style={{
                    backgroundColor: `${previewTheme.colors.primary}15`,
                    borderColor: previewTheme.colors.primary,
                    color: previewTheme.colors.primary,
                    borderRadius: previewTheme.design.borderRadius,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: "transparent",
                    color: previewTheme.colors.text.primary,
                    borderRadius: previewTheme.design.borderRadius,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                  }}
                >
                  Text
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${previewTheme.colors.primary}, ${previewTheme.colors.secondary})`,
                    color: "#FFFFFF",
                    borderRadius: previewTheme.design.borderRadius,
                    transition: `all 0.3s ${previewTheme.design.animation}`,
                    cursor: "not-allowed",
                  }}
                  disabled
                >
                  Disabled
                </button>
              </div>
            </div>

            {/* Text Styles */}
            <div className="mb-6">
              <h5
                className="text-sm font-medium mb-3"
                style={{ color: previewTheme.colors.text.secondary }}
              >
                Typography
              </h5>
              <div className="space-y-2">
                <h1
                  className="text-2xl font-bold spartacus-font"
                  style={{ color: previewTheme.colors.text.primary }}
                >
                  Heading 1
                </h1>
                <h2
                  className="text-xl font-bold spartacus-font"
                  style={{ color: previewTheme.colors.text.primary }}
                >
                  Heading 2
                </h2>
                <p
                  className="text-base"
                  style={{ color: previewTheme.colors.text.primary }}
                >
                  Body text paragraph with{" "}
                  <span style={{ color: previewTheme.colors.primary }}>
                    accent color
                  </span>{" "}
                  and <strong>bold text</strong>.
                </p>
                <p
                  className="text-sm"
                  style={{ color: previewTheme.colors.text.secondary }}
                >
                  Secondary text is smaller and less prominent.
                </p>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h5
                className="text-sm font-medium mb-3"
                style={{ color: previewTheme.colors.text.secondary }}
              >
                Form Elements
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: previewTheme.colors.text.primary }}
                  >
                    Input
                  </label>
                  <input
                    type="text"
                    placeholder="Enter text..."
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{
                      backgroundColor: `${
                        previewTheme.colors.background.dark === "#000000"
                          ? "#111"
                          : previewTheme.colors.background.dark
                      }`,
                      borderColor: previewTheme.colors.border,
                      borderRadius: previewTheme.design.borderRadius,
                      color: previewTheme.colors.text.primary,
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: previewTheme.colors.text.primary }}
                  >
                    Select
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border text-sm appearance-none bg-no-repeat bg-right"
                    style={{
                      backgroundColor: `${
                        previewTheme.colors.background.dark === "#000000"
                          ? "#111"
                          : previewTheme.colors.background.dark
                      }`,
                      borderColor: previewTheme.colors.border,
                      borderRadius: previewTheme.design.borderRadius,
                      color: previewTheme.colors.text.primary,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent(
                        previewTheme.colors.text.secondary
                      )}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1rem",
                      paddingRight: "2.5rem",
                    }}
                  >
                    <option>Select option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Discard Changes button next to Save Theme */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDiscardChanges}
          className="flex-1 py-3 rounded-lg transition-all flex items-center justify-center text-sm font-medium relative overflow-hidden"
          style={{
            backgroundColor: `rgba(0,0,0,0.3)`,
            borderColor: `${uiTheme.colors.border}`,
            color: uiTheme.colors.text.primary,
            borderRadius: uiTheme.design.borderRadius,
            transition: `all 0.3s ${uiTheme.design.animation}`,
            border: `1px solid ${uiTheme.colors.border}50`,
          }}
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
            Discard Changes
          </div>
        </button>
        <button
          onClick={onApply}
          disabled={isLoading}
          className="flex-1 py-3 rounded-lg transition-all flex items-center justify-center text-sm font-medium relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${uiTheme.colors.primary}, ${uiTheme.colors.secondary})`,
            borderRadius: uiTheme.design.borderRadius,
            color: "#FFFFFF",
            transition: `all 0.3s ${uiTheme.design.animation}`,
            boxShadow: `0 4px 12px ${uiTheme.colors.primary}30`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-10" />
          {isLoading ? (
            <div className="flex items-center justify-center text-sm relative z-10">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving to Database...
            </div>
          ) : (
            <div className="flex items-center justify-center text-sm relative z-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                  clipRule="evenodd"
                />
              </svg>
              Save Theme
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
