"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

import { FormSection } from "../shared/FormSection";

import { FormField } from "@/components/common";

export const ProfileSetupStep = ({ formData, onChange, errors }) => (
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
            {formData.profileImage ? (
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#FF6B00]/30 bg-[#1a1a1a] shadow-xl">
                  <Image
                    src={formData.profileImage}
                    alt="Profile preview"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ target: { name: "profileImage", value: "" } })
                  }
                  className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
                >
                  <Icon icon="mdi:close" width={18} height={18} />
                </button>
              </div>
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
            onChange={onChange}
            error={errors.profileImage}
            subLabel="JPG, PNG or GIF • Max 5MB • 400x400px minimum"
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
