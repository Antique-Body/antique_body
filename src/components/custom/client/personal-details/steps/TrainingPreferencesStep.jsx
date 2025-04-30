import { RadioGroup, RegistrationStep, ToggleButtonGroup } from "@/components/shared";

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
      <RadioGroup
        label="How often would you like to train?"
        options={trainingFrequencyOptions}
        value={formData.trainingFrequency}
        onChange={freq => onChange({ target: { name: "trainingFrequency", value: freq } })}
        columns={3}
      />

      <ToggleButtonGroup
        label="Training Style Preferences"
        description="Select all that interest you"
        options={trainingPreferenceOptions}
        selectedValues={formData.trainingPreference}
        onToggle={style => handleToggle("trainingPreference", style)}
        required={true}
      />

      <ToggleButtonGroup
        label="Available Equipment"
        description="Select all equipment you have access to"
        options={equipmentOptions}
        selectedValues={formData.availableEquipment}
        onToggle={equipment => handleToggle("availableEquipment", equipment)}
      />

      <ToggleButtonGroup
        label="Preferred Training Time"
        description="When do you prefer to workout?"
        options={timeOptions}
        selectedValues={formData.preferredTrainingTime}
        onToggle={time => handleToggle("preferredTrainingTime", time)}
      />

      <RadioGroup
        label="Motivation Level"
        options={motivationLevelOptions}
        value={formData.motivationLevel}
        onChange={level => onChange({ target: { name: "motivationLevel", value: level } })}
        columns={1}
      />
    </RegistrationStep>
  </div>
);
