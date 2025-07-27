"use client";

import { Icon } from "@iconify/react";
import { useState, useImperativeHandle, forwardRef, useMemo } from "react";

import { FormField } from "@/components/common/FormField";

const CreateFoodTab = forwardRef(
  (
    {
      mealName,
      mealTime,
      onSave,
      initialType = "snack",
      showMealTypeSelector = true,
      formatDate,
      selectedDate,
    },
    ref
  ) => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      mealType: initialType,
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: "",
    });
    const [errors, setErrors] = useState({});

    // Expose handleSave method to parent component via ref
    useImperativeHandle(ref, () => ({
      handleSave: async () => {
        if (validateForm()) {
          try {
            await handleSaveInternal();
            return true;
          } catch (error) {
            // Re-throw the error so parent component can handle it
            throw error;
          }
        }
        return false;
      },
    }));

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

      // Only name is required
      if (!formData.name.trim()) {
        newErrors.name = "Food name is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSaveInternal = async () => {
      try {
        // Convert nutritional values to numbers or default to 0
        const foodData = {
          name: formData.name.trim(),
          description: formData.description.trim() || `Custom ${formData.name}`,
          mealType: formData.mealType,
          calories: parseFloat(formData.calories) || 0,
          protein: parseFloat(formData.protein) || 0,
          carbs: parseFloat(formData.carbs) || 0,
          fat: parseFloat(formData.fat) || 0,
          ingredients: formData.ingredients
            ? formData.ingredients
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
            : [],
        };

        await onSave(foodData);
      } catch (error) {
        console.error("Error saving food:", error);
        // Re-throw the error so it can be handled by the parent component
        throw error;
      }
    };

    // Calculate nutrition values for preview
    const macroCalories = useMemo(() => {
      const protein = parseFloat(formData.protein) || 0;
      const carbs = parseFloat(formData.carbs) || 0;
      const fat = parseFloat(formData.fat) || 0;

      return {
        protein: protein * 4, // 4 calories per gram
        carbs: carbs * 4, // 4 calories per gram
        fat: fat * 9, // 9 calories per gram
        total: protein * 4 + carbs * 4 + fat * 9,
      };
    }, [formData.protein, formData.carbs, formData.fat]);

    const enteredCalories = parseFloat(formData.calories) || 0;
    const caloriesDifference = Math.abs(enteredCalories - macroCalories.total);
    const showNutritionPreview =
      formData.protein || formData.carbs || formData.fat;

    const snackTypes = [
      { value: "snack", label: "Snack", icon: "mdi:food-apple" },
      { value: "drink", label: "Drink", icon: "mdi:cup" },
      { value: "dessert", label: "Dessert", icon: "mdi:cupcake" },
      { value: "supplement", label: "Supplement", icon: "mdi:pill" },
      { value: "other", label: "Other", icon: "mdi:food" },
    ];

    const formatTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
      <div className="space-y-6 max-w-full">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:information" className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-blue-300 text-sm">
                <span className="font-semibold">Tip:</span> Try our AI Scanner
                for instant food recognition and nutrition analysis!
              </p>
            </div>
          </div>
        </div>

        <p className="text-zinc-400 text-sm">
          {selectedDate
            ? `Add ${
                mealName ? `a ${mealName.toLowerCase()}` : "food"
              } for ${formatDate?.(selectedDate)}`
            : `Create a custom ${mealName?.toLowerCase() || "food"} entry ${
                mealTime ? `at ${formatTime(mealTime)}` : ""
              }.`}
        </p>

        {/* Basic Information */}
        <div className="space-y-4">
          <FormField
            type="text"
            label="Food Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken Salad, Apple, Protein Shake"
            error={errors.name}
            required
            className="w-full"
          />

          {/* Snack Type Selection - Only show if requested */}
          {showMealTypeSelector && (
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
          )}

          <FormField
            type="textarea"
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of your food..."
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
            Nutrition Information (Optional)
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
              className="w-full min-w-0"
            />
          </div>
        </div>

        {/* Nutrition Preview - Only show if user has entered nutrition values */}
        {showNutritionPreview && (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
            <h4 className="text-white font-medium mb-3">Nutrition Preview</h4>

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
                  <Icon icon="mdi:alert" className="w-4 h-4 text-yellow-400" />
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
      </div>
    );
  }
);

CreateFoodTab.displayName = "CreateFoodTab";

export { CreateFoodTab };
