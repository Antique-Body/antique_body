"use client";
import { Icon } from "@iconify/react";

import { FormSection } from "../shared";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { ErrorIcon } from "@/components/common/Icons";

const trainerPreferences = [
  { id: "experienced", label: "Experienced", icon: "mdi:medal" },
  { id: "certified", label: "Certified", icon: "mdi:certificate" },
  { id: "specialized", label: "Specialized", icon: "mdi:star" },
  { id: "motivational", label: "Motivational", icon: "mdi:arm-flex" },
  { id: "supportive", label: "Supportive", icon: "mdi:handshake" },
  { id: "technical", label: "Technical", icon: "mdi:wrench" },
  { id: "holistic", label: "Holistic", icon: "mdi:yoga" },
  { id: "results-driven", label: "Results-Driven", icon: "mdi:trophy" },
];

const trainingStyles = [
  { id: "traditional", label: "Traditional", icon: "mdi:dumbbell" },
  { id: "hiit", label: "HIIT", icon: "mdi:lightning-bolt" },
  { id: "functional", label: "Functional", icon: "mdi:human" },
  { id: "group", label: "Group Training", icon: "mdi:account-group" },
  { id: "one-on-one", label: "One-on-One", icon: "mdi:account-supervisor" },
  { id: "mind-body", label: "Mind-Body", icon: "mdi:brain" },
  { id: "sport-specific", label: "Sport Specific", icon: "mdi:trophy" },
  { id: "online", label: "Online Training", icon: "mdi:laptop" },
];

const specializations = [
  { id: "weight-loss", label: "Weight Loss", icon: "mdi:scale-bathroom" },
  { id: "muscle-building", label: "Muscle Building", icon: "mdi:arm-flex" },
  { id: "strength", label: "Strength & Power", icon: "mdi:weight-lifter" },
  { id: "endurance", label: "Endurance", icon: "mdi:run" },
  { id: "mobility", label: "Mobility & Flexibility", icon: "mdi:yoga" },
  { id: "senior", label: "Senior Fitness", icon: "mdi:account-supervisor" },
  { id: "prenatal", label: "Prenatal/Postnatal", icon: "mdi:mother-nurse" },
  { id: "nutrition", label: "Nutrition", icon: "mdi:food-apple" },
  {
    id: "rehabilitation",
    label: "Rehabilitation",
    icon: "mdi:wheelchair-accessibility",
  },
  { id: "sports", label: "Sports Performance", icon: "mdi:whistle" },
];

