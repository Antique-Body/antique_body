"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

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

// Add dynamic import for CoverImageUpload
const CoverImageUploadDynamic = dynamic(
  () => import("../../../training/create/components/CoverImageUpload.jsx"),
  { ssr: false }
);

export const BasicInfo = ({ data, onChange, prefillForm, templates }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [showPrefillInfo, setShowPrefillInfo] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [search, setSearch] = useState("");

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

        {/* Cover Image + Prefill Options Row (NEW) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start mb-8">
          {/* Cover Image Upload (left) */}
          <div>
            <CoverImageUploadDynamic
              previewImage={previewImage}
              imageError={imageError}
              handleImageChange={handleImageChange}
            />
          </div>
          {/* Prefill Plan Selector (right) */}
          {templates && templates.length > 0 && (
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-4">
                <Icon
                  icon="mdi:lightbulb-on-outline"
                  className="w-6 h-6 text-[#FF6B00]"
                />
                <span className="text-lg font-semibold text-white">
                  Want to prefill a plan? Choose a template:
                </span>
                <button
                  className="ml-auto text-xs text-gray-400 underline hover:text-[#FF6B00]"
                  onClick={() => setShowPrefillInfo((v) => !v)}
                  type="button"
                >
                  {showPrefillInfo ? "Hide info" : "What is prefill?"}
                </button>
              </div>
              {showPrefillInfo && (
                <div className="mb-4 p-3 bg-[#181818] border border-[#FF6B00]/30 rounded text-gray-300 text-sm">
                  Prefill lets you automatically fill in all data for popular
                  nutrition plan types. After selection, you can further edit
                  all details.
                </div>
              )}
              {showAllPlans ? (
                <div>
                  <button
                    className="mb-4 w-full bg-[#232323] hover:bg-[#FF6B00]/10 text-[#FF6B00] font-semibold py-2 rounded-lg border border-[#FF6B00]/30 shadow"
                    onClick={() => setShowAllPlans(false)}
                    type="button"
                  >
                    Back to prefill cards
                  </button>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search plans..."
                    className="mb-3 w-full px-3 py-2 rounded-lg border border-[#333] bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 transition-all"
                  />
                  <div className="max-h-[420px] overflow-y-auto flex flex-col gap-3">
                    {templates
                      .filter(
                        (tpl) =>
                          tpl.title
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                          tpl.description
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      )
                      .map((tpl, _) => (
                        <div
                          key={tpl.title}
                          className="relative flex flex-col bg-[#232323] border border-[#333] shadow hover:border-[#FF6B00]/60 transition-all rounded-lg p-3 gap-2"
                        >
                          <span className="absolute top-2 right-2 z-10 bg-[#FF6B00] text-white text-xs px-2 py-1 rounded-full shadow font-medium whitespace-nowrap">
                            {tpl.duration} {tpl.durationType}
                          </span>
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                              <Image
                                src={tpl.coverImage}
                                alt={tpl.title}
                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-[#222]"
                                width={64}
                                height={64}
                              />
                              <div className="flex flex-col flex-1 min-w-0 gap-2 pr-16">
                                <div className="flex items-center gap-2">
                                  <Icon
                                    icon="mdi:nutrition"
                                    className="w-4 h-4 text-[#FF6B00] flex-shrink-0"
                                  />
                                  <span className="font-bold text-sm text-white line-clamp-2">
                                    {tpl.title}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-xs line-clamp-2">
                                  {tpl.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {tpl.keyFeatures.map((f, i) => (
                                <span
                                  key={i}
                                  className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] px-2 py-0.5 rounded-full font-medium"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                            <button
                              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#FF8A00] hover:to-[#FF6B00] text-white font-bold py-2 px-3 rounded-lg shadow text-xs transition-all duration-200 hover:scale-105 active:scale-95 w-full"
                              onClick={() => {
                                prefillForm(tpl);
                                setShowAllPlans(false);
                              }}
                              type="button"
                            >
                              Prefill this plan
                            </button>
                          </div>
                        </div>
                      ))}
                    {templates.filter(
                      (tpl) =>
                        tpl.title
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        tpl.description
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    ).length === 0 && (
                      <div className="text-gray-400 text-center py-8">
                        No plans to display.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  className="w-full bg-[#232323] hover:bg-[#FF6B00]/10 text-[#FF6B00] font-semibold py-2 rounded-lg border border-[#FF6B00]/30 shadow"
                  onClick={() => setShowAllPlans(true)}
                  type="button"
                >
                  Show all plans
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Form - Improved Layout */}
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
                      Essential information about your nutrition plan
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

                    <FormField
                      label="Price ($)"
                      name="price"
                      type="number"
                      value={data.price}
                      onChange={handleChange}
                      placeholder="99.99"
                      required
                      className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                      prefixIcon="mdi:currency-usd"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        label="Duration"
                        name="duration"
                        type="number"
                        value={data.duration}
                        onChange={handleChange}
                        placeholder="8"
                        required
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
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
                        className="bg-[#242424] border-[#333] focus:border-[#FF6B00] transition-all duration-300 px-4 py-4 text-base rounded-xl shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Nutrition Targets Card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-xl sm:rounded-2xl blur opacity-10" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#242424] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 lg:p-10 hover:border-[#FF6B00]/30 transition-all duration-500">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                    <Icon
                      icon="mdi:nutrition"
                      className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Daily Nutrition Targets
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Set default daily nutrition goals for your plan
                    </p>
                  </div>
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
                    These targets will be used as default values for meal
                    planning and can be adjusted per client.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Target Goal - Takes 1 column on XL screens */}
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
