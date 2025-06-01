"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { FormSection } from "../shared/FormSection";

import { FormField } from "@/components/common";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
];
const MAX_IMAGE_SIZE_MB = 1;

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Nedozvoljen format slike!";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Slika je prevelika! Maksimalna veličina je ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

export const ProfileSetupStep = ({ formData, onChange, errors }) => {
  const [imageError, setImageError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    // Cleanup stari blob URL kad se promijeni slika ili unmounta komponenta
    let url = "";
    if (formData.profileImage && formData.profileImage instanceof File) {
      url = URL.createObjectURL(formData.profileImage);
      setPreviewUrl(url);
    } else if (
      formData.profileImage &&
      typeof formData.profileImage === "string"
    ) {
      setPreviewUrl(formData.profileImage);
    } else {
      setPreviewUrl("");
    }
    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [formData.profileImage]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      return;
    }
    setImageError("");
    onChange({
      target: {
        name: "profileImage",
        value: file,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <FormSection
        title="Profile Image"
        description="Upload your professional photo that clients will see"
        icon={<Icon icon="mdi:camera-account" width={20} height={20} />}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Image Preview Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded-full border-2 border-gray-700 shadow-lg"
                  priority
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[rgba(40,40,40,0.8)] to-[rgba(20,20,20,0.8)] border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 flex items-center justify-center transition-all duration-300 group cursor-pointer">
                  <div className="text-center">
                    <Icon
                      icon="mdi:camera-plus"
                      width={40}
                      height={40}
                      className="text-gray-400 group-hover:text-[#FF6B00] transition-colors mx-auto mb-2"
                    />
                    <p className="text-xs text-gray-400 group-hover:text-[#FF6B00] transition-colors">
                      Add Photo
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-300 font-medium">
                {formData.profileImage ? "Profile Photo" : "No Photo Added"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Square image recommended
              </p>
            </div>
          </div>

          {/* Upload Controls Section */}
          <div className="flex-1 w-full">
            <FormField
              label={formData.profileImage ? "Change Photo" : "Upload Photo"}
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              error={imageError || errors.profileImage}
              subLabel="JPG, PNG ili GIF • Max 1MB • 400x400px minimum"
            />

            {formData.profileImage && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:check-circle"
                    width={16}
                    height={16}
                    className="text-green-400"
                  />
                  <span className="text-sm text-green-400 font-medium">
                    Photo uploaded successfully
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Professional Bio */}
      <FormSection
        title="Professional Bio"
        description="Tell potential clients about yourself and your training philosophy"
        icon={<Icon icon="mdi:text-account" width={20} height={20} />}
      >
        <FormField
          label="About You"
          name="bio"
          type="textarea"
          value={formData.bio}
          onChange={onChange}
          placeholder="Write a brief description about yourself, your training philosophy, and what makes you unique as a trainer..."
          rows={6}
          error={errors.bio}
        />

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            Help clients understand your approach and experience
          </p>
          <span className="text-xs text-gray-400">
            {formData.bio?.length || 0}/500 characters
          </span>
        </div>
      </FormSection>
    </div>
  );
};
