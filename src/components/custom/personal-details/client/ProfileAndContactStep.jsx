"use client";
import { Icon } from "@iconify/react";

import { FormSection, LocationSelector } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";

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
        description="Where you're based and looking for training"
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

      {/* Availability */}
      <FormSection
        title="Availability"
        description="When are you typically available for training?"
        icon={<Icon icon="mdi:clock-time-four" width={20} height={20} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Preferred Time of Day"
              name="preferredTimeOfDay"
              type="select"
              value={formData.preferredTimeOfDay}
              onChange={onChange}
              error={errors.preferredTimeOfDay}
              options={[
                { value: "", label: "Select preferred time" },
                { value: "early_morning", label: "Early Morning (5am-8am)" },
                { value: "morning", label: "Morning (8am-12pm)" },
                { value: "afternoon", label: "Afternoon (12pm-5pm)" },
                { value: "evening", label: "Evening (5pm-9pm)" },
                { value: "late_night", label: "Late Night (9pm+)" },
                { value: "flexible", label: "Flexible / Varies" },
              ]}
            />

            <FormField
              label="Preferred Days"
              name="preferredDays"
              type="select"
              value={formData.preferredDays}
              onChange={onChange}
              error={errors.preferredDays}
              options={[
                { value: "", label: "Select preferred days" },
                { value: "weekdays", label: "Weekdays (Mon-Fri)" },
                { value: "weekends", label: "Weekends (Sat-Sun)" },
                { value: "all_days", label: "Any day of the week" },
                { value: "flexible", label: "Flexible / Varies" },
              ]}
            />
          </div>

          <FormField
            label="Additional Notes on Availability"
            name="availabilityNotes"
            type="textarea"
            value={formData.availabilityNotes}
            onChange={onChange}
            error={errors.availabilityNotes}
            placeholder="Add any specific details about your availability..."
            rows={3}
          />
        </div>
      </FormSection>
    </div>
  );
};
