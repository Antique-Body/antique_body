"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import {
  EXERCISE_TYPES,
  EXERCISE_LEVELS,
  EXERCISE_LOCATIONS,
  EQUIPMENT_OPTIONS,
  MUSCLE_GROUPS,
} from "@/enums";

// Apstraktna konfiguracija za file upload
const FILE_CONFIG = {
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

export const ExerciseModal = ({
  isOpen,
  onClose,
  mode = "view",
  exercise,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("details");

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    location: "gym",
    equipment: true,
    type: "strength",
    level: "beginner",
    muscleGroups: [],
    description: "",
    instructions: "",
    video: null,
    imageUrl: null,
  });

  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); // Za video URL input
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false); // Toggle za URL input

  // Extract YouTube video ID if available
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if video is YouTube link
  const isYouTubeVideo = (url) =>
    url && (url.includes("youtube.com") || url.includes("youtu.be"));

  // Validate video URL
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

  const videoId = formData?.video ? getYouTubeVideoId(formData.video) : null;

  // Load exercise data if in edit mode
  useEffect(() => {
    if (exercise && (mode === "edit" || mode === "view")) {
      setFormData({
        ...exercise,
      });
      // Handle muscle groups from API structure
      const muscleGroupNames =
        exercise.muscleGroups?.map((mg) => mg.name) || [];
      setSelectedMuscles(muscleGroupNames);
      if (exercise.video) {
        setVideoPreview(exercise.video);
        setVideoUrl(exercise.video);
      }
      if (exercise.imageUrl) setImagePreview(exercise.imageUrl);
    } else {
      // Reset form for create mode
      setFormData({
        id: null,
        name: "",
        location: "gym",
        equipment: true,
        type: "strength",
        level: "beginner",
        muscleGroups: [],
        description: "",
        instructions: "",
        video: null,
        imageUrl: null,
      });
      setSelectedMuscles([]);
      setVideoPreview(null);
      setImagePreview(null);
      setVideoUrl("");
      setShowVideoUrlInput(false);
      setErrors({});
    }
  }, [exercise, mode, isOpen]);

  // Handle video URL input
  const handleVideoUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);

    // Clear video URL error if exists
    if (errors.videoUrl) {
      setErrors((prev) => ({ ...prev, videoUrl: null }));
    }

    // Validate URL if not empty
    if (url.trim()) {
      const isValid = validateVideoUrl(url);
      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          videoUrl: "Invalid video URL format",
        }));
        setVideoPreview(null);
        setFormData((prev) => ({ ...prev, video: null }));
      } else {
        setVideoPreview(url);
        setFormData((prev) => ({ ...prev, video: url }));
        // Reset file input when URL is entered
        const videoInput = document.getElementById("video-upload");
        if (videoInput) videoInput.value = "";
      }
    } else {
      setVideoPreview(null);
      setFormData((prev) => ({ ...prev, video: null }));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle muscle group selection
  const toggleMuscleGroup = (muscle) => {
    setSelectedMuscles((prev) => {
      const newSelectedMuscles = prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle];

      // Clear muscle groups error if muscle groups are selected
      if (newSelectedMuscles.length > 0 && errors.muscleGroups) {
        setErrors((prev) => ({ ...prev, muscleGroups: null }));
      }

      return newSelectedMuscles;
    });
  };

  // Update formData when selectedMuscles changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      muscleGroups: selectedMuscles,
    }));

    // Clear muscle groups error if muscle groups are selected
    if (selectedMuscles.length > 0 && errors.muscleGroups) {
      setErrors((prev) => ({ ...prev, muscleGroups: null }));
    }
  }, [selectedMuscles, errors.muscleGroups]);

  // Apstraktna validacija fajla
  const validateFile = (file, type) => {
    const config = FILE_CONFIG[type];
    if (!file) return null;

    if (!config.allowedTypes.includes(file.type)) {
      return `Invalid ${type} format. Allowed: ${config.allowedTypes
        .map((t) => t.split("/")[1])
        .join(", ")}`;
    }

    if (file.size > config.maxSize) {
      return `${type === "image" ? "Image" : "Video"} is too large. Maximum: ${
        config.maxSize / (1024 * 1024)
      }MB`;
    }

    return null;
  };

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file, fileType);
    if (validationError) {
      setErrors((prev) => ({ ...prev, [fileType]: validationError }));
      return;
    }

    // Clear validation error
    if (errors[fileType]) {
      setErrors((prev) => ({ ...prev, [fileType]: null }));
    }

    // Create preview URL
    const fileUrl = URL.createObjectURL(file);

    if (fileType === "video") {
      setVideoPreview(fileUrl);
      setFormData((prev) => ({ ...prev, video: fileUrl }));
      // Reset video URL input when file is uploaded
      setVideoUrl("");
      setShowVideoUrlInput(false);
    } else {
      setImagePreview(fileUrl);
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
    }
  };

  // Apstraktna obrada uploada
  const uploadFiles = async (files) => {
    const formData = new FormData();
    let hasFiles = false;

    Object.entries(files).forEach(([type, file]) => {
      if (file) {
        formData.append(FILE_CONFIG[type].uploadKey, file);
        hasFiles = true;
      }
    });

    if (!hasFiles) return {};

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return await response.json();
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.instructions.trim())
      newErrors.instructions = "Instructions are required";
    if (selectedMuscles.length === 0)
      newErrors.muscleGroups = "At least one muscle group is required";

    // Video URL validation (if provided)
    if (videoUrl.trim() && !validateVideoUrl(videoUrl)) {
      newErrors.videoUrl = "Invalid video URL format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);

      // Upload files if they exist
      const filesToUpload = {};
      if (imagePreview && imagePreview.startsWith("blob:")) {
        // Get file from input
        const imageInput = document.getElementById("image-upload");
        if (imageInput?.files[0]) filesToUpload.image = imageInput.files[0];
      }
      if (videoPreview && videoPreview.startsWith("blob:")) {
        const videoInput = document.getElementById("video-upload");
        if (videoInput?.files[0]) filesToUpload.video = videoInput.files[0];
      }

      const uploadedUrls = await uploadFiles(filesToUpload);

      // Prepare final form data
      const finalFormData = {
        ...formData,
        id: formData.id || undefined, // Remove ID for new exercises
        imageUrl: uploadedUrls.exerciseImage || formData.imageUrl,
        video: uploadedUrls.exerciseVideo || formData.video, // Video URL will be preserved if it's not a blob
      };

      // Call the save function
      await onSave(finalFormData);
    } catch (error) {
      console.error("Error saving exercise:", error);
      setErrors((prev) => ({ ...prev, upload: error.message }));
    } finally {
      setIsUploading(false);
    }
  };

  // Available muscle groups - now using the enum
  const muscleGroups = MUSCLE_GROUPS.map((group) => group.value);

  // Apstraktna komponenta za file upload
  const FileUploadSection = ({
    type,
    label,
    description,
    preview,
    onFileChange,
    onRemove,
  }) => {
    const config = FILE_CONFIG[type];

    return (
      <div className="h-full flex flex-col">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {errors[type] && (
            <p className="text-xs text-red-500">{errors[type]}</p>
          )}
        </div>

        {/* Video URL input section - only for video type */}
        {type === "video" && (
          <div className="mb-3">
            <div className="flex rounded-lg overflow-hidden border border-zinc-700">
              <button
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
              </button>
              <button
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
              </button>
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

                {errors.videoUrl && (
                  <p className="mt-1 text-xs text-red-500">{errors.videoUrl}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("https://www.youtube.com");
                      document.querySelector('input[type="url"]').focus();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                  >
                    <Icon icon="mdi:youtube" className="w-3 h-3 text-red-500" />
                    <span>YouTube</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrl("https://vimeo.com/");
                      document.querySelector('input[type="url"]').focus();
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                  >
                    <Icon icon="mdi:vimeo" className="w-3 h-3 text-blue-400" />
                    <span>Vimeo</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Area - Flex-grow to fill available space */}
        <div className="flex-grow flex">
          {/* File Upload Area - Hidden completely when URL input is active */}
          {!(type === "video" && showVideoUrlInput) && (
            <div className="w-full border border-dashed border-zinc-600 rounded-lg overflow-hidden flex flex-col">
              {preview ? (
                <div className="flex flex-col h-full">
                  {/* Preview Content */}
                  <div className="flex-grow relative bg-zinc-900">
                    {type === "image" ? (
                      <div className="relative aspect-square w-full">
                        <Image
                          src={preview}
                          alt="Exercise image preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full">
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
                <div className="flex flex-col items-center justify-center p-4 h-full min-h-[240px]">
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
                      {type === "image" ? "Exercise Image" : "Exercise Video"}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {type === "image"
                        ? "Upload a clear image showing the exercise"
                        : "Add a video demonstration"}
                    </p>
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor={`${type}-upload`}
                        className="px-3 py-1.5 bg-[#FF7800] hover:bg-[#FF9A00] text-white rounded-md transition-colors cursor-pointer flex items-center gap-1.5 text-sm"
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
                      <p className="mt-2 text-xs text-zinc-500">
                        {config.description}
                      </p>
                      <div className="mt-3 flex items-center w-full">
                        <div className="border-t border-zinc-700 flex-1"></div>
                        <p className="mx-2 text-xs text-zinc-500">
                          or drag and drop
                        </p>
                        <div className="border-t border-zinc-700 flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Drag and Drop Overlay */}
              <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center opacity-0 transition-opacity pointer-events-none group-hover:opacity-100">
                <div className="text-center">
                  <Icon
                    icon="mdi:upload"
                    className="h-10 w-10 text-[#FF7800] mx-auto mb-2"
                  />
                  <p className="text-white font-medium">Drop your file here</p>
                </div>
              </div>
            </div>
          )}

          {/* URL Video Preview - Show when URL input is active */}
          {type === "video" && showVideoUrlInput && (
            <div className="w-full border border-zinc-700 rounded-lg overflow-hidden flex flex-col">
              {preview ? (
                <>
                  <div className="flex-grow relative bg-zinc-900">
                    <div className="relative aspect-video w-full">
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
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 h-full min-h-[240px]">
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

        <p className="mt-2 text-xs text-zinc-500">{description}</p>
      </div>
    );
  };

  // Render view mode content
  const renderViewContent = () => {
    if (!exercise) return null;

    return (
      <div className="flex flex-col">
        {/* Tabs */}
        <div className="mb-6 flex border-b border-zinc-800">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "details"
                ? "border-b-2 border-[#FF7800] text-[#FF7800]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "video"
                ? "border-b-2 border-[#FF7800] text-[#FF7800]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "details" ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-1/3">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    exercise.imageUrl ||
                    "https://www.nrgfitness.ie/site/wp-content/plugins/bbpowerpack/modules/pp-content-grid/images/placeholder.jpg"
                  }
                  alt={exercise.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Basic info badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                  <Icon
                    icon="mdi:map-marker"
                    className="mr-2 text-[#FF7800]"
                    width={16}
                    height={16}
                  />
                  <span>{exercise.location === "gym" ? "Gym" : "Home"}</span>
                </div>
                <div className="flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                  <Icon
                    icon={exercise.equipment ? "mdi:weight" : "mdi:account"}
                    className="mr-2 text-[#FF7800]"
                    width={16}
                    height={16}
                  />
                  <span>
                    {exercise.equipment ? "Equipment needed" : "No equipment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3">
              <h2 className="mb-4 text-2xl font-bold">{exercise.name}</h2>

              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`inline-block rounded-md px-2 py-1 text-sm font-semibold ${
                    exercise.type === "strength"
                      ? "bg-purple-900/60 text-purple-200"
                      : exercise.type === "bodyweight"
                      ? "bg-green-900/60 text-green-200"
                      : "bg-blue-900/60 text-blue-200"
                  }`}
                >
                  {exercise.type.charAt(0).toUpperCase() +
                    exercise.type.slice(1)}
                </span>

                <span
                  className={`inline-block rounded-md px-2 py-1 text-sm font-semibold ${
                    exercise.level === "beginner"
                      ? "bg-green-900/40 text-green-300"
                      : exercise.level === "intermediate"
                      ? "bg-orange-900/40 text-orange-300"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  {exercise.level.charAt(0).toUpperCase() +
                    exercise.level.slice(1)}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Description
                </h3>
                <p className="text-gray-200">{exercise.description}</p>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Instructions
                </h3>
                <p className="text-gray-200">{exercise.instructions}</p>
              </div>

              {/* Muscle Groups */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Target Muscle Groups
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((muscle, index) => (
                    <div
                      key={index}
                      className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-sm text-[#FF6B00]"
                    >
                      {muscle.name.charAt(0).toUpperCase() +
                        muscle.name.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {exercise.video ? (
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                {isYouTubeVideo(exercise.video) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${exercise.name} video`}
                    className="h-[400px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : exercise.video.includes("vimeo.com") ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${
                      exercise.video.match(/vimeo\.com\/(\d+)/)?.[1]
                    }`}
                    title={`${exercise.name} video`}
                    className="h-[400px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={exercise.video}
                    controls
                    className="h-[400px] w-full rounded-lg"
                    preload="metadata"
                  >
                    <source src={exercise.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg bg-zinc-800">
                <Icon
                  icon="mdi:video-off"
                  className="text-zinc-500"
                  width={64}
                  height={64}
                />
                <p className="mt-4 text-lg text-zinc-400">No video available</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render form content
  const renderFormContent = () => (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Basic Info */}
        <div className="md:col-span-2">
          <FormField
            type="text"
            label="Exercise Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Barbell Squat"
            error={errors.name}
            required
          />
        </div>

        {/* Location & Equipment */}
        <div>
          <FormField
            type="select"
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            options={EXERCISE_LOCATIONS}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Equipment Required"
            name="equipment"
            value={formData.equipment ? "yes" : "no"}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                equipment: e.target.value === "yes",
              }));
            }}
            options={EQUIPMENT_OPTIONS}
          />
        </div>

        {/* Type and Level */}
        <div>
          <FormField
            type="select"
            label="Exercise Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={EXERCISE_TYPES}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Athlete Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            options={EXERCISE_LEVELS}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <FormField
            type="textarea"
            label="Exercise Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the exercise"
            rows={3}
            error={errors.description}
            required
          />
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <FormField
            type="textarea"
            label="Exercise Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Step-by-step instructions for performing the exercise"
            rows={4}
            error={errors.instructions}
            required
          />
        </div>

        {/* Muscle Groups */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Target Muscle Groups
            {errors.muscleGroups && (
              <span className="ml-2 text-red-500 text-xs">
                {errors.muscleGroups}
              </span>
            )}
          </label>
          <div className="mb-5 flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <button
                key={muscle}
                type="button"
                onClick={() => toggleMuscleGroup(muscle)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedMuscles.includes(muscle)
                    ? "bg-orange-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload Section - Wrapper to ensure equal heights */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* File Uploads - Made symmetrical with equal heights */}
          <div className="h-full flex flex-col" style={{ minHeight: "380px" }}>
            <FileUploadSection
              type="image"
              label="Exercise Image"
              description="Upload an image of the exercise (JPG, PNG, GIF up to 5MB)"
              preview={imagePreview}
              onFileChange={handleFileChange}
              onRemove={() => {
                setImagePreview(null);
                setFormData((prev) => ({ ...prev, imageUrl: null }));
              }}
            />
          </div>

          <div className="h-full flex flex-col" style={{ minHeight: "380px" }}>
            <FileUploadSection
              type="video"
              label="Exercise Video"
              description="Upload or link a video demonstration (MP4, MOV, AVI up to 50MB)"
              preview={videoPreview}
              onFileChange={handleFileChange}
              onRemove={() => {
                setVideoPreview(null);
                setVideoUrl("");
                setFormData((prev) => ({ ...prev, video: null }));
                // Reset file input
                const videoInput = document.getElementById("video-upload");
                if (videoInput) videoInput.value = "";
              }}
            />
          </div>
        </div>
      </div>

      {/* Upload error display */}
      {errors.upload && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{errors.upload}</p>
        </div>
      )}
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={mode === "view" ? "large" : "large"}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon={
              mode === "view"
                ? "mdi:dumbbell"
                : mode === "edit"
                ? "mdi:pencil"
                : "mdi:plus-circle"
            }
            className="text-[#FF7800]"
            width={20}
            height={20}
          />
          <span>
            {mode === "view"
              ? exercise?.name
              : mode === "edit"
              ? "Edit Exercise"
              : "Create New Exercise"}
          </span>
        </div>
      }
      footerButtons={true}
      primaryButtonText={
        mode === "view"
          ? "Close"
          : mode === "edit"
          ? "Update Exercise"
          : "Save Exercise"
      }
      secondaryButtonText={mode === "view" ? null : "Cancel"}
      primaryButtonAction={mode === "view" ? onClose : handleSubmit}
      secondaryButtonAction={onClose}
      primaryButtonDisabled={isUploading}
      primaryButtonLoading={isUploading}
    >
      {mode === "view" ? renderViewContent() : renderFormContent()}
    </Modal>
  );
};
