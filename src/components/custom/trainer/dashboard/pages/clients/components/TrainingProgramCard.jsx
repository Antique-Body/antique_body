import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";

export const TrainingProgramCard = ({
    currentPlan,
    nutritionPlan,
    onOpenPlanModal,
    onOpenWorkoutModal,
    onOpenNutritionModal,
}) => {
    const hasPlan = currentPlan !== null;
    const hasNutritionPlan = nutritionPlan !== null;

    return (
        <Card variant="darkStrong" width="100%" maxWidth="none">
            <h3 className="mb-4 flex items-center text-xl font-semibold">
                <Icon icon="mdi:dumbbell" width={20} color="#FF6B00" className="mr-2" />
                Client Programs
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Training Plan Card */}
                <div className="rounded-lg border border-[#333] bg-[rgba(20,20,20,0.6)] p-4 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(66,153,225,0.15)]">
                            <Icon icon="mdi:calendar-check" width={20} className="text-blue-400" />
                        </div>
                        <h4 className="text-lg font-medium">Training Plan</h4>
                    </div>

                    {hasPlan ? (
                        <>
                            <div className="mb-4 bg-[rgba(30,30,30,0.6)] rounded-lg p-3 border border-[#444]">
                                <div className="text-blue-400 font-medium mb-1">{currentPlan.title}</div>
                                <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                    {currentPlan.summary || currentPlan.description}
                                </p>

                                {currentPlan.days && (
                                    <div className="mt-3 space-y-2">
                                        <div className="text-xs font-medium text-gray-400">Training Schedule:</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {currentPlan.days.slice(0, 4).map((day) => (
                                                <div
                                                    key={day.day}
                                                    className="rounded border border-[#333] bg-[rgba(15,15,15,0.4)] p-1.5 text-xs"
                                                >
                                                    <div className="font-medium">Day {day.day}</div>
                                                    <div className="text-gray-400 text-xs truncate">{day.focus}</div>
                                                </div>
                                            ))}
                                            {currentPlan.days && currentPlan.days.length > 4 && (
                                                <div className="rounded border border-[#333] bg-[rgba(15,15,15,0.4)] p-1.5 text-xs flex items-center justify-center">
                                                    <span className="text-gray-400">+{currentPlan.days.length - 4} more</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outlineBlue"
                                    size="small"
                                    leftIcon={<Icon icon="mdi:pencil" width={14} />}
                                    onClick={onOpenPlanModal}
                                >
                                    Modify Plan
                                </Button>
                                <Button
                                    variant="blueFilled"
                                    size="small"
                                    leftIcon={<Icon icon="mdi:plus" width={14} />}
                                    onClick={onOpenWorkoutModal}
                                >
                                    Schedule Workout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-[rgba(30,30,30,0.3)] rounded-lg p-4 mb-3 border border-dashed border-[#444]">
                                <div className="text-center">
                                    <div className="text-gray-300 mb-1">No Training Plan Assigned</div>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Assign a training program to help your client achieve their fitness goals
                                    </p>
                                    <div className="inline-flex rounded-full bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-300">
                                        Action Required
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="blueFilled"
                                leftIcon={<Icon icon="mdi:plus" width={16} />}
                                className="w-full justify-center py-2 text-sm font-medium"
                                onClick={onOpenPlanModal}
                            >
                                Assign Training Plan
                            </Button>
                        </>
                    )}
                </div>

                {/* Nutrition Plan Card */}
                <div className="rounded-lg border border-[#333] bg-[rgba(20,20,20,0.6)] p-4 relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>

                    <div className="flex items-center mb-3">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(72,187,120,0.15)]">
                            <Icon icon="mdi:food-apple" width={20} className="text-green-400" />
                        </div>
                        <h4 className="text-lg font-medium">Nutrition Plan</h4>
                    </div>

                    {hasNutritionPlan ? (
                        <>
                            <div className="mb-4 bg-[rgba(30,30,30,0.6)] rounded-lg p-3 border border-[#444]">
                                <div className="text-green-400 font-medium mb-1">{nutritionPlan.title}</div>
                                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{nutritionPlan.description}</p>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="bg-[rgba(15,15,15,0.4)] rounded p-2 text-center">
                                        <div className="text-xs text-gray-400 mb-1">Daily Calories</div>
                                        <div className="font-medium text-green-300">
                                            {nutritionPlan.dailyCalories || "Varies"}
                                        </div>
                                        <div className="text-[10px] text-gray-400">Varies</div>
                                    </div>
                                    <div className="bg-[rgba(15,15,15,0.4)] rounded p-2.5 text-center">
                                        <div className="text-xs text-gray-400 mb-1">Macros</div>
                                        <div className="flex justify-between px-1">
                                            <div className="text-center">
                                                <div className="font-medium text-green-300">
                                                    {nutritionPlan.macros?.protein || "N/A"}
                                                </div>
                                                <div className="text-[10px] text-gray-400">Protein</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-medium text-green-300">
                                                    {nutritionPlan.macros?.carbs || "N/A"}
                                                </div>
                                                <div className="text-[10px] text-gray-400">Carbs</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-medium text-green-300">
                                                    {nutritionPlan.macros?.fats || "N/A"}
                                                </div>
                                                <div className="text-[10px] text-gray-400">Fats</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {nutritionPlan.mealPlan && (
                                    <div className="mt-3 text-xs text-gray-400 bg-[rgba(15,15,15,0.3)] rounded p-2">
                                        <div className="font-medium text-gray-300 mb-1">Meal Plan Notes:</div>
                                        <p className="line-clamp-2">{nutritionPlan.mealPlan}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant="outlineGreen"
                                    size="small"
                                    leftIcon={<Icon icon="mdi:pencil" width={14} />}
                                    onClick={onOpenNutritionModal}
                                >
                                    Modify Plan
                                </Button>
                                <Button variant="greenFilled" size="small" leftIcon={<Icon icon="mdi:plus" width={14} />}>
                                    Adjust Macros
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-[rgba(30,30,30,0.3)] rounded-lg p-4 mb-3 border border-dashed border-[#444]">
                                <div className="text-center">
                                    <div className="text-gray-300 mb-1">No Nutrition Plan Assigned</div>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Create a nutrition strategy to complement their training program
                                    </p>
                                    <div className="inline-flex rounded-full bg-green-900/30 px-2 py-1 text-xs font-medium text-green-300">
                                        Action Recommended
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="greenFilled"
                                leftIcon={<Icon icon="mdi:plus" width={16} />}
                                className="w-full justify-center py-2 text-sm font-medium"
                                onClick={onOpenNutritionModal}
                            >
                                Assign Nutrition Plan
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};
