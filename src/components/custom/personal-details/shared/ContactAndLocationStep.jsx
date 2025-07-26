"use client";
import { Icon } from "@iconify/react";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";
import {
  searchCities,
  searchStates,
  searchCountries,
  geocodePlaceId,
} from "@/lib/googlePlaces";

import { FormSection } from "./";

export const ContactAndLocationStep = ({
  formData,
  onChange,
  errors,
  userType = "client", // "client" or "trainer"
}) => {
  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "contactEmail", sessionKey: "email" },
      { formKey: "contactPhone", sessionKey: "phone" },
    ],
  });

  // Custom handler for city select (Google Places)
  const handleCitySelect = async (option) => {
    onChange({
      target: {
        name: "location.city",
        value: option.label || "",
      },
    });
    if (option.place_id) {
      const details = await geocodePlaceId(option.place_id);
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
      onChange({ target: { name: "location.lat", value: details.lat } });
      onChange({ target: { name: "location.lon", value: details.lon } });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Contact Information */}
      <FormSection
        title="Contact Information"
        description={
          userType === "trainer"
            ? "How clients can reach you"
            : "How trainers can reach you"
        }
        icon="mdi:contact-mail"
        className="mb-4 sm:mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            label="Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={onChange}
            placeholder="your.email@example.com"
            error={errors.contactEmail}
            backgroundStyle="darker"
          />

          <FormField
            label="Phone Number"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={onChange}
            placeholder="+387 XX XXX XXX"
            error={errors.contactPhone}
            backgroundStyle="darker"
          />
        </div>
      </FormSection>

      {/* Location Information */}
      <FormSection
        title="Location"
        description={
          userType === "trainer"
            ? "Where you're based and available for training"
            : "Where you're based and looking for trainers"
        }
        icon="mdi:map-marker"
        className={userType === "trainer" ? "mb-6 sm:mb-8" : "mb-0"}
      >
        <div className="space-y-4 sm:space-y-5">
          <FormField
            label="City"
            name="location.city"
            type="searchableSelect"
            value={formData.location?.city || ""}
            asyncSearch={searchCities}
            onSelectOption={handleCitySelect}
            onChange={onChange}
            placeholder="Start typing your city..."
            error={errors["location.city"]}
            backgroundStyle="darker"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              backgroundStyle="darker"
            />

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
              backgroundStyle="darker"
            />
          </div>

          {/* Location preview */}
          {formData.location?.city && formData.location?.country && (
            <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <Icon
                  icon="mdi:map-marker"
                  className="w-14 h-14 text-green-400"
                />
                <div>
                  <p className="font-medium text-white">Your Location</p>
                  <p className="text-sm text-zinc-400">
                    {formData.location.city}
                    {formData.location.state
                      ? `, ${formData.location.state}`
                      : ""}
                    {formData.location.country
                      ? `, ${formData.location.country}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};
