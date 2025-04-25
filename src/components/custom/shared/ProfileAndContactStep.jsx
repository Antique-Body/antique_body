"use client";
import React from "react";
import { RegistrationStep, FormField, ProfileImageUpload } from "../../shared";

export const ProfileAndContactStep = ({ formData, onChange, previewImage, handleImageUpload, userType = "client" }) => {
    return (
        <div className="space-y-6">
            <RegistrationStep title="Profile Picture">
                <ProfileImageUpload previewImage={previewImage} onImageUpload={handleImageUpload} />

                <FormField
                    label="Tell us a bit about yourself"
                    name="bio"
                    type="textarea"
                    value={formData.bio}
                    onChange={onChange}
                    placeholder={
                        userType === "trainer"
                            ? "Share your training philosophy, specialties, and what clients can expect..."
                            : "Share your fitness journey, what motivates you, or what you hope to achieve..."
                    }
                />
            </RegistrationStep>

            <RegistrationStep
                title="Contact Information"
                description={
                    userType === "trainer" ? "How should potential clients contact you?" : "How should trainers contact you?"
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField
                        label="Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={onChange}
                        placeholder="Your email address"
                        required
                    />

                    <FormField
                        label="Phone (optional)"
                        name="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={onChange}
                        placeholder="Your phone number"
                    />
                </div>

                <div className="flex items-center mt-4">
                    <input
                        type="checkbox"
                        id="termsCheck"
                        className="w-4 h-4 text-[#FF6B00] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#FF6B00] focus:ring-opacity-25"
                        required
                        onChange={(e) => {
                            // This prevents the checkbox from submitting the form
                            e.stopPropagation();
                        }}
                    />
                    <label htmlFor="termsCheck" className="ml-2 text-sm text-gray-300">
                        I agree to the{" "}
                        <a href="#" className="text-[#FF6B00] underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#FF6B00] underline">
                            Privacy Policy
                        </a>
                    </label>
                </div>
            </RegistrationStep>
        </div>
    );
};
