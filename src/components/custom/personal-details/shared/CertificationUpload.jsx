"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";

export const CertificationUpload = ({
  certFields,
  handleCertChange,
  addCertField,
  removeCertField,
}) => {
  const [uploadStates, setUploadStates] = useState({});

  const handleFileUpload = (certId, file) => {
    if (file) {
      setUploadStates((prev) => ({
        ...prev,
        [certId]: {
          file: file,
          status: "pending",
          fileName: file.name,
        },
      }));
    }
  };

  return (
    <div className="space-y-4">
      {certFields.map((field, index) => (
        <div
          key={field.id}
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
                  {field.value || `Certification ${index + 1}`}
                </h4>
              </div>
            </div>

            {certFields.length > 1 && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => removeCertField(field.id)}
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

          {/* Certification Name Input */}
          <div className="mb-4">
            <FormField
              label="Certification Name"
              type="text"
              value={field.value}
              onChange={(e) => handleCertChange(field.id, e.target.value)}
              placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, ACSM, etc."
              className="mb-0"
            />
          </div>

          {/* Issuer/Trainer Name and Expiry Date */}
          {field.value && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Issued By (Organization/Trainer)"
                type="text"
                value={field.issuer || ""}
                onChange={(e) =>
                  handleCertChange(
                    field.id,
                    field.value,
                    "issuer",
                    e.target.value
                  )
                }
                placeholder="e.g. National Academy of Sports Medicine, Personal Trainer Institute"
                className="mb-0"
              />

              <FormField
                label="Expiry Date"
                type="date"
                value={field.expiryDate || ""}
                onChange={(e) =>
                  handleCertChange(
                    field.id,
                    field.value,
                    "expiryDate",
                    e.target.value
                  )
                }
                className="mb-0"
              />
            </div>
          )}

          {/* File Upload Section */}
          {field.value && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 text-sm font-medium">
                  Certificate Document
                </label>
              </div>

              <div className="border-2 border-dashed border-[#444] rounded-lg p-4 hover:border-[#FF6B00]/50 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  {uploadStates[field.id]?.fileName ? (
                    <div className="flex items-center gap-3 text-center">
                      <div className="w-10 h-10 bg-[#FF6B00]/20 rounded-lg flex items-center justify-center">
                        <Icon
                          icon="mdi:file-document"
                          width={20}
                          height={20}
                          className="text-[#FF6B00]"
                        />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {uploadStates[field.id].fileName}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Click to replace
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#333] rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon
                          icon="mdi:cloud-upload"
                          width={24}
                          height={24}
                          className="text-gray-400"
                        />
                      </div>
                      <p className="text-white text-sm font-medium mb-1">
                        Upload Certificate
                      </p>
                      <p className="text-gray-400 text-xs">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  )}

                  <FormField
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(field.id, e.target.files[0])
                    }
                    id={`cert-upload-${field.id}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Certification Button */}
      <Button
        variant="outline"
        type="button"
        onClick={addCertField}
        className="w-full border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 rounded-xl p-6 flex items-center justify-center gap-3 text-gray-400 hover:text-[#FF6B00] transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-[#333] group-hover:bg-[#FF6B00]/20 rounded-lg flex items-center justify-center transition-colors">
          <Icon icon="mdi:plus" width={20} height={20} />
        </div>
        <span className="font-medium">Add Another Certification</span>
      </Button>
    </div>
  );
};
