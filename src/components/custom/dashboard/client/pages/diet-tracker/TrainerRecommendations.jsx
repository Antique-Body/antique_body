"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Card } from "@/components/common/Card";

export const TrainerRecommendations = ({ assignedPlanId, selectedDate }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignedPlanId && selectedDate) {
      fetchRecommendations();
    }
  }, [assignedPlanId, selectedDate]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/client/trainer-recommendations?assignedPlanId=${assignedPlanId}&date=${selectedDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error("Error fetching trainer recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card variant="dark" className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 border-2 border-[#3E92CC] border-t-transparent rounded-full animate-spin" />
          <span className="text-zinc-400">
            Loading trainer recommendations...
          </span>
        </div>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card variant="dark" className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon
          icon="mdi:account-supervisor"
          className="text-[#3E92CC]"
          width={20}
          height={20}
        />
        <h3 className="text-lg font-semibold text-white">
          Trainer's Recommendations
        </h3>
      </div>

      <div className="space-y-4">
        {/* Notes */}
        {recommendations.notes && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:note-text"
                className="text-blue-400"
                width={16}
                height={16}
              />
              <span className="text-blue-400 text-sm font-medium">
                Daily Notes
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {recommendations.notes}
            </p>
          </div>
        )}

        {/* Supplementation */}
        {recommendations.supplementation && (
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:pill"
                className="text-purple-400"
                width={16}
                height={16}
              />
              <span className="text-purple-400 text-sm font-medium">
                Supplementation
              </span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {recommendations.supplementation}
            </p>
          </div>
        )}

        {/* Meal Status */}
        {recommendations.meals &&
          Object.keys(recommendations.meals).length > 0 && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  icon="mdi:food-apple"
                  className="text-green-400"
                  width={16}
                  height={16}
                />
                <span className="text-green-400 text-sm font-medium">
                  Meal Status
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(recommendations.meals).map(
                  ([mealKey, mealData]) => (
                    <div
                      key={mealKey}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            mealData.status === "completed"
                              ? "bg-green-400"
                              : mealData.status === "incomplete"
                                ? "bg-red-400"
                                : "bg-yellow-400"
                          }`}
                        />
                        <span className="text-zinc-300 text-sm">
                          {mealData.mealName || `Meal ${mealKey}`}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          mealData.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : mealData.status === "incomplete"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {mealData.status === "completed"
                          ? "Completed"
                          : mealData.status === "incomplete"
                            ? "Incomplete"
                            : "Pending"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* No recommendations message */}
        {!recommendations.notes &&
          !recommendations.supplementation &&
          (!recommendations.meals ||
            Object.keys(recommendations.meals).length === 0) && (
            <div className="text-center py-4">
              <Icon
                icon="mdi:information"
                className="text-zinc-500 mx-auto mb-2"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-sm">
                No specific recommendations for this date
              </p>
            </div>
          )}
      </div>
    </Card>
  );
};