export const PreferencesStep = ({ formData, onChange, errors }) => {
  const handleTrainerPrefToggle = (prefId) => {
    const currentPrefs = formData.trainerPreferences || [];
    const newPrefs = currentPrefs.includes(prefId)
      ? currentPrefs.filter((id) => id !== prefId)
      : [...currentPrefs, prefId];

    onChange({
      target: {
        name: "trainerPreferences",
        value: newPrefs,
      },
    });
  };

  const handleTrainingStyleToggle = (styleId) => {
    const currentStyles = formData.trainingStyles || [];
    const newStyles = currentStyles.includes(styleId)
      ? currentStyles.filter((id) => id !== styleId)
      : [...currentStyles, styleId];

    onChange({
      target: {
        name: "trainingStyles",
        value: newStyles,
      },
    });
  };

  const handleSpecializationToggle = (specId) => {
    const currentSpecs = formData.specializations || [];
    const newSpecs = currentSpecs.includes(specId)
      ? currentSpecs.filter((id) => id !== specId)
      : [...currentSpecs, specId];

    onChange({
      target: {
        name: "specializations",
        value: newSpecs,
      },
    });
  };

  // Get completion status for visual indicators
  const getCompletionStatus = () => {
    const hasTrainerPrefs = (formData.trainerPreferences || []).length > 0;
    const hasTrainingStyles = (formData.trainingStyles || []).length > 0;
    const hasSpecializations = (formData.specializations || []).length > 0;
    const hasAdditionalNotes = formData.additionalPreferences;

    return {
      hasTrainerPrefs,
      hasTrainingStyles,
      hasSpecializations,
      hasAdditionalNotes,
    };
  };

  const status = getCompletionStatus();

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasTrainerPrefs
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:account-supervisor"
              width={18}
              height={18}
              className={
                status.hasTrainerPrefs ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasTrainerPrefs ? "text-green-400" : "text-gray-400"
                }`}
              >
                Trainer Type
              </p>
              <p className="text-xs text-gray-500">
                {status.hasTrainerPrefs
                  ? `${(formData.trainerPreferences || []).length} selected`
                  : "None selected"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasTrainingStyles
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
                status.hasTrainingStyles ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasTrainingStyles ? "text-green-400" : "text-gray-400"
                }`}
              >
                Training Style
              </p>
              <p className="text-xs text-gray-500">
                {status.hasTrainingStyles
                  ? `${(formData.trainingStyles || []).length} selected`
                  : "None selected"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasSpecializations
              ? "bg-green-500/10 border-green-500/30"
              : "bg-gray-800/50 border-gray-600/30"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:star"
              width={18}
              height={18}
              className={
                status.hasSpecializations ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasSpecializations ? "text-green-400" : "text-gray-400"
                }`}
              >
                Specializations
              </p>
              <p className="text-xs text-gray-500">
                {status.hasSpecializations
                  ? `${(formData.specializations || []).length} selected`
                  : "None selected"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border transition-all duration-200 ${
            status.hasAdditionalNotes
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
                status.hasAdditionalNotes ? "text-green-400" : "text-gray-400"
              }
            />
            <div>
              <p
                className={`text-sm font-medium ${
                  status.hasAdditionalNotes ? "text-green-400" : "text-gray-400"
                }`}
              >
                Additional Notes
              </p>
              <p className="text-xs text-gray-500">
                {status.hasAdditionalNotes ? "Provided" : "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Preferences */}
      <FormSection
        title="Trainer Preferences"
        description="What qualities are you looking for in a trainer?"
        icon={<Icon icon="mdi:account-supervisor" width={20} height={20} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trainerPreferences.map((pref) => (
            <Button
              key={pref.id}
              variant={
                (formData.trainerPreferences || []).includes(pref.id)
                  ? "orangeOutline"
                  : "secondary"
              }
              type="button"
              onClick={() => handleTrainerPrefToggle(pref.id)}
              className={`p-3 rounded-lg text-center flex flex-col items-center gap-2 ${
                (formData.trainerPreferences || []).includes(pref.id)
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
              }`}
            >
              <Icon icon={pref.icon} className="text-2xl" />
              <span className="text-sm font-medium">{pref.label}</span>
            </Button>
          ))}
        </div>
        {errors.trainerPreferences && (
          <p className="mt-3 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-2" />
            {errors.trainerPreferences}
          </p>
        )}
      </FormSection>

      {/* Training Style Preferences */}
      <FormSection
        title="Training Style"
        description="What type of training approach do you prefer?"
        icon={<Icon icon="mdi:dumbbell" width={20} height={20} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trainingStyles.map((style) => (
            <Button
              key={style.id}
              variant={
                (formData.trainingStyles || []).includes(style.id)
                  ? "orangeOutline"
                  : "secondary"
              }
              type="button"
              onClick={() => handleTrainingStyleToggle(style.id)}
              className={`p-3 rounded-lg text-left flex items-center gap-3 ${
                (formData.trainingStyles || []).includes(style.id)
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
              }`}
            >
              <Icon icon={style.icon} className="text-xl" />
              <span className="text-sm font-medium">{style.label}</span>
            </Button>
          ))}
        </div>
        {errors.trainingStyles && (
          <p className="mt-3 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-2" />
            {errors.trainingStyles}
          </p>
        )}
      </FormSection>

      {/* Specialization Preferences */}
      <FormSection
        title="Trainer Specializations"
        description="Areas where you'd like your trainer to specialize in"
        icon={<Icon icon="mdi:star" width={20} height={20} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {specializations.map((spec) => (
            <Button
              key={spec.id}
              variant={
                (formData.specializations || []).includes(spec.id)
                  ? "orangeOutline"
                  : "secondary"
              }
              type="button"
              onClick={() => handleSpecializationToggle(spec.id)}
              className={`p-3 rounded-lg text-left flex items-center gap-3 ${
                (formData.specializations || []).includes(spec.id)
                  ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                  : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
              }`}
            >
              <Icon icon={spec.icon} className="text-xl" />
              <span className="text-sm font-medium">{spec.label}</span>
            </Button>
          ))}
        </div>
        {errors.specializations && (
          <p className="mt-3 flex items-center text-sm text-red-500">
            <ErrorIcon size={16} className="mr-2" />
            {errors.specializations}
          </p>
        )}
      </FormSection>

      {/* Additional Preferences */}
      <FormSection
        title="Additional Preferences"
        description="Any other specific requirements or preferences"
        icon={<Icon icon="mdi:note-text" width={20} height={20} />}
      >
        <FormField
          label="Additional Notes for Matching"
          name="additionalPreferences"
          type="textarea"
          value={formData.additionalPreferences}
          onChange={onChange}
          error={errors.additionalPreferences}
          placeholder="Add any other preferences that would help us match you with the right trainer..."
          rows={4}
        />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Preferred Gender of Trainer"
            name="preferredTrainerGender"
            type="select"
            value={formData.preferredTrainerGender}
            onChange={onChange}
            error={errors.preferredTrainerGender}
            options={[
              { value: "", label: "No preference" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />

          <FormField
            label="Preferred Experience Level"
            name="preferredExperienceLevel"
            type="select"
            value={formData.preferredExperienceLevel}
            onChange={onChange}
            error={errors.preferredExperienceLevel}
            options={[
              { value: "", label: "No preference" },
              { value: "entry", label: "Entry Level (1-2 years)" },
              { value: "intermediate", label: "Intermediate (3-5 years)" },
              { value: "experienced", label: "Experienced (5-10 years)" },
              { value: "expert", label: "Expert (10+ years)" },
            ]}
          />
        </div>
      </FormSection>

      {/* Selected summary */}
      {((formData.trainerPreferences &&
        formData.trainerPreferences.length > 0) ||
        (formData.trainingStyles && formData.trainingStyles.length > 0) ||
        (formData.specializations && formData.specializations.length > 0)) && (
        <div className="p-4 bg-[rgba(255,107,0,0.1)] border border-[#FF6B00]/30 rounded-lg">
          <h4 className="text-[#FF6B00] font-medium mb-2">
            Your Trainer Preferences:
          </h4>
          <div className="space-y-2 text-sm text-gray-300">
            {formData.trainerPreferences &&
              formData.trainerPreferences.length > 0 && (
                <p>
                  <span className="text-gray-400">Trainer Type:</span>{" "}
                  {formData.trainerPreferences
                    .map(
                      (prefId) =>
                        trainerPreferences.find((pref) => pref.id === prefId)
                          ?.label
                    )
                    .join(", ")}
                </p>
              )}

            {formData.trainingStyles && formData.trainingStyles.length > 0 && (
              <p>
                <span className="text-gray-400">Training Style:</span>{" "}
                {formData.trainingStyles
                  .map(
                    (styleId) =>
                      trainingStyles.find((style) => style.id === styleId)
                        ?.label
                  )
                  .join(", ")}
              </p>
            )}

            {formData.specializations &&
              formData.specializations.length > 0 && (
                <p>
                  <span className="text-gray-400">Specializations:</span>{" "}
                  {formData.specializations
                    .map(
                      (specId) =>
                        specializations.find((spec) => spec.id === specId)
                          ?.label
                    )
                    .join(", ")}
                </p>
              )}

            {formData.preferredTrainerGender && (
              <p>
                <span className="text-gray-400">Preferred Trainer Gender:</span>{" "}
                {formData.preferredTrainerGender === "male" ? "Male" : "Female"}
              </p>
            )}

            {formData.preferredExperienceLevel && (
              <p>
                <span className="text-gray-400">Preferred Experience:</span>{" "}
                {
                  [
                    { value: "entry", label: "Entry Level (1-2 years)" },
                    {
                      value: "intermediate",
                      label: "Intermediate (3-5 years)",
                    },
                    { value: "experienced", label: "Experienced (5-10 years)" },
                    { value: "expert", label: "Expert (10+ years)" },
                  ].find(
                    (opt) => opt.value === formData.preferredExperienceLevel
                  )?.label
                }
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
