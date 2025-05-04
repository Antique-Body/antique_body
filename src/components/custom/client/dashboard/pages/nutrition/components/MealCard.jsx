import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { ChevronDownIcon, EditIcon, PlusIcon, TrashIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const MealCard = ({ meal, onDelete, onEdit, onAddFood }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card variant="dark" width="100%" maxWidth="none">
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={() => setIsExpanded(!isExpanded)}>
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
            className="p-0 text-gray-400"
          >
            <ChevronDownIcon size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mb-3 h-px bg-[#444]"></div>
          
          {/* Meal macro distribution summary */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            <div className="rounded bg-[rgba(59,130,246,0.15)] px-2 py-1.5">
              <p className="text-xs text-gray-400">Protein</p>
              <p className="text-sm font-medium text-blue-500">{meal.protein}g</p>
            </div>
            <div className="rounded bg-[rgba(34,197,94,0.15)] px-2 py-1.5">
              <p className="text-xs text-gray-400">Carbs</p>
              <p className="text-sm font-medium text-green-500">{meal.carbs}g</p>
            </div>
            <div className="rounded bg-[rgba(234,179,8,0.15)] px-2 py-1.5">
              <p className="text-xs text-gray-400">Fat</p>
              <p className="text-sm font-medium text-yellow-500">{meal.fat}g</p>
            </div>
            <div className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1.5">
              <p className="text-xs text-gray-400">Calories</p>
              <p className="text-sm font-medium text-orange-500">{meal.calories}</p>
            </div>
          </div>
          
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {meal.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-[rgba(20,20,20,0.5)] p-2">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{item.calories} kcal</p>
                  <p className="text-xs text-gray-400">
                    P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <Button
                variant="orangeOutline"
                size="small"
                leftIcon={<PlusIcon size={14} />}
                className="text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFood && onAddFood();
                }}
              >
                Add Food
              </Button>
              
              <Button
                variant="secondary"
                size="small"
                leftIcon={<EditIcon size={14} />}
                className="text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit && onEdit();
                }}
              >
                Edit Meal
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                onDelete(meal.id);
              }}
              className="flex items-center gap-1 p-0 text-sm text-red-500 hover:text-red-400"
            >
              <TrashIcon size={14} />
              Delete Meal
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
