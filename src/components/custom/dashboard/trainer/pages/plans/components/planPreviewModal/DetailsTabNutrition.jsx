import { Icon } from "@iconify/react";

export const DetailsTabNutrition = ({
  plan,
  supplementRecommendations,
  duration,
  cookingTime,
  nutritionInfo,
}) => {
  let averageCookingTime = null;
  if (plan.days && Array.isArray(plan.days) && plan.days.length > 0) {
    const times = plan.days
      .map((d) => parseInt(d.cookingTime, 10))
      .filter((t) => !isNaN(t));
    if (times.length > 0) {
      averageCookingTime = Math.round(
        times.reduce((a, b) => a + b, 0) / times.length
      );
    }
  }
  return (
    <div className="space-y-6">
      {supplementRecommendations && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3">
            Supplement Recommendations
          </h3>
          <p className="text-gray-300">{supplementRecommendations}</p>
        </div>
      )}
      {duration && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3">Duration</h3>
          <p className="text-gray-300">{duration}</p>
        </div>
      )}
      {cookingTime && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3">
            Preparation Time
          </h3>
          <p className="text-gray-300">{cookingTime}</p>
        </div>
      )}
      {averageCookingTime && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3">
            Average Cooking Time (per day)
          </h3>
          <p className="text-gray-300">{averageCookingTime} min</p>
        </div>
      )}
      {plan.targetGoal && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3">Target Goal</h3>
          <p className="text-gray-300">{plan.targetGoal}</p>
        </div>
      )}
      {nutritionInfo && (
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Icon
              icon="heroicons:beaker-20-solid"
              className="w-5 h-5 text-green-400"
            />
            Nutrition Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionInfo.calories && (
              <div className="flex justify-between">
                <span className="text-gray-400">Calories:</span>
                <span className="text-white font-medium">
                  {nutritionInfo.calories} kcal
                </span>
              </div>
            )}
            {nutritionInfo.protein && (
              <div className="flex justify-between">
                <span className="text-gray-400">Protein:</span>
                <span className="text-white font-medium">
                  {nutritionInfo.protein} g
                </span>
              </div>
            )}
            {nutritionInfo.carbs && (
              <div className="flex justify-between">
                <span className="text-gray-400">Carbs:</span>
                <span className="text-white font-medium">
                  {nutritionInfo.carbs} g
                </span>
              </div>
            )}
            {nutritionInfo.fats && (
              <div className="flex justify-between">
                <span className="text-gray-400">Fats:</span>
                <span className="text-white font-medium">
                  {nutritionInfo.fats} g
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
