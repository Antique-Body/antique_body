"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";

const GOAL_TYPES = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    description: "Calorie deficit focused",
    icon: "mdi:scale-bathroom",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
  {
    id: "muscle-gain",
    label: "Muscle Gain",
    description: "Protein and calorie surplus",
    icon: "mdi:dumbbell",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Balanced nutrition",
    icon: "mdi:balance-scale",
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Athletic optimization",
    icon: "mdi:lightning-bolt",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
];

const DIFFICULTY_LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Simple recipes",
    icon: "mdi:baby-face-outline",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Moderate complexity",
    icon: "mdi:account-outline",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Complex preparations",
    icon: "mdi:trophy-outline",
    color: "from-red-400 to-pink-400",
  },
];

export const BasicInfo = ({ data, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);

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

  const handleDifficultySelect = (level) => {
    onChange({ difficultyLevel: level });
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
          Nutrition Plan Details
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Set up the foundation of your nutrition plan
        </p>
      </motion.div>

      {/* Cover Image Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div className="aspect-[2/1] w-full rounded-lg overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#2a2a2a] border border-[#333] hover:border-[#FF6B00]/50 transition-all duration-300">
          {previewImage ? (
            <div className="relative w-full h-full">
              <Image
                src={previewImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer px-3 py-2 bg-[#FF6B00] rounded-lg text-white font-medium hover:bg-[#FF7900] transition-colors text-sm">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-[#FF6B00]/5 transition-colors">
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
          {/* Basic Information */}
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
                placeholder="e.g., Weight Loss Nutrition Plan"
                required
              />

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={data.description}
                onChange={handleChange}
                placeholder="Describe what makes your nutrition plan unique..."
                required
                rows={3}
              />

              <FormField
                label="Target Audience"
                name="targetAudience"
                type="textarea"
                value={data.targetAudience || ""}
                onChange={handleChange}
                placeholder="Clients looking to improve their nutrition habits..."
                rows={2}
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
                  label="Duration"
                  name="duration"
                  type="number"
                  value={data.duration}
                  onChange={handleChange}
                  placeholder="8"
                  required
                />
              </div>

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

          {/* Nutrition Info */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-md">
                <Icon
                  icon="mdi:nutrition"
                  className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                />
              </div>
              <span className="text-sm sm:text-base">
                Daily Nutrition Targets
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <FormField
                label="Calories"
                name="nutritionInfo.calories"
                type="number"
                value={data.nutritionInfo?.calories || ""}
                onChange={handleChange}
                placeholder="2000"
              />
              <FormField
                label="Protein (g)"
                name="nutritionInfo.protein"
                type="number"
                value={data.nutritionInfo?.protein || ""}
                onChange={handleChange}
                placeholder="150"
              />
              <FormField
                label="Carbs (g)"
                name="nutritionInfo.carbs"
                type="number"
                value={data.nutritionInfo?.carbs || ""}
                onChange={handleChange}
                placeholder="200"
              />
              <FormField
                label="Fats (g)"
                name="nutritionInfo.fats"
                type="number"
                value={data.nutritionInfo?.fats || ""}
                onChange={handleChange}
                placeholder="70"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Target Goal */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-md">
                <Icon
                  icon="mdi:target"
                  className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                />
              </div>
              <span className="text-sm sm:text-base">Target Goal</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {GOAL_TYPES.map((goal) => {
                const isSelected = data.targetGoal === goal.id;

                return (
                  <motion.div
                    key={goal.id}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGoalSelect(goal.id)}
                    className={`relative p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-br ${goal.color}/15 ${goal.borderColor} shadow-md`
                        : "bg-gradient-to-br from-[#242424] to-[#2a2a2a] border-[#333] hover:border-[#444] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                      <div
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${
                          isSelected
                            ? `bg-gradient-to-r ${goal.color} border-white/20 shadow-lg`
                            : "bg-gradient-to-r from-[#333] to-[#3a3a3a] border-[#444]"
                        }`}
                      >
                        <Icon
                          icon={goal.icon}
                          className={`w-5 sm:w-6 h-5 sm:h-6 ${
                            isSelected ? "text-white" : "text-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs sm:text-sm mb-1">
                          {goal.label}
                        </div>
                        <div className="text-xs sm:text-xs text-gray-400 leading-relaxed">
                          {goal.description}
                        </div>
                      </div>
                    </div>

                    {/* Check indicator */}
                    <div
                      className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1 sm:p-1.5 rounded-lg transition-all duration-300 ${
                        isSelected
                          ? "bg-green-500/20 border border-green-400/30"
                          : "bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <Icon
                            icon="mdi:check"
                            className="w-3 sm:w-4 h-3 sm:h-4 text-green-400"
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl sm:rounded-2xl border border-[#333] p-4 sm:p-6 shadow-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-md">
                <Icon
                  icon="mdi:chef-hat"
                  className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                />
              </div>
              <span className="text-sm sm:text-base">Difficulty Level</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {DIFFICULTY_LEVELS.map((level) => (
                <motion.div
                  key={level.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDifficultySelect(level.id)}
                  className={`flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.difficultyLevel === level.id
                      ? `bg-gradient-to-r ${level.color}/15 border-orange-500/30 shadow-md`
                      : "bg-gradient-to-r from-[#242424] to-[#2a2a2a] border-[#333] hover:border-[#444] hover:shadow-sm"
                  }`}
                >
                  <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-center sm:text-center">
                    <div
                      className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 shrink-0 ${
                        data.difficultyLevel === level.id
                          ? `bg-gradient-to-r ${level.color} border-white/20 shadow-lg`
                          : "bg-gradient-to-r from-[#333] to-[#3a3a3a] border-[#444]"
                      }`}
                    >
                      <Icon
                        icon={level.icon}
                        className={`w-4 sm:w-5 h-4 sm:h-5 ${
                          data.difficultyLevel === level.id
                            ? "text-white"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 sm:flex-none min-w-0">
                      <div className="font-semibold text-white text-xs sm:text-base truncate sm:text-center">
                        {level.label}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 hidden sm:block">
                        {level.description}
                      </div>
                    </div>
                    <div
                      className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 shrink-0 ${
                        data.difficultyLevel === level.id
                          ? "bg-green-500/20 border border-green-400/30"
                          : "bg-transparent"
                      }`}
                    >
                      {data.difficultyLevel === level.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <Icon
                            icon="mdi:check"
                            className="w-3 sm:w-5 h-3 sm:h-5 text-green-400"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
