"use client";

import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const CreateMealCard = ({ onClick }) => (
    <Card
        variant="planCard"
        width="100%"
        maxWidth="100%"
        className="border-2 border-dashed border-gray-700 bg-transparent cursor-pointer hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all duration-300"
        onClick={onClick}
    >
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B00]/10">
                <PlusIcon size={30} className="text-[#FF6B00]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Create New Meal</h3>
            <p className="text-gray-400">Add a customized meal to your nutrition library</p>
        </div>
    </Card>
);
