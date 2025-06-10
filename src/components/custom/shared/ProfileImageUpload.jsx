import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
];
const MAX_IMAGE_SIZE_MB = 1;

function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported image format!";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image is too large! Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

/**
 * ProfileImageUpload reusable component
 * Props:
 * - image: File | string | null
 * - onImageChange: function (file: File | null) => void
 * - guidelines: array of strings
 * - guidelineHelpText: string
 * - error: string (optional)
 * - inputId: string (default: 'profile-image-upload')
 * - className: string (optional)
 * - label: string (optional)
 * - description: string (optional)
 */
export const ProfileImageUpload = ({
  image,
  onImageChange,
  guidelines = [
    "Professional headshot with neutral background",
    "Clear, well-lit, and focused on your face",
    "JPG, PNG, or GIF format (max 1MB)",
  ],
  guidelineHelpText = "A professional profile photo helps build trust.",
  error = "",
  inputId = "profile-image-upload",
  className = "",
  label = "Profile Image",
  description = "Upload your professional photo",
}) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [internalError, setInternalError] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let url = "";
    if (image && image instanceof File) {
      url = URL.createObjectURL(image);
      setPreviewUrl(url);
    } else if (image && typeof image === "string") {
      setPreviewUrl(image);
    } else {
      setPreviewUrl("");
    }
    return () => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setInternalError(validationError);
      onImageChange(null);
      return;
    }
    setInternalError("");
    onImageChange(file);
    // Log previewUrl after state update (async, pa može biti staro)
    setTimeout(() => {
      console.log("Preview URL after file change:", previewUrl);
    }, 100);
  };

  const triggerFileInput = () => {
    document.getElementById(inputId).click();
  };

  const removeImage = () => {
    onImageChange(null);
    setInternalError("");
    document.getElementById(inputId).value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="font-medium text-white text-base mb-1 flex items-center gap-2">
          <Icon icon="mdi:camera-account" width={20} height={20} />
          {label}
        </div>
      )}
      {description && (
        <div className="text-sm text-gray-400 mb-2">{description}</div>
      )}
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
                {image ? "Change" : "Upload"}
              </button>
              {image && (
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
            {image && !internalError && !error && (
              <p className="mt-2 text-sm text-green-400 flex items-center gap-1">
                <Icon icon="mdi:check-circle" width={14} height={14} />
                Photo uploaded
              </p>
            )}
          </div>
          {/* Right side - Guidelines and error */}
          <div className="flex-1">
            {/* Error message */}
            {(internalError || error) && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:alert-circle"
                    width={16}
                    height={16}
                    className="text-red-400 flex-shrink-0"
                  />
                  <span className="text-sm text-red-400">
                    {internalError || error}
                  </span>
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
                {guidelines.map((guideline, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-300 text-sm"
                  >
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="text-[#FF6B00] mt-0.5"
                    />
                    {guideline}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-400 border-t border-[#333] pt-3">
                {guidelineHelpText}
              </p>
            </div>
          </div>
        </div>
        {/* Hidden file input */}
        <input
          id={inputId}
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
