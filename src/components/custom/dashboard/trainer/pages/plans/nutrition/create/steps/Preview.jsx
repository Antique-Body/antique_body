"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Accordion } from "@/components/common/Accordion";
import { Button } from "@/components/common/Button";

export const Preview = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Handle blob URL for coverImage
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  useEffect(() => {
    if (data.coverImage && typeof data.coverImage !== "string") {
      const url = URL.createObjectURL(data.coverImage);
      setCoverImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setCoverImageUrl(null);
    }
  }, [data.coverImage]);

  const getTotalMeals = () =>
    data.days?.reduce((total, day) => total + (day.meals?.length || 0), 0) || 0;

  const getActiveDays = () =>
    data.days?.filter((day) => !day.isRestDay)?.length || 0;

  const getCheatDays = () =>
    data.days?.filter((day) => day.isRestDay)?.length || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:information-outline" },
    { id: "meals", label: "Meals", icon: "mdi:food-outline" },
    { id: "features", label: "Features", icon: "mdi:star-outline" },
  ];

  return (
    <div className="flex flex-col -mx-4 sm:-mx-5">
      {/* Banner image with gradient overlay */}
      <div className="relative h-40 sm:h-56 w-full overflow-hidden rounded-xl mb-5">
        {(typeof data.coverImage === "string" && data.coverImage) ||
        (typeof data.coverImage !== "string" && coverImageUrl) ? (
          <Image
            src={
              typeof data.coverImage === "string"
                ? data.coverImage
                : coverImageUrl
            }
            alt={data.title || "Plan cover"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#222] flex items-center justify-center">
            <Icon icon="mdi:image" className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.6)] to-[#111]" />

        {/* Plan type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 bg-[#FF6B00]/90 text-white shadow-lg">
            <Icon icon="mdi:nutrition" className="w-3.5 h-3.5" />
            Nutrition Plan
          </span>
        </div>

        {/* Price tag */}
        {data.price && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-green-600/90 text-white shadow-lg">
              <Icon
                icon="heroicons:banknotes-20-solid"
                className="w-3.5 h-3.5 mr-1"
              />
              ${data.price}
            </span>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {data.title || "Untitled Plan"}
          </h1>
          <p className="text-sm text-gray-300 line-clamp-2">
            {data.description}
          </p>
        </div>
      </div>

      {/* Content container */}
      <div className="px-4 sm:px-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
              <Icon
                icon="heroicons:calendar-20-solid"
                className="w-4 h-4 text-[#FF6B00]"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {data.duration} {data.durationType}
              </div>
              <div className="text-xs text-gray-400">Duration</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
              <Icon icon="mdi:food" className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {getTotalMeals()}
              </div>
              <div className="text-xs text-gray-400">Total Meals</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
              <Icon
                icon="mdi:calendar-check"
                className="w-4 h-4 text-[#FF6B00]"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {getActiveDays()}
              </div>
              <div className="text-xs text-gray-400">Meal Days</div>
            </div>
          </div>
          <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
              <Icon icon="mdi:food-off" className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {getCheatDays()}
              </div>
              <div className="text-xs text-gray-400">Cheat Days</div>
            </div>
          </div>
        </div>

        {/* Improved Tabs navigation */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-1 mb-5 flex overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 relative text-sm font-medium transition-colors whitespace-nowrap rounded-md flex items-center justify-center gap-2`}
              variant={activeTab === tab.id ? "orangeFilled" : "ghost"}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab content */}
        <div className="mb-6">
          {/* Overview tab */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon icon="mdi:target" className="w-5 h-5 text-[#FF6B00]" />
                  Nutrition Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Target Goal
                    </div>
                    <div className="text-base text-white capitalize">
                      {data.targetGoal?.replace("-", " ") || "Not specified"}
                    </div>
                  </div>
                  <div className="bg-[#242424] p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">
                      Cooking Time
                    </div>
                    <div className="text-base text-white">
                      {data.cookingTime || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Nutrition Targets */}
              {(data.nutritionInfo?.calories ||
                data.nutritionInfo?.protein ||
                data.nutritionInfo?.carbs ||
                data.nutritionInfo?.fats) && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon
                      icon="mdi:nutrition"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                    Daily Nutrition Targets
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {data.nutritionInfo?.calories && (
                      <div className="bg-[#242424] p-3 rounded-lg flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center mr-3">
                          <Icon
                            icon="mdi:fire"
                            className="w-5 h-5 text-[#FF6B00]"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#FF6B00]">
                            {data.nutritionInfo.calories}
                          </div>
                          <div className="text-xs text-gray-400">Calories</div>
                        </div>
                      </div>
                    )}
                    {data.nutritionInfo?.protein && (
                      <div className="bg-[#242424] p-3 rounded-lg flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <Icon
                            icon="mdi:food-steak"
                            className="w-5 h-5 text-green-400"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">
                            {data.nutritionInfo.protein}g
                          </div>
                          <div className="text-xs text-gray-400">Protein</div>
                        </div>
                      </div>
                    )}
                    {data.nutritionInfo?.carbs && (
                      <div className="bg-[#242424] p-3 rounded-lg flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                          <Icon
                            icon="mdi:bread-slice"
                            className="w-5 h-5 text-blue-400"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-400">
                            {data.nutritionInfo.carbs}g
                          </div>
                          <div className="text-xs text-gray-400">Carbs</div>
                        </div>
                      </div>
                    )}
                    {data.nutritionInfo?.fats && (
                      <div className="bg-[#242424] p-3 rounded-lg flex items-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                          <Icon
                            icon="mdi:oil"
                            className="w-5 h-5 text-yellow-400"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-400">
                            {data.nutritionInfo.fats}g
                          </div>
                          <div className="text-xs text-gray-400">Fats</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {data.keyFeatures && data.keyFeatures.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon icon="mdi:star" className="w-5 h-5 text-[#FF6B00]" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.keyFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 bg-[#242424] p-2.5 rounded-lg"
                      >
                        <Icon
                          icon="heroicons:check-circle-20-solid"
                          className="w-5 h-5 text-[#FF6B00] mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="w-5 h-5 text-[#FF6B00]"
                  />
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {data.frequency && (
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">
                        Frequency
                      </div>
                      <p className="text-sm text-white">{data.frequency}</p>
                    </div>
                  )}
                  {data.adaptability && (
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">
                        Adaptability
                      </div>
                      <p className="text-sm text-white">{data.adaptability}</p>
                    </div>
                  )}
                  {data.supplementRecommendations && (
                    <div className="bg-[#242424] p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">
                        Supplement Recommendations
                      </div>
                      <p className="text-sm text-white">
                        {data.supplementRecommendations}
                      </p>
                    </div>
                  )}
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
              className="space-y-4"
            >
              {data.days && data.days.length > 0 ? (
                <div className="space-y-4">
                  {data.days.map((day, dayIndex) => (
                    <Accordion
                      key={day.id || dayIndex}
                      title={day.name}
                      icon={day.isRestDay ? "mdi:food-off" : "mdi:food"}
                      iconColor={day.isRestDay ? "#F59E0B" : "#10B981"}
                      bgColor="#1a1a1a"
                      borderColor="#333"
                      defaultOpen={dayIndex === 0}
                      subtitle={
                        day.isRestDay
                          ? "Cheat Day"
                          : `${day.meals?.length || 0} meals`
                      }
                    >
                      {!day.isRestDay && day.meals && day.meals.length > 0 ? (
                        <div className="space-y-3 pt-2">
                          {day.meals.map((meal, mealIndex) => (
                            <div
                              key={meal.id || mealIndex}
                              className="bg-[#242424] rounded-lg p-3"
                            >
                              <div className="flex justify-between items-center mb-2 border-b border-[#333] pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                    <Icon
                                      icon="mdi:food-outline"
                                      className="w-3.5 h-3.5 text-[#FF6B00]"
                                    />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      {meal.name}
                                    </h4>
                                    {meal.time && (
                                      <p className="text-xs text-gray-400">
                                        {meal.time}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs px-2 py-1 bg-[#FF6B00]/20 text-[#FF6B00] rounded-full">
                                  {meal.options?.length || 0} options
                                </div>
                              </div>

                              {meal.options && meal.options.length > 0 && (
                                <div className="space-y-2">
                                  {meal.options.map((option, optionIndex) => (
                                    <div
                                      key={option.id || optionIndex}
                                      className="bg-[#2a2a2a] rounded-lg p-2.5"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="text-sm font-medium text-white flex items-center gap-1.5">
                                          <span className="w-5 h-5 rounded-full bg-[#333] flex items-center justify-center text-xs">
                                            {optionIndex + 1}
                                          </span>
                                          {option.name}
                                        </h5>
                                        {option.calories && (
                                          <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full">
                                            {option.calories} kcal
                                          </span>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-3 gap-2 mb-2">
                                        {option.protein && (
                                          <div className="text-xs bg-[#333] p-1.5 rounded-md">
                                            <span className="text-gray-400">
                                              Protein:{" "}
                                            </span>
                                            <span className="text-green-400 font-medium">
                                              {option.protein}g
                                            </span>
                                          </div>
                                        )}
                                        {option.carbs && (
                                          <div className="text-xs bg-[#333] p-1.5 rounded-md">
                                            <span className="text-gray-400">
                                              Carbs:{" "}
                                            </span>
                                            <span className="text-blue-400 font-medium">
                                              {option.carbs}g
                                            </span>
                                          </div>
                                        )}
                                        {option.fats && (
                                          <div className="text-xs bg-[#333] p-1.5 rounded-md">
                                            <span className="text-gray-400">
                                              Fat:{" "}
                                            </span>
                                            <span className="text-yellow-400 font-medium">
                                              {option.fats}g
                                            </span>
                                          </div>
                                        )}
                                      </div>

                                      {option.ingredients && (
                                        <div className="text-xs bg-[#333] p-2 rounded-md mb-2">
                                          <span className="text-white font-medium block mb-1">
                                            Ingredients:
                                          </span>
                                          <span className="text-gray-300">
                                            {Array.isArray(option.ingredients)
                                              ? option.ingredients.join(", ")
                                              : option.ingredients}
                                          </span>
                                        </div>
                                      )}

                                      {option.description && (
                                        <div className="text-xs bg-[#333] p-2 rounded-md">
                                          <span className="text-white font-medium block mb-1">
                                            Instructions:
                                          </span>
                                          <span className="text-gray-300">
                                            {option.description}
                                          </span>
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
                        <div className="py-3 text-center">
                          <p className="text-sm text-yellow-400">
                            This is a cheat day. No specific meals planned.
                          </p>
                        </div>
                      )}
                    </Accordion>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-[#1a1a1a] rounded-lg border border-[#333]">
                  <Icon
                    icon="mdi:food-off"
                    className="w-10 h-10 text-gray-600 mx-auto mb-3"
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
              className="space-y-4"
            >
              {/* Timeline */}
              {data.timeline && data.timeline.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon
                      icon="mdi:timeline-clock"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                    Program Timeline
                  </h3>

                  <div className="space-y-3">
                    {data.timeline.map((block, index) => (
                      <div
                        key={index}
                        className="bg-[#242424] rounded-lg p-3 border border-[#333] hover:border-[#FF6B00]/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-medium">
                            {index + 1}
                          </div>
                          <h4 className="text-sm font-medium text-white">
                            {block.week}
                          </h4>
                        </div>
                        <div className="ml-8">
                          <p className="text-sm text-[#FF6B00] font-medium mb-1">
                            {block.title}
                          </p>
                          <p className="text-xs text-gray-300">
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
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon
                      icon="mdi:text-box"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                    Plan Summary
                  </h3>
                  <p className="text-sm text-gray-300">{data.description}</p>
                </div>
              )}

              {/* Features */}
              {data.features && Object.keys(data.features).length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Icon
                      icon="mdi:package-variant"
                      className="w-5 h-5 text-[#FF6B00]"
                    />
                    Included Services
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(data.features).map(([key, enabled]) => {
                      if (!enabled) return null;

                      // Convert camelCase to readable text
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase());

                      return (
                        <div
                          key={key}
                          className="flex items-center gap-2 bg-[#242424] p-2.5 rounded-lg"
                        >
                          <Icon
                            icon="heroicons:check-circle-20-solid"
                            className="w-5 h-5 text-green-500 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
