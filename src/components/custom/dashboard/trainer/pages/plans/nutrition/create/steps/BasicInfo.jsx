"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { FormField } from "@/components/common/FormField";

const GOAL_TYPES = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    description: "Calorie deficit focused",
    icon: "mdi:scale-bathroom",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    ringColor: "ring-emerald-500/20",
  },
  {
    id: "muscle-gain",
    label: "Muscle Gain",
    description: "Protein and calorie surplus",
    icon: "mdi:dumbbell",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    ringColor: "ring-blue-500/20",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Balanced nutrition",
    icon: "mdi:scale-balance",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    ringColor: "ring-violet-500/20",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Athletic optimization",
    icon: "mdi:lightning-bolt",
    color: "from-[#FF6B00] to-[#FF8533]",
    bgColor: "bg-[#FF6B00]/10",
    borderColor: "border-[#FF6B00]/30",
    ringColor: "ring-orange-500/20",
  },
];

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
    // Cleanup for FileReader data URLs
    let urlToRevoke = null;
    if (previewImage && previewImage.startsWith("blob:")) {
      urlToRevoke = previewImage;
    }
    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [data.coverImage, previewImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation (5MB = 5 * 1024 * 1024 bytes)
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
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      onChange({
        [parent]: {
          ...data[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      onChange({ [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleGoalSelect = (goalId) => {
    onChange({ targetGoal: goalId });
  };

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
              Nutrition Plan
            </span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto px-4">
            Design a comprehensive nutrition plan tailored to your clients'
            needs
          </p>
        </motion.div>

        {/* Cover Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group max-w-5xl mx-auto mb-8 sm:mb-12"
        >
          {imageError && (
            <div className="mb-3 sm:mb-4">
              <ErrorMessage error={imageError} />
            </div>
          )}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300" />
            <div className="relative aspect-video w-full rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#242424] border border-[#333] hover:border-[#FF6B00]/50 transition-all duration-500">
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
                      accept="image/*"
                      name="coverImage"
                      id="coverImage"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="coverImage"
                      className="cursor-pointer px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-lg sm:rounded-xl text-white font-bold hover:from-[#FF7900] hover:to-[#FF9B00] transition-all duration-300 flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:shadow-[#FF6B00]/25 transform hover:scale-105"
                    >
                      <Icon
                        icon="mdi:camera-plus"
                        className="w-4 h-4 sm:w-6 sm:h-6"
                      />
                      <span className="text-sm sm:text-base">Change Cover</span>
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="coverImage"
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-gradient-to-br group-hover:from-[#FF6B00]/5 group-hover:to-[#FF8A00]/5 transition-all duration-500 p-4"
                >
                  <div className="p-4 sm:p-8 rounded-full bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10 mb-3 sm:mb-6 group-hover:from-[#FF6B00]/20 group-hover:to-[#FF8A00]/20 transition-all duration-300">
                    <Icon
                      icon="mdi:image-plus"
                      className="w-8 h-8 sm:w-12 sm:h-12 text-[#FF6B00]"
                    />
                  </div>
                  <span className="text-white font-bold text-lg sm:text-2xl mb-2 sm:mb-3">
                    Upload Cover Image
                  </span>
                  <span className="text-gray-400 text-sm sm:text-lg mb-2 sm:mb-4 text-center">
                    Make your plan stand out with a stunning cover
                  </span>
                  <span className="text-[#FF6B00] text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-2 bg-[#FF6B00]/10 rounded-full">
                    Recommended: 1920x1080px
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
          </div>
        </motion.div>

        {/* Main Form - Improved Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Plan Details - Takes 2 columns on XL screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 space-y-8"
          >
            {/* Basic Information Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-lg">
                  <Icon icon="mdi:information" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Plan Details</h3>
              </div>

              <div className="space-y-6">
                <FormField
                  label="Plan Title"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete Weight Loss Nutrition Plan"
                  required
                  className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                  prefixIcon="mdi:text"
                />

                <FormField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={data.description}
                  onChange={handleChange}
                  placeholder="Describe what makes your nutrition plan unique and effective..."
                  required
                  rows={4}
                  className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner resize-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Price ($)"
                    name="price"
                    type="number"
                    value={data.price}
                    onChange={handleChange}
                    placeholder="99.99"
                    required
                    className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner !mb-0"
                    prefixIcon="mdi:currency-usd"
                  />
                  <div className="grid grid-cols-2 gap-3 bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner">
                    <FormField
                      label="Duration"
                      name="duration"
                      type="number"
                      value={data.duration}
                      onChange={handleChange}
                      placeholder="8"
                      required
                      className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 text-base rounded-xl shadow-inner"
                      prefixIcon="mdi:calendar"
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
                      className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300  text-base rounded-xl shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Targets Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                  <Icon icon="mdi:nutrition" className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Daily Nutrition Targets
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Daily Calories"
                  name="nutritionInfo.calories"
                  type="number"
                  value={data.nutritionInfo?.calories || ""}
                  onChange={handleChange}
                  placeholder="2000"
                  min={0}
                  className="bg-[#242424] border-[#333] focus:border-emerald-500 transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                  prefixIcon="mdi:fire"
                />
                <FormField
                  label="Protein (g)"
                  name="nutritionInfo.protein"
                  type="number"
                  value={data.nutritionInfo?.protein || ""}
                  onChange={handleChange}
                  placeholder="150"
                  min={0}
                  max={500}
                  className="bg-[#242424] border-[#333] focus:border-blue-500 transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                  prefixIcon="mdi:food-drumstick"
                />
                <FormField
                  label="Carbohydrates (g)"
                  name="nutritionInfo.carbs"
                  type="number"
                  value={data.nutritionInfo?.carbs || ""}
                  onChange={handleChange}
                  placeholder="200"
                  min={0}
                  max={1000}
                  className="bg-[#242424] border-[#333] focus:border-yellow-500 transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                  prefixIcon="mdi:bread-slice"
                />
                <FormField
                  label="Fats (g)"
                  name="nutritionInfo.fats"
                  type="number"
                  value={data.nutritionInfo?.fats || ""}
                  onChange={handleChange}
                  placeholder="70"
                  min={0}
                  max={300}
                  className="bg-[#242424] border-[#333] focus:border-purple-500 transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                  prefixIcon="mdi:oil"
                />
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-xl border border-emerald-500/20">
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <Icon icon="mdi:information" className="w-4 h-4" />
                  These targets will be used as default values for meal planning
                  and can be adjusted per client.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Target Goal - Takes 1 column on XL screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-1"
          >
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
                    Target Goal
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Select the primary goal to customize nutrition
                    recommendations.
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {GOAL_TYPES.map((goal, index) => {
                  const isSelected = data.targetGoal === goal.id;
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGoalSelect(goal.id)}
                      className={`relative p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                        isSelected
                          ? "bg-gradient-to-r from-[#FF6B00]/10 to-[#FF8A00]/10 border-[#FF6B00] shadow-lg shadow-[#FF6B00]/20 pt-3 sm:pt-4 md:pt-6 pr-10"
                          : "bg-[#242424] border-[#333] hover:border-[#FF6B00]/50 hover:bg-[#2a2a2a]"
                      }`}
                    >
                      {/* Check indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] flex items-center justify-center shadow-lg z-10"
                        >
                          <Icon
                            icon="mdi:check"
                            className="w-3 h-3 sm:w-5 sm:h-5 text-white"
                          />
                        </motion.div>
                      )}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300 ${
                            isSelected
                              ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] border-[#FF6B00]/20 shadow-lg"
                              : "bg-[#333] border-[#444] group-hover:bg-[#3a3a3a]"
                          }`}
                        >
                          <Icon
                            icon={goal.icon}
                            className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-white text-sm sm:text-lg mb-1">
                            {goal.label}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                            {goal.description}
                          </div>
                        </div>
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
                  Select the primary goal to customize nutrition
                  recommendations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

BasicInfo.propTypes = {
  data: PropTypes.shape({
    coverImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // File object
    ]),
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    durationType: PropTypes.string,
    nutritionInfo: PropTypes.shape({
      calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      protein: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      carbs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      fats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    targetGoal: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
