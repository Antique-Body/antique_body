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
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-gray-400"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
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
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(meal.id);
                            }}
                            className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete Meal
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
