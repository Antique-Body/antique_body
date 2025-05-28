"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { FormSection } from "../shared";

import { FormField } from "@/components/common";

const commonConditions = [
  { id: "high_blood_pressure", label: "High Blood Pressure" },
  { id: "diabetes", label: "Diabetes" },
  { id: "heart_condition", label: "Heart Condition" },
  { id: "asthma", label: "Asthma" },
  { id: "arthritis", label: "Arthritis" },
  { id: "back_problems", label: "Back Problems" },
  { id: "knee_problems", label: "Knee Problems" },
  { id: "shoulder_problems", label: "Shoulder Problems" },
  { id: "pregnancy", label: "Pregnancy" },
  { id: "recent_surgery", label: "Recent Surgery" },
];

const injuryTypes = [
  { id: "lower_back", label: "Lower Back", icon: "mdi:human-male-board" },
  { id: "knee", label: "Knee", icon: "mdi:bone" },
  { id: "shoulder", label: "Shoulder", icon: "mdi:human-handsup" },
  { id: "ankle", label: "Ankle", icon: "mdi:foot-print" },
  { id: "wrist", label: "Wrist", icon: "mdi:hand-right" },
  { id: "neck", label: "Neck", icon: "mdi:head-outline" },
  { id: "hip", label: "Hip", icon: "mdi:human" },
  { id: "elbow", label: "Elbow", icon: "mdi:arm-flex-outline" },
];

export const HealthInfoStep = ({ formData, onChange, errors }) => {
  const [showMedicalConditions, setShowMedicalConditions] = useState(false);

  const handleConditionToggle = (conditionId) => {
    const currentConditions = formData.medicalConditions || [];
    const newConditions = currentConditions.includes(conditionId)
      ? currentConditions.filter((id) => id !== conditionId)
      : [...currentConditions, conditionId];

    onChange({
      target: {
        name: "medicalConditions",
        value: newConditions,
      },
    });
  };

  const handleInjuryToggle = (injuryId) => {
    const currentInjuries = formData.currentInjuries || [];
    const newInjuries = currentInjuries.includes(injuryId)
      ? currentInjuries.filter((id) => id !== injuryId)
      : [...currentInjuries, injuryId];

    onChange({
      target: {
        name: "currentInjuries",
        value: newInjuries,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Health Status */}
      <FormSection
        title="Health Status"
        description="Help trainers create safe and effective programs for you"
        icon={<Icon icon="mdi:heart-pulse" width={20} height={20} />}
      >
        <div className="space-y-4">
          <FormField
            label="Have you been medically cleared for exercise by a doctor?"
            name="medicalClearance"
            type="select"
            value={formData.medicalClearance}
            onChange={onChange}
            error={errors.medicalClearance}
            options={[
              { value: "", label: "Please select" },
              { value: "yes", label: "Yes, I've been cleared" },
              { value: "no", label: "No, I haven't been cleared" },
              {
                value: "not_required",
                label: "Not required (under 40, no conditions)",
              },
            ]}
          />

          <div className="flex items-center justify-between p-4 bg-[rgba(30,30,30,0.5)] border border-[#333] rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                Do you have any medical conditions?
              </h4>
              <p className="text-sm text-gray-400">
                Select any that apply to you
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMedicalConditions(!showMedicalConditions)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] hover:bg-[#FF6B00]/30 transition-colors"
            >
              <span className="text-sm font-medium">
                {showMedicalConditions ? "Hide" : "Show"} Conditions
              </span>
              <Icon
                icon={
                  showMedicalConditions ? "mdi:chevron-up" : "mdi:chevron-down"
                }
                width={16}
                height={16}
              />
            </button>
          </div>

          {showMedicalConditions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {commonConditions.map((condition) => {
                const isSelected = (formData.medicalConditions || []).includes(
                  condition.id
                );

                return (
                  <button
                    key={condition.id}
                    type="button"
                    onClick={() => handleConditionToggle(condition.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/10 text-orange-400"
                        : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {condition.label}
                      </span>
                      {isSelected && (
                        <Icon
                          icon="mdi:check"
                          width={16}
                          height={16}
                          className="text-orange-400"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {(formData.medicalConditions || []).length > 0 && (
            <FormField
              label="Additional Details (Optional)"
              name="medicalDetails"
              type="textarea"
              value={formData.medicalDetails}
              onChange={onChange}
              placeholder="Please provide any additional details about your medical conditions that might be relevant for training..."
              rows={3}
            />
          )}
        </div>
      </FormSection>

      {/* Current Injuries */}
      <FormSection
        title="Current Injuries or Limitations"
        description="Help us avoid exercises that might aggravate existing issues"
        icon={<Icon icon="mdi:bandage" width={20} height={20} />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {injuryTypes.map((injury) => {
              const isSelected = (formData.currentInjuries || []).includes(
                injury.id
              );

              return (
                <button
                  key={injury.id}
                  type="button"
                  onClick={() => handleInjuryToggle(injury.id)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-[#333] bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444]"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Icon
                      icon={injury.icon}
                      width={24}
                      height={24}
                      className={isSelected ? "text-red-400" : "text-gray-400"}
                    />
                    <span className="text-sm font-medium">{injury.label}</span>
                    {isSelected && (
                      <Icon
                        icon="mdi:alert"
                        width={14}
                        height={14}
                        className="text-red-400"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {(formData.currentInjuries || []).length > 0 && (
            <FormField
              label="Injury Details"
              name="injuryDetails"
              type="textarea"
              value={formData.injuryDetails}
              onChange={onChange}
              placeholder="Please describe your injuries, when they occurred, and any limitations they cause..."
              rows={3}
            />
          )}

          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                width={20}
                height={20}
                className="text-blue-400 mt-0.5"
              />
              <div>
                <h4 className="text-blue-400 font-medium mb-1">
                  Important Note
                </h4>
                <p className="text-sm text-gray-300">
                  If you have any serious medical conditions or recent injuries,
                  we strongly recommend consulting with your healthcare provider
                  before starting any exercise program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormSection>
    </div>
  );
};
