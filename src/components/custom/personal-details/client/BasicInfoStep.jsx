"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { FormSection, InfoBanner } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks";

export const BasicInfoStep = ({ formData, onChange, errors }) => {
  const { data: session } = useSession();

  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "firstName", sessionKey: "firstName" },
      { formKey: "lastName", sessionKey: "lastName" },
    ],
  });

  // Calculate BMI whenever height or weight changes
  const bmiData = useMemo(() => {
    if (!formData.height || !formData.weight) return null;

    const heightInMeters = Number(formData.height) / 100;
    const weightInKg = Number(formData.weight);

    if (heightInMeters <= 0 || weightInKg <= 0) return null;

    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Determine BMI category
    let category = "";
    let variant = "primary";

    if (bmi < 18.5) {
      category = "Underweight";
      variant = "info";
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      variant = "success";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      variant = "primary";
    } else {
      category = "Obesity";
      variant = "primary";
    }

    return {
      bmi: bmi.toFixed(1),
      category,
      variant,
    };
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
        description="Help trainers understand your physical profile"
        icon={<Icon icon="mdi:human" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={onChange}
            placeholder="Height in cm"
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
            placeholder="Weight in kg"
            min="30"
            max="250"
            error={errors.weight}
          />

          <FormField
            label="Fitness Level"
            name="fitnessLevel"
            type="select"
            value={formData.fitnessLevel}
            onChange={onChange}
            error={errors.fitnessLevel}
            options={[
              { value: "", label: "Select level" },
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
              { value: "athlete", label: "Athlete" },
            ]}
          />
        </div>

        {/* BMI Display */}
        {bmiData && (
          <div className="mt-4">
            <InfoBanner
              icon="mdi:scale-bathroom"
              title={`BMI: ${bmiData.bmi} - ${bmiData.category}`}
              subtitle="Based on your height and weight"
              variant={bmiData.variant}
            />
          </div>
        )}
      </FormSection>

      {/* Experience */}
      <FormSection
        title="Fitness Experience"
        description="Tell us about your fitness background"
        icon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
      >
        <div className="space-y-4">
          <FormField
            label="Training Experience"
            name="trainingExperience"
            type="select"
            value={formData.trainingExperience}
            onChange={onChange}
            error={errors.trainingExperience}
            options={[
              { value: "", label: "Select experience" },
              { value: "none", label: "None - Complete Beginner" },
              { value: "less_than_6months", label: "Less than 6 months" },
              { value: "6months_to_1year", label: "6 months to 1 year" },
              { value: "1_to_3years", label: "1 to 3 years" },
              { value: "3_to_5years", label: "3 to 5 years" },
              { value: "more_than_5years", label: "More than 5 years" },
            ]}
          />

          {formData.trainingExperience &&
            formData.trainingExperience !== "none" && (
              <InfoBanner
                icon="mdi:calendar-check"
                title="Great! You already have some fitness experience"
                subtitle="This will help trainers customize your program"
              />
            )}
        </div>
      </FormSection>
    </div>
  );
};
