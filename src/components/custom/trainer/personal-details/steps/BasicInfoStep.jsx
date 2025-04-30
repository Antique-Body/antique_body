"use client";
import { PersonalDetailsStep } from "@/components/custom/shared";

export const BasicInfoStep = ({ formData, onChange }) => (
  <PersonalDetailsStep formData={formData} onChange={onChange} userType="trainer" />
);
