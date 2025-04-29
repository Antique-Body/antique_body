"use client";
import { TextField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { FormCard } from "@/components/custom/FormCard";
import { FormField } from "@/components/shared";
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

                    {certFields.map(field => (
                        <div key={field.id} className="flex gap-2 mb-2">
                            <FormField
                                type="text"
                                value={field.value}
                                onChange={e => handleCertChange(field.id, e.target.value)}
                                className="flex-1"
                                placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, etc."
                            />
                            <Button variant="ghost" onClick={() => removeCertField(field.id)} size="small">
                                <CloseXIcon size={16} />
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" onClick={addCertField} size="default">
                        + Add Certification
                    </Button>
                </div>
            </FormCard>
        </div>
    );
};
