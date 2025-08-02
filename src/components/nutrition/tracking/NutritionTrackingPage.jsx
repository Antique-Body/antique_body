"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";

import { ContextualSaveBar, Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { MealLibrarySelector } from "@/components/custom/dashboard/trainer/pages/meals/components/MealLibrarySelector";
import { MealModal } from "@/components/custom/dashboard/trainer/pages/meals/components/MealModal";

import { ClientProgressSection } from "./ClientProgressSection";
import { DailyMacrosOverview } from "./DailyMacrosOverview";
import { DaySelector } from "./DaySelector";
import { MealPlanningSection } from "./MealPlanningSection";
import { NutritionPlanHeader } from "./NutritionPlanHeader";
import { NutritionSidebar } from "./NutritionSidebar";

export default function NutritionTrackingPage({ clientId, planId }) {
  // State
  const [client, setClient] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [supplementationRecommendations, setSupplementationRecommendations] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingSupplementation, setSavingSupplementation] = useState(false);

  // Modal states
  const [showMealLibraryModal, setShowMealLibraryModal] = useState(false);
  const [showMealCreateModal, setShowMealCreateModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealForAddition, setSelectedMealForAddition] = useState(null);
  const [, setSelectedMealForReplacement] = useState(null);
  const [newMealData, setNewMealData] = useState({
    name: "",
    time: "",
    notes: "",
  });

  // Client progress state
  const [clientProgress, setClientProgress] = useState(null);
  const [loadingClientProgress, setLoadingClientProgress] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch client progress
  const fetchClientProgress = useCallback(async () => {
    try {
      setLoadingClientProgress(true);
      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plan/${planId}/client-progress?date=${selectedDate}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setClientProgress({
            hasActiveTracking: false,
            message: "Client progress tracking not yet available for this plan.",
            completionRate: 0,
            completedMeals: 0,
            totalMeals: 0,
            totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            meals: [],
            snacks: []
          });
          return;
        }
        throw new Error("Failed to fetch client progress");
      }

      const data = await response.json();
      if (data.success) {
        setClientProgress(data.data);
      } else {
        setClientProgress({
          hasActiveTracking: false,
          message: "Unable to load client progress data.",
          completionRate: 0,
          completedMeals: 0,
          totalMeals: 0,
          totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
          meals: [],
          snacks: []
        });
      }
    } catch (err) {
      console.error("Error fetching client progress:", err);
      setClientProgress({
        hasActiveTracking: false,
        message: "Client progress tracking is currently unavailable.",
        completionRate: 0,
        completedMeals: 0,
        totalMeals: 0,
        totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        meals: [],
        snacks: []
      });
    } finally {
      setLoadingClientProgress(false);
    }
  }, [clientId, planId, selectedDate]);

  // Fetch client and nutrition plan data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch client data
      const clientResponse = await fetch(`/api/coaching-requests/${clientId}`);
      if (!clientResponse.ok) {
        throw new Error("Failed to fetch client data");
      }
      const clientData = await clientResponse.json();

      if (!clientData.success) {
        throw new Error(clientData.error || "Failed to fetch client data");
      }

      setClient(clientData.data);

      // Fetch nutrition plan data
      const planResponse = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plan/${planId}`
      );
      if (!planResponse.ok) {
        throw new Error("Failed to fetch nutrition plan");
      }
      const planData = await planResponse.json();

      if (!planData.success) {
        throw new Error(planData.error || "Failed to fetch nutrition plan");
      }

      setNutritionPlan(planData.data);
      
      // Set notes and supplementation from the response
      if (planData.data.trainerNotes) {
        setNotes(planData.data.trainerNotes);
      }
      if (planData.data.supplementationRecommendations) {
        setSupplementationRecommendations(planData.data.supplementationRecommendations);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId, planId]);

  // Save nutrition plan changes including notes and supplementation
  const handleSaveNutritionPlan = useCallback(async () => {
    try {
      setSavingNotes(true);
      setSavingSupplementation(true);
      
      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plan/${planId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planData: nutritionPlan.planData,
            notes: notes,
            supplementation: supplementationRecommendations,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save nutrition plan");
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to save nutrition plan:", err);
    } finally {
      setSavingNotes(false);
      setSavingSupplementation(false);
    }
  }, [clientId, planId, nutritionPlan, notes, supplementationRecommendations]);

  // Save all changes
  const handleSaveAll = useCallback(async () => {
    await handleSaveNutritionPlan();
  }, [handleSaveNutritionPlan]);

  // Handle notes change
  const handleNotesChange = useCallback((e) => {
    setNotes(e.target.value);
    setHasUnsavedChanges(true);
  }, []);

  // Handle supplementation change
  const handleSupplementationChange = useCallback((e) => {
    setSupplementationRecommendations(e.target.value);
    setHasUnsavedChanges(true);
  }, []);

  // Nutrition plan update handlers
  const updateNutritionPlan = useCallback((updatedPlan) => {
    setNutritionPlan(updatedPlan);
    setHasUnsavedChanges(true);
  }, []);

  const handleDiscardChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchClientProgress();
  }, [fetchClientProgress]);

  // Auto-refresh client progress every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchClientProgress();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchClientProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading nutrition plan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load nutrition plan
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client || !nutritionPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <p className="mt-4 text-lg font-medium text-white">
              Nutrition plan not found
            </p>
            <p className="mt-2 text-zinc-400">
              This nutrition plan may have been removed or doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const planData = nutritionPlan.planData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Contextual Save Bar */}
      {hasUnsavedChanges && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ContextualSaveBar
            visible={hasUnsavedChanges}
            onSave={handleSaveAll}
            onDiscard={handleDiscardChanges}
            isSaving={savingNotes || savingSupplementation}
            message="You have unsaved changes to the nutrition plan"
          />
        </div>
      )}

      {/* Header */}
      <NutritionPlanHeader 
        planData={planData}
        client={client}
        clientId={clientId}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Date Selector */}
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">Date Selection</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => {
                        fetchClientProgress();
                        fetchData();
                      }}
                      className="text-zinc-400 hover:text-white"
                      leftIcon={<Icon icon="mdi:refresh" width={16} height={16} />}
                    >
                      Refresh
                    </Button>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        autoRefresh
                          ? "bg-green-500/10 border border-green-500/30 text-green-400"
                          : "bg-zinc-700/50 border border-zinc-600/50 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-green-400 animate-pulse" : "bg-zinc-600"}`} />
                      <span>{autoRefresh ? "Live" : "Manual"}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-xl text-white focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 transition-all"
                />
              </div>
            </div>

            {/* Client Progress Section */}
            <ClientProgressSection 
              clientProgress={clientProgress}
              loadingClientProgress={loadingClientProgress}
              planData={planData}
            />

            {/* Daily Macros Overview */}
            <DailyMacrosOverview planData={planData} />

            {/* Day Selector */}
            {planData?.days && planData.days.length > 0 && (
              <DaySelector 
                days={planData.days}
                activeDay={activeDay}
                onDayChange={setActiveDay}
              />
            )}

            {/* Meal Planning Section */}
            <MealPlanningSection
              planData={planData}
              nutritionPlan={nutritionPlan}
              activeDay={activeDay}
              onPlanUpdate={updateNutritionPlan}
              onShowMealLibrary={() => setShowMealLibraryModal(true)}
              onShowMealCreate={() => setShowMealCreateModal(true)}
              onMealSelect={setSelectedMeal}
              onShowMealModal={() => setShowMealModal(true)}
              setSelectedMealForAddition={setSelectedMealForAddition}
              setSelectedMealForReplacement={setSelectedMealForReplacement}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          {/* Sidebar */}
          <NutritionSidebar
            planData={planData}
            client={client}
            notes={notes}
            supplementationRecommendations={supplementationRecommendations}
            onNotesChange={handleNotesChange}
            onSupplementationChange={handleSupplementationChange}
          />
        </div>
      </div>

      {/* Meal Library Modal for Addition */}
      {showMealLibraryModal && (
        <Modal
          isOpen={showMealLibraryModal}
          onClose={() => setShowMealLibraryModal(false)}
          title="Select Meal from Library"
          hideButtons={true}
        >
          <MealLibrarySelector
            useStaticData={true}
            onSelectMeal={(selectedMeal) => {
              if (selectedMealForAddition) {
                const { mealIndex } = selectedMealForAddition;
                const updatedPlan = { ...nutritionPlan };

                if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
                  // Add the selected meal directly to the existing meal
                  updatedPlan.planData.days[activeDay].meals[mealIndex].options.push(
                    selectedMeal
                  );
                  updateNutritionPlan(updatedPlan);
                }

                setShowMealLibraryModal(false);
                setSelectedMealForAddition(null);
              }
            }}
            onClose={() => setShowMealLibraryModal(false)}
          />
        </Modal>
      )}

      {/* Meal Creation Modal */}
      {showMealCreateModal && (
        <MealModal
          isOpen={showMealCreateModal}
          onClose={() => setShowMealCreateModal(false)}
          mode="create"
          onSave={(createdMeal) => {
            const updatedPlan = { ...nutritionPlan };
            if (
              updatedPlan.planData?.days?.[activeDay]?.meals &&
              selectedMealForAddition
            ) {
              const { mealIndex } = selectedMealForAddition;
              const newMeal = {
                name: newMealData.name || createdMeal.name,
                time: newMealData.time,
                notes: newMealData.notes,
                mealType: newMealData.mealType,
                options: [createdMeal],
              };

              if (mealIndex !== undefined) {
                // Add to existing meal
                updatedPlan.planData.days[activeDay].meals[mealIndex].options.push(
                  createdMeal
                );
              } else {
                // Add new meal
                updatedPlan.planData.days[activeDay].meals.push(newMeal);
              }

              updateNutritionPlan(updatedPlan);

              // Scroll to the newly added meal
              setTimeout(() => {
                const mealElements = document.querySelectorAll("[data-meal-index]");
                const targetIndex =
                  mealIndex !== undefined ? mealIndex : mealElements.length - 1;
                const targetElement = mealElements[targetIndex];
                if (targetElement) {
                  targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }, 100);
            }
            setShowMealCreateModal(false);
            setSelectedMealForAddition(null);
            setNewMealData({
              name: "",
              time: "08:00",
              notes: "",
              mealType: "breakfast",
            });
          }}
        />
      )}

      {/* Meal Detail Modal */}
      {showMealModal && selectedMeal && (
        <Modal
          isOpen={showMealModal}
          onClose={() => setShowMealModal(false)}
          title={selectedMeal.option.name}
          hideButtons={true}
        >
          <div className="space-y-6">
            {selectedMeal.option.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden">
                <Image
                  src={selectedMeal.option.imageUrl}
                  alt={selectedMeal.option.name}
                  className="w-full h-full object-cover"
                  width={384}
                  height={192}
                />
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-zinc-800 rounded-xl">
                <div className="text-2xl font-bold text-orange-400">
                  {selectedMeal.option.calories}
                </div>
                <div className="text-zinc-400 text-sm">Calories</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">
                  {selectedMeal.option.protein}g
                </div>
                <div className="text-zinc-400 text-sm">Protein</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedMeal.option.carbs}g
                </div>
                <div className="text-zinc-400 text-sm">Carbs</div>
              </div>
              <div className="text-center p-4 bg-zinc-800 rounded-xl">
                <div className="text-2xl font-bold text-green-400">
                  {selectedMeal.option.fat}g
                </div>
                <div className="text-zinc-400 text-sm">Fat</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Preparation</h4>
              <textarea
                value={selectedMeal.option.description || ""}
                onChange={(e) => {
                  const updatedPlan = {
                    ...nutritionPlan,
                  };
                  if (
                    updatedPlan.planData?.days?.[activeDay]?.meals?.[
                      selectedMeal.mealIndex
                    ]?.options?.[selectedMeal.optionIndex]
                  ) {
                    updatedPlan.planData.days[activeDay].meals[
                      selectedMeal.mealIndex
                    ].options[selectedMeal.optionIndex].description =
                      e.target.value;
                    updateNutritionPlan(updatedPlan);
                  }
                }}
                className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                placeholder="Description..."
                rows={3}
              />
            </div>

            {/* Show recommendation if it exists */}
            {selectedMeal.option.recommendation && (
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:lightbulb"
                    className="text-yellow-400"
                    width={16}
                    height={16}
                  />
                  Trainer Recommendation
                </h4>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <textarea
                    value={selectedMeal.option.recommendation}
                    onChange={(e) => {
                      const updatedPlan = {
                        ...nutritionPlan,
                      };
                      if (
                        updatedPlan.planData?.days?.[activeDay]?.meals?.[
                          selectedMeal.mealIndex
                        ]?.options?.[selectedMeal.optionIndex]
                      ) {
                        updatedPlan.planData.days[activeDay].meals[
                          selectedMeal.mealIndex
                        ].options[selectedMeal.optionIndex].recommendation =
                          e.target.value;
                        updateNutritionPlan(updatedPlan);
                      }
                    }}
                    className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                    placeholder="Add trainer recommendation..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {selectedMeal.option.ingredients &&
              Array.isArray(selectedMeal.option.ingredients) && (
                <div>
                  <h4 className="font-semibold text-white mb-3">Ingredients</h4>
                  <textarea
                    value={selectedMeal.option.ingredients.join(", ")}
                    onChange={(e) => {
                      const updatedPlan = {
                        ...nutritionPlan,
                      };
                      if (
                        updatedPlan.planData?.days?.[activeDay]?.meals?.[
                          selectedMeal.mealIndex
                        ]?.options?.[selectedMeal.optionIndex]
                      ) {
                        updatedPlan.planData.days[activeDay].meals[
                          selectedMeal.mealIndex
                        ].options[selectedMeal.optionIndex].ingredients =
                          e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter((item) => item);
                        updateNutritionPlan(updatedPlan);
                      }
                    }}
                    className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                    placeholder="Ingredients (comma-separated)"
                    rows={3}
                  />
                </div>
              )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowMealModal(false)}
                fullWidth
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}