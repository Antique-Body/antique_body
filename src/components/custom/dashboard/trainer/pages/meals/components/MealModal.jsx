"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { MealLibrarySelector } from "./MealLibrarySelector";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { FileUploadField } from "@/components/custom/dashboard/shared";
import { UPLOAD_CONFIG } from "@/config/upload";
import {
  MEAL_TYPES,
  MEAL_DIFFICULTY_LEVELS,
  DIETARY_PREFERENCES,
  CUISINE_TYPES,
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

export const MealModal = ({ isOpen, onClose, mode = "view", meal, onSave }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showLibrarySelector, setShowLibrarySelector] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    mealType: "breakfast",
    difficulty: "easy",
    preparationTime: 15,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    dietary: [],
    cuisine: "other",
    ingredients: "",
    recipe: "",
    imageUrl: null,
    video: null,
  });

  // UI state
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ image: 0, video: 0 });
  const [uploadStatus, setUploadStatus] = useState({ image: "", video: "" });
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);

  // Load meal data if in edit mode
  useEffect(() => {
    if (meal && (mode === "edit" || mode === "view")) {
      setFormData({
        ...meal,
        preparationTime: meal.preparationTime || 15,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
      });

      // Handle dietary preferences from API structure
      const dietaryPreferences = meal.dietary || [];
      setSelectedDietary(dietaryPreferences);

      if (meal.video) {
        setVideoPreview(meal.video);
        setVideoUrl(meal.video);
        // If it's a URL (not a file), show the URL input
        if (!meal.video.startsWith("blob:")) {
          setShowVideoUrlInput(true);
        }
      }

      if (meal.imageUrl) setImagePreview(meal.imageUrl);
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [meal, mode, isOpen]);

  // Reset form state
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      mealType: "breakfast",
      difficulty: "easy",
      preparationTime: 15,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      dietary: [],
      cuisine: "other",
      ingredients: "",
      recipe: "",
      imageUrl: null,
      video: null,
    });
    setSelectedDietary([]);
    setImagePreview(null);
    setVideoPreview(null);
    setVideoUrl("");
    setShowVideoUrlInput(false);
    setErrors({});
    setActiveTab("details");
  };

  // Update formData when selectedDietary changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dietary: selectedDietary,
    }));

    // Clear dietary error if dietary preferences are selected
    if (selectedDietary.length > 0 && errors.dietary) {
      setErrors((prev) => ({ ...prev, dietary: null }));
    }
  }, [selectedDietary, errors.dietary]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle dietary preference selection
  const toggleDietaryPreference = (dietary) => {
    setSelectedDietary((prev) => {
      const newSelectedDietary = prev.includes(dietary)
        ? prev.filter((d) => d !== dietary)
        : [...prev, dietary];

      // Clear dietary error if dietary preferences are selected
      if (newSelectedDietary.length > 0 && errors.dietary) {
        setErrors((prev) => ({ ...prev, dietary: null }));
      }

      return newSelectedDietary;
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

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.ingredients.trim())
      newErrors.ingredients = "Ingredients are required";
    if (!formData.recipe.trim())
      newErrors.recipe = "Recipe instructions are required";

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
        id: formData.id || undefined, // Remove ID for new meals
        imageUrl: uploadedUrls.exerciseImage || formData.imageUrl,
        video: uploadedUrls.exerciseVideo || formData.video, // Video URL will be preserved if it's not a blob
      };

      // Call the save function
      await onSave(finalFormData);
    } catch (error) {
      console.error("Error saving meal:", error);
      setErrors((prev) => ({ ...prev, upload: error.message }));
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      // Clear upload status
      setUploadStatus({ image: "", video: "" });
      setUploadProgress({ image: 0, video: 0 });
    }
  };

  // Handle meal selection from library
  const handleSelectMealFromLibrary = (libraryMeal) => {
    setFormData({
      ...formData,
      name: libraryMeal.name,
      mealType: libraryMeal.mealType,
      difficulty: libraryMeal.difficulty,
      preparationTime: libraryMeal.preparationTime,
      calories: libraryMeal.calories,
      protein: libraryMeal.protein,
      carbs: libraryMeal.carbs,
      fat: libraryMeal.fat,
      cuisine: libraryMeal.cuisine,
      ingredients: libraryMeal.ingredients,
      recipe: libraryMeal.recipe,
      video: libraryMeal.video,
      imageUrl: libraryMeal.imageUrl,
    });

    // Set dietary preferences
    setSelectedDietary(libraryMeal.dietary || []);

    // Set image preview if available
    if (libraryMeal.imageUrl) {
      setImagePreview(libraryMeal.imageUrl);
    }

    // Set video preview if available
    if (libraryMeal.video) {
      setVideoPreview(libraryMeal.video);
      setVideoUrl(libraryMeal.video);
      // If it's a URL (not a file), show the URL input
      if (!libraryMeal.video.startsWith("blob:")) {
        setShowVideoUrlInput(true);
      }
    }

    // Clear all validation errors since the form is now populated with valid data
    setErrors({});

    setShowLibrarySelector(false);
  };

  // Render view mode content
  const renderViewContent = () => {
    if (!meal) return null;

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
                    meal.imageUrl ||
                    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                  }
                  alt={meal.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Basic info badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                  <Icon
                    icon="mdi:silverware-fork-knife"
                    className="mr-2 text-[#FF7800]"
                    width={16}
                    height={16}
                  />
                  <span>
                    {meal.mealType.charAt(0).toUpperCase() +
                      meal.mealType.slice(1)}
                  </span>
                </div>
                <div className="flex items-center rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                  <Icon
                    icon="mdi:clock"
                    className="mr-2 text-[#FF7800]"
                    width={16}
                    height={16}
                  />
                  <span>{meal.preparationTime} min</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="w-full md:w-2/3">
              <h2 className="mb-4 text-2xl font-bold">{meal.name}</h2>

              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`inline-block rounded-md px-2 py-1 text-sm font-semibold ${
                    meal.mealType === "breakfast"
                      ? "bg-yellow-900/60 text-yellow-200"
                      : meal.mealType === "lunch"
                      ? "bg-blue-900/60 text-blue-200"
                      : meal.mealType === "dinner"
                      ? "bg-purple-900/60 text-purple-200"
                      : meal.mealType === "snack"
                      ? "bg-green-900/60 text-green-200"
                      : "bg-pink-900/60 text-pink-200"
                  }`}
                >
                  {meal.mealType.charAt(0).toUpperCase() +
                    meal.mealType.slice(1)}
                </span>

                <span
                  className={`inline-block rounded-md px-2 py-1 text-sm font-semibold ${
                    meal.difficulty === "easy"
                      ? "bg-green-900/40 text-green-300"
                      : meal.difficulty === "medium"
                      ? "bg-orange-900/40 text-orange-300"
                      : "bg-red-900/40 text-red-300"
                  }`}
                >
                  {meal.difficulty.charAt(0).toUpperCase() +
                    meal.difficulty.slice(1)}
                </span>
              </div>

              {/* Nutrition Info */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Nutrition Information
                </h3>
                <div className="flex flex-wrap gap-2">
                  <div className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                    <Icon
                      icon="mdi:fire"
                      className="inline mr-1 text-[#FF7800]"
                      width={14}
                      height={14}
                    />
                    {meal.calories} cal
                  </div>
                  <div className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                    P: {meal.protein}g
                  </div>
                  <div className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                    C: {meal.carbs}g
                  </div>
                  <div className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm">
                    F: {meal.fat}g
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Ingredients
                </h3>
                <p className="text-gray-200">{meal.ingredients}</p>
              </div>

              {/* Recipe Instructions */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-400">
                  Recipe Instructions
                </h3>
                <p className="text-gray-200">{meal.recipe}</p>
              </div>

              {/* Dietary Preferences */}
              {meal.dietary && meal.dietary.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-400">
                    Dietary Preferences
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {meal.dietary.map((diet, index) => (
                      <div
                        key={index}
                        className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-sm text-[#FF6B00]"
                      >
                        {diet.charAt(0).toUpperCase() + diet.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {meal.video ? (
              <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
                {meal.video.includes("youtube.com") ||
                meal.video.includes("youtu.be") ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      meal.video.match(
                        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
                      )?.[1]
                    }`}
                    title={`${meal.name} video`}
                    className="h-[400px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : meal.video.includes("vimeo.com") ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${
                      meal.video.match(/vimeo\.com\/(\d+)/)?.[1]
                    }`}
                    title={`${meal.name} video`}
                    className="h-[400px] w-full rounded-lg"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={meal.video}
                    controls
                    className="h-[400px] w-full rounded-lg"
                    preload="metadata"
                  >
                    <source src={meal.video} type="video/mp4" />
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
              {mode === "edit" ? "Updating meal..." : "Creating meal..."}
            </span>
          </div>
        </div>
      )}

      {/* Meal Library Button */}
      <div className="mb-6">
        <InfoBanner
          icon="mdi:chef-hat"
          title="Quick Start"
          subtitle="Use pre-built meal templates"
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
            label="Meal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken Salad"
            error={errors.name}
            required
          />
        </div>

        {/* Meal Type & Difficulty */}
        <div>
          <FormField
            type="select"
            label="Meal Type"
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            options={MEAL_TYPES}
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Difficulty Level"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            options={MEAL_DIFFICULTY_LEVELS}
          />
        </div>

        {/* Preparation Time & Cuisine */}
        <div>
          <FormField
            type="number"
            label="Preparation Time (minutes)"
            name="preparationTime"
            value={formData.preparationTime}
            onChange={handleChange}
            placeholder="15"
            min="1"
          />
        </div>

        <div>
          <FormField
            type="select"
            label="Cuisine Type"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            options={CUISINE_TYPES}
          />
        </div>

        {/* Nutrition Info */}
        <div>
          <FormField
            type="number"
            label="Calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <FormField
            type="number"
            label="Protein (g)"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <FormField
            type="number"
            label="Carbs (g)"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <FormField
            type="number"
            label="Fat (g)"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>

        {/* Ingredients */}
        <div className="md:col-span-2">
          <FormField
            type="textarea"
            label="Ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="List all ingredients with quantities..."
            rows={3}
            error={errors.ingredients}
            required
          />
        </div>

        {/* Recipe Instructions */}
        <div className="md:col-span-2">
          <FormField
            type="textarea"
            label="Recipe Instructions"
            name="recipe"
            value={formData.recipe}
            onChange={handleChange}
            placeholder="Step-by-step cooking instructions..."
            rows={4}
            error={errors.recipe}
            required
          />
        </div>

        {/* Dietary Preferences */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Dietary Preferences
            {errors.dietary && (
              <span className="ml-2 text-red-500 text-xs">
                {errors.dietary}
              </span>
            )}
          </label>
          <div className="mb-5 flex flex-wrap gap-2">
            {DIETARY_PREFERENCES.map((dietary) => (
              <button
                key={dietary.value}
                type="button"
                onClick={() => toggleDietaryPreference(dietary.value)}
                className={`h-9 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedDietary.includes(dietary.value)
                    ? "bg-[#FF6B00] text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                }`}
              >
                {dietary.label}
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
              label="Meal Image"
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
              label="Meal Video"
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
        title="Meal Templates"
        size="large"
        footerButtons={false}
        isNested={true}
      >
        <MealLibrarySelector
          onSelectMeal={handleSelectMealFromLibrary}
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
                  ? "mdi:silverware-fork-knife"
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
                ? meal?.name
                : mode === "edit"
                ? "Edit Meal"
                : "Create New Meal"}
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
              ? "Updating meal..."
              : "Update Meal"
            : isUploading
            ? "Uploading files..."
            : isSubmitting
            ? "Creating meal..."
            : "Save Meal"
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
