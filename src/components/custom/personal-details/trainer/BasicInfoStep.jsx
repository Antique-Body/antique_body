"use client";
import { Icon } from "@iconify/react";

import { FormSection, SpecialtySelector } from "../shared";

import { FormField } from "@/components/common";

export const BasicInfoStep = ({ formData, onChange, errors }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSpecialtyChange = (specialties) => {
    onChange({
      target: {
        name: "specialties",
        value: specialties,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <FormSection
        title="Personal Information"
        description="Basic information about yourself"
        icon={<Icon icon="mdi:account" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            placeholder="Your first name"
            error={errors.firstName}
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            placeholder="Your last name"
            error={errors.lastName}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={onChange}
            error={errors.dateOfBirth}
          />

          <FormField
            label="Gender"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={onChange}
            error={errors.gender}
            options={[
              { value: "", label: "Select gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
        </div>
      </FormSection>

      {/* Professional Information */}
      <FormSection
        title="Professional Information"
        description="Your training background and expertise"
        icon={<Icon icon="mdi:badge-account" width={20} height={20} />}
      >
        <div className="space-y-4">
          <FormField
            label="Training Since (Year)"
            name="trainingSince"
            type="select"
            value={formData.trainingSince}
            onChange={onChange}
            error={errors.trainingSince}
            options={[
              { value: "", label: "Select year" },
              ...yearOptions.map((year) => ({
                value: year.toString(),
                label: year.toString(),
              })),
            ]}
          />

          {/* Experience calculation display */}
          {formData.trainingSince && (
            <div className="p-4 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF6B00]/5 border border-[#FF6B00]/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                  <Icon
                    icon="mdi:calendar-clock"
                    width={20}
                    height={20}
                    className="text-[#FF6B00]"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FF6B00]">
                    {currentYear - parseInt(formData.trainingSince)} years of
                    experience
                  </p>
                  <p className="text-xs text-gray-400">
                    Training since {formData.trainingSince}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      {/* Training Specialties */}
      <FormSection
        title="Training Specialties"
        description="Select all areas you specialize in or have experience with"
        icon={<Icon icon="mdi:medal" width={20} height={20} />}
      >
        <SpecialtySelector
          selectedSpecialties={formData.specialties || []}
          onChange={handleSpecialtyChange}
        />
      </FormSection>
    </div>
  );
};
