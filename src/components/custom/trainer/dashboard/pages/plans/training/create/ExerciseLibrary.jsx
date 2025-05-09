"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { ImageIcon, PlusIcon, SearchIcon, TrashIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

// Mock exercise categories for demonstration
const EXERCISE_CATEGORIES = ["All", "Strength", "Cardio", "Flexibility", "Balance", "Core", "Upper Body", "Lower Body"];

export const ExerciseLibrary = ({ exerciseLibrary, updateExerciseLibrary }) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [newExercise, setNewExercise] = useState({
        name: "",
        category: "Strength",
        description: "",
        image: null,
        targetMuscles: "",
    });
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewExercise({
                ...newExercise,
                image: file,
            });

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExercise((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addExercise = () => {
        if (newExercise.name.trim()) {
            const exercise = {
                id: crypto.randomUUID(),
                ...newExercise,
                image: previewImage || null,
            };

            updateExerciseLibrary([...exerciseLibrary, exercise]);

            // Reset form
            setNewExercise({
                name: "",
                category: "Strength",
                description: "",
                image: null,
                targetMuscles: "",
            });
            setPreviewImage(null);
        }
    };

    const removeExercise = (exerciseId) => {
        updateExerciseLibrary(exerciseLibrary.filter((exercise) => exercise.id !== exerciseId));
    };

    // Filter exercises based on category and search term
    const filteredExercises = exerciseLibrary.filter((exercise) => {
        const matchesCategory = activeCategory === "All" || exercise.category === activeCategory;
        const matchesSearch =
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.targetMuscles.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">Exercise Library</h3>
                            <div className="relative">
                                <SearchIcon
                                    size={18}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search exercises..."
                                    className="pl-10 pr-4 py-2 bg-[#222] border border-[#333] rounded-full text-white w-64"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {EXERCISE_CATEGORIES.map((category) => (
                                <Button
                                    key={category}
                                    variant={activeCategory === category ? "orangeFilled" : "secondary"}
                                    size="small"
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredExercises.map((exercise) => (
                            <Card key={exercise.id} variant="dark" className="p-0">
                                <div className="flex flex-col h-full">
                                    {exercise.image ? (
                                        <div className="relative h-40 w-full">
                                            <Image
                                                src={exercise.image}
                                                alt={exercise.name}
                                                fill
                                                className="object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-2 right-2 bg-[rgba(0,0,0,0.6)] px-2 py-1 rounded text-xs">
                                                {exercise.category}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-[#222] flex items-center justify-center rounded-t-lg relative">
                                            <ImageIcon size={40} className="text-[#333]" />
                                            <div className="absolute top-2 right-2 bg-[rgba(0,0,0,0.6)] px-2 py-1 rounded text-xs">
                                                {exercise.category}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 flex-1">
                                        <h4 className="font-semibold text-white mb-1">{exercise.name}</h4>
                                        <p className="text-sm text-gray-400 mb-2">{exercise.targetMuscles}</p>

                                        {exercise.description && (
                                            <p className="text-sm text-gray-300 mt-2 mb-3">{exercise.description}</p>
                                        )}
                                    </div>

                                    <div className="p-3 border-t border-[#333] flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="small"
                                            onClick={() => removeExercise(exercise.id)}
                                            leftIcon={<TrashIcon size={16} />}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {filteredExercises.length === 0 && (
                        <div className="text-center p-8 bg-[#1a1a1a] rounded-lg border border-dashed border-[#333]">
                            <p className="text-gray-400 mb-4">No exercises found</p>
                        </div>
                    )}
                </div>

                <div>
                    <Card variant="dark">
                        <h3 className="text-lg font-semibold text-white mb-4">Add New Exercise</h3>

                        <FormField
                            label="Exercise Name"
                            name="name"
                            value={newExercise.name}
                            onChange={handleChange}
                            placeholder="e.g., Barbell Squat"
                            backgroundStyle="darker"
                        />

                        <FormField
                            label="Category"
                            name="category"
                            type="select"
                            value={newExercise.category}
                            onChange={handleChange}
                            options={EXERCISE_CATEGORIES.filter((cat) => cat !== "All")}
                            backgroundStyle="darker"
                        />

                        <FormField
                            label="Target Muscles"
                            name="targetMuscles"
                            value={newExercise.targetMuscles}
                            onChange={handleChange}
                            placeholder="e.g., Quadriceps, Glutes, Hamstrings"
                            backgroundStyle="darker"
                        />

                        <FormField
                            label="Description"
                            name="description"
                            type="textarea"
                            rows={3}
                            value={newExercise.description}
                            onChange={handleChange}
                            placeholder="Brief description of the exercise..."
                            backgroundStyle="darker"
                        />

                        <div className="mb-4">
                            <label className="mb-2 block text-gray-300">Exercise Image</label>

                            {previewImage ? (
                                <div className="relative w-full h-40 mb-2 rounded-md overflow-hidden">
                                    <Image src={previewImage} alt="Exercise preview" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-full h-40 mb-2 bg-[#222] rounded-md flex items-center justify-center">
                                    <ImageIcon size={40} className="text-[#333]" />
                                </div>
                            )}

                            <input
                                type="file"
                                id="exercise-image"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <label
                                htmlFor="exercise-image"
                                className="cursor-pointer inline-block bg-[#333] hover:bg-[#444] text-gray-300 px-4 py-2 rounded transition-colors"
                            >
                                Choose Image
                            </label>
                        </div>

                        <Button
                            variant="orangeFilled"
                            onClick={addExercise}
                            leftIcon={<PlusIcon size={16} />}
                            disabled={!newExercise.name.trim()}
                            fullWidth
                        >
                            Add to Library
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};
