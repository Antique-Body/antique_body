"use client";
import React from "react";
import { TextField } from "@/components/common";
import { FormCard } from "@/components/custom/FormCard";
import { useForm } from "react-hook-form";

export const ProfileAndContactStep = ({ formData, onChange, previewImage, handleImageUpload }) => {
    const { register } = useForm({
        defaultValues: {
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
        },
    });

    return (
        <div className="space-y-6">
            <FormCard title="Profile Image">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#1a1a1a] border border-dashed border-[#444] flex justify-center items-center">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#666"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-3">Upload a professional photo for your profile</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-image"
                        />
                        <label
                            htmlFor="profile-image"
                            className="cursor-pointer py-2 px-4 bg-[#333] hover:bg-[#444] transition-colors rounded-lg inline-block"
                        >
                            Choose Image
                        </label>
                    </div>
                </div>
            </FormCard>

            <FormCard title="Contact Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        label="Email Address"
                        placeholder="Your email address"
                        register={register}
                        value={formData.contactEmail}
                        onChange={onChange}
                    />

                    <TextField
                        id="contactPhone"
                        name="contactPhone"
                        type="tel"
                        label="Phone Number"
                        placeholder="Your phone number"
                        register={register}
                        value={formData.contactPhone}
                        onChange={onChange}
                    />
                </div>
            </FormCard>
        </div>
    );
};
