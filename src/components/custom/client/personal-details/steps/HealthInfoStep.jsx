import { DynamicFields, RegistrationStep, ToggleButtonGroup } from "@/components/shared";

export const HealthInfoStep = ({
    formData,
    healthFields,
    handleHealthChange,
    addHealthField,
    removeHealthField,
    injuryFields,
    handleInjuryChange,
    addInjuryField,
    removeInjuryField,
    handleToggle,
    dietaryPreferencesOptions,
}) => {
    return (
        <div className="space-y-6">
            <RegistrationStep title="Health Information" description="This helps trainers create a safe program for you">
                <DynamicFields
                    label="Health Conditions"
                    description="List any health conditions that might affect your training"
                    fields={healthFields}
                    onFieldChange={handleHealthChange}
                    onAddField={addHealthField}
                    onRemoveField={removeHealthField}
                    placeholder="e.g. Asthma, Diabetes, Heart condition, etc."
                />

                <DynamicFields
                    label="Previous Injuries"
                    description="List any injuries that might affect your training"
                    fields={injuryFields}
                    onFieldChange={handleInjuryChange}
                    onAddField={addInjuryField}
                    onRemoveField={removeInjuryField}
                    placeholder="e.g. Knee injury, Back pain, etc."
                />
            </RegistrationStep>

            <RegistrationStep title="Dietary Preferences">
                <ToggleButtonGroup
                    label="Dietary Preferences"
                    description="Select all that apply to you"
                    options={dietaryPreferencesOptions}
                    selectedValues={formData.dietaryPreferences}
                    onToggle={(diet) => handleToggle("dietaryPreferences", diet)}
                />
            </RegistrationStep>
        </div>
    );
};
