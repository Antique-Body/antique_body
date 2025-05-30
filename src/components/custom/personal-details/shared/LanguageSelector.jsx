"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import countryOptions from "@/app/utils/countryOptions";
import { Button } from "@/components/common/Button";
import { CountrySelect } from "@/components/common/CountrySelect";

// Utility za jedinstvene jezike
const getUniqueLanguages = () => {
  const seen = new Set();
  return countryOptions.filter(
    (option) =>
      option.languageName &&
      !seen.has(option.languageName) &&
      seen.add(option.languageName)
  );
};

export const LanguageSelector = ({
  selectedLanguages = [],
  onChange,
  error,
}) => {
  const [currentSelection, setCurrentSelection] = useState("");

  const handleLanguageSelect = (selectedCountry) => {
    const selectedObj = countryOptions.find(
      (c) =>
        c.value === selectedCountry ||
        c.label === selectedCountry ||
        c.languageName === selectedCountry
    );
    if (selectedObj && !selectedLanguages.includes(selectedObj.languageName)) {
      const newLanguages = [...selectedLanguages, selectedObj.languageName];
      onChange(newLanguages);
    }
    setCurrentSelection(""); // Reset dropdown
  };

  const removeLanguage = (langCode) => {
    const newLanguages = selectedLanguages.filter((lang) => lang !== langCode);
    onChange(newLanguages);
  };

  // Filtriraj već odabrane jezike
  const availableLanguages = getUniqueLanguages().filter(
    (option) => !selectedLanguages.includes(option.languageName)
  );

  return (
    <div className="space-y-4">
      {/* Multi-select dropdown */}
      <CountrySelect
        value={currentSelection}
        onChange={(e) => handleLanguageSelect(e.target ? e.target.value : e)}
        displayMode="flagAndName"
        options={availableLanguages}
        placeholder="Select a language to add"
        name="languageSelector"
        showLanguageName={true}
        displayLanguageOnly={true}
        showShortCode={false}
        error={error}
      />

      {/* Selected languages display */}
      {selectedLanguages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            Selected languages ({selectedLanguages.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.map((languageName) => (
              <div
                key={languageName}
                className="flex items-center gap-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 px-3 py-1 text-sm text-[#FF6B00]"
              >
                <span>{languageName}</span>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => removeLanguage(languageName)}
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <Icon icon="mdi:close" width={14} height={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
