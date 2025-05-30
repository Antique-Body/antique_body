"use client";
import { Icon } from "@iconify/react";

import { fetchGeoapifySuggestions } from "@/app/utils/geoapify";
import { FormField } from "@/components/common";

// Country options from countryOptions.js

export const LocationSelector = ({
  formData,
  onChange,
  errors = {},
  title = "Location Information",
  description = "This helps clients find you in their area",
}) => {
  // Helper za Geoapify za State i Country
  const fetchStateSuggestions = async (query) => {
    const results = await fetchGeoapifySuggestions(query);
    // Filtriraj samo unique state
    const unique = [];
    const seen = new Set();
    for (const r of results) {
      if (r.state && !seen.has(r.state)) {
        unique.push({ value: r.state, label: r.state });
        seen.add(r.state);
      }
    }
    return unique;
  };
  const fetchCountrySuggestions = async (query) => {
    const results = await fetchGeoapifySuggestions(query);
    // Filtriraj samo unique country
    const unique = [];
    const seen = new Set();
    for (const r of results) {
      if (r.country && !seen.has(r.country)) {
        unique.push({ value: r.country, label: r.country });
        seen.add(r.country);
      }
    }
    return unique;
  };

  console.log(errors, "errors");

  // Preporučeni gradovi (puni naziv iz Geoapify)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* City as async searchableSelect */}
        <FormField
          label="City"
          name="location.city"
          type="searchableSelect"
          value={formData.location.city}
          asyncSearch={fetchGeoapifySuggestions}
          onSelectOption={(option) => {
            onChange({
              target: {
                name: "location.city",
                value: option.city || option.label || "",
              },
            });
            onChange({
              target: { name: "location.state", value: option.state || "" },
            });
            onChange({
              target: { name: "location.country", value: option.country || "" },
            });
            onChange({
              target: {
                name: "location.postalCode",
                value: option.postalCode || "",
              },
            });
          }}
          onChange={onChange}
          placeholder="Start typing your city..."
          error={errors["location.city"]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* State/Province as async searchableSelect */}
          <FormField
            label="State/Province"
            name="location.state"
            type="searchableSelect"
            value={formData.location.state}
            asyncSearch={fetchStateSuggestions}
            onSelectOption={(option) => {
              onChange({
                target: { name: "location.state", value: option.value },
              });
            }}
            onChange={onChange}
            placeholder="Type to search state/province..."
            error={errors["location.state"]}
          />
          {/* Country as async searchableSelect */}
          <FormField
            label="Country"
            name="location.country"
            type="searchableSelect"
            value={formData.location.country}
            asyncSearch={fetchCountrySuggestions}
            onSelectOption={(option) => {
              onChange({
                target: { name: "location.country", value: option.value },
              });
            }}
            onChange={onChange}
            placeholder="Type to search country..."
            error={errors["location.country"]}
          />
        </div>

        {/* Postal Code as normal input, auto-filled if available */}
        <FormField
          label="Postal Code (Optional)"
          name="location.postalCode"
          value={formData.location.postalCode || ""}
          onChange={onChange}
          placeholder="Your postal code"
          error={errors["location.postalCode"]}
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
            {formData.location.postalCode && ` ${formData.location.postalCode}`}
            {formData.location.state && `, ${formData.location.state}`}
            {formData.location.country && `, ${formData.location.country}`}
          </p>
        </div>
      )}
    </div>
  );
};
