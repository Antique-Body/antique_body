"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
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
  },
  {
    id: "muscle-gain",
    label: "Muscle Gain",
    description: "Protein and calorie surplus",
    icon: "mdi:dumbbell",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Balanced nutrition",
    icon: "mdi:scale-balance",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Athletic optimization",
    icon: "mdi:lightning-bolt",
    color: "from-[#FF6B00] to-[#FF8533]",
    bgColor: "bg-[#FF6B00]/10",
    borderColor: "border-[#FF6B00]/30",
  },
];

export const BasicInfo = ({ data, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);

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
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        onChange({ coverImage: file });
      };
      reader.readAsDataURL(file);
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
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Create Your Nutrition Plan
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Design a comprehensive nutrition plan tailored to your clients' needs
        </p>
      </motion.div>

      {/* Cover Image Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div className="aspect-[2.5/1] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#2a2a2a] border-2 border-[#333] hover:border-[#FF6B00]/50 transition-all duration-300 shadow-2xl">
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
                  className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] rounded-xl text-white font-semibold hover:shadow-xl hover:scale-105 transition-all"
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
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-xl mb-4">
                <Icon icon="mdi:image-plus" className="w-8 h-8 text-white" />
              </div>
              <span className="text-white font-semibold text-xl mb-2">
                Upload Cover Image
              </span>
              <span className="text-gray-400 text-base">
                Recommended size: 1920x1080px
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-2xl border border-[#333] p-8 shadow-2xl sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg">
                <Icon icon="mdi:target" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Target Goal</h3>
            </div>

            <div className="space-y-4">
              {GOAL_TYPES.map((goal) => {
                const isSelected = data.targetGoal === goal.id;

                return (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-br ${goal.color}/10 ${
                            goal.borderColor
                          } shadow-xl ring-2 ring-${
                            goal.color.split("-")[1]
                          }-500/20`
                        : "bg-[#242424] border-[#333] hover:border-[#444] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          isSelected
                            ? `bg-gradient-to-r ${goal.color} border-white/20 shadow-lg`
                            : "bg-[#333] border-[#444]"
                        }`}
                      >
                        <Icon
                          icon={goal.icon}
                          className={`w-6 h-6 ${
                            isSelected ? "text-white" : "text-gray-300"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg mb-1">
                          {goal.label}
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed">
                          {goal.description}
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

            <div className="mt-6 p-4 bg-gradient-to-r from-violet-500/10 to-purple-600/10 rounded-xl border border-violet-500/20">
              <p className="text-sm text-violet-400 flex items-center gap-2">
                <Icon icon="mdi:lightbulb" className="w-4 h-4" />
                Select the primary goal to customize nutrition recommendations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
