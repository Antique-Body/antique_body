"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";

import { NutritionPlanPicker } from "./NutritionPlanPicker";

export const DietPlanAssignmentCard = ({
  onStartPlan,
  loading,
  assignedPlan,
}) => {
  const [isStarting, setIsStarting] = useState(false);

  // If no plan assigned, show plan picker
  if (!assignedPlan) {
    return <NutritionPlanPicker onStartPlan={onStartPlan} loading={loading} />;
  }

  const handleStartPlan = async (customStartDate = null) => {
    setIsStarting(true);
    try {
      // Start assigned plan with optional custom start date
      await onStartPlan(false, assignedPlan.id, customStartDate);
    } catch (error) {
      console.error("Error starting plan:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStartToday = () => handleStartPlan();

  // Get plan data from assigned plan
  const planData = {
    title: assignedPlan.nutritionPlan.title,
    description: assignedPlan.nutritionPlan.description,
    coverImage: assignedPlan.nutritionPlan.coverImage,
    duration: assignedPlan.nutritionPlan.duration,
    durationType: assignedPlan.nutritionPlan.durationType,
    trainerName:
      assignedPlan.assignedBy.trainerProfile?.firstName +
      " " +
      (assignedPlan.assignedBy.trainerProfile?.lastName || ""),
    nutritionInfo: assignedPlan.nutritionPlan.nutritionInfo,
    days: assignedPlan.nutritionPlan.days,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6 relative pb-2">
        <h1 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon
            icon="mdi:nutrition"
            className="text-[#FF9A00]"
            width={24}
            height={24}
          />
          Your Personalized Nutrition Plan
        </h1>
        <p className="text-zinc-400 max-w-2xl text-sm">
          This nutrition plan has been carefully crafted by your trainer{" "}
          {planData.trainerName} to help you reach your fitness goals.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/40 rounded-full border border-zinc-700/50">
          <Icon icon="mdi:check-circle" className="w-4 h-4 text-[#FF9A00]" />
          <span className="text-zinc-200 text-xs">Ready to start</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative w-full bg-gradient-to-r from-zinc-900/95 via-zinc-800/90 to-zinc-900/95 border border-zinc-700/50 hover:border-[#FF9A00]/50 rounded-xl shadow-lg hover:shadow-[#FF9A00]/10 transition-all duration-300 overflow-hidden">
        {/* Left Accent Border */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF9A00]/30 to-[#FF9A00]/30 opacity-70" />

        {/* Content Container */}
        <div className="p-5">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={
                    planData.coverImage ||
                    "https://storage.googleapis.com/antique-body-app/cover-images/b57ed1dd-08bd-4d02-8c4d-61472a77c99d.png"
                  }
                  alt={planData.title}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {planData.title}
                </h2>
                <p className="text-zinc-400 text-sm">
                  By{" "}
                  <span className="text-[#FF9A00]">{planData.trainerName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-800/60 px-3 py-2 rounded-lg border border-zinc-700/50">
              <Icon
                icon="mdi:calendar-clock"
                className="w-5 h-5 text-[#FF9A00]"
              />
              <span className="text-sm text-zinc-300 whitespace-nowrap">
                {planData.duration} {planData.durationType} plan
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Plan Details */}
            <div className="space-y-5">
              {/* Description */}
              <div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {planData.description ||
                    "This personalized nutrition plan is designed to help you reach your fitness goals through balanced meals and proper nutrition."}
                </p>
              </div>

              {/* Nutrition Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <Icon icon="mdi:fire" className="w-4 h-4 text-[#FF9A00]" />
                    <div>
                      <div className="text-xs text-zinc-400">Calories</div>
                      <div className="text-white text-sm font-medium">
                        {planData.nutritionInfo?.calories || 2000} kcal
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:protein"
                      className="w-4 h-4 text-[#FF9A00]"
                    />
                    <div>
                      <div className="text-xs text-zinc-400">Protein</div>
                      <div className="text-white text-sm font-medium">
                        {planData.nutritionInfo?.protein || 200}g
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/30">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:food-apple"
                      className="w-4 h-4 text-[#FF9A00]"
                    />
                    <div>
                      <div className="text-xs text-zinc-400">Meals</div>
                      <div className="text-white text-sm font-medium">
                        {planData.days?.[0]?.meals?.length || 5}/day
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon icon="mdi:check" className="w-3 h-3 text-[#FF9A00]" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    {planData.days?.length || 7} day meal plan
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon icon="mdi:check" className="w-3 h-3 text-[#FF9A00]" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    Multiple meal options
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon icon="mdi:check" className="w-3 h-3 text-[#FF9A00]" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    Custom meal tracking
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon icon="mdi:check" className="w-3 h-3 text-[#FF9A00]" />
                  </div>
                  <div className="text-sm text-zinc-300">
                    Progress analytics
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="orangeFilled"
                size="default"
                onClick={handleStartToday}
                disabled={isStarting || loading}
                className="w-full"
              >
                {isStarting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Starting Plan...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:play" className="w-5 h-5 mr-2" />
                    Start Plan Today
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Plan Image & Stats */}
            <div className="relative h-full min-h-[240px] rounded-lg overflow-hidden">
              {/* Plan Image */}
              <Image
                src={
                  planData.coverImage ||
                  "https://storage.googleapis.com/antique-body-app/cover-images/b57ed1dd-08bd-4d02-8c4d-61472a77c99d.png"
                }
                alt={planData.title}
                fill
                className="object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Plan Stats */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-semibold text-white">
                      {planData.days?.length || 7}
                    </div>
                    <div className="text-xs text-zinc-300">Days</div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-semibold text-white">
                      {planData.days?.reduce(
                        (total, day) => total + (day.meals?.length || 0),
                        0
                      ) || "35"}
                    </div>
                    <div className="text-xs text-zinc-300">Total Meals</div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-lg font-semibold text-white">
                      {planData.nutritionInfo?.carbs || 250}g
                    </div>
                    <div className="text-xs text-zinc-300">Daily Carbs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF9A00]/10 flex items-center justify-center flex-shrink-0">
              <Icon
                icon="mdi:chart-timeline-variant"
                className="w-4 h-4 text-[#FF9A00]"
              />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium mb-1">
                Track Progress
              </h3>
              <p className="text-zinc-400 text-xs">
                Monitor your daily nutrition intake and see how it aligns with
                your goals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF9A00]/10 flex items-center justify-center flex-shrink-0">
              <Icon
                icon="mdi:food-variant"
                className="w-4 h-4 text-[#FF9A00]"
              />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium mb-1">
                Meal Options
              </h3>
              <p className="text-zinc-400 text-xs">
                Choose from various meal options or log your own custom meals
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg p-4 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF9A00]/10 flex items-center justify-center flex-shrink-0">
              <Icon
                icon="mdi:account-check"
                className="w-4 h-4 text-[#FF9A00]"
              />
            </div>
            <div>
              <h3 className="text-white text-sm font-medium mb-1">
                Expert Guidance
              </h3>
              <p className="text-zinc-400 text-xs">
                Professionally designed by {planData.trainerName} for optimal
                results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
