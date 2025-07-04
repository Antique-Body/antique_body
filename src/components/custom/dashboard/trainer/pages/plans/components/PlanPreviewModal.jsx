import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { SESSION_FORMATS } from "@/enums/sessionFormats";
import { TRAINING_TYPES } from "@/enums/trainingTypes";
import { generatePlanPDF } from "@/utils/pdfGenerator";

export const PlanPreviewModal = ({ plan, isOpen, onClose, days, type }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDay, setActiveDay] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const isNutrition = type === "nutrition";

  // Set first day as default when plan/days/type/schedule changes
  useEffect(() => {
    let firstDay = null;
    if (isNutrition) {
      const dayArr = days || plan?.days || [];
      if (dayArr.length > 0) {
        firstDay = dayArr[0].day || dayArr[0].name;
      }
    } else {
      const schedArr = plan?.schedule || [];
      if (schedArr.length > 0) {
        firstDay = schedArr[0].day || schedArr[0].name;
      }
    }
    setActiveDay(firstDay);
  }, [isNutrition, days, plan, plan?.schedule]);

  if (!plan) return null;

  const {
    title,
    description,
    image,
    createdAt,
    duration,
    clientCount = 0,
    price,
    keyFeatures,
    schedule,

    averageRating,
    successRate,
    testimonial,
    // Nutrition-specific fields
    nutritionInfo,
    supplementRecommendations,
    cookingTime,
    // Training-specific fields
    trainingType,
    sessionsPerWeek,
    sessionFormat,
    difficultyLevel,
    features, // Training plan features
    timeline,
  } = plan;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      // Construct overview for PDF
      const overview = {
        summary: description || "No summary available.",
        keyFeatures:
          keyFeatures && keyFeatures.length > 0
            ? keyFeatures
            : ["No key features specified."],
      };
      // Weekly schedule mapping for PDF
      const weeklySchedule = {};
      if (isNutrition) {
        // Nutrition: map days by their real name (e.g. Monday, Day 1, ...)
        (days || plan.days || []).forEach((day) => {
          weeklySchedule[day.name || day.day] = {
            title: day.name || day.day,
            meals: (day.meals || []).flatMap(
              (meal) =>
                meal.options?.map((option) => ({
                  name: meal.name,
                  type: meal.type || "Meal",
                  time: meal.time || "",
                  calories: option.calories || 0,
                  protein: option.protein || 0,
                  carbs: option.carbs || 0,
                  fat: option.fat || 0,
                  description: option.description || "",
                  ingredients: option.ingredients || [],
                })) || []
            ),
            isRestDay: day.isRestDay,
            description: day.description,
          };
        });
      } else {
        // Training: map schedule by day name
        (schedule || plan.schedule || []).forEach((day, idx) => {
          weeklySchedule[day.day?.toLowerCase() || `day${idx + 1}`] = {
            title: day.name || day.day || `Day ${idx + 1}`,
            exercises: (day.exercises || []).map((ex) => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              notes: ex.notes,
            })),
            description: day.description,
          };
        });
      }
      const pdfData = {
        title,
        description,
        planType: isNutrition ? "nutrition" : "training",
        duration,
        createdAt: formattedDate,
        image: image || plan.coverImage,
        keyFeatures,
        schedule,
        timeline,
        features,
        overview,
        weeklySchedule,
        // Nutrition
        nutritionInfo,
        days: days || plan.days,
        mealTypes: plan.mealTypes,
        supplementRecommendations,
        cookingTime,
        targetGoal: plan.targetGoal,
        // Training
        trainingType,
        sessionsPerWeek,
        sessionFormat,
        difficultyLevel,
      };
      const success = await generatePlanPDF(pdfData);
      if (success) {
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Plan Details" },
    { id: "schedule", label: "Timeline" },
    { id: "weekly", label: "Weekly Schedule" },
    { id: "stats", label: "Statistics" },
  ];

  // Render plan-specific details
  const renderPlanDetails = () => {
    if (isNutrition) {
      // Izračunaj prosječno vrijeme kuhanja po danima ako postoji
      let averageCookingTime = null;
      if (plan.days && Array.isArray(plan.days) && plan.days.length > 0) {
        const times = plan.days
          .map((d) => parseInt(d.cookingTime, 10))
          .filter((t) => !isNaN(t));
        if (times.length > 0) {
          averageCookingTime = Math.round(
            times.reduce((a, b) => a + b, 0) / times.length
          );
        }
      }

      return (
        <div className="space-y-6">
          {/* Supplement Recommendations */}
          {supplementRecommendations && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Supplement Recommendations
              </h3>
              <p className="text-gray-300">{supplementRecommendations}</p>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Duration
              </h3>
              <p className="text-gray-300">{duration}</p>
            </div>
          )}

          {/* Cooking Time (from plan) */}
          {cookingTime && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Preparation Time
              </h3>
              <p className="text-gray-300">{cookingTime}</p>
            </div>
          )}

          {/* Average Cooking Time (from days) */}
          {averageCookingTime && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Average Cooking Time (per day)
              </h3>
              <p className="text-gray-300">{averageCookingTime} min</p>
            </div>
          )}

          {/* Target Goal */}
          {plan.targetGoal && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Target Goal
              </h3>
              <p className="text-gray-300">{plan.targetGoal}</p>
            </div>
          )}

          {/* Nutrition Info */}
          {nutritionInfo && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="heroicons:beaker-20-solid"
                  className="w-5 h-5 text-green-400"
                />
                Nutrition Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutritionInfo.calories && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Calories:</span>
                    <span className="text-white font-medium">
                      {nutritionInfo.calories} kcal
                    </span>
                  </div>
                )}
                {nutritionInfo.protein && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protein:</span>
                    <span className="text-white font-medium">
                      {nutritionInfo.protein} g
                    </span>
                  </div>
                )}
                {nutritionInfo.carbs && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Carbs:</span>
                    <span className="text-white font-medium">
                      {nutritionInfo.carbs} g
                    </span>
                  </div>
                )}
                {nutritionInfo.fats && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fats:</span>
                    <span className="text-white font-medium">
                      {nutritionInfo.fats} g
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Training plan details
      return (
        <div className="space-y-6">
          {/* Training Type */}
          {trainingType && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="heroicons:bolt-20-solid"
                  className="w-5 h-5 text-blue-400"
                />
                Training Type
              </h3>
              <p className="text-gray-300">
                {TRAINING_TYPES.find((t) => t.id === trainingType)?.label ||
                  trainingType}
              </p>
            </div>
          )}

          {/* Sessions Per Week */}
          {sessionsPerWeek && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Sessions Per Week
              </h3>
              <p className="text-[#FF6B00] text-2xl font-bold">
                {sessionsPerWeek}
              </p>
            </div>
          )}

          {/* Difficulty Level */}
          {difficultyLevel && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Difficulty Level
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  difficultyLevel.toLowerCase() === "beginner"
                    ? "bg-green-900/20 text-green-400"
                    : difficultyLevel.toLowerCase() === "intermediate"
                    ? "bg-yellow-900/20 text-yellow-400"
                    : "bg-red-900/20 text-red-400"
                }`}
              >
                {difficultyLevel}
              </span>
            </div>
          )}

          {/* Session Format */}
          {sessionFormat && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Session Format
              </h3>
              <div className="space-y-2">
                {typeof sessionFormat === "object" ? (
                  <>
                    {sessionFormat.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">
                          {sessionFormat.duration}
                        </span>
                      </div>
                    )}
                    {sessionFormat.structure && (
                      <div>
                        <span className="text-gray-400 block mb-1">
                          Structure:
                        </span>
                        <p className="text-gray-300">
                          {sessionFormat.structure}
                        </p>
                      </div>
                    )}
                    {sessionFormat.equipment && (
                      <div>
                        <span className="text-gray-400 block mb-1">
                          Equipment:
                        </span>
                        <p className="text-gray-300">
                          {sessionFormat.equipment}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-300">
                    {SESSION_FORMATS.find((f) => f.id === sessionFormat)
                      ?.label || sessionFormat}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Training Features */}
          {features && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="heroicons:star-20-solid"
                  className="w-5 h-5 text-[#FF6B00]"
                />
                Training Features
              </h3>
              {Array.isArray(features) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div
                      key={
                        typeof feature === "string"
                          ? feature
                          : `feature-${index}`
                      }
                      className="flex items-start gap-2"
                    >
                      <Icon
                        icon="heroicons:check-circle-20-solid"
                        className="w-[18px] h-[18px] text-[#FF6B00] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : typeof features === "object" ? (
                <div className="space-y-3">
                  {Object.entries(features).map(([key, value]) => (
                    <div key={typeof key === "string" ? key : `key-${key}`}>
                      <span className="text-gray-400 block mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <p className="text-gray-300">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">{features}</p>
              )}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="large"
      footerButtons={false}
    >
      <div className="flex flex-col -mt-6 -mx-4 sm:-mx-5">
        {/* Banner image with gradient overlay */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]" />

          {/* Plan type badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${
                isNutrition
                  ? "bg-green-900/80 text-green-100"
                  : "bg-blue-900/80 text-blue-100"
              }`}
            >
              <Icon
                icon={
                  isNutrition
                    ? "heroicons:beaker-20-solid"
                    : "heroicons:bolt-20-solid"
                }
                className="w-4 h-4"
              />
              {isNutrition ? "Nutrition Plan" : "Training Plan"}
            </span>
          </div>

          {/* Price tag */}
          {price && (
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-[#FF6B00] text-white">
                <Icon
                  icon="heroicons:banknotes-20-solid"
                  className="w-4 h-4 mr-1"
                />
                ${price}
              </span>
            </div>
          )}
        </div>

        {/* Content container */}
        <div className="px-4 sm:px-5">
          {/* Title and metadata section */}
          <div className="mt-6 mb-6">
            <div className="flex justify-between mb-4 items-start gap-4 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {title}
              </h1>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {/* Download PDF Button */}
                <Button
                  variant="outline"
                  className="whitespace-nowrap bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] border-[#FF6B00]/30 hover:border-[#FF6B00]/70 hover:bg-gradient-to-r hover:from-[rgba(255,107,0,0.1)] hover:to-[rgba(255,107,0,0.2)] transition-all duration-300"
                  onClick={handleDownloadPDF}
                  loading={isDownloading}
                  disabled={isDownloading}
                >
                  <Icon
                    icon="heroicons:arrow-down-tray-20-solid"
                    className="w-4 h-4 mr-2 text-[#FF6B00]"
                  />
                  {isDownloading ? "Generating PDF..." : "Download PDF"}
                </Button>

                {/* Client assignments button */}
                <Button
                  variant="orangeFilled"
                  className="whitespace-nowrap"
                  onClick={() => {
                    /* Handle navigation to client assignments */
                  }}
                >
                  <Icon
                    icon="heroicons:users-20-solid"
                    className="w-4 h-4 mr-2"
                  />
                  View Client Assignments
                </Button>
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base mb-4">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:calendar-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>Created: {formattedDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:clock-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>Duration: {duration}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <Icon
                  icon="heroicons:users-20-solid"
                  className="w-4 h-4 text-[#FF6B00]"
                />
                <span>{clientCount} active clients</span>
              </div>
            </div>
          </div>

          {/* Tabs navigation */}
          <div className="border-b border-[#333] mb-6">
            <div className="flex space-x-6 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  type="button"
                  className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#FF6B00] border-b-2 border-[#FF6B00]"
                      : "text-gray-400 hover:text-white border-b-2 border-transparent"
                  } bg-transparent rounded-none`}
                  onClick={() => setActiveTab(tab.id)}
                  variant="tab"
                  isActive={activeTab === tab.id}
                  style={{ position: "relative" }}
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
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-300">
                    {description || "No description available."}
                  </p>
                </div>
                {keyFeatures && keyFeatures.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {keyFeatures.map((feature, index) => (
                        <div
                          key={
                            typeof feature === "string"
                              ? feature
                              : `keyfeature-${index}`
                          }
                          className="flex items-start gap-2"
                        >
                          <Icon
                            icon="heroicons:check-circle-20-solid"
                            className="w-[18px] h-[18px] text-[#FF6B00] mt-0.5 flex-shrink-0"
                          />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Training Level prikaz */}
                {difficultyLevel && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Training Level
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        difficultyLevel.toLowerCase() === "beginner"
                          ? "bg-green-900/20 text-green-400"
                          : difficultyLevel.toLowerCase() === "intermediate"
                          ? "bg-yellow-900/20 text-yellow-400"
                          : "bg-red-900/20 text-red-400"
                      }`}
                    >
                      {difficultyLevel}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Plan Details tab */}
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderPlanDetails()}
              </motion.div>
            )}

            {/* Schedule tab */}
            {activeTab === "schedule" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Timeline Structure
                  </h3>
                  <div className="space-y-4">
                    {/* Prvo prikazujemo timeline ako postoji */}
                    {timeline &&
                    Array.isArray(timeline) &&
                    timeline.length > 0 ? (
                      timeline.map((item, index) => (
                        <div
                          key={item.id ?? item.day ?? `timeline-${index}`}
                          className="relative pl-8"
                        >
                          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#FF6B00]">
                              {index + 1}
                            </span>
                          </div>
                          {index !== timeline.length - 1 && (
                            <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                          )}
                          <div>
                            <h4 className="text-white font-medium">
                              {item.title || item.name || `Week ${index + 1}`}
                            </h4>
                            <p className="text-gray-300">{item.description}</p>
                          </div>
                        </div>
                      ))
                    ) : isNutrition ? (
                      // Za nutrition plan prikazujemo days ili schedule
                      (days || plan.days || []).length > 0 ? (
                        (days || plan.days || []).map((day, index) => (
                          <div
                            key={
                              day.id ?? day.day ?? day.name ?? `day-${index}`
                            }
                            className="relative pl-8"
                          >
                            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#FF6B00]">
                                {index + 1}
                              </span>
                            </div>
                            {index !== (days || plan.days || []).length - 1 && (
                              <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                            )}
                            <div>
                              <h4 className="text-white font-medium">
                                {day.name || day.day || `Day ${index + 1}`}
                              </h4>
                              <p className="text-gray-300">{day.description}</p>
                            </div>
                          </div>
                        ))
                      ) : schedule &&
                        Array.isArray(schedule) &&
                        schedule.length > 0 ? (
                        schedule.map((item, index) => (
                          <div
                            key={item.id ?? item.day ?? `schedule-${index}`}
                            className="relative pl-8"
                          >
                            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-[#FF6B00]">
                                {index + 1}
                              </span>
                            </div>
                            {index !== schedule.length - 1 && (
                              <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                            )}
                            <div>
                              <h4 className="text-white font-medium">
                                {item.name || `Day ${index + 1}`}
                              </h4>
                              <p className="text-gray-300">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          No timeline or days available.
                        </p>
                      )
                    ) : schedule &&
                      Array.isArray(schedule) &&
                      schedule.length > 0 ? (
                      // Za training plan prikazujemo schedule
                      schedule.map((week, index) => (
                        <div
                          key={
                            week.id ?? week.day ?? week.name ?? `week-${index}`
                          }
                          className="relative pl-8"
                        >
                          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#FF6B00]">
                              {index + 1}
                            </span>
                          </div>
                          {index !== schedule.length - 1 && (
                            <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]" />
                          )}
                          <div>
                            <h4 className="text-white font-medium">
                              {week.name || `Week ${index + 1}`}
                            </h4>
                            <p className="text-gray-300">{week.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">
                        No timeline or schedule available.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Weekly Schedule tab */}
            {activeTab === "weekly" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Weekly Schedule
                  </h3>
                  <div className="flex space-x-2 overflow-x-auto mb-6">
                    {/* Nutrition: use days, Training: use schedule */}
                    {isNutrition
                      ? (days || plan.days || []).map((day) => (
                          <Button
                            key={
                              day.id ??
                              day.day ??
                              day.name ??
                              `daybtn-${day.id || day.day || day.name}`
                            }
                            type="button"
                            onClick={() => setActiveDay(day.day || day.name)}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                              activeDay === (day.day || day.name)
                                ? "bg-[#FF6B00] text-white"
                                : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                            }`}
                            variant="ghost"
                            isActive={activeDay === (day.day || day.name)}
                          >
                            {day.name || day.day}
                          </Button>
                        ))
                      : (schedule || plan.schedule || []).map((day) => (
                          <Button
                            key={
                              day.id ??
                              day.day ??
                              day.name ??
                              `schedbtn-${day.id || day.day || day.name}`
                            }
                            type="button"
                            onClick={() => setActiveDay(day.day || day.name)}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                              activeDay === (day.day || day.name)
                                ? "bg-[#FF6B00] text-white"
                                : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                            }`}
                            variant="ghost"
                            isActive={activeDay === (day.day || day.name)}
                          >
                            {day.name || day.day}
                          </Button>
                        ))}
                  </div>

                  {/* Day details */}
                  <div>
                    {(() => {
                      // Find the selected day object
                      const dayList = isNutrition
                        ? days || plan.days || []
                        : schedule || plan.schedule || [];
                      const selectedDay = dayList.find(
                        (d) => (d.day || d.name) === activeDay
                      );
                      if (!selectedDay) {
                        return (
                          <p className="text-gray-400">No data for this day.</p>
                        );
                      }
                      if (selectedDay.isRestDay) {
                        return (
                          <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-6 text-center">
                            <h4 className="text-xl font-semibold text-[#FF6B00] mb-2">
                              Rest/Cheat Day
                            </h4>
                            <p className="text-gray-300">
                              {selectedDay.description ||
                                "Enjoy your rest day!"}
                            </p>
                          </div>
                        );
                      }
                      // Nutrition plan: show meals
                      if (isNutrition) {
                        if (
                          !selectedDay.meals ||
                          selectedDay.meals.length === 0
                        ) {
                          return (
                            <p className="text-gray-400">
                              No meals for this day.
                            </p>
                          );
                        }
                        return (
                          <div className="space-y-8">
                            {selectedDay.meals.map((meal, index) => (
                              <div
                                key={meal.id ?? meal.name ?? `meal-${index}`}
                                className="bg-[#181818] rounded-lg border border-[#333] p-5"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <h5 className="text-lg font-semibold text-white">
                                    {meal.name}
                                  </h5>
                                  {meal.time && (
                                    <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded-md">
                                      {meal.time}
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {meal.options && meal.options.length > 0 ? (
                                    meal.options.map((option, index) => (
                                      <div
                                        key={
                                          option.id ??
                                          option.name ??
                                          `option-${index}`
                                        }
                                        className="flex flex-col md:flex-row gap-4 bg-[#222] rounded-md p-4 border border-[#333]"
                                      >
                                        {option.imageUrl && (
                                          <div className="w-full md:w-32 h-32 relative flex-shrink-0">
                                            <Image
                                              src={option.imageUrl}
                                              alt={option.name}
                                              fill
                                              className="object-cover rounded-md"
                                              sizes="128px"
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 flex flex-col gap-2">
                                          <div className="flex items-center gap-2">
                                            <h6 className="text-md font-bold text-[#FF6B00]">
                                              {option.name}
                                            </h6>
                                          </div>
                                          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                            <span>
                                              Protein:{" "}
                                              <span className="text-white font-medium">
                                                {option.protein}g
                                              </span>
                                            </span>
                                            <span>
                                              Carbs:{" "}
                                              <span className="text-white font-medium">
                                                {option.carbs}g
                                              </span>
                                            </span>
                                            <span>
                                              Fat:{" "}
                                              <span className="text-white font-medium">
                                                {option.fat}g
                                              </span>
                                            </span>
                                            <span>
                                              Calories:{" "}
                                              <span className="text-white font-medium">
                                                {option.calories}
                                              </span>
                                            </span>
                                          </div>
                                          {option.description && (
                                            <div>
                                              <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                                Preparation:
                                              </span>
                                              <p className="text-gray-300 text-sm whitespace-pre-line">
                                                {option.description}
                                              </p>
                                            </div>
                                          )}
                                          {option.ingredients &&
                                            option.ingredients.length > 0 && (
                                              <div>
                                                <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                                  Ingredients:
                                                </span>
                                                <ul className="list-disc list-inside text-gray-400 text-sm">
                                                  {option.ingredients.map(
                                                    (ing, idx) => (
                                                      <li
                                                        key={
                                                          typeof ing ===
                                                          "string"
                                                            ? `${ing}-${idx}`
                                                            : idx
                                                        }
                                                      >
                                                        {ing}
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-400">
                                      No options for this meal.
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      // Training plan: show exercises
                      if (
                        selectedDay.exercises &&
                        selectedDay.exercises.length > 0
                      ) {
                        return (
                          <div className="space-y-8">
                            {selectedDay.exercises.map((exercise, index) => (
                              <div
                                key={
                                  exercise.id ??
                                  exercise.name ??
                                  `exercise-${index}`
                                }
                                className="bg-[#181818] rounded-lg border border-[#333] p-5 flex flex-col md:flex-row gap-6"
                              >
                                {exercise.imageUrl && (
                                  <div className="w-full md:w-40 h-40 relative flex-shrink-0">
                                    <Image
                                      src={exercise.imageUrl}
                                      alt={exercise.name}
                                      fill
                                      className="object-cover rounded-md"
                                      sizes="160px"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 flex flex-col gap-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h5 className="text-lg font-bold text-[#FF6B00]">
                                      {exercise.name}
                                    </h5>
                                    {exercise.level && (
                                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded-md capitalize">
                                        {exercise.level}
                                      </span>
                                    )}
                                    {exercise.type && (
                                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded-md capitalize">
                                        {exercise.type}
                                      </span>
                                    )}
                                    {exercise.location && (
                                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded-md capitalize">
                                        {exercise.location}
                                      </span>
                                    )}
                                    {exercise.equipment !== undefined && (
                                      <span className="text-xs bg-[#222] text-gray-400 px-2 py-1 rounded-md">
                                        {exercise.equipment
                                          ? "Equipment"
                                          : "No Equipment"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-2">
                                    <span>
                                      Sets:{" "}
                                      <span className="text-white font-medium">
                                        {exercise.sets}
                                      </span>
                                    </span>
                                    <span>
                                      Reps:{" "}
                                      <span className="text-white font-medium">
                                        {exercise.reps}
                                      </span>
                                    </span>
                                    <span>
                                      Rest:{" "}
                                      <span className="text-white font-medium">
                                        {exercise.rest} sec
                                      </span>
                                    </span>
                                  </div>
                                  {exercise.instructions && (
                                    <div>
                                      <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                        Instructions:
                                      </span>
                                      <p className="text-gray-300 text-sm whitespace-pre-line">
                                        {exercise.instructions}
                                      </p>
                                    </div>
                                  )}
                                  {exercise.muscleGroups &&
                                    exercise.muscleGroups.length > 0 && (
                                      <div>
                                        <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                          Muscle Groups:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                          {exercise.muscleGroups.map(
                                            (mg, idx) => (
                                              <span
                                                key={
                                                  mg.id ??
                                                  mg.name ??
                                                  `mg-${idx}`
                                                }
                                                className="bg-[#333] text-gray-200 px-2 py-1 rounded text-xs capitalize"
                                              >
                                                {mg.name}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  {exercise.tips && (
                                    <div>
                                      <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                        Tips:
                                      </span>
                                      <p className="text-gray-300 text-sm whitespace-pre-line">
                                        {exercise.tips}
                                      </p>
                                    </div>
                                  )}
                                  {exercise.notes && (
                                    <div>
                                      <span className="block text-gray-300 text-sm mb-1 font-semibold">
                                        Notes:
                                      </span>
                                      <p className="text-gray-300 text-sm whitespace-pre-line">
                                        {exercise.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      // Fallback for training plan: no exercises
                      return (
                        <p className="text-gray-400">
                          No exercises for this day.
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Statistics tab */}
            {activeTab === "stats" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
                      <h4 className="text-white font-medium mb-2">
                        Average Rating
                      </h4>
                      <p className="text-[#FF6B00] text-2xl font-bold">
                        {averageRating || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
                      <h4 className="text-white font-medium mb-2">
                        Success Rate
                      </h4>
                      <p className="text-[#FF6B00] text-2xl font-bold">
                        {successRate || "N/A"}
                      </p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
                      <h4 className="text-white font-medium mb-2">
                        Testimonial
                      </h4>
                      <p className="text-gray-300">
                        {testimonial || "No testimonial available."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
