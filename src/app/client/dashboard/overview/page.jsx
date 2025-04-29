"use client";
import { Button } from "@/components/common/Button";
import { MessageIcon, NutritionIcon, PlusIcon, ProgressChartIcon, TimerIcon, WorkoutIcon } from "@/components/common/Icons";

export default function OverviewPage() {
    // Access userData from parent layout context in a real application
    const userData = {
        name: "Jamie Smith",
        coach: "Alex Miller",
        planName: "Strength Building",
        planStart: "Mar 15, 2025",
        planEnd: "Jun 15, 2025",
        progress: {
            completed: 12,
            total: 36,
            nextMilestone: "Deadlift 100kg",
        },
        stats: {
            height: 175,
            weight: 72,
            bmi: 23.5,
            bodyFat: 18,
            calorieGoal: 2400,
            proteinGoal: 160,
            carbsGoal: 250,
            fatGoal: 80,
        },
        progress_history: [
            { date: "Apr 1, 2025", weight: 74, bodyFat: 19 },
            { date: "Mar 15, 2025", weight: 75, bodyFat: 19.5 },
            { date: "Mar 1, 2025", weight: 76, bodyFat: 20 },
            { date: "Feb 15, 2025", weight: 77, bodyFat: 20.5 },
            { date: "Feb 1, 2025", weight: 78, bodyFat: 21 },
        ],
        upcoming_trainings: [
            {
                id: 1,
                date: "Apr 12, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                location: "City Fitness Center",
                focus: "Lower body power & mobility",
                notes: "Bring resistance bands",
            },
        ],
        messages: [
            {
                id: 1,
                from: "Coach Alex",
                content:
                    "Great work yesterday! Your squat form is improving a lot. Let's focus on increasing the weight next session.",
                time: "Yesterday, 15:42",
                unread: true,
            },
            {
                id: 2,
                from: "You",
                content: "Thanks! My legs are definitely feeling it today. Should I do any recovery exercises?",
                time: "Yesterday, 16:30",
                unread: false,
            },
        ],
        workout_plan: {
            friday: {
                focus: "Upper Body Strength",
                exercises: [
                    { name: "Bench Press", sets: "4", reps: "8-10", weight: "75kg" },
                    { name: "Incline Dumbbell Press", sets: "3", reps: "10-12", weight: "22kg" },
                    { name: "Lat Pulldown", sets: "4", reps: "10-12", weight: "65kg" },
                    { name: "Seated Cable Row", sets: "3", reps: "12", weight: "60kg" },
                    { name: "Lateral Raises", sets: "3", reps: "15", weight: "10kg" },
                ],
            },
        },
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Session */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <TimerIcon className="mr-2" stroke="#FF6B00" />
                        Next Training
                    </h2>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{userData.upcoming_trainings[0].date}</h3>
                                <p className="text-gray-400">{userData.upcoming_trainings[0].time}</p>
                            </div>
                            <span className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                {userData.upcoming_trainings[0].type}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-300">{userData.upcoming_trainings[0].focus}</p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="text-[#FF6B00] mr-1">📍</span>
                            {userData.upcoming_trainings[0].location}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="text-[#FF6B00] mr-1">📝</span>
                            {userData.upcoming_trainings[0].notes}
                        </p>
                    </div>

                    <Button
                        variant="orangeOutline"
                        fullWidth
                        onClick={() => (window.location.href = "/client/dashboard/trainings")}
                    >
                        View All Trainings
                    </Button>
                </div>

                {/* Messages Preview */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <MessageIcon className="mr-2" stroke="#FF6B00" />
                        Coach Messages
                    </h2>

                    <div className="space-y-3">
                        {userData.messages.slice(0, 2).map(message => (
                            <div
                                key={message.id}
                                className={`bg-[rgba(30,30,30,0.8)] p-3 rounded-xl border ${
                                    message.unread && message.from === "Coach Alex" ? "border-[#FF6B00]" : "border-[#333]"
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-bold">{message.from}</p>
                                    <p className="text-xs text-gray-400">{message.time}</p>
                                </div>
                                <p className="text-sm text-gray-300">{message.content}</p>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="orangeFilled"
                        fullWidth
                        className="mt-4"
                        leftIcon={<PlusIcon />}
                        onClick={() => (window.location.href = "/client/dashboard/messages")}
                    >
                        Send Message
                    </Button>
                </div>

                {/* Nutrition Summary */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <NutritionIcon className="mr-2" stroke="#FF6B00" />
                        Nutrition Overview
                    </h2>

                    <div className="space-y-3">
                        <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-xl border border-[#333]">
                            <p className="text-sm font-medium text-gray-400 mb-1">Daily Target</p>
                            <p className="font-bold text-xl mb-2">{userData.stats.calorieGoal} cal</p>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Protein</p>
                                    <p className="font-bold text-sm">{userData.stats.proteinGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Carbs</p>
                                    <p className="font-bold text-sm">{userData.stats.carbsGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Fat</p>
                                    <p className="font-bold text-sm">{userData.stats.fatGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="orangeOutline"
                        fullWidth
                        onClick={() => (window.location.href = "/client/dashboard/nutrition")}
                    >
                        Open Nutrition Tracker
                    </Button>
                </div>
            </div>

            {/* Progress Graph */}
            <div className="mt-6 bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <ProgressChartIcon className="mr-2" stroke="#FF6B00" />
                    Body Composition Progress
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Weight Progression</h3>
                        <div className="h-52 relative">
                            {/* Simple weight chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-6 bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-t-sm transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${((entry.weight - 70) / 10) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.weight} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Body Fat Progression</h3>
                        <div className="h-52 relative">
                            {/* Simple body fat chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${(entry.bodyFat / 25) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.bodyFat}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Button variant="orangeOutline" fullWidth>
                    View Detailed Progress
                </Button>
            </div>

            {/* Today's Workout */}
            <div className="mt-6 bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <WorkoutIcon className="mr-2" stroke="#FF6B00" />
                    Today's Workout
                </h2>

                {/* Today is Friday, show Friday's workout */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">{userData.workout_plan.friday.focus}</h3>
                        <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                            Friday
                        </span>
                    </div>

                    <div className="space-y-3">
                        {userData.workout_plan.friday.exercises.map((exercise, index) => (
                            <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                                <div className="flex justify-between">
                                    <p className="font-medium">{exercise.name}</p>
                                    <p className="text-sm text-gray-400">{exercise.weight}</p>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {exercise.sets} sets × {exercise.reps}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Button variant="orangeOutline" fullWidth onClick={() => (window.location.href = "/client/dashboard/program")}>
                    View Full Program
                </Button>
            </div>
        </div>
    );
}
