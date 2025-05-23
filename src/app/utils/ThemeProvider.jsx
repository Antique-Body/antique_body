"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { ThemeContext, themes } from "./themeConfig";

export const ThemeProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState(themes.ancientGreek);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState("right");
  const [lastSavedTheme, setLastSavedTheme] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [pendingThemeUpdate, setPendingThemeUpdate] = useState(null);

  // Handle pending theme updates
  useEffect(() => {
    if (pendingThemeUpdate) {
      setTheme(pendingThemeUpdate);
      setIsCustom(true);
      setPendingThemeUpdate(null);
    }
  }, [pendingThemeUpdate]);

  // Load theme from database or use default
  const loadTheme = useCallback(async () => {
    try {
      const response = await fetch("/api/theme");
      if (response.ok) {
        const themeData = await response.json();
        if (themeData.isCustom) {
          setTheme(themeData);
          setIsCustom(true);
        } else if (themes[themeData.name.toLowerCase()]) {
          setTheme(themes[themeData.name.toLowerCase()]);
          setIsCustom(false);
        }
        setLastSavedTheme(themeData);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, []);

  // Handle session loading state
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "unauthenticated") {
      setTheme(themes.ancientGreek);
      setIsLoading(false);
      return;
    }

    if (status === "authenticated") {
      loadTheme();
    }
    setIsLoading(false);
  }, [status, session, loadTheme]);

  // Load position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem("themePosition");
    if (savedPosition) {
      setPosition(savedPosition);
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem("themePosition", position);
  }, [position]);

  const updateTheme = useCallback((newTheme) => {
    const themeToUse =
      typeof newTheme === "string" ? themes[newTheme] : newTheme;
    setTheme(themeToUse);
    setIsCustom(typeof newTheme !== "string");
  }, []);

  const saveTheme = useCallback(async () => {
    try {
      setIsLoading(true);
      const themeToSave = {
        name: theme.name,
        colors: theme.colors,
        design: theme.design,
        isCustom: true,
      };

      const response = await fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(themeToSave),
      });

      if (response.ok) {
        const updatedTheme = await response.json();
        setLastSavedTheme(updatedTheme);
        setIsCustom(true);
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  const updateCustomTheme = useCallback((customTheme) => {
    // Use requestAnimationFrame to ensure we're not updating during render
    requestAnimationFrame(() => {
      setTheme(customTheme);
      setIsCustom(true);
    });
  }, []);

  const togglePosition = useCallback(() => {
    setPosition(position === "right" ? "left" : "right");
  }, [position]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        saveTheme,
        updateCustomTheme,
        position,
        togglePosition,
        themes,
        lastSavedTheme,
        isLoading,
        isCustom,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
