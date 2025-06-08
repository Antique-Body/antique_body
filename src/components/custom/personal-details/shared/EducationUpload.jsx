"use client";
import { Icon } from "@iconify/react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";

export const EducationUpload = ({
  educationFields,
  handleEducationChange,
  addEducationField,
  removeEducationField,
}) => (
  <div className="space-y-4">
    {/* Education Fields */}
    {educationFields.map((field, index) => (
      <div
        key={index}
        className="group relative bg-gradient-to-r from-[rgba(30,30,30,0.8)] to-[rgba(25,25,25,0.8)] border border-[#333] rounded-xl p-6 hover:border-[#FF6B00]/50 transition-all duration-300"
      >
        {/* Header with number and remove button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-[#FF6B00]">
                {index + 1}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-white font-medium">
                {field.institution || `Education ${index + 1}`}
              </h4>
            </div>
          </div>

          {educationFields.length > 1 && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => removeEducationField(index)}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <Icon
                icon="mdi:close"
                width={16}
                height={16}
                className="text-red-400"
              />
            </Button>
          )}
        </div>

        {/* Institution Input */}
        <div className="mb-4">
          <FormField
            label="Institution Name"
            type="text"
            value={field.institution || ""}
            onChange={(e) =>
              handleEducationChange(index, "institution", e.target.value)
            }
            placeholder="e.g. University of Sports Science, Fitness Academy"
            className="mb-0"
          />
        </div>

        {/* Degree and Field of Study */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Degree"
            type="text"
            value={field.degree || ""}
            onChange={(e) =>
              handleEducationChange(index, "degree", e.target.value)
            }
            placeholder="e.g. Bachelor's, Master's, Certificate"
            className="mb-0"
          />

          <FormField
            label="Field of Study"
            type="text"
            value={field.fieldOfStudy || ""}
            onChange={(e) =>
              handleEducationChange(index, "fieldOfStudy", e.target.value)
            }
            placeholder="e.g. Exercise Science, Nutrition, Physical Therapy"
            className="mb-0"
          />
        </div>

        {/* Years */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            label="Start Year"
            type="number"
            value={field.startYear || ""}
            onChange={(e) =>
              handleEducationChange(index, "startYear", e.target.value)
            }
            placeholder="e.g. 2015"
            className="mb-0"
          />

          <FormField
            label="End Year (or expected)"
            type="number"
            value={field.endYear || ""}
            onChange={(e) =>
              handleEducationChange(index, "endYear", e.target.value)
            }
            placeholder="e.g. 2019 (or leave blank if current)"
            className="mb-0"
          />
        </div>

        {/* Description */}
        <div className="mb-2">
          <FormField
            label="Description"
            type="textarea"
            value={field.description || ""}
            onChange={(e) =>
              handleEducationChange(index, "description", e.target.value)
            }
            placeholder="Briefly describe your studies, achievements, or relevant coursework..."
            rows={3}
            className="mb-0"
          />
        </div>
      </div>
    ))}

    {/* Add Education Button */}
    <Button
      variant="outline"
      type="button"
      onClick={addEducationField}
      className="w-full border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 rounded-xl p-6 flex items-center justify-center gap-3 text-gray-400 hover:text-[#FF6B00] transition-all duration-300 group"
    >
      <div className="w-10 h-10 bg-[#333] group-hover:bg-[#FF6B00]/20 rounded-lg flex items-center justify-center transition-colors">
        <Icon icon="mdi:plus" width={20} height={20} />
      </div>
      <span className="font-medium">Add Another Education</span>
    </Button>
  </div>
);
