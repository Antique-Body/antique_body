"use client";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const ProfessionalDetailsStep = ({
  formData,
  onChange,
  certFields,
  handleCertChange,
  addCertField,
  removeCertField,
}) => {
  const { register } = useForm({
    defaultValues: {
      specialty: formData.specialty,
    },
  });

  return (
    <div className="space-y-6">
      {/* Professional Specialty */}
      <Card variant="darkStrong" className="!w-full p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Professional Specialty
        </h3>

        <div className="rounded-lg bg-[#171717] p-5">
          <FormField
            id="specialty"
            name="specialty"
            label="Primary Specialty"
            placeholder="e.g. Strength & Conditioning Coach, Running Coach, etc."
            register={register}
            required
            value={formData.specialty}
            onChange={onChange}
            className="mb-0"
          />
        </div>
      </Card>

      {/* Certifications */}
      <Card variant="darkStrong" className="!w-full p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Certifications{" "}
          <span className="text-sm font-normal text-gray-400">(Optional)</span>
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Add your professional certifications to build credibility with
          potential clients
        </p>

        <div className="space-y-4 rounded-lg bg-[#171717] p-5">
          {certFields.map((field) => (
            <div
              key={field.id}
              className="bg-[#1a1a1a] border border-[#333] rounded-md p-4 mb-4 flex flex-col md:flex-row md:items-center md:gap-6 hover:border-[#444] transition-colors"
            >
              {/* Left: Certification Name */}
              <div className="flex-1 mb-3 md:mb-0">
                <FormField
                  type="text"
                  value={field.value}
                  onChange={(e) => handleCertChange(field.id, e.target.value)}
                  className="w-full mb-0"
                  label="Certification Name"
                  placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, etc."
                />
              </div>
              {/* Right: Upload + Remove */}
              <div className="flex flex-col items-end w-full md:w-[320px] gap-1">
                <div className="flex items-center w-full gap-2">
                  <FormField
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleCertChange(field.id, field.value, file);
                    }}
                    className="w-full mb-0"
                    label="Upload Certificate"
                    subLabel="PDF or image file"
                  />
                  <button
                    type="button"
                    onClick={() => removeCertField(field.id)}
                    className="text-gray-400 hover:text-red-500 mt-6 md:mt-8 transition-colors"
                    aria-label="Remove certification"
                  >
                    <CloseXIcon size={16} />
                  </button>
                </div>
                {field.file && (
                  <span className="block text-xs text-gray-400 truncate mt-1 max-w-full text-right">
                    {field.file.name}
                  </span>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addCertField}
            size="default"
            className="w-full md:w-auto bg-[#232323] hover:bg-[#2a2a2a] border-[#333] text-gray-300 hover:text-white transition-colors"
          >
            + Add Certification
          </Button>

          <p className="text-xs text-gray-500 mt-3">
            Tip: Certified trainers typically receive more client inquiries
          </p>
        </div>
      </Card>
    </div>
  );
};
