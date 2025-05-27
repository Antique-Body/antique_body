"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { FormField } from "@/components/common";

const languages = [
  { value: "", label: "Select a language" },
  { value: "en", label: "English 🇺🇸" },
  { value: "bs", label: "Bosanski 🇧🇦" },
  { value: "de", label: "Deutsch 🇩🇪" },
  { value: "hr", label: "Hrvatski 🇭🇷" },
  { value: "sr", label: "Српски 🇷🇸" },
  { value: "sl", label: "Slovenščina 🇸🇮" },
  { value: "fr", label: "Français 🇫🇷" },
  { value: "es", label: "Español 🇪🇸" },
  { value: "it", label: "Italiano 🇮🇹" },
  { value: "pt", label: "Português 🇵🇹" },
  { value: "ru", label: "Русский 🇷🇺" },
  { value: "ar", label: "العربية 🇸🇦" },
  { value: "zh", label: "中文 🇨🇳" },
  { value: "ja", label: "日本語 🇯🇵" },
  { value: "ko", label: "한국어 🇰🇷" },
  { value: "nl", label: "Nederlands 🇳🇱" },
  { value: "pl", label: "Polski 🇵🇱" },
  { value: "tr", label: "Türkçe 🇹🇷" },
  { value: "sv", label: "Svenska 🇸🇪" },
  { value: "no", label: "Norsk 🇳🇴" },
];

export const LanguageSelector = ({ selectedLanguages = [], onChange }) => {
  const [currentSelection, setCurrentSelection] = useState("");

  const handleLanguageSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedLanguages.includes(selectedValue)) {
      const newLanguages = [...selectedLanguages, selectedValue];
      onChange(newLanguages);
    }
    setCurrentSelection(""); // Reset dropdown
  };

  const removeLanguage = (langCode) => {
    const newLanguages = selectedLanguages.filter((lang) => lang !== langCode);
    onChange(newLanguages);
  };

  // Filter out already selected languages from dropdown options
  const availableLanguages = languages.filter(
    (lang) => !selectedLanguages.includes(lang.value)
  );

  return (
    <div className="space-y-4">
      {/* Multi-select dropdown */}
      <FormField
        type="select"
        label="Languages Spoken"
        name="languageSelector"
        value={currentSelection}
        onChange={handleLanguageSelect}
        options={availableLanguages}
        placeholder="Select a language to add"
        subLabel="Choose all languages you can communicate in with clients"
      />

      {/* Selected languages display */}
      {selectedLanguages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Selected languages ({selectedLanguages.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((langCode) => {
              const language = languages.find(
                (lang) => lang.value === langCode
              );
              return language ? (
                <div
                  key={langCode}
                  className="flex items-center gap-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-3 py-1 text-sm text-[#FF6B00]"
                >
                  <span>{language.label}</span>
                  <button
                    type="button"
                    onClick={() => removeLanguage(langCode)}
                    className="ml-1 hover:text-red-400 transition-colors"
                  >
                    <Icon icon="mdi:close" width={14} height={14} />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {selectedLanguages.length === 0 && (
        <p className="text-sm text-red-400">
          Please select at least one language
        </p>
      )}
    </div>
  );
};
