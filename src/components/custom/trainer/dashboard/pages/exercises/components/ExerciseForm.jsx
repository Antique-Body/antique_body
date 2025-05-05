"use client";

import { Button } from "@/components/common/Button";
import { SaveIcon, TrashIcon } from "@/components/common/Icons";
import { FormField } from "@/components/common/FormField";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ExerciseForm = ({ exercise = null, onSave, onCancel }) => {
    const isEditMode = !!exercise;

    const [formData, setFormData] = useState({
        id: null,
        name: "",
        location: "gym",
        equipment: "yes",
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

    // Load exercise data if in edit mode
    useEffect(() => {
        if (exercise) {
            setFormData({
                ...exercise,
            });
            setSelectedMuscles(exercise.muscleGroups || []);
            if (exercise.video) setVideoPreview(exercise.video);
            if (exercise.imageUrl) setImagePreview(exercise.imageUrl);
        }
    }, [exercise]);

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
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.instructions.trim()) newErrors.instructions = "Instructions are required";
        if (selectedMuscles.length === 0) newErrors.muscleGroups = "At least one muscle group is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

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

    return (
        <form onSubmit={handleSubmit} className="w-full">
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

                <div className="flex flex-col">
                    <FormField
                        type="select"
                        label="Equipment Required"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
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
                        {errors.muscleGroups && <span className="ml-2 text-red-500">{errors.muscleGroups}</span>}
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
                    <FormField
                        type="file"
                        label="Exercise Image"
                        name="exerciseImage"
                        accept="image/*"
                        subLabel="Upload an image of the exercise (JPG, PNG)"
                        onChange={(e) => handleFileChange(e, "image")}
                    />
                    {imagePreview && (
                        <div className="mt-3 flex items-start gap-3">
                            <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-700 shadow-lg">
                                <Image src={imagePreview} alt="Exercise preview" fill sizes="112px" className="object-cover" />
                            </div>
                            <Button
                                variant="dangerOutline"
                                size="small"
                                leftIcon={<TrashIcon size={14} />}
                                onClick={() => {
                                    setImagePreview(null);
                                    setFormData((prev) => ({ ...prev, imageUrl: null }));
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>

                {/* Video Upload */}
                <div>
                    <FormField
                        type="file"
                        label="Exercise Video"
                        name="exerciseVideo"
                        accept="video/*"
                        subLabel="Upload a video demonstration (MP4, MOV)"
                        onChange={(e) => handleFileChange(e, "video")}
                    />
                    {videoPreview && (
                        <div className="mt-3 flex items-start gap-3">
                            <div className="h-28 w-28 overflow-hidden rounded-lg border border-gray-700 shadow-lg">
                                <video src={videoPreview} className="h-full w-full object-cover" />
                            </div>
                            <Button
                                variant="dangerOutline"
                                size="small"
                                leftIcon={<TrashIcon size={14} />}
                                onClick={() => {
                                    setVideoPreview(null);
                                    setFormData((prev) => ({ ...prev, video: null }));
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="orangeFilled" type="submit" leftIcon={<SaveIcon size={16} />}>
                    {isEditMode ? "Update Exercise" : "Save Exercise"}
                </Button>
            </div>
        </form>
    );
};
