"use client";

import { Icon } from "@iconify/react";
import { forwardRef, useImperativeHandle } from "react";

import { useAIFoodAnalysis } from "@/hooks";

import { FoodImageAnalyzer } from "./FoodImageAnalyzer";

export const AIFoodScannerTab = forwardRef(
  ({ mealName, mealTime, onSave, isSubmitting = false }, ref) => {
    const {
      analysis,
      error,
      isAnalyzing,
      handleOnAnalyze,
      handleCancel,
      analyzeFood,
      setError,
    } = useAIFoodAnalysis();

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleSave: () => {
        if (analysis) {
          handleSave();
          return true;
        }
        return false;
      },
      getButtonConfig: () => getButtonConfig(),
    }));

    const handleSave = async () => {
      if (!analysis) return;

      try {
        const foodData = {
          name: analysis.foodName,
          description:
            analysis.description || `AI detected ${analysis.foodName}`,
          mealType: mealName?.toLowerCase() || "snack",
          calories: analysis.calories || 0,
          protein: analysis.proteins || 0,
          carbs: analysis.carbs || 0,
          fat: analysis.fats || 0,
          ingredients: analysis.ingredients || [],
        };

        await onSave(foodData);
        return true;
      } catch (error) {
        setError(
          "Failed to save food. Please try again." +
            " " +
            error.message +
            " " +
            error.stack
        );
        return false;
      }
    };

    // Get appropriate button configuration based on analysis state
    const getButtonConfig = () => {
      if (!analysis) {
        return {
          primaryText: isAnalyzing ? "Analyzing..." : "Analyze Food",
          primaryAction: analyzeFood,
          primaryDisabled: isAnalyzing,
        };
      } else {
        return {
          primaryText: isSubmitting ? "Saving..." : "Save Food",
          primaryAction: handleSave,
          primaryDisabled: isSubmitting,
        };
      }
    };

    return (
      <div className="space-y-4">
        <FoodImageAnalyzer
          mealName={mealName}
          mealTime={mealTime}
          onAnalyze={handleOnAnalyze}
          onCancel={handleCancel}
          isAnalyzing={isAnalyzing}
          analysis={analysis}
          error={error}
          setError={setError}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon icon="mdi:alert" className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AIFoodScannerTab.displayName = "AIFoodScannerTab";
