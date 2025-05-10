"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { DragIcon, PlusIcon, TrashIcon } from "@/components/common/Icons";

export const SessionExercises = ({ sessionExercises, updateSessionExercises, exerciseLibrary }) => {
    const [newExercise, setNewExercise] = useState({
        name: "",
        sets: "",
        reps: "",
        restTime: "",
        notes: "",
    });

    const addExercise = () => {
        if (newExercise.name.trim()) {
            const exercise = {
                id: crypto.randomUUID(),
                ...newExercise,
            };

            updateSessionExercises([...sessionExercises, exercise]);

            // Reset form
            setNewExercise({
                name: "",
                sets: "",
                reps: "",
                restTime: "",
                notes: "",
            });
        }
    };

    const removeExercise = (exerciseId) => {
        updateSessionExercises(sessionExercises.filter((exercise) => exercise.id !== exerciseId));
    };

    const moveExercise = (index, direction) => {
        if ((direction === "up" && index === 0) || (direction === "down" && index === sessionExercises.length - 1)) {
            return;
        }

        const newExercises = [...sessionExercises];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        const temp = newExercises[index];
        newExercises[index] = newExercises[targetIndex];
        newExercises[targetIndex] = temp;

        updateSessionExercises(newExercises);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExercise((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleExistingExerciseChange = (exerciseId, field, value) => {
        updateSessionExercises(
            sessionExercises.map((exercise) => (exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise))
        );
    };

    return (
        <div>
            <div className="space-y-4 mb-6">
                {sessionExercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center space-x-3 p-3 bg-[#222] rounded-md">
                        <div className="flex flex-col items-center space-y-1">
                            <button
                                className="p-1 hover:bg-[#333] rounded"
                                onClick={() => moveExercise(index, "up")}
                                disabled={index === 0}
                            >
                                <DragIcon size={16} className="transform rotate-180" />
                            </button>
                            <span className="text-xs text-gray-500">{index + 1}</span>
                            <button
                                className="p-1 hover:bg-[#333] rounded"
                                onClick={() => moveExercise(index, "down")}
                                disabled={index === sessionExercises.length - 1}
                            >
                                <DragIcon size={16} />
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="col-span-1 md:col-span-3">
                                <p className="font-medium text-white">{exercise.name}</p>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Sets</label>
                                <input
                                    type="text"
                                    value={exercise.sets}
                                    onChange={(e) => handleExistingExerciseChange(exercise.id, "sets", e.target.value)}
                                    className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] text-white text-sm"
                                    placeholder="e.g., 3"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Reps</label>
                                <input
                                    type="text"
                                    value={exercise.reps}
                                    onChange={(e) => handleExistingExerciseChange(exercise.id, "reps", e.target.value)}
                                    className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] text-white text-sm"
                                    placeholder="e.g., 10-12"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Rest</label>
                                <input
                                    type="text"
                                    value={exercise.restTime}
                                    onChange={(e) => handleExistingExerciseChange(exercise.id, "restTime", e.target.value)}
                                    className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] text-white text-sm"
                                    placeholder="e.g., 60s"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-3">
                                <label className="block text-xs text-gray-400 mb-1">Notes</label>
                                <input
                                    type="text"
                                    value={exercise.notes}
                                    onChange={(e) => handleExistingExerciseChange(exercise.id, "notes", e.target.value)}
                                    className="w-full p-2 rounded bg-[#1a1a1a] border border-[#333] text-white text-sm"
                                    placeholder="Any special instructions..."
                                />
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="small"
                            onClick={() => removeExercise(exercise.id)}
                            leftIcon={<TrashIcon size={16} />}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            <div className="border-t border-[#333] pt-4">
                <h4 className="text-md font-medium text-white mb-3">Add Exercise</h4>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                    <div className="md:col-span-2">
                        <FormField
                            label="Exercise Name"
                            name="name"
                            value={newExercise.name}
                            onChange={handleChange}
                            placeholder="e.g., Barbell Squat"
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>

                    <div>
                        <FormField
                            label="Sets"
                            name="sets"
                            value={newExercise.sets}
                            onChange={handleChange}
                            placeholder="e.g., 3"
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>

                    <div>
                        <FormField
                            label="Reps"
                            name="reps"
                            value={newExercise.reps}
                            onChange={handleChange}
                            placeholder="e.g., 10-12"
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>

                    <div>
                        <FormField
                            label="Rest Time"
                            name="restTime"
                            value={newExercise.restTime}
                            onChange={handleChange}
                            placeholder="e.g., 60s"
                            backgroundStyle="darker"
                            className="mb-0"
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <FormField
                        label="Notes"
                        name="notes"
                        value={newExercise.notes}
                        onChange={handleChange}
                        placeholder="Any special instructions or technique cues..."
                        backgroundStyle="darker"
                        className="mb-0"
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        variant="orangeFilled"
                        size="small"
                        onClick={addExercise}
                        leftIcon={<PlusIcon size={16} />}
                        disabled={!newExercise.name.trim()}
                    >
                        Add Exercise
                    </Button>
                </div>
            </div>
        </div>
    );
};
