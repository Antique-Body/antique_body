"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/common/Button";

const languages = [
  { code: "en", name: "English" },
  { code: "bs", name: "Bosanski" },
  { code: "de", name: "Deutsch" },
  { code: "hr", name: "Hrvatski" },
  { code: "sr", name: "Српски" },
  { code: "sl", name: "Slovenščina" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      i18n.changeLanguage("en");
      localStorage.setItem("language", "en");
    }
    setMounted(true);
  }, [i18n]);

  const handleLanguageChange = async (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
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
    languages.find((lang) => lang.code === i18n.language)?.name || "Language";

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      style={{ position: "relative", zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
        type="button"
        style={{ position: "relative", zIndex: 9999 }}
      >
        <span suppressHydrationWarning>{currentLanguage}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg"
          style={{
            position: "absolute",
            zIndex: 9999,
            minWidth: "150px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? "ghostOrange" : "ghost"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLanguageChange(lang.code);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                i18n.language === lang.code
                  ? "text-[#ff7800] bg-zinc-800"
                  : "text-gray-300 hover:text-white hover:bg-zinc-800"
              }`}
              type="button"
            >
              {lang.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
