"use client";
import { Icon } from "@iconify/react";

import { FormField } from "@/components/common";
import { InfoBanner } from "@/components/custom/personal-details/shared/InfoBanner";
import {
  searchCities,
  searchStates,
  searchCountries,
  geocodePlaceId,
} from "@/lib/googlePlaces";

// Country options from countryOptions.js

export const LocationSelector = ({
  formData,
  onChange,
  errors = {},
  title = "Location Information",
  description = "This helps clients find you in their area",
}) => (
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
        value={formData.location?.city || ""}
        asyncSearch={searchCities}
        onSelectOption={async (option) => {
          // 1. Postavi city
          onChange({
            target: {
              name: "location.city",
              value: option.label || "",
            },
          });
          // 2. Dohvati detalje grada
          if (option.place_id) {
            const details = await geocodePlaceId(option.place_id);
            // 3. Izvuci state/country iz address_components
            let state = "";
            let country = "";
            if (details && details.raw && details.raw.address_components) {
              for (const comp of details.raw.address_components) {
                if (comp.types.includes("administrative_area_level_1"))
                  state = comp.long_name;
                if (comp.types.includes("country")) country = comp.long_name;
              }
            }
            onChange({ target: { name: "location.state", value: state } });
            onChange({ target: { name: "location.country", value: country } });
            onChange({
              target: { name: "location.lat", value: details.lat },
            });
            onChange({
              target: { name: "location.lon", value: details.lon },
            });
          }
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
          value={formData.location?.state || ""}
          asyncSearch={searchStates}
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
          value={formData.location?.country || ""}
          asyncSearch={searchCountries}
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
    </div>

    {/* Location preview */}
    {formData.location?.city && formData.location?.country && (
      <InfoBanner
        icon={"mdi:map-marker"}
        title="Your Location:"
        subtitle={
          formData.location.city +
          (formData.location.state ? `, ${formData.location.state}` : "") +
          (formData.location.country ? `, ${formData.location.country}` : "")
        }
        variant="primary"
        className="mt-4"
      />
    )}
  </div>
);
