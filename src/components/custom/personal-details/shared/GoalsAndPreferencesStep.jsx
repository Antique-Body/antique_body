"use client";
import { Icon } from "@iconify/react";

import { FormSection, LanguageSelector } from "./";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { ErrorIcon } from "@/components/common/Icons";

// Activity types that the client might be interested in
const activityTypes = [
  { id: "weight_training", label: "Weight Training", icon: "mdi:dumbbell" },
  { id: "cardio", label: "Cardio", icon: "mdi:run" },
  { id: "yoga", label: "Yoga", icon: "mdi:yoga" },
  { id: "pilates", label: "Pilates", icon: "mdi:yoga-pose" },
  { id: "crossfit", label: "CrossFit", icon: "mdi:weight-lifter" },
  { id: "hiit", label: "HIIT", icon: "mdi:timer" },
  { id: "swimming", label: "Swimming", icon: "mdi:swim" },
  { id: "cycling", label: "Cycling", icon: "mdi:bike" },
  { id: "running", label: "Running", icon: "mdi:run-fast" },
  { id: "boxing", label: "Boxing", icon: "mdi:boxing-glove" },
  { id: "martial_arts", label: "Martial Arts", icon: "mdi:karate" },
  { id: "team_sports", label: "Team Sports", icon: "mdi:soccer" },
  { id: "dance", label: "Dance", icon: "mdi:dance-ballroom" },
  { id: "stretching", label: "Stretching", icon: "mdi:stretching" },
  { id: "walking", label: "Walking", icon: "mdi:walk" },
];

// Fitness goals options
const fitnessGoalTypes = [
  { id: "weight_loss", label: "Weight Loss", icon: "mdi:scale-bathroom" },
  { id: "muscle_gain", label: "Muscle Gain", icon: "mdi:arm-flex" },
  { id: "strength", label: "Improve Strength", icon: "mdi:weight" },
  { id: "endurance", label: "Improve Endurance", icon: "mdi:heart-pulse" },
  { id: "flexibility", label: "Increase Flexibility", icon: "mdi:yoga" },
  { id: "health", label: "General Health", icon: "mdi:heart-plus" },
  { id: "performance", label: "Athletic Performance", icon: "mdi:trophy" },
  {
    id: "rehabilitation",
    label: "Injury Rehabilitation",
    icon: "mdi:medical-bag",
  },
  { id: "stress_reduction", label: "Stress Reduction", icon: "mdi:meditation" },
];

export const GoalsAndPreferencesStep = ({ formData, onChange, errors }) => {
  // Handler for language selection
  const handleLanguageChange = (languages) => {
    onChange({
      target: {
        name: "languages",
        value: languages,
      },
    });
  };

  // Handler for primary goal selection
  const handlePrimaryGoalToggle = (goalId) => {
    onChange({
      target: {
        name: "primaryGoal",
        value: formData.primaryGoal === goalId ? "" : goalId,
      },
    });
  };

  // Handler for secondary goal selection
  const handleSecondaryGoalToggle = (goalId) => {
    // Don't allow the same goal for both primary and secondary
    if (goalId === formData.primaryGoal) return;

    onChange({
      target: {
        name: "secondaryGoal",
        value: formData.secondaryGoal === goalId ? "" : goalId,
      },
    });
  };

  // Handler for activity preferences
  const handleActivityToggle = (activityId) => {
    const currentActivities = formData.preferredActivities || [];
    const newActivities = currentActivities.includes(activityId)
      ? currentActivities.filter((id) => id !== activityId)
      : [...currentActivities, activityId];

    onChange({
      target: {
        name: "preferredActivities",
        value: newActivities,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Languages Section */}
      <FormSection
        title="Languages"
        description="What languages do you speak?"
        icon={<Icon icon="mdi:translate" width={20} height={20} />}
      >
        <LanguageSelector
          selectedLanguages={formData.languages || []}
          onChange={handleLanguageChange}
          error={errors.languages}
        />
      </FormSection>

      {/* Fitness Goals */}
      <FormSection
        title="Fitness Goals"
        description="What are you looking to achieve with your fitness journey?"
        icon={<Icon icon="mdi:target" width={20} height={20} />}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-3">Primary Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fitnessGoalTypes.map((goal) => {
                const isSelected = formData.primaryGoal === goal.id;
                return (
                  <Button
                    key={goal.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handlePrimaryGoalToggle(goal.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/50 text-[#FF6B00]"
                        : "bg-[rgba(30,30,30,0.5)] border-[#333] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                    }`}
                    leftIcon={<Icon icon={goal.icon} width={18} height={18} />}
                  >
                    <span className="text-sm">{goal.label}</span>
                    {isSelected && (
                      <Icon
                        icon="mdi:check"
                        className="ml-auto"
                        width={16}
                        height={16}
                      />
                    )}
                  </Button>
                );
              })}
            </div>
            {errors.primaryGoal && (
              <p className="mt-3 flex items-center text-sm text-red-500">
                <ErrorIcon size={16} className="mr-2" />
                {errors.primaryGoal}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-3">
              Secondary Goal (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fitnessGoalTypes.map((goal) => {
                const isSelected = formData.secondaryGoal === goal.id;
                const isPrimary = formData.primaryGoal === goal.id;
                return (
                  <Button
                    key={goal.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handleSecondaryGoalToggle(goal.id)}
                    disabled={isPrimary}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-[#FF6B00]/10 border-[#FF6B00]/50 text-[#FF6B00]"
                        : isPrimary
                        ? "opacity-50 cursor-not-allowed bg-[rgba(30,30,30,0.5)] border-[#333] text-gray-500"
                        : "bg-[rgba(30,30,30,0.5)] border-[#333] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                    }`}
                    leftIcon={<Icon icon={goal.icon} width={18} height={18} />}
                  >
                    <span className="text-sm">{goal.label}</span>
                    {isSelected && (
                      <Icon
                        icon="mdi:check"
                        className="ml-auto"
                        width={16}
                        height={16}
                      />
                    )}
                    {isPrimary && (
                      <span className="ml-auto text-xs text-gray-500">
                        Primary
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <FormField
            label="Goal Description"
            name="goalDescription"
            type="textarea"
            value={formData.goalDescription}
            onChange={onChange}
            placeholder="Tell us more about your specific fitness goals and what you want to achieve..."
            rows={3}
            error={errors.goalDescription}
          />
        </div>
      </FormSection>

      {/* Activity Preferences */}
      <FormSection
        title="Activity Preferences"
        description="What types of activities do you enjoy or want to try?"
        icon={<Icon icon="mdi:heart" width={20} height={20} />}
      >
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-4">
            Select all activities you're interested in:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activityTypes.map((activity) => {
              const isSelected = (formData.preferredActivities || []).includes(
                activity.id
              );
              return (
                <Button
                  key={activity.id}
                  type="button"
                  variant="ghost"
                  onClick={() => handleActivityToggle(activity.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-[#FF6B00]/10 border-[#FF6B00]/50 text-[#FF6B00]"
                      : "bg-[rgba(30,30,30,0.5)] border-[#333] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                  }`}
                  leftIcon={
                    <Icon icon={activity.icon} width={18} height={18} />
                  }
                >
                  <span className="text-sm">{activity.label}</span>
                </Button>
              );
            })}
          </div>
          {errors.preferredActivities && (
            <p className="mt-3 flex items-center text-sm text-red-500">
              <ErrorIcon size={16} className="mr-2" />
              {errors.preferredActivities}
            </p>
          )}
        </div>
      </FormSection>
    </div>
  );
};
