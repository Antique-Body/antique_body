"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import {
    NextTraining,
    CoachMessages,
    NutritionOverview,
    ProgressGraph,
    TodaysWorkout,
    ExerciseRecords,
    RecordInputModal,
} from "@/components/custom/client/dashboard/pages/overview/components";

export default function OverviewPage() {
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

    const [isEditing, setIsEditing] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [newRecord, setNewRecord] = useState({
        weight: "",
        reps: "",
        date: new Date().toISOString().split("T")[0],
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
                        { date: "2024-02-15", weight: 90, reps: 10 },
                    ],
                },
                {
                    name: "Shoulder Press",
                    lastRecord: { weight: 60, reps: 10, date: "2024-03-14" },
                    personalBest: { weight: 65, reps: 8, date: "2024-02-10" },
                    history: [
                        { date: "2024-03-14", weight: 60, reps: 10 },
                        { date: "2024-03-01", weight: 57.5, reps: 10 },
                        { date: "2024-02-15", weight: 55, reps: 12 },
                    ],
                },
            ],
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
                        { date: "2024-02-14", weight: 150, reps: 8 },
                    ],
                },
                {
                    name: "Barbell Row",
                    lastRecord: { weight: 80, reps: 12, date: "2024-03-12" },
                    personalBest: { weight: 85, reps: 10, date: "2024-02-08" },
                    history: [
                        { date: "2024-03-12", weight: 80, reps: 12 },
                        { date: "2024-02-27", weight: 77.5, reps: 12 },
                        { date: "2024-02-13", weight: 75, reps: 12 },
                    ],
                },
            ],
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
                        { date: "2024-02-12", weight: 130, reps: 8 },
                    ],
                },
                {
                    name: "Romanian Deadlift",
                    lastRecord: { weight: 100, reps: 12, date: "2024-03-10" },
                    personalBest: { weight: 110, reps: 10, date: "2024-02-07" },
                    history: [
                        { date: "2024-03-10", weight: 100, reps: 12 },
                        { date: "2024-02-25", weight: 95, reps: 12 },
                        { date: "2024-02-11", weight: 90, reps: 12 },
                    ],
                },
            ],
        },
    ];

    const exerciseImages = {
        "Bench Press": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf3cAvxLaXUpWePM6OM5zSCpdENU46OEWwSg&s",
        "Shoulder Press": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=500&auto=format",
        Deadlift:
            "https://images.ctfassets.net/8urtyqugdt2l/5ZN0GgcR2fSncFwnKuL1RP/e603ba111e193d35510142c7eff9aae4/desktop-deadlift.jpg",
        "Barbell Row": "https://images.unsplash.com/photo-1598268030450-7a476f602bf6?w=500&auto=format",
        Squat: "https://hips.hearstapps.com/hmg-prod/images/man-training-with-weights-royalty-free-image-1718637105.jpg?crop=0.670xw:1.00xh;0.138xw,0&resize=1200:*",
        "Romanian Deadlift": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&auto=format",
    };

    const handleAddRecord = (exercise) => {
        setEditingExercise(exercise);
        setNewRecord({
            weight: "",
            reps: "",
            date: new Date().toISOString().split("T")[0],
        });
        setIsEditing(true);
    };

    const handleSaveRecord = () => {
        // Close the modal and reset state
        setIsEditing(false);
        setEditingExercise(null);
        setNewRecord({
            weight: "",
            reps: "",
            date: new Date().toISOString().split("T")[0],
        });
    };

    const handleInputChange = (field, value) => {
        setNewRecord((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleExerciseSelect = (exerciseName) => {
        const exercise = exerciseCategories.flatMap((cat) => cat.exercises).find((ex) => ex.name === exerciseName);
        setEditingExercise(exercise);
    };

    const handleAddNewRecord = () => {
        setEditingExercise(null);
        setIsEditing(true);
    };

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Next Session */}
                <NextTraining training={userData.upcoming_trainings[0]} />

                {/* Messages Preview */}
                <CoachMessages messages={userData.messages} />

                {/* Nutrition Summary */}
                <NutritionOverview stats={userData.stats} />
            </div>

            {/* Progress Graph */}
            <ProgressGraph progressData={userData.progress_history} />

            {/* Today's Workout */}
            <TodaysWorkout workout={userData.workout_plan.friday} />

            {/* Exercise Records Section */}
            <ExerciseRecords
                categories={exerciseCategories}
                exerciseImages={exerciseImages}
                onAddRecord={handleAddRecord}
                onAddNewRecord={handleAddNewRecord}
            />

            {/* Record Input Modal */}
            <RecordInputModal
                isOpen={isEditing}
                editingExercise={editingExercise}
                newRecord={newRecord}
                onClose={() => {
                    setIsEditing(false);
                    setEditingExercise(null);
                    setNewRecord({
                        weight: "",
                        reps: "",
                        date: new Date().toISOString().split("T")[0],
                    });
                }}
                onSave={handleSaveRecord}
                onInputChange={handleInputChange}
                exerciseCategories={exerciseCategories}
                onExerciseSelect={handleExerciseSelect}
            />
        </div>
    );
}
