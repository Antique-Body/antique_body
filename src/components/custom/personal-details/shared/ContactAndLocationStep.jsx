"use client";
import { Icon } from "@iconify/react";

import { FormSection } from "./";

import { FormField, InfoBanner } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";
import {
  searchCities,
  searchStates,
  searchCountries,
  geocodePlaceId,
} from "@/lib/googlePlaces";

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

  // For trainers, add special handling for pricing
  const handleChange = (e) => {
    if (
      userType === "trainer" &&
      e.target &&
      e.target.name === "pricePerSession"
    ) {
      const value = e.target.value;
      onChange({
        target: {
          name: "pricePerSession",
          value: value === "" ? "" : Number(value),
        },
      });
    } else {
      onChange(e);
    }
  };

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
    <div className="space-y-6">
      {/* Contact Information */}
      <FormSection
        title="Contact Information"
        description={
          userType === "trainer"
            ? "How clients can reach you"
            : "How trainers can reach you"
        }
        icon={<Icon icon="mdi:contact-mail" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={onChange}
            placeholder="your.email@example.com"
            error={errors.contactEmail}
          />

          <FormField
            label="Phone Number"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={onChange}
            placeholder="+387 XX XXX XXX"
            error={errors.contactPhone}
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
        icon={<Icon icon="mdi:map-marker" width={20} height={20} />}
      >
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
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
        {/* Location preview */}
        {formData.location?.city && formData.location?.country && (
          <InfoBanner
            icon={"mdi:map-marker"}
            title="Your Location:"
            subtitle={
              formData.location.city +
              (formData.location.state ? `, ${formData.location.state}` : "") +
              (formData.location.country
                ? `, ${formData.location.country}`
                : "")
            }
            variant="primary"
            className="mt-4"
          />
        )}
      </FormSection>

      {/* Pricing - Only for trainers */}
      {userType === "trainer" && (
        <FormSection
          title="Pricing"
          description="Set your session rates and pricing preferences"
          icon={<Icon icon="mdi:currency-usd" width={20} height={20} />}
        >
          <div className="space-y-4">
            <FormField
              label="Pricing Approach"
              name="pricingType"
              type="select"
              value={formData.pricingType}
              onChange={handleChange}
              options={[
                { value: "", label: "Select pricing approach" },
                { value: "fixed", label: "Fixed Rate - Set My Price" },
                { value: "negotiable", label: "Negotiable - Will Discuss" },
                { value: "package_deals", label: "Package Deals Available" },
                { value: "contact_for_pricing", label: "Contact for Pricing" },
                {
                  value: "free_consultation",
                  label: "Free Consultation First",
                },
                { value: "prefer_not_to_say", label: "Prefer Not to Display" },
              ]}
              error={errors.pricingType}
            />

            {/* Show price field only for specific pricing types */}
            {(formData.pricingType === "fixed" ||
              formData.pricingType === "package_deals") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label={
                    formData.pricingType === "package_deals"
                      ? "Starting Price per Session"
                      : "Price per Session"
                  }
                  name="pricePerSession"
                  type="number"
                  value={formData.pricePerSession}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  step="5"
                  error={errors.pricePerSession}
                />

                <FormField
                  label="Currency"
                  name="currency"
                  type="select"
                  value={formData.currency || "EUR"}
                  onChange={handleChange}
                  options={[
                    { value: "BAM", label: "BAM - Bosnian Mark" },
                    { value: "RSD", label: "RSD - Serbian Dinar" },
                    { value: "EUR", label: "EUR - Euro" },
                    { value: "USD", label: "USD - US Dollar" },
                    { value: "GBP", label: "GBP - British Pound" },
                  ]}
                />
              </div>
            )}
          </div>
        </FormSection>
      )}
    </div>
  );
};
