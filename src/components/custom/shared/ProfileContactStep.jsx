"use client";
import { UserProfileIcon } from "@/components/common/Icons";
import { FormField, RegistrationStep } from "@/components/shared";
export const ProfileContactStep = ({
    formData,
    onChange,
    previewImage,
    handleImageUpload,
    userType = "client",
    showTerms = true,
}) => {
    const handleTermsChange = e => {
        // This prevents the checkbox from submitting the form
        e.stopPropagation();
    };

    return (
        <div className="space-y-6">
            <RegistrationStep title="Profile Picture">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#1a1a1a] border border-dashed border-[#444] flex justify-center items-center">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    <div className="flex items-center mt-4">
                        <FormField
                            type="checkbox"
                            id="termsCheck"
                            name="terms"
                            onChange={handleTermsChange}
                            className="w-4 h-4 mr-2"
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
