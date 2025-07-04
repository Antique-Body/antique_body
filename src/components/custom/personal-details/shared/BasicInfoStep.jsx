"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { FormSection } from "./";

import { FormField, InfoBanner } from "@/components/common";
import { ErrorIcon } from "@/components/common/Icons";
import { SpecialtySelector } from "@/components/custom/shared";
import { usePrefillFromSession } from "@/hooks";

const experienceLevels = [
  { value: "none", label: "No Experience - First time" },
  { value: "less_than_year", label: "Less than 1 year" },
  { value: "1_3_years", label: "1-3 years" },
  { value: "3_5_years", label: "3-5 years" },
  { value: "5_plus_years", label: "5+ years" },
];

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
            value={formData.firstName ?? session?.user?.firstName ?? ""}
            placeholder="Your first name"
            onChange={onChange}
            error={errors.firstName}
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName ?? session?.user?.lastName ?? ""}
            placeholder="Your last name"
            onChange={onChange}
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

      {/* Client-specific Physical Information */}
      {userType === "client" && (
        <FormSection
          title="Physical Information"
          description="Details about your physical characteristics"
          icon={<Icon icon="mdi:human-male-height" width={20} height={20} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            />
          </div>

          {/* BMI Display */}
          {bmi && (
            <InfoBanner
              icon="mdi:scale-bathroom"
              title={`Your BMI: ${bmi} - ${bmiCategory}`}
              subtitle={`Height: ${formData.height}cm, Weight: ${formData.weight}kg`}
              variant={
                bmiCategory === "Normal weight"
                  ? "success"
                  : bmiCategory === "Underweight" ||
                    bmiCategory === "Overweight"
                  ? "info"
                  : "primary"
              }
              className="mt-4"
            />
          )}
        </FormSection>
      )}

      {/* Client-specific Fitness Experience */}
      {userType === "client" && (
        <FormSection
          title="Fitness Experience"
          description="Your background in fitness and exercise"
          icon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
        >
          <FormField
            label="Experience Level"
            name="experienceLevel"
            type="select"
            value={formData.experienceLevel}
            onChange={onChange}
            error={errors.experienceLevel}
            options={[
              { value: "", label: "Select your experience level" },
              ...experienceLevels,
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
          />
        </FormSection>
      )}

      {/* Trainer-specific Professional Information */}
      {userType === "trainer" && (
        <FormSection
          title="Professional Information"
          description="Your training background and expertise"
          icon={<Icon icon="mdi:badge-account" width={20} height={20} />}
        >
          <div className="space-y-4">
            <FormField
              label="Training Since (Year)"
              name="trainerSince"
              type="select"
              value={formData.trainerSince}
              onChange={onChange}
              error={errors.trainerSince}
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
                      {currentYear - Number.parseInt(formData.trainerSince)}{" "}
                      years of experience
                    </p>
                    <p className="text-xs text-gray-400">
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
          icon={<Icon icon="mdi:medal" width={20} height={20} />}
        >
          <SpecialtySelector
            selectedSpecialties={formData.specialties || []}
            onChange={handleSpecialtyChange}
          />
          {errors.specialties && (
            <p className="mt-3 flex items-center text-sm text-red-500">
              <ErrorIcon size={16} className="mr-2" />
              {errors.specialties}
            </p>
          )}
        </FormSection>
      )}
    </div>
  );
};
