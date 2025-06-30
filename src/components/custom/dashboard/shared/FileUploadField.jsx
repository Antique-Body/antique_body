"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";

// File upload configuration
export const FILE_CONFIG = {
  image: {
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
    uploadKey: "exerciseImage",
    description: "JPG, PNG, GIF up to 5MB",
  },
  video: {
    accept: "video/*",
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/webm",
    ],
    uploadKey: "exerciseVideo",
    description: "MP4, MOV, AVI up to 50MB",
  },
};

// Helper functions
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const isYouTubeVideo = (url) =>
  url && (url.includes("youtube.com") || url.includes("youtu.be"));

const validateVideoUrl = (url) => {
  if (!url) return true; // Empty URL is valid (optional)

  // YouTube URL validation
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = getYouTubeVideoId(url);
    return videoId !== null;
  }

  // Vimeo URL validation
  if (url.includes("vimeo.com")) {
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    return vimeoMatch !== null;
  }

  // Direct video URL validation (basic)
  if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
    return true;
  }

  // Generic URL validation
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const FileUploadField = ({
  type,
  label,
  preview,
  onFileChange,
  onRemove,
  error,
  uploadStatus,
  uploadProgress,
  videoUrl = "",
  setVideoUrl,
  showVideoUrlInput = false,
  setShowVideoUrlInput,
}) => {
  const config = FILE_CONFIG[type];
  const isUploadingFile = uploadStatus && uploadStatus !== "";
  const videoId = type === "video" ? getYouTubeVideoId(preview) : null;

  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);

    // Validate URL
    if (url.trim()) {
      const isValid = validateVideoUrl(url);
      if (isValid) {
        onFileChange({ target: { value: url } }, "videoUrl");
      }
    } else {
      onRemove();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Upload Progress Indicator */}
      {isUploadingFile && (
        <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-blue-400">{uploadStatus}</span>
          </div>
          {uploadProgress > 0 && (
            <div className="w-full bg-blue-900/30 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Video URL input section - only for video type */}
      {type === "video" && (
        <div className="mb-3">
          <div className="flex rounded-lg overflow-hidden border border-zinc-700">
            <Button
              type="button"
              onClick={() => setShowVideoUrlInput(false)}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-sm transition-colors ${
                !showVideoUrlInput
                  ? "bg-[#FF7800] text-white"
                  : "bg-transparent text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
              }`}
            >
              <Icon icon="mdi:upload" className="w-4 h-4" />
              <span>Upload</span>
            </Button>
            <Button
              type="button"
              onClick={() => setShowVideoUrlInput(true)}
              className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 text-sm transition-colors ${
                showVideoUrlInput
                  ? "bg-[#FF7800] text-white"
                  : "bg-transparent text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
              }`}
            >
              <Icon icon="mdi:link-variant" className="w-4 h-4" />
              <span>URL</span>
            </Button>
          </div>

          {/* URL Input */}
          {showVideoUrlInput && (
            <div className="mt-3 p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
              <div className="relative">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                  placeholder="Enter YouTube, Vimeo or direct video URL..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF7800] focus:border-[#FF7800]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon
                    icon={
                      videoUrl.includes("youtube")
                        ? "mdi:youtube"
                        : videoUrl.includes("vimeo")
                        ? "mdi:vimeo"
                        : "mdi:link"
                    }
                    className={`w-4 h-4 ${
                      videoUrl.includes("youtube")
                        ? "text-red-500"
                        : videoUrl.includes("vimeo")
                        ? "text-blue-400"
                        : "text-zinc-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setVideoUrl("https://www.youtube.com");
                    document.querySelector('input[type="url"]').focus();
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                >
                  <Icon icon="mdi:youtube" className="w-3 h-3 text-red-500" />
                  <span>YouTube</span>
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setVideoUrl("https://vimeo.com/");
                    document.querySelector('input[type="url"]').focus();
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                >
                  <Icon icon="mdi:vimeo" className="w-3 h-3 text-blue-400" />
                  <span>Vimeo</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area - Fixed height container */}
      <div className="flex-grow">
        <div className="relative w-full h-full min-h-[320px] max-h-[400px] rounded-lg border border-zinc-700 bg-zinc-900/50 overflow-hidden">
          {/* File Upload Area */}
          {!(type === "video" && showVideoUrlInput) && (
            <div className="absolute inset-0">
              {preview ? (
                // Preview Mode
                <div className="flex flex-col h-full">
                  {/* Preview Content */}
                  <div className="flex-grow relative bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {type === "image" ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        {isYouTubeVideo(preview) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : preview.includes("vimeo.com") ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${
                              preview.match(/vimeo\.com\/(\d+)/)?.[1]
                            }`}
                            title="Vimeo video player"
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <video
                            src={preview}
                            controls
                            className="absolute inset-0 w-full h-full object-contain"
                            preload="metadata"
                          >
                            <source src={preview} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Preview Footer */}
                  <div className="p-3 bg-zinc-800 border-t border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={
                          type === "image"
                            ? "mdi:image"
                            : isYouTubeVideo(preview)
                            ? "mdi:youtube"
                            : preview.includes("vimeo.com")
                            ? "mdi:vimeo"
                            : "mdi:video"
                        }
                        className={`w-4 h-4 ${
                          type === "image"
                            ? "text-blue-400"
                            : isYouTubeVideo(preview)
                            ? "text-red-500"
                            : preview.includes("vimeo.com")
                            ? "text-blue-400"
                            : "text-green-400"
                        }`}
                      />
                      <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                        {type === "image"
                          ? "Image Preview"
                          : isYouTubeVideo(preview)
                          ? "YouTube Video"
                          : preview.includes("vimeo.com")
                          ? "Vimeo Video"
                          : "Video Preview"}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      leftIcon={
                        <Icon icon="mdi:trash-can" width={14} height={14} />
                      }
                      onClick={onRemove}
                      className="bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 py-1 px-2 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                // Upload Mode
                <div className="flex flex-col items-center justify-center p-6 h-full">
                  <div className="w-12 h-12 mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon
                      icon={
                        type === "image" ? "mdi:image-plus" : "mdi:video-plus"
                      }
                      className="h-6 w-6 text-[#FF7800]"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-white mb-1">
                      {type === "image" ? "Add Image" : "Add Video"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-4">
                      {type === "image"
                        ? "Upload a clear image"
                        : "Add a video demonstration"}
                    </p>
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor={`${type}-upload`}
                        className="px-4 py-2 bg-[#FF7800] hover:bg-[#FF9A00] text-white rounded-md transition-colors cursor-pointer flex items-center gap-2 text-sm font-medium"
                      >
                        <Icon icon="mdi:upload" className="w-4 h-4" />
                        <span>Select File</span>
                        <input
                          id={`${type}-upload`}
                          name={`${type}-upload`}
                          type="file"
                          accept={config.accept}
                          onChange={(e) => onFileChange(e, type)}
                          className="sr-only"
                        />
                      </label>
                      <p className="mt-3 text-xs text-zinc-500">
                        {config.description}
                      </p>
                      <div className="mt-4 flex items-center w-full max-w-[200px]">
                        <div className="border-t border-zinc-700 flex-1"></div>
                        <p className="mx-3 text-xs text-zinc-500">
                          or drag and drop
                        </p>
                        <div className="border-t border-zinc-700 flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* URL Video Preview */}
          {type === "video" && showVideoUrlInput && (
            <div className="absolute inset-0">
              {preview ? (
                <div className="flex flex-col h-full">
                  <div className="flex-grow relative bg-zinc-900 flex items-center justify-center overflow-hidden">
                    <div className="relative w-full h-full">
                      {isYouTubeVideo(preview) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : preview.includes("vimeo.com") ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${
                            preview.match(/vimeo\.com\/(\d+)/)?.[1]
                          }`}
                          title="Vimeo video player"
                          className="absolute inset-0 w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          src={preview}
                          controls
                          className="absolute inset-0 w-full h-full object-contain"
                          preload="metadata"
                        >
                          <source src={preview} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>

                  {/* Preview Footer */}
                  <div className="p-3 bg-zinc-800 border-t border-zinc-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={
                          isYouTubeVideo(preview)
                            ? "mdi:youtube"
                            : preview.includes("vimeo.com")
                            ? "mdi:vimeo"
                            : "mdi:video"
                        }
                        className={`w-4 h-4 ${
                          isYouTubeVideo(preview)
                            ? "text-red-500"
                            : preview.includes("vimeo.com")
                            ? "text-blue-400"
                            : "text-green-400"
                        }`}
                      />
                      <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                        {isYouTubeVideo(preview)
                          ? "YouTube Video"
                          : preview.includes("vimeo.com")
                          ? "Vimeo Video"
                          : "Video Preview"}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      leftIcon={
                        <Icon icon="mdi:trash-can" width={14} height={14} />
                      }
                      onClick={onRemove}
                      className="bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 py-1 px-2 text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 h-full">
                  <div className="w-12 h-12 mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Icon
                      icon="mdi:video-outline"
                      className="h-6 w-6 text-zinc-500"
                    />
                  </div>
                  <p className="text-sm text-zinc-400 text-center">
                    Enter a video URL above to preview
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-2 text-xs text-zinc-500">{config.description}</p>
    </div>
  );
};
