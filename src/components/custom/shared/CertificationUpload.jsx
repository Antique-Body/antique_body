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
  handleRemoveDocument: _externalRemoveDocument,
  onDeleteCert: _onDeleteCert,
  onResetCertifications,
  initialCertifications,
  isRegistration = false,
}) => {
  const {
    previews,
    errors,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveCertField: removeCertFieldWithCleanup,
  } = useCertificateFiles(certFields, handleCertChange, removeCertField);

  const [documentPreviews, setDocumentPreviews] = useState({});
  const [uploadError, setUploadError] = useState(null);

  // Helper funkcija za deep compare SAMO postojećih certifikata (iz baze)
  const isCertsModified = () => {
    if (!initialCertifications) return false;
    // Uspoređujemo samo certifikate koji imaju id (postojeći iz baze)
    const existingCurrent = certFields.filter((c) => c.id);
    const existingInitial = initialCertifications.filter((c) => c.id);

    // Ako je broj različit, nešto je obrisano/dodano
    if (existingCurrent.length !== existingInitial.length) return true;

    // Provjeri je li neki od postojećih certifikata promijenjen (npr. hidden ili obrisan)
    for (let i = 0; i < existingInitial.length; i++) {
      const a = existingCurrent[i];
      const b = existingInitial[i];
      if (!a || !b) return true;
      const aExpiry = a.expiryDate ? a.expiryDate.slice(0, 10) : "";
      const bExpiry = b.expiryDate ? b.expiryDate.slice(0, 10) : "";
      if (
        a.id !== b.id ||
        a.name !== b.name ||
        a.issuer !== b.issuer ||
        aExpiry !== bExpiry ||
        a.status !== b.status ||
        (a.hidden || false) !== (b.hidden || b.hidden || false)
      ) {
        return true;
      }
    }
    return false;
  };

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
        event.target.value = "";
      } catch (error) {
        console.error("Error handling file input change:", error);
        setUploadError(`Error uploading files: ${error.message}`);
      }
    },
    [handleAddFiles]
  );

  // Hide cert (set hidden to true locally)
  const handleHideCert = (index) => {
    handleCertChange(index, "hidden", true);
  };

  // Unhide cert (set hidden to false locally)
  const handleUnhideCert = (index) => {
    handleCertChange(index, "hidden", false);
  };

  // Delete cert (calls external handler or removes from list)
  const handleDeleteCert = (index) => {
    removeCertField(index);
  };

  // Split certs: existing (readonly) vs new (editable)
  const existingCerts = certFields
    .map((field, idx) => ({ ...field, _idx: idx }))
    .filter((field) => field.id);
  const newCerts = certFields
    .map((field, idx) => ({ ...field, _idx: idx }))
    .filter((field) => !field.id);

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
  const _getFileNameFromUrl = useCallback((url = "") => {
    if (!url) return "Document";
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    // Remove any query parameters
    return fileName.split("?")[0];
  }, []);

  return (
    <div className="space-y-6">
      {/* Reset Certifications Bar - appears only if not registration and ima modificiranih certifikata */}
      {!isRegistration && isCertsModified() && (
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Icon
              icon="mdi:information-outline"
              className="text-blue-400 mr-2"
              width={20}
              height={20}
            />
            <span className="text-blue-300 text-sm">
              You have pending changes to your certifications.
            </span>
          </div>
          <Button
            variant="outline"
            type="button"
            onClick={onResetCertifications}
            className="text-xs bg-blue-800/30 border border-blue-500/50 hover:bg-blue-700/50 text-blue-300"
          >
            <Icon icon="mdi:refresh" className="mr-1" width={14} height={14} />
            Reset Certifications
          </Button>
        </div>
      )}

      {/* Existing certifications (readonly) - more compact design */}
      {existingCerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Your Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {existingCerts.map((field) => (
              <div
                key={`readonly-cert-${field._idx}`}
                className={`relative bg-gradient-to-r from-[rgba(30,30,30,0.8)] to-[rgba(25,25,25,0.8)] border rounded-xl p-4 transition-all duration-300 ${
                  field.hidden
                    ? "opacity-60 border-gray-700/50"
                    : "border-[#333] hover:border-[#FF6B00]/30"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-col">
                    <div className="text-gray-400 text-xs mb-1">
                      Certification Name:
                    </div>
                    <h4 className="text-white text-sm font-medium">
                      {field.name}
                    </h4>

                    {field.status && (
                      <Tooltip
                        content={
                          STATUS_MESSAGES[field.status] || "Status information"
                        }
                        position="bottom"
                        width="max-w-xs"
                      >
                        <div
                          className={`flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded-full ${
                            STATUS_COLORS[field.status]?.bg || "bg-gray-800"
                          } ${
                            STATUS_COLORS[field.status]?.border ||
                            "border-gray-700"
                          } border w-fit transition-all duration-200 hover:brightness-110`}
                        >
                          <Icon
                            icon={
                              STATUS_ICONS[field.status] ||
                              "mdi:information-outline"
                            }
                            className={
                              STATUS_COLORS[field.status]?.text ||
                              "text-gray-400"
                            }
                            width={12}
                            height={12}
                          />
                          <span
                            className={`text-xs font-medium capitalize ${
                              STATUS_COLORS[field.status]?.text ||
                              "text-gray-400"
                            }`}
                          >
                            {field.status}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => handleDeleteCert(field._idx)}
                      className="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full flex items-center justify-center"
                    >
                      <Icon
                        icon="mdi:delete"
                        width={14}
                        height={14}
                        className="text-red-400"
                      />
                    </Button>
                    {!field.hidden && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleHideCert(field._idx)}
                        className="w-6 h-6 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-full flex items-center justify-center"
                      >
                        <Icon
                          icon="mdi:eye-off"
                          width={14}
                          height={14}
                          className="text-gray-400"
                        />
                      </Button>
                    )}
                    {field.hidden && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleUnhideCert(field._idx)}
                        className="w-6 h-6 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-full flex items-center justify-center"
                      >
                        <Icon
                          icon="mdi:eye"
                          width={14}
                          height={14}
                          className="text-green-400"
                        />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Compact info layout */}
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div>
                    <div className="text-gray-400 font-medium">Issued By:</div>
                    <div className="text-white">{field.issuer || "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">
                      Expiry Date:
                    </div>
                    <div className="text-white">{field.expiryDate || "-"}</div>
                  </div>
                </div>

                {/* Documents compact gallery */}
                {field.documents && field.documents.length > 0 && (
                  <div>
                    <div className="text-gray-400 text-xs font-medium mb-1">
                      Documents ({field.documents.length}):
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 max-h-16">
                      {field.documents.map((doc, docIndex) => (
                        <div
                          key={`readonly-doc-${field._idx}-${docIndex}`}
                          className="relative group flex-shrink-0"
                        >
                          {/* Image files */}
                          {doc?.url &&
                            (doc.url.endsWith(".jpg") ||
                              doc.url.endsWith(".jpeg") ||
                              doc.url.endsWith(".png") ||
                              doc.url.endsWith(".gif")) &&
                            documentPreviews[field._idx] &&
                            documentPreviews[field._idx][docIndex] && (
                              <div className="relative h-14 w-14 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444]">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={documentPreviews[field._idx][docIndex]}
                                    alt={`Certificate ${docIndex + 1}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    unoptimized={true}
                                  />
                                </div>
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
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex items-center justify-center h-14 w-14 bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#FF6B00]/30 transition-all"
                              >
                                <Icon
                                  icon={getDocumentIcon(doc.url)}
                                  width={20}
                                  height={20}
                                  className="text-[#FF6B00]"
                                />
                              </a>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New certifications (editable) */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Add New Certification
        </h3>
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
        {newCerts.length === 0 && (
          <div className="text-gray-400 text-sm mb-4">
            No new certifications being added.
          </div>
        )}
        {newCerts.map((field) => (
          <div
            key={`cert-field-new-${field._idx}`}
            className="group relative bg-gradient-to-r from-[rgba(30,30,30,0.8)] to-[rgba(25,25,25,0.8)] border border-[#333] rounded-xl p-6 hover:border-[#FF6B00]/50 transition-all duration-300 mb-4"
          >
            {/* Header with number and remove button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#FF6B00]">
                    {field._idx + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="text-white font-medium">
                    {field?.name || `Certification ${field._idx + 1}`}
                  </h4>
                </div>
              </div>
              {/* Gumb za brisanje je uvijek vidljiv */}
              <Button
                variant="ghost"
                type="button"
                onClick={() => removeCertFieldWithCleanup(field._idx)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-full flex items-center justify-center transition-all duration-200"
              >
                <Icon
                  icon="mdi:close"
                  width={16}
                  height={16}
                  className="text-red-400"
                />
              </Button>
            </div>
            {/* Certification Name Input */}
            <div className="mb-4">
              <FormField
                label="Certification Name"
                type="text"
                value={field?.name || ""}
                onChange={(e) =>
                  handleCertChange(field._idx, "name", e.target.value)
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
                    handleCertChange(field._idx, "issuer", e.target.value)
                  }
                  placeholder="e.g. National Academy of Sports Medicine, Personal Trainer Institute"
                  className="mb-0"
                />
                <FormField
                  label="Expiry Date"
                  type="date"
                  value={field?.expiryDate || ""}
                  onChange={(e) =>
                    handleCertChange(field._idx, "expiryDate", e.target.value)
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
                {/* Upload area */}
                <div
                  className="w-full p-6 border-2 border-dashed border-[#444] hover:border-[#FF6B00]/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                  onClick={() => {
                    const inputEl = document.getElementById(
                      `cert-upload-${field._idx}`
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
                  onChange={(e) => handleFileInputChange(field._idx, e)}
                  id={`cert-upload-${field._idx}`}
                  className="hidden"
                  multiple
                />
                {/* Error message */}
                {errors && errors[field._idx] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field._idx]}
                  </p>
                )}
                {/* File previews grid for newly uploaded files */}
                {field?.files && field.files.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {field.files.map((file, fileIndex) => (
                      <div
                        key={`new-${field._idx}-${fileIndex}`}
                        className="relative group"
                      >
                        {/* Image files */}
                        {file?.type &&
                          file.type.startsWith("image/") &&
                          previews &&
                          previews[field._idx] &&
                          previews[field._idx][fileIndex] && (
                            <div className="relative h-32 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444] hover:border-[#FF6B00]/50 transition-all">
                              <div className="relative w-full h-full">
                                <Image
                                  src={previews[field._idx][fileIndex]}
                                  alt={`Certificate ${fileIndex + 1}`}
                                  fill
                                  style={{ objectFit: "contain" }}
                                  unoptimized={true}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveFile(field._idx, fileIndex);
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
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(field._idx, fileIndex);
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
    </div>
  );
};
