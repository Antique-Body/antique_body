"use client";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";

const ALLOWED_CERT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_CERT_SIZE_MB = 1;

function validateCertFile(file) {
  if (!ALLOWED_CERT_TYPES.includes(file.type)) {
    return "Nedozvoljen format certifikata!";
  }
  if (file.size > MAX_CERT_SIZE_MB * 1024 * 1024) {
    return `Certifikat je prevelik! Maksimalna veličina je ${MAX_CERT_SIZE_MB}MB.`;
  }
  return null;
}

export const CertificationUpload = ({
  certFields,
  handleCertChange,
  addCertField,
  removeCertField,
}) => {
  // Za svaki certifikat držimo error i preview url
  const [certErrors, setCertErrors] = useState([]);
  const [certPreviews, setCertPreviews] = useState([]);

  useEffect(
    () =>
      // Cleanup URL.createObjectURL kad se komponenta unmounta ili file promijeni
      () => {
        certPreviews.forEach((url) => {
          if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      },
    [certPreviews]
  );

  const handleCertFileChange = (index, file) => {
    const error = validateCertFile(file);
    if (error) {
      setCertErrors((prev) => {
        const updated = [...prev];
        updated[index] = error;
        return updated;
      });
      return;
    }
    setCertErrors((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
    let url = "";
    if (file.type.startsWith("image/")) {
      url = URL.createObjectURL(file);
    }
    setCertPreviews((prev) => {
      const updated = [...prev];
      updated[index] = url;
      return updated;
    });
    handleCertChange(index, "file", file);
  };

  return (
    <div className="space-y-4">
      {certFields.map((field, index) => (
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
                  {field.name || `Certification ${index + 1}`}
                </h4>
              </div>
            </div>

            {certFields.length > 1 && (
              <Button
                variant="ghost"
                type="button"
                onClick={() => removeCertField(index)}
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
              value={field.name}
              onChange={(e) => handleCertChange(index, "name", e.target.value)}
              placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, ACSM, etc."
              className="mb-0"
            />
          </div>

          {/* Issuer/Trainer Name and Expiry Date */}
          {field.name && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Issued By (Organization/Trainer)"
                type="text"
                value={field.issuer || ""}
                onChange={(e) =>
                  handleCertChange(index, "issuer", e.target.value)
                }
                placeholder="e.g. National Academy of Sports Medicine, Personal Trainer Institute"
                className="mb-0"
              />

              <FormField
                label="Expiry Date"
                type="date"
                value={field.expiryDate || ""}
                onChange={(e) =>
                  handleCertChange(index, "expiryDate", e.target.value)
                }
                className="mb-0"
              />
            </div>
          )}

          {/* File Upload Section */}
          {field.name && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 text-sm font-medium">
                  Certificate Document
                </label>
              </div>

              <div className="border-2 border-dashed border-[#444] rounded-lg p-4 hover:border-[#FF6B00]/50 transition-colors">
                <div className="flex flex-col items-center gap-3">
                  {field.file && (
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
                          {field.file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          Click to replace
                        </p>
                      </div>
                    </div>
                  )}

                  <FormField
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      handleCertFileChange(index, file);
                    }}
                    id={`cert-upload-${index}`}
                    error={certErrors[index]}
                  />
                </div>
              </div>

              {/* Prikaz previewa slike/pdf-a ispod polja */}
              {certPreviews[index] &&
                field.file &&
                field.file.type.startsWith("image/") && (
                  <img
                    src={certPreviews[index]}
                    alt="Certifikat preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                )}
              {field.file && field.file.type === "application/pdf" && (
                <div
                  style={{ marginTop: 8, color: "#FF6B00", fontWeight: 500 }}
                >
                  PDF: {field.file.name}
                </div>
              )}
              {field.file && field.file.type === "application/msword" && (
                <div
                  style={{ marginTop: 8, color: "#FF6B00", fontWeight: 500 }}
                >
                  DOC: {field.file.name}
                </div>
              )}
              {field.file &&
                field.file.type ===
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                  <div
                    style={{ marginTop: 8, color: "#FF6B00", fontWeight: 500 }}
                  >
                    DOCX: {field.file.name}
                  </div>
                )}
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
