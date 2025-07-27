"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect, useCallback } from "react";

import { FoodImageAnalyzer } from "./FoodImageAnalyzer";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";

export const CustomMealModal = ({
  isOpen,
  onClose,
  onSave,
  mealName,
  mealTime,
}) => {
  const [activeTab, setActiveTab] = useState("create"); // "create", "history", or "ai-scanner"
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    ingredients: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customMealHistory, setCustomMealHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // AI Scanner states
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiGetAnalysisData, setAiGetAnalysisData] = useState(null);
  const [aiSetManualInput, setAiSetManualInput] = useState(null);

  // Fetch custom meal history when modal opens
  const fetchCustomMealHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const mealType = mealName?.toLowerCase();
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?mealType=${mealType}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setCustomMealHistory(data.data);
      }
    } catch (error) {
      console.error("Error fetching custom meal history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [mealName]);

  useEffect(() => {
    if (isOpen && mealName) {
      fetchCustomMealHistory();
    }
  }, [isOpen, mealName, fetchCustomMealHistory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Meal name is required";
    }

    if (!formData.calories || formData.calories <= 0) {
      newErrors.calories = "Valid calories amount is required";
    }

    if (!formData.protein || formData.protein < 0) {
      newErrors.protein = "Valid protein amount is required";
    }

    if (!formData.carbs || formData.carbs < 0) {
      newErrors.carbs = "Valid carbs amount is required";
    }

    if (!formData.fat || formData.fat < 0) {
      newErrors.fat = "Valid fat amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const customMealData = {
        name: formData.name.trim(),
        description: formData.description.trim() || `Custom ${formData.name}`,
        calories: parseFloat(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
        ingredients: formData.ingredients
          ? formData.ingredients
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : [],
      };

      // Save to history with additional fields
      await saveToHistory({
        ...customMealData,
        mealType: mealName?.toLowerCase(),
      });

      // Call the original onSave callback with the correct format
      await onSave(customMealData);
      handleClose();
    } catch (error) {
      console.error("Error saving custom meal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToHistory = async (mealData) => {
    try {
      await fetch("/api/users/client/diet-tracker/custom-meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealData),
      });
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const handleUseHistoryMeal = async (historyMeal) => {
    try {
      setIsSubmitting(true);

      const customMealData = {
        name: historyMeal.name,
        description: historyMeal.description,
        calories: historyMeal.calories,
        protein: historyMeal.protein,
        carbs: historyMeal.carbs,
        fat: historyMeal.fat,
        ingredients: historyMeal.ingredients || [],
      };

      // Update usage count in history
      await saveToHistory({
        ...customMealData,
        mealType: historyMeal.mealType,
      });

      // Call the original onSave callback with the correct format
      await onSave(customMealData);
      handleClose();
    } catch (error) {
      console.error("Error using history meal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHistoryMeal = async (mealId) => {
    try {
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?id=${mealId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setCustomMealHistory((prev) =>
          prev.filter((meal) => meal.id !== mealId)
        );
      }
    } catch (error) {
      console.error("Error deleting history meal:", error);
    }
  };

  // AI Scanner functions
  const handleAiAnalyze = async () => {
    if (!aiGetAnalysisData) return;

    const analysisData = aiGetAnalysisData();
    if (!analysisData) {
      setAiError("Please upload an image or enter food details manually");
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);

    try {
      const response = await fetch("/api/nutrition/analyze-food", {
        method: "POST",
        body: analysisData.formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("manual input")) {
          if (aiSetManualInput) aiSetManualInput(true);
          throw new Error(data.error);
        }
        throw new Error(data.error || "Failed to analyze image");
      }

      setAiAnalysis(data);
    } catch (err) {
      setAiError(
        err.message || "Failed to analyze the image. Please try again."
      );
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAiSave = async () => {
    if (!aiAnalysis) return;

    try {
      const customMealData = {
        name: aiAnalysis.foodName,
        description:
          aiAnalysis.description || `AI detected ${aiAnalysis.foodName}`,
        calories: aiAnalysis.calories,
        protein: aiAnalysis.proteins,
        carbs: aiAnalysis.carbs,
        fat: aiAnalysis.fats,
        ingredients: aiAnalysis.ingredients || [],
      };

      // Save to history with additional fields
      await saveToHistory({
        ...customMealData,
        mealType: mealName?.toLowerCase(),
      });

      // Call the original onSave callback with the correct format
      await onSave(customMealData);
      handleClose();
    } catch (error) {
      console.error("Error saving AI analyzed meal:", error);
      setAiError("Failed to save meal. Please try again.");
    }
  };

  const getModalButtons = () => {
    if (activeTab === "ai-scanner") {
      if (!aiAnalysis) {
        return {
          primaryText: isAnalyzing ? "Analyzing..." : "Analyze Food",
          primaryAction: handleAiAnalyze,
          primaryDisabled: isAnalyzing,
        };
      } else {
        return {
          primaryText: "Save Meal",
          primaryAction: handleAiSave,
          primaryDisabled: false,
        };
      }
    } else if (activeTab === "create") {
      return {
        primaryText: isSubmitting ? "Saving..." : "Save Meal",
        primaryAction: handleSave,
        primaryDisabled: isSubmitting,
      };
    }
    return {
      primaryText: null,
      primaryAction: null,
      primaryDisabled: false,
    };
  };

  const modalButtons = getModalButtons();

  // Memoize the onAnalyze callback to prevent infinite re-renders
  const handleOnAnalyze = useCallback((getDataFn, setManualInputFn) => {
    setAiGetAnalysisData(() => getDataFn);
    setAiSetManualInput(() => setManualInputFn);
  }, []);

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: "",
    });
    setErrors({});
    setActiveTab("create");
    setAiAnalysis(null);
    setAiError(null);
    setIsAnalyzing(false);
    onClose();
  };

  const getTotalMacros = () => {
    const protein = parseFloat(formData.protein) || 0;
    const carbs = parseFloat(formData.carbs) || 0;
    const fat = parseFloat(formData.fat) || 0;

    return {
      protein: protein * 4, // 4 calories per gram
      carbs: carbs * 4, // 4 calories per gram
      fat: fat * 9, // 9 calories per gram
      total: protein * 4 + carbs * 4 + fat * 9,
    };
  };

  const macroCalories = getTotalMacros();
  const enteredCalories = parseFloat(formData.calories) || 0;
  const caloriesDifference = Math.abs(enteredCalories - macroCalories.total);

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
      primaryButtonText={modalButtons.primaryText}
      primaryButtonAction={modalButtons.primaryAction}
      primaryButtonDisabled={modalButtons.primaryDisabled}
      secondaryButtonText="Cancel"
      secondaryButtonAction={handleClose}
    >
      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-zinc-800/40 rounded-lg border border-zinc-700/50">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "create"
                ? "bg-[#FF6B00] text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:plus" className="w-4 h-4" />
            Create New
          </button>
          <button
            onClick={() => setActiveTab("ai-scanner")}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "ai-scanner"
                ? "bg-[#FF6B00] text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:brain" className="w-4 h-4" />
            AI Scanner
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
            History ({customMealHistory.length})
          </button>
        </div>

        {/* Create New Meal Tab */}
        {activeTab === "create" && (
          <div className="space-y-6 max-w-full">
            <p className="text-zinc-400 text-sm">
              Create a custom meal entry for your {mealName?.toLowerCase()} at{" "}
              {formatTime(mealTime)}.
            </p>

            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                type="text"
                label="Meal Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grilled Chicken Salad"
                error={errors.name}
                required
                className="w-full"
              />

              <FormField
                type="textarea"
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your meal..."
                rows={3}
                className="w-full"
              />

              <FormField
                type="text"
                label="Ingredients (Optional)"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Chicken breast, lettuce, tomatoes, olive oil (comma separated)"
                helperText="Separate ingredients with commas"
                className="w-full"
              />
            </div>

            {/* Nutrition Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Icon icon="mdi:nutrition" className="w-5 h-5 text-[#FF6B00]" />
                Nutrition Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  type="number"
                  label="Calories"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  error={errors.calories}
                  required
                  className="w-full min-w-0"
                />

                <FormField
                  type="number"
                  label="Protein (g)"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  error={errors.protein}
                  required
                  className="w-full min-w-0"
                />

                <FormField
                  type="number"
                  label="Carbs (g)"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  error={errors.carbs}
                  required
                  className="w-full min-w-0"
                />

                <FormField
                  type="number"
                  label="Fat (g)"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                  error={errors.fat}
                  required
                  className="w-full min-w-0"
                />
              </div>
            </div>

            {/* Nutrition Preview */}
            {(formData.protein || formData.carbs || formData.fat) && (
              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
                <h4 className="text-white font-medium mb-3">
                  Nutrition Preview
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold">
                      {Math.round(macroCalories.total)}
                    </div>
                    <div className="text-zinc-400 text-xs">calculated cal</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold">
                      {Math.round(macroCalories.protein)}
                    </div>
                    <div className="text-zinc-400 text-xs">from protein</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold">
                      {Math.round(macroCalories.carbs)}
                    </div>
                    <div className="text-zinc-400 text-xs">from carbs</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-700/30 rounded">
                    <div className="text-[#FF6B00] font-semibold">
                      {Math.round(macroCalories.fat)}
                    </div>
                    <div className="text-zinc-400 text-xs">from fat</div>
                  </div>
                </div>

                {/* Calorie Validation */}
                {enteredCalories > 0 && caloriesDifference > 10 && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:alert"
                        className="w-4 h-4 text-yellow-400"
                      />
                      <span className="text-yellow-400 text-sm font-medium">
                        Calorie Mismatch
                      </span>
                    </div>
                    <p className="text-yellow-300 text-sm mt-1">
                      Your entered calories ({enteredCalories}) differ from
                      calculated calories ({Math.round(macroCalories.total)}) by{" "}
                      {Math.round(caloriesDifference)} calories.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:lightbulb"
                  className="w-5 h-5 text-blue-400 mt-0.5"
                />
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">
                    Tips for accurate logging:
                  </h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Use a food scale for precise measurements</li>
                    <li>• Check nutrition labels when available</li>
                    <li>• Include cooking oils and condiments</li>
                    <li>• Round to the nearest whole number for simplicity</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isSubmitting && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-green-400 text-sm">
                    Saving your custom meal...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Scanner Tab */}
        {activeTab === "ai-scanner" && (
          <div className="space-y-4">
            <FoodImageAnalyzer
              mealName={mealName}
              mealTime={mealTime}
              onAnalyze={handleOnAnalyze}
              isAnalyzing={isAnalyzing}
              analysis={aiAnalysis}
              error={aiError}
              setError={setAiError}
            />

            {/* Error Display */}
            {aiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:alert"
                    className="w-5 h-5 text-red-400 mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm">{aiError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4 max-w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Your {mealName} History
              </h3>
              <span className="text-sm text-zinc-400">
                {customMealHistory.length} saved meals
              </span>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-zinc-400">Loading history...</span>
              </div>
            ) : customMealHistory.length === 0 ? (
              <div className="text-center py-8 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <Icon
                  icon="mdi:history"
                  className="w-12 h-12 text-zinc-500 mx-auto mb-3"
                />
                <h4 className="text-white font-medium mb-2">No History Yet</h4>
                <p className="text-zinc-400 text-sm">
                  Create your first custom {mealName?.toLowerCase()} to start
                  building your history.
                </p>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setActiveTab("create")}
                  className="mt-4"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                  Create First Meal
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {customMealHistory.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 rounded-xl border border-zinc-700/40 p-4 hover:border-zinc-600/50 hover:from-zinc-800/60 hover:to-zinc-800/30 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold text-sm truncate">
                              {meal.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-medium">
                                {meal.usageCount}x used
                              </span>
                            </div>
                          </div>

                          {meal.description && (
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-1 mb-2">
                              {meal.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1.5 ml-3">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => handleUseHistoryMeal(meal)}
                            disabled={isSubmitting}
                            className="h-8 px-3 text-xs bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 hover:bg-[#FF6B00]/20"
                          >
                            <Icon icon="mdi:check" className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Use</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleDeleteHistoryMeal(meal.id)}
                            className="h-8 px-2 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                          >
                            <Icon icon="mdi:delete" className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Nutrition Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-[#FF6B00] font-semibold text-sm">
                            {Math.round(meal.calories)}
                          </div>
                          <div className="text-zinc-400 text-xs">cal</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-blue-400 font-semibold text-sm">
                            {Math.round(meal.protein)}g
                          </div>
                          <div className="text-zinc-400 text-xs">protein</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-green-400 font-semibold text-sm">
                            {Math.round(meal.carbs)}g
                          </div>
                          <div className="text-zinc-400 text-xs">carbs</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-yellow-400 font-semibold text-sm">
                            {Math.round(meal.fat)}g
                          </div>
                          <div className="text-zinc-400 text-xs">fat</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-700/30">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="mdi:clock-outline"
                            className="w-3 h-3 text-zinc-500"
                          />
                          <span className="text-xs text-zinc-500">
                            Last used{" "}
                            {new Date(meal.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-500">
                          <Icon icon="mdi:star" className="w-3 h-3" />
                          <span className="text-xs">Saved meal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
