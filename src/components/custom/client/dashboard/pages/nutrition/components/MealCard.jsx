import { Button } from "@/components/common/Button";
import { ChevronDownIcon, TrashIcon } from "@/components/common/Icons";
import { useState } from "react";

export const MealCard = ({ meal, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-[rgba(30,30,30,0.8)] rounded-xl border border-[#333]">
            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">{meal.name}</h3>
                        <span className="text-xs text-gray-400">{meal.time}</span>
                    </div>
                    <p className="text-sm text-gray-400">
                        {meal.items.length} {meal.items.length === 1 ? "item" : "items"}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-medium">{meal.calories} kcal</p>
                        <p className="text-xs text-gray-400">
                            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-gray-400 p-0"
                    >
                        <ChevronDownIcon size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4">
                    <div className="h-px bg-[#444] mb-3"></div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {meal.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-[rgba(20,20,20,0.5)] rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.amount}</p>
                                </div>
                                <p className="text-sm">{item.calories} kcal</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-3">
                        <Button
                            variant="ghost"
                            onClick={e => {
                                e.stopPropagation();
                                onDelete(meal.id);
                            }}
                            className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1 p-0"
                        >
                            <TrashIcon size={14} />
                            Delete Meal
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
