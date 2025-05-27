"use client";
import { useState, useEffect } from "react";
import { FormField } from "@/components/common";
import { Icon } from "@iconify/react";

export const LocationSelector = ({
  formData,
  onChange,
  title = "Location Information",
  description = "This helps clients find you in their area",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock function for location suggestions - in real app, integrate with Google Places API
  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    // Mock suggestions - replace with actual Google Places API call
    const mockSuggestions = [
      {
        id: 1,
        description: `${query}, Bosnia and Herzegovina`,
        city: query,
        country: "Bosnia and Herzegovina",
      },
      {
        id: 2,
        description: `${query}, Croatia`,
        city: query,
        country: "Croatia",
      },
      {
        id: 3,
        description: `${query}, Serbia`,
        city: query,
        country: "Serbia",
      },
      {
        id: 4,
        description: `${query}, Slovenia`,
        city: query,
        country: "Slovenia",
      },
      {
        id: 5,
        description: `${query}, Germany`,
        city: query,
        country: "Germany",
      },
    ];

    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setIsLoading(false);
    }, 300);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    onChange(e);

    if (value.length >= 3) {
      setShowSuggestions(true);
      fetchLocationSuggestions(value);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onChange({
      target: {
        name: "location.city",
        value: suggestion.city,
      },
    });

    onChange({
      target: {
        name: "location.country",
        value: suggestion.country,
      },
    });

    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* City with autocomplete */}
        <div className="relative">
          <FormField
            label="City"
            name="location.city"
            value={formData.location.city}
            onChange={handleCityChange}
            placeholder="Start typing your city..."
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF6B00]"></div>
                  <span className="ml-2">Searching...</span>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left p-3 hover:bg-[#333] text-gray-300 hover:text-white transition-colors border-b border-[#333] last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:map-marker"
                        width={16}
                        height={16}
                        className="text-gray-400"
                      />
                      <span className="text-sm">{suggestion.description}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="State/Province"
            name="location.state"
            value={formData.location.state}
            onChange={onChange}
            placeholder="Your state or province"
          />

          <FormField
            label="Country"
            name="location.country"
            value={formData.location.country}
            onChange={onChange}
            placeholder="Your country"
          />
        </div>

        {/* Optional: Postal Code */}
        <FormField
          label="Postal Code (Optional)"
          name="location.postalCode"
          value={formData.location.postalCode || ""}
          onChange={onChange}
          placeholder="Your postal code"
        />
      </div>

      {/* Location preview */}
      {formData.location.city && formData.location.country && (
        <div className="mt-4 p-3 bg-[rgba(255,107,0,0.1)] border border-[#FF6B00]/30 rounded-lg">
          <div className="flex items-center gap-2 text-[#FF6B00]">
            <Icon icon="mdi:map-marker" width={16} height={16} />
            <span className="text-sm font-medium">Your Location:</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            {formData.location.city}
            {formData.location.state && `, ${formData.location.state}`}
            {formData.location.country && `, ${formData.location.country}`}
            {formData.location.postalCode && ` ${formData.location.postalCode}`}
          </p>
        </div>
      )}
    </div>
  );
};
