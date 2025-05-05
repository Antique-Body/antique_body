"use client";
import Image from "next/image";

import { FormField } from "@/components/common/FormField";
import { UserProfileIcon } from "@/components/common/Icons";
import { RegistrationStep } from "@/components/custom/shared";
export const ProfileContactStep = ({
    formData,
    onChange,
    previewImage,
    handleImageUpload,
    userType = "client",
    showTerms = true,
}) => {
    const handleTermsChange = (e) => {
        // This prevents the checkbox from submitting the form
        e.stopPropagation();
    };

    return (
        <div className="space-y-6">
            <RegistrationStep title="Profile Picture">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#444] bg-[#1a1a1a]">
                        {previewImage ? (
                            <Image src={previewImage} alt="Profile preview" width={128} height={128} className="object-cover" />
                        ) : (
                            <UserProfileIcon size={40} className="text-gray-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <FormField
                            type="file"
                            id="profile-image"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleImageUpload}
                            subLabel={
                                userType === "trainer"
                                    ? "Upload a professional photo for your profile"
                                    : "Upload a profile photo"
                            }
                            className="mb-0"
                        />
                    </div>
                </div>

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
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        label="Email"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={onChange}
                        placeholder="Your email address"
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

                {showTerms && (
                    <div className="mt-4 flex items-center">
                        <FormField
                            type="checkbox"
                            id="termsCheck"
                            name="terms"
                            onChange={handleTermsChange}
                            className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="termsCheck" className="text-sm text-gray-300">
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
                )}
            </RegistrationStep>
        </div>
    );
};
