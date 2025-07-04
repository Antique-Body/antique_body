"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { FormField, Button } from "@/components/common";
import { useCertificateFiles } from "@/hooks";

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
  certFields = [],
  handleCertChange,
  addCertField,
  removeCertField,
  handleRemoveDocument: _externalRemoveDocument,
  onDeleteCert: _onDeleteCert,
}) => {
  // Ensure certFields is always an array
  const safeCertFields = Array.isArray(certFields) ? certFields : [];

  const {
    previews,
    errors,
    handleAddFiles,
    handleRemoveFile,
    handleRemoveCertField: removeCertFieldWithCleanup,
  } = useCertificateFiles(safeCertFields, handleCertChange, removeCertField);

  const [documentPreviews, setDocumentPreviews] = useState({});
  const [uploadError, setUploadError] = useState(null);

  // Reset upload error when certFields changes
  useEffect(() => {
    setUploadError(null);
  }, [safeCertFields]);

  // Generate previews for existing documents when component mounts or certFields changes
  useEffect(() => {
    const loadExistingDocumentPreviews = () => {
      try {
        if (!safeCertFields || !Array.isArray(safeCertFields)) return;
        const newPreviews = {};
        safeCertFields.forEach((field, index) => {
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
  }, [safeCertFields]);

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
    if (handleCertChange) {
      handleCertChange(index, "hidden", true);
    }
  };

  // Unhide cert (set hidden to false locally)
  const handleUnhideCert = (index) => {
    if (handleCertChange) {
      handleCertChange(index, "hidden", false);
    }
  };

  // Delete cert (calls external handler or removes from list)
  const handleDeleteCert = (index) => {
    if (removeCertField) {
      removeCertField(index);
    }
  };

  // Split certs: existing (readonly) vs new (editable)
  const existingCerts = safeCertFields
    .map((field, idx) => ({ ...field, _idx: idx }))
    .filter((field) => field.id);
  const newCerts = safeCertFields
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

  return (
    <div className="space-y-6">
      {/* Existing certifications (table/list view) */}
      {existingCerts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Your Certifications
          </h3>

          <div className="overflow-hidden rounded-xl border border-[#333] bg-[#1a1a1a]/60 backdrop-blur-sm">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b border-[#333] bg-[#222]/80">
              <div className="md:col-span-3">
                <span className="text-xs font-medium text-gray-400">
                  CERTIFICATION
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-medium text-gray-400">
                  ISSUER
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-medium text-gray-400">
                  EXPIRY
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-xs font-medium text-gray-400">
                  STATUS
                </span>
              </div>
              <div className="md:col-span-3 text-right">
                <span className="text-xs font-medium text-gray-400">
                  ACTIONS
                </span>
              </div>
            </div>

            {/* Certification Items */}
            <div className="divide-y divide-[#333]">
              {existingCerts.map((field) => (
                <div
                  key={`readonly-cert-${field._idx}`}
                  className={`p-4 hover:bg-[#222]/50 transition-colors duration-200 ${
                    field.hidden ? "opacity-60" : ""
                  }`}
                >
                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="mdi:certificate"
                          className="text-[#FF6B00]"
                          width={20}
                          height={20}
                        />
                        <h4 className="text-white text-base font-medium">
                          {field.name}
                        </h4>
                      </div>

                      {/* Status badge */}
                      {field.status && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                            STATUS_COLORS[field.status]?.bg || "bg-gray-800/50"
                          } border ${
                            STATUS_COLORS[field.status]?.border ||
                            "border-gray-700"
                          }`}
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
                            width={16}
                            height={16}
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
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-400 text-xs mb-1">
                          Issued By
                        </div>
                        <div className="text-white text-sm">
                          {field.issuer || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs mb-1">
                          Expiry Date
                        </div>
                        <div className="text-white text-sm">
                          {field.expiryDate
                            ? new Date(field.expiryDate).toLocaleDateString()
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Documents (simplified for mobile) */}
                    {field.documents && field.documents.length > 0 && (
                      <div>
                        <div className="text-gray-400 text-xs mb-1">
                          Documents ({field.documents.length})
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {field.documents.slice(0, 3).map((doc, docIndex) => (
                            <div
                              key={`mobile-doc-${field._idx}-${docIndex}`}
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
                                  <div className="relative h-12 w-12 bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#444] transition-all">
                                    <div className="relative w-full h-full">
                                      <Image
                                        src={
                                          documentPreviews[field._idx][docIndex]
                                        }
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
                                    className="relative flex items-center justify-center h-12 w-12 bg-[#1a1a1a] rounded-lg border border-[#333] transition-all"
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
                          {field.documents.length > 3 && (
                            <div className="h-12 w-12 bg-[#1a1a1a] rounded-lg border border-[#333] flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                +{field.documents.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action buttons for mobile */}
                    <div className="flex gap-1.5 mt-2">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleDeleteCert(field._idx)}
                        className="flex-1 h-9 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Icon
                          icon="mdi:delete"
                          width={16}
                          height={16}
                          className="text-red-400"
                        />
                        <span className="text-xs text-red-400">Delete</span>
                      </Button>

                      {!field.hidden && (
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => handleHideCert(field._idx)}
                          className="flex-1 h-9 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg flex items-center justify-center gap-1"
                        >
                          <Icon
                            icon="mdi:eye-off"
                            width={16}
                            height={16}
                            className="text-gray-400"
                          />
                          <span className="text-xs text-gray-400">Hide</span>
                        </Button>
                      )}

                      {field.hidden && (
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => handleUnhideCert(field._idx)}
                          className="flex-1 h-9 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg flex items-center justify-center gap-1"
                        >
                          <Icon
                            icon="mdi:eye"
                            width={16}
                            height={16}
                            className="text-green-400"
                          />
                          <span className="text-xs text-green-400">Show</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="mdi:certificate"
                            className="text-[#FF6B00]"
                            width={16}
                            height={16}
                          />
                        </div>
                        <span className="text-white font-medium truncate">
                          {field.name}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-white text-sm">
                        {field.issuer || "—"}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-white text-sm">
                        {field.expiryDate
                          ? new Date(field.expiryDate).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      {field.status && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${
                            STATUS_COLORS[field.status]?.bg || "bg-gray-800/50"
                          } border ${
                            STATUS_COLORS[field.status]?.border ||
                            "border-gray-700"
                          }`}
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
                            width={16}
                            height={16}
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
                      )}
                    </div>
                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                      {/* Document thumbnails (if any) */}
                      {field.documents && field.documents.length > 0 && (
                        <div className="flex -space-x-1 mr-2">
                          {field.documents.slice(0, 2).map((doc, docIndex) => (
                            <div
                              key={`desktop-thumb-${field._idx}-${docIndex}`}
                              className="relative w-8 h-8 border-2 border-[#333] rounded-full overflow-hidden"
                            >
                              {doc?.url &&
                              (doc.url.endsWith(".jpg") ||
                                doc.url.endsWith(".jpeg") ||
                                doc.url.endsWith(".png") ||
                                doc.url.endsWith(".gif")) &&
                              documentPreviews[field._idx] &&
                              documentPreviews[field._idx][docIndex] ? (
                                <Image
                                  src={documentPreviews[field._idx][docIndex]}
                                  alt="Doc"
                                  fill
                                  style={{ objectFit: "cover" }}
                                  unoptimized={true}
                                />
                              ) : (
                                <div className="w-full h-full bg-[#222] flex items-center justify-center">
                                  <Icon
                                    icon={getDocumentIcon(doc?.url)}
                                    className="text-[#FF6B00]"
                                    width={14}
                                    height={14}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          {field.documents.length > 2 && (
                            <div className="relative w-8 h-8 border-2 border-[#333] bg-[#222] rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">
                                +{field.documents.length - 2}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleDeleteCert(field._idx)}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg flex items-center justify-center"
                        title="Delete certification"
                      >
                        <Icon
                          icon="mdi:delete"
                          width={16}
                          height={16}
                          className="text-red-400"
                        />
                      </Button>

                      {!field.hidden && (
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => handleHideCert(field._idx)}
                          className="w-8 h-8 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-lg flex items-center justify-center"
                          title="Hide certification"
                        >
                          <Icon
                            icon="mdi:eye-off"
                            width={16}
                            height={16}
                            className="text-gray-400"
                          />
                        </Button>
                      )}

                      {field.hidden && (
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => handleUnhideCert(field._idx)}
                          className="w-8 h-8 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg flex items-center justify-center"
                          title="Show certification"
                        >
                          <Icon
                            icon="mdi:eye"
                            width={16}
                            height={16}
                            className="text-green-400"
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {existingCerts.length === 0 && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon
                    icon="mdi:certificate-outline"
                    className="text-gray-400"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  No certifications added yet.
                </p>
              </div>
            )}
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
            <Button
              onClick={() => setUploadError(null)}
              className="ml-2 text-red-400 hover:text-red-300"
              variant="ghost"
            >
              Dismiss
            </Button>
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
                  handleCertChange?.(field._idx, "name", e.target.value)
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
                    handleCertChange?.(field._idx, "issuer", e.target.value)
                  }
                  placeholder="e.g. National Academy of Sports Medicine, Personal Trainer Institute"
                  className="mb-0"
                />
                <FormField
                  label="Expiry Date"
                  type="date"
                  value={field?.expiryDate || ""}
                  onChange={(e) =>
                    handleCertChange?.(field._idx, "expiryDate", e.target.value)
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

                              <Button
                                type="button"
                                variant="ghost"
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
                              </Button>
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
                            <Button
                              type="button"
                              variant="ghost"
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
                            </Button>
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
