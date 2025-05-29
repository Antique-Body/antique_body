"use client";
import { Icon } from "@iconify/react";

import { FormSection, LocationSelector } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks/usePrefillFromSession";

export const ProfileAndContactStep = ({ formData, onChange, errors }) => {
  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "email", sessionKey: "email" },
      { formKey: "phone", sessionKey: "phone" },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <FormSection
        title="Contact Information"
        description="How clients can reach you"
        icon={<Icon icon="mdi:contact-mail" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="your.email@example.com"
            error={errors.email}
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            placeholder="+387 XX XXX XXX"
            error={errors.phone}
          />
        </div>
      </FormSection>

      {/* Location Information */}
      <FormSection
        title="Location"
        description="Where you're based and available for training"
        icon={<Icon icon="mdi:map-marker" width={20} height={20} />}
      >
        <LocationSelector
          formData={formData}
          onChange={onChange}
          title=""
          description=""
        />
      </FormSection>

      {/* Pricing */}
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
            onChange={onChange}
            options={[
              { value: "", label: "Select pricing approach" },
              { value: "fixed", label: "Fixed Rate - Set My Price" },
              { value: "negotiable", label: "Negotiable - Will Discuss" },
              { value: "package_deals", label: "Package Deals Available" },
              { value: "contact_for_pricing", label: "Contact for Pricing" },
              { value: "free_consultation", label: "Free Consultation First" },
              { value: "prefer_not_to_say", label: "Prefer Not to Display" },
            ]}
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
                onChange={onChange}
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
                onChange={onChange}
                options={[
                  { value: "BAM", label: "BAM - Bosnian Mark" },
                  { value: "DIN", label: "DIN - Serbian Dinar" },
                  { value: "EUR", label: "EUR - Euro" },
                  { value: "USD", label: "USD - US Dollar" },
                  { value: "GBP", label: "GBP - British Pound" },
                ]}
              />
            </div>
          )}
        </div>
      </FormSection>
    </div>
  );
};
