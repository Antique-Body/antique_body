"use client";
import { PersonalDetailsStep } from "@/components/custom/personal-details/shared";

export const BasicInfoStep = ({ formData, onChange }) => (
  <PersonalDetailsStep
    formData={formData}
    onChange={onChange}
    userType="client"
  />
);
