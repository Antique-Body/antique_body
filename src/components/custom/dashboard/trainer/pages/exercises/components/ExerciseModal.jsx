"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AnatomicalViewer } from "./AnatomicalViewer";
import exerciseLibrary from "./exerciseLibrary.json";
import { ExerciseLibrarySelector } from "./ExerciseLibrarySelector";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { FileUploadField } from "@/components/custom/dashboard/shared";
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
    videoUrl: null,
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

  // Dodaj stateove za autocomplete
  const [nameInput, setNameInput] = useState(formData.name || "");
  const [suggestions, setSuggestions] = useState([]);

  // Sinkronizuj nameInput i formData.name
  useEffect(() => {
    setNameInput(formData.name || "");
  }, [formData.name]);

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

      if (exercise.videoUrl) {
        setVideoPreview(exercise.videoUrl);
        setVideoUrl(exercise.videoUrl);
        // If it's a URL (not a file), show the URL input
        if (!exercise.videoUrl.startsWith("blob:")) {
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
      videoUrl: null,
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

  // Funkcija za filtriranje prijedloga
  const handleNameChange = (e) => {
    const value = e.target.value;
    setNameInput(value);
    setFormData((prev) => ({ ...prev, name: value }));

    if (value.length > 1) {
      const filtered = exerciseLibrary.filter((ex) =>
        ex.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Funkcija za popunjavanje iz predloška
  const handleSuggestionClick = (template) => {
    setFormData((prev) => ({
      ...prev,
      ...template,
      instructions: template.instructions, // ako je string, ili join('\n') za textarea
    }));
    setSelectedMuscles(template.muscleGroups || []);
    setNameInput(template.name);
    setSuggestions([]);
    setImagePreview(template.imageUrl || null);
    setVideoPreview(template.videoUrl || null);
    setVideoUrl(template.videoUrl || "");
  };

  // (Opcionalno) Zatvori suggestions kad klikneš vani
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".suggestions-dropdown")) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setFormData((prev) => ({ ...prev, videoUrl: fileUrl }));
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
      setFormData((prev) => ({ ...prev, videoUrl: null }));
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
        videoUrl: uploadedUrls.exerciseVideo || formData.videoUrl,
      };

      // Ako je video bio blob, ali nije uploadovan (npr. greška), nemoj slati blob
      if (finalFormData.videoUrl?.startsWith("blob:")) {
        finalFormData.videoUrl = "";
      }
      if (
        finalFormData.imageUrl &&
        finalFormData.imageUrl.startsWith("blob:")
      ) {
        finalFormData.imageUrl = "";
      }

      await onSave(finalFormData);
      onClose();
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
      videoUrl: libraryExercise.videoUrl,
      imageUrl: libraryExercise.imageUrl,
    });

    // Set muscle groups
    setSelectedMuscles(libraryExercise.muscleGroups);

    // Set image preview if available
    if (libraryExercise.imageUrl) {
      setImagePreview(libraryExercise.imageUrl);
    }

    // Set video preview if available
    if (libraryExercise.videoUrl) {
      setVideoPreview(libraryExercise.videoUrl);
      setVideoUrl(libraryExercise.videoUrl);
      // If it's a URL (not a file), show the URL input
      if (!libraryExercise.videoUrl.startsWith("blob:")) {
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
                      bodyColor="white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "video" && (
          <div className="w-full flex items-center justify-center min-h-[37rem]">
            {exercise.videoUrl ? (
              <div className="h-[37rem] w-[60rem] overflow-hidden rounded-lg flex items-center justify-center">
                {exercise.videoUrl.includes("youtube.com") ||
                exercise.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      exercise.videoUrl.match(
                        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/
                      )?.[1]
                    }`}
                    title={`${exercise.name} video`}
                    className="h-[500px] w-full rounded-lg"
                    allowFullScreen
                  />
                ) : exercise.videoUrl.includes("vimeo.com") ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${
                      exercise.videoUrl.match(/vimeo\.com\/(\d+)/)?.[1]
                    }`}
                    title={`${exercise.name} video`}
                    className="h-[500px] w-full rounded-lg"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={exercise.videoUrl}
                    controls
                    className="h-[500px] w-full rounded-lg object-cover"
                    preload="metadata"
                  >
                    <source src={exercise.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="flex h-[500px] w-[60rem] flex-col items-center justify-center rounded-lg bg-zinc-800">
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
        <div className="md:col-span-2 relative">
          <FormField
            type="text"
            label="Exercise Name"
            name="name"
            value={nameInput}
            onChange={handleNameChange}
            placeholder="e.g., Barbell Squat"
            error={errors.name}
            required
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-20 bg-zinc-900 border border-zinc-700 rounded w-full mt-1 max-h-56 overflow-y-auto shadow-lg suggestions-dropdown">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-2 cursor-pointer hover:bg-zinc-800 text-zinc-200"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s.name}
                </div>
              ))}
              <div className="border-t border-zinc-700">
                <button
                  className="w-full text-left px-4 py-2 text-orange-400 hover:bg-zinc-800"
                  onClick={() => handleSuggestionClick(suggestions[0])}
                >
                  Popuni ostale podatke za "{suggestions[0].name}"
                </button>
              </div>
            </div>
          )}
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
                      bodyColor="white"
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
        primaryButtonText="Cancel"
        primaryButtonAction={() => setShowLibrarySelector(false)}
        footerButtons={true}
        isNested={true}
      >
        <ExerciseLibrarySelector
          useStaticData={true}
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
