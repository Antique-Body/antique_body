"use client";
import { PersonalDetailsStep } from "@/components/custom/shared";

export const BasicInfoStep = ({ formData, onChange }) => {
    return <PersonalDetailsStep formData={formData} onChange={onChange} userType="trainer" />;
};
