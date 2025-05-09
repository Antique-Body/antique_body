"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SpinnerIcon } from "@/components/common/Icons";
import { EditTrainingPlanForm } from "@/components/custom/trainer/dashboard/pages/plans/training/edit";

export default function EditTrainingPlanPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [planData, setPlanData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching plan data
        const fetchPlan = async () => {
            try {
                // In a real app, this would be an API call to fetch the plan by ID
                // For demo purposes, we'll use the mock data
                setTimeout(() => {
                    // Mock data for demonstration
                    setPlanData({
                        id: params.id,
                        title: "Advanced Strength Training",
                        description:
                            "A comprehensive plan designed for building strength and muscle mass with compound exercises.",
                        coverImage:
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ5MT4Ocyqfw01C34ZMbyPlq3O4FYFNBIJGA&s",
                        price: "129",
                        durationType: "weeks",
                        duration: "8",
                        trainingType: "with-trainer",
                        sessionsPerWeek: "4",
                        sessionFormat: {
                            inPerson: true,
                            online: true,
                        },
                        schedule: [
                            {
                                id: crypto.randomUUID(),
                                name: "Upper Body Power",
                                duration: 75,
                                day: "Monday",
                                description: "Focus on explosive movements and compound exercises for the upper body",
                                exercises: [
                                    {
                                        id: crypto.randomUUID(),
                                        name: "Bench Press",
                                        sets: "5",
                                        reps: "5",
                                        restTime: "180s",
                                        notes: "Focus on controlled eccentric phase",
                                    },
                                    {
                                        id: crypto.randomUUID(),
                                        name: "Weighted Pull-Ups",
                                        sets: "4",
                                        reps: "6-8",
                                        restTime: "120s",
                                        notes: "Add weight as needed for proper challenge",
                                    },
                                ],
                            },
                            {
                                id: crypto.randomUUID(),
                                name: "Lower Body Power",
                                duration: 90,
                                day: "Wednesday",
                                description: "Heavy compound movements for lower body strength development",
                                exercises: [
                                    {
                                        id: crypto.randomUUID(),
                                        name: "Barbell Squat",
                                        sets: "5",
                                        reps: "5",
                                        restTime: "180s",
                                        notes: "Focus on depth and maintaining neutral spine",
                                    },
                                    {
                                        id: crypto.randomUUID(),
                                        name: "Romanian Deadlift",
                                        sets: "3",
                                        reps: "8",
                                        restTime: "120s",
                                        notes: "Focus on hamstring stretch at bottom",
                                    },
                                ],
                            },
                        ],
                        exerciseLibrary: [
                            {
                                id: crypto.randomUUID(),
                                name: "Barbell Bench Press",
                                category: "chest",
                                description: "Compound movement for chest, shoulders, and triceps",
                            },
                            {
                                id: crypto.randomUUID(),
                                name: "Pull-Up",
                                category: "back",
                                description: "Upper back and biceps exercise using bodyweight",
                            },
                        ],
                    });
                    setLoading(false);
                }, 800);
            } catch (err) {
                setError("Failed to load training plan");
                console.error(err);
                setLoading(false);
            }
        };

        fetchPlan();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center">
                    <SpinnerIcon className="h-10 w-10 text-[#FF6B00]" />
                    <p className="mt-4 text-gray-400">Loading training plan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-red-500">Error</h3>
                    <p className="text-gray-400">{error}</p>
                    <button
                        onClick={() => router.push("/trainer/dashboard/plans")}
                        className="mt-4 rounded-lg bg-[#333] px-4 py-2 text-white hover:bg-[#444]"
                    >
                        Return to Plans
                    </button>
                </div>
            </div>
        );
    }

    return planData ? <EditTrainingPlanForm initialData={planData} /> : null;
}
