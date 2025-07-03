"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ExerciseLibrarySelector } from "./ExerciseLibrarySelector";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { FileUploadField } from "@/components/custom/dashboard/shared";
import { AnatomicalViewer } from "@/components/custom/shared";
import { UPLOAD_CONFIG } from "@/config/upload";
import {
  EXERCISE_TYPES,
  EXERCISE_LEVELS,
  EXERCISE_LOCATIONS,
  EQUIPMENT_OPTIONS,
  MUSCLE_GROUPS,
} from "@/enums";
import { formatMuscleDisplayName } from "@/utils/muscleMapper";

// File upload validation
const validateFile = (file, type) => {
  const configKey = type === "image" ? "exerciseImage" : "exerciseVideo";
  const config = UPLOAD_CONFIG[configKey];

  if (!file) return null;

  if (!config.allowedTypes.includes(file.type)) {
    return `Invalid ${type} format. Allowed: ${config.allowedTypes
      .map((t) => t.split("/")[1])
      .join(", ")}`;
  }

  if (file.size > config.maxSize * 1024 * 1024) {
    return `${type === "image" ? "Image" : "Video"} is too large. Maximum: ${
      config.maxSize
    }MB`;
  }

  return null;
};

export const ExerciseModal = ({
  isOpen,
  onClose,
  mode = "view",
  exercise,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showLibrarySelector, setShowLibrarySelector] = useState(false);

  // Form state
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

  // UI state
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ image: 0, video: 0 });
  const [uploadStatus, setUploadStatus] = useState({ image: "", video: "" });
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Load exercise data if in edit mode
  useEffect(() => {
    if (exercise && (mode === "edit" || mode === "view")) {
      // Ensure equipment is always a boolean
      const equipmentValue =
        typeof exercise.equipment === "boolean"
          ? exercise.equipment
          : exercise.equipment === "yes" || exercise.equipment === true;

      setFormData({
        ...exercise,
        equipment: equipmentValue,
      });

      // Handle muscle groups from API structure
      const muscleGroupNames =
        exercise.muscleGroups?.map((mg) => mg.name || mg) || [];
      setSelectedMuscles(muscleGroupNames);

      if (exercise.video) {
        setVideoPreview(exercise.video);
        setVideoUrl(exercise.video);
        // If it's a URL (not a file), show the URL input
        if (!exercise.video.startsWith("blob:")) {
          setShowVideoUrlInput(true);
        }
      }

      if (exercise.imageUrl) setImagePreview(exercise.imageUrl);
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [exercise, mode, isOpen]);

  // Reset form state
  const resetForm = () => {
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
    setActiveTab("details");
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

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    // Handle video URL input
    if (fileType === "videoUrl") {
      const url = e.target.value;
      setVideoPreview(url);
      setFormData((prev) => ({ ...prev, video: url }));
      return;
    }

    const file = e.target.files?.[0];
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
      setVideoFile(file);
      setVideoUrl("");
      setShowVideoUrlInput(false);
    } else {
      setImagePreview(fileUrl);
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
      setImageFile(file);
    }
  };

  // Handle file removal
  const handleRemoveFile = (fileType) => {
    if (fileType === "video") {
      setVideoPreview(null);
      setVideoUrl("");
      setFormData((prev) => ({ ...prev, video: null }));
      setVideoFile(null);
      // Reset file input
      const videoInput = document.getElementById("video-upload");
      if (videoInput) videoInput.value = "";
    } else {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, imageUrl: null }));
      setImageFile(null);
      // Reset file input
      const imageInput = document.getElementById("image-upload");
      if (imageInput) imageInput.value = "";
    }
  };

  // Upload files to server
  const uploadFiles = async (files) => {
    const formData = new FormData();
    let hasFiles = false;

    Object.entries(files).forEach(([type, file]) => {
      if (file) {
        const uploadKey = type === "image" ? "exerciseImage" : "exerciseVideo";
        formData.append(uploadKey, file);
        hasFiles = true;
      }
    });

    if (!hasFiles) return {};

    // Reset upload progress
    setUploadProgress({ image: 0, video: 0 });
    setUploadStatus({ image: "Uploading...", video: "Uploading..." });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      // Clear upload status
      setUploadStatus({ image: "", video: "" });
      setUploadProgress({ image: 0, video: 0 });

      return await response.json();
    } catch (error) {
      // Clear upload status on error
      setUploadStatus({ image: "", video: "" });
      setUploadProgress({ image: 0, video: 0 });
      throw error;
    }
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    console.log(formData, "formData");

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.instructions.trim())
      newErrors.instructions = "Instructions are required";
    if (selectedMuscles.length === 0)
      newErrors.muscleGroups = "At least one muscle group is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(false);

      // Pripremi fajlove za upload
      const filesToUpload = {};
      if (imagePreview && imagePreview.startsWith("blob:") && imageFile) {
        filesToUpload.image = imageFile;
        setUploadStatus((prev) => ({ ...prev, image: "Uploading image..." }));
      }
      if (videoPreview && videoPreview.startsWith("blob:") && videoFile) {
        filesToUpload.video = videoFile;
        setUploadStatus((prev) => ({ ...prev, video: "Uploading video..." }));
      }
      console.log("filesToUpload", filesToUpload);

      // Prvo uploaduj fajlove, pa tek onda šalji podatke u bazu
      let uploadedUrls = {};
      if (Object.keys(filesToUpload).length > 0) {
        setIsUploading(true);
        setUploadStatus((prev) => ({
          ...prev,
          ...(filesToUpload.image && { image: "Uploading image..." }),
          ...(filesToUpload.video && { video: "Uploading video..." }),
        }));
        uploadedUrls = await uploadFiles(filesToUpload);
      }

      // Pripremi podatke za backend
      const finalFormData = {
        ...formData,
        id: formData.id || undefined,
        imageUrl: uploadedUrls.exerciseImage || formData.imageUrl,
        video: uploadedUrls.exerciseVideo || formData.video,
      };

      // Ako je video bio blob, ali nije uploadovan (npr. greška), nemoj slati blob
      if (finalFormData.video && finalFormData.video.startsWith("blob:")) {
        finalFormData.video = "";
      }
      if (
        finalFormData.imageUrl &&
        finalFormData.imageUrl.startsWith("blob:")
      ) {
        finalFormData.imageUrl = "";
      }

      await onSave(finalFormData);
    } catch (error) {
      console.error("Error saving exercise:", error);
      setErrors((prev) => ({ ...prev, upload: error.message }));
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      // Clear upload status
      setUploadStatus({ image: "", video: "" });
      setUploadProgress({ image: 0, video: 0 });
    }
  };

  // Handle exercise selection from library
  const handleSelectExerciseFromLibrary = (libraryExercise) => {
    setFormData({
      ...formData,
      name: libraryExercise.name,
      location: libraryExercise.location,
      equipment: libraryExercise.equipment,
      type: libraryExercise.type,
      level: libraryExercise.level,
      description: libraryExercise.description,
      instructions: libraryExercise.instructions,
      video: libraryExercise.video,
      imageUrl: libraryExercise.imageUrl,
    });

    // Set muscle groups
    setSelectedMuscles(libraryExercise.muscleGroups);

    // Set image preview if available
    if (libraryExercise.imageUrl) {
      setImagePreview(libraryExercise.imageUrl);
    }

    // Set video preview if available
    if (libraryExercise.video) {
      setVideoPreview(libraryExercise.video);
      setVideoUrl(libraryExercise.video);
      // If it's a URL (not a file), show the URL input
      if (!libraryExercise.video.startsWith("blob:")) {
        setShowVideoUrlInput(true);
      }
    }

    // Clear all validation errors since the form is now populated with valid data
    setErrors({});

    setShowLibrarySelector(false);
  };

  // Render view mode content
  const renderViewContent = () => {
    if (!exercise) return null;

    return (
      <div className="flex flex-col">
        {/* Tabs */}
        <div className="mb-6 flex border-b border-zinc-800">
          <Button
            variant="tab"
            isActive={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            Details
          </Button>
          <Button
            variant="tab"
            isActive={activeTab === "video"}
            onClick={() => setActiveTab("video")}
          >
            Video
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Exercise Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      Exercise Name
                    </label>
                    <p className="text-white">{exercise.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      Type
                    </label>
                    <p className="text-white capitalize">{exercise.type}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      Level
                    </label>
                    <p className="text-white capitalize">{exercise.level}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-300">
                      Location
                    </label>
                    <p className="text-white capitalize">{exercise.location}</p>
                  </div>

                  {exercise.equipment && exercise.equipment.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-zinc-300">
                        Equipment
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-zinc-700 text-zinc-300 rounded text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {exercise.muscleGroups &&
                    exercise.muscleGroups.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-zinc-300">
                          Muscle Groups
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exercise.muscleGroups.map((muscle, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-orange-900/30 text-orange-300 rounded text-xs"
                            >
                              {formatMuscleDisplayName(muscle)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {exercise.description && (
                <div>
                  <h4 className="text-md font-semibold text-white mb-2">
                    Description
                  </h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {exercise.description}
                  </p>
                </div>
              )}

              {exercise.instructions && (
                <div>
                  <h4 className="text-md font-semibold text-white mb-2">
                    Instructions
                  </h4>
                  {Array.isArray(exercise.instructions) ? (
                    <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-sm">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  ) : (
                    <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {exercise.instructions}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Visual Reference */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Visual Reference
              </h3>

              <div className="bg-]#1a1b1e] rounded-lg overflow-hidden">
                {exercise.imageUrl ? (
                  <Image
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="flex justify-center p-4">
                    <AnatomicalViewer
                      exerciseName={exercise.name}
                      muscleGroups={exercise.muscleGroups || []}
                      showBothViews={true}
                      size="medium"
                      interactive={false}
                      showMuscleInfo={false}
                      showExerciseInfo={false}
                      darkMode={true}
                      compact={false}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="w-full">
            {exercise.video ? (
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                {exercise.video.includes("youtube.com") ||
                exercise.video.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      exercise.video.match(
                        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                      )?.[1]
                    }`}
                    title={`${exercise.name} video`}
                    className="h-[500px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : exercise.video.includes("vimeo.com") ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${
                      exercise.video.match(/vimeo\.com\/(\d+)/)?.[1]
                    }`}
                    title={`${exercise.name} video`}
                    className="h-[500px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={exercise.video}
                    controls
                    className="h-[500px] w-full rounded-lg object-cover"
                    preload="metadata"
                  >
                    <source src={exercise.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-lg bg-zinc-800">
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
    <div className="w-full">
      {/* General Loading Indicator */}
      {isSubmitting && (
        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-blue-400">
              {mode === "edit"
                ? "Updating exercise..."
                : "Creating exercise..."}
            </span>
          </div>
        </div>
      )}

      {/* Exercise Library Button */}
      <div className="mb-6">
        <InfoBanner
          icon="mdi:dumbbell"
          title="Quick Start"
          subtitle="Use pre-built exercise templates"
          variant="primary"
          buttonText="Browse Templates"
          onButtonClick={() => setShowLibrarySelector(true)}
        />
      </div>

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
            value={(() => {
              const equipment = formData.equipment;
              if (typeof equipment === "boolean") {
                return equipment ? "yes" : "no";
              }
              if (equipment === "yes" || equipment === true) {
                return "yes";
              }
              if (equipment === "no" || equipment === false) {
                return "no";
              }
              return "yes"; // default
            })()}
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
            {MUSCLE_GROUPS.map((muscle) => (
              <button
                key={muscle.value}
                type="button"
                onClick={() => toggleMuscleGroup(muscle.value)}
                className={`h-9 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedMuscles.includes(muscle.value)
                    ? "bg-[#FF6B00] text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {muscle.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Reference Section */}
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Visual - Image or Anatomy */}
          <div className="h-full flex flex-col" style={{ minHeight: "450px" }}>
            <label className="mb-3 block text-sm font-medium text-gray-300">
              Exercise Visual
            </label>

            <div className="flex-1 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
              {imagePreview ? (
                // Show uploaded/selected image
                <div className="relative h-full min-h-[300px]">
                  <Image
                    src={imagePreview}
                    alt="Exercise preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      handleRemoveFile("image");
                      // Reset the file input
                      const imageInput =
                        document.getElementById("image-upload");
                      if (imageInput) imageInput.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  >
                    <Icon icon="mdi:close" width={16} height={16} />
                  </button>
                </div>
              ) : selectedMuscles.length > 0 ? (
                // Show anatomy when no image but muscle groups selected
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center p-4 bg-[#121211]">
                    <AnatomicalViewer
                      exerciseName={formData.name || "Exercise Preview"}
                      muscleGroups={selectedMuscles}
                      showBothViews={true}
                      size="medium"
                      interactive={false}
                      showMuscleInfo={false}
                      showExerciseInfo={false}
                      darkMode={true}
                      compact={false}
                    />
                  </div>
                  <div className="border-t border-zinc-700 p-3">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <Icon icon="mdi:camera-plus" width={18} height={18} />
                      <span className="text-sm font-medium">
                        Add Custom Image
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "image")}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                // Placeholder when no image and no muscle groups
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
                  <Icon
                    icon="mdi:image-plus"
                    className="text-4xl text-zinc-600 mb-3"
                  />
                  <p className="text-zinc-400 text-center mb-4">
                    Select muscle groups to see anatomy preview or upload a
                    custom image
                  </p>
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <Icon icon="mdi:camera-plus" width={18} height={18} />
                    <span className="text-sm">Upload Image</span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Upload status for image */}
            {uploadStatus.image && (
              <div className="mt-2 text-sm text-orange-400">
                {uploadStatus.image}
              </div>
            )}
            {errors.image && (
              <div className="mt-2 text-sm text-red-400">{errors.image}</div>
            )}
          </div>

          {/* Video Upload */}
          <div className="h-full flex flex-col" style={{ minHeight: "450px" }}>
            <FileUploadField
              type="video"
              label="Exercise Video (Optional)"
              preview={videoPreview}
              onFileChange={handleFileChange}
              onRemove={() => handleRemoveFile("video")}
              error={errors.video}
              uploadStatus={uploadStatus.video}
              uploadProgress={uploadProgress.video}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              showVideoUrlInput={showVideoUrlInput}
              setShowVideoUrlInput={setShowVideoUrlInput}
            />
          </div>
        </div>

        {/* Upload Progress Summary */}
        {isUploading && (
          <div className="md:col-span-2 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
              <span className="text-sm text-orange-400 font-medium">
                Uploading files...
              </span>
            </div>
            <p className="text-xs text-orange-300">
              Please wait while your files are being uploaded. This may take a
              few moments depending on file size.
            </p>
          </div>
        )}

        {/* Upload error display */}
        {errors.upload && (
          <div className="md:col-span-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{errors.upload}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Library selector modal
  const renderLibrarySelector = () => {
    if (!showLibrarySelector) return null;

    return (
      <Modal
        isOpen={showLibrarySelector}
        onClose={() => setShowLibrarySelector(false)}
        title="Exercise Templates"
        size="large"
        footerButtons={false}
        isNested={true}
      >
        <ExerciseLibrarySelector
          onSelectExercise={handleSelectExerciseFromLibrary}
          onClose={() => setShowLibrarySelector(false)}
        />
      </Modal>
    );
  };

  // Main modal content
  const modalContent =
    mode === "view" ? renderViewContent() : renderFormContent();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
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
        size="large"
        primaryButtonText={
          mode === "view"
            ? "Close"
            : mode === "edit"
            ? isUploading
              ? "Uploading files..."
              : isSubmitting
              ? "Updating exercise..."
              : "Update Exercise"
            : isUploading
            ? "Uploading files..."
            : isSubmitting
            ? "Creating exercise..."
            : "Save Exercise"
        }
        secondaryButtonText={mode !== "view" ? "Cancel" : undefined}
        primaryButtonAction={mode === "view" ? onClose : handleSubmit}
        secondaryButtonAction={onClose}
        primaryButtonDisabled={isUploading || isSubmitting}
      >
        {modalContent}
      </Modal>

      {/* Library selector modal */}
      {renderLibrarySelector()}
    </>
  );
};
