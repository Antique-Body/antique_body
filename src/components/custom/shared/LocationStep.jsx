"use client";
import { Icon } from "@iconify/react";

import { FormField, InfoBanner } from "@/components/common";
import {
  searchCities,
  searchStates,
  searchCountries,
  geocodePlaceId,
} from "@/lib/googlePlaces";

export const LocationStep = ({
  formData,
  onChange,
  errors,
  userType = "client", // "client" or "trainer"
}) => {
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

  // Determine banner content based on user type
  const getBannerContent = () => {
    if (userType === "trainer") {
      return {
        title: "Increase your visibility",
        subtitle:
          "Adding your location helps clients find you and boosts your profile in local searches",
      };
    }

    return {
      title: "Find trainers near you",
      subtitle:
        "Sharing your location helps us match you with local trainers and personalize your fitness journey",
    };
  };

  const bannerContent = getBannerContent();

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon icon="mdi:map-marker" className="w-5 h-5 text-[#FF6B00]" />
          Location
          <span className="text-sm font-normal text-gray-400 ml-2">
            (Optional)
          </span>
        </h2>

        <div className="space-y-4 sm:space-y-5">
          {/* Optional Info Banner */}
          <InfoBanner
            icon="mdi:map-marker-radius"
            title={bannerContent.title}
            subtitle={bannerContent.subtitle}
            variant="info"
          />
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
      </div>
    </div>
  );
};
