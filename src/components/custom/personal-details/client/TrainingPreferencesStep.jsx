import { FormField } from "@/components/common";
import { ToggleButtonGroup } from "@/components/common/ToggleButton";
import { RegistrationStep } from "@/components/custom/personal-details/shared";

export const TrainingPreferencesStep = ({
  formData,
  onChange,
  handleToggle,
  trainingFrequencyOptions,
  trainingPreferenceOptions,
  equipmentOptions,
  timeOptions,
  motivationLevelOptions,
}) => (
  <div className="space-y-6">
    <RegistrationStep title="Training Preferences">
      <div className="mb-6">
        <label className="mb-3 block text-gray-300">
          How often would you like to train?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {trainingFrequencyOptions.map((option) => (
            <FormField
              key={option.value}
              type="radio"
              name="trainingFrequency"
              id={`frequency-${option.value}`}
              label={option.label}
              checked={formData.trainingFrequency === option.value}
              onChange={() =>
                onChange({
                  target: { name: "trainingFrequency", value: option.value },
                })
              }
            />
          ))}
        </div>
      </div>

      <ToggleButtonGroup
        label="Training Style Preferences"
        description="Select all that interest you"
        options={trainingPreferenceOptions}
        selectedValues={formData.trainingPreference}
        onToggle={(style) => handleToggle("trainingPreference", style)}
      />

      <ToggleButtonGroup
        label="Available Equipment"
        description="Select all equipment you have access to"
        options={equipmentOptions}
        selectedValues={formData.availableEquipment}
        onToggle={(equipment) => handleToggle("availableEquipment", equipment)}
      />

      <ToggleButtonGroup
        label="Preferred Training Time"
        description="When do you prefer to workout?"
        options={timeOptions}
        selectedValues={formData.preferredTrainingTime}
        onToggle={(time) => handleToggle("preferredTrainingTime", time)}
      />

      <div className="mb-6">
        <label className="mb-3 block text-gray-300">Motivation Level</label>
        <div className="grid grid-cols-1 gap-3">
          {motivationLevelOptions.map((option) => (
            <FormField
              key={option.value}
              type="radio"
              name="motivationLevel"
              id={`motivation-${option.value}`}
              label={option.label}
              checked={formData.motivationLevel === option.value}
              onChange={() =>
                onChange({
                  target: { name: "motivationLevel", value: option.value },
                })
              }
            />
          ))}
        </div>
      </div>
    </RegistrationStep>
  </div>
);
