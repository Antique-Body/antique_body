"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { Tooltip } from "@/components/common/Tooltip";
import { useCertificateFiles } from "@/hooks";

// Status messages for tooltips
const STATUS_MESSAGES = {
  pending:
    "Our Antique Body team is reviewing your certification. This typically takes 1-2 business days.",
  accepted: "Your certification has been verified and approved by our team.",
  rejected:
    "Your certification was not approved. Please check the requirements and upload a valid certificate.",
  expired:
    "This certification has expired. Please update with a current version.",
};

// Status icons mapping
const STATUS_ICONS = {
  pending: "mdi:clock-outline",
  accepted: "mdi:check-circle",
  rejected: "mdi:close-circle",
  expired: "mdi:clock-alert",
};

// Status colors mapping
const STATUS_COLORS = {
  pending: {
    text: "text-yellow-500",
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
  },
  accepted: {
    text: "text-green-500",
    bg: "bg-green-500/20",
    border: "border-green-500/30",
  },
  rejected: {
    text: "text-red-500",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
  },
  expired: {
    text: "text-orange-500",
    bg: "bg-orange-500/20",
    border: "border-orange-500/30",
  },
};

export const CertificationUpload = ({
  certFields,
  handleCertChange,
  addCertField,
  removeCertField,
  handleRemoveDocument: externalRemoveDocument,
}) => {
  const {
    previews,
    errors,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveCertField: removeCertFieldWithCleanup,
  } = useCertificateFiles(certFields, handleCertChange, removeCertField);

  // For handling pre-existing document previews
  const [documentPreviews, setDocumentPreviews] = useState({});
  const [uploadError, setUploadError] = useState(null);

  // Reset upload error when certFields changes
  useEffect(() => {
    setUploadError(null);
  }, [certFields]);

  // Generate previews for existing documents when component mounts or certFields changes
  useEffect(() => {
    const loadExistingDocumentPreviews = () => {
      try {
        if (!certFields || !Array.isArray(certFields)) return;

        const newPreviews = {};

        certFields.forEach((field, index) => {
          if (
            field?.documents &&
            Array.isArray(field.documents) &&
            field.documents.length > 0
          ) {
            newPreviews[index] = {};

            field.documents.forEach((doc, docIndex) => {
              // Check if it's an image URL
              if (
                doc?.url &&
                (doc.url.endsWith(".jpg") ||
                  doc.url.endsWith(".jpeg") ||
                  doc.url.endsWith(".png") ||
                  doc.url.endsWith(".gif"))
              ) {
                newPreviews[index][docIndex] = doc.url;
              }
            });
          }
        });

        setDocumentPreviews(newPreviews);
      } catch (error) {
        console.error("Error loading document previews:", error);
      }
    };

    loadExistingDocumentPreviews();
  }, [certFields]);

  // Function to safely handle file input changes
  const handleFileInputChange = useCallback(
    (index, event) => {
      try {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        handleAddFiles(index, files);

        // Reset file input to allow selecting the same file again
        event.target.value = "";
      } catch (error) {
        console.error("Error handling file input change:", error);
        setUploadError(`Error uploading files: ${error.message}`);
      }
    },
    [handleAddFiles]
  );

  // Function to remove a document from documents array
  const handleRemoveDocument = useCallback(
    (certIndex, docIndex) => {
      try {
        const currentDocs = certFields[certIndex]?.documents || [];
        if (currentDocs.length <= docIndex) return;

        const updatedDocs = [...currentDocs];
        updatedDocs.splice(docIndex, 1);

        handleCertChange(certIndex, "documents", updatedDocs);

        // Update document previews
        setDocumentPreviews((prev) => {
          const updated = { ...prev };
          if (updated[certIndex]) {
            const newPreviewsForCert = { ...updated[certIndex] };
            delete newPreviewsForCert[docIndex];

            // Reindex the remaining previews
            const reindexed = {};
            Object.entries(newPreviewsForCert).forEach(([_, value], idx) => {
              reindexed[idx] = value;
            });

            updated[certIndex] = reindexed;
          }
          return updated;
        });
      } catch (error) {
        console.error("Error removing document:", error);
      }
    },
    [certFields, handleCertChange]
  );

  // Get document file type icon based on file extension
  const getDocumentIcon = useCallback((url = "") => {
    if (!url) return "mdi:file-document";
    if (url.endsWith(".pdf")) return "mdi:file-pdf";
    if (url.endsWith(".doc") || url.endsWith(".docx")) return "mdi:file-word";
    if (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".gif")
    )
      return "mdi:file-image";
    return "mdi:file-document";
  }, []);

  // Function to get file name from URL
  const getFileNameFromUrl = useCallback((url = "") => {
    if (!url) return "Document";
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    // Remove any query parameters
    return fileName.split("?")[0];
  }, []);

  return (
    <div className="space-y-4">
      {/* Global error message */}
      {uploadError && (
        <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {uploadError}
          <button
            onClick={() => setUploadError(null)}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {certFields &&
        Array.isArray(certFields) &&
        certFields.map((field, index) => (
          <div
            key={`cert-field-${index}`}
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
                    {field?.name || `Certification ${index + 1}`}
                  </h4>
                  {/* Status indicator with tooltip */}
                  {field?.status && (
                    <Tooltip
                      content={
                        STATUS_MESSAGES[field.status] || "Status information"
                      }
                      position="bottom"
                      width="max-w-xs"
                    >
                      <div
                        className={`flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full ${
                          STATUS_COLORS[field.status]?.bg || "bg-gray-800"
                        } ${
                          STATUS_COLORS[field.status]?.border ||
                          "border-gray-700"
                        } border w-fit cursor-help transition-all duration-200 hover:brightness-110`}
                      >
                        <Icon
                          icon={
                            STATUS_ICONS[field.status] ||
                            "mdi:information-outline"
                          }
                          className={
                            STATUS_COLORS[field.status]?.text || "text-gray-400"
                          }
                          width={14}
                          height={14}
                        />
                        <span
                          className={`text-xs font-medium capitalize ${
                            STATUS_COLORS[field.status]?.text || "text-gray-400"
                          }`}
                        >
                          {field.status}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>

              {certFields.length > 1 && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => removeCertFieldWithCleanup(index)}
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
                value={field?.name || ""}
                onChange={(e) =>
                  handleCertChange(index, "name", e.target.value)
                }
                placeholder="e.g. NASM-CPT, ACE-CPT, ISSA, ACSM, etc."
                className="mb-0"
              />
            </div>

            {/* Issuer/Trainer Name and Expiry Date */}
            {field?.name && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  label="Issued By (Organization/Trainer)"
                  type="text"
                  value={field?.issuer || ""}
                  onChange={(e) =>
                    handleCertChange(index, "issuer", e.target.value)
                  }
                  placeholder="e.g. National Academy of Sports Medicine, Personal Trainer Institute"
                  className="mb-0"
                />

                <FormField
                  label="Expiry Date"
                  type="date"
                  value={field?.expiryDate || ""}
                  onChange={(e) =>
                    handleCertChange(index, "expiryDate", e.target.value)
                  }
                  className="mb-0"
                />
              </div>
            )}

            {/* File Upload Section */}
            {field?.name && (
              <div className="space-y-3">
                {/* Label with file count */}
                <div className="flex items-center justify-between">
                  <label className="block text-gray-300 text-sm font-medium">
                    Certificate Documents
                  </label>
                  <span className="text-xs text-gray-500">
                    {((field?.documents && field.documents.length) || 0) +
                      ((field?.files && field.files.length) || 0)}{" "}
                    file(s)
                  </span>
                </div>

                {/* Existing documents from database */}
                {field?.documents && field.documents.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {field.documents.map((doc, docIndex) => (
                      <div
                        key={`saved-${index}-${docIndex}`}
                        className="relative group"
                      >
                        {/* Image files */}
                        {doc?.url &&
                          (doc.url.endsWith(".jpg") ||
                            doc.url.endsWith(".jpeg") ||
                            doc.url.endsWith(".png") ||
                            doc.url.endsWith(".gif")) &&
                          documentPreviews[index] &&
                          documentPreviews[index][docIndex] && (
                            <div className="relative h-32 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444] hover:border-[#FF6B00]/50 transition-all">
                              <div className="relative w-full h-full">
                                <Image
                                  src={documentPreviews[index][docIndex]}
                                  alt={`Certificate ${docIndex + 1}`}
                                  fill
                                  style={{ objectFit: "contain" }}
                                  unoptimized={true}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (externalRemoveDocument) {
                                    externalRemoveDocument(index, docIndex);
                                  } else {
                                    handleRemoveDocument(index, docIndex);
                                  }
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

                        {/* Document files (non-image) */}
                        {doc?.url &&
                          !(
                            doc.url.endsWith(".jpg") ||
                            doc.url.endsWith(".jpeg") ||
                            doc.url.endsWith(".png") ||
                            doc.url.endsWith(".gif")
                          ) && (
                            <div className="relative flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#FF6B00]/30 transition-all h-32">
                              <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon
                                  icon={getDocumentIcon(doc.url)}
                                  width={20}
                                  height={20}
                                  className="text-[#FF6B00]"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white text-sm font-medium truncate hover:text-blue-400 transition-colors"
                                >
                                  {doc.originalName ||
                                    getFileNameFromUrl(doc.url)}
                                </a>
                                <p className="text-gray-400 text-xs">
                                  Saved document
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (externalRemoveDocument) {
                                    externalRemoveDocument(index, docIndex);
                                  } else {
                                    handleRemoveDocument(index, docIndex);
                                  }
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

                {/* Upload area */}
                <div
                  className="w-full p-6 border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                  onClick={() => {
                    const inputEl = document.getElementById(
                      `cert-upload-${index}`
                    );
                    if (inputEl) inputEl.click();
                  }}
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
                    {(field?.files && field.files.length > 0) ||
                    (field?.documents && field.documents.length > 0)
                      ? "Add more files"
                      : "Upload certificate documents"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Supported: PDF, JPG, PNG, DOCX (max 1MB)
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  onChange={(e) => handleFileInputChange(index, e)}
                  id={`cert-upload-${index}`}
                  className="hidden"
                  multiple
                />

                {/* Error message */}
                {errors && errors[index] && (
                  <p className="text-red-500 text-xs mt-1">{errors[index]}</p>
                )}

                {/* File previews grid for newly uploaded files */}
                {field?.files && field.files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {field.files.map((file, fileIndex) => (
                      <div
                        key={`new-${index}-${fileIndex}`}
                        className="relative group"
                      >
                        {/* Image files */}
                        {file?.type &&
                          file.type.startsWith("image/") &&
                          previews &&
                          previews[index] &&
                          previews[index][fileIndex] && (
                            <div className="relative h-32 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444] hover:border-[#FF6B00]/50 transition-all">
                              <div className="relative w-full h-full">
                                <Image
                                  src={previews[index][fileIndex]}
                                  alt={`Certificate ${fileIndex + 1}`}
                                  fill
                                  style={{ objectFit: "contain" }}
                                  unoptimized={true}
                                />
                              </div>
                              <div className="absolute top-0 left-0 bg-green-500/90 text-white text-xs py-0.5 px-2 rounded-br">
                                New
                              </div>
                              <button
                                type="button"
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
                        {(!file?.type || !file.type.startsWith("image/")) && (
                          <div className="relative flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#FF6B00]/30 transition-all h-32">
                            <div className="w-10 h-10 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon
                                icon={
                                  file?.type === "application/pdf"
                                    ? "mdi:file-pdf"
                                    : file?.type && file.type.includes("word")
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
                                {file?.name || "Unknown file"}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {file?.size
                                  ? file.size < 1024
                                    ? `${file.size} B`
                                    : file.size < 1048576
                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                    : `${(file.size / 1048576).toFixed(1)} MB`
                                  : "Unknown size"}
                              </p>
                            </div>
                            <div className="absolute top-0 left-0 bg-green-500/90 text-white text-xs py-0.5 px-2 rounded-br">
                              New
                            </div>
                            <button
                              type="button"
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
