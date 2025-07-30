import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function ClientNutritionTab({ client, onAssignNutritionPlan }) {
  const [assignedNutritionPlans, setAssignedNutritionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assigned nutrition plans
  const fetchAssignedNutritionPlans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/coaching-requests/${client.id}/assigned-nutrition-plans`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch assigned nutrition plans");
      }
      
      const data = await response.json();
      setAssignedNutritionPlans(data.data || []);
    } catch (err) {
      console.error("Error fetching assigned nutrition plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [client?.id]);

  useEffect(() => {
    if (client?.id) {
      fetchAssignedNutritionPlans();
    }
  }, [client?.id, fetchAssignedNutritionPlans]);

  const activePlan = assignedNutritionPlans.find(plan => plan.isActive);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Nutrition Plans</h2>
        <Button
          variant="success"
          leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
          onClick={() => onAssignNutritionPlan && onAssignNutritionPlan("nutrition")}
        >
          {activePlan ? "Replace Plan" : "Assign Meal Plan"}
        </Button>
      </div>

      {loading ? (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent mx-auto mb-4" />
            <p className="text-zinc-400">Loading nutrition plans...</p>
          </div>
        </Card>
      ) : error ? (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-red-400 text-lg mb-2">Error Loading Plans</p>
            <p className="text-zinc-500 text-sm mb-6">{error}</p>
            <Button
              variant="secondary"
              onClick={fetchAssignedNutritionPlans}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            >
              Retry
            </Button>
          </div>
        </Card>
      ) : assignedNutritionPlans.length > 0 ? (
        <div className="space-y-4">
          {/* Active Plan */}
          {activePlan && (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-400"
                  width={24}
                  height={24}
                />
                <h3 className="text-xl font-semibold text-white">Active Plan</h3>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-900/20 rounded-lg border border-green-700/30">
                <div className="flex items-center gap-4">
                  {activePlan.nutritionPlan.coverImage && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                      <Image
                        src={activePlan.nutritionPlan.coverImage}
                        alt={activePlan.nutritionPlan.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {activePlan.nutritionPlan.title}
                    </h4>
                    <p className="text-zinc-400 text-sm mb-1">
                      {activePlan.nutritionPlan.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span>
                        Started: {new Date(activePlan.startDate).toLocaleDateString()}
                      </span>
                      <span>
                        Duration: {activePlan.nutritionPlan.duration} {activePlan.nutritionPlan.durationType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-green-400 font-medium mb-1">Active</div>
                  {activePlan.nutritionPlan.nutritionInfo && (
                    <div className="text-xs text-zinc-500 space-y-1">
                      <div>{activePlan.nutritionPlan.nutritionInfo.calories || 0} cal/day</div>
                      <div>{activePlan.nutritionPlan.nutritionInfo.protein || 0}g protein</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Plan History */}
          {assignedNutritionPlans.length > 1 && (
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="mdi:history"
                  className="text-[#3E92CC]"
                  width={24}
                  height={24}
                />
                <h3 className="text-xl font-semibold text-white">Plan History</h3>
              </div>
              
              <div className="space-y-3">
                {assignedNutritionPlans
                  .filter(plan => !plan.isActive)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="mdi:food-apple"
                          className="text-zinc-400"
                          width={20}
                          height={20}
                        />
                        <div>
                          <p className="text-white font-medium">
                            {plan.nutritionPlan.title}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            Assigned: {new Date(plan.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-500 text-sm font-medium">
                          Completed
                        </div>
                        <div className="text-xs text-zinc-600">
                          {plan.nutritionPlan.duration} {plan.nutritionPlan.durationType}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card variant="dark" className="overflow-visible">
          <div className="text-center py-12">
            <Icon
              icon="mdi:food-apple"
              className="text-zinc-600 mx-auto mb-4"
              width={48}
              height={48}
            />
            <p className="text-zinc-400 text-lg mb-2">
              No Nutrition Plans Assigned
            </p>
            <p className="text-zinc-500 text-sm mb-6">
              Create and assign a nutrition plan to help this client reach their goals.
            </p>
            <Button
              variant="success"
              leftIcon={<Icon icon="mdi:food-apple" width={20} height={20} />}
              onClick={() => onAssignNutritionPlan && onAssignNutritionPlan("nutrition")}
            >
              Assign First Meal Plan
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
