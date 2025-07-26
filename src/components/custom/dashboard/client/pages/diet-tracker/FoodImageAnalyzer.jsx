"use client";

import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";

import { AIImageScanner } from "./AIImageScanner";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

export const FoodImageAnalyzer = ({
  mealName,
  mealTime,
  onAnalyze,
  onCancel,
  isAnalyzing,
  analysis,
  error,
  setError,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [adjustedServings, setAdjustedServings] = useState(1);
  const [manualInput, setManualInput] = useState(false);
  const [manualFoodName, setManualFoodName] = useState("");
  const [manualServingSize, setManualServingSize] = useState("");
  const [manualServingUnit, setManualServingUnit] = useState("g");
  const [manualDescription, setManualDescription] = useState("");

  // Calculate nutritional values based on adjusted servings
  const adjustedAnalysis = analysis
    ? {
        ...analysis,
        calories: Math.round(analysis.calories * adjustedServings),
        proteins: +(analysis.proteins * adjustedServings).toFixed(1),
        carbs: +(analysis.carbs * adjustedServings).toFixed(1),
        fats: +(analysis.fats * adjustedServings).toFixed(1),
        fiber: +(analysis.fiber * adjustedServings).toFixed(1),
        servingSize: analysis.servingSize * adjustedServings,
      }
    : null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (setError) setError(null);
      setAdjustedServings(1);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setManualInput(false);
    setManualFoodName("");
    setManualServingSize("");
    setManualServingUnit("g");
    setManualDescription("");
    setAdjustedServings(1);
    if (setError) setError(null);
    if (onCancel) onCancel();
  };

  // Expose data for parent component to use
  const getAnalysisData = () => {
    if (!selectedImage && !manualInput) return null;

    const formData = new FormData();
    if (selectedImage) {
      formData.append("file", selectedImage);
    }
    formData.append("manualInput", manualInput.toString());
    if (manualInput) {
      formData.append("manualFoodName", manualFoodName);
      formData.append("manualServingSize", manualServingSize);
      formData.append("manualServingUnit", manualServingUnit);
      formData.append("manualDescription", manualDescription);
    }

    return { formData, manualInput, manualFoodName, manualServingSize };
  };

  // Expose this function to parent - only call when data changes, not when callback changes
  useEffect(() => {
    if (onAnalyze && typeof onAnalyze === "function") {
      onAnalyze(getAnalysisData, setManualInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, manualInput, manualFoodName, manualServingSize]);

  return (
    <div className="space-y-6 max-w-full">
      <p className="text-zinc-400 text-sm">
        Use AI to scan and analyze food images for automatic nutrition detection
        for your {mealName?.toLowerCase()} at{" "}
        {mealTime &&
          new Date(`2000-01-01T${mealTime}`).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        .
      </p>

      {!previewUrl && !manualInput ? (
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mb-4">
                <Icon
                  icon="mdi:camera-plus"
                  className="w-8 h-8 text-[#FF6B00]"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Food Scanner
              </h3>
              <p className="text-zinc-400 text-sm mb-6 max-w-md">
                Take a photo of your food and let AI automatically identify it
                and calculate nutrition information.
              </p>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
                id="food-image-upload"
              />
              <label
                htmlFor="food-image-upload"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white rounded-lg hover:bg-[#FF6B00]/90 transition-colors cursor-pointer"
              >
                <Icon icon="mdi:camera" className="w-5 h-5" />
                Upload Food Image
              </label>

              <button
                onClick={() => setManualInput(true)}
                className="mt-4 text-zinc-400 hover:text-white text-sm underline"
              >
                Can't take a photo? Enter manually instead
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:lightbulb"
                className="w-5 h-5 text-blue-400 mt-0.5"
              />
              <div>
                <h4 className="text-blue-400 font-medium mb-2">
                  Tips for best results:
                </h4>
                <ul className="text-blue-300 text-sm space-y-1">
                  <li>• Take photos in good lighting</li>
                  <li>• Show the food clearly and close-up</li>
                  <li>• Include the entire portion you're eating</li>
                  <li>• Avoid blurry or dark images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Preview or Manual Input */}
          {!manualInput ? (
            <div className="space-y-4">
              <div className="relative h-64 w-full bg-zinc-800 rounded-lg overflow-hidden">
                {previewUrl && (
                  <>
                    <img
                      src={previewUrl}
                      alt="Food preview"
                      className="w-full h-full object-cover"
                    />
                    <AIImageScanner isScanning={isAnalyzing} />
                  </>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={clearImage}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FormField
                type="text"
                label="Food Name"
                name="manualFoodName"
                value={manualFoodName}
                onChange={(e) => setManualFoodName(e.target.value)}
                placeholder="e.g., Grilled Chicken, Pizza Slice"
                required
                className="w-full"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  type="number"
                  label="Serving Size"
                  name="manualServingSize"
                  value={manualServingSize}
                  onChange={(e) => setManualServingSize(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.1"
                  required
                  className="w-full"
                />

                <FormField
                  type="select"
                  label="Unit"
                  name="manualServingUnit"
                  value={manualServingUnit}
                  onChange={(e) => setManualServingUnit(e.target.value)}
                  className="w-full"
                  options={[
                    { value: "g", label: "Grams (g)" },
                    { value: "oz", label: "Ounces (oz)" },
                    { value: "ml", label: "Milliliters (ml)" },
                    { value: "cup", label: "Cups" },
                    { value: "piece", label: "Piece" },
                    { value: "slice", label: "Slice" },
                    { value: "serving", label: "Serving" },
                  ]}
                />
              </div>

              <FormField
                type="textarea"
                label="Description (Optional)"
                name="manualDescription"
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Additional details about preparation, ingredients, etc."
                rows={2}
                className="w-full"
              />

              <div className="flex justify-center">
                <button
                  onClick={clearImage}
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Cancel Manual Input
                </button>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Food Info Header */}
              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {analysis.foodName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-400"
                    />
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {analysis.confidence > 0.8
                        ? "High Confidence"
                        : "Medium Confidence"}
                    </span>
                  </div>
                </div>

                {analysis.description && (
                  <p className="text-zinc-400 text-sm mb-3">
                    {analysis.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    Source: {analysis.brandName || "Generic"}
                  </span>
                  <span className="text-zinc-400">
                    Base serving: {analysis.servingSize} {analysis.servingUnit}
                  </span>
                </div>
              </div>

              {/* Serving Adjustment */}
              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">
                    Adjust Portion Size
                  </h4>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        setAdjustedServings(
                          Math.max(0.25, adjustedServings - 0.25)
                        )
                      }
                      disabled={adjustedServings <= 0.25}
                      className="h-8 w-8 p-0"
                    >
                      <Icon icon="mdi:minus" className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-medium min-w-[4rem] text-center">
                      {adjustedServings}x
                    </span>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        setAdjustedServings(adjustedServings + 0.25)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Icon icon="mdi:plus" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm">
                  Adjusted serving: {adjustedAnalysis.servingSize.toFixed(1)}{" "}
                  {analysis.servingUnit}
                </p>
              </div>

              {/* Nutrition Information */}
              <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/50 p-4">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Icon
                    icon="mdi:nutrition"
                    className="w-5 h-5 text-[#FF6B00]"
                  />
                  Nutrition Information
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-[#FF6B00]/10 rounded-lg border border-[#FF6B00]/30">
                    <div className="text-[#FF6B00] font-semibold text-lg">
                      {adjustedAnalysis.calories}
                    </div>
                    <div className="text-zinc-400 text-xs">calories</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="text-blue-400 font-semibold text-lg">
                      {adjustedAnalysis.proteins}g
                    </div>
                    <div className="text-zinc-400 text-xs">protein</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                    <div className="text-green-400 font-semibold text-lg">
                      {adjustedAnalysis.carbs}g
                    </div>
                    <div className="text-zinc-400 text-xs">carbs</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                    <div className="text-yellow-400 font-semibold text-lg">
                      {adjustedAnalysis.fats}g
                    </div>
                    <div className="text-zinc-400 text-xs">fat</div>
                  </div>
                </div>

                {/* Additional nutrients */}
                {(analysis.fiber || analysis.sugar || analysis.sodium) && (
                  <div className="mt-4 pt-4 border-t border-zinc-700/50">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {analysis.fiber && (
                        <div className="text-center">
                          <div className="text-white font-medium">
                            {(analysis.fiber * adjustedServings).toFixed(1)}g
                          </div>
                          <div className="text-zinc-400 text-xs">fiber</div>
                        </div>
                      )}
                      {analysis.sugar && (
                        <div className="text-center">
                          <div className="text-white font-medium">
                            {(analysis.sugar * adjustedServings).toFixed(1)}g
                          </div>
                          <div className="text-zinc-400 text-xs">sugar</div>
                        </div>
                      )}
                      {analysis.sodium && (
                        <div className="text-center">
                          <div className="text-white font-medium">
                            {Math.round(analysis.sodium * adjustedServings)}mg
                          </div>
                          <div className="text-zinc-400 text-xs">sodium</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Note about saving */}
              <div className="text-center">
                <p className="text-zinc-400 text-sm">
                  Use the "Save" button below to add this food to your meal
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:alert"
                  className="w-5 h-5 text-red-400 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-red-400 text-sm">{error}</p>
                  {error.includes("manual input") && !manualInput && (
                    <button
                      onClick={() => setManualInput(true)}
                      className="mt-2 text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm underline"
                    >
                      Try manual input instead
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
