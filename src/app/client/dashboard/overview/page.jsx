"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { MessageIcon, NutritionIcon, PlusIcon, ProgressChartIcon, TimerIcon, WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export default function OverviewPage() {
    const router = useRouter();
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Next Session */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <TimerIcon className="mr-2" stroke="#FF6B00" />
                        Next Training
                    </h2>

                    <Card variant="dark" className="mb-4" width="100%" maxWidth="none">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold">{userData.upcoming_trainings[0].date}</h3>
                                <p className="text-gray-400">{userData.upcoming_trainings[0].time}</p>
                            </div>
                            <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                {userData.upcoming_trainings[0].type}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-300">{userData.upcoming_trainings[0].focus}</p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="mr-1 text-[#FF6B00]">📍</span>
                            {userData.upcoming_trainings[0].location}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="mr-1 text-[#FF6B00]">📝</span>
                            {userData.upcoming_trainings[0].notes}
                        </p>
                    </Card>

                    <Button
                        variant="orangeOutline"
                        fullWidth
                        onClick={() => router.push("/client/dashboard/upcoming-trainings")}
                    >
                        View All Trainings
                    </Button>
                </Card>

                {/* Messages Preview */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <MessageIcon className="mr-2" stroke="#FF6B00" />
                        Coach Messages
                    </h2>

                    <div className="space-y-3">
                        {userData.messages.slice(0, 2).map((message) => (
                            <Card
                                key={message.id}
                                variant="dark"
                                className={`${message.unread && message.from === "Coach Alex" ? "border-[#FF6B00]" : ""}`}
                                width="100%"
                                maxWidth="none"
                            >
                                <div className="mb-1 flex items-center justify-between">
                                    <p className="font-bold">{message.from}</p>
                                    <p className="text-xs text-gray-400">{message.time}</p>
                                </div>
                                <p className="text-sm text-gray-300">{message.content}</p>
                            </Card>
                        ))}
                    </div>

                    <Button
                        variant="orangeFilled"
                        fullWidth
                        className="mt-4"
                        leftIcon={<PlusIcon />}
                        onClick={() => router.push("/client/dashboard/messages")}
                    >
                        Send Message
                    </Button>
                </Card>

                {/* Nutrition Summary */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <h2 className="mb-4 flex items-center text-xl font-bold">
                        <NutritionIcon className="mr-2" stroke="#FF6B00" />
                        Nutrition Overview
                    </h2>

                    <div className="space-y-3">
                        <Card variant="dark" width="100%" maxWidth="none">
                            <p className="mb-1 text-sm font-medium text-gray-400">Daily Target</p>
                            <p className="mb-2 text-xl font-bold">{userData.stats.calorieGoal} cal</p>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Protein</p>
                                    <p className="text-sm font-bold">{userData.stats.proteinGoal}g</p>
                                    <div className="mt-1 h-1 rounded-full bg-[#333]">
                                        <div className="h-full rounded-full bg-blue-500" style={{ width: "70%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Carbs</p>
                                    <p className="text-sm font-bold">{userData.stats.carbsGoal}g</p>
                                    <div className="mt-1 h-1 rounded-full bg-[#333]">
                                        <div className="h-full rounded-full bg-green-500" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Fat</p>
                                    <p className="text-sm font-bold">{userData.stats.fatGoal}g</p>
                                    <div className="mt-1 h-1 rounded-full bg-[#333]">
                                        <div className="h-full rounded-full bg-yellow-500" style={{ width: "50%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Button variant="orangeOutline" fullWidth onClick={() => router.push("/client/dashboard/nutrition")}>
                        Open Nutrition Tracker
                    </Button>
                </Card>
            </div>

            {/* Progress Graph */}
            <Card variant="dark" className="mt-6" width="100%" maxWidth="none">
                <h2 className="mb-4 flex items-center text-xl font-bold">
                    <ProgressChartIcon className="mr-2" stroke="#FF6B00" />
                    Body Composition Progress
                </h2>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card variant="dark" width="100%" maxWidth="none">
                        <h3 className="mb-3 font-medium">Weight Progression</h3>
                        <div className="relative h-52">
                            {/* Simple weight chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex flex-1 flex-col items-center">
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="w-6 rounded-t-sm bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${((entry.weight - 70) / 10) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.weight} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <h3 className="mb-3 font-medium">Body Fat Progression</h3>
                        <div className="relative h-52">
                            {/* Simple body fat chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex flex-1 flex-col items-center">
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="w-6 rounded-t-sm bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${(entry.bodyFat / 25) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.bodyFat}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <Button variant="orangeOutline" fullWidth>
                    View Detailed Progress
                </Button>
            </Card>

            {/* Today's Workout */}
            <Card variant="dark" className="mt-6" width="100%" maxWidth="none">
                <h2 className="mb-4 flex items-center text-xl font-bold">
                    <WorkoutIcon className="mr-2" stroke="#FF6B00" />
                    Today's Workout
                </h2>

                {/* Today is Friday, show Friday's workout */}
                <Card variant="dark" width="100%" maxWidth="none">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-bold">{userData.workout_plan.friday.focus}</h3>
                        <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                            Friday
                        </span>
                    </div>

                    <div className="space-y-3">
                        {userData.workout_plan.friday.exercises.map((exercise, index) => (
                            <div key={index} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
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
                </Card>

                <Button variant="orangeOutline" fullWidth onClick={() => router.push("/client/dashboard/program")}>
                    View Full Program
                </Button>
            </Card>
        </div>
    );
}
