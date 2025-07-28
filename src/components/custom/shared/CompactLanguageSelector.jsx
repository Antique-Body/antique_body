"use client";

import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", icon: "flag:gb-4x3" },
  { code: "bs", name: "Bosanski", icon: "flag:ba-4x3" },
  { code: "de", name: "Deutsch", icon: "flag:de-4x3" },
  { code: "hr", name: "Hrvatski", icon: "flag:hr-4x3" },
  { code: "sr", name: "Српски", icon: "flag:rs-4x3" },
  { code: "sl", name: "Slovenščina", icon: "flag:si-4x3" },
];

export const CompactLanguageSelector = ({ isCollapsed = false }) => {
  const { i18n } = useTranslation();
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize language from localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      } else {
        i18n.changeLanguage("en");
        localStorage.setItem("language", "en");
      }
    } catch (error) {
      console.warn("Error initializing language:", error);
      i18n.changeLanguage("en");
    }
    setMounted(true);
  }, [i18n]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (langCode) => {
    i18n.changeLanguage(langCode);
    try {
      localStorage.setItem("language", langCode);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
    setIsOpen(false);

    if (session?.user) {
      try {
        const response = await fetch("/api/users/update-language", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ language: langCode }),
        });

        if (response.ok) {
          await update({
            ...session,
            user: {
              ...session.user,
              language: langCode,
            },
          });
        } else {
          console.warn(
            "Failed to update language on server",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  if (!mounted) {
    return null;
  }

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div
      className={`relative ${isCollapsed ? "flex justify-center" : ""}`}
      ref={dropdownRef}
      role="application"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }}
    >
      <button
        onClick={toggleDropdown}
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } gap-2 px-3 py-2 rounded-xl ${
          isOpen
            ? "bg-zinc-700/80 border-zinc-600/70"
            : "bg-zinc-800/40 hover:bg-zinc-700/60 border-zinc-700/50 hover:border-zinc-600/50"
        } transition-all duration-200 text-white text-sm font-medium border ${
          isCollapsed ? "w-10 h-10" : "w-full"
        }`}
        type="button"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-black/20 shadow-inner">
            <Icon
              icon={currentLanguage.icon}
              width={isCollapsed ? 20 : 16}
              height={isCollapsed ? 20 : 16}
              className="transform scale-110"
            />
          </div>
          {!isCollapsed && (
            <span className="truncate font-medium">{currentLanguage.name}</span>
          )}
        </div>
        {!isCollapsed && (
          <Icon
            icon="mdi:chevron-down"
            width={16}
            height={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute w-full ${
            isCollapsed ? "left-full ml-2" : "top-full left-0 mt-1"
          } bg-zinc-900/95 backdrop-blur-md border border-zinc-700/70 rounded-xl shadow-lg shadow-black/30 z-50 min-w-[160px] overflow-hidden`}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${
                  i18n.language === lang.code
                    ? "text-[#FF6B00] bg-zinc-800/50"
                    : "text-gray-300 hover:text-white"
                }`}
                type="button"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-black/20 shadow-inner">
                  <Icon
                    icon={lang.icon}
                    width={16}
                    height={16}
                    className="transform scale-110"
                  />
                </div>
                <span>{lang.name}</span>
                {i18n.language === lang.code && (
                  <Icon
                    icon="mdi:check"
                    className="ml-auto text-[#FF6B00]"
                    width={16}
                    height={16}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && !isOpen && (
        <div className="absolute left-full ml-2 bg-zinc-800 text-white px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Change Language
        </div>
      )}
    </div>
  );
};
