import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/common/Button";
import { NutritionIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const NutritionOverview = ({ stats }) => {
    const router = useRouter();

    return (
        <Card variant="dark" width="100%" maxWidth="none">
            <h2 className="mb-4 flex items-center text-xl font-bold">
                <NutritionIcon className="mr-2" stroke="#FF6B00" />
                Nutrition Overview
            </h2>

            <div className="space-y-3">
                <Card variant="dark" width="100%" maxWidth="none">
                    <p className="mb-1 text-sm font-medium text-gray-400">Daily Target</p>
                    <p className="mb-2 text-xl font-bold">{stats.calorieGoal} cal</p>

                    <div className="grid grid-cols-3 gap-3 text-center flex justify-center">
                        <div>
                            <p className="text-xs text-gray-400">Protein</p>
                            <p className="text-sm font-bold">{stats.proteinGoal}g</p>
                            <div className="mt-1 h-1 rounded-full bg-[#333]">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: "70%" }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Carbs</p>
                            <p className="text-sm font-bold">{stats.carbsGoal}g</p>
                            <div className="mt-1 h-1 rounded-full bg-[#333]">
                                <div className="h-full rounded-full bg-green-500" style={{ width: "60%" }}></div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Fat</p>
                            <p className="text-sm font-bold">{stats.fatGoal}g</p>
                            <div className="mt-1 h-1 rounded-full bg-[#333]">
                                <div className="h-full rounded-full bg-yellow-500" style={{ width: "50%" }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="mt-4">
                <Button variant="orangeOutline" fullWidth onClick={() => router.push("/client/dashboard/nutrition")}>
                    Open Nutrition Tracker
                </Button>
            </div>
        </Card>
    );
};
