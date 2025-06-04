"use client";
import { Icon } from "@iconify/react";

import { FormSection, LocationSelector } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";

export const ContactAndLocationStep = ({ formData, onChange, errors }) => {
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
        description="How trainers can reach you"
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
        description="Where you're based and looking for trainers"
        icon={<Icon icon="mdi:map-marker" width={20} height={20} />}
      >
        <LocationSelector
          formData={formData}
          onChange={onChange}
          errors={errors}
          title=""
          description=""
        />
      </FormSection>
    </div>
  );
};
