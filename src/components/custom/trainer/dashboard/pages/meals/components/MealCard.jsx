"use client";

import Image from "next/image";

import { EditIcon, IconButton, TrashIcon, ViewIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const MealCard = ({ meal, onView, onEdit, onDelete }) => {
    const { name, type, calories, protein, carbs, fat, prepTime, ingredients, imageUrl } = meal;

    // Function to get badge color for meal type
    const getTypeBadgeColor = (type) => {
        switch (type) {
            case "breakfast":
                return "bg-yellow-900/40 text-yellow-300";
            case "lunch":
                return "bg-green-900/40 text-green-300";
            case "dinner":
                return "bg-blue-900/40 text-blue-300";
            case "snack":
                return "bg-purple-900/40 text-purple-300";
            default:
                return "bg-gray-900/40 text-gray-300";
        }
    };

    return (
        <Card
            variant="planCard"
            width="100%"
            maxWidth="100%"
            className="transform cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={() => onView(meal)}
        >
            <div className="flex h-full flex-col">
                {/* Card Header with Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="relative h-full w-full">
                        <Image
                            src={imageUrl || "/images/placeholder-meal.jpg"}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover object-center transition-transform duration-500 hover:scale-110"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                        <div className="flex justify-between">
                            <div>
                                <span
                                    className={`inline-block rounded-md px-2 py-1 text-xs font-semibold ${getTypeBadgeColor(type)}`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </span>
                            </div>
                            <div>
                                <span className="ml-2 inline-block rounded-md bg-orange-900/60 px-2 py-1 text-xs font-semibold text-orange-200">
                                    {prepTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold text-white">{name}</h3>

                    <div className="mb-3 flex items-center text-sm text-gray-400">
                        <span>{calories} calories</span>
                        <span className="mx-2">•</span>
                        <span>Prep: {prepTime}</span>
                    </div>

                    {/* Nutrition Information */}
                    <div className="mb-4 grid grid-cols-3 gap-2">
                        <div className="rounded bg-[rgba(59,130,246,0.15)] px-2 py-1.5">
                            <p className="text-xs text-gray-400">Protein</p>
                            <p className="text-sm font-medium text-blue-500">{protein}g</p>
                        </div>
                        <div className="rounded bg-[rgba(34,197,94,0.15)] px-2 py-1.5">
                            <p className="text-xs text-gray-400">Carbs</p>
                            <p className="text-sm font-medium text-green-500">{carbs}g</p>
                        </div>
                        <div className="rounded bg-[rgba(234,179,8,0.15)] px-2 py-1.5">
                            <p className="text-xs text-gray-400">Fat</p>
                            <p className="text-sm font-medium text-yellow-500">{fat}g</p>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mt-3">
                        <p className="mb-2 text-xs text-gray-400">Ingredients:</p>
                        <div className="flex flex-wrap gap-2">
                            {ingredients.slice(0, 3).map((ingredient, index) => (
                                <div
                                    key={index}
                                    className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs text-[#FF6B00]"
                                >
                                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                                </div>
                            ))}
                            {ingredients.length > 3 && (
                                <div className="rounded-md bg-[rgba(255,255,255,0.1)] px-2 py-1 text-xs text-gray-400">
                                    +{ingredients.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex justify-end border-t border-gray-800 p-3">
                    <IconButton
                        icon={ViewIcon}
                        size={16}
                        onClick={(e) => {
                            e.stopPropagation();
                            onView(meal);
                        }}
                        className="mr-2"
                    />
                    <IconButton
                        icon={EditIcon}
                        size={16}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(meal);
                        }}
                        className="mr-2"
                    />
                    <IconButton
                        icon={TrashIcon}
                        size={16}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(meal.id);
                        }}
                        defaultColor="text-zinc-400"
                        hoverColor="text-red-500"
                        hoverBg="hover:bg-red-900/40"
                    />
                </div>
            </div>
        </Card>
    );
};
