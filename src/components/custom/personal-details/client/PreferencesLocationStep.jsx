"use client";
import { Icon } from "@iconify/react";

import { FormSection, LocationSelector } from "../shared";

import { FormField } from "@/components/common";

const timeSlots = [
  {
    id: "early_morning",
    label: "Early Morning",
    time: "6:00 - 9:00 AM",
    icon: "mdi:weather-sunset-up",
  },
  {
    id: "morning",
    label: "Morning",
    time: "9:00 AM - 12:00 PM",
    icon: "mdi:white-balance-sunny",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    time: "12:00 - 5:00 PM",
    icon: "mdi:weather-sunny",
  },
  {
    id: "evening",
    label: "Evening",
    time: "5:00 - 8:00 PM",
    icon: "mdi:weather-sunset-down",
  },
  {
    id: "late_evening",
    label: "Late Evening",
    time: "8:00 - 10:00 PM",
    icon: "mdi:weather-night",
  },
];

const daysOfWeek = [
  { id: "monday", label: "Mon", fullLabel: "Monday" },
  { id: "tuesday", label: "Tue", fullLabel: "Tuesday" },
  { id: "wednesday", label: "Wed", fullLabel: "Wednesday" },
  { id: "thursday", label: "Thu", fullLabel: "Thursday" },
  { id: "friday", label: "Fri", fullLabel: "Friday" },
  { id: "saturday", label: "Sat", fullLabel: "Saturday" },
  { id: "sunday", label: "Sun", fullLabel: "Sunday" },
];

export const PreferencesLocationStep = ({ formData, onChange, errors }) => {
  const handleTimeSlotToggle = (slotId) => {
    const currentSlots = formData.preferredTimeSlots || [];
    const newSlots = currentSlots.includes(slotId)
      ? currentSlots.filter((id) => id !== slotId)
      : [...currentSlots, slotId];

    onChange({
      target: {
        name: "preferredTimeSlots",
        value: newSlots,
      },
    });
  };

  const handleDayToggle = (dayId) => {
    const currentDays = formData.preferredDays || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter((id) => id !== dayId)
      : [...currentDays, dayId];

    onChange({
      target: {
        name: "preferredDays",
        value: newDays,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <FormSection
        title="Location"
        description="Help us find trainers near you"
        icon={<Icon icon="mdi:map-marker" width={20} height={20} />}
      >
        <LocationSelector
          formData={formData}
          onChange={onChange}
          title=""
          description=""
        />
      </FormSection>

      {/* Trainer Preferences */}
      <FormSection
        title="Trainer Preferences"
        description="Help us match you with the right trainer"
        icon={<Icon icon="mdi:account-search" width={20} height={20} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Trainer Gender Preference"
              name="trainerGenderPreference"
              type="select"
              value={formData.trainerGenderPreference}
              onChange={onChange}
              options={[
                { value: "", label: "No preference" },
                { value: "male", label: "Male trainer" },
                { value: "female", label: "Female trainer" },
              ]}
            />
          </div>

          <FormField
            label="Budget Range (per session)"
            name="budgetRange"
            type="select"
            value={formData.budgetRange}
            onChange={onChange}
            options={[
              { value: "", label: "Select budget range" },
              { value: "under_30", label: "Under 30 KM" },
              { value: "30_50", label: "30-50 KM" },
              { value: "50_80", label: "50-80 KM" },
              { value: "80_120", label: "80-120 KM" },
              { value: "over_120", label: "Over 120 KM" },
            ]}
          />

          <FormField
            label="Special Requests or Notes"
            name="specialRequests"
            type="textarea"
            value={formData.specialRequests}
            onChange={onChange}
            placeholder="Any specific requirements, goals, or things you'd like your trainer to know..."
            rows={3}
          />
        </div>
      </FormSection>

      {/* Contact Information */}
      <FormSection
        title="Contact Information"
        description="How trainers can reach you"
        icon={<Icon icon="mdi:contact-mail" width={20} height={20} />}
      >
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          placeholder="+387 XX XXX XXX"
          error={errors.phone}
        />
      </FormSection>
    </div>
  );
};
