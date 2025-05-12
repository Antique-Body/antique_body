"use client";

import { useEffect, useState } from "react";

import { MealsList } from "@/components/custom/trainer/dashboard/pages/meals/components";
import mockMeals from "@/components/custom/trainer/dashboard/pages/meals/data/mockMeals";

export default function MealsPage() {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        // In a real app, this would fetch from an API
        setMeals(mockMeals);
    }, []);

    // Handle updating meals (create, edit, delete)
    const handleMealsUpdate = (updatedMeals) => {
        setMeals(updatedMeals);

        // In a real app, you would persist these changes to a database

        // eslint-disable-next-line no-console
        console.log("Meals updated:", updatedMeals);
    };

    return (
        <div className="w-full pb-12">
            <div className="mb-6 px-6 py-4">
                <h1 className="mb-2 text-3xl font-bold text-white">Meal Library</h1>
                <p className="text-gray-400">Create and manage custom meals for your nutrition plans</p>
            </div>

            <div className="px-6">
                <MealsList meals={meals} onUpdate={handleMealsUpdate} />
            </div>
        </div>
    );
}
