import { Icon } from "@iconify/react";

import { Card } from "@/components/common/Card";

export function ClientProgressSection({ clientProgress, loadingClientProgress, planData }) {
  // Check for recent client updates
  const hasRecentClientUpdate = planData?.lastClientUpdate && 
    new Date(planData.lastClientUpdate) > new Date(Date.now() - 5 * 60 * 1000); // Within last 5 minutes

  const getUpdateMessage = () => {
    if (!planData?.clientUpdateType || !planData?.lastUpdatedMeal) return null;
    
    const meal = planData.lastUpdatedMeal;
    const updateTime = new Date(planData.lastClientUpdate);
    const timeAgo = Math.floor((Date.now() - updateTime.getTime()) / (1000 * 60));
    
    switch (planData.clientUpdateType) {
      case 'meal_completed':
        return `Client completed "${meal.name}" ${timeAgo}m ago`;
      case 'meal_uncompleted':
        return `Client uncompleted "${meal.name}" ${timeAgo}m ago`;
      case 'meal_option_changed':
        return `Client changed meal option for "${meal.name}" ${timeAgo}m ago`;
      case 'water_added':
        const waterUpdate = planData.lastWaterUpdate;
        return `Client added ${waterUpdate?.amount || 0}ml water (${waterUpdate?.newTotal || 0}ml total) ${timeAgo}m ago`;
      case 'water_reset':
        return `Client reset water intake ${timeAgo}m ago`;
      default:
        return `Client made changes ${timeAgo}m ago`;
    }
  };

  return (
    <Card
      variant="dark"
      className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <Icon
          icon="mdi:account-check"
          className="text-green-400"
          width={28}
          height={28}
        />
        <h3 className="text-xl font-semibold text-white">
          Client's Actual Progress
        </h3>
        {loadingClientProgress && (
          <div className="w-5 h-5 border-2 border-[#3E92CC] border-t-transparent rounded-full animate-spin" />
        )}
        {hasRecentClientUpdate && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live Update</span>
          </div>
        )}
      </div>

      {/* Show recent update notification */}
      {hasRecentClientUpdate && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              icon="mdi:bell"
              className="text-blue-400"
              width={16}
              height={16}
            />
            <span className="text-blue-400 text-sm font-medium">Recent Activity</span>
          </div>
          <p className="text-zinc-300 text-sm">{getUpdateMessage()}</p>
        </div>
      )}

      {clientProgress ? (
        clientProgress.hasActiveTracking ? (
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(clientProgress.completionRate)}%
                </div>
                <div className="text-zinc-400 text-sm">Completion</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {clientProgress.completedMeals}/{clientProgress.totalMeals}
                </div>
                <div className="text-zinc-400 text-sm">Meals Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="text-2xl font-bold text-orange-400">
                  {Math.round(clientProgress.totalNutrition.calories)}
                </div>
                <div className="text-zinc-400 text-sm">Calories Consumed</div>
              </div>
              <div className="text-center p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <div className="text-2xl font-bold text-cyan-400">
                  {clientProgress.waterIntake?.current || 0}ml
                </div>
                <div className="text-zinc-400 text-sm">Water Intake</div>
                <div className="text-xs text-cyan-300 mt-1">
                  {Math.round((clientProgress.waterIntake?.current || 0) / (clientProgress.waterIntake?.goal || 4000) * 100)}% of goal
                </div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="text-2xl font-bold text-purple-400">
                  {clientProgress.snacks.length}
                </div>
                <div className="text-zinc-400 text-sm">Snacks Added</div>
              </div>
            </div>

            {/* Completed Meals */}
            {clientProgress.meals.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Completed Meals
                </h4>
                <div className="space-y-3">
                  {clientProgress.meals.map((meal) => (
                    <div
                      key={meal.id}
                      className={`p-4 rounded-xl border ${
                        meal.isCompleted
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-zinc-800/30 border-zinc-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              meal.isCompleted ? "bg-green-400" : "bg-zinc-600"
                            }`}
                          />
                          <div>
                            <div className="text-white font-medium">
                              {meal.name}
                            </div>
                            <div className="text-zinc-400 text-sm">
                              {meal.time} •{" "}
                              {meal.selectedOption?.name || "Default option"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {Math.round(meal.nutrition.calories)} cal
                          </div>
                          <div className="text-zinc-400 text-xs">
                            {meal.nutrition.protein}g P • {meal.nutrition.carbs}g C •{" "}
                            {meal.nutrition.fat}g F
                          </div>
                        </div>
                      </div>
                      {meal.completedAt && (
                        <div className="text-zinc-500 text-xs mt-2">
                          Completed at{" "}
                          {new Date(meal.completedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Snacks */}
            {clientProgress.snacks.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Snacks & Extras
                </h4>
                <div className="space-y-3">
                  {clientProgress.snacks.map((snack) => (
                    <div
                      key={snack.id}
                      className="p-4 bg-zinc-800/30 border border-zinc-700/50 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">
                            {snack.name}
                          </div>
                          <div className="text-zinc-400 text-sm">
                            {snack.loggedTime} • {snack.mealType}
                          </div>
                          {snack.description && (
                            <div className="text-zinc-500 text-sm mt-1">
                              {snack.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {Math.round(snack.nutrition.calories)} cal
                          </div>
                          <div className="text-zinc-400 text-xs">
                            {snack.nutrition.protein}g P • {snack.nutrition.carbs}g C •{" "}
                            {snack.nutrition.fat}g F
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon
              icon="mdi:account-clock"
              className="text-zinc-500 mx-auto mb-4"
              width={48}
              height={48}
            />
            <h4 className="text-zinc-300 text-lg font-medium mb-2">
              Client hasn't started tracking yet
            </h4>
            <p className="text-zinc-400 text-sm">
              {clientProgress.message ||
                "The client needs to start tracking this nutrition plan in their diet tracker."}
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#3E92CC] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading client progress...</p>
        </div>
      )}
    </Card>
  );
}