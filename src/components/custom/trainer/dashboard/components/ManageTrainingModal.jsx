"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import { Card } from "@/components/custom/Card";

// Animation variants
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Mock exercises data
const mockExercises = [
    {
        id: 1,
        name: "Barbell Squat",
        sets: [
            { id: 1, weight: 80, reps: 12, completed: false },
            { id: 2, weight: 80, reps: 12, completed: false },
            { id: 3, weight: 80, reps: 12, completed: false },
        ],
        notes: "Focus on form and depth",
        videoUrl: null,
        imageUrl: null,
        muscleGroup: "Legs",
        backgroundImage: "https://cdn.mos.cms.futurecdn.net/4gmHkwb28RFFM2QKFBZHJ7.jpg",
    },
    {
        id: 2,
        name: "Bench Press",
        sets: [
            { id: 1, weight: 65, reps: 10, completed: false },
            { id: 2, weight: 65, reps: 10, completed: false },
            { id: 3, weight: 65, reps: 10, completed: false },
            { id: 4, weight: 65, reps: 10, completed: false },
        ],
        notes: "Keep elbows at 45 degrees",
        videoUrl: null,
        imageUrl: null,
        muscleGroup: "Chest",
        backgroundImage:
            "https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F2bMyO0jZaRJjfRptw60iwG%2F17c391156dd01ae6920c672cc2744fb1%2Fdesktop-bench-press.jpg&w=3840&q=85",
    },
    {
        id: 3,
        name: "Pull-ups",
        sets: [
            { id: 1, weight: "Bodyweight", reps: "Max", completed: false },
            { id: 2, weight: "Bodyweight", reps: "Max", completed: false },
            { id: 3, weight: "Bodyweight", reps: "Max", completed: false },
        ],
        notes: "Full range of motion",
        videoUrl: null,
        imageUrl: null,
        muscleGroup: "Back",
        backgroundImage: "https://hips.hearstapps.com/hmg-prod/images/mh0418-fit-pul-01-1558554157.jpg",
    },
];

// Exercise Library Data
const exerciseLibrary = [
    {
        id: 101,
        name: "Deadlift",
        muscleGroup: "Back",
        description: "Compound exercise targeting the entire posterior chain",
        imageUrl:
            "https://images.ctfassets.net/8urtyqugdt2l/5ZN0GgcR2fSncFwnKuL1RP/e603ba111e193d35510142c7eff9aae4/desktop-deadlift.jpg",
        defaultSets: 3,
        defaultReps: 8,
    },
    {
        id: 102,
        name: "Overhead Press",
        muscleGroup: "Shoulders",
        description: "Compound movement for shoulder development",
        imageUrl:
            "https://shop.bodybuilding.com/cdn/shop/articles/how-to-overhead-press-a-beginners-guide-312661.jpg?v=1731882791",
        defaultSets: 3,
        defaultReps: 10,
    },
];

const muscleGroups = ["All", "Back", "Chest", "Legs", "Shoulders", "Arms", "Core"];

// Main Component
export const ManageTrainingModal = ({ isOpen, onClose, onSave, training, isPastTraining = false }) => {
    const [exercises, setExercises] = useState(mockExercises);
    const [expandedExercise, setExpandedExercise] = useState(1);
    const [view, setView] = useState("main"); // 'main' or 'addExercise'
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const handleDeleteExercise = (exerciseId) => {
        setExercises((prevExercises) => prevExercises.filter((ex) => ex.id !== exerciseId));
    };

    const handleFinishTraining = () => {
        onSave({ ...training, exercises, status: "completed" });
        onClose();
    };

    const handleSetCompleted = (exerciseId, setId) => {
        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.id === exerciseId
                    ? {
                          ...ex,
                          sets: ex.sets.map((set) => (set.id === setId ? { ...set, completed: !set.completed } : set)),
                      }
                    : ex
            )
        );
    };

    const handleSetWeightChange = (exerciseId, setId, newWeight) => {
        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.id === exerciseId
                    ? {
                          ...ex,
                          sets: ex.sets.map((set) => (set.id === setId ? { ...set, weight: newWeight } : set)),
                      }
                    : ex
            )
        );
    };

    const handleSetRepsChange = (exerciseId, setId, newReps) => {
        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.id === exerciseId
                    ? {
                          ...ex,
                          sets: ex.sets.map((set) => (set.id === setId ? { ...set, reps: newReps } : set)),
                      }
                    : ex
            )
        );
    };

    const handleNotesChange = (exerciseId, newNotes) => {
        setExercises((prevExercises) => prevExercises.map((ex) => (ex.id === exerciseId ? { ...ex, notes: newNotes } : ex)));
    };

    const toggleExpandExercise = (exerciseId) => {
        setExpandedExercise((prev) => (prev === exerciseId ? null : exerciseId));
    };

    const handleAddSet = (exerciseId) => {
        setExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.id === exerciseId
                    ? {
                          ...ex,
                          sets: [
                              ...ex.sets,
                              {
                                  id: ex.sets.length + 1,
                                  weight: "",
                                  reps: "",
                                  completed: false,
                              },
                          ],
                      }
                    : ex
            )
        );
    };

    // Calculate progress
    const totalSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
    const completedSets = exercises.reduce((total, ex) => total + ex.sets.filter((set) => set.completed).length, 0);
    const progressPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    const filteredExercises = exerciseLibrary.filter((exercise) => {
        const matchesSearch =
            exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMuscleGroup =
            selectedMuscleGroup === "All" || selectedMuscleGroup === "" || exercise.muscleGroup === selectedMuscleGroup;
        return matchesSearch && matchesMuscleGroup;
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={view === "main" ? `Manage Training - ${training.clientName}` : "Add Exercise"}
            size="large"
            confirmButtonText={isPastTraining ? (isEditing ? "Save Changes" : "Close") : "Finish Training"}
            onConfirm={
                isPastTraining
                    ? isEditing
                        ? () => {
                              onSave({ ...training, exercises });
                              setIsEditing(false);
                          }
                        : onClose
                    : handleFinishTraining
            }
            footerButtons={
                view === "main" ? (
                    <>
                        <Button variant="outlineLight" onClick={onClose}>
                            Cancel
                        </Button>
                        {!isPastTraining ? (
                            <Button
                                variant="orangeFilled"
                                onClick={handleFinishTraining}
                                leftIcon={<Icon icon="mdi:content-save" width={16} />}
                            >
                                Finish Training
                            </Button>
                        ) : (
                            <Button
                                variant="orangeFilled"
                                onClick={() => setIsEditing(!isEditing)}
                                leftIcon={<Icon icon={isEditing ? "mdi:check" : "mdi:pencil"} width={16} />}
                            >
                                {isEditing ? "Save Changes" : "Edit Training"}
                            </Button>
                        )}
                    </>
                ) : null
            }
        >
            {view === "main" ? (
                <motion.div
                    className="space-y-6 w-full overflow-y-auto h-[calc(100vh-240px)] overflow-x-hidden pr-1 pb-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header with Edit Icon for Past Training */}
                    {isPastTraining && (
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="orangeOutline"
                                size="small"
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2"
                            >
                                <Icon icon={isEditing ? "mdi:check" : "mdi:pencil"} width={16} />
                                {isEditing ? "Save Changes" : "Edit Past Training"}
                            </Button>
                        </div>
                    )}

                    {/* Progress Bar - Only show for active trainings */}
                    {!isPastTraining && (
                        <motion.div
                            className="sticky top-0 z-20 bg-[#111] pt-2 pb-4 shadow-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="w-full bg-[#222] rounded-full h-2.5 mb-2 overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="bg-gradient-to-r from-[#FF6B00] to-[#FFA500] h-2.5 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                ></motion.div>
                            </motion.div>
                            <div className="flex justify-between items-center text-sm text-gray-400 px-1">
                                <span>Training Progress</span>
                                <span className="text-white font-medium">
                                    {completedSets} of {totalSets} sets completed ({progressPercentage}%)
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Training Info */}
                    <motion.div className="relative w-full overflow-hidden rounded-xl" variants={cardVariants}>
                        <div className="absolute inset-0">
                            <Image
                                src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg"
                                alt="Training background"
                                fill
                                className="object-cover opacity-30"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#111]/80 to-[#222]/70"></div>
                        </div>

                        <div className="relative p-6 bg-gradient-to-br from-black/60 to-[#222]/70 border border-[#444] w-full backdrop-blur-sm shadow-xl">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                    <Icon icon="mdi:calendar" className="text-[#FF6B00] text-sm" />
                                </span>
                                <h3 className="text-lg font-semibold text-white">Training Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                            <p className="text-xs text-[#FF6B00] mb-1 font-medium">Date</p>
                                            <p className="text-white font-medium">{training.date}</p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                            <p className="text-xs text-[#FF6B00] mb-1 font-medium">Time</p>
                                            <p className="text-white font-medium">{training.time}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                            <p className="text-xs text-[#FF6B00] mb-1 font-medium">Type</p>
                                            <p className="text-white font-medium">{training.type}</p>
                                        </div>
                                        <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                            <p className="text-xs text-[#FF6B00] mb-1 font-medium">Location</p>
                                            <p className="text-white font-medium">{training.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                        <p className="text-xs text-[#FF6B00] mb-1 font-medium">Focus</p>
                                        <p className="text-white">{training.focus}</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-[#444] bg-black/30 backdrop-blur-sm">
                                        <p className="text-xs text-[#FF6B00] mb-1 font-medium">Notes</p>
                                        <p className="text-white">{training.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Exercises List */}
                    <div className="space-y-6 w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                    <Icon icon="mdi:dumbbell" className="text-[#FF6B00] text-sm" />
                                </span>
                                {isPastTraining ? "Completed Exercises" : "Exercises"}
                            </h3>
                            {!isPastTraining && (
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="orangeOutline"
                                        size="small"
                                        onClick={() => setView("addExercise")}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon icon="mdi:plus" width={16} />
                                        Add Exercise
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">{exercises.length} exercises</span>
                                        <span className="h-4 w-0.5 bg-gray-700"></span>
                                        <Icon icon="mdi:chart-bar" className="text-[#FF6B00]" width={16} />
                                        <span className="text-sm text-white font-medium">{progressPercentage}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Exercise Cards */}
                        {exercises.map((exercise, index) => (
                            <motion.div
                                key={exercise.id}
                                variants={cardVariants}
                                className="w-full"
                                transition={{ delay: index * 0.1 }}
                            >
                                <div
                                    className={`relative w-full border backdrop-blur-sm transition-all duration-300 cursor-pointer rounded-xl overflow-hidden ${
                                        expandedExercise === exercise.id
                                            ? "bg-gradient-to-br from-black/60 to-[#222]/70 border-[#444] shadow-xl"
                                            : "bg-gradient-to-br from-black/40 to-[#222]/50 border-[#444] hover:from-black/60 hover:to-[#222]/70"
                                    }`}
                                    onClick={() => toggleExpandExercise(exercise.id)}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <Image
                                            src={exercise.backgroundImage}
                                            alt={exercise.name}
                                            fill
                                            className="object-cover opacity-30"
                                            priority={index < 2}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#111]/80 to-[#222]/70 opacity-60"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 p-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/20">
                                                    {exercise.muscleGroup}
                                                </span>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white border border-white/10">
                                                    {exercise.sets.length} sets
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    icon={
                                                        expandedExercise === exercise.id ? "mdi:chevron-up" : "mdi:chevron-down"
                                                    }
                                                    className="text-[#FF6B00]"
                                                    width={20}
                                                />
                                            </div>
                                        </div>

                                        {/* Exercise Name */}
                                        <h4 className="text-xl font-bold text-white mb-4">{exercise.name}</h4>

                                        {/* Expanded Content */}
                                        {expandedExercise === exercise.id && (
                                            <motion.div
                                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#444]"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* Left Column - Sets and Notes */}
                                                <div className="space-y-4">
                                                    {/* Sets List */}
                                                    <div className="space-y-3">
                                                        {exercise.sets.map((set) => (
                                                            <motion.div
                                                                key={set.id}
                                                                className="p-4 rounded-lg border border-[#444] bg-black/80 backdrop-blur-sm"
                                                                whileHover={{ scale: 1.01 }}
                                                                initial={{ opacity: 0, y: 10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: set.id * 0.05 }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <span className="text-sm font-medium text-white flex items-center gap-1.5">
                                                                        <span className="w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center text-xs">
                                                                            {set.id}
                                                                        </span>
                                                                        Set {set.id}
                                                                    </span>
                                                                    {!isPastTraining && isEditing && (
                                                                        <Button
                                                                            variant={
                                                                                set.completed ? "orangeFilled" : "orangeOutline"
                                                                            }
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleSetCompleted(exercise.id, set.id);
                                                                            }}
                                                                            className="text-xs py-1"
                                                                        >
                                                                            {set.completed ? "Completed ✓" : "Mark Complete"}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {isPastTraining && !isEditing ? (
                                                                        <>
                                                                            <div className="p-2 rounded bg-black/40">
                                                                                <p className="text-xs text-[#FF6B00] mb-1">
                                                                                    Weight
                                                                                </p>
                                                                                <p className="text-white font-medium">
                                                                                    {set.weight}
                                                                                </p>
                                                                            </div>
                                                                            <div className="p-2 rounded bg-black/40">
                                                                                <p className="text-xs text-[#FF6B00] mb-1">
                                                                                    Reps
                                                                                </p>
                                                                                <p className="text-white font-medium">
                                                                                    {set.reps}
                                                                                </p>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FormField
                                                                                label="Weight"
                                                                                type="text"
                                                                                value={set.weight}
                                                                                onChange={(e) =>
                                                                                    handleSetWeightChange(
                                                                                        exercise.id,
                                                                                        set.id,
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className="mb-0 bg-black/40"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                            <FormField
                                                                                label="Reps"
                                                                                type="text"
                                                                                value={set.reps}
                                                                                onChange={(e) =>
                                                                                    handleSetRepsChange(
                                                                                        exercise.id,
                                                                                        set.id,
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                className="mb-0 bg-black/40"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>

                                                    {/* Add Set Button */}
                                                    {!isPastTraining && (
                                                        <Button
                                                            variant="orangeOutline"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddSet(exercise.id);
                                                            }}
                                                            className="w-full"
                                                        >
                                                            <Icon icon="mdi:plus" className="mr-1" />
                                                            Add Set
                                                        </Button>
                                                    )}

                                                    {/* Notes */}
                                                    {isPastTraining && !isEditing ? (
                                                        exercise.notes && (
                                                            <div className="p-3 rounded-lg border border-[#444] bg-black/80">
                                                                <p className="text-xs text-[#FF6B00] mb-1 font-medium">Notes</p>
                                                                <p className="text-white">{exercise.notes}</p>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <FormField
                                                            label="Notes"
                                                            type="textarea"
                                                            value={exercise.notes}
                                                            onChange={(e) => handleNotesChange(exercise.id, e.target.value)}
                                                            rows={2}
                                                            className="mb-0 bg-black/80 border-[#444]"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    )}

                                                    {/* Delete Exercise Button */}
                                                    {!isPastTraining && (
                                                        <Button
                                                            variant="orangeOutline"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteExercise(exercise.id);
                                                            }}
                                                            className="w-full text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-300/50"
                                                        >
                                                            <Icon icon="mdi:delete" className="mr-1" />
                                                            Delete Exercise
                                                        </Button>
                                                    )}

                                                    {/* Delete Exercise Button for Past Training in Edit Mode */}
                                                    {isPastTraining && isEditing && (
                                                        <Button
                                                            variant="orangeOutline"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteExercise(exercise.id);
                                                            }}
                                                            className="w-full text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-300/50"
                                                        >
                                                            <Icon icon="mdi:delete" className="mr-1" />
                                                            Delete Exercise
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Right Column - Media */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="text-sm font-medium text-white">Exercise Media</h4>
                                                        {!isPastTraining && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="orangeFilled"
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        // Implement recording functionality
                                                                    }}
                                                                >
                                                                    <Icon icon="mdi:camera" width={16} className="mr-1" />
                                                                    Record
                                                                </Button>
                                                                <label
                                                                    className="cursor-pointer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <input type="file" accept="image/*" className="hidden" />
                                                                    <Button variant="orangeOutline" size="small">
                                                                        <Icon icon="mdi:image" width={16} className="mr-1" />
                                                                        Upload
                                                                    </Button>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        {exercise.videoUrl ? (
                                                            <motion.div
                                                                className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#444] bg-black/40 shadow-xl"
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <video
                                                                    src={exercise.videoUrl}
                                                                    controls
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </motion.div>
                                                        ) : exercise.imageUrl ? (
                                                            <motion.div
                                                                className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#444] shadow-xl"
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Image
                                                                    src={exercise.imageUrl}
                                                                    alt={exercise.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </motion.div>
                                                        ) : (
                                                            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#444] bg-black/40 flex flex-col items-center justify-center shadow-xl">
                                                                <div className="text-center p-6">
                                                                    <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center mx-auto mb-4">
                                                                        <Icon
                                                                            icon="mdi:image"
                                                                            width={24}
                                                                            className="text-[#444]"
                                                                        />
                                                                    </div>
                                                                    <p className="text-[#666] text-sm mb-2">
                                                                        No media available
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => setView("main")}
                            className="text-gray-400 hover:text-white flex items-center gap-2"
                        >
                            <Icon icon="mdi:arrow-left" width={20} />
                            Back to Training
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row">
                        <FormField
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 mb-0"
                        />
                        <FormField
                            type="select"
                            value={selectedMuscleGroup}
                            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                            options={muscleGroups.map((group) => ({ value: group, label: group }))}
                            className="min-w-[150px] mb-0"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredExercises.map((exercise) => (
                            <Card
                                key={exercise.id}
                                variant="dark"
                                className="cursor-pointer hover:border-[#FF6B00] transition-all duration-300"
                                onClick={() => {
                                    const newExercise = {
                                        id: exercises.length + 1,
                                        name: exercise.name,
                                        sets: Array(exercise.defaultSets)
                                            .fill()
                                            .map((_, index) => ({
                                                id: index + 1,
                                                weight: "",
                                                reps: exercise.defaultReps,
                                                completed: true,
                                            })),
                                        notes: "",
                                        videoUrl: null,
                                        imageUrl: null,
                                        muscleGroup: exercise.muscleGroup,
                                        backgroundImage: exercise.imageUrl,
                                    };
                                    setExercises((prevExercises) => [...prevExercises, newExercise]);
                                    setView("main");
                                    setSearchTerm("");
                                    setSelectedMuscleGroup("");
                                }}
                            >
                                <div className="relative aspect-video mb-3">
                                    <Image
                                        src={exercise.imageUrl}
                                        alt={exercise.name}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">{exercise.name}</h4>
                                <p className="text-sm text-gray-400 mb-2">{exercise.muscleGroup}</p>
                                <p className="text-sm text-gray-500">{exercise.description}</p>
                            </Card>
                        ))}
                    </div>

                    {filteredExercises.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-400">No exercises found matching your criteria</p>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};
