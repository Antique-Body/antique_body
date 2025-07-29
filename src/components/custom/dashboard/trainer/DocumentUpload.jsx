"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { UPLOAD_CONFIG } from "@/config/upload";

export const DocumentUpload = ({
  onUpload,
  onRemove,
  documents = [],
  isUploading = false,
  maxFiles = 5,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    if (documents.length + fileArray.length > maxFiles) {
      alert(`Možeš uploadovati maksimalno ${maxFiles} fajlova.`);
      return;
    }

    onUpload(fileArray);
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.includes("pdf")) return "mdi:file-pdf";
    if (mimetype.includes("word") || mimetype.includes("document"))
      return "mdi:file-word";
    if (mimetype.includes("excel") || mimetype.includes("sheet"))
      return "mdi:file-excel";
    if (mimetype.includes("image")) return "mdi:file-image";
    if (mimetype.includes("text")) return "mdi:file-document";
    return "mdi:file";
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-600 hover:border-zinc-500 bg-zinc-800/30"
        } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="document-upload"
          className="hidden"
          multiple
          accept={UPLOAD_CONFIG.nutritionDocuments.allowedTypes.join(",")}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
            <Icon icon="mdi:cloud-upload" className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Dodaj dokumente plana ishrane
            </h3>
            <p className="text-zinc-400 text-sm mb-4">
              Povuci fajlove ovde ili klikni da odabereš
            </p>

            <label
              htmlFor="document-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium cursor-pointer transition-all transform hover:scale-105"
            >
              <Icon icon="mdi:plus" className="w-4 h-4" />
              Odaberi fajlove
            </label>
          </div>

          <div className="flex flex-wrap gap-2 justify-center text-xs text-zinc-500">
            <span className="px-2 py-1 bg-zinc-700/50 rounded">PDF</span>
            <span className="px-2 py-1 bg-zinc-700/50 rounded">Word</span>
            <span className="px-2 py-1 bg-zinc-700/50 rounded">Excel</span>
            <span className="px-2 py-1 bg-zinc-700/50 rounded">Slike</span>
            <span className="px-2 py-1 bg-zinc-700/50 rounded">
              Maksimalno 20MB
            </span>
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-white font-medium">Uploadovanje...</span>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-300">
            Uploaded documents ({documents.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg"
              >
                {/* File Icon */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                  <Icon
                    icon={getFileIcon(doc.mimetype)}
                    className="w-5 h-5 text-blue-400"
                  />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {doc.originalName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{doc.mimetype.split("/")[1].toUpperCase()}</span>
                    {doc.size && <span>• {getFileSize(doc.size)}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => window.open(doc.url, "_blank")}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    title="Otvori dokument"
                  >
                    <Icon icon="mdi:open-in-new" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onRemove(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    title="Ukloni dokument"
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
