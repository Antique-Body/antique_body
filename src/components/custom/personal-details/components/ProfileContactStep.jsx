"use client";
import Image from "next/image";

import { FormField } from "@/components/common/FormField";
import { UserProfileIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

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
      {/* Profile Photo Section */}
      <Card variant="darkStrong" className="p-6 !w-full">
        <h3 className="mb-4 text-lg font-semibold text-white">Profile Photo</h3>

        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#444] bg-[#1a1a1a]">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Profile preview"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserProfileIcon size={50} className="text-gray-400" />
            )}
          </div>

          <div className="flex-1">
            <p className="mb-3 text-sm text-gray-400">
              {userType === "trainer"
                ? "Upload a professional photo for your profile. A good profile photo can significantly increase client inquiries."
                : "Upload a profile photo to personalize your account."}
            </p>
            <FormField
              type="file"
              id="profile-image"
              name="profileImage"
              accept="image/*"
              onChange={handleImageUpload}
              subLabel="Supported formats: JPG, PNG, GIF (max 5MB)"
              className="mb-0"
            />
          </div>
        </div>
      </Card>

      {/* Bio Section */}
      <Card variant="darkStrong" className="p-6 !w-full">
        <h3 className="mb-4 text-lg font-semibold text-white">About You</h3>

        <div className="rounded-lg bg-[#171717] p-5">
          <FormField
            label="Tell us a bit about yourself"
            name="bio"
            type="textarea"
            value={formData.bio}
            onChange={onChange}
            placeholder={
              userType === "trainer"
                ? "Share your training philosophy, specialties, and what clients can expect working with you. Highlight your achievements and unique approach to training."
                : "Share your fitness journey, what motivates you, or what you hope to achieve..."
            }
            className="min-h-[120px] mb-0"
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card variant="darkStrong" className="p-6 !w-full">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Contact Information
        </h3>

        <div className="rounded-lg bg-[#171717] p-5">
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={onChange}
              placeholder="Your email address"
              required
              className="mb-0"
            />

            <FormField
              label="Phone (optional)"
              name="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={onChange}
              placeholder="Your phone number"
              className="mb-0"
            />
          </div>
        </div>
      </Card>

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
    </div>
  );
};
