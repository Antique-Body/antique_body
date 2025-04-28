"use client";
import { ProfileContactStep } from "@/components/custom/shared";

export const ProfileAndContactStep = ({ formData, onChange, previewImage, handleImageUpload }) => {
    return (
        <ProfileContactStep
            formData={formData}
            onChange={onChange}
            previewImage={previewImage}
            handleImageUpload={handleImageUpload}
            userType="trainer"
            showTerms={false}
        />
    );
};
