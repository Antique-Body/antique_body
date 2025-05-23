"use client";

import { ThemeContext, themes } from "@/app/utils/themeConfig";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button } from "../common/Button";
import { Card } from "./Card";
import { ThemeCustomizer } from "./ThemeCustomizer";

// Fixed orange theme for the ThemeSelector interface
const SELECTOR_THEME = {
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

export const ThemeSelector = () => {
  const {
    theme,
    updateTheme,
    saveTheme,
    updateCustomTheme,
    position,
    togglePosition,
    isLoading,
  } = useContext(ThemeContext);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customTheme, setCustomTheme] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("preset"); // 'preset' or 'custom'
  const [isCollapsed, setIsCollapsed] = useState(false);
  const debounceTimer = useRef(null);

  // Initialize customTheme when theme is loaded
  useEffect(() => {
    if (theme) {
      setCustomTheme({
        name: "Custom Theme",
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          accent: theme.colors.accent,
          background: {
            light: theme.colors.background.light,
            dark: theme.colors.background.dark,
          },
          text: {
            primary: theme.colors.text.primary,
            secondary: theme.colors.text.secondary,
          },
          border: theme.colors.border,
        },
        design: {
          borderRadius: theme.design.borderRadius,
          shadow: theme.design.shadow,
          animation: theme.design.animation,
        },
      });
    }
  }, [theme]);

  const handleThemeChange = async (themeName) => {
    try {
      setError(null);
      updateTheme(themeName);
    } catch (error) {
      console.error("Error updating theme:", error);
      setError(error.message);
    }
  };

  const handleCustomColorChange = useCallback(
    (path, value) => {
      // Clear any existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set a new timer
      debounceTimer.current = setTimeout(() => {
        setCustomTheme((prev) => {
          if (!prev) return prev;

          // If we're updating the entire theme
          if (path === "theme") {
            console.log("Updating entire theme:", value);
            // Update the theme immediately
            updateCustomTheme(value);
            return value;
          }

          // For individual property updates
          const newTheme = { ...prev };
          const keys = path.split(".");
          let current = newTheme;

          for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;

          // Update the theme immediately
          updateCustomTheme(newTheme);
          return newTheme;
        });
      }, 50);
    },
    [updateCustomTheme]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const applyCustomTheme = async () => {
    if (!customTheme) return;

    try {
      setError(null);
      const customThemeData = {
        name: "Custom Theme",
        colors: customTheme.colors,
        design: customTheme.design,
        isCustom: true,
      };
      console.log("Applying custom theme:", customThemeData);

      // This ensures the theme is saved to the database through the API
      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customThemeData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save theme: ${response.statusText}`);
      }

      const savedTheme = await response.json();
      await updateCustomTheme(savedTheme);
      setSelectedTab("preset");
    } catch (error) {
      console.error("Error updating theme:", error);
      setError(error.message);
    }
  };

  // Show loading state instead of returning null
  if (!theme || !customTheme) {
    return (
      <Card
        variant="dark"
        className="p-6 w-full max-w-md"
        style={{
          background: SELECTOR_THEME.colors.background.dark,
          borderRadius: SELECTOR_THEME.design.borderRadius,
          boxShadow: SELECTOR_THEME.design.shadow,
        }}
      >
        <div className="flex items-center justify-center h-20">
          <div
            className="w-6 h-6 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: SELECTOR_THEME.colors.primary }}
          ></div>
        </div>
      </Card>
    );
  }

  const renderThemeButton = (key, themeData) => {
    const isActive = theme.name === themeData.name;

    return (
      <div key={key} className="flex flex-col items-center group">
        <button
          className={`w-16 h-16 rounded-full mb-2 p-1 transition-all duration-300 transform ${
            isActive ? `ring-3 scale-110 shadow-lg` : "hover:scale-105"
          }`}
          style={{
            background: `linear-gradient(135deg, ${themeData.colors.primary}, ${themeData.colors.secondary})`,
            boxShadow: isActive ? `0 0 15px ${themeData.colors.primary}90` : "",
            border: `2px solid ${
              isActive ? themeData.colors.accent : "transparent"
            }`,
          }}
          onClick={() => handleThemeChange(key)}
          disabled={isLoading}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: themeData.colors.background.light,
              borderRadius: themeData.design.borderRadius,
            }}
          >
            <div className="w-2/3 h-2/3 rounded-full relative">
              <div
                className="absolute inset-0"
                style={{
                  background: `conic-gradient(${themeData.colors.primary}, ${themeData.colors.secondary}, ${themeData.colors.accent}, ${themeData.colors.primary})`,
                  transform: "rotate(45deg)",
                }}
              ></div>
            </div>
          </div>

          {isActive && (
            <div
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2"
              style={{
                color: themeData.colors.primary,
                borderColor: themeData.colors.primary,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
          )}
        </button>
        <span
          className={`text-xs font-medium transition-colors`}
          style={{
            color: isActive
              ? SELECTOR_THEME.colors.text.primary
              : SELECTOR_THEME.colors.text.secondary,
          }}
        >
          {themeData.name}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`fixed z-50 transition-all duration-500 ${
        position === "left" ? "left-0" : "right-0"
      } top-20`}
      style={{
        transform: isCollapsed
          ? position === "left"
            ? "translateX(-100%)"
            : "translateX(100%)"
          : "translateX(0)",
        boxShadow:
          position === "left"
            ? "2px 0 10px rgba(0,0,0,0.2)"
            : "-2px 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <Button
        variant="outline"
        size="compact"
        className={`absolute top-12 ${
          position === "left" ? "-right-10" : "-left-10"
        } p-1.5 z-10 rounded-full`}
        style={{
          background: SELECTOR_THEME.colors.background.dark,
          borderColor: SELECTOR_THEME.colors.border,
          color: SELECTOR_THEME.colors.text.primary,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          width: "40px",
          height: "40px",
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Button>

      <Card
        variant="dark"
        className="w-full max-w-md shadow-xl overflow-hidden"
        style={{
          background: SELECTOR_THEME.colors.background.dark,
          borderRadius: SELECTOR_THEME.design.borderRadius,
          boxShadow: SELECTOR_THEME.design.shadow,
          border: `1px solid ${
            SELECTOR_THEME.colors.background.dark === "#000000"
              ? "#222222"
              : SELECTOR_THEME.colors.background.dark
          }`,
        }}
      >
        <div
          className="h-3"
          style={{
            background: `linear-gradient(to right, ${SELECTOR_THEME.colors.primary}, ${SELECTOR_THEME.colors.secondary})`,
          }}
        ></div>

        <div className="p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-semibold flex items-center"
              style={{ color: SELECTOR_THEME.colors.text.primary }}
            >
              <span
                className="mr-3 text-2xl flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${SELECTOR_THEME.colors.primary}, ${SELECTOR_THEME.colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                🎨
              </span>
              Theme Settings
            </h2>
            <div
              className="flex p-1 bg-opacity-20 rounded-lg"
              style={{
                backgroundColor: `${SELECTOR_THEME.colors.background.light}30`,
                border: `1px solid ${SELECTOR_THEME.colors.border}30`,
              }}
            >
              <Button
                variant={selectedTab === "preset" ? "primary" : "ghost"}
                size="small"
                onClick={() => setSelectedTab("preset")}
                className="text-sm"
                style={
                  selectedTab === "preset"
                    ? {
                        background: `linear-gradient(to right, ${SELECTOR_THEME.colors.primary}, ${SELECTOR_THEME.colors.secondary})`,
                        color: "#FFFFFF",
                        boxShadow: `0 2px 8px ${SELECTOR_THEME.colors.primary}40`,
                      }
                    : {
                        color: SELECTOR_THEME.colors.text.secondary,
                      }
                }
              >
                Presets
              </Button>
              <Button
                variant={selectedTab === "custom" ? "primary" : "ghost"}
                size="small"
                onClick={() => {
                  setSelectedTab("custom");
                  setShowCustomizer(true);
                }}
                className="text-sm"
                style={
                  selectedTab === "custom"
                    ? {
                        background: `linear-gradient(to right, ${SELECTOR_THEME.colors.primary}, ${SELECTOR_THEME.colors.secondary})`,
                        color: "#FFFFFF",
                        boxShadow: `0 2px 8px ${SELECTOR_THEME.colors.primary}40`,
                      }
                    : {
                        color: SELECTOR_THEME.colors.text.secondary,
                      }
                }
              >
                Customize
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {selectedTab === "preset" && (
            <div>
              <h3
                className="text-sm font-medium mb-3"
                style={{ color: SELECTOR_THEME.colors.text.secondary }}
              >
                Choose a Theme
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-6">
                {Object.entries(themes).map(([key, themeData]) =>
                  renderThemeButton(key, themeData)
                )}
              </div>

              <Card
                variant="highlight"
                className="mt-6 p-4 rounded-lg"
                borderTop={false}
                elevation="sm"
                style={{
                  background: SELECTOR_THEME.colors.background.light,
                  borderRadius: SELECTOR_THEME.design.borderRadius,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4
                    className="text-sm font-medium"
                    style={{ color: SELECTOR_THEME.colors.primary }}
                  >
                    Currently Using
                  </h4>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={saveTheme}
                    disabled={isLoading}
                    style={{
                      borderColor: SELECTOR_THEME.colors.primary,
                      color: SELECTOR_THEME.colors.primary,
                    }}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-1 h-3 w-3"
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
                        Saving...
                      </span>
                    ) : (
                      "Save to Database"
                    )}
                  </Button>
                </div>
                <p
                  className="text-xs opacity-80"
                  style={{ color: SELECTOR_THEME.colors.text.primary }}
                >
                  {theme.name} with {theme.design.borderRadius} radius and{" "}
                  {theme.design.animation} animations
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: theme.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: theme.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white border-opacity-10"
                    style={{ background: theme.colors.background.light }}
                    title="Background (Light)"
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white border-opacity-10"
                    style={{ background: theme.colors.background.dark }}
                    title="Background (Dark)"
                  />
                </div>
              </Card>
            </div>
          )}

          {selectedTab === "custom" && customTheme && (
            <ThemeCustomizer
              customTheme={customTheme}
              onColorChange={handleCustomColorChange}
              onApply={applyCustomTheme}
              isLoading={isLoading}
              selectorTheme={SELECTOR_THEME}
            />
          )}
        </div>
      </Card>
    </div>
  );
};
