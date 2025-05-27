"use client";
import { ProfileContactStep } from "@/components/custom/personal-details/shared";

export const ProfileAndContactStep = ({
  formData,
  onChange,
  previewImage,
  handleImageUpload,
}) => (
  <ProfileContactStep
    formData={formData}
    onChange={onChange}
    previewImage={previewImage}
    handleImageUpload={handleImageUpload}
    userType="client"
    showTerms={true}
  />
);
