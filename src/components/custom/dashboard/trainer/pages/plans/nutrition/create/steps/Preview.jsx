"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

export const Preview = ({ data }) => {
  const getTotalMeals = () => {
    return (
      data.days?.reduce((total, day) => total + (day.meals?.length || 0), 0) ||
      0
    );
  };

  const getActiveDays = () => {
    return data.days?.filter((day) => !day.isRestDay)?.length || 0;
  };

  const getCheatDays = () => {
    return data.days?.filter((day) => day.isRestDay)?.length || 0;
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
          Plan Preview
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Review your nutrition plan before publishing
        </p>
      </motion.div>

      {/* Plan Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] overflow-hidden shadow-lg"
      >
        {/* Cover Image */}
        {data.coverImage && (
          <div className="aspect-[2/1] w-full relative">
            <Image
              src={
                typeof data.coverImage === "string"
                  ? data.coverImage
                  : URL.createObjectURL(data.coverImage)
              }
              alt="Plan cover"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {data.title}
              </h3>
              <div className="flex items-center gap-4 text-white/80">
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:clock" className="w-4 h-4" />
                  {data.duration} {data.durationType}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:currency-usd" className="w-4 h-4" />$
                  {data.price}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:target" className="w-4 h-4" />
                  {data.targetGoal?.replace("-", " ") || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6">
          {!data.coverImage && (
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {data.title}
              </h3>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:clock" className="w-4 h-4" />
                  {data.duration} {data.durationType}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:currency-usd" className="w-4 h-4" />$
                  {data.price}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Icon icon="mdi:target" className="w-4 h-4" />
                  {data.targetGoal?.replace("-", " ") || "Not specified"}
                </span>
              </div>
            </div>
          )}

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            {data.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#242424] rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-[#FF6B00]">
                {data.days?.length || 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Total Days</div>
            </div>
            <div className="bg-[#242424] rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-green-400">
                {getActiveDays()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Meal Days</div>
            </div>
            <div className="bg-[#242424] rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-400">
                {getTotalMeals()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                Total Meals
              </div>
            </div>
            <div className="bg-[#242424] rounded-lg p-3 text-center">
              <div className="text-lg sm:text-xl font-bold text-yellow-400">
                {getCheatDays()}
              </div>
              <div className="text-xs sm:text-sm text-gray-400">Cheat Days</div>
            </div>
          </div>

          {/* Nutrition Targets */}
          {(data.nutritionInfo?.calories ||
            data.nutritionInfo?.protein ||
            data.nutritionInfo?.carbs ||
            data.nutritionInfo?.fats) && (
            <div className="bg-[#242424] rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Icon icon="mdi:nutrition" className="w-4 h-4 text-[#FF6B00]" />
                Daily Nutrition Targets
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.nutritionInfo?.calories && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {data.nutritionInfo.calories}
                    </div>
                    <div className="text-xs text-gray-400">Calories</div>
                  </div>
                )}
                {data.nutritionInfo?.protein && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {data.nutritionInfo.protein}g
                    </div>
                    <div className="text-xs text-gray-400">Protein</div>
                  </div>
                )}
                {data.nutritionInfo?.carbs && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {data.nutritionInfo.carbs}g
                    </div>
                    <div className="text-xs text-gray-400">Carbs</div>
                  </div>
                )}
                {data.nutritionInfo?.fats && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {data.nutritionInfo.fats}g
                    </div>
                    <div className="text-xs text-gray-400">Fats</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Two Column Layout for Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Key Features */}
          {data.keyFeatures?.some((f) => f.trim()) && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon icon="mdi:star" className="w-4 h-4 text-[#FF6B00]" />
                Key Features
              </h4>
              <ul className="space-y-2">
                {data.keyFeatures
                  .filter((f) => f.trim())
                  .map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-gray-300 text-sm"
                    >
                      <Icon
                        icon="mdi:check-circle"
                        className="w-4 h-4 text-green-400 shrink-0"
                      />
                      {feature}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Plan Schedule */}
          {data.planSchedule?.some((s) => s.trim()) && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon
                  icon="mdi:calendar-clock"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                Schedule
              </h4>
              <ul className="space-y-2">
                {data.planSchedule
                  .filter((s) => s.trim())
                  .map((schedule, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-300 text-sm"
                    >
                      <Icon
                        icon="mdi:calendar-check"
                        className="w-4 h-4 text-blue-400 shrink-0 mt-0.5"
                      />
                      {schedule}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Additional Info */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <Icon icon="mdi:information" className="w-4 h-4 text-[#FF6B00]" />
              Plan Details
            </h4>
            <div className="space-y-3 text-sm">
              {data.difficultyLevel && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Difficulty Level:</span>
                  <span className="text-white capitalize">
                    {data.difficultyLevel}
                  </span>
                </div>
              )}
              {data.frequency && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Frequency:</span>
                  <span className="text-white">{data.frequency}</span>
                </div>
              )}
              {data.cookingTime && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cooking Time:</span>
                  <span className="text-white">{data.cookingTime}</span>
                </div>
              )}
              {data.targetAudience && (
                <div>
                  <div className="text-gray-400 mb-1">Target Audience:</div>
                  <div className="text-white">{data.targetAudience}</div>
                </div>
              )}
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
          {/* Timeline */}
          {data.timeline?.some((t) => t.week.trim() && t.title.trim()) && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon
                  icon="mdi:timeline-clock"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                Timeline
              </h4>
              <div className="space-y-4">
                {data.timeline
                  .filter((t) => t.week.trim() && t.title.trim())
                  .map((item, idx) => (
                    <div key={idx} className="bg-[#242424] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon
                          icon="mdi:calendar-range"
                          className="w-4 h-4 text-blue-400"
                        />
                        <span className="text-sm font-medium text-white">
                          {item.week}
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-white mb-1">
                        {item.title}
                      </h5>
                      {item.description && (
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Days Overview */}
          {data.days?.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon
                  icon="mdi:calendar-month"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                Days Overview
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {data.days.map((day, idx) => (
                  <div
                    key={day.id}
                    className={`p-2 rounded text-center text-xs ${
                      day.isRestDay
                        ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                        : "bg-green-500/10 border border-green-500/30 text-green-400"
                    }`}
                  >
                    <div className="font-medium">{day.name}</div>
                    <div className="text-xs opacity-80">
                      {day.isRestDay
                        ? "Cheat Day"
                        : `${day.meals?.length || 0} meals`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {data.summary && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon icon="mdi:text-box" className="w-4 h-4 text-[#FF6B00]" />
                Summary
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}

          {/* Additional Features */}
          {(data.adaptability || data.supplementRecommendations) && (
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-5">
              <h4 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Icon icon="mdi:cog" className="w-4 h-4 text-[#FF6B00]" />
                Additional Features
              </h4>
              <div className="space-y-3 text-sm">
                {data.adaptability && (
                  <div>
                    <div className="text-gray-400 mb-1">Adaptability:</div>
                    <div className="text-white">{data.adaptability}</div>
                  </div>
                )}
                {data.supplementRecommendations && (
                  <div>
                    <div className="text-gray-400 mb-1">
                      Supplement Recommendations:
                    </div>
                    <div className="text-white">
                      {data.supplementRecommendations}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
