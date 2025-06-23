"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { ExerciseLibrarySelector } from "./ExerciseLibrarySelector";
import { FileUploadField } from "./FileUploadField";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import { UPLOAD_CONFIG } from "@/config/upload";
import {
  EXERCISE_TYPES,
  EXERCISE_LEVELS,
  EXERCISE_LOCATIONS,
  EQUIPMENT_OPTIONS,
  MUSCLE_GROUPS,
} from "@/enums";

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
      // Reset video URL input when file is uploaded
      setVideoUrl("");
      setShowVideoUrlInput(false);
    } else {
      setImagePreview(fileUrl);
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
    }
  };

  // Handle file removal
  const handleRemoveFile = (fileType) => {
    if (fileType === "video") {
      setVideoPreview(null);
      setVideoUrl("");
      setFormData((prev) => ({ ...prev, video: null }));
      // Reset file input
      const videoInput = document.getElementById("video-upload");
      if (videoInput) videoInput.value = "";
    } else {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, imageUrl: null }));
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

      // Check if there are files to upload
      const filesToUpload = {};
      if (imagePreview && imagePreview.startsWith("blob:")) {
        // Get file from input
        const imageInput = document.getElementById("image-upload");
        if (imageInput?.files[0]) {
          filesToUpload.image = imageInput.files[0];
          setUploadStatus((prev) => ({ ...prev, image: "Uploading image..." }));
        }
      }
      if (videoPreview && videoPreview.startsWith("blob:")) {
        const videoInput = document.getElementById("video-upload");
        if (videoInput?.files[0]) {
          filesToUpload.video = videoInput.files[0];
          setUploadStatus((prev) => ({ ...prev, video: "Uploading video..." }));
        }
      }

      // If there are files to upload, show upload progress
      if (Object.keys(filesToUpload).length > 0) {
        setIsUploading(true);
        setUploadStatus((prev) => ({
          ...prev,
          ...(filesToUpload.image && { image: "Uploading image..." }),
          ...(filesToUpload.video && { video: "Uploading video..." }),
        }));
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
                      {(muscle.name || muscle).charAt(0).toUpperCase() +
                        (muscle.name || muscle).slice(1)}
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
                {exercise.video.includes("youtube.com") ||
                exercise.video.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      exercise.video.match(
                        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                      )?.[1]
                    }`}
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
      <div className="mb-4">
        <Button
          variant="outlineOrange"
          size="small"
          leftIcon={<Icon icon="mdi:book-open-variant" className="w-5 h-5" />}
          onClick={() => setShowLibrarySelector(true)}
        >
          Browse Exercise Templates
        </Button>
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

        {/* Media Upload Section */}
        <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div className="h-full flex flex-col" style={{ minHeight: "450px" }}>
            <FileUploadField
              type="image"
              label="Exercise Image"
              preview={imagePreview}
              onFileChange={handleFileChange}
              onRemove={() => handleRemoveFile("image")}
              error={errors.image}
              uploadStatus={uploadStatus.image}
              uploadProgress={uploadProgress.image}
            />
          </div>

          {/* Video Upload */}
          <div className="h-full flex flex-col" style={{ minHeight: "450px" }}>
            <FileUploadField
              type="video"
              label="Exercise Video"
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
