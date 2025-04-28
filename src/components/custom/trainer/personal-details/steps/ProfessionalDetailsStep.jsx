"use client";
import React from "react";
import { TextField } from "@/components/common";
import { FormCard } from "@/components/custom/FormCard";
import { useForm } from "react-hook-form";

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
            <FormCard title="Professional Information">
                <TextField
                    id="specialty"
                    name="specialty"
                    label="Primary Specialty"
                    placeholder="e.g. Strength & Conditioning Coach, Running Coach, etc."
                    register={register}
                    required
                    value={formData.specialty}
                    onChange={onChange}
                />

                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Certifications</label>
                    <p className="text-sm text-gray-400 mb-2">Add any professional certifications you hold</p>

                    {certFields.map((field) => (
                        <div key={field.id} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={field.value}
                                onChange={(e) => handleCertChange(field.id, e.target.value)}
                                className="flex-1 p-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white focus:outline-none focus:border-[#FF6B00] transition"
                                placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, etc."
                            />
                            <button
                                type="button"
                                onClick={() => removeCertField(field.id)}
                                className="p-3 rounded-lg bg-[#333] text-gray-300 hover:bg-[#444] transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addCertField}
                        className="mt-2 py-2 px-4 border border-[#FF6B00] rounded-lg text-[#FF6B00] hover:bg-[rgba(255,107,0,0.15)] transition-colors"
                    >
                        + Add Certification
                    </button>
                </div>
            </FormCard>
        </div>
    );
};
