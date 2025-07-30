import { Icon } from "@iconify/react";
import Image from "next/image";

import { Button } from "@/components/common/Button";

export const NutritionPlanCard = ({ plan, onViewPlan }) => (
  <div className="relative group w-full bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200 hover:shadow-sm overflow-hidden">
    {/* Main Card Content */}
    <div className="flex items-center p-3 gap-3">
      {/* Plan Image */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 overflow-hidden rounded-md">
          {plan.coverImage ? (
            <Image
              src={plan.coverImage}
              alt={plan.title}
              className="object-cover w-full h-full"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Icon icon={plan.icon} className="w-5 h-5 text-zinc-400" />
            </div>
          )}
        </div>
      </div>

      {/* Plan Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-white truncate mb-1">
          {plan.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>{plan.nutritionInfo.calories} cal</span>
          <span>
            {plan.duration} {plan.durationType}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="small"
          onClick={() => onViewPlan(plan)}
          className="px-2 py-1 text-xs text-zinc-300 hover:text-white hover:bg-white/10 border-0 rounded transition-all duration-200"
        >
          View
        </Button>
      </div>
    </div>
  </div>
);
