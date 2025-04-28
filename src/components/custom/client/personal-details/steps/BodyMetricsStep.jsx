import { FormField, RadioGroup, RegistrationStep, ToggleButtonGroup } from "@/components/shared";
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
                    <label className="block text-gray-300 mb-2">Height</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Feet</label>
                            <input
                                type="number"
                                name="height.feet"
                                value={formData.height.feet}
                                onChange={onChange}
                                min="3"
                                max="8"
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                                placeholder="ft"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Inches</label>
                            <input
                                type="number"
                                name="height.inches"
                                value={formData.height.inches}
                                onChange={onChange}
                                min="0"
                                max="11"
                                className="w-full p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                                placeholder="in"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        />
                        <span className="text-xs text-gray-400 mt-1 block">(Leave blank if maintaining)</span>
                    </div>
                </div>

                {calculateBMI() && (
                    <div className="mt-4 p-3 bg-[rgba(20,20,20,0.7)] rounded-lg border border-[#333]">
                        <p className="text-sm">
                            Your BMI: <span className="text-[#FF6B00] font-bold">{calculateBMI()}</span>
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
