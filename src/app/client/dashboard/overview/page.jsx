"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import { Button } from "@/components/common/Button";
import { EditIcon, MessageIcon, NutritionIcon, PlusIcon, ProgressChartIcon, StrengthIcon, TimerIcon, WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export default function OverviewPage() {
    const router = useRouter();
    const { data: session } = useSession();
    
    // Access userData from parent layout context in a real application
    const userData = {
        name: session?.user?.name || "Loading...",
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

    // Add new exercise records data
    const exerciseRecords = {
        mainLifts: [
            {
                name: "Bench Press",
                currentMax: 100,
                previousMax: 95,
                history: [
                    { date: "Apr 1, 2025", weight: 100 },
                    { date: "Mar 15, 2025", weight: 97.5 },
                    { date: "Mar 1, 2025", weight: 95 },
                    { date: "Feb 15, 2025", weight: 92.5 },
                    { date: "Feb 1, 2025", weight: 90 }
                ]
            },
            {
                name: "Squat",
                currentMax: 140,
                previousMax: 130,
                history: [
                    { date: "Apr 1, 2025", weight: 140 },
                    { date: "Mar 15, 2025", weight: 135 },
                    { date: "Mar 1, 2025", weight: 132.5 },
                    { date: "Feb 15, 2025", weight: 130 },
                    { date: "Feb 1, 2025", weight: 125 }
                ]
            },
            {
                name: "Deadlift",
                currentMax: 160,
                previousMax: 150,
                history: [
                    { date: "Apr 1, 2025", weight: 160 },
                    { date: "Mar 15, 2025", weight: 155 },
                    { date: "Mar 1, 2025", weight: 152.5 },
                    { date: "Feb 15, 2025", weight: 150 },
                    { date: "Feb 1, 2025", weight: 145 }
                ]
            }
        ],
        accessories: [
            {
                name: "Shoulder Press",
                weight: 60,
                sets: 4,
                reps: "8-10",
                improvement: "+5kg"
            },
            {
                name: "Barbell Row",
                weight: 80,
                sets: 4,
                reps: "10-12",
                improvement: "+7.5kg"
            },
            {
                name: "Romanian Deadlift",
                weight: 100,
                sets: 3,
                reps: "12",
                improvement: "+10kg"
            },
            {
                name: "Incline Bench",
                weight: 75,
                sets: 3,
                reps: "10",
                improvement: "+5kg"
            }
        ]
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [newRecord, setNewRecord] = useState({
        weight: '',
        reps: '',
        date: new Date().toISOString().split('T')[0]
    });

    const exerciseCategories = [
        {
            name: "Push Exercises",
            exercises: [
                {
                    name: "Bench Press",
                    lastRecord: { weight: 100, reps: 8, date: "2024-03-15" },
                    personalBest: { weight: 110, reps: 5, date: "2024-02-01" },
                    history: [
                        { date: "2024-03-15", weight: 100, reps: 8 },
                        { date: "2024-03-01", weight: 95, reps: 8 },
                        { date: "2024-02-15", weight: 90, reps: 10 }
                    ]
                },
                {
                    name: "Shoulder Press",
                    lastRecord: { weight: 60, reps: 10, date: "2024-03-14" },
                    personalBest: { weight: 65, reps: 8, date: "2024-02-10" },
                    history: [
                        { date: "2024-03-14", weight: 60, reps: 10 },
                        { date: "2024-03-01", weight: 57.5, reps: 10 },
                        { date: "2024-02-15", weight: 55, reps: 12 }
                    ]
                }
            ]
        },
        {
            name: "Pull Exercises",
            exercises: [
                {
                    name: "Deadlift",
                    lastRecord: { weight: 160, reps: 5, date: "2024-03-13" },
                    personalBest: { weight: 170, reps: 3, date: "2024-02-05" },
                    history: [
                        { date: "2024-03-13", weight: 160, reps: 5 },
                        { date: "2024-02-28", weight: 155, reps: 6 },
                        { date: "2024-02-14", weight: 150, reps: 8 }
                    ]
                },
                {
                    name: "Barbell Row",
                    lastRecord: { weight: 80, reps: 12, date: "2024-03-12" },
                    personalBest: { weight: 85, reps: 10, date: "2024-02-08" },
                    history: [
                        { date: "2024-03-12", weight: 80, reps: 12 },
                        { date: "2024-02-27", weight: 77.5, reps: 12 },
                        { date: "2024-02-13", weight: 75, reps: 12 }
                    ]
                }
            ]
        },
        {
            name: "Legs",
            exercises: [
                {
                    name: "Squat",
                    lastRecord: { weight: 140, reps: 6, date: "2024-03-11" },
                    personalBest: { weight: 150, reps: 4, date: "2024-02-03" },
                    history: [
                        { date: "2024-03-11", weight: 140, reps: 6 },
                        { date: "2024-02-26", weight: 135, reps: 8 },
                        { date: "2024-02-12", weight: 130, reps: 8 }
                    ]
                },
                {
                    name: "Romanian Deadlift",
                    lastRecord: { weight: 100, reps: 12, date: "2024-03-10" },
                    personalBest: { weight: 110, reps: 10, date: "2024-02-07" },
                    history: [
                        { date: "2024-03-10", weight: 100, reps: 12 },
                        { date: "2024-02-25", weight: 95, reps: 12 },
                        { date: "2024-02-11", weight: 90, reps: 12 }
                    ]
                }
            ]
        }
    ];

    const exerciseImages = {
        "Bench Press": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf3cAvxLaXUpWePM6OM5zSCpdENU46OEWwSg&s",
        "Shoulder Press": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=500&auto=format",
        "Deadlift": "https://images.ctfassets.net/8urtyqugdt2l/5ZN0GgcR2fSncFwnKuL1RP/e603ba111e193d35510142c7eff9aae4/desktop-deadlift.jpg",
        "Barbell Row": "https://images.unsplash.com/photo-1598268030450-7a476f602bf6?w=500&auto=format",
        "Squat": "https://hips.hearstapps.com/hmg-prod/images/man-training-with-weights-royalty-free-image-1718637105.jpg?crop=0.670xw:1.00xh;0.138xw,0&resize=1200:*",
        "Romanian Deadlift": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&auto=format"
    };

    const handleAddRecord = (exercise) => {
        setEditingExercise(exercise);
        setNewRecord({
            weight: '',
            reps: '',
            date: new Date().toISOString().split('T')[0]
        });
        setIsEditing(true);
    };

    const handleSaveRecord = () => {
        // Here you would typically save to your backend
        console.log('Saving record:', {
            exercise: editingExercise?.name,
            ...newRecord
        });
        
        // Close the modal and reset state
        setIsEditing(false);
        setEditingExercise(null);
        setNewRecord({
            weight: '',
            reps: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    const handleInputChange = (field, value) => {
        setNewRecord(prev => ({
            ...prev,
            [field]: value
        }));
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

                            <div className="grid grid-cols-3 gap-3 text-center flex justify-center">
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
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={userData.progress_history.slice().reverse()}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#FF9A00" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={{ stroke: '#333' }}
                                        axisLine={{ stroke: '#333' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={{ stroke: '#333' }}
                                        axisLine={{ stroke: '#333' }}
                                    />
                                    <Tooltip 
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-[#222] p-3 rounded-lg border border-[#333] shadow-lg">
                                                        <p className="text-sm text-gray-400">{label}</p>
                                                        <p className="text-sm font-medium">
                                                            {payload[0].value} kg
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#FF6B00"
                                        strokeWidth={2}
                                        fill="url(#weightGradient)"
                                        activeDot={{ r: 4, fill: "#FF6B00" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <h3 className="mb-3 font-medium">Body Fat Progression</h3>
                        <div className="relative h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={userData.progress_history.slice().reverse()}
                                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="bodyFatGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={{ stroke: '#333' }}
                                        axisLine={{ stroke: '#333' }}
                                    />
                                    <YAxis 
                                        tick={{ fill: '#666', fontSize: 12 }}
                                        tickLine={{ stroke: '#333' }}
                                        axisLine={{ stroke: '#333' }}
                                    />
                                    <Tooltip 
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-[#222] p-3 rounded-lg border border-[#333] shadow-lg">
                                                        <p className="text-sm text-gray-400">{label}</p>
                                                        <p className="text-sm font-medium">
                                                            {payload[0].value}%
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bodyFat"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="url(#bodyFatGradient)"
                                        activeDot={{ r: 4, fill: "#3B82F6" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <Button 
                    variant="orangeOutline" 
                    fullWidth 
                    className="mt-4"
                    onClick={() => router.push("/client/dashboard/progress")}
                >
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

            {/* Exercise Records Section */}
            <Card variant="dark" className="mt-6" width="100%" maxWidth="none">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-[rgba(255,107,0,0.1)] mr-3">
                            <StrengthIcon className="w-6 h-6" stroke="#FF6B00" />
                        </div>
                        <h2 className="text-xl font-bold">Exercise Records</h2>
                    </div>
                    <Button
                        variant="orangeOutline"
                        size="sm"
                        className="flex items-center gap-2 px-4 py-2"
                        onClick={() => {
                            setEditingExercise(null);
                            setIsEditing(true);
                        }}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Record
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {exerciseCategories.map((category) => (
                        <Card 
                            key={category.name} 
                            variant="dark" 
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#111]"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <h3 className="text-lg font-medium text-[#FF6B00]">{category.name}</h3>
                                <div className="flex-1 border-b border-dashed border-[#333]"></div>
                            </div>

                            <div className="space-y-6">
                                {category.exercises.map((exercise) => (
                                    <div 
                                        key={exercise.name}
                                        className="relative bg-[#1a1a1a] rounded-xl p-6 hover:bg-[#222] transition-all duration-300 group overflow-hidden min-h-[300px] border border-[#333] hover:border-[#444]"
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 opacity-35 group-hover:opacity-40 transition-opacity duration-300">
                                            <Image
                                                src={exerciseImages[exercise.name] || ""}
                                                alt={exercise.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-[#1a1a1a]/60 to-[#1a1a1a]/50"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 h-full flex flex-col">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-lg bg-[rgba(255,107,0,0.1)]">
                                                        <StrengthIcon className="w-5 h-5" stroke="#FF6B00" />
                                                    </div>
                                                    <h4 className="font-semibold text-lg tracking-wide">{exercise.name}</h4>
                                                </div>
                                                <button 
                                                    onClick={() => handleAddRecord(exercise)}
                                                    className="p-2 bg-[#222]/50 hover:bg-[#333] rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105"
                                                >
                                                    <EditIcon className="w-5 h-5 text-[#FF6B00]" />
                                                </button>
                                            </div>

                                            {/* Stats Section */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Last Record */}
                                                <div className="bg-gradient-to-br from-[#111]/90 to-[#191919]/80 backdrop-blur-sm rounded-xl p-3 border border-[#333]/30">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1 h-3 rounded-full bg-[#FF6B00]"></div>
                                                        <p className="text-xs font-medium text-gray-400">Last Record</p>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-[#FF6B00] tabular-nums tracking-tight">
                                                            {exercise.lastRecord.weight}
                                                        </span>
                                                        <span className="text-sm text-gray-400">kg</span>
                                                        <span className="text-sm text-gray-400 ml-2">{exercise.lastRecord.reps} reps</span>
                                                    </div>
                                                </div>

                                                {/* Personal Best */}
                                                <div className="bg-gradient-to-br from-[#111]/90 to-[#191919]/80 backdrop-blur-sm rounded-xl p-3 border border-[#333]/30">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1 h-3 rounded-full bg-[#FF6B00]"></div>
                                                        <p className="text-xs font-medium text-gray-400">Personal Best</p>
                                                    </div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-[#FF6B00] tabular-nums tracking-tight">
                                                            {exercise.personalBest.weight}
                                                        </span>
                                                        <span className="text-sm text-gray-400">kg</span>
                                                        <span className="text-sm text-gray-400 ml-2">{exercise.personalBest.reps} reps</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Chart */}
                                            <div className="mt-3">
                                                <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-3 border border-[#333]/30 h-[120px]">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={exercise.history.slice().reverse()} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                                                            <defs>
                                                                <linearGradient id={`${exercise.name}Gradient`} x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.5}/>
                                                                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.02}/>
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid 
                                                                strokeDasharray="3 3" 
                                                                stroke="#333" 
                                                                vertical={false}
                                                                opacity={0.4} 
                                                            />
                                                            <XAxis 
                                                                dataKey="date" 
                                                                tick={{ fill: '#666', fontSize: 10 }}
                                                                tickLine={{ stroke: '#333' }}
                                                                axisLine={{ stroke: '#333' }}
                                                                dy={2}
                                                            />
                                                            <YAxis 
                                                                tick={{ fill: '#666', fontSize: 10 }}
                                                                tickLine={{ stroke: '#333' }}
                                                                axisLine={{ stroke: '#333' }}
                                                                dx={-2}
                                                                width={35}
                                                            />
                                                            <Tooltip
                                                                content={({ active, payload, label }) => {
                                                                    if (active && payload && payload.length) {
                                                                        return (
                                                                            <div className="bg-[#111] p-2 rounded-lg border border-[#333] shadow-lg">
                                                                                <p className="text-xs text-gray-400">{label}</p>
                                                                                <p className="text-sm font-medium text-[#FF6B00]">
                                                                                    {payload[0].value} kg
                                                                                </p>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return null;
                                                                }}
                                                            />
                                                            <Area
                                                                type="monotone"
                                                                dataKey="weight"
                                                                stroke="#FF6B00"
                                                                strokeWidth={2}
                                                                fill={`url(#${exercise.name}Gradient)`}
                                                                animationDuration={1000}
                                                                dot={{ 
                                                                    fill: '#FF6B00',
                                                                    r: 3,
                                                                    strokeWidth: 0
                                                                }}
                                                                activeDot={{
                                                                    r: 5,
                                                                    fill: '#FF6B00',
                                                                    stroke: '#FFF',
                                                                    strokeWidth: 2
                                                                }}
                                                            />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            {/* Record Input Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-full max-w-md mx-4 animate-fadeIn">
                        <Card variant="dark" className="border border-[#333]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium">
                                    Add Record {editingExercise ? `for ${editingExercise.name}` : ''}
                                </h3>
                                <button 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingExercise(null);
                                    }}
                                    className="p-2 hover:bg-[#333] rounded-lg transition-colors"
                                >
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
                                        onChange={(e) => {
                                            const exercise = exerciseCategories
                                                .flatMap(cat => cat.exercises)
                                                .find(ex => ex.name === e.target.value);
                                            setEditingExercise(exercise);
                                        }}
                                    >
                                        <option value="">Select Exercise</option>
                                        {exerciseCategories.map(category => (
                                            <optgroup key={category.name} label={category.name}>
                                                {category.exercises.map(exercise => (
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
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                        placeholder="Enter weight"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Reps</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                        value={newRecord.reps}
                                        onChange={(e) => handleInputChange('reps', e.target.value)}
                                        placeholder="Enter reps"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-white"
                                        value={newRecord.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button 
                                    variant="orangeFilled"
                                    fullWidth
                                    onClick={handleSaveRecord}
                                    disabled={!newRecord.weight || !newRecord.reps || !editingExercise}
                                >
                                    Save Record
                                </Button>
                                <Button 
                                    variant="dark"
                                    fullWidth
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingExercise(null);
                                        setNewRecord({
                                            weight: '',
                                            reps: '',
                                            date: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
