import { FormField } from "@/components/common";
import { RadioGroup } from "@/components/custom";
import { RegistrationStep } from "@/components/custom/shared";
import { ToggleButtonGroup } from "@/components/custom/ToggleButton";
export const BodyMetricsStep = ({ formData, onChange, handleToggle, fitnessLevelOptions, goalsOptions }) => {
    // Calculate BMI (optional feature to show users)
    const calculateBMI = () => {
        if (formData.weight && formData.height.feet && formData.height.inches) {
            const weightKg = parseFloat(formData.weight) * 0.453592; // Convert lbs to kg
            const heightM = (parseInt(formData.height.feet) * 12 + parseInt(formData.height.inches)) * 0.0254; // Convert inches to meters
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);
            return bmi;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <RegistrationStep title="Body Metrics">
                <div className="mb-6">
                    <label className="mb-2 block text-gray-300">Height</label>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            label="Feet"
                            name="height.feet"
                            type="number"
                            value={formData.height.feet}
                            onChange={onChange}
                            min="3"
                            max="8"
                            placeholder="ft"
                            required
                            size="small"
                        />
                        <FormField
                            label="Inches"
                            name="height.inches"
                            type="number"
                            value={formData.height.inches}
                            onChange={onChange}
                            min="0"
                            max="11"
                            placeholder="in"
                            required
                            size="small"
                        />
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        label="Current Weight (lbs)"
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={onChange}
                        placeholder="Your current weight"
                        required
                    />

                    <div>
                        <FormField
                            label="Target Weight (lbs)"
                            name="targetWeight"
                            type="number"
                            value={formData.targetWeight}
                            onChange={onChange}
                            placeholder="Your target weight"
                            subLabel="(Leave blank if maintaining)"
                        />
                    </div>
                </div>

                {calculateBMI() && (
                    <div className="mt-4 rounded-lg border border-[#333] bg-[rgba(20,20,20,0.7)] p-3">
                        <p className="text-sm">
                            Your BMI: <span className="font-bold text-[#FF6B00]">{calculateBMI()}</span>
                        </p>
                    </div>
                )}
            </RegistrationStep>

            <RegistrationStep title="Fitness Level & Goals">
                <RadioGroup
                    label="Current Fitness Level"
                    options={fitnessLevelOptions}
                    value={formData.fitnessLevel}
                    onChange={(level) => onChange({ target: { name: "fitnessLevel", value: level } })}
                    columns={2}
                />

                <ToggleButtonGroup
                    label="Fitness Goals"
                    description="Select all that apply to you"
                    options={goalsOptions}
                    selectedValues={formData.goals}
                    onToggle={(goal) => handleToggle("goals", goal)}
                    required={true}
                />
            </RegistrationStep>
        </div>
    );
};
