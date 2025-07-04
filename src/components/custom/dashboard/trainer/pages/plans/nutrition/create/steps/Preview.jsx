"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const Preview = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getTotalMeals = () =>
    data.days?.reduce((total, day) => total + (day.meals?.length || 0), 0) || 0;

  const getActiveDays = () =>
    data.days?.filter((day) => !day.isRestDay)?.length || 0;

  const getCheatDays = () =>
    data.days?.filter((day) => day.isRestDay)?.length || 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meals", label: "Meal Schedule" },
    { id: "features", label: "Features & Timeline" },
  ];

  return (
    <div className="flex flex-col -mx-4 sm:-mx-5">
      {/* Banner image with gradient overlay */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden rounded-2xl mb-6">
        {data.coverImage ? (
          <Image
            src={
              typeof data.coverImage === "string"
                ? data.coverImage
                : URL.createObjectURL(data.coverImage)
            }
            alt={data.title || "Plan cover"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222] flex items-center justify-center">
            <Icon icon="mdi:image" className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]" />

        {/* Plan type badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 bg-[#FF6B00]/80 text-white">
            <Icon icon="mdi:nutrition" className="w-4 h-4" />
            Nutrition Plan
          </span>
        </div>

        {/* Price tag */}
        {data.price && (
          <div className="absolute top-4 right-4 z-10">
            <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white">
              <Icon
                icon="heroicons:banknotes-20-solid"
                className="w-4 h-4 mr-1"
              />
              ${data.price}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {data.title || "Untitled Plan"}
          </h1>
          <p className="text-gray-300 line-clamp-2">{data.description}</p>
        </div>
      </div>

      {/* Content container */}
      <div className="px-4 sm:px-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="heroicons:calendar-20-solid"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {data.duration} {data.durationType}
            </div>
            <div className="text-sm text-gray-400">Duration</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="mdi:food"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {getTotalMeals()}
            </div>
            <div className="text-sm text-gray-400">Total Meals</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="mdi:calendar-check"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {getActiveDays()}
            </div>
            <div className="text-sm text-gray-400">Meal Days</div>
          </div>
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#333] text-center">
            <Icon
              icon="mdi:food-off"
              className="w-6 h-6 text-[#FF6B00] mx-auto mb-2"
            />
            <div className="text-2xl font-bold text-white mb-1">
              {getCheatDays()}
            </div>
            <div className="text-sm text-gray-400">Cheat Days</div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-[#333] mb-6">
          <div className="flex space-x-6 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#FF6B00]"
                    : "text-gray-400 hover:text-white"
                }`}
                variant="tab"
                isActive={activeTab === tab.id}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Nutrition Details */}
                  <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Nutrition Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:target"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        <div>
                          <div className="text-white font-medium">
                            Target Goal
                          </div>
                          <div className="text-gray-400 capitalize">
                            {data.targetGoal?.replace("-", " ") ||
                              "Not specified"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:clock-outline"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        <div>
                          <div className="text-white font-medium">
                            Cooking Time
                          </div>
                          <div className="text-gray-400">
                            {data.cookingTime || "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Nutrition Targets */}
                  {(data.nutritionInfo?.calories ||
                    data.nutritionInfo?.protein ||
                    data.nutritionInfo?.carbs ||
                    data.nutritionInfo?.fats) && (
                    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Icon
                          icon="mdi:nutrition"
                          className="w-5 h-5 text-[#FF6B00]"
                        />
                        Daily Nutrition Targets
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {data.nutritionInfo?.calories && (
                          <div className="bg-[#242424] p-4 rounded-lg">
                            <div className="text-2xl font-bold text-[#FF6B00] mb-1">
                              {data.nutritionInfo.calories}
                            </div>
                            <div className="text-sm text-gray-400">
                              Calories
                            </div>
                          </div>
                        )}
                        {data.nutritionInfo?.protein && (
                          <div className="bg-[#242424] p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-400 mb-1">
                              {data.nutritionInfo.protein}g
                            </div>
                            <div className="text-sm text-gray-400">Protein</div>
                          </div>
                        )}
                        {data.nutritionInfo?.carbs && (
                          <div className="bg-[#242424] p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-400 mb-1">
                              {data.nutritionInfo.carbs}g
                            </div>
                            <div className="text-sm text-gray-400">Carbs</div>
                          </div>
                        )}
                        {data.nutritionInfo?.fats && (
                          <div className="bg-[#242424] p-4 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">
                              {data.nutritionInfo.fats}g
                            </div>
                            <div className="text-sm text-gray-400">Fats</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Key Features */}
                  {data.keyFeatures && data.keyFeatures.length > 0 && (
                    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Key Features
                      </h3>
                      <div className="space-y-2">
                        {data.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Icon
                              icon="heroicons:check-circle-20-solid"
                              className="w-5 h-5 text-[#FF6B00] mt-0.5 flex-shrink-0"
                            />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="p-6 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      {data.frequency && (
                        <div>
                          <div className="text-white font-medium mb-1">
                            Frequency
                          </div>
                          <p className="text-gray-400">{data.frequency}</p>
                        </div>
                      )}
                      {data.adaptability && (
                        <div>
                          <div className="text-white font-medium mb-1">
                            Adaptability
                          </div>
                          <p className="text-gray-400">{data.adaptability}</p>
                        </div>
                      )}
                      {data.supplementRecommendations && (
                        <div>
                          <div className="text-white font-medium mb-1">
                            Supplement Recommendations
                          </div>
                          <p className="text-gray-400">
                            {data.supplementRecommendations}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Meals tab */}
          {activeTab === "meals" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {data.days && data.days.length > 0 ? (
                <div className="space-y-6">
                  {data.days.map((day, dayIndex) => (
                    <div
                      key={day.id || dayIndex}
                      className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden"
                    >
                      <div className="bg-[#242424] p-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">
                          {day.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            day.isRestDay
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {day.isRestDay
                            ? "Cheat Day"
                            : `${day.meals?.length || 0} meals`}
                        </span>
                      </div>

                      {!day.isRestDay && day.meals && day.meals.length > 0 && (
                        <div className="p-4 space-y-4">
                          {day.meals.map((meal, mealIndex) => (
                            <div
                              key={meal.id || mealIndex}
                              className="bg-[#242424] rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div>
                                  <h4 className="text-white font-medium">
                                    {meal.name}
                                  </h4>
                                  {meal.time && (
                                    <p className="text-sm text-gray-400">
                                      {meal.time}
                                    </p>
                                  )}
                                </div>
                                <div className="text-sm text-[#FF6B00]">
                                  {meal.options?.length || 0} options
                                </div>
                              </div>

                              {meal.options && meal.options.length > 0 && (
                                <div className="space-y-3">
                                  {meal.options.map((option, optionIndex) => (
                                    <div
                                      key={option.id || optionIndex}
                                      className="bg-[#2a2a2a] rounded-lg p-3"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="text-white font-medium">
                                          {option.name}
                                        </h5>
                                        <div className="flex gap-2 text-sm">
                                          {option.calories && (
                                            <span className="text-[#FF6B00]">
                                              {option.calories} kcal
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-3 gap-2 mb-2">
                                        {option.protein && (
                                          <div className="text-sm">
                                            <span className="text-gray-400">
                                              Protein:{" "}
                                            </span>
                                            <span className="text-green-400">
                                              {option.protein}g
                                            </span>
                                          </div>
                                        )}
                                        {option.carbs && (
                                          <div className="text-sm">
                                            <span className="text-gray-400">
                                              Carbs:{" "}
                                            </span>
                                            <span className="text-blue-400">
                                              {option.carbs}g
                                            </span>
                                          </div>
                                        )}
                                        {option.fat && (
                                          <div className="text-sm">
                                            <span className="text-gray-400">
                                              Fat:{" "}
                                            </span>
                                            <span className="text-yellow-400">
                                              {option.fat}g
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {option.ingredients && (
                                        <div className="text-sm text-gray-400 mb-2">
                                          <span className="text-white">
                                            Ingredients:{" "}
                                          </span>
                                          {Array.isArray(option.ingredients)
                                            ? option.ingredients.join(", ")
                                            : option.ingredients}
                                        </div>
                                      )}

                                      {option.description && (
                                        <div className="text-sm text-gray-400">
                                          <span className="text-white">
                                            Instructions:{" "}
                                          </span>
                                          {option.description}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon
                    icon="mdi:food-off"
                    className="w-12 h-12 text-gray-600 mx-auto mb-4"
                  />
                  <p className="text-gray-400">No meal schedule defined yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Features & Timeline tab */}
          {activeTab === "features" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Plan Schedule */}

              {/* Timeline */}
              {data.timeline && data.timeline.length > 0 && (
                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533]">
                      <Icon
                        icon="mdi:timeline-clock"
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    Program Timeline
                  </h3>
                  <div className="relative space-y-8 before:absolute before:left-[28px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-[#FF6B00] before:to-[#FF8533]/30 before:opacity-50">
                    {data.timeline.map((block, index) => (
                      <div key={index} className="relative pl-16">
                        <div className="absolute left-[15px] top-0 w-[25px] h-[25px] rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8533] flex items-center justify-center shadow-lg">
                          <span className="text-xs font-medium text-white">
                            {index + 1}
                          </span>
                        </div>
                        <div className="bg-[#242424] rounded-xl border border-[#333] p-5 hover:border-[#FF6B00]/30 transition-colors group">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon="mdi:calendar-range"
                              className="w-5 h-5 text-[#FF6B00]"
                            />
                            <h4 className="text-lg font-medium text-white">
                              {block.week}
                            </h4>
                          </div>
                          <p className="text-[#FF6B00] font-medium mb-2">
                            {block.title}
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                            {block.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {data.description && (
                <div className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] p-6 sm:p-8">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533]">
                      <Icon
                        icon="mdi:text-box"
                        className="w-5 h-5 text-white"
                      />
                    </div>
                    Plan Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {data.description}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
