"use client";
import { FormField, RegistrationStep } from "@/components/shared";

export const ProfileContactStep = ({
    formData,
    onChange,
    previewImage,
    handleImageUpload,
    userType = "client",
    showTerms = true,
}) => {
    return (
        <div className="space-y-6">
            <RegistrationStep title="Profile Picture">
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
                        <p className="text-sm text-gray-400 mb-3">
                            {userType === "trainer" ? "Upload a professional photo for your profile" : "Upload a profile photo"}
                        </p>
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
                        <input
                            type="checkbox"
                            id="termsCheck"
                            className="w-4 h-4 text-[#FF6B00] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#FF6B00] focus:ring-opacity-25"
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
                )}
            </RegistrationStep>
        </div>
    );
};
