"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";

import { FormSection } from "../shared";

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
    return "Invalid image format!";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image is too large! Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

export const ProfileSetupStep = ({ formData, onChange, errors }) => {
  const [imageError, setImageError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Clean up old blob URL when the image changes or component unmounts
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

  const triggerFileInput = () => {
    document.getElementById("profile-image-upload").click();
  };

  const removeImage = () => {
    onChange({
      target: {
        name: "profileImage",
        value: null,
      },
    });
    setImageError("");
    // Reset the file input value
    document.getElementById("profile-image-upload").value = "";
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <FormSection
        title="Profile Image"
        description="Upload a profile photo (optional)"
        icon={<Icon icon="mdi:camera-account" width={20} height={20} />}
      >
        <div className="bg-[rgba(30,30,30,0.6)] rounded-lg border border-[#333] p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Image and upload controls */}
            <div className="flex flex-col items-center">
              {/* Profile image */}
              <div
                className="relative cursor-pointer"
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-[#444] hover:border-[#FF6B00]/50 transition-all duration-300">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#282828] to-[#1a1a1a] flex items-center justify-center">
                      <div className="text-center flex flex-col items-center">
                        <Icon
                          icon="mdi:account"
                          width={50}
                          height={50}
                          className="text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-2">Add Photo</p>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  {previewUrl && isHovering && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Icon
                        icon="mdi:camera"
                        width={32}
                        height={32}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="px-3 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Icon icon="mdi:camera" width={16} height={16} />
                  {formData.profileImage ? "Change" : "Upload"}
                </button>

                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Icon icon="mdi:delete" width={16} height={16} />
                    Remove
                  </button>
                )}
              </div>

              {/* Status text */}
              {formData.profileImage && !imageError && (
                <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                  <Icon icon="mdi:check-circle" width={14} height={14} />
                  Photo uploaded
                </p>
              )}
            </div>

            {/* Right side - Guidelines and error */}
            <div className="flex-1">
              {/* Error message */}
              {imageError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:alert-circle"
                      width={16}
                      height={16}
                      className="text-red-400 flex-shrink-0"
                    />
                    <span className="text-sm text-red-400">{imageError}</span>
                  </div>
                </div>
              )}

              {/* Guidelines */}
              <div className="p-4 bg-[#222] rounded-lg">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:information-outline"
                    width={18}
                    height={18}
                    className="text-[#FF6B00]"
                  />
                  Photo Guidelines
                </h3>

                <ul className="space-y-2 ml-1">
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    Clear photo with good lighting
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    Face clearly visible (for better trainer-client connection)
                  </li>
                  <li className="flex items-start gap-2 text-gray-300 text-sm">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    JPG, PNG, or GIF format (max 1MB)
                  </li>
                </ul>

                <p className="mt-3 text-xs text-gray-400 border-t border-[#333] pt-3">
                  A profile photo helps trainers connect with you and understand
                  your goals better.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="profile-image-upload"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="hidden"
        />
      </FormSection>

      {/* Bio Section */}
      <FormSection
        title="About You"
        description="Tell trainers about yourself and your fitness journey"
        icon={<Icon icon="mdi:text-account" width={20} height={20} />}
      >
        <FormField
          label="Your Fitness Journey"
          name="bio"
          type="textarea"
          value={formData.bio}
          onChange={onChange}
          placeholder="Share your fitness journey, what motivates you, any challenges you've faced, and what you hope to achieve with a personal trainer..."
          rows={6}
          error={errors.bio}
        />

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-400">
            Help trainers understand your background and aspirations
          </p>
          <span className="text-xs text-gray-400">
            {formData.bio?.length || 0}/500 characters
          </span>
        </div>
      </FormSection>
    </div>
  );
};
