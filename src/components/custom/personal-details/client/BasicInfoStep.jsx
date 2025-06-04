"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { FormSection, InfoBanner } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";

const experienceLevels = [
  { value: "none", label: "No Experience - First time" },
  { value: "less_than_year", label: "Less than 1 year" },
  { value: "1_3_years", label: "1-3 years" },
  { value: "3_5_years", label: "3-5 years" },
  { value: "5_plus_years", label: "5+ years" },
];

export const BasicInfoStep = ({ formData, onChange, errors }) => {
  const { data: session } = useSession();
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");

  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "firstName", sessionKey: "firstName" },
      { formKey: "lastName", sessionKey: "lastName" },
    ],
  });

  useEffect(() => {
    // Calculate BMI when height or weight changes
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
  }, [formData.height, formData.weight]);

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

      {/* Physical Information */}
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
                : bmiCategory === "Underweight" || bmiCategory === "Overweight"
                ? "info"
                : "primary"
            }
            className="mt-4"
          />
        )}
      </FormSection>

      {/* Fitness Experience */}
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
    </div>
  );
};
