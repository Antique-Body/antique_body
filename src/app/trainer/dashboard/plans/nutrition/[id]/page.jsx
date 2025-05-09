"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SpinnerIcon } from "@/components/common/Icons";
import { EditNutritionPlanForm } from "@/components/custom/trainer/dashboard/pages/plans/nutrition/edit";

export default function EditNutritionPlanPage() {
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
                        title: "Mediterranean Diet Plan",
                        description:
                            "A balanced nutrition plan based on the Mediterranean diet principles for overall health improvement.",
                        coverImage: "/images/plans/nutrition-3.jpg",
                        targetGoal: "maintenance",
                        nutritionInfo: {
                            calories: "2200",
                            protein: "120",
                            carbs: "220",
                            fats: "70",
                        },
                        days: {
                            Monday: {
                                mealPlans: [
                                    {
                                        name: "Breakfast",
                                        time: "08:00",
                                        options: [
                                            {
                                                id: crypto.randomUUID(),
                                                name: "Greek Yogurt Bowl",
                                                description: "High protein breakfast with fruits and nuts",
                                                ingredients: [
                                                    { id: crypto.randomUUID(), name: "Greek Yogurt", quantity: "1 cup" },
                                                    { id: crypto.randomUUID(), name: "Mixed Berries", quantity: "1/2 cup" },
                                                    { id: crypto.randomUUID(), name: "Almonds", quantity: "15g" },
                                                    { id: crypto.randomUUID(), name: "Honey", quantity: "1 tsp" },
                                                ],
                                            },
                                            {
                                                id: crypto.randomUUID(),
                                                name: "Mediterranean Omelette",
                                                description: "Protein-rich breakfast with vegetables and feta",
                                                ingredients: [
                                                    { id: crypto.randomUUID(), name: "Eggs", quantity: "3 large" },
                                                    { id: crypto.randomUUID(), name: "Spinach", quantity: "1 cup" },
                                                    { id: crypto.randomUUID(), name: "Tomato", quantity: "1 medium" },
                                                    { id: crypto.randomUUID(), name: "Feta Cheese", quantity: "30g" },
                                                    { id: crypto.randomUUID(), name: "Olive Oil", quantity: "1 tsp" },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        name: "Lunch",
                                        time: "13:00",
                                        options: [
                                            {
                                                id: crypto.randomUUID(),
                                                name: "Mediterranean Salad",
                                                description: "Fresh salad with olive oil dressing",
                                                ingredients: [
                                                    { id: crypto.randomUUID(), name: "Mixed Greens", quantity: "2 cups" },
                                                    { id: crypto.randomUUID(), name: "Cherry Tomatoes", quantity: "1/2 cup" },
                                                    { id: crypto.randomUUID(), name: "Cucumber", quantity: "1/2 medium" },
                                                    { id: crypto.randomUUID(), name: "Kalamata Olives", quantity: "10" },
                                                    { id: crypto.randomUUID(), name: "Feta Cheese", quantity: "30g" },
                                                    { id: crypto.randomUUID(), name: "Olive Oil", quantity: "1 tbsp" },
                                                    { id: crypto.randomUUID(), name: "Lemon Juice", quantity: "1 tsp" },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        name: "Dinner",
                                        time: "19:00",
                                        options: [
                                            {
                                                id: crypto.randomUUID(),
                                                name: "Grilled Fish with Vegetables",
                                                description: "Protein-rich dinner with healthy fats",
                                                ingredients: [
                                                    {
                                                        id: crypto.randomUUID(),
                                                        name: "White Fish (Cod/Tilapia)",
                                                        quantity: "150g",
                                                    },
                                                    { id: crypto.randomUUID(), name: "Zucchini", quantity: "1 medium" },
                                                    { id: crypto.randomUUID(), name: "Bell Pepper", quantity: "1 medium" },
                                                    { id: crypto.randomUUID(), name: "Quinoa", quantity: "1/2 cup cooked" },
                                                    { id: crypto.randomUUID(), name: "Olive Oil", quantity: "1 tbsp" },
                                                    { id: crypto.randomUUID(), name: "Lemon", quantity: "1/2" },
                                                    { id: crypto.randomUUID(), name: "Garlic", quantity: "2 cloves" },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            Tuesday: {
                                mealPlans: [
                                    {
                                        name: "Breakfast",
                                        time: "08:00",
                                        options: [
                                            {
                                                id: crypto.randomUUID(),
                                                name: "Avocado Toast",
                                                description: "Healthy fats and protein to start the day",
                                                ingredients: [
                                                    {
                                                        id: crypto.randomUUID(),
                                                        name: "Whole Grain Bread",
                                                        quantity: "2 slices",
                                                    },
                                                    { id: crypto.randomUUID(), name: "Avocado", quantity: "1/2" },
                                                    { id: crypto.randomUUID(), name: "Eggs", quantity: "2 large" },
                                                    { id: crypto.randomUUID(), name: "Cherry Tomatoes", quantity: "5" },
                                                    {
                                                        id: crypto.randomUUID(),
                                                        name: "Red Pepper Flakes",
                                                        quantity: "to taste",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    });
                    setLoading(false);
                }, 800);
            } catch (err) {
                console.error(err);
                setError("Failed to load nutrition plan");
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
                    <p className="mt-4 text-gray-400">Loading nutrition plan...</p>
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

    return planData ? <EditNutritionPlanForm initialData={planData} /> : null;
}
