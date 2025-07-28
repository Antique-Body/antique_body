"use client";

import { Icon } from "@iconify/react";
import React from "react";

import { Card } from "@/components/common/Card";

const GOAL_TYPE_CONFIG = {
  "weight-loss": {
    label: "Weight Loss",
    description: "Calorie deficit focused",
    icon: "mdi:scale-bathroom",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  "muscle-gain": {
    label: "Muscle Gain",
    description: "Protein and calorie surplus",
    icon: "mdi:dumbbell",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  maintenance: {
    label: "Maintenance",
    description: "Balanced nutrition",
    icon: "mdi:scale-balance",
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
  },
  performance: {
    label: "Performance",
    description: "Athletic optimization",
    icon: "mdi:lightning-bolt",
    color: "text-[#FF6B00]",
    bgColor: "bg-[#FF6B00]/10",
    borderColor: "border-[#FF6B00]/30",
  },
};

const DIETARY_PREFERENCES = {
  vegan: { label: "Vegan", icon: "mdi:leaf", color: "text-green-400" },
  vegetarian: { label: "Vegetarian", icon: "mdi:carrot", color: "text-green-500" },
  keto: { label: "Keto", icon: "mdi:food-steak", color: "text-purple-400" },
  paleo: { label: "Paleo", icon: "mdi:food-drumstick", color: "text-orange-400" },
  mediterranean: { label: "Mediterranean", icon: "mdi:fish", color: "text-blue-400" },
  glutenFree: { label: "Gluten Free", icon: "mdi:wheat-off", color: "text-yellow-400" },
  dairyFree: { label: "Dairy Free", icon: "mdi:cow-off", color: "text-red-400" },
  lowCarb: { label: "Low Carb", icon: "mdi:bread-slice-outline", color: "text-indigo-400" },
  highProtein: { label: "High Protein", icon: "mdi:food-drumstick", color: "text-pink-400" },
  intermittentFasting: { label: "Intermittent Fasting", icon: "mdi:clock", color: "text-cyan-400" },
};

const MEAL_TYPES = {
  breakfast: { label: "Breakfast", icon: "mdi:weather-sunny", color: "text-yellow-400" },
  lunch: { label: "Lunch", icon: "mdi:weather-partly-cloudy", color: "text-orange-400" },
  dinner: { label: "Dinner", icon: "mdi:weather-night", color: "text-blue-400" },
  snack: { label: "Snack", icon: "mdi:food-apple", color: "text-green-400" },
  "pre-workout": { label: "Pre-Workout", icon: "mdi:dumbbell", color: "text-red-400" },
  "post-workout": { label: "Post-Workout", icon: "mdi:trophy", color: "text-purple-400" },
};

export const NutritionPlanFeatures = ({ planData }) => {
  if (!planData) return null;

  const goalConfig = GOAL_TYPE_CONFIG[planData.targetGoal];
  const keyFeatures = planData.keyFeatures || [];
  const timeline = planData.timeline || [];
  const mealTypes = planData.mealTypes || [];
  const nutritionInfo = planData.nutritionInfo || {};

  // Extract dietary preferences from meal data (assuming they're stored in planData)
  const dietaryPrefs = planData.dietaryPreferences || [];

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card
        variant="dark"
        className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="mdi:target"
            className="text-[#3E92CC]"
            width={28}
            height={28}
          />
          <h3 className="text-xl font-semibold text-white">Plan Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Goal */}
          {goalConfig && (
            <div className={`p-4 rounded-xl ${goalConfig.bgColor} ${goalConfig.borderColor} border`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-zinc-800/50`}>
                  <Icon
                    icon={goalConfig.icon}
                    className={`${goalConfig.color}`}
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Primary Goal</h4>
                  <p className={`${goalConfig.color} font-medium`}>{goalConfig.label}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm">{goalConfig.description}</p>
            </div>
          )}

          {/* Duration & Details */}
          <div className="p-4 bg-zinc-700/30 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Icon
                icon="mdi:calendar"
                className="text-[#3E92CC]"
                width={20}
                height={20}
              />
              <h4 className="font-semibold text-white text-sm">Plan Duration</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Duration</span>
                <span className="text-white font-semibold">
                  {planData.duration} {planData.durationType}
                </span>
              </div>
              {planData.recommendedFrequency && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Frequency</span>
                  <span className="text-white font-semibold">
                    {planData.recommendedFrequency}
                  </span>
                </div>
              )}
              {planData.cookingTime && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Cooking Time</span>
                  <span className="text-white font-semibold">
                    {planData.cookingTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Key Features */}
      {keyFeatures.length > 0 && (
        <Card
          variant="dark"
          className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Icon
              icon="mdi:star"
              className="text-[#3E92CC]"
              width={28}
              height={28}
            />
            <h3 className="text-xl font-semibold text-white">Key Benefits</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-zinc-700/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-[#3E92CC]/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="mdi:check" className="w-3 h-3 text-[#3E92CC]" />
                </div>
                <span className="text-white text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Nutrition Targets */}
      {Object.keys(nutritionInfo).length > 0 && (
        <Card
          variant="dark"
          className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Icon
              icon="mdi:nutrition"
              className="text-[#3E92CC]"
              width={28}
              height={28}
            />
            <h3 className="text-xl font-semibold text-white">Daily Nutrition Targets</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nutritionInfo.calories && (
              <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/20">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {nutritionInfo.calories}
                </div>
                <div className="text-zinc-400 text-xs font-medium">Calories</div>
              </div>
            )}
            {nutritionInfo.protein && (
              <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {nutritionInfo.protein}g
                </div>
                <div className="text-zinc-400 text-xs font-medium">Protein</div>
              </div>
            )}
            {nutritionInfo.carbs && (
              <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {nutritionInfo.carbs}g
                </div>
                <div className="text-zinc-400 text-xs font-medium">Carbs</div>
              </div>
            )}
            {nutritionInfo.fats && (
              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {nutritionInfo.fats}g
                </div>
                <div className="text-zinc-400 text-xs font-medium">Fats</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Meal Types & Dietary Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Types */}
        {mealTypes.length > 0 && (
          <Card
            variant="dark"
            className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Icon
                icon="mdi:silverware-fork-knife"
                className="text-[#3E92CC]"
                width={28}
                height={28}
              />
              <h3 className="text-xl font-semibold text-white">Meal Types</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {mealTypes.map((mealType, index) => {
                const typeConfig = MEAL_TYPES[mealType] || { 
                  label: mealType, 
                  icon: "mdi:food", 
                  color: "text-zinc-400" 
                };
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-700/30 rounded-lg"
                  >
                    <Icon
                      icon={typeConfig.icon}
                      className={`${typeConfig.color}`}
                      width={16}
                      height={16}
                    />
                    <span className="text-white text-sm font-medium">
                      {typeConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Dietary Preferences */}
        {dietaryPrefs.length > 0 && (
          <Card
            variant="dark"
            className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Icon
                icon="mdi:food-variant"
                className="text-[#3E92CC]"
                width={28}
                height={28}
              />
              <h3 className="text-xl font-semibold text-white">Dietary Preferences</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryPrefs.map((pref, index) => {
                const prefConfig = DIETARY_PREFERENCES[pref] || { 
                  label: pref, 
                  icon: "mdi:food", 
                  color: "text-zinc-400" 
                };
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-700/30 rounded-lg"
                  >
                    <Icon
                      icon={prefConfig.icon}
                      className={`${prefConfig.color}`}
                      width={16}
                      height={16}
                    />
                    <span className="text-white text-sm font-medium">
                      {prefConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Timeline/Phases */}
      {timeline.length > 0 && (
        <Card
          variant="dark"
          className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Icon
              icon="mdi:timeline-clock"
              className="text-[#3E92CC]"
              width={28}
              height={28}
            />
            <h3 className="text-xl font-semibold text-white">Nutrition Phases</h3>
          </div>
          <div className="space-y-4">
            {timeline.map((phase, index) => (
              <div key={index} className="flex gap-4 p-4 bg-zinc-700/20 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#3E92CC] to-[#2E7DCC] flex items-center justify-center font-bold text-white text-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{phase.title}</h4>
                    {phase.week && (
                      <span className="px-2 py-1 bg-[#3E92CC]/20 text-[#3E92CC] text-xs rounded-full">
                        {phase.week}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Adaptability & Supplements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {planData.adaptability && (
          <Card
            variant="dark"
            className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon
                icon="mdi:cog"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-lg font-semibold text-white">Adaptability</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {planData.adaptability}
            </p>
          </Card>
        )}

        {planData.supplementRecommendations && (
          <Card
            variant="dark"
            className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon
                icon="mdi:pill"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-lg font-semibold text-white">Supplements</h3>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {planData.supplementRecommendations}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};