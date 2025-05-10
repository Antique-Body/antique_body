import React from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";

export const RecordInputModal = ({
    isOpen,
    editingExercise,
    newRecord,
    onClose,
    onSave,
    onInputChange,
    exerciseCategories,
    onExerciseSelect,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-md mx-4 animate-fadeIn">
                <Card variant="dark" className="border border-[#333]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">
                            Add Record {editingExercise ? `for ${editingExercise.name}` : ""}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-[#333] rounded-lg transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {!editingExercise && (
                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Exercise</label>
                            <select
                                className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                onChange={(e) => onExerciseSelect(e.target.value)}
                            >
                                <option value="">Select Exercise</option>
                                {exerciseCategories.map((category) => (
                                    <optgroup key={category.name} label={category.name}>
                                        {category.exercises.map((exercise) => (
                                            <option key={exercise.name} value={exercise.name}>
                                                {exercise.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
                            <input
                                type="number"
                                className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                step="0.5"
                                value={newRecord.weight}
                                onChange={(e) => onInputChange("weight", e.target.value)}
                                placeholder="Enter weight"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Reps</label>
                            <input
                                type="number"
                                className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                value={newRecord.reps}
                                onChange={(e) => onInputChange("reps", e.target.value)}
                                placeholder="Enter reps"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date</label>
                            <input
                                type="date"
                                className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                value={newRecord.date}
                                onChange={(e) => onInputChange("date", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button
                            variant="orangeFilled"
                            fullWidth
                            onClick={onSave}
                            disabled={!newRecord.weight || !newRecord.reps || !editingExercise}
                        >
                            Save Record
                        </Button>
                        <Button variant="dark" fullWidth onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
