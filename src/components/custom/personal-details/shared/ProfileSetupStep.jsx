"use client";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

import { FormSection } from "./FormSection";

import { FormField } from "@/components/common";
import { ProfileImageUpload } from "@/components/custom/shared";

export const ProfileSetupStep = ({
  formData,
  onChange,
  errors,
  userType = "trainer", // "trainer" or "client"
  titleText = "Profile Image",
  descriptionText = "Upload your professional photo",
  bioLabel = "About You",
  bioPlaceholder = "Write a brief description about yourself...",
  guidelines = [
    "Professional headshot with neutral background",
    "Clear, well-lit, and focused on your face",
    "JPG, PNG, or GIF format (max 1MB)",
  ],
  guidelineHelpText = "A professional profile photo helps build trust.",
}) => {
  useEffect(() => {
    // Cleanup old blob URL when image changes or component unmounts
    let url = "";
    if (formData.profileImage && formData.profileImage instanceof File) {
      url = URL.createObjectURL(formData.profileImage);
    } else if (
      formData.profileImage &&
      typeof formData.profileImage === "string"
    ) {
    } else {
    }
    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [formData.profileImage]);

  // Client-specific additional fields
  const renderClientHealthInfo = () => {
    if (userType !== "client") return null;

    return (
      <FormSection
        title="Health Information (Optional)"
        description="Share any health information that trainers should be aware of"
        icon={<Icon icon="mdi:medical-bag" width={20} height={20} />}
      >
        <FormField
          label="Medical Conditions"
          name="medicalConditions"
          type="textarea"
          value={formData.medicalConditions}
          onChange={onChange}
          placeholder="List any medical conditions, injuries, or health concerns that may affect your training..."
          rows={3}
          error={errors.medicalConditions}
        />

        <FormField
          label="Allergies"
          name="allergies"
          type="textarea"
          value={formData.allergies}
          onChange={onChange}
          placeholder="List any allergies or sensitivities..."
          rows={2}
          error={errors.allergies}
        />

        <p className="text-xs text-gray-400 mt-3">
          This information will only be shared with trainers you choose to work
          with to ensure your safety.
        </p>
      </FormSection>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <FormSection
        title={titleText}
        description={descriptionText}
        icon={<Icon icon="mdi:camera-account" width={20} height={20} />}
      >
        <ProfileImageUpload
          image={formData.profileImage}
          onImageChange={(file) => {
            onChange({ target: { name: "profileImage", value: file } });
          }}
          guidelines={guidelines}
          guidelineHelpText={guidelineHelpText}
          error={errors?.profileImage}
          inputId="profile-image-upload"
        />
      </FormSection>

      {/* Bio Section */}
      <FormSection
        title={userType === "trainer" ? "Professional Bio" : "About Me"}
        description={
          userType === "trainer"
            ? "Tell potential clients about yourself and your training philosophy"
            : "Tell trainers about yourself and your fitness journey"
        }
        icon={<Icon icon="mdi:text-account" width={20} height={20} />}
      >
        <FormField
          label={bioLabel}
          name="description"
          type="textarea"
          value={formData.description}
          onChange={onChange}
          placeholder={bioPlaceholder}
          rows={6}
          error={errors.description}
        />

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            {userType === "trainer"
              ? "Help clients understand your approach and experience"
              : "Help trainers understand your background and needs"}
          </p>
          <span className="text-xs text-gray-400">
            {formData.description?.length || 0}/500 characters
          </span>
        </div>
      </FormSection>

      {/* Conditionally render client health info */}
      {renderClientHealthInfo()}
    </div>
  );
};
