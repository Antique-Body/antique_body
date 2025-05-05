import { useEffect, useState } from "react";

import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { NutritionIcon, PlusIcon, TrashIcon, WorkoutIcon } from "@/components/common/Icons";
import mockPlans from "@/components/custom/trainer/dashboard/pages/plans/data/mockPlans";

export const TrainingPlanModal = ({ isOpen, onClose, onAssignPlan, client, existingPlanId }) => {
    // Modal mode - "assign" (existing plan) or "custom" (create custom)
    const [mode, setMode] = useState("assign");

    // Selected plan ID when assigning existing plan
    const [selectedPlanId, setSelectedPlanId] = useState(existingPlanId || "");

    // Custom plan data when creating new plan
    const [customPlan, setCustomPlan] = useState({
        title: "",
        type: client?.type || "gym",
        summary: "",
        days: [
            {
                day: 1,
                focus: "",
                exercises: [{ name: "", sets: 3, reps: "", rest: "60 sec" }],
            },
        ],
        nutrition: {
            dailyCalories: client?.nutrition?.calories || 2000,
            macros: {
                protein: `${Math.round((((client?.nutrition?.protein || 150) * 100) / (client?.nutrition?.calories || 2000)) * 4)}%`,
                carbs: `${Math.round((((client?.nutrition?.carbs || 200) * 100) / (client?.nutrition?.calories || 2000)) * 4)}%`,
                fats: `${Math.round((((client?.nutrition?.fats || 55) * 100) / (client?.nutrition?.calories || 2000)) * 9)}%`,
            },
            mealPlan: "",
        },
    });

    // Reset state when client changes
    useEffect(() => {
        if (existingPlanId) {
            setSelectedPlanId(existingPlanId);
            setMode("assign");
        } else {
            setSelectedPlanId("");
            const clientType = client?.type || "gym";
            setCustomPlan((prev) => ({
                ...prev,
                type: clientType,
            }));
        }
    }, [client, existingPlanId]);

    // Handle changing plan mode
    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    // Handle adding a day to custom plan
    const handleAddDay = () => {
        const newDay = {
            day: customPlan.days.length + 1,
            focus: "",
            exercises: [{ name: "", sets: 3, reps: "", rest: "60 sec" }],
        };

        setCustomPlan({
            ...customPlan,
            days: [...customPlan.days, newDay],
        });
    };

    // Handle removing a day from custom plan
    const handleRemoveDay = (dayIndex) => {
        const updatedDays = [...customPlan.days];
        updatedDays.splice(dayIndex, 1);

        // Renumber days
        const renumberedDays = updatedDays.map((day, idx) => ({
            ...day,
            day: idx + 1,
        }));

        setCustomPlan({
            ...customPlan,
            days: renumberedDays,
        });
    };

    // Handle adding an exercise to a day
    const handleAddExercise = (dayIndex) => {
        const updatedDays = [...customPlan.days];
        updatedDays[dayIndex].exercises.push({
            name: "",
            sets: 3,
            reps: "",
            rest: "60 sec",
        });

        setCustomPlan({
            ...customPlan,
            days: updatedDays,
        });
    };

    // Handle removing an exercise from a day
    const handleRemoveExercise = (dayIndex, exerciseIndex) => {
        const updatedDays = [...customPlan.days];
        updatedDays[dayIndex].exercises.splice(exerciseIndex, 1);

        setCustomPlan({
            ...customPlan,
            days: updatedDays,
        });
    };

    // Handle field changes in custom plan
    const handleCustomPlanChange = (field, value) => {
        setCustomPlan({
            ...customPlan,
            [field]: value,
        });
    };

    // Handle changes to a day's focus
    const handleDayFocusChange = (dayIndex, focus) => {
        const updatedDays = [...customPlan.days];
        updatedDays[dayIndex].focus = focus;

        setCustomPlan({
            ...customPlan,
            days: updatedDays,
        });
    };

    // Handle changes to an exercise
    const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
        const updatedDays = [...customPlan.days];
        updatedDays[dayIndex].exercises[exerciseIndex][field] = value;

        setCustomPlan({
            ...customPlan,
            days: updatedDays,
        });
    };

    // Handle nutrition field changes
    const handleNutritionChange = (field, value) => {
        const updatedNutrition = { ...customPlan.nutrition };

        if (field === "dailyCalories") {
            updatedNutrition.dailyCalories = value;
        } else if (field === "mealPlan") {
            updatedNutrition.mealPlan = value;
        } else if (field.startsWith("macros.")) {
            const macroField = field.split(".")[1];
            updatedNutrition.macros[macroField] = value;
        }

        setCustomPlan({
            ...customPlan,
            nutrition: updatedNutrition,
        });
    };

    // Handle saving the plan
    const handleSavePlan = () => {
        if (mode === "assign") {
            // Assign existing plan
            if (selectedPlanId) {
                onAssignPlan({
                    assignedPlanId: selectedPlanId,
                    customPlan: null,
                });
            }
        } else {
            // Create custom plan
            const finalCustomPlan = {
                ...customPlan,
                id: `custom-${Date.now()}`,
                forAthletes: `Custom plan for ${client?.name}`,
                description: customPlan.summary,
            };

            onAssignPlan({
                assignedPlanId: finalCustomPlan.id,
                customPlan: finalCustomPlan,
            });
        }

        onClose();
    };

    // Validation for custom plan
    const isCustomPlanValid = () => {
        if (!customPlan.title) return false;
        if (!customPlan.days.length) return false;

        // Check if all days have a focus and valid exercises
        for (const day of customPlan.days) {
            if (!day.focus) return false;
            if (!day.exercises.length) return false;

            // Check if all exercises have names, sets and reps
            for (const exercise of day.exercises) {
                if (!exercise.name || !exercise.sets || !exercise.reps) return false;
            }
        }

        return true;
    };

    // Check if the save button should be disabled
    const isSaveDisabled = mode === "assign" ? !selectedPlanId : !isCustomPlanValid();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={existingPlanId ? "Modify Training Plan" : "Assign Training Plan"}
            size="large"
            footerButtons={
                <>
                    <Button variant="outlineLight" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="orangeFilled" onClick={handleSavePlan} disabled={isSaveDisabled}>
                        {existingPlanId ? "Update Plan" : "Assign Plan"}
                    </Button>
                </>
            }
        >
            <div className="max-h-[70vh] overflow-y-auto px-1">
                {/* Plan Type Selection */}
                <div className="mb-6">
                    <div className="mb-2 text-base font-medium text-gray-200">Select Plan Type</div>
                    <div className="flex space-x-3">
                        <Button
                            variant={mode === "assign" ? "orangeFilled" : "outlineLight"}
                            onClick={() => handleModeChange("assign")}
                            className="flex-1 transition-all duration-200"
                        >
                            <WorkoutIcon size={16} className="mr-2" />
                            Assign Existing Plan
                        </Button>
                        <Button
                            variant={mode === "custom" ? "orangeFilled" : "outlineLight"}
                            onClick={() => handleModeChange("custom")}
                            className="flex-1 transition-all duration-200"
                        >
                            <PlusIcon size={16} className="mr-2" />
                            Create Custom Plan
                        </Button>
                    </div>
                </div>

                {/* Assign Existing Plan */}
                {mode === "assign" && (
                    <div>
                        <FormField
                            type="select"
                            label="Select Training Plan"
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            options={[
                                { value: "", label: "Select a plan..." },
                                ...mockPlans.map((plan) => ({
                                    value: plan.id,
                                    label: `${plan.title} (${plan.type})`,
                                })),
                            ]}
                            className="mb-4"
                        />

                        {selectedPlanId && (
                            <div className="mt-6 overflow-hidden rounded-lg border border-[#333] bg-gradient-to-b from-[rgba(30,30,30,0.8)] to-[rgba(25,25,25,0.8)]">
                                <div className="border-b border-[#333] bg-[rgba(20,20,20,0.6)] p-4">
                                    <div className="text-lg font-bold text-[#FF6B00]">
                                        {mockPlans.find((p) => p.id === selectedPlanId)?.title}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-400">
                                        {mockPlans.find((p) => p.id === selectedPlanId)?.summary}
                                    </p>
                                </div>

                                <div className="p-4">
                                    <div className="mb-4">
                                        <div className="mb-3 flex items-center">
                                            <WorkoutIcon size={18} stroke="#FF6B00" className="mr-2" />
                                            <span className="font-medium text-white">Training Schedule</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {mockPlans
                                                .find((p) => p.id === selectedPlanId)
                                                ?.days.map((day) => (
                                                    <div
                                                        key={day.day}
                                                        className="rounded-md border border-[#444] bg-[rgba(20,20,20,0.3)] p-3 hover:border-[#FF6B00]/50 transition-colors duration-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="font-medium text-white">Day {day.day}</div>
                                                            <div className="rounded-full bg-[#222] px-2 py-0.5 text-xs text-gray-400">
                                                                {day.exercises.length} exercises
                                                            </div>
                                                        </div>
                                                        <div className="mt-1 text-sm text-gray-300">{day.focus}</div>
                                                        <div className="mt-2">
                                                            {day.exercises.slice(0, 3).map((ex, idx) => (
                                                                <div key={idx} className="text-xs text-gray-400">
                                                                    • {ex.name}
                                                                </div>
                                                            ))}
                                                            {day.exercises.length > 3 && (
                                                                <div className="text-xs text-gray-500">
                                                                    + {day.exercises.length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3 flex items-center">
                                            <NutritionIcon size={18} stroke="#FF6B00" className="mr-2" />
                                            <span className="font-medium text-white">Nutrition Guide</span>
                                        </div>
                                        <div className="rounded-md border border-[#444] bg-[rgba(20,20,20,0.3)] p-3">
                                            <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-2 text-center">
                                                    <div className="text-xs text-gray-400">Calories</div>
                                                    <div className="text-sm font-medium text-white">
                                                        {
                                                            mockPlans.find((p) => p.id === selectedPlanId)?.nutrition
                                                                .dailyCalories
                                                        }
                                                    </div>
                                                </div>
                                                <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-2 text-center">
                                                    <div className="text-xs text-gray-400">Protein</div>
                                                    <div className="text-sm font-medium text-white">
                                                        {
                                                            mockPlans.find((p) => p.id === selectedPlanId)?.nutrition.macros
                                                                .protein
                                                        }
                                                    </div>
                                                </div>
                                                <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-2 text-center">
                                                    <div className="text-xs text-gray-400">Carbs</div>
                                                    <div className="text-sm font-medium text-white">
                                                        {mockPlans.find((p) => p.id === selectedPlanId)?.nutrition.macros.carbs}
                                                    </div>
                                                </div>
                                                <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-2 text-center">
                                                    <div className="text-xs text-gray-400">Fats</div>
                                                    <div className="text-sm font-medium text-white">
                                                        {mockPlans.find((p) => p.id === selectedPlanId)?.nutrition.macros.fats}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-300">
                                                {mockPlans.find((p) => p.id === selectedPlanId)?.nutrition.mealPlan}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Custom Plan */}
                {mode === "custom" && (
                    <div>
                        <div className="rounded-lg border border-[#333] bg-[rgba(20,20,20,0.3)] p-4 mb-6">
                            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormField
                                    type="text"
                                    label="Plan Title"
                                    value={customPlan.title}
                                    onChange={(e) => handleCustomPlanChange("title", e.target.value)}
                                    required
                                />
                                <FormField
                                    type="select"
                                    label="Plan Type"
                                    value={customPlan.type}
                                    onChange={(e) => handleCustomPlanChange("type", e.target.value)}
                                    options={[
                                        { value: "gym", label: "Gym / General Fitness" },
                                        { value: "football", label: "Football" },
                                        { value: "basketball", label: "Basketball" },
                                        { value: "tennis", label: "Tennis" },
                                        { value: "athletics", label: "Track & Field" },
                                    ]}
                                />
                            </div>

                            <FormField
                                type="textarea"
                                label="Plan Summary"
                                value={customPlan.summary}
                                onChange={(e) => handleCustomPlanChange("summary", e.target.value)}
                                placeholder="A brief description of this training plan and its goals..."
                            />
                        </div>

                        {/* Training Days */}
                        <div className="mb-3 flex items-center">
                            <WorkoutIcon size={18} stroke="#FF6B00" className="mr-2" />
                            <span className="font-medium text-white">Training Schedule</span>
                            <Button
                                variant="outlineOrange"
                                size="xs"
                                leftIcon={<PlusIcon size={14} />}
                                onClick={handleAddDay}
                                className="ml-auto"
                            >
                                Add Day
                            </Button>
                        </div>

                        {customPlan.days.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className="mb-5 rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)] p-4 hover:border-[#FF6B00]/30 transition-colors duration-200"
                            >
                                <div className="mb-4 flex items-center">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] mr-2">
                                        <span className="text-sm font-medium text-[#FF6B00]">{day.day}</span>
                                    </div>
                                    <FormField
                                        type="text"
                                        label=""
                                        value={day.focus}
                                        onChange={(e) => handleDayFocusChange(dayIndex, e.target.value)}
                                        placeholder="Day Focus (e.g. Upper Body, Cardio, Recovery...)"
                                        className="flex-1 mb-0"
                                    />
                                    {customPlan.days.length > 1 && (
                                        <Button
                                            variant="outlineRed"
                                            size="xs"
                                            leftIcon={<TrashIcon size={14} />}
                                            onClick={() => handleRemoveDay(dayIndex)}
                                            className="ml-2"
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-300">Exercises</div>
                                        <Button
                                            variant="outlineLight"
                                            size="xs"
                                            leftIcon={<PlusIcon size={14} />}
                                            onClick={() => handleAddExercise(dayIndex)}
                                        >
                                            Add Exercise
                                        </Button>
                                    </div>

                                    {day.exercises.map((exercise, exerciseIndex) => (
                                        <div
                                            key={exerciseIndex}
                                            className="mb-3 rounded-md border border-[#444] bg-[rgba(20,20,20,0.3)] p-3 hover:border-[#555] transition-colors duration-200"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(255,255,255,0.1)] mr-2">
                                                        <span className="text-xs font-medium text-white">
                                                            {exerciseIndex + 1}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-200">Exercise</div>
                                                </div>
                                                {day.exercises.length > 1 && (
                                                    <Button
                                                        variant="outlineRed"
                                                        size="xs"
                                                        onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                                <div className="sm:col-span-4">
                                                    <FormField
                                                        type="text"
                                                        label="Exercise Name"
                                                        value={exercise.name}
                                                        onChange={(e) =>
                                                            handleExerciseChange(
                                                                dayIndex,
                                                                exerciseIndex,
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g. Squats, Push-ups, etc."
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <FormField
                                                        type="number"
                                                        label="Sets"
                                                        value={exercise.sets}
                                                        onChange={(e) =>
                                                            handleExerciseChange(
                                                                dayIndex,
                                                                exerciseIndex,
                                                                "sets",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        min="1"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <FormField
                                                        type="text"
                                                        label="Reps"
                                                        value={exercise.reps}
                                                        onChange={(e) =>
                                                            handleExerciseChange(
                                                                dayIndex,
                                                                exerciseIndex,
                                                                "reps",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g. 10, 8-12, 30sec"
                                                        required
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <FormField
                                                        type="text"
                                                        label="Rest Period"
                                                        value={exercise.rest}
                                                        onChange={(e) =>
                                                            handleExerciseChange(
                                                                dayIndex,
                                                                exerciseIndex,
                                                                "rest",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g. 60 sec, 2 min"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Nutrition Settings */}
                        <div className="mt-6">
                            <div className="mb-3 flex items-center">
                                <NutritionIcon size={18} stroke="#FF6B00" className="mr-2" />
                                <span className="font-medium text-white">Nutrition Guide</span>
                            </div>

                            <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)] p-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField
                                        type="text"
                                        label="Daily Calories"
                                        value={customPlan.nutrition.dailyCalories}
                                        onChange={(e) => handleNutritionChange("dailyCalories", e.target.value)}
                                        placeholder="e.g. 2000, or 500 calorie deficit"
                                    />

                                    <div className="grid grid-cols-3 gap-2">
                                        <FormField
                                            type="text"
                                            label="Protein"
                                            value={customPlan.nutrition.macros.protein}
                                            onChange={(e) => handleNutritionChange("macros.protein", e.target.value)}
                                            placeholder="e.g. 30%"
                                        />
                                        <FormField
                                            type="text"
                                            label="Carbs"
                                            value={customPlan.nutrition.macros.carbs}
                                            onChange={(e) => handleNutritionChange("macros.carbs", e.target.value)}
                                            placeholder="e.g. 50%"
                                        />
                                        <FormField
                                            type="text"
                                            label="Fats"
                                            value={customPlan.nutrition.macros.fats}
                                            onChange={(e) => handleNutritionChange("macros.fats", e.target.value)}
                                            placeholder="e.g. 20%"
                                        />
                                    </div>
                                </div>

                                <FormField
                                    type="textarea"
                                    label="Meal Plan Notes"
                                    value={customPlan.nutrition.mealPlan}
                                    onChange={(e) => handleNutritionChange("mealPlan", e.target.value)}
                                    placeholder="General nutrition guidelines and meal timing recommendations..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
