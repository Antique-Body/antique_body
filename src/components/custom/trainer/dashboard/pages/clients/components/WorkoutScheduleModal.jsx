import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { BookmarkIcon, CheckIcon, ClockIcon, PlusIcon, TrashIcon, WorkoutIcon } from "@/components/common/Icons";
import { FormField } from "@/components/common/FormField";
import { useState } from "react";

export const WorkoutScheduleModal = ({ isOpen, onClose, onScheduleWorkout, client, existingPlan }) => {
    const today = new Date().toISOString().split("T")[0];

    // Basic workout data
    const [workoutData, setWorkoutData] = useState({
        name: "",
        date: today,
        notes: "",
        waterGoal: 1000,
        exercises: [
            {
                name: "",
                planned: "",
                sets: [],
            },
        ],
    });

    // Reset form when modal opens
    const resetForm = () => {
        setWorkoutData({
            name: "",
            date: today,
            notes: "",
            waterGoal: 1000,
            exercises: [
                {
                    name: "",
                    planned: "",
                    sets: [],
                },
            ],
        });
    };

    // Handle input changes for workout data
    const handleInputChange = (field, value) => {
        setWorkoutData({
            ...workoutData,
            [field]: value,
        });
    };

    // Handle adding a new exercise
    const handleAddExercise = () => {
        setWorkoutData({
            ...workoutData,
            exercises: [
                ...workoutData.exercises,
                {
                    name: "",
                    planned: "",
                    sets: [],
                },
            ],
        });
    };

    // Handle removing an exercise
    const handleRemoveExercise = (index) => {
        const updatedExercises = [...workoutData.exercises];
        updatedExercises.splice(index, 1);

        setWorkoutData({
            ...workoutData,
            exercises: updatedExercises,
        });
    };

    // Handle exercise field changes
    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...workoutData.exercises];
        updatedExercises[index][field] = value;

        setWorkoutData({
            ...workoutData,
            exercises: updatedExercises,
        });
    };

    // Handle workout scheduling
    const handleSchedule = () => {
        // Format workout data for the app
        const scheduledWorkout = {
            name: workoutData.name,
            date: workoutData.date,
            status: "upcoming",
            details: {
                planned: workoutData.name,
                note: workoutData.notes,
                waterGoal: parseInt(workoutData.waterGoal),
                waterConsumed: 0,
                exercises: workoutData.exercises.map((exercise) => ({
                    name: exercise.name,
                    planned: exercise.planned,
                    sets: [],
                    completed: false,
                })),
            },
        };

        onScheduleWorkout(scheduledWorkout);
        onClose();
        resetForm();
    };

    // Handle modal close
    const handleClose = () => {
        onClose();
        resetForm();
    };

    // Get exercise suggestions based on client plan
    const getExerciseSuggestions = () => {
        if (!existingPlan || !existingPlan.days) return [];

        // Extract all exercises from the client's assigned plan
        const suggestions = [];
        existingPlan.days.forEach((day) => {
            day.exercises.forEach((exercise) => {
                suggestions.push({
                    name: exercise.name,
                    planned: `${exercise.sets} sets × ${exercise.reps}`,
                });
            });
        });

        return suggestions;
    };

    const exerciseSuggestions = getExerciseSuggestions();

    // Check if the schedule button should be disabled
    const isScheduleDisabled =
        !workoutData.name || !workoutData.date || workoutData.exercises.some((ex) => !ex.name || !ex.planned);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Schedule Custom Workout"
            size="large"
            footerButtons={
                <>
                    <Button variant="outlineLight" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="orangeFilled" onClick={handleSchedule} disabled={isScheduleDisabled}>
                        Schedule Workout
                    </Button>
                </>
            }
        >
            <div className="max-h-[70vh] overflow-y-auto px-1">
                {/* Workout Header */}
                <div className="mb-6 rounded-lg border border-[#333] bg-[rgba(20,20,20,0.3)] p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <FormField
                                type="text"
                                label={
                                    <div className="flex items-center">
                                        <WorkoutIcon size={16} stroke="#FF6B00" className="mr-2" />
                                        <span>Workout Name</span>
                                    </div>
                                }
                                value={workoutData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="e.g. Upper Body Strength, HIIT Session"
                                required
                            />
                        </div>
                        <div>
                            <FormField
                                type="date"
                                label={
                                    <div className="flex items-center">
                                        <ClockIcon size={16} stroke="#FF6B00" className="mr-2" />
                                        <span>Scheduled Date</span>
                                    </div>
                                }
                                value={workoutData.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                min={today}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <FormField
                                type="textarea"
                                label={
                                    <div className="flex items-center">
                                        <BookmarkIcon size={16} stroke="#FF6B00" className="mr-2" />
                                        <span>Workout Notes</span>
                                    </div>
                                }
                                value={workoutData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Instructions, special focus areas, or additional information..."
                            />
                        </div>
                        <div>
                            <FormField
                                type="number"
                                label={
                                    <div className="flex items-center">
                                        <CheckIcon size={16} stroke="#FF6B00" className="mr-2" />
                                        <span>Water Goal (ml)</span>
                                    </div>
                                }
                                value={workoutData.waterGoal}
                                onChange={(e) => handleInputChange("waterGoal", e.target.value)}
                                min="0"
                                step="100"
                            />
                        </div>
                    </div>
                </div>

                {/* Exercises */}
                <div className="mb-6">
                    <div className="mb-3 flex items-center">
                        <WorkoutIcon size={18} stroke="#FF6B00" className="mr-2" />
                        <span className="font-medium text-white">Exercises</span>
                        <Button
                            variant="outlineOrange"
                            size="xs"
                            leftIcon={<PlusIcon size={14} />}
                            onClick={handleAddExercise}
                            className="ml-auto"
                        >
                            Add Exercise
                        </Button>
                    </div>

                    {workoutData.exercises.map((exercise, index) => (
                        <div
                            key={index}
                            className="mb-4 rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)] p-4 hover:border-[#FF6B00]/30 transition-colors duration-200"
                        >
                            <div className="mb-3 flex items-center">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] mr-2">
                                    <span className="text-sm font-medium text-[#FF6B00]">{index + 1}</span>
                                </div>
                                <div className="text-base font-medium text-gray-200">Exercise</div>
                                {workoutData.exercises.length > 1 && (
                                    <Button
                                        variant="outlineRed"
                                        size="xs"
                                        leftIcon={<TrashIcon size={14} />}
                                        onClick={() => handleRemoveExercise(index)}
                                        className="ml-auto"
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <FormField
                                        type="text"
                                        label="Exercise Name"
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                        placeholder="e.g. Squats, Push-ups"
                                        list={`exercises-${index}`}
                                        required
                                    />
                                    {exerciseSuggestions.length > 0 && (
                                        <datalist id={`exercises-${index}`}>
                                            {exerciseSuggestions.map((suggestion, i) => (
                                                <option key={i} value={suggestion.name} />
                                            ))}
                                        </datalist>
                                    )}
                                </div>
                                <FormField
                                    type="text"
                                    label="Sets × Reps"
                                    value={exercise.planned}
                                    onChange={(e) => handleExerciseChange(index, "planned", e.target.value)}
                                    placeholder="e.g. 3 sets × 10-12, 5 × 5"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Suggested Exercises from Plan */}
                {exerciseSuggestions.length > 0 && (
                    <div className="rounded-lg border border-[#333] bg-[rgba(20,20,20,0.4)] p-4">
                        <div className="mb-3 flex items-center">
                            <WorkoutIcon size={18} stroke="#66BB6A" className="mr-2" />
                            <span className="font-medium text-gray-200">Suggested Exercises from Plan</span>
                        </div>

                        <div className="max-h-60 overflow-y-auto rounded-md border border-[#333] bg-[rgba(20,20,20,0.5)] p-2">
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {exerciseSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer rounded-md border border-[#444] bg-[rgba(30,30,30,0.4)] p-3 text-sm hover:border-[#FF6B00]/50 hover:bg-[rgba(40,40,40,0.6)] transition-all duration-200"
                                        onClick={() => {
                                            // Add this exercise to the workout
                                            const updatedExercises = [...workoutData.exercises];
                                            // Replace the last empty exercise or add a new one
                                            const emptyIndex = updatedExercises.findIndex((ex) => !ex.name);
                                            if (emptyIndex >= 0) {
                                                updatedExercises[emptyIndex] = {
                                                    name: suggestion.name,
                                                    planned: suggestion.planned,
                                                    sets: [],
                                                };
                                            } else {
                                                updatedExercises.push({
                                                    name: suggestion.name,
                                                    planned: suggestion.planned,
                                                    sets: [],
                                                });
                                            }

                                            setWorkoutData({
                                                ...workoutData,
                                                exercises: updatedExercises,
                                            });
                                        }}
                                    >
                                        <div className="font-medium text-white">{suggestion.name}</div>
                                        <div className="mt-1 text-gray-400">{suggestion.planned}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 text-center text-xs text-gray-400">
                            Click on an exercise to add it to your workout
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
