"use client";
import { Icon } from "@iconify/react";

import { FormSection, LocationSelector } from "../shared";

import { FormField } from "@/components/common";

export const ProfileAndContactStep = ({ formData, onChange, errors }) => (
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

    {/* Availability */}
    <FormSection
      title="Availability"
      description="When are you typically available for training sessions?"
      icon={<Icon icon="mdi:clock-outline" width={20} height={20} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Preferred Training Hours"
          name="preferredHours"
          type="select"
          value={formData.preferredHours}
          onChange={onChange}
          options={[
            { value: "", label: "Select preferred hours" },
            { value: "early_morning", label: "Early Morning (6-9 AM)" },
            { value: "morning", label: "Morning (9-12 PM)" },
            { value: "afternoon", label: "Afternoon (12-5 PM)" },
            { value: "evening", label: "Evening (5-8 PM)" },
            { value: "late_evening", label: "Late Evening (8-10 PM)" },
            { value: "flexible", label: "Flexible/All Hours" },
          ]}
        />

        <FormField
          label="Available Days"
          name="availableDays"
          type="select"
          value={formData.availableDays}
          onChange={onChange}
          options={[
            { value: "", label: "Select available days" },
            { value: "weekdays", label: "Weekdays Only" },
            { value: "weekends", label: "Weekends Only" },
            { value: "all_week", label: "All Week" },
            { value: "custom", label: "Custom Schedule" },
          ]}
        />
      </div>
    </FormSection>
  </div>
);
