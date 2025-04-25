"use client";
import React from "react";
import { TextField, TextArea } from "@/components/common";
import { FormCard } from "@/components/custom/FormCard";
import { useForm } from "react-hook-form";
import { FormField, RegistrationStep } from "../../shared";

export const BasicInfoStep = ({ formData, onChange, userType = "client" }) => {
    const { register } = useForm({
        defaultValues: {
            name: formData.name,
            yearsExperience: formData.yearsExperience,
            bio: formData.bio,
            "location.city": formData.location.city,
            "location.state": formData.location.state,
            "location.country": formData.location.country,
        },
    });

    const handleChange = (e) => {
        onChange(e);
    };

    return (
        <div className="space-y-6">
            <RegistrationStep title="Personal Information">
                <FormField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    placeholder={userType === "trainer" ? "Your professional name" : "Your full name"}
                    required
                />

                {userType === "client" && (
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
                            required
                        />

                        <FormField
                            label="Gender"
                            name="gender"
                            type="select"
                            value={formData.gender}
                            onChange={onChange}
                            options={["Male", "Female", "Non-binary", "Prefer not to say"]}
                            placeholder="Select gender"
                            required
                        />
                    </div>
                )}

                {userType === "trainer" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Years of Experience"
                            name="yearsExperience"
                            type="number"
                            value={formData.yearsExperience}
                            onChange={onChange}
                            placeholder="Years as a trainer"
                            min="0"
                            required
                        />

                        <FormField
                            label="Primary Specialty"
                            name="specialty"
                            value={formData.specialty}
                            onChange={onChange}
                            placeholder="e.g. Strength Training, Yoga, etc."
                            required
                        />
                    </div>
                )}
            </RegistrationStep>

            <RegistrationStep
                title="Location Information"
                description={
                    userType === "client" ? "This helps us find trainers near you" : "This helps clients find you in their area"
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        label="City"
                        name="location.city"
                        value={formData.location.city}
                        onChange={onChange}
                        placeholder="Your city"
                        required
                    />

                    <FormField
                        label="State/Province"
                        name="location.state"
                        value={formData.location.state}
                        onChange={onChange}
                        placeholder="Your state or province"
                        required
                    />
                </div>

                <FormField
                    label="Country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={onChange}
                    placeholder="Your country"
                    required
                />
            </RegistrationStep>
        </div>
    );
};
