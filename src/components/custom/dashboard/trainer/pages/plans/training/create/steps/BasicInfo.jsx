"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { SESSION_FORMATS } from "src/enums/sessionFormats";
import { TRAINING_LEVELS } from "src/enums/trainingLevels";
import dynamic from "next/dynamic";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormField } from "@/components/common/FormField";
import { updateFormData } from "@/lib/utils";
import { CoverImageUploadSkeleton } from "../components/CoverImageUpload";

const CoverImageUploadDynamic = dynamic(
  () => import("../components/CoverImageUpload"),
  { loading: () => <CoverImageUploadSkeleton /> }
);

export const BasicInfo = ({ data, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handler = () => setReducedMotion(mediaQuery.matches);
      mediaQuery.addEventListener
        ? mediaQuery.addEventListener("change", handler)
        : mediaQuery.addListener(handler);
      return () => {
        mediaQuery.removeEventListener
          ? mediaQuery.removeEventListener("change", handler)
          : mediaQuery.removeListener(handler);
      };
    }
  }, []);

  // Handle edit mode - if coverImage is a string URL, set it as preview
  useEffect(() => {
    if (
      !previewImage &&
      typeof data.coverImage === "string" &&
      data.coverImage
    ) {
      setPreviewImage(data.coverImage);
    }
  }, [data.coverImage, previewImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("File must be an image (JPG, PNG, GIF, etc.).");
        setPreviewImage(null);
        onChange({ coverImage: null });
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setImageError(
          "File size exceeds 5MB limit. Please choose a smaller image."
        );
        setPreviewImage(null);
        onChange({ coverImage: null });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setImageError("");
        onChange({ coverImage: file });
      };
      reader.onerror = () => {
        setImageError(
          "Failed to read the image file. Please try another image."
        );
        setPreviewImage(null);
        onChange({ coverImage: null });
      };
      reader.readAsDataURL(file);
    } else {
      setImageError("");
      setPreviewImage(null);
      onChange({ coverImage: null });
    }
  };

  const handleChange = (e) => {
    onChange(updateFormData(data, e));
  };

  const handleFormatSelect = (formatId) => {
    // Only allow one format selection
    onChange({ sessionFormat: formatId });
  };

  const handleLevelSelect = useCallback(
    (difficultyLevel) => {
      onChange({ difficultyLevel });
    },
    [onChange]
  );

  const handleLevelKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleLevelSelect(id);
      }
    },
    [handleLevelSelect]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] p-3 sm:p-4 lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,107,0,0.1)_1px,_transparent_0)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10 rounded-full border border-[#FF6B00]/20 mb-4 sm:mb-6">
            <Icon
              icon="mdi:dumbbell"
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6B00]"
            />
            <span className="text-[#FF6B00] font-semibold text-xs sm:text-sm">
              Step 1 of 3
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] bg-clip-text text-transparent">
              Training Plan
            </span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto px-4">
            Build an engaging training program that will inspire your clients
            and grow your business
          </p>
        </motion.div>

        {/* Cover Image Upload */}
        <CoverImageUploadDynamic
          previewImage={previewImage}
          imageError={imageError}
          handleImageChange={handleImageChange}
        />

        {/* Main Form - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-xl sm:rounded-2xl blur opacity-10" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#242424] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 lg:p-10 hover:border-[#FF6B00]/30 transition-all duration-500">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg">
                    <Icon
                      icon="mdi:information"
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Plan Details
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Essential information about your training program
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <FormField
                      label="Plan Title"
                      name="title"
                      value={data.title}
                      onChange={handleChange}
                      placeholder="e.g., 12-Week Strength Building Program"
                      required
                      className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-500 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      label="Description"
                      name="description"
                      type="textarea"
                      value={data.description}
                      onChange={handleChange}
                      placeholder="Describe what makes your training plan unique and effective..."
                      required
                      rows={3}
                      className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-500 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <FormField
                        label="Price ($)"
                        name="price"
                        type="number"
                        value={data.price}
                        onChange={handleChange}
                        placeholder="99.99"
                        required
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-500 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        label="Sessions/Week"
                        name="sessionsPerWeek"
                        type="select"
                        value={data.sessionsPerWeek}
                        onChange={handleChange}
                        options={[
                          { value: "1", label: "1 session" },
                          { value: "2", label: "2 sessions" },
                          { value: "3", label: "3 sessions" },
                          { value: "4", label: "4 sessions" },
                          { value: "5", label: "5 sessions" },
                          { value: "6", label: "6 sessions" },
                        ]}
                        required
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <FormField
                        label="Duration"
                        name="duration"
                        type="number"
                        value={data.duration}
                        onChange={handleChange}
                        required
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-gray-500 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        label="Duration Type"
                        name="durationType"
                        type="select"
                        value={data.durationType}
                        onChange={handleChange}
                        options={[
                          { value: "weeks", label: "Weeks" },
                          { value: "months", label: "Months" },
                          { value: "days", label: "Days" },
                        ]}
                        required
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-white transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Training Level */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-xl sm:rounded-2xl blur opacity-10" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#242424] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 lg:p-10 hover:border-[#FF6B00]/30 transition-all duration-500">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg">
                    <Icon
                      icon="mdi:target"
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Training Level
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Define the difficulty and target audience
                    </p>
                  </div>
                </div>

                <div
                  className="space-y-3 sm:space-y-4"
                  role="radiogroup"
                  aria-label="Training Level"
                >
                  {TRAINING_LEVELS.map((difficultyLevel, index) => {
                    const isSelected =
                      data.difficultyLevel === difficultyLevel.id;

                    return (
                      <motion.div
                        key={difficultyLevel.id}
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={reducedMotion ? false : { opacity: 1, y: 0 }}
                        transition={
                          reducedMotion
                            ? undefined
                            : { delay: 0.4 + index * 0.1 }
                        }
                        whileHover={
                          reducedMotion ? undefined : { scale: 1.02, y: -2 }
                        }
                        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                        onClick={() => handleLevelSelect(difficultyLevel.id)}
                        onKeyDown={(e) =>
                          handleLevelKeyDown(e, difficultyLevel.id)
                        }
                        tabIndex={0}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${difficultyLevel.label}${
                          difficultyLevel.description
                            ? `: ${difficultyLevel.description}`
                            : ""
                        }`}
                        className={clsx(
                          "relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]",
                          isSelected
                            ? [
                                "bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10",
                                "border-[#FF6B00]",
                                "shadow-lg shadow-[#FF6B00]/20",
                              ]
                            : "bg-[#242424] border-[#333] hover:border-[#FF6B00]/50 hover:bg-[#2a2a2a]"
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={clsx(
                              "p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300",
                              isSelected
                                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] border-[#FF6B00]/20 shadow-lg"
                                : "bg-[#333] border-[#444] group-hover:bg-[#3a3a3a]"
                            )}
                          >
                            <Icon
                              icon={difficultyLevel.icon}
                              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white text-sm sm:text-lg mb-1">
                              {difficultyLevel.label}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                              {difficultyLevel.description}
                            </div>
                          </div>

                          {/* Check indicator */}
                          {isSelected && (
                            <motion.div
                              initial={reducedMotion ? false : { scale: 0 }}
                              animate={reducedMotion ? false : { scale: 1 }}
                              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] flex items-center justify-center shadow-lg"
                            >
                              <Icon
                                icon="mdi:check"
                                className="w-3 h-3 sm:w-5 sm:h-5 text-white"
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF8A00]/5 rounded-lg sm:rounded-xl border border-[#FF6B00]/20">
                  <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                    <Icon
                      icon="mdi:information"
                      className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B00] flex-shrink-0"
                    />
                    Choose the appropriate training level to customize workout
                    intensity and progression
                  </p>
                </div>
              </div>
            </div>

            {/* Session Format */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-xl sm:rounded-2xl blur opacity-10" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#242424] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 lg:p-10 hover:border-[#FF6B00]/30 transition-all duration-500">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg">
                    <Icon
                      icon="mdi:format-list-bulleted"
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Session Format
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      How will you deliver your training sessions
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {SESSION_FORMATS.map((format, index) => {
                    const isSelected = data.sessionFormat === format.id;

                    return (
                      <motion.div
                        key={format.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFormatSelect(format.id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleFormatSelect(format.id);
                          }
                        }}
                        className={clsx(
                          "relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 group",
                          isSelected
                            ? [
                                "bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10",
                                "border-[#FF6B00]",
                                "shadow-lg shadow-[#FF6B00]/20",
                              ]
                            : "bg-[#242424] border-[#333] hover:border-[#FF6B00]/50 hover:bg-[#2a2a2a]"
                        )}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={clsx(
                              "p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300",
                              isSelected
                                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] border-[#FF6B00]/20 shadow-lg"
                                : "bg-[#333] border-[#444] group-hover:bg-[#3a3a3a]"
                            )}
                          >
                            <Icon
                              icon={format.icon}
                              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-white text-sm sm:text-lg mb-1">
                              {format.label}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                              {format.description}
                            </div>
                          </div>

                          {/* Check indicator */}
                          {isSelected && (
                            <motion.div
                              initial={reducedMotion ? false : { scale: 0 }}
                              animate={reducedMotion ? false : { scale: 1 }}
                              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] flex items-center justify-center shadow-lg"
                            >
                              <Icon
                                icon="mdi:check"
                                className="w-3 h-3 sm:w-5 sm:h-5 text-white"
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#FF6B00]/5 to-[#FF8A00]/5 rounded-lg sm:rounded-xl border border-[#FF6B00]/20">
                  <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-2">
                    <Icon
                      icon="mdi:lightbulb"
                      className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF6B00] flex-shrink-0"
                    />
                    Select how training sessions will be delivered to maximize
                    client engagement
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
