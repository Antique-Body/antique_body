"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { FormField } from "@/components/common";
import { ErrorIcon } from "@/components/common/Icons";
import { SpecialtySelector } from "@/components/custom/shared";
import { EXPERIENCE_LEVELS } from "@/enums";
import { usePrefillFromSession } from "@/hooks";

import { FormSection } from "./";

export const BasicInfoStep = ({
  formData,
  onChange,
  errors,
  userType = "trainer",
}) => {
  const { data: session } = useSession();
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");

  // Generate year options for trainer experience
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "firstName", sessionKey: "firstName" },
      { formKey: "lastName", sessionKey: "lastName" },
    ],
  });

  // Calculate BMI for client profiles when height/weight changes
  useEffect(() => {
    if (userType !== "client") return;

    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100; // Convert cm to meters
      const bmiValue = (
        formData.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(bmiValue);

      // Determine BMI category
      if (bmiValue < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setBmiCategory("Normal weight");
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obesity");
      }
    } else {
      setBmi(null);
      setBmiCategory("");
    }
  }, [formData.height, formData.weight, userType]);

  // Handler for trainer specialty selection
  const handleSpecialtyChange = (specialties) => {
    onChange({
      target: {
        name: "specialties",
        value: specialties,
      },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Personal Information */}
      <FormSection
        title="Personal Information"
        description="Basic information about yourself"
        icon="mdi:account"
        className="mb-4 sm:mb-6"
      >
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName ?? session?.user?.firstName ?? ""}
              placeholder="Your first name"
              onChange={onChange}
              error={errors.firstName}
              backgroundStyle="darker"
              size="default"
            />

            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName ?? session?.user?.lastName ?? ""}
              placeholder="Your last name"
              onChange={onChange}
              error={errors.lastName}
              backgroundStyle="darker"
              size="default"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={onChange}
              error={errors.dateOfBirth}
              backgroundStyle="darker"
            />

            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={onChange}
              error={errors.gender}
              backgroundStyle="darker"
              options={[
                { value: "", label: "Select gender" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </div>
        </div>
      </FormSection>

      {/* Client-specific Physical Information */}
      {userType === "client" && (
        <FormSection
          title="Physical Information"
          description="Details about your physical characteristics"
          icon="mdi:human-male-height"
          className="mb-4 sm:mb-6"
        >
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                label="Height (cm)"
                name="height"
                type="number"
                value={formData.height}
                onChange={onChange}
                placeholder="Enter your height in cm"
                min="100"
                max="250"
                error={errors.height}
                backgroundStyle="darker"
              />

              <FormField
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={onChange}
                placeholder="Enter your weight in kg"
                min="30"
                max="250"
                error={errors.weight}
                backgroundStyle="darker"
              />
            </div>

            {/* BMI Display */}
            {bmi && (
              <div className="mt-4 p-4 rounded-xl border border-zinc-700 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon
                      icon="mdi:scale-bathroom"
                      className="w-5 h-5 text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      BMI: {bmi} - {bmiCategory}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Height: {formData.height}cm, Weight: {formData.weight}kg
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormSection>
      )}

      {/* Client-specific Fitness Experience */}
      {userType === "client" && (
        <FormSection
          title="Fitness Experience"
          description="Your background in fitness and exercise"
          icon="mdi:dumbbell"
          className="mb-4 sm:mb-6"
        >
          <div className="space-y-4 sm:space-y-5">
            <FormField
              label="Experience Level"
              name="experienceLevel"
              type="select"
              value={formData.experienceLevel}
              onChange={onChange}
              error={errors.experienceLevel}
              backgroundStyle="darker"
              options={[
                { value: "", label: "Select your experience level" },
                ...EXPERIENCE_LEVELS,
              ]}
            />

            <FormField
              label="Previous Activities"
              name="previousActivities"
              type="textarea"
              value={formData.previousActivities}
              onChange={onChange}
              placeholder="Describe any previous fitness activities or sports you've participated in..."
              rows={3}
              error={errors.previousActivities}
              backgroundStyle="darker"
            />
          </div>
        </FormSection>
      )}

      {/* Trainer-specific Professional Information */}
      {userType === "trainer" && (
        <FormSection
          title="Professional Information"
          description="Your training background and expertise"
          icon="mdi:badge-account"
          className="mb-4 sm:mb-6"
        >
          <div className="space-y-4 sm:space-y-5">
            <FormField
              label="Training Since (Year)"
              name="trainerSince"
              type="select"
              value={formData.trainerSince}
              onChange={onChange}
              error={errors.trainerSince}
              backgroundStyle="darker"
              options={[
                { value: "", label: "Select year" },
                ...yearOptions.map((year) => ({
                  value: year.toString(),
                  label: year.toString(),
                })),
              ]}
            />

            {/* Experience calculation display */}
            {formData.trainerSince && (
              <div className="p-4 rounded-xl border border-[#FF6B00]/20 bg-[#FF6B00]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF6B00]/20 rounded-xl flex items-center justify-center">
                    <Icon
                      icon="mdi:calendar-clock"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#FF6B00]">
                      {currentYear - Number.parseInt(formData.trainerSince)}{" "}
                      years of experience
                    </p>
                    <p className="text-sm text-zinc-400">
                      Training since {formData.trainerSince}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FormSection>
      )}

      {/* Trainer-specific Training Specialties */}
      {userType === "trainer" && (
        <FormSection
          title="Training Specialties"
          description="Select all areas you specialize in or have experience with"
          icon="mdi:medal"
          className="mb-0"
        >
          <div className="space-y-4 sm:space-y-5">
            <SpecialtySelector
              selectedSpecialties={formData.specialties || []}
              onChange={handleSpecialtyChange}
            />
            {errors.specialties && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <ErrorIcon size={16} />
                <span>{errors.specialties}</span>
              </div>
            )}
          </div>
        </FormSection>
      )}
    </div>
  );
};
