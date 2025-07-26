import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { SectionTitle } from "@/components/custom/dashboard/shared";
import { LanguageSelector } from "@/components/custom/personal-details/shared/LanguageSelector";
import { ACTIVITY_TYPES, FITNESS_GOALS } from "@/enums";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const ActivitiesAndLanguages = ({ clientData, setClientData }) => {
  // Helper function to normalize languages data
  const normalizeLanguages = (languages) => {
    if (!languages || languages.length === 0) return [];

    // If languages is an array of objects with 'name' property, extract names
    if (typeof languages[0] === "object" && languages[0].name) {
      return languages.map((lang) => lang.name);
    }

    // If languages is already an array of strings, return as is
    if (typeof languages[0] === "string") {
      return languages;
    }

    // Fallback to empty array
    return [];
  };

  // Get normalized languages
  const normalizedLanguages = normalizeLanguages(clientData.languages);

  // Handler for activities
  const handleActivityToggle = (activityId) => {
    const currentActivities = clientData.preferredActivities || [];
    const newActivities = currentActivities.includes(activityId)
      ? currentActivities.filter((id) => id !== activityId)
      : [...currentActivities, activityId];
    setClientData((prev) => ({ ...prev, preferredActivities: newActivities }));
  };
  // Handler for languages (from LanguageSelector)
  const handleLanguagesChange = (langs) => {
    setClientData((prev) => ({ ...prev, languages: langs }));
  };
  // Handler for fitness goals
  const handlePrimaryGoalToggle = (goalId) => {
    setClientData((prev) => ({
      ...prev,
      primaryGoal: prev.primaryGoal === goalId ? "" : goalId,
    }));
  };
  const handleSecondaryGoalToggle = (goalId) => {
    if (goalId === clientData.primaryGoal) return;
    setClientData((prev) => ({
      ...prev,
      secondaryGoal: prev.secondaryGoal === goalId ? "" : goalId,
    }));
  };
  const handleGoalDescriptionChange = (e) => {
    setClientData((prev) => ({ ...prev, goalDescription: e.target.value }));
  };
  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <SectionTitle title="Goals, Activities & Languages" />
      {/* Fitness Goals Section */}
      <motion.div variants={fadeInUp}>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-3">Primary Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {FITNESS_GOALS.map((goal) => {
                const isSelected = clientData.primaryGoal === goal.id;
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
          </div>
          <div>
            <label className="block text-gray-300 mb-3">
              Secondary Goal (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {FITNESS_GOALS.map((goal) => {
                const isSelected = clientData.secondaryGoal === goal.id;
                const isPrimary = clientData.primaryGoal === goal.id;
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
            value={clientData.goalDescription || ""}
            onChange={handleGoalDescriptionChange}
            placeholder="Tell us more about your specific fitness goals and what you want to achieve..."
            rows={3}
          />
        </div>
      </motion.div>
      {/* Activities Section */}
      <motion.div variants={fadeInUp}>
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-4">
            Select all activities you're interested in:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ACTIVITY_TYPES.map((activity) => {
              const isSelected = (
                clientData.preferredActivities || []
              ).includes(activity.id);
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
        </div>
      </motion.div>
      {/* Languages Section */}
      <motion.div variants={fadeInUp}>
        <div className="mb-2 font-medium text-gray-300">
          Languages you speak
        </div>
        <LanguageSelector
          selectedLanguages={normalizedLanguages}
          onChange={handleLanguagesChange}
        />
      </motion.div>
    </motion.div>
  );
};
