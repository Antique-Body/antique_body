"use client";
import { Icon } from "@iconify/react";

import { FormSection } from "../shared";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common";
import { ErrorIcon } from "@/components/common/Icons";

const fitnessGoals = [
  { id: "weight-loss", label: "Weight Loss", icon: "mdi:scale-bathroom" },
  { id: "muscle-gain", label: "Muscle Gain", icon: "mdi:arm-flex" },
  { id: "strength", label: "Strength", icon: "mdi:dumbbell" },
  { id: "endurance", label: "Endurance", icon: "mdi:heart-pulse" },
  { id: "flexibility", label: "Flexibility", icon: "mdi:yoga" },
  { id: "sports-performance", label: "Sports Performance", icon: "mdi:trophy" },
  { id: "health", label: "General Health", icon: "mdi:heart" },
  { id: "stress-reduction", label: "Stress Reduction", icon: "mdi:meditation" },
  { id: "posture", label: "Posture Improvement", icon: "mdi:human-handsup" },
  { id: "rehabilitation", label: "Rehabilitation", icon: "mdi:medical-bag" },
];

const activityPreferences = [
  { id: "gym", label: "Gym Workouts", icon: "mdi:weight-lifter" },
  { id: "cardio", label: "Cardio", icon: "mdi:run" },
  { id: "home", label: "Home Workouts", icon: "mdi:home" },
  { id: "outdoor", label: "Outdoor Activities", icon: "mdi:tree" },
  { id: "swimming", label: "Swimming", icon: "mdi:swim" },
  { id: "group", label: "Group Classes", icon: "mdi:account-group" },
  { id: "sports", label: "Sports", icon: "mdi:soccer" },
  { id: "yoga", label: "Yoga/Pilates", icon: "mdi:yoga" },
  { id: "functional", label: "Functional Training", icon: "mdi:human" },
  { id: "crossfit", label: "CrossFit", icon: "mdi:weight" },
  { id: "martial-arts", label: "Martial Arts", icon: "mdi:karate" },
  { id: "cycling", label: "Cycling", icon: "mdi:bike" },
];

