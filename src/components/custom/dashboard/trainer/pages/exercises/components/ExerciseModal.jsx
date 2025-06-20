"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";

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

  // Extract YouTube video ID if available
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = formData?.video ? getYouTubeVideoId(formData.video) : null;

  // Load exercise data if in edit mode
  useEffect(() => {
    if (exercise && (mode === "edit" || mode === "view")) {
      setFormData({
        ...exercise,
      });
      setSelectedMuscles(exercise.muscleGroups || []);
      if (exercise.video) setVideoPreview(exercise.video);
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
      setErrors({});
    }
  }, [exercise, mode, isOpen]);

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
      if (prev.includes(muscle)) {
        return prev.filter((m) => m !== muscle);
      } else {
        return [...prev, muscle];
      }
    });
  };

  // Update formData when selectedMuscles changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      muscleGroups: selectedMuscles,
    }));
  }, [selectedMuscles]);

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you'd upload the file to a server
    // For now, create a preview URL
    const fileUrl = URL.createObjectURL(file);

    if (fileType === "video") {
      setVideoPreview(fileUrl);
      setFormData((prev) => ({ ...prev, video: fileUrl }));
    } else {
      setImagePreview(fileUrl);
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
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
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      // Generate ID if creating new exercise
      const updatedFormData = {
        ...formData,
        id: formData.id || Date.now(),
      };

      onSave(updatedFormData);
    }
  };

  // Available muscle groups
  const muscleGroups = [
    "chest",
    "back",
    "shoulders",
    "biceps",
    "triceps",
    "forearms",
    "quadriceps",
    "hamstrings",
    "glutes",
    "calves",
    "abs",
    "obliques",
    "lower back",
    "trapezius",
  ];

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
                  src={exercise.imageUrl || "/images/placeholder-exercise.jpg"}
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
                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {videoId ? (
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${exercise.name} video`}
                  className="h-[400px] w-full rounded-lg"
                  allowFullScreen
                ></iframe>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            options={[
              { value: "gym", label: "Gym" },
              { value: "home", label: "Home" },
            ]}
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
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
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
            options={[
              { value: "strength", label: "Strength" },
              { value: "bodyweight", label: "Bodyweight" },
              { value: "cardio", label: "Cardio" },
              { value: "flexibility", label: "Flexibility" },
              { value: "balance", label: "Balance" },
            ]}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Athlete Level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
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
          <div className="mb-4 flex flex-wrap gap-2">
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

        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Exercise Image
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Upload an image of the exercise (JPG, PNG)
          </p>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-zinc-700 rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mt-3 flex items-start gap-3">
                  <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-700 shadow-lg">
                    <Image
                      src={imagePreview}
                      alt="Exercise preview"
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    leftIcon={
                      <Icon icon="mdi:trash-can" width={14} height={14} />
                    }
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, imageUrl: null }));
                    }}
                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Icon
                    icon="mdi:image-plus"
                    className="mx-auto h-12 w-12 text-zinc-500"
                  />
                  <div className="flex text-sm text-zinc-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer rounded-md font-medium text-[#FF7800] hover:text-[#FF9A00] focus-within:outline-none"
                    >
                      <span>Upload an image</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "image")}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Exercise Video
          </label>
          <p className="mb-2 text-xs text-gray-500">
            Upload a video demonstration (MP4, MOV)
          </p>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-zinc-700 rounded-md">
            <div className="space-y-1 text-center">
              {videoPreview ? (
                <div className="mt-3 flex items-start gap-3">
                  <div className="h-28 w-28 overflow-hidden rounded-lg border border-gray-700 shadow-lg">
                    <video
                      src={videoPreview}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    leftIcon={
                      <Icon icon="mdi:trash-can" width={14} height={14} />
                    }
                    onClick={() => {
                      setVideoPreview(null);
                      setFormData((prev) => ({ ...prev, video: null }));
                    }}
                    className="bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <>
                  <Icon
                    icon="mdi:video-plus"
                    className="mx-auto h-12 w-12 text-zinc-500"
                  />
                  <div className="flex text-sm text-zinc-400">
                    <label
                      htmlFor="video-upload"
                      className="relative cursor-pointer rounded-md font-medium text-[#FF7800] hover:text-[#FF9A00] focus-within:outline-none"
                    >
                      <span>Upload a video</span>
                      <input
                        id="video-upload"
                        name="video-upload"
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, "video")}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-zinc-500">MP4, MOV up to 50MB</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
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
      primaryButtonDisabled={
        mode === "view" ? false : Object.keys(errors).length > 0
      }
    >
      {mode === "view" ? renderViewContent() : renderFormContent()}
    </Modal>
  );
};
