"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const DocumentViewer = ({ documents = [] }) => {
  const [selectedDocument, setSelectedDocument] = useState(null);

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

  const getFileTypeColor = (mimetype) => {
    if (mimetype.includes("pdf")) return "from-red-500 to-red-600";
    if (mimetype.includes("word") || mimetype.includes("document"))
      return "from-blue-500 to-blue-600";
    if (mimetype.includes("excel") || mimetype.includes("sheet"))
      return "from-green-500 to-green-600";
    if (mimetype.includes("image")) return "from-purple-500 to-purple-600";
    if (mimetype.includes("text")) return "from-gray-500 to-gray-600";
    return "from-zinc-500 to-zinc-600";
  };

  const getFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const canPreview = (mimetype) => {
    return mimetype.includes("pdf") || mimetype.includes("image");
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <Icon
            icon="mdi:file-document-multiple"
            className="w-6 h-6 text-white"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Nutrition Plan - Documents
          </h3>
          <p className="text-sm text-zinc-400 font-medium">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"} from trainer
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="group bg-zinc-800/40 hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-zinc-600/50 rounded-xl p-4 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              {/* File Icon */}
              <div
                className={`w-12 h-12 bg-gradient-to-br ${getFileTypeColor(doc.mimetype)}/20 border border-current rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <Icon
                  icon={getFileIcon(doc.mimetype)}
                  className={`w-6 h-6 ${
                    doc.mimetype.includes("pdf")
                      ? "text-red-400"
                      : doc.mimetype.includes("word")
                        ? "text-blue-400"
                        : doc.mimetype.includes("excel")
                          ? "text-green-400"
                          : doc.mimetype.includes("image")
                            ? "text-purple-400"
                            : "text-zinc-400"
                  }`}
                />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-blue-300 transition-colors">
                  {doc.originalName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                  <span className="px-2 py-0.5 bg-zinc-700/50 rounded font-medium">
                    {doc.mimetype.split("/")[1].toUpperCase()}
                  </span>
                  {doc.size && <span>• {getFileSize(doc.size)}</span>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => window.open(doc.url, "_blank")}
                    className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 text-xs"
                  >
                    <Icon icon="mdi:download" className="w-3 h-3 mr-1" />
                    Preuzmi
                  </Button>

                  {canPreview(doc.mimetype) && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => setSelectedDocument(doc)}
                      className="flex-1 text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 text-xs"
                    >
                      <Icon icon="mdi:eye" className="w-3 h-3 mr-1" />
                      Pregled
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-700">
              <div className="flex items-center gap-3">
                <Icon
                  icon={getFileIcon(selectedDocument.mimetype)}
                  className="w-5 h-5 text-blue-400"
                />
                <h3 className="text-lg font-semibold text-white truncate">
                  {selectedDocument.originalName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => window.open(selectedDocument.url, "_blank")}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Icon icon="mdi:open-in-new" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setSelectedDocument(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="relative h-[80vh] overflow-hidden">
              {selectedDocument.mimetype.includes("pdf") ? (
                <iframe
                  src={selectedDocument.url}
                  className="w-full h-full"
                  title={selectedDocument.originalName}
                />
              ) : selectedDocument.mimetype.includes("image") ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.originalName}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Icon
                      icon="mdi:file"
                      className="w-16 h-16 text-zinc-400 mx-auto mb-4"
                    />
                    <p className="text-zinc-400 mb-4">
                      Pregled nije dostupan za ovaj tip fajla
                    </p>
                    <Button
                      variant="primary"
                      onClick={() =>
                        window.open(selectedDocument.url, "_blank")
                      }
                    >
                      <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
                      Preuzmi fajl
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
