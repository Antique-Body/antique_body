"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { FormSection } from "../shared";

import { FormField } from "@/components/common";

const fitnessGoals = [
  {
    id: "weight_loss",
    label: "Weight Loss",
    icon: "mdi:scale-bathroom",
    description: "Lose weight and body fat",
  },
  {
    id: "muscle_gain",
    label: "Muscle Gain",
    icon: "mdi:arm-flex",
    description: "Build muscle mass and strength",
  },
  {
    id: "strength",
    label: "Strength Training",
    icon: "mdi:dumbbell",
    description: "Increase overall strength",
  },
  {
    id: "endurance",
    label: "Endurance",
    icon: "mdi:heart-pulse",
    description: "Improve cardiovascular fitness",
  },
  {
    id: "flexibility",
    label: "Flexibility",
    icon: "mdi:yoga",
    description: "Increase mobility and flexibility",
  },
  {
    id: "general_fitness",
    label: "General Fitness",
    icon: "mdi:run",
    description: "Overall health and wellness",
  },
  {
    id: "sports_performance",
    label: "Sports Performance",
    icon: "mdi:trophy",
    description: "Improve athletic performance",
  },
  {
    id: "rehabilitation",
    label: "Rehabilitation",
    icon: "mdi:medical-bag",
    description: "Recover from injury",
  },
  {
    id: "body_composition",
    label: "Body Recomposition",
    icon: "mdi:account-outline",
    description: "Change body composition",
  },
];

const workoutPreferences = [
  { id: "high_intensity", label: "High Intensity", icon: "mdi:fire" },
  { id: "low_impact", label: "Low Impact", icon: "mdi:leaf" },
  { id: "group_training", label: "Group Training", icon: "mdi:account-group" },
  { id: "one_on_one", label: "1-on-1 Training", icon: "mdi:account" },
  { id: "outdoor", label: "Outdoor Workouts", icon: "mdi:tree" },
  { id: "gym_based", label: "Gym-Based", icon: "mdi:dumbbell" },
  { id: "home_workouts", label: "Home Workouts", icon: "mdi:home" },
  { id: "functional", label: "Functional Training", icon: "mdi:human-handsup" },
];

export const FitnessGoalsStep = ({ formData, onChange, errors }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleGoalToggle = (goalId) => {
    const currentGoals = formData.fitnessGoals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id) => id !== goalId)
      : [...currentGoals, goalId];

    onChange({
      target: {
        name: "fitnessGoals",
        value: newGoals,
      },
    });
  };

  const handlePreferenceToggle = (prefId) => {
    const currentPrefs = formData.workoutPreferences || [];
    const newPrefs = currentPrefs.includes(prefId)
      ? currentPrefs.filter((id) => id !== prefId)
      : [...currentPrefs, prefId];

    onChange({
      target: {
        name: "workoutPreferences",
        value: newPrefs,
      },
    });
  };

  const filteredGoals = fitnessGoals.filter(
    (goal) =>
      goal.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Fitness Goals */}
      <FormSection
        title="Fitness Goals"
        description="What do you want to achieve? (Select all that apply)"
        icon={<Icon icon="mdi:target" width={20} height={20} />}
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <Icon
            icon="mdi:magnify"
            width={18}
            height={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm placeholder-gray-400 focus:border-[#FF6B00] focus:outline-none transition-colors"
          />
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGoals.map((goal) => {
            const isSelected = (formData.fitnessGoals || []).includes(goal.id);

            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon
                    icon={goal.icon}
                    width={24}
                    height={24}
                    className={isSelected ? "text-[#FF6B00]" : "text-gray-400"}
                  />
                  <span className="font-medium">{goal.label}</span>
                  {isSelected && (
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      className="ml-auto text-[#FF6B00]"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-400">{goal.description}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Goals Count */}
        {(formData.fitnessGoals || []).length > 0 && (
          <div className="flex items-center justify-between p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:check-circle"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              <span className="text-sm text-[#FF6B00] font-medium">
                {(formData.fitnessGoals || []).length} goal
                {(formData.fitnessGoals || []).length === 1 ? "" : "s"} selected
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ target: { name: "fitnessGoals", value: [] } })
              }
              className="text-xs text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </FormSection>

      {/* Workout Preferences */}
      <FormSection
        title="Workout Preferences"
        description="What type of training environment and style do you prefer?"
        icon={<Icon icon="mdi:heart" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {workoutPreferences.map((pref) => {
            const isSelected = (formData.workoutPreferences || []).includes(
              pref.id
            );

            return (
              <button
                key={pref.id}
                type="button"
                onClick={() => handlePreferenceToggle(pref.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                    : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon
                    icon={pref.icon}
                    width={24}
                    height={24}
                    className={isSelected ? "text-[#FF6B00]" : "text-gray-400"}
                  />
                  <span className="text-sm font-medium">{pref.label}</span>
                  {isSelected && (
                    <Icon
                      icon="mdi:check"
                      width={14}
                      height={14}
                      className="text-[#FF6B00]"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </FormSection>

      {/* Experience Level */}
      <FormSection
        title="Exercise Experience"
        description="Help us understand your fitness background"
        icon={<Icon icon="mdi:chart-line" width={20} height={20} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Exercise Experience"
            name="exerciseExperience"
            type="select"
            value={formData.exerciseExperience}
            onChange={onChange}
            error={errors.exerciseExperience}
            options={[
              { value: "", label: "Select experience level" },
              { value: "beginner", label: "Beginner (0-6 months)" },
              { value: "novice", label: "Novice (6 months - 2 years)" },
              { value: "intermediate", label: "Intermediate (2-5 years)" },
              { value: "advanced", label: "Advanced (5+ years)" },
              { value: "expert", label: "Expert/Competitive" },
            ]}
          />

          <FormField
            label="Training Frequency Goal"
            name="trainingFrequency"
            type="select"
            value={formData.trainingFrequency}
            onChange={onChange}
            error={errors.trainingFrequency}
            options={[
              { value: "", label: "How often do you want to train?" },
              { value: "1-2", label: "1-2 times per week" },
              { value: "3-4", label: "3-4 times per week" },
              { value: "5-6", label: "5-6 times per week" },
              { value: "daily", label: "Every day" },
            ]}
          />
        </div>
      </FormSection>
    </div>
  );
};
