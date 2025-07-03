import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { SESSION_FORMATS } from "@/enums/sessionFormats";
import { TRAINING_TYPES } from "@/enums/trainingTypes";
import { generatePlanPDF } from "@/utils/pdfGenerator";

export const PlanPreviewModal = ({ plan, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDay, setActiveDay] = useState(
    plan?.weeklySchedule &&
      Array.isArray(plan.weeklySchedule) &&
      plan.weeklySchedule.length > 0
      ? plan.weeklySchedule[0].day
      : null
  );
  const [isDownloading, setIsDownloading] = useState(false);

  if (!plan) return null;

  const {
    title,
    description,
    image,
    createdAt,
    planType,
    duration,
    clientCount = 0,
    price,
    weeklySchedule,
    keyFeatures,
    schedule,
    averageRating,
    successRate,
    testimonial,
    // Nutrition-specific fields
    nutritionInfo,
    mealTypes,
    dietaryRestrictions,
    supplementRecommendations,
    cookingTime,
    // Training-specific fields
    trainingType,
    sessionsPerWeek,
    sessionFormat,
    difficultyLevel,
    features, // Training plan features
  } = plan;

  const isNutrition = planType === "nutrition";

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
      const pdfData = {
        title,
        description,
        planType,
        duration,
        createdAt: formattedDate,
        image,
        keyFeatures,
        weeklySchedule,
        schedule,
        overview, // Add overview property
      };
      const success = await generatePlanPDF(pdfData);
      if (success) {
        console.log("PDF generated successfully");
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
    { id: "schedule", label: "Schedule & Timeline" },
    { id: "weekly", label: "Weekly Schedule" },
    { id: "stats", label: "Statistics" },
  ];

  // Render exercise item for training plan
  const renderExerciseItem = (exercise, index) => (
    <div
      key={exercise.id || index}
      className="mb-4 rounded-lg bg-[#1a1a1a] p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-white">
            {index + 1}. {exercise.name}
          </h4>
          <div className="mt-1 flex flex-wrap gap-2 text-sm">
            <span className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-0.5 text-[#FF6B00]">
              {exercise.sets} sets
            </span>
            <span className="rounded-md bg-[rgba(59,130,246,0.15)] px-2 py-0.5 text-blue-500">
              {exercise.reps} reps
            </span>
            <span className="rounded-md bg-[rgba(234,179,8,0.15)] px-2 py-0.5 text-yellow-500">
              {exercise.rest} rest
            </span>
          </div>
        </div>
      </div>
      {exercise.notes && (
        <div className="mt-2 text-sm text-gray-400">
          <span className="text-gray-500">Notes:</span> {exercise.notes}
        </div>
      )}
    </div>
  );

  // Render meal item for nutrition plan
  const renderMealItem = (meal) => (
    <div key={meal.id} className="mb-4 rounded-lg bg-[#1a1a1a] p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white">{meal.name}</h4>
            <span className="rounded-md bg-[rgba(255,107,0,0.2)] px-2 py-0.5 text-xs text-[#FF6B00]">
              {meal.time}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs ${
                meal.type === "breakfast"
                  ? "bg-yellow-900/20 text-yellow-400"
                  : meal.type === "lunch"
                  ? "bg-green-900/20 text-green-400"
                  : meal.type === "dinner"
                  ? "bg-blue-900/20 text-blue-400"
                  : "bg-purple-900/20 text-purple-400"
              }`}
            >
              {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-0.5 text-[#FF6B00]">
              {meal.calories} kcal
            </span>
            <span className="rounded-md bg-[rgba(59,130,246,0.15)] px-2 py-0.5 text-blue-500">
              P: {meal.protein}g
            </span>
            <span className="rounded-md bg-[rgba(34,197,94,0.15)] px-2 py-0.5 text-green-500">
              C: {meal.carbs}g
            </span>
            <span className="rounded-md bg-[rgba(234,179,8,0.15)] px-2 py-0.5 text-yellow-500">
              F: {meal.fat}g
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="mb-2">
          <span className="text-sm text-gray-500">Ingredients:</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {meal.ingredients &&
              meal.ingredients.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-[#333] px-2 py-0.5 text-xs text-gray-300"
                >
                  {typeof ingredient === "string" ? ingredient : "Item"}
                </span>
              ))}
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <span className="text-gray-500">Instructions:</span>{" "}
          {meal.instructions}
        </div>
      </div>
    </div>
  );

  // Render daily schedule content based on plan type
  const renderDailySchedule = () => {
    if (
      !weeklySchedule ||
      !Array.isArray(weeklySchedule) ||
      weeklySchedule.length === 0
    ) {
      return (
        <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-6 text-center">
          <Icon
            icon={
              isNutrition
                ? "heroicons:no-symbol"
                : "heroicons:exclamation-triangle"
            }
            className="w-12 h-12 text-gray-500 mx-auto mb-3"
          />
          <p className="text-gray-400">No schedule available for this day.</p>
          <p className="text-sm text-gray-500 mt-1">
            Configure your weekly schedule in the plan settings.
          </p>
        </div>
      );
    }
    const daySchedule = weeklySchedule.find((d) => d.day === activeDay);
    if (!daySchedule) {
      return (
        <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-6 text-center">
          <Icon
            icon={
              isNutrition
                ? "heroicons:no-symbol"
                : "heroicons:exclamation-triangle"
            }
            className="w-12 h-12 text-gray-500 mx-auto mb-3"
          />
          <p className="text-gray-400">No schedule available for this day.</p>
        </div>
      );
    }
    const dayTitle = daySchedule.name || daySchedule.day;
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{dayTitle}</h3>
          {daySchedule.isRestDay && (
            <span className="rounded-full bg-green-900/20 px-3 py-1 text-sm text-green-400">
              Rest Day
            </span>
          )}
        </div>
        {isNutrition ? (
          <div className="space-y-2">
            {daySchedule.meals && daySchedule.meals.length > 0 ? (
              daySchedule.meals.map((meal) => renderMealItem(meal))
            ) : (
              <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4 text-center">
                <p className="text-gray-400">
                  No meals scheduled for this day.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {daySchedule.exercises && daySchedule.exercises.length > 0 ? (
              daySchedule.exercises.map((exercise, index) =>
                renderExerciseItem(exercise, index)
              )
            ) : (
              <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4 text-center">
                <p className="text-gray-400">
                  No exercises scheduled for this day.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render plan-specific details
  const renderPlanDetails = () => {
    if (isNutrition) {
      return (
        <div className="space-y-6">
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
                {nutritionInfo.dailyCalories && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Calories:</span>
                    <span className="text-white font-medium">
                      {nutritionInfo.dailyCalories} kcal
                    </span>
                  </div>
                )}
                {nutritionInfo.macroRatio && (
                  <div className="col-span-full">
                    <span className="text-gray-400 block mb-2">
                      Macro Ratio:
                    </span>
                    <div className="flex gap-3">
                      <span className="bg-blue-900/20 text-blue-400 px-2 py-1 rounded text-sm">
                        Protein: {nutritionInfo.macroRatio.protein}%
                      </span>
                      <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded text-sm">
                        Carbs: {nutritionInfo.macroRatio.carbs}%
                      </span>
                      <span className="bg-yellow-900/20 text-yellow-400 px-2 py-1 rounded text-sm">
                        Fats: {nutritionInfo.macroRatio.fats}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meal Types */}
          {mealTypes && mealTypes.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Meal Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {mealTypes.map((type, index) => (
                  <span
                    key={index}
                    className="bg-[#FF6B00]/20 text-[#FF6B00] px-3 py-1 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Restrictions */}
          {dietaryRestrictions && dietaryRestrictions.length > 0 && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Dietary Restrictions
              </h3>
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map((restriction, index) => (
                  <span
                    key={index}
                    className="bg-red-900/20 text-red-400 px-3 py-1 rounded-full text-sm"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Time */}
          {cookingTime && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Preparation Time
              </h3>
              <p className="text-gray-300">{cookingTime}</p>
            </div>
          )}

          {/* Supplement Recommendations */}
          {supplementRecommendations && (
            <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
              <h3 className="text-lg font-semibold text-white mb-3">
                Supplement Recommendations
              </h3>
              <p className="text-gray-300">{supplementRecommendations}</p>
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
                    <div key={index} className="flex items-start gap-2">
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
                    <div key={key}>
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
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]"></div>

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
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#FF6B00]"
                      : "text-gray-400 hover:text-white"
                  }`}
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
                </button>
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
                        <div key={index} className="flex items-start gap-2">
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
                    {schedule &&
                    Array.isArray(schedule) &&
                    schedule.length > 0 ? (
                      schedule.map((week, index) => (
                        <div key={index} className="relative pl-8">
                          <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                            <span className="text-xs font-medium text-[#FF6B00]">
                              {index + 1}
                            </span>
                          </div>
                          {index !== schedule.length - 1 && (
                            <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]"></div>
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
                      <p className="text-gray-400">No schedule available.</p>
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
                  <div className="flex space-x-2 overflow-x-auto">
                    {weeklySchedule &&
                      Array.isArray(weeklySchedule) &&
                      weeklySchedule.length > 0 &&
                      weeklySchedule.map((day) => (
                        <button
                          key={day.day}
                          onClick={() => setActiveDay(day.day)}
                          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                            activeDay === day.day
                              ? "bg-[#FF6B00] text-white"
                              : "bg-[#1A1A1A] text-gray-400 hover:text-white"
                          }`}
                        >
                          {day.name || day.day}
                        </button>
                      ))}
                  </div>
                  <div className="mt-4">{renderDailySchedule()}</div>
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
