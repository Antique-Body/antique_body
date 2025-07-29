"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useRef, useEffect } from "react";

import { Modal } from "@/components/common/Modal";

import { AIFoodScannerTab } from "./AIFoodScannerTab";
import { CreateFoodTab } from "./CreateFoodTab";
import { FoodHistoryTab } from "./FoodHistoryTab";

export const CustomMealModal = ({
  isOpen,
  onClose,
  onSave,
  mealName,
  mealTime,
}) => {
  const [activeTab, setActiveTab] = useState("ai-scanner"); // AI Scanner first!
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonConfig, setButtonConfig] = useState({
    primaryText: null,
    primaryAction: null,
    primaryDisabled: false,
  });

  const createFoodTabRef = useRef(null);
  const aiFoodScannerTabRef = useRef(null);

  const updateButtonConfig = useCallback(() => {
    if (activeTab === "ai-scanner") {
      if (aiFoodScannerTabRef.current) {
        // Check if we have analysis data
        const hasAnalysis = aiFoodScannerTabRef.current.hasAnalysis?.();
        const isAnalyzing = aiFoodScannerTabRef.current.isAnalyzing?.();

        if (hasAnalysis) {
          // Show "Save Meal" button when analysis exists
          setButtonConfig({
            primaryText: isSubmitting ? "Saving..." : "Save Meal",
            primaryAction: () => {
              if (aiFoodScannerTabRef.current) {
                aiFoodScannerTabRef.current.handleSave();
              }
            },
            primaryDisabled: isSubmitting,
          });
        } else {
          // Show "Analyze Food" button when no analysis exists
          setButtonConfig({
            primaryText: isAnalyzing ? "Analyzing..." : "Analyze Food",
            primaryAction: () => {
              if (aiFoodScannerTabRef.current) {
                aiFoodScannerTabRef.current.analyzeFood();
              }
            },
            primaryDisabled: isAnalyzing || isSubmitting,
          });
        }
      } else {
        setButtonConfig({
          primaryText: "Analyze Food",
          primaryAction: () => {
            if (aiFoodScannerTabRef.current) {
              aiFoodScannerTabRef.current.analyzeFood();
            }
          },
          primaryDisabled: isSubmitting,
        });
      }
    } else if (activeTab === "create") {
      setButtonConfig({
        primaryText: isSubmitting ? "Saving..." : "Save Meal",
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
  }, [activeTab, isSubmitting]);

  // Update button config whenever the active tab changes
  useEffect(() => {
    updateButtonConfig();
  }, [activeTab, isSubmitting, updateButtonConfig]);

  // Callback to trigger button config update when analysis state changes
  const onAnalysisStateChange = useCallback(() => {
    updateButtonConfig();
  }, [updateButtonConfig]);

  const handleSave = async (foodData) => {
    try {
      setIsSubmitting(true);
      await onSave(foodData);
      handleClose();
    } catch (error) {
      console.error("Error saving food:", error);
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

      await onSave(foodData);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Icon icon="mdi:plus-circle" className="w-5 h-5 text-[#FF6B00]" />
          <span>Custom {mealName}</span>
          <span className="text-zinc-400 text-sm font-normal">
            • {formatTime(mealTime)}
          </span>
        </div>
      }
      size="large"
      primaryButtonText={buttonConfig.primaryText}
      primaryButtonAction={buttonConfig.primaryAction}
      primaryButtonDisabled={buttonConfig.primaryDisabled}
      secondaryButtonText="Cancel"
      secondaryButtonAction={handleClose}
    >
      <div className="space-y-6 max-w-full overflow-hidden">
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
              <span>AI Scanner</span>
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
            Create Manual
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
            History
          </button>
        </div>

        {/* AI Scanner Tab */}
        {activeTab === "ai-scanner" && (
          <AIFoodScannerTab
            ref={aiFoodScannerTabRef}
            mealName={mealName}
            mealTime={mealTime}
            onSave={handleSave}
            onAnalysisStateChange={onAnalysisStateChange}
          />
        )}

        {/* Create New Meal Tab */}
        {activeTab === "create" && (
          <CreateFoodTab
            ref={createFoodTabRef}
            mealName={mealName}
            mealTime={mealTime}
            onSave={handleSave}
            initialType={mealName?.toLowerCase()}
            showMealTypeSelector={false}
          />
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <FoodHistoryTab
            mealName={mealName}
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
