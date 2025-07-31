import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { UPLOAD_CONFIG } from "@/config/upload";

export function CoverImageUpload({
  previewImage,
  imageError,
  handleImageChange,
}) {
  return (
    <div className="relative group w-full mb-6 sm:mb-8">
      {imageError && (
        <div className="mb-3 sm:mb-4">
          <ErrorMessage error={imageError} />
        </div>
      )}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-lg sm:rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
        <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#242424] border border-[#333] hover:border-[#FF6B00]/50 transition-all duration-500">
          {previewImage ? (
            <div className="relative w-full h-full group">
              <Image
                src={previewImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <input
                  type="file"
                  accept={UPLOAD_CONFIG.coverImage.allowedTypes.join(",")} // Only allow allowed types
                  name="coverImage"
                  id="coverImage"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-lg text-white font-bold hover:from-[#FF7900] hover:to-[#FF9B00] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#FF6B00]/25 transform hover:scale-105"
                >
                  <Icon icon="mdi:camera-plus" className="w-4 h-4" />
                  <span className="text-sm">Change Cover</span>
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="coverImage2"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-gradient-to-br group-hover:from-[#FF6B00]/5 group-hover:to-[#FF8A00]/5 transition-all duration-500 p-3 sm:p-6"
            >
              <div className="p-3 sm:p-6 rounded-full bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10 mb-2 sm:mb-4 group-hover:from-[#FF6B00]/20 group-hover:to-[#FF8A00]/20 transition-all duration-300">
                <Icon
                  icon="mdi:image-plus"
                  className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6B00]"
                />
              </div>
              <span className="text-white font-bold text-base sm:text-xl mb-1 sm:mb-2 text-center">
                Upload Cover Image
              </span>
              <span className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 text-center px-2">
                Make your plan stand out with a stunning cover
              </span>
              <span className="text-[#FF6B00] text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 bg-[#FF6B00]/10 rounded-full">
                Recommended: 1920x1080px
              </span>
              <input
                type="file"
                accept={UPLOAD_CONFIG.coverImage.allowedTypes.join(",")}
                name="coverImage"
                id="coverImage2"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for lazy load
export function CoverImageUploadSkeleton() {
  return (
    <div className="relative group w-full mb-6 sm:mb-8 animate-pulse">
      <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#242424] border border-[#333]">
        <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6">
          <div className="p-3 sm:p-6 rounded-full bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10 mb-2 sm:mb-4" />
          <div className="h-6 sm:h-8 w-1/3 bg-[#333]/40 rounded mb-1 sm:mb-3" />
          <div className="h-4 sm:h-6 w-1/2 bg-[#333]/30 rounded mb-2 sm:mb-4" />
          <div className="h-4 sm:h-6 w-1/4 bg-[#FF6B00]/10 rounded" />
        </div>
      </div>
    </div>
  );
}
