"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SESSION_FORMATS } from "src/enums/sessionFormats";
import { TRAINING_LEVELS } from "src/enums/trainingLevels";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormField } from "@/components/common/FormField";
import { updateFormData } from "@/lib/utils";

export const BasicInfo = ({ data, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState("");

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

  const handleLevelSelect = (difficultyLevel) => {
    onChange({ difficultyLevel });
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Basic Information
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Set up the foundation of your training plan
        </p>
      </motion.div>

      {/* Cover Image Upload - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        {/* Show error message above image upload */}
        {imageError && <ErrorMessage error={imageError} />}
        <div className="aspect-[2/1] w-full rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#2a2a2a] border border-[#333] hover:border-[#FF6B00]/50 transition-all duration-300">
          {previewImage ? (
            <div className="relative w-full h-full group">
              <Image
                src={previewImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  name="coverImage"
                  id="coverImage"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer px-3 py-2 bg-[#FF6B00] rounded-lg text-white font-medium hover:bg-[#FF7900] transition-colors text-sm"
                >
                  Change Image
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="coverImage"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-[#FF6B00]/5 transition-colors"
            >
              <Icon
                icon="mdi:image-plus"
                className="w-6 h-6 text-[#FF6B00] mb-2"
              />
              <span className="text-white font-medium text-sm mb-1">
                Upload Cover Image
              </span>
              <span className="text-gray-400 text-xs">
                1920x1080px recommended
              </span>
              <input
                type="file"
                accept="image/*"
                name="coverImage"
                id="coverImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </motion.div>

      {/* Main Form - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-5"
        >
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
            <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Icon icon="mdi:information" className="w-4 h-4 text-[#FF6B00]" />
              Plan Details
            </h3>

            <div className="space-y-3 sm:space-y-4">
              <FormField
                label="Plan Title"
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder="e.g., 12-Week Strength Building Program"
                required
              />

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={data.description}
                onChange={handleChange}
                placeholder="Describe what makes your training plan unique..."
                required
                rows={3}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Price ($)"
                  name="price"
                  type="number"
                  value={data.price}
                  onChange={handleChange}
                  placeholder="99.99"
                  required
                />
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
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Duration"
                  name="duration"
                  type="number"
                  value={data.duration}
                  onChange={handleChange}
                  required
                />
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
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Training Level */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                <Icon icon="mdi:target" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Training Level</h3>
            </div>

            <div className="space-y-4">
              {TRAINING_LEVELS.map((difficultyLevel) => {
                const isSelected = data.difficultyLevel === difficultyLevel.id;

                return (
                  <motion.div
                    key={difficultyLevel.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLevelSelect(difficultyLevel.id)}
                    className={clsx(
                      "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isSelected
                        ? [
                            difficultyLevel.color,
                            difficultyLevel.borderColor,
                            difficultyLevel.ringClass,
                          ]
                        : "bg-[#242424] border-[#333] hover:border-[#444] hover:bg-[#2a2a2a]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          "p-3 rounded-xl border transition-all duration-300",
                          isSelected
                            ? [
                                "bg-gradient-to-r border-white/20 shadow-lg",
                                difficultyLevel.color,
                              ]
                            : "bg-[#333] border-[#444]"
                        )}
                      >
                        <Icon
                          icon={difficultyLevel.icon}
                          className={clsx(
                            "w-6 h-6",
                            isSelected ? "text-white" : "text-gray-300"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg mb-1">
                          {difficultyLevel.label}
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed">
                          {difficultyLevel.description}
                        </div>
                      </div>
                    </div>

                    {/* Check indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                      >
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-xl border border-emerald-500/20">
              <p className="text-sm text-emerald-400 flex items-center gap-2">
                <Icon icon="mdi:information" className="w-4 h-4" />
                Choose the appropriate training level to customize workout
                intensity and complexity.
              </p>
            </div>
          </div>

          {/* Session Format */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <Icon
                  icon="mdi:format-list-bulleted"
                  className="w-6 h-6 text-white"
                />
              </div>
              <h3 className="text-2xl font-bold text-white">Session Format</h3>
            </div>

            <div className="space-y-4">
              {SESSION_FORMATS.map((format) => {
                const isSelected = data.sessionFormat === format.id;

                return (
                  <motion.div
                    key={format.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFormatSelect(format.id)}
                    className={clsx(
                      "relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isSelected
                        ? [format.color, format.borderColor, format.ringClass]
                        : "bg-[#242424] border-[#333] hover:border-[#444] hover:bg-[#2a2a2a]"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          "p-3 rounded-xl border transition-all duration-300",
                          isSelected
                            ? [
                                "bg-gradient-to-r border-white/20 shadow-lg",
                                format.color,
                              ]
                            : "bg-[#333] border-[#444]"
                        )}
                      >
                        <Icon
                          icon={format.icon}
                          className={clsx(
                            "w-6 h-6",
                            isSelected ? "text-white" : "text-gray-300"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg mb-1">
                          {format.label}
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed">
                          {format.description}
                        </div>
                      </div>
                    </div>

                    {/* Check indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
                      >
                        <Icon icon="mdi:check" className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-xl border border-blue-500/20">
              <p className="text-sm text-blue-400 flex items-center gap-2">
                <Icon icon="mdi:lightbulb" className="w-4 h-4" />
                Select how training sessions will be delivered to your clients.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
