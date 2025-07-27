"use client";

import { Icon } from "@iconify/react";
import { useState, useCallback, useRef, useEffect } from "react";

import { Modal } from "@/components/common/Modal";

import { AIFoodScannerTab } from "./AIFoodScannerTab";
import { CreateFoodTab } from "./CreateFoodTab";
import { FoodHistoryTab } from "./FoodHistoryTab";

export const AddSnackModal = ({ isOpen, onClose, onSave, selectedDate }) => {
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
        primaryText: isSubmitting ? "Adding..." : "Add Snack",
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
      await onSave(selectedDate, foodData);
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
        mealType: historyItem.mealType,
        calories: historyItem.calories,
        protein: historyItem.protein,
        carbs: historyItem.carbs,
        fat: historyItem.fat,
        ingredients: historyItem.ingredients || [],
      };

      await onSave(selectedDate, foodData);
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

  // Fetch snack history function for the FoodHistoryTab
  const fetchSnackHistory = useCallback(async () => {
    try {
      // Fetch all snack types, not just "snack"
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?limit=20`
      );
      const data = await response.json();

      if (data.success) {
        // Filter for snack-related meal types
        const snackTypes = ["snack", "drink", "dessert", "supplement", "other"];
        return data.data.filter((meal) =>
          snackTypes.includes(meal.mealType?.toLowerCase())
        );
      }
      return [];
    } catch (error) {
      console.error("Error fetching snack history:", error);
      return [];
    }
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Icon icon="mdi:plus-circle" className="w-5 h-5 text-[#FF6B00]" />
          <span>Add Snack or Extra Meal</span>
          <span className="text-zinc-400 text-sm font-normal">
            • {selectedDate && formatDate(selectedDate)}
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
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-zinc-800/40 rounded-lg border border-zinc-700/50">
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
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "create"
                ? "bg-[#FF6B00] text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Add New
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "history"
                ? "bg-[#FF6B00] text-white shadow-lg"
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
            mealName="Snack"
            mealTime={new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            onSave={handleSave}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Create New Snack Tab */}
        {activeTab === "create" && (
          <CreateFoodTab
            ref={createFoodTabRef}
            mealName="Snack"
            selectedDate={selectedDate}
            formatDate={formatDate}
            onSave={handleSave}
            initialType="snack"
            showMealTypeSelector={true}
          />
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <FoodHistoryTab
            mealName="Snack"
            onUseHistoryItem={handleUseHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            isSubmitting={isSubmitting}
            fetchHistoryFn={fetchSnackHistory}
          />
        )}
      </div>
    </Modal>
  );
};
