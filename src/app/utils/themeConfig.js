"use client";
import React, { useState } from "react";

export const themes = {
  // Ancient Greek Theme (Default)
  ancientGreek: {
    name: "Ancient Greek",
    colors: {
      primary: "#FF7800",
      secondary: "#FF5F00",
      background: {
        light: "#1a1a1a",
        dark: "#0a0a0a",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#CCCCCC",
      },
      accent: "#FFB800",
      border: "#333333",
    },
    design: {
      borderRadius: "16px",
      shadow: "0 10px 20px rgba(0,0,0,0.3)",
      fontFamily: "Spartacus, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Modern Minimal
  modernMinimal: {
    name: "Modern Minimal",
    colors: {
      primary: "#6366F1",
      secondary: "#4F46E5",
      background: {
        light: "#F8FAFC",
        dark: "#1E293B",
      },
      text: {
        primary: "#1E293B",
        secondary: "#64748B",
      },
      accent: "#818CF8",
      border: "#E2E8F0",
    },
    design: {
      borderRadius: "8px",
      shadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
      fontFamily: "Inter, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Dark Elegance
  darkElegance: {
    name: "Dark Elegance",
    colors: {
      primary: "#A855F7",
      secondary: "#9333EA",
      background: {
        light: "#1F1F1F",
        dark: "#0F0F0F",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#A3A3A3",
      },
      accent: "#C084FC",
      border: "#404040",
    },
    design: {
      borderRadius: "12px",
      shadow: "0 8px 24px rgba(168, 85, 247, 0.25)",
      fontFamily: "Poppins, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Nature Inspired
  natureInspired: {
    name: "Nature Inspired",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: {
        light: "#F0FDF4",
        dark: "#064E3B",
      },
      text: {
        primary: "#064E3B",
        secondary: "#065F46",
      },
      accent: "#10B981",
      border: "#D1FAE5",
    },
    design: {
      borderRadius: "16px",
      shadow: "0 10px 15px rgba(5, 150, 105, 0.2)",
      fontFamily: "Quicksand, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Ocean Breeze
  oceanBreeze: {
    name: "Ocean Breeze",
    colors: {
      primary: "#0EA5E9",
      secondary: "#0284C7",
      background: {
        light: "#F0F9FF",
        dark: "#0C4A6E",
      },
      text: {
        primary: "#0C4A6E",
        secondary: "#0369A1",
      },
      accent: "#38BDF8",
      border: "#BAE6FD",
    },
    design: {
      borderRadius: "20px",
      shadow: "0 12px 24px rgba(14, 165, 233, 0.2)",
      fontFamily: "Nunito, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Royal Gold
  royalGold: {
    name: "Royal Gold",
    colors: {
      primary: "#D4AF37",
      secondary: "#C5A028",
      background: {
        light: "#1E1E1E",
        dark: "#121212",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#CCCCCC",
      },
      accent: "#F0C75E",
      border: "#3D3D3D",
    },
    design: {
      borderRadius: "8px",
      shadow: "0 8px 20px rgba(212, 175, 55, 0.25)",
      fontFamily: "Cinzel, serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Sunset Glow
  sunsetGlow: {
    name: "Sunset Glow",
    colors: {
      primary: "#F43F5E",
      secondary: "#E11D48",
      background: {
        light: "#FFFBEB",
        dark: "#7C2D12",
      },
      text: {
        primary: "#7C2D12",
        secondary: "#9A3412",
      },
      accent: "#FB923C",
      border: "#FED7AA",
    },
    design: {
      borderRadius: "16px",
      shadow: "0 10px 20px rgba(244, 63, 94, 0.2)",
      fontFamily: "DM Sans, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Cyber Neon
  cyberNeon: {
    name: "Cyber Neon",
    colors: {
      primary: "#10B981",
      secondary: "#059669",
      background: {
        light: "#18181B",
        dark: "#09090B",
      },
      text: {
        primary: "#F4F4F5",
        secondary: "#A1A1AA",
      },
      accent: "#14F5D6",
      border: "#27272A",
    },
    design: {
      borderRadius: "4px",
      shadow: "0 0 20px rgba(20, 245, 214, 0.3)",
      fontFamily: "JetBrains Mono, monospace",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Midnight Blue
  midnightBlue: {
    name: "Midnight Blue",
    colors: {
      primary: "#3B82F6",
      secondary: "#1D4ED8",
      background: {
        light: "#0F172A",
        dark: "#020617",
      },
      text: {
        primary: "#F1F5F9",
        secondary: "#94A3B8",
      },
      accent: "#60A5FA",
      border: "#1E293B",
    },
    design: {
      borderRadius: "10px",
      shadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
      fontFamily: "Space Grotesk, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Cherry Blossom
  cherryBlossom: {
    name: "Cherry Blossom",
    colors: {
      primary: "#EC4899",
      secondary: "#DB2777",
      background: {
        light: "#FFF1F2",
        dark: "#881337",
      },
      text: {
        primary: "#881337",
        secondary: "#9F1239",
      },
      accent: "#F9A8D4",
      border: "#FBE7EF",
    },
    design: {
      borderRadius: "20px",
      shadow: "0 10px 20px rgba(236, 72, 153, 0.2)",
      fontFamily: "M PLUS Rounded 1c, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Vintage Paper
  vintagePaper: {
    name: "Vintage Paper",
    colors: {
      primary: "#B45309",
      secondary: "#92400E",
      background: {
        light: "#FFFBEB",
        dark: "#7C2D12",
      },
      text: {
        primary: "#713F12",
        secondary: "#854D0E",
      },
      accent: "#D97706",
      border: "#FEF3C7",
    },
    design: {
      borderRadius: "6px",
      shadow: "0 6px 15px rgba(180, 83, 9, 0.15)",
      fontFamily: "EB Garamond, serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Nordic Frost
  nordicFrost: {
    name: "Nordic Frost",
    colors: {
      primary: "#06B6D4",
      secondary: "#0891B2",
      background: {
        light: "#ECFEFF",
        dark: "#164E63",
      },
      text: {
        primary: "#164E63",
        secondary: "#155E75",
      },
      accent: "#67E8F9",
      border: "#CFFAFE",
    },
    design: {
      borderRadius: "16px",
      shadow: "0 10px 20px rgba(6, 182, 212, 0.2)",
      fontFamily: "Montserrat, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Emerald Forest
  emeraldForest: {
    name: "Emerald Forest",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      background: {
        light: "#022c22",
        dark: "#021b15",
      },
      text: {
        primary: "#ecfdf5",
        secondary: "#a7f3d0",
      },
      accent: "#10b981",
      border: "#065f46",
    },
    design: {
      borderRadius: "12px",
      shadow: "0 10px 25px rgba(5, 150, 105, 0.25)",
      fontFamily: "Raleway, sans-serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },

  // Amber Whiskey
  amberWhiskey: {
    name: "Amber Whiskey",
    colors: {
      primary: "#D97706",
      secondary: "#B45309",
      background: {
        light: "#292524",
        dark: "#1C1917",
      },
      text: {
        primary: "#FAFAF9",
        secondary: "#D6D3D1",
      },
      accent: "#F59E0B",
      border: "#44403C",
    },
    design: {
      borderRadius: "10px",
      shadow: "0 15px 30px rgba(217, 119, 6, 0.2)",
      fontFamily: "Playfair Display, serif",
      animation: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
};

// Theme context and provider
export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("ancientGreek");
  const [customTheme, setCustomTheme] = useState(null);
  const [position, setPosition] = useState("right"); // default position

  const theme = customTheme || themes[currentTheme];

  const updateTheme = (newTheme) => {
    setCurrentTheme(newTheme);
    setCustomTheme(null);
  };

  const updateCustomTheme = (newCustomTheme) => {
    setCustomTheme(newCustomTheme);
  };

  const togglePosition = () => {
    setPosition(position === "right" ? "left" : "right");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        updateCustomTheme,
        position,
        togglePosition,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