export const FitnessGoalsStep = ({ formData, onChange, errors }) => {
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

  const handleActivityToggle = (activityId) => {
    const currentActivities = formData.activityPreferences || [];
    const newActivities = currentActivities.includes(activityId)
      ? currentActivities.filter((id) => id !== activityId)
      : [...currentActivities, activityId];

    onChange({
      target: {
        name: "activityPreferences",
        value: newActivities,
      },
    });
  };

  // Get completion status for visual indicators
  const getCompletionStatus = () => {
    const hasGoals = (formData.fitnessGoals || []).length > 0;
    const hasActivities = (formData.activityPreferences || []).length > 0;
    const hasFrequency = formData.preferredFrequency;
    const hasDescription = formData.goalDescription;

    return { hasGoals, hasActivities, hasFrequency, hasDescription };
  };

  const status = getCompletionStatus();

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasGoals
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:target"
              width={18}
              height={18}
              className={status.hasGoals ? "text-green-400" : "text-gray-400"}
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasGoals ? "text-green-400" : "text-gray-400"
                }`}
              >
                Goals
              </p>
              <p className="text-xs text-gray-500">
                {status.hasGoals
                  ? `${(formData.fitnessGoals || []).length} selected`
                  : "None selected"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasActivities
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:dumbbell"
              width={18}
              height={18}
              className={
                status.hasActivities ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasActivities ? "text-green-400" : "text-gray-400"
                }`}
              >
                Activities
              </p>
              <p className="text-xs text-gray-500">
                {status.hasActivities
                  ? `${(formData.activityPreferences || []).length} selected`
                  : "None selected"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasFrequency
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:calendar"
              width={18}
              height={18}
              className={
                status.hasFrequency ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasFrequency ? "text-green-400" : "text-gray-400"
                }`}
              >
                Frequency
              </p>
              <p className="text-xs text-gray-500">
                {status.hasFrequency ? formData.preferredFrequency : "Not set"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasDescription
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:text-box"
              width={18}
              height={18}
              className={
                status.hasDescription ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasDescription ? "text-green-400" : "text-gray-400"
                }`}
              >
                Details
              </p>
              <p className="text-xs text-gray-500">
                {status.hasDescription ? "Provided" : "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Goals */}
      <FormSection
        title="Fitness Goals"
        description="What are you looking to achieve? (Select all that apply)"
        icon={<Icon icon="mdi:target" width={20} height={20} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {fitnessGoals.map((goal) => (
            <Button
              key={goal.id}
              variant={
                (formData.fitnessGoals || []).includes(goal.id)
                  ? "orangeOutline"
                  : "secondary"
              }
              type="button"
              onClick={() => handleGoalToggle(goal.id)}
              className={`p-3 rounded-lg text-center flex flex-col items-center gap-2 ${
                (formData.fitnessGoals || []).includes(goal.id)
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
              }`}
            >
              <Icon icon={goal.icon} className="text-2xl" />
              <span className="text-sm font-medium">{goal.label}</span>
            </Button>
          ))}
        </div>
        {errors.fitnessGoals && (
          <p className="mt-3 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-2" />
            {errors.fitnessGoals}
          </p>
        )}
      </FormSection>

      {/* Activity Preferences */}
      <FormSection
        title="Activity Preferences"
        description="What types of activities do you enjoy or want to try?"
        icon={<Icon icon="mdi:directions-run" width={20} height={20} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {activityPreferences.map((activity) => (
            <Button
              key={activity.id}
              variant={
                (formData.activityPreferences || []).includes(activity.id)
                  ? "orangeOutline"
                  : "secondary"
              }
              type="button"
              onClick={() => handleActivityToggle(activity.id)}
              className={`p-3 rounded-lg text-left flex items-center gap-3 ${
                (formData.activityPreferences || []).includes(activity.id)
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
              }`}
            >
              <Icon icon={activity.icon} className="text-xl" />
              <span className="text-sm font-medium">{activity.label}</span>
            </Button>
          ))}
        </div>
        {errors.activityPreferences && (
          <p className="mt-3 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-2" />
            {errors.activityPreferences}
          </p>
        )}
      </FormSection>

      {/* Training Frequency */}
      <FormSection
        title="Training Frequency"
        description="How often would you like to train?"
        icon={<Icon icon="mdi:calendar-clock" width={20} height={20} />}
      >
        <FormField
          label="Preferred Training Frequency"
          name="preferredFrequency"
          type="select"
          value={formData.preferredFrequency}
          onChange={onChange}
          error={errors.preferredFrequency}
          options={[
            { value: "", label: "Select frequency" },
            { value: "1-2_per_week", label: "1-2 times per week" },
            { value: "3-4_per_week", label: "3-4 times per week" },
            { value: "5_plus_per_week", label: "5+ times per week" },
            { value: "every_day", label: "Daily" },
            { value: "flexible", label: "Flexible schedule" },
          ]}
        />

        <FormField
          label="Tell us more about your fitness goals"
          name="goalDescription"
          type="textarea"
          value={formData.goalDescription}
          onChange={onChange}
          error={errors.goalDescription}
          placeholder="Describe any specific goals, challenges, or preferences that would help a trainer understand your needs better..."
          rows={4}
        />
      </FormSection>

      {/* Selected summary */}
      {((formData.fitnessGoals && formData.fitnessGoals.length > 0) ||
        (formData.activityPreferences &&
          formData.activityPreferences.length > 0)) && (
        <div className="p-4 bg-[rgba(255,107,0,0.1)] border border-[#FF6B00]/30 rounded-lg">
          <h4 className="text-[#FF6B00] font-medium mb-2">Your Preferences:</h4>
          <div className="space-y-2 text-sm text-gray-300">
            {formData.fitnessGoals && formData.fitnessGoals.length > 0 && (
              <p>
                <span className="text-gray-400">Goals:</span>{" "}
                {formData.fitnessGoals
                  .map(
                    (goalId) =>
                      fitnessGoals.find((goal) => goal.id === goalId)?.label
                  )
                  .join(", ")}
              </p>
            )}

            {formData.activityPreferences &&
              formData.activityPreferences.length > 0 && (
                <p>
                  <span className="text-gray-400">Activities:</span>{" "}
                  {formData.activityPreferences
                    .map(
                      (activityId) =>
                        activityPreferences.find((act) => act.id === activityId)
                          ?.label
                    )
                    .join(", ")}
                </p>
              )}

            {formData.preferredFrequency && (
              <p>
                <span className="text-gray-400">Frequency:</span>{" "}
                {
                  [
                    { value: "1-2_per_week", label: "1-2 times per week" },
                    { value: "3-4_per_week", label: "3-4 times per week" },
                    { value: "5_plus_per_week", label: "5+ times per week" },
                    { value: "every_day", label: "Daily" },
                    { value: "flexible", label: "Flexible schedule" },
                  ].find((opt) => opt.value === formData.preferredFrequency)
                    ?.label
                }
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
