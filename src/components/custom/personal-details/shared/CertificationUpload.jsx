"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
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
  // Za svaki certifikat držimo errors i preview urls
  const [certErrors, setCertErrors] = useState([]);
  const [certPreviews, setCertPreviews] = useState([]);

  useEffect(
    () =>
      // Cleanup URL.createObjectURL kad se komponenta unmounta ili file promijeni
      () => {
        certPreviews.forEach((previewArray) => {
          if (previewArray) {
            previewArray.forEach((url) => {
              if (url && url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
              }
            });
          }
        });
      },
    [certPreviews]
  );

  const handleCertFileChange = (index, files) => {
    // Convert FileList to Array if necessary
    const fileArray = Array.isArray(files) ? files : Array.from(files);

    // Validate each file
    const errors = fileArray.map(validateCertFile).filter(Boolean);

    if (errors.length > 0) {
      setCertErrors((prev) => {
        const updated = [...prev];
        updated[index] = errors.join(", ");
        return updated;
      });
      return;
    }

    setCertErrors((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });

    // Create preview URLs for image files
    const urls = fileArray.map((file) =>
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );

    setCertPreviews((prev) => {
      const updated = [...prev];
      updated[index] = urls;
      return updated;
    });

    // Update the file field in the form data
    handleCertChange(index, "files", fileArray);
  };

  // Enhanced version to clear errors when certificate is removed
  const handleRemoveCertField = (index) => {
    // Clear any errors for this certificate
    setCertErrors((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    // Clear any preview URLs for this certificate
    setCertPreviews((prev) => {
      const updated = [...prev];
      // Revoke the URLs to prevent memory leaks
      if (updated[index]) {
        updated[index].forEach((url) => {
          if (url && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }
      updated.splice(index, 1);
      return updated;
    });

    // Call the original removeCertField function
    removeCertField(index);
  };

  // Handle removal of a single file from multiple files
  const handleRemoveFile = (certIndex, fileIndex) => {
    // Get current files
    const currentFiles = certFields[certIndex].files || [];

    if (currentFiles.length <= fileIndex) return;

    // Create a new array without the removed file
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(fileIndex, 1);

    // Update previews
    setCertPreviews((prev) => {
      const updated = [...prev];
      if (updated[certIndex]) {
        // Revoke the URL to prevent memory leaks
        if (
          updated[certIndex][fileIndex] &&
          updated[certIndex][fileIndex].startsWith("blob:")
        ) {
          URL.revokeObjectURL(updated[certIndex][fileIndex]);
        }

        // Remove the preview
        updated[certIndex] = updated[certIndex].filter(
          (_, i) => i !== fileIndex
        );
      }
      return updated;
    });

    // Update the form data
    handleCertChange(certIndex, "files", updatedFiles);
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
                onClick={() => handleRemoveCertField(index)}
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
                  Certificate Documents
                </label>
                <span className="text-xs text-gray-500">
                  {field.files && field.files.length > 0
                    ? `${field.files.length} file${
                        field.files.length > 1 ? "s" : ""
                      } uploaded`
                    : "No files"}
                </span>
              </div>

              {/* File upload area */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col space-y-4">
                  {/* Upload area (always visible for multiple uploads) */}
                  <div
                    className="w-full p-6 border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                    onClick={() =>
                      document.getElementById(`cert-upload-${index}`).click()
                    }
                  >
                    <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mb-3">
                      <Icon
                        icon="mdi:cloud-upload"
                        width={24}
                        height={24}
                        className="text-[#FF6B00]"
                      />
                    </div>
                    <p className="text-gray-300 text-sm font-medium">
                      {field.files && field.files.length > 0
                        ? "Add more files"
                        : "Upload certificate documents"}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Maximum size: 1MB per file
                    </p>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      handleCertFileChange(index, files);
                    }}
                    id={`cert-upload-${index}`}
                    className="hidden"
                    multiple
                  />

                  {/* Error message */}
                  {certErrors[index] && (
                    <p className="text-red-500 text-xs mt-1">
                      {certErrors[index]}
                    </p>
                  )}

                  {/* File previews grid */}
                  {field.files && field.files.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {field.files.map((file, fileIndex) => (
                        <div key={fileIndex} className="relative group">
                          {/* Image files */}
                          {file.type.startsWith("image/") &&
                            certPreviews[index] &&
                            certPreviews[index][fileIndex] && (
                              <div className="relative h-32 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444] hover:border-[#FF6B00]/50 transition-all">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={certPreviews[index][fileIndex]}
                                    alt={`Certificate ${fileIndex + 1}`}
                                    fill
                                    style={{ objectFit: "contain" }}
                                  />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile(index, fileIndex);
                                  }}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Icon
                                    icon="mdi:close"
                                    width={14}
                                    height={14}
                                    className="text-white"
                                  />
                                </button>
                              </div>
                            )}

                          {/* Document files */}
                          {!file.type.startsWith("image/") && (
                            <div className="relative flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#FF6B00]/30 transition-all h-32">
                              <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon
                                  icon={
                                    file.type === "application/pdf"
                                      ? "mdi:file-pdf"
                                      : file.type.includes("word")
                                      ? "mdi:file-word"
                                      : "mdi:file-document"
                                  }
                                  width={20}
                                  height={20}
                                  className="text-[#FF6B00]"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                  {file.name}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {file.size < 1024
                                    ? `${file.size} B`
                                    : file.size < 1048576
                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                    : `${(file.size / 1048576).toFixed(1)} MB`}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile(index, fileIndex);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Icon
                                  icon="mdi:close"
                                  width={14}
                                  height={14}
                                  className="text-white"
                                />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
