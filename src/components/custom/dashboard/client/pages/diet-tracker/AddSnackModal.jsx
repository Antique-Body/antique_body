"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";

export const AddSnackModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [activeTab, setActiveTab] = useState("create"); // "create" or "history"
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mealType: "snack",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    ingredients: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackHistory, setSnackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch snack history when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSnackHistory();
    }
  }, [isOpen]);

  const fetchSnackHistory = async () => {
    setHistoryLoading(true);
    try {
      // Fetch all snack types, not just "snack"
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?limit=20`
      );
      const data = await response.json();

      if (data.success) {
        // Filter for snack-related meal types
        const snackTypes = ["snack", "drink", "dessert", "supplement", "other"];
        const filteredSnacks = data.data.filter((meal) =>
          snackTypes.includes(meal.mealType.toLowerCase())
        );
        setSnackHistory(filteredSnacks);
      }
    } catch (error) {
      console.error("Error fetching snack history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

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
      newErrors.name = "Snack name is required";
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
      const snackData = {
        name: formData.name.trim(),
        description: formData.description.trim() || `Custom ${formData.name}`,
        mealType: formData.mealType,
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

      await onSave(selectedDate, snackData);
      handleClose();
    } catch (error) {
      console.error("Error saving snack:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseHistorySnack = async (historySnack) => {
    try {
      setIsSubmitting(true);

      const snackData = {
        name: historySnack.name,
        description: historySnack.description,
        mealType: historySnack.mealType,
        calories: historySnack.calories,
        protein: historySnack.protein,
        carbs: historySnack.carbs,
        fat: historySnack.fat,
        ingredients: historySnack.ingredients || [],
      };

      await onSave(selectedDate, snackData);
      handleClose();
    } catch (error) {
      console.error("Error using history snack:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHistorySnack = async (snackId) => {
    try {
      const response = await fetch(
        `/api/users/client/diet-tracker/custom-meals?id=${snackId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setSnackHistory((prev) => prev.filter((snack) => snack.id !== snackId));
      }
    } catch (error) {
      console.error("Error deleting history snack:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      mealType: "snack",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: "",
    });
    setErrors({});
    setActiveTab("create");
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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const snackTypes = [
    { value: "snack", label: "Snack", icon: "mdi:food-apple" },
    { value: "drink", label: "Drink", icon: "mdi:cup" },
    { value: "dessert", label: "Dessert", icon: "mdi:cupcake" },
    { value: "supplement", label: "Supplement", icon: "mdi:pill" },
    { value: "other", label: "Other", icon: "mdi:food" },
  ];

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
      primaryButtonText={
        activeTab === "create"
          ? isSubmitting
            ? "Adding..."
            : "Add Snack"
          : null
      }
      primaryButtonAction={activeTab === "create" ? handleSave : null}
      primaryButtonDisabled={isSubmitting}
      secondaryButtonText="Cancel"
      secondaryButtonAction={handleClose}
    >
      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-zinc-800/40 rounded-lg border border-zinc-700/50">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
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
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "history"
                ? "bg-[#FF6B00] text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
            }`}
          >
            <Icon icon="mdi:history" className="w-4 h-4" />
            History ({snackHistory.length})
          </button>
        </div>

        {/* Create New Snack Tab */}
        {activeTab === "create" && (
          <div className="space-y-6 max-w-full">
            <p className="text-zinc-400 text-sm">
              Add a snack, drink, or any extra food you consumed on{" "}
              {selectedDate && formatDate(selectedDate)}.
            </p>

            {/* Basic Information */}
            <div className="space-y-4">
              <FormField
                type="text"
                label="Food/Snack Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Apple, Chocolate Bar, Protein Shake"
                error={errors.name}
                required
                className="w-full"
              />

              {/* Snack Type Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {snackTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          mealType: type.value,
                        }))
                      }
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                        formData.mealType === type.value
                          ? "border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]"
                          : "border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <Icon icon={type.icon} className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                type="textarea"
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description or notes..."
                rows={2}
                className="w-full"
              />

              <FormField
                type="text"
                label="Ingredients (Optional)"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Main ingredients (comma separated)"
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
                    Quick tips for snack logging:
                  </h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Check nutrition labels for packaged foods</li>
                    <li>
                      • Use serving sizes as reference (1 apple ≈ 80 calories)
                    </li>
                    <li>• Include drinks, supplements, and small bites</li>
                    <li>• Don't forget cooking oils and condiments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4 max-w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Your Snack History
              </h3>
              <span className="text-sm text-zinc-400">
                {snackHistory.length} saved snacks
              </span>
            </div>

            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-zinc-400">Loading history...</span>
              </div>
            ) : snackHistory.length === 0 ? (
              <div className="text-center py-8 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
                <Icon
                  icon="mdi:food-apple"
                  className="w-12 h-12 text-zinc-500 mx-auto mb-3"
                />
                <h4 className="text-white font-medium mb-2">No History Yet</h4>
                <p className="text-zinc-400 text-sm">
                  Add your first snack to start building your history.
                </p>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setActiveTab("create")}
                  className="mt-4"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
                  Add First Snack
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {snackHistory.map((snack) => (
                  <div
                    key={snack.id}
                    className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 rounded-xl border border-zinc-700/40 p-4 hover:border-zinc-600/50 hover:from-zinc-800/60 hover:to-zinc-800/30 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-semibold text-sm truncate">
                              {snack.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-medium">
                                {snack.usageCount}x used
                              </span>
                              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium capitalize">
                                {snack.mealType}
                              </span>
                            </div>
                          </div>

                          {snack.description && (
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-1 mb-2">
                              {snack.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1.5 ml-3">
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => handleUseHistorySnack(snack)}
                            disabled={isSubmitting}
                            className="h-8 px-3 text-xs bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 hover:bg-[#FF6B00]/20"
                          >
                            <Icon icon="mdi:check" className="w-3 h-3 mr-1" />
                            <span className="hidden sm:inline">Add</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleDeleteHistorySnack(snack.id)}
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
                            {Math.round(snack.calories)}
                          </div>
                          <div className="text-zinc-400 text-xs">cal</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-blue-400 font-semibold text-sm">
                            {Math.round(snack.protein)}g
                          </div>
                          <div className="text-zinc-400 text-xs">protein</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-green-400 font-semibold text-sm">
                            {Math.round(snack.carbs)}g
                          </div>
                          <div className="text-zinc-400 text-xs">carbs</div>
                        </div>
                        <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                          <div className="text-yellow-400 font-semibold text-sm">
                            {Math.round(snack.fat)}g
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
                            {new Date(snack.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-500">
                          <Icon icon="mdi:star" className="w-3 h-3" />
                          <span className="text-xs">Saved snack</span>
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
