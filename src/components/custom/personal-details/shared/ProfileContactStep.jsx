"use client";
import Image from "next/image";

import { FormField } from "@/components/common/FormField";
import { UserProfileIcon } from "@/components/common/Icons";
import { RegistrationStep } from "@/components/custom/personal-details/shared";

export const ProfileContactStep = ({
  formData,
  onChange,
  previewImage,
  handleImageUpload,
  userType = "client",
}) => (
  <div className="space-y-6">
    <RegistrationStep title="Profile Picture">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#444] bg-[#1a1a1a]">
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Profile preview"
              width={128}
              height={128}
              className="object-cover"
            />
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
        name="description"
        type="textarea"
        value={formData.description}
        onChange={onChange}
        placeholder={
          userType === "trainer"
            ? "Share your training philosophy, specialties, and what clients can expect..."
            : "Share your fitness journey, what motivates you, or what you hope to achieve..."
        }
      />
    </RegistrationStep>
  </div>
);
