import { Icon } from "@iconify/react";

import { Card } from "@/components/common/Card";
import { NutritionPlanFeatures } from "@/components/custom/dashboard/trainer/components/NutritionPlanFeatures";

export function NutritionSidebar({
  planData,
  client,
  notes,
  supplementationRecommendations,
  onNotesChange,
  onSupplementationChange,
}) {
  return (
    <div className="space-y-6">
      {/* Nutrition Plan Features */}
      <NutritionPlanFeatures planData={planData} />

      {/* Trainer Notes */}
      <Card
        variant="dark"
        className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="mdi:note-text"
            className="text-[#3E92CC]"
            width={28}
            height={28}
          />
          <h3 className="text-xl font-semibold text-white">Daily Notes</h3>
        </div>
        <textarea
          value={notes}
          onChange={onNotesChange}
          placeholder="Add notes about client's progress, observations, or recommendations..."
          className="w-full h-40 px-4 py-3 bg-zinc-700/30 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 resize-none transition-all"
        />
      </Card>

      {/* Client Dietary Preferences */}
      <Card
        variant="dark"
        className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="mdi:account-heart"
            className="text-[#3E92CC]"
            width={28}
            height={28}
          />
          <h3 className="text-xl font-semibold text-white">
            Client Dietary Preferences
          </h3>
        </div>
        <div className="space-y-3">
          {(() => {
            const clientProfile = client?.client?.clientProfile;
            const dietaryPreferences = clientProfile?.dietaryPreferences || [];

            if (dietaryPreferences.length === 0) {
              return (
                <div className="text-center py-6 bg-zinc-700/20 rounded-xl border-2 border-dashed border-zinc-600/50">
                  <Icon
                    icon="mdi:silverware"
                    className="text-zinc-500 mx-auto mb-2"
                    width={24}
                    height={24}
                  />
                  <p className="text-zinc-400 text-sm">
                    No dietary preferences specified
                  </p>
                </div>
              );
            }

            return dietaryPreferences.map((preference, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-[#3E92CC] rounded-full flex-shrink-0" />
                <span className="text-white text-sm font-medium">
                  {preference.charAt(0).toUpperCase() +
                    preference.slice(1).replace(/([A-Z])/g, " $1")}
                </span>
              </div>
            ));
          })()}
        </div>
      </Card>

      {/* Supplementation Recommendations */}
      <Card
        variant="dark"
        className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Icon
            icon="mdi:pill"
            className="text-[#3E92CC]"
            width={28}
            height={28}
          />
          <h3 className="text-xl font-semibold text-white">Supplementation</h3>
        </div>
        <textarea
          value={supplementationRecommendations}
          onChange={onSupplementationChange}
          placeholder="Add recommended supplements, dosages, and timing..."
          className="w-full h-40 px-4 py-3 bg-zinc-700/30 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 resize-none transition-all"
        />
      </Card>
    </div>
  );
}