"use client";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

import { FormSection } from "../shared";

import { FormField } from "@/components/common";
import { usePrefillFromSession } from "@/hooks/usePrefillFromSession";

export const BasicInfoStep = ({ formData, onChange, errors }) => {
  const { data: session } = useSession();

  usePrefillFromSession({
    formData,
    onChange,
    fields: [
      { formKey: "firstName", sessionKey: "firstName" },
      { formKey: "lastName", sessionKey: "lastName" },
      { formKey: "email", sessionKey: "email" },
    ],
  });

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
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={onChange}
            placeholder="Your age"
            min="16"
            max="100"
            error={errors.age}
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

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email ?? session?.user?.email ?? ""}
          onChange={onChange}
          placeholder="your.email@example.com"
          error={errors.email}
        />
      </FormSection>

      {/* Physical Information */}
      <FormSection
        title="Physical Information"
        description="This helps trainers create personalized workout plans"
        icon={<Icon icon="mdi:human" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Height"
            name="height"
            value={formData.height}
            onChange={onChange}
            placeholder="e.g. 175 cm or 5'9\"
            error={errors.height}
          />

          <FormField
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            placeholder="e.g. 70 kg or 154 lbs"
            error={errors.weight}
          />

          <FormField
            label="Activity Level"
            name="activityLevel"
            type="select"
            value={formData.activityLevel}
            onChange={onChange}
            error={errors.activityLevel}
            options={[
              { value: "", label: "Select activity level" },
              { value: "sedentary", label: "Sedentary (little/no exercise)" },
              {
                value: "lightly_active",
                label: "Lightly Active (1-3 days/week)",
              },
              {
                value: "moderately_active",
                label: "Moderately Active (3-5 days/week)",
              },
              { value: "very_active", label: "Very Active (6-7 days/week)" },
              { value: "extremely_active", label: "Extremely Active (2x/day)" },
            ]}
          />
        </div>
      </FormSection>
    </div>
  );
};
