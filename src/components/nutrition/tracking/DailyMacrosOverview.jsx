import { Icon } from "@iconify/react";

import { Card } from "@/components/common/Card";

export function DailyMacrosOverview({ planData }) {
  return (
    <Card
      variant="dark"
      className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon
          icon="mdi:chart-donut"
          className="text-[#3E92CC]"
          width={28}
          height={28}
        />
        <h3 className="text-xl font-semibold text-white">Daily Macros Target</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/20">
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {planData?.nutritionInfo?.calories || 0}
          </div>
          <div className="text-zinc-400 text-sm font-medium">Calories</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/20">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {planData?.nutritionInfo?.protein || 0}g
          </div>
          <div className="text-zinc-400 text-sm font-medium">Protein</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-2xl border border-yellow-500/20">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {planData?.nutritionInfo?.carbs || 0}g
          </div>
          <div className="text-zinc-400 text-sm font-medium">Carbs</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl border border-green-500/20">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {planData?.nutritionInfo?.fats || 0}g
          </div>
          <div className="text-zinc-400 text-sm font-medium">Fats</div>
        </div>
      </div>
    </Card>
  );
}