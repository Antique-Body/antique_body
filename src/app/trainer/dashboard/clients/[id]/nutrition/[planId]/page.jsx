"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import ContextualSaveBar from "@/components/common/ContextualSaveBar";
import { Modal } from "@/components/common/Modal";
import { MealLibrarySelector } from "@/components/custom/dashboard/trainer/pages/meals/components/MealLibrarySelector";
import { MealModal } from "@/components/custom/dashboard/trainer/pages/meals/components/MealModal";

export default function NutritionTrackingPage({ params }) {
  const [client, setClient] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [trackingData, setTrackingData] = useState({});
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [supplementationRecommendations, setSupplementationRecommendations] =
    useState("");
  const [savingSupplementation, setSavingSupplementation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMealForReplacement, setSelectedMealForReplacement] =
    useState(null);
  // Add states for meal library and meal modal
  const [showMealLibraryModal, setShowMealLibraryModal] = useState(false);
  const [showMealCreateModal, setShowMealCreateModal] = useState(false);
  const [selectedMealForAddition, setSelectedMealForAddition] = useState(null);
  const [newMealData, setNewMealData] = useState({
    name: "",
    time: "",
    notes: "",
  });

  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const clientId = unwrappedParams.id;
  const planId = unwrappedParams.planId;

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

      // Fetch tracking data
      await fetchTrackingData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId, planId]);

  // Fetch tracking data for the selected date
  const fetchTrackingData = async (date = selectedDate) => {
    try {
      const response = await fetch(
        `/api/coaching-requests/${clientId}/nutrition-tracking/${planId}?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        setTrackingData(data.data || {});
        // Load notes and supplementation data
        const todayData = data.data?.[date];
        if (todayData) {
          setNotes(todayData.notes || "");
          setSupplementationRecommendations(todayData.supplementation || "");
        }
      }
    } catch {
      // Handle error silently
    }
  };

  // Save trainer notes
  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      const response = await fetch(
        `/api/coaching-requests/${clientId}/nutrition-tracking/${planId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save notes");
      }
      setHasUnsavedChanges(false);
    } catch {
      // Handle error silently
    } finally {
      setSavingNotes(false);
    }
  };

  // Save supplementation recommendations
  const handleSaveSupplementation = async () => {
    try {
      setSavingSupplementation(true);
      const response = await fetch(
        `/api/coaching-requests/${clientId}/nutrition-tracking/${planId}/supplementation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            supplementation: supplementationRecommendations,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save supplementation");
      }
      setHasUnsavedChanges(false);
    } catch {
      // Handle error silently
    } finally {
      setSavingSupplementation(false);
    }
  };

  // Handle meal replacement
  const handleReplaceMeal = (mealData) => {
    setSelectedMealForReplacement(mealData);
    setShowMealSelector(true);
  };

  // Handle meal selection from library
  const handleMealSelection = (selectedMeal) => {
    if (selectedMealForReplacement) {
      // Update the meal in the nutrition plan
      const updatedPlan = { ...nutritionPlan };
      const { mealIndex, optionIndex } = selectedMealForReplacement;

      if (
        updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]?.options?.[
          optionIndex
        ]
      ) {
        updatedPlan.planData.days[activeDay].meals[mealIndex].options[
          optionIndex
        ] = {
          ...updatedPlan.planData.days[activeDay].meals[mealIndex].options[
            optionIndex
          ],
          ...selectedMeal,
          // Keep the original meal key for tracking
          originalMealKey: `${mealIndex}-${optionIndex}`,
        };

        setNutritionPlan(updatedPlan);
        setHasUnsavedChanges(true);
      }
    } else if (selectedMealForAddition) {
      // Add new meal to the nutrition plan
      const updatedPlan = { ...nutritionPlan };
      const { mealIndex } = selectedMealForAddition;

      if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
        const newMeal = {
          ...selectedMeal,
          name: newMealData.name || selectedMeal.name,
          time: newMealData.time,
          notes: newMealData.notes,
          mealType: newMealData.mealType,
        };

        updatedPlan.planData.days[activeDay].meals[mealIndex].options.push(
          newMeal
        );
        setNutritionPlan(updatedPlan);
        setHasUnsavedChanges(true);

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
    }
    setShowMealSelector(false);
    setShowMealLibraryModal(false);
    setSelectedMealForReplacement(null);
    setSelectedMealForAddition(null);
    setNewMealData({
      name: "",
      time: "08:00",
      notes: "",
      mealType: "breakfast",
    });
  };

  // Handle adding new meal
  const handleAddMeal = (newMeal) => {
    const updatedPlan = { ...nutritionPlan };
    if (updatedPlan.planData?.days?.[activeDay]?.meals) {
      updatedPlan.planData.days[activeDay].meals.push(newMeal);
      setNutritionPlan(updatedPlan);
      setHasUnsavedChanges(true);
    }
    setShowAddMealModal(false);
  };

  // Sort meals by time - only when saved
  const sortMealsByTime = (meals) => {
    if (!hasUnsavedChanges) {
      return meals.sort((a, b) => {
        const timeA = a.time || "00:00";
        const timeB = b.time || "00:00";
        return timeA.localeCompare(timeB);
      });
    }
    return meals; // Don't sort if there are unsaved changes
  };

  // Handle meal library selection for addition
  const handleMealLibrarySelection = (selectedMeal) => {
    if (selectedMealForAddition) {
      const { mealIndex } = selectedMealForAddition;
      const updatedPlan = { ...nutritionPlan };

      if (updatedPlan.planData?.days?.[activeDay]?.meals?.[mealIndex]) {
        // Add the selected meal directly to the existing meal
        updatedPlan.planData.days[activeDay].meals[mealIndex].options.push(
          selectedMeal
        );
        setNutritionPlan(updatedPlan);
        setHasUnsavedChanges(true);
      }

      setShowMealLibraryModal(false);
      setSelectedMealForAddition(null);
    }
  };

  // Handle meal creation from modal
  const handleMealCreation = (createdMeal) => {
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

      setNutritionPlan(updatedPlan);
      setHasUnsavedChanges(true);

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
  };

  // Save nutrition plan changes
  const handleSaveNutritionPlan = async () => {
    try {
      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plan/${planId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planData: nutritionPlan.planData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save nutrition plan");
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to save nutrition plan:", err);
    }
  };

  // Handle notes change
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    setHasUnsavedChanges(true);
  };

  // Handle supplementation change
  const handleSupplementationChange = (e) => {
    setSupplementationRecommendations(e.target.value);
    setHasUnsavedChanges(true);
  };

  // Save all changes
  const handleSaveAll = async () => {
    await Promise.all([
      handleSaveNotes(),
      handleSaveSupplementation(),
      handleSaveNutritionPlan(),
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchTrackingData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading nutrition tracking...</p>
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
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load nutrition tracking
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
            <Button
              variant="primary"
              onClick={fetchData}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            >
              Try Again
            </Button>
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
            <Icon
              icon="mdi:food-off"
              className="text-zinc-600"
              width={48}
              height={48}
            />
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
  const currentDay = planData?.days?.[activeDay];
  const todayTracking = trackingData[selectedDate] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Contextual Save Bar - At the very top */}
      {hasUnsavedChanges && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <ContextualSaveBar
            visible={hasUnsavedChanges}
            onSave={handleSaveAll}
            onDiscard={() => setHasUnsavedChanges(false)}
            isSaving={savingNotes || savingSupplementation}
            message="You have unsaved changes to the nutrition plan"
          />
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href={`/trainer/dashboard/clients/${clientId}`}>
              <Button
                variant="ghost"
                size="small"
                className="text-zinc-400 hover:text-white"
              >
                <Icon icon="mdi:arrow-left" width={20} height={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Icon
                  icon="mdi:food-apple"
                  className="text-white"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {planData?.title || "Nutrition Plan"}
                </h1>
                <p className="text-zinc-400">
                  {client.client?.clientProfile?.firstName}{" "}
                  {client.client?.clientProfile?.lastName} • Nutrition Tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Date Selector */}
            <Card
              variant="dark"
              className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="mdi:calendar"
                    className="text-[#3E92CC]"
                    width={24}
                    height={24}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Daily Tracking
                  </h3>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-4 py-2 bg-zinc-700/50 border border-zinc-600 rounded-xl text-white focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 transition-all"
                />
              </div>
            </Card>

            {/* Daily Macros Overview */}
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
                <h3 className="text-xl font-semibold text-white">
                  Daily Macros Target
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl border border-orange-500/20">
                  <div className="text-3xl font-bold text-orange-400 mb-2">
                    {planData?.nutritionInfo?.calories || 0}
                  </div>
                  <div className="text-zinc-400 text-sm font-medium">
                    Calories
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/20">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {planData?.nutritionInfo?.protein || 0}g
                  </div>
                  <div className="text-zinc-400 text-sm font-medium">
                    Protein
                  </div>
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

            {/* Day Selector */}
            {planData?.days && planData.days.length > 0 && (
              <Card
                variant="dark"
                className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon
                    icon="mdi:calendar-week"
                    className="text-[#3E92CC]"
                    width={28}
                    height={28}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Plan Days
                  </h3>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {planData.days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDay(index)}
                      className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-200 font-medium ${
                        activeDay === index
                          ? "bg-gradient-to-r from-[#3E92CC] to-[#2E7DCC] text-white shadow-lg"
                          : "bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/70"
                      }`}
                    >
                      {day.name || `Day ${index + 1}`}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Meals for Selected Day */}
            {currentDay && (
              <Card
                variant="dark"
                className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:silverware-fork-knife"
                      className="text-[#3E92CC]"
                      width={28}
                      height={28}
                    />
                    <h3 className="text-xl font-semibold text-white">
                      {currentDay.name || `Day ${activeDay + 1}`} Meals
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {currentDay.isRestDay && (
                      <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-medium">
                        Rest Day
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add meals..."
                        className="px-4 py-2 bg-zinc-700/30 border border-zinc-600/50 rounded-lg text-white focus:border-[#3E92CC] focus:outline-none placeholder-zinc-400"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const updatedPlan = { ...nutritionPlan };
                            if (
                              updatedPlan.planData?.days?.[activeDay]?.meals
                            ) {
                              const newMeal = {
                                name: e.target.value || "New Meal",
                                time: "",
                                notes: "",
                                options: [],
                              };
                              updatedPlan.planData.days[activeDay].meals.push(
                                newMeal
                              );
                              setNutritionPlan(updatedPlan);
                              setHasUnsavedChanges(true);

                              // Scroll to the newly added meal
                              setTimeout(() => {
                                const mealElements =
                                  document.querySelectorAll(
                                    "[data-meal-index]"
                                  );
                                const lastMealElement =
                                  mealElements[mealElements.length - 1];
                                if (lastMealElement) {
                                  lastMealElement.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                }
                              }, 100);

                              e.target.value = "";
                            }
                          }
                        }}
                      />
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => {
                          const updatedPlan = { ...nutritionPlan };
                          if (updatedPlan.planData?.days?.[activeDay]?.meals) {
                            const newMeal = {
                              name: "New Meal",
                              time: "",
                              notes: "",
                              options: [],
                            };
                            updatedPlan.planData.days[activeDay].meals.push(
                              newMeal
                            );
                            setNutritionPlan(updatedPlan);
                            setHasUnsavedChanges(true);

                            // Scroll to the newly added meal
                            setTimeout(() => {
                              const mealElements =
                                document.querySelectorAll("[data-meal-index]");
                              const lastMealElement =
                                mealElements[mealElements.length - 1];
                              if (lastMealElement) {
                                lastMealElement.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }
                            }, 100);
                          }
                        }}
                        leftIcon={
                          <Icon icon="mdi:plus" width={16} height={16} />
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {currentDay.isRestDay ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon
                        icon="mdi:sleep"
                        className="text-zinc-600"
                        width={32}
                        height={32}
                      />
                    </div>
                    <p className="text-zinc-400 text-lg font-medium mb-2">
                      Rest Day
                    </p>
                    <p className="text-zinc-500 text-sm max-w-md mx-auto">
                      {currentDay.description}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortMealsByTime(currentDay.meals || []).length > 0 ? (
                      sortMealsByTime(currentDay.meals || []).map(
                        (meal, mealIndex) => (
                          <div
                            key={mealIndex}
                            data-meal-index={mealIndex}
                            className="border border-zinc-700/50 rounded-2xl p-6 bg-zinc-800/30 backdrop-blur-sm"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#3E92CC]/20 rounded-xl flex items-center justify-center">
                                  <Icon
                                    icon="mdi:clock"
                                    className="text-[#3E92CC]"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={meal.name || ""}
                                    onChange={(e) => {
                                      const updatedPlan = { ...nutritionPlan };
                                      if (
                                        updatedPlan.planData?.days?.[activeDay]
                                          ?.meals?.[mealIndex]
                                      ) {
                                        updatedPlan.planData.days[
                                          activeDay
                                        ].meals[mealIndex].name =
                                          e.target.value;
                                        setNutritionPlan(updatedPlan);
                                        setHasUnsavedChanges(true);
                                      }
                                    }}
                                    className="w-full bg-transparent border-none text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1"
                                    placeholder="Meal name..."
                                  />
                                  <div className="flex items-center gap-2 mt-1">
                                    <input
                                      type="text"
                                      value={meal.time || ""}
                                      onChange={(e) => {
                                        const updatedPlan = {
                                          ...nutritionPlan,
                                        };
                                        if (
                                          updatedPlan.planData?.days?.[
                                            activeDay
                                          ]?.meals?.[mealIndex]
                                        ) {
                                          updatedPlan.planData.days[
                                            activeDay
                                          ].meals[mealIndex].time =
                                            e.target.value;
                                          setNutritionPlan(updatedPlan);
                                          setHasUnsavedChanges(true);
                                        }
                                      }}
                                      className="bg-transparent border-none text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1"
                                      placeholder="Time (e.g., 08:00)..."
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={meal.notes || ""}
                                    onChange={(e) => {
                                      const updatedPlan = { ...nutritionPlan };
                                      if (
                                        updatedPlan.planData?.days?.[activeDay]
                                          ?.meals?.[mealIndex]
                                      ) {
                                        updatedPlan.planData.days[
                                          activeDay
                                        ].meals[mealIndex].notes =
                                          e.target.value;
                                        setNutritionPlan(updatedPlan);
                                        setHasUnsavedChanges(true);
                                      }
                                    }}
                                    className="w-full bg-transparent border-none text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1 mt-1"
                                    placeholder="Notes..."
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="secondary"
                                  size="small"
                                  onClick={() => {
                                    setSelectedMealForAddition({ mealIndex });
                                    setShowMealLibraryModal(true);
                                  }}
                                  leftIcon={
                                    <Icon
                                      icon="mdi:library"
                                      width={16}
                                      height={16}
                                    />
                                  }
                                >
                                  Add from Library
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="small"
                                  onClick={() => {
                                    setSelectedMealForAddition({ mealIndex });
                                    setShowMealCreateModal(true);
                                  }}
                                  leftIcon={
                                    <Icon
                                      icon="mdi:plus"
                                      width={16}
                                      height={16}
                                    />
                                  }
                                >
                                  Create New Meal
                                </Button>
                              </div>
                            </div>

                            {meal.options && meal.options.length > 0 ? (
                              <div className="space-y-4">
                                {meal.options.map((option, optionIndex) => {
                                  const mealKey = `${mealIndex}-${optionIndex}`;
                                  const mealStatus =
                                    todayTracking.meals?.[mealKey]?.status;
                                  const isCompleted =
                                    mealStatus === "completed";

                                  return (
                                    <div
                                      key={optionIndex}
                                      className={`p-6 rounded-xl border transition-all duration-200 ${
                                        isCompleted
                                          ? "bg-green-500/10 border-green-500/30"
                                          : "bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600"
                                      }`}
                                    >
                                      <div className="flex items-start gap-4">
                                        {option.imageUrl && (
                                          <div className="flex-shrink-0">
                                            <img
                                              src={option.imageUrl}
                                              alt={option.name}
                                              className="w-24 h-24 object-cover rounded-xl"
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                              <input
                                                type="text"
                                                value={option.name || ""}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].name = e.target.value;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="bg-transparent border-none text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded px-2 py-1"
                                                placeholder="Meal name..."
                                              />
                                              {isCompleted && (
                                                <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full">
                                                  <Icon
                                                    icon="mdi:check-circle"
                                                    className="text-green-400"
                                                    width={16}
                                                    height={16}
                                                  />
                                                  <span className="text-green-400 text-xs font-medium">
                                                    Completed
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => {
                                                  setSelectedMeal({
                                                    meal,
                                                    option,
                                                    mealIndex,
                                                    optionIndex,
                                                  });
                                                  setShowMealModal(true);
                                                }}
                                                className="text-zinc-400 hover:text-white"
                                              >
                                                <Icon
                                                  icon="mdi:eye"
                                                  width={16}
                                                  height={16}
                                                />
                                              </Button>
                                              <Button
                                                variant="warning"
                                                size="small"
                                                onClick={() =>
                                                  handleReplaceMeal({
                                                    meal,
                                                    option,
                                                    mealIndex,
                                                    optionIndex,
                                                  })
                                                }
                                                className="text-zinc-400 hover:text-white"
                                              >
                                                <Icon
                                                  icon="mdi:swap-horizontal"
                                                  width={16}
                                                  height={16}
                                                />
                                              </Button>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-4 gap-4 mb-4">
                                            <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                              <input
                                                type="number"
                                                value={option.calories || ""}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].calories =
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-orange-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                                placeholder="0"
                                              />
                                              <div className="text-zinc-400 text-xs">
                                                cal
                                              </div>
                                            </div>
                                            <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                              <input
                                                type="number"
                                                value={option.protein || ""}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].protein =
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-blue-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                                placeholder="0"
                                              />
                                              <div className="text-zinc-400 text-xs">
                                                protein
                                              </div>
                                            </div>
                                            <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                              <input
                                                type="number"
                                                value={option.carbs || ""}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].carbs =
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-yellow-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                                placeholder="0"
                                              />
                                              <div className="text-zinc-400 text-xs">
                                                carbs
                                              </div>
                                            </div>
                                            <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                                              <input
                                                type="number"
                                                value={option.fat || ""}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].fat =
                                                      parseInt(
                                                        e.target.value
                                                      ) || 0;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-green-400 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded"
                                                placeholder="0"
                                              />
                                              <div className="text-zinc-400 text-xs">
                                                fat
                                              </div>
                                            </div>
                                          </div>

                                          <textarea
                                            value={option.description || ""}
                                            onChange={(e) => {
                                              const updatedPlan = {
                                                ...nutritionPlan,
                                              };
                                              if (
                                                updatedPlan.planData?.days?.[
                                                  activeDay
                                                ]?.meals?.[mealIndex]
                                                  ?.options?.[optionIndex]
                                              ) {
                                                updatedPlan.planData.days[
                                                  activeDay
                                                ].meals[mealIndex].options[
                                                  optionIndex
                                                ].description = e.target.value;
                                                setNutritionPlan(updatedPlan);
                                                setHasUnsavedChanges(true);
                                              }
                                            }}
                                            className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                                            placeholder="Description..."
                                            rows={3}
                                          />

                                          {option.recommendation && (
                                            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                              <div className="flex items-center gap-2 mb-2">
                                                <Icon
                                                  icon="mdi:lightbulb"
                                                  className="text-yellow-400"
                                                  width={16}
                                                  height={16}
                                                />
                                                <span className="text-yellow-400 text-sm font-medium">
                                                  Trainer Recommendation
                                                </span>
                                              </div>
                                              <textarea
                                                value={
                                                  option.recommendation || ""
                                                }
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].recommendation =
                                                      e.target.value;
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                                                placeholder="Add trainer recommendation..."
                                                rows={3}
                                              />
                                            </div>
                                          )}

                                          {option.ingredients &&
                                            Array.isArray(
                                              option.ingredients
                                            ) && (
                                              <textarea
                                                value={option.ingredients.join(
                                                  ", "
                                                )}
                                                onChange={(e) => {
                                                  const updatedPlan = {
                                                    ...nutritionPlan,
                                                  };
                                                  if (
                                                    updatedPlan.planData
                                                      ?.days?.[activeDay]
                                                      ?.meals?.[mealIndex]
                                                      ?.options?.[optionIndex]
                                                  ) {
                                                    updatedPlan.planData.days[
                                                      activeDay
                                                    ].meals[mealIndex].options[
                                                      optionIndex
                                                    ].ingredients =
                                                      e.target.value
                                                        .split(",")
                                                        .map((item) =>
                                                          item.trim()
                                                        )
                                                        .filter((item) => item);
                                                    setNutritionPlan(
                                                      updatedPlan
                                                    );
                                                    setHasUnsavedChanges(true);
                                                  }
                                                }}
                                                className="w-full bg-transparent border-none text-zinc-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 rounded resize-none"
                                                placeholder="Ingredients (comma-separated)"
                                                rows={2}
                                              />
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-8 border-2 border-dashed border-zinc-600/50 rounded-xl bg-zinc-800/20">
                                <Icon
                                  icon="mdi:food-off"
                                  className="text-zinc-500 mx-auto mb-3"
                                  width={32}
                                  height={32}
                                />
                                <p className="text-zinc-400 text-sm mb-3">
                                  No meal options added yet
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => {
                                      setSelectedMealForAddition({ mealIndex });
                                      setShowMealLibraryModal(true);
                                    }}
                                    leftIcon={
                                      <Icon
                                        icon="mdi:library"
                                        width={16}
                                        height={16}
                                      />
                                    }
                                  >
                                    Add from Library
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => {
                                      setSelectedMealForAddition({ mealIndex });
                                      setShowMealCreateModal(true);
                                    }}
                                    leftIcon={
                                      <Icon
                                        icon="mdi:plus"
                                        width={16}
                                        height={16}
                                      />
                                    }
                                  >
                                    Create New Meal
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-zinc-600/50 rounded-xl bg-zinc-800/20">
                        <Icon
                          icon="mdi:food-off"
                          className="text-zinc-500 mx-auto mb-4"
                          width={48}
                          height={48}
                        />
                        <h4 className="text-zinc-300 text-lg font-medium mb-2">
                          No meals added yet
                        </h4>
                        <p className="text-zinc-400 text-sm mb-4">
                          Start by adding meals using the field above
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setShowMealLibraryModal(true)}
                            leftIcon={
                              <Icon icon="mdi:library" width={16} height={16} />
                            }
                          >
                            Add from Library
                          </Button>
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => setShowMealCreateModal(true)}
                            leftIcon={
                              <Icon icon="mdi:plus" width={16} height={16} />
                            }
                          >
                            Create New Meal
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card
              variant="dark"
              className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon
                  icon="mdi:chart-line"
                  className="text-[#3E92CC]"
                  width={28}
                  height={28}
                />
                <h3 className="text-xl font-semibold text-white">
                  Progress Summary
                </h3>
              </div>
              <div className="space-y-4">
                {(() => {
                  const todayMeals = todayTracking.meals || {};
                  const completedCount = Object.values(todayMeals).filter(
                    (meal) => meal.status === "completed"
                  ).length;
                  const totalMeals =
                    currentDay?.meals?.reduce(
                      (acc, meal) => acc + (meal.options?.length || 0),
                      0
                    ) || 0;

                  return (
                    <>
                      <div className="p-4 bg-zinc-700/30 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-zinc-400 text-sm">
                            Completed Today
                          </span>
                          <span className="text-green-400 font-semibold">
                            {completedCount}/{totalMeals}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${totalMeals > 0 ? (completedCount / totalMeals) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-700/30 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 text-sm">
                            Plan Duration
                          </span>
                          <span className="text-white font-semibold">
                            {planData?.duration} {planData?.durationType}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>

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
                <h3 className="text-xl font-semibold text-white">
                  Daily Notes
                </h3>
              </div>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Add notes about client's progress, observations, or recommendations..."
                className="w-full h-40 px-4 py-3 bg-zinc-700/30 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 resize-none transition-all"
              />
            </Card>

            {/* Dietary Preferences */}
            <Card
              variant="dark"
              className="overflow-visible border-0 bg-zinc-800/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon
                  icon="mdi:food-variant"
                  className="text-[#3E92CC]"
                  width={28}
                  height={28}
                />
                <h3 className="text-xl font-semibold text-white">
                  Dietary Preferences
                </h3>
              </div>
              <div className="space-y-3">
                {(() => {
                  const clientProfile = client?.client?.clientProfile;
                  const dietaryPreferences = clientProfile?.dietaryPreferences || [];
                  
                  if (dietaryPreferences.length === 0) {
                    return (
                      <div className="text-center py-6 bg-zinc-700/20 rounded-xl border-2 border-dashed border-zinc-600/50">
                        <Icon icon="mdi:silverware" className="text-zinc-500 mx-auto mb-2" width={24} height={24} />
                        <p className="text-zinc-400 text-sm">No dietary preferences specified</p>
                      </div>
                    );
                  }
                  
                  return dietaryPreferences.map((preference, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg">
                      <div className="w-2 h-2 bg-[#3E92CC] rounded-full flex-shrink-0" />
                      <span className="text-white text-sm font-medium">
                        {preference.charAt(0).toUpperCase() + preference.slice(1).replace(/([A-Z])/g, ' $1')}
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
                <h3 className="text-xl font-semibold text-white">
                  Supplementation
                </h3>
              </div>
              <textarea
                value={supplementationRecommendations}
                onChange={handleSupplementationChange}
                placeholder="Add recommended supplements, dosages, and timing..."
                className="w-full h-40 px-4 py-3 bg-zinc-700/30 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-500 focus:border-[#3E92CC] focus:outline-none focus:ring-2 focus:ring-[#3E92CC]/20 resize-none transition-all"
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Meal Library Selector */}
      {showMealSelector && (
        <Modal
          isOpen={showMealSelector}
          onClose={() => {
            setShowMealSelector(false);
            setSelectedMealForReplacement(null);
          }}
          title="Replace Meal"
          hideButtons={true}
        >
          <MealLibrarySelector
            useStaticData={true}
            onSelectMeal={handleMealSelection}
            onClose={() => {
              setShowMealSelector(false);
              setSelectedMealForReplacement(null);
            }}
          />
        </Modal>
      )}

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
            onSelectMeal={handleMealLibrarySelection}
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
          onSave={handleMealCreation}
        />
      )}

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <Modal
          isOpen={showAddMealModal}
          onClose={() => setShowAddMealModal(false)}
          title="Add New Meal"
          hideButtons={true}
        >
          <MealLibrarySelector
            useStaticData={true}
            onSelectMeal={handleAddMeal}
            onClose={() => setShowAddMealModal(false)}
          />
        </Modal>
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
                <img
                  src={selectedMeal.option.imageUrl}
                  alt={selectedMeal.option.name}
                  className="w-full h-full object-cover"
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
                    setNutritionPlan(updatedPlan);
                    setHasUnsavedChanges(true);
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
                        setNutritionPlan(updatedPlan);
                        setHasUnsavedChanges(true);
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
                        setNutritionPlan(updatedPlan);
                        setHasUnsavedChanges(true);
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
