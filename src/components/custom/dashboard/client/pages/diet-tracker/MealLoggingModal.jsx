"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { AIFoodScannerTab } from "./AIFoodScannerTab";
import { CreateFoodTab } from "./CreateFoodTab";
import { FoodHistoryTab } from "./FoodHistoryTab";

export const MealLoggingModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  mealName,
  mealTime,
  selectedDate,
  existingMeals = [] // For showing what's already logged
}) => {
  const [activeTab, setActiveTab] = useState("ai-scanner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonConfig, setButtonConfig] = useState({
    primaryText: null,
    primaryAction: null,
    primaryDisabled: false,
  });

  const createFoodTabRef = useRef(null);
  const aiFoodScannerTabRef = useRef(null);

  // Update button config whenever the active tab changes
  useEffect(() => {
    updateButtonConfig();
  }, [activeTab, isSubmitting]);

  const updateButtonConfig = () => {
    if (activeTab === "ai-scanner") {
      if (aiFoodScannerTabRef.current) {
        const config = aiFoodScannerTabRef.current.getButtonConfig();
        setButtonConfig({
          primaryText: config.primaryText,
          primaryAction: config.primaryAction,
          primaryDisabled: config.primaryDisabled || isSubmitting,
        });
      } else {
        setButtonConfig({
          primaryText: null,
          primaryAction: null,
          primaryDisabled: true,
        });
      }
    } else if (activeTab === "create") {
      setButtonConfig({
        primaryText: isSubmitting ? "Dodavanje..." : "Dodaj obrok",
        primaryAction: () => {
          if (createFoodTabRef.current) {
            createFoodTabRef.current.handleSave();
          }
        },
        primaryDisabled: isSubmitting,
      });
    } else {
      setButtonConfig({
        primaryText: null,
        primaryAction: null,
        primaryDisabled: false,
      });
    }
  };

  const handleSave = async (foodData) => {
    try {
      setIsSubmitting(true);
      await onSave(selectedDate, {
        ...foodData,
        mealType: mealName?.toLowerCase() || "snack",
        mealTime: mealTime,
      });
      handleClose();
    } catch (error) {
      console.error("Error saving meal:", error);
      setIsSubmitting(false);
    }
  };

  const handleUseHistoryItem = async (historyItem) => {
    try {
      setIsSubmitting(true);
      const foodData = {
        name: historyItem.name,
        description: historyItem.description,
        calories: historyItem.calories,
        protein: historyItem.protein,
        carbs: historyItem.carbs,
        fat: historyItem.fat,
        ingredients: historyItem.ingredients || [],
      };

      await onSave(selectedDate, {
        ...foodData,
        mealType: mealName?.toLowerCase() || "snack",
        mealTime: mealTime,
      });
      handleClose();
    } catch (error) {
      console.error("Error using history item:", error);
      setIsSubmitting(false);
    }
  };

  const handleDeleteHistoryItem = async (itemId) => {
    try {
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?id=${itemId}`,
        { method: "DELETE" }
      );
      return response.ok;
    } catch (error) {
      console.error("Error deleting history item:", error);
      return false;
    }
  };

  const handleClose = () => {
    setActiveTab("ai-scanner");
    setIsSubmitting(false);
    onClose();
  };

  // Fetch meal history function for the FoodHistoryTab
  const fetchMealHistory = useCallback(async () => {
    try {
      const mealType = mealName?.toLowerCase();
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?mealType=${mealType}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching meal history:", error);
      return [];
    }
  }, [mealName]);

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMealDisplayName = (name) => {
    switch(name?.toLowerCase()) {
      case 'breakfast': return 'Doručak';
      case 'lunch': return 'Ručak';
      case 'dinner': return 'Večera';
      case 'snack': return 'Užina';
      default: return name || 'Obrok';
    }
  };

  const getMealIcon = (name) => {
    switch(name?.toLowerCase()) {
      case 'breakfast': return 'mdi:coffee';
      case 'lunch': return 'mdi:food';
      case 'dinner': return 'mdi:silverware-fork-knife';
      case 'snack': return 'mdi:cookie';
      default: return 'mdi:food-apple';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <Icon 
            icon={getMealIcon(mealName)} 
            className="w-6 h-6 text-[#FF6B00]" 
          />
          <div>
            <span className="text-lg font-semibold">
              {getMealDisplayName(mealName)}
            </span>
            {mealTime && (
              <span className="text-zinc-400 text-sm font-normal ml-2">
                • {formatTime(mealTime)}
              </span>
            )}
          </div>
        </div>
      }
      size="large"
      primaryButtonText={buttonConfig.primaryText}
      primaryButtonAction={buttonConfig.primaryAction}
      primaryButtonDisabled={buttonConfig.primaryDisabled}
      secondaryButtonText="Otkaži"
      secondaryButtonAction={handleClose}
    >
      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Existing Meals Preview */}
        {existingMeals.length > 0 && (
          <div className="bg-zinc-800/40 rounded-xl border border-zinc-700/50 p-4">
            <h4 className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
              <Icon icon="mdi:food-variant" className="w-4 h-4" />
              Već uneseni obroci za {getMealDisplayName(mealName)}
            </h4>
            <div className="space-y-2">
              {existingMeals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {meal.selectedOption?.name || meal.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {Math.round(meal.calories || 0)} cal • {Math.round(meal.protein || 0)}g protein
                    </div>
                  </div>
                  <Icon 
                    icon={meal.isCompleted ? "mdi:check-circle" : "mdi:clock"} 
                    className={`w-4 h-4 ${
                      meal.isCompleted ? "text-green-400" : "text-yellow-400"
                    }`} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gradient-to-r from-zinc-800/60 to-zinc-800/40 rounded-xl border border-zinc-700/50 shadow-lg">
          {/* AI Scanner Tab - First and promoted */}
          <button
            onClick={() => setActiveTab("ai-scanner")}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "ai-scanner"
                ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8B20] text-white shadow-xl transform scale-105"
                : "text-zinc-300 hover:text-white hover:bg-zinc-700/60"
            }`}
          >
            <div className="relative">
              <Icon icon="mdi:brain" className="w-5 h-5" />
              {activeTab === "ai-scanner" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <Icon icon="mdi:star" className="w-2 h-2 text-[#FF6B00]" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span>AI Skener</span>
            </div>
            {activeTab === "ai-scanner" && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-50" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "create"
                ? "bg-gradient-to-r from-zinc-600 to-zinc-700 text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Ručno unesi
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-zinc-600 to-zinc-700 text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:history" className="w-4 h-4" />
            Istorija
          </button>
        </div>

        {/* AI Scanner Tab */}
        {activeTab === "ai-scanner" && (
          <AIFoodScannerTab
            ref={aiFoodScannerTabRef}
            mealName={getMealDisplayName(mealName)}
            mealTime={mealTime}
            onSave={handleSave}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Create New Meal Tab */}
        {activeTab === "create" && (
          <CreateFoodTab
            ref={createFoodTabRef}
            mealName={getMealDisplayName(mealName)}
            mealTime={mealTime}
            onSave={handleSave}
            initialType={mealName?.toLowerCase()}
            showMealTypeSelector={false}
          />
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <FoodHistoryTab
            mealName={getMealDisplayName(mealName)}
            onUseHistoryItem={handleUseHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            isSubmitting={isSubmitting}
            fetchHistoryFn={fetchMealHistory}
          />
        )}
      </div>
    </Modal>
  );
};