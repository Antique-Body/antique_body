"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";

import { AIImageScanner } from "./AIImageScanner";

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
      // Validate file type
      if (!file.type.startsWith("image/")) {
        if (setError) setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        if (setError)
          setError(
            "Image file too large. Please select an image smaller than 10MB"
          );
        return;
      }

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
    if (onCancel) onCancel(); // This will reset the parent's analysis state
  };

  const resetToUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setAdjustedServings(1);
    if (setError) setError(null);
    if (onCancel) onCancel(); // Also call onCancel to reset the parent's analysis state
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
          <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-800/30 rounded-xl border border-zinc-700/50 p-6 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#FF6B00] to-[#FF8B20] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Icon icon="mdi:camera-plus" className="w-10 h-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <Icon icon="mdi:brain" className="w-3 h-3 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8B20] bg-clip-text text-transparent">
                AI Food Scanner
              </h3>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                  <Icon icon="mdi:star" className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">
                    AI Powered
                  </span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                  <Icon icon="mdi:flash" className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-300 font-medium">
                    Instant
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-sm mb-6 max-w-md leading-relaxed">
                <span className="font-semibold text-[#FF6B00]">
                  Revolutionary AI technology
                </span>{" "}
                automatically identifies your food and calculates precise
                nutrition information in seconds!
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
                className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8B20] text-white rounded-xl hover:from-[#FF6B00]/90 hover:to-[#FF8B20]/90 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl shadow-lg font-semibold"
              >
                <div className="relative">
                  <Icon icon="mdi:camera" className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <Icon icon="mdi:plus" className="w-2 h-2 text-[#FF6B00]" />
                  </div>
                </div>
                <span>Upload Food Image</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </label>

              <button
                onClick={() => setManualInput(true)}
                className="mt-6 text-zinc-400 hover:text-[#FF6B00] text-sm underline transition-colors duration-200 flex items-center gap-1"
              >
                <Icon icon="mdi:keyboard" className="w-4 h-4" />
                Can't take a photo? Enter manually instead
              </button>
            </div>
          </div>

          {/* Enhanced Tips Section */}
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:lightbulb" className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-blue-300 font-semibold mb-3 text-lg">
                  🎯 Pro Tips for Best Results:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:lightbulb-on"
                      className="w-4 h-4 text-yellow-400"
                    />
                    <span className="text-blue-200 text-sm">
                      Good lighting is key
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:camera-enhance"
                      className="w-4 h-4 text-green-400"
                    />
                    <span className="text-blue-200 text-sm">
                      Clear, close-up shots
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:fullscreen"
                      className="w-4 h-4 text-purple-400"
                    />
                    <span className="text-blue-200 text-sm">
                      Show entire portion
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:image-filter-hdr"
                      className="w-4 h-4 text-orange-400"
                    />
                    <span className="text-blue-200 text-sm">
                      Avoid blurry images
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Preview or Manual Input */}
          {!manualInput ? (
            <div className="space-y-4">
              <div className="relative h-64 w-full bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50 shadow-lg">
                {previewUrl && (
                  <>
                    <Image
                      src={previewUrl}
                      alt="Food preview"
                      className="w-full h-full object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <AIImageScanner isScanning={isAnalyzing} />
                  </>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={resetToUpload}
                  className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 text-sm underline bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:refresh" className="w-4 h-4" />
                  Try Different Image
                </button>
                <button
                  onClick={clearImage}
                  className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 text-sm underline bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                  Cancel
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
              <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-800/30 rounded-xl border border-zinc-700/50 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white capitalize flex items-center gap-2">
                    <Icon icon="mdi:food" className="w-6 h-6 text-[#FF6B00]" />
                    {analysis.foodName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-5 h-5 text-green-400"
                    />
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        analysis.confidence > 0.8
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : analysis.confidence > 0.6
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}
                    >
                      {analysis.confidence > 0.8
                        ? "High Confidence"
                        : analysis.confidence > 0.6
                          ? "Good Confidence"
                          : "Medium Confidence"}
                    </span>
                  </div>
                </div>

                {analysis.description && (
                  <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                    {analysis.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm bg-zinc-700/30 rounded-lg p-3">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Icon icon="mdi:source-branch" className="w-4 h-4" />
                    Source: {analysis.brandName || "Generic"}
                  </span>
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Icon icon="mdi:scale" className="w-4 h-4" />
                    Base: {analysis.servingSize} {analysis.servingUnit}
                  </span>
                </div>

                {/* Show alternatives if available */}
                {analysis.alternatives && analysis.alternatives.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h5 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                      <Icon icon="mdi:lightbulb" className="w-4 h-4" />
                      Other possibilities:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.alternatives.slice(0, 3).map((alt, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                        >
                          {alt.name} ({Math.round(alt.confidence * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Serving Adjustment */}
              <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-800/30 rounded-xl border border-zinc-700/50 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <Icon icon="mdi:tune" className="w-5 h-5 text-[#FF6B00]" />
                    Adjust Portion Size
                  </h4>
                  <div className="flex items-center gap-3 bg-zinc-700/50 rounded-lg p-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        setAdjustedServings(
                          Math.max(0.25, adjustedServings - 0.25)
                        )
                      }
                      disabled={adjustedServings <= 0.25}
                      className="h-8 w-8 p-0 text-[#FF6B00] hover:bg-[#FF6B00]/20"
                    >
                      <Icon icon="mdi:minus" className="w-4 h-4" />
                    </Button>
                    <span className="text-white font-bold min-w-[4rem] text-center text-lg">
                      {adjustedServings}×
                    </span>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() =>
                        setAdjustedServings(adjustedServings + 0.25)
                      }
                      className="h-8 w-8 p-0 text-[#FF6B00] hover:bg-[#FF6B00]/20"
                    >
                      <Icon icon="mdi:plus" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm bg-zinc-700/30 rounded-lg p-3 flex items-center gap-2">
                  <Icon icon="mdi:scale-balance" className="w-4 h-4" />
                  Adjusted serving:{" "}
                  <span className="font-semibold text-white">
                    {adjustedAnalysis.servingSize.toFixed(1)}{" "}
                    {analysis.servingUnit}
                  </span>
                </p>
              </div>

              {/* Enhanced Nutrition Information */}
              <div className="bg-gradient-to-br from-zinc-800/60 to-zinc-800/30 rounded-xl border border-zinc-700/50 p-5 shadow-lg">
                <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:nutrition"
                    className="w-6 h-6 text-[#FF6B00]"
                  />
                  Nutrition Information
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-[#FF6B00]/20 to-[#FF8B20]/20 rounded-xl border border-[#FF6B00]/30 shadow-md">
                    <div className="text-[#FF6B00] font-bold text-xl mb-1">
                      {adjustedAnalysis.calories}
                    </div>
                    <div className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                      calories
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30 shadow-md">
                    <div className="text-blue-400 font-bold text-xl mb-1">
                      {adjustedAnalysis.proteins}g
                    </div>
                    <div className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                      protein
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30 shadow-md">
                    <div className="text-green-400 font-bold text-xl mb-1">
                      {adjustedAnalysis.carbs}g
                    </div>
                    <div className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                      carbs
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 shadow-md">
                    <div className="text-yellow-400 font-bold text-xl mb-1">
                      {adjustedAnalysis.fats}g
                    </div>
                    <div className="text-zinc-300 text-xs font-medium uppercase tracking-wide">
                      fat
                    </div>
                  </div>
                </div>

                {/* Additional nutrients */}
                {(analysis.fiber || analysis.sugar || analysis.sodium) && (
                  <div className="mt-6 pt-4 border-t border-zinc-700/50">
                    <h5 className="text-zinc-300 font-medium mb-3 flex items-center gap-2">
                      <Icon
                        icon="mdi:plus-circle"
                        className="w-4 h-4 text-zinc-400"
                      />
                      Additional Nutrients
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {analysis.fiber && (
                        <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                          <div className="text-purple-400 font-semibold text-lg">
                            {(analysis.fiber * adjustedServings).toFixed(1)}g
                          </div>
                          <div className="text-zinc-400 text-xs font-medium">
                            fiber
                          </div>
                        </div>
                      )}
                      {analysis.sugar && (
                        <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                          <div className="text-pink-400 font-semibold text-lg">
                            {(analysis.sugar * adjustedServings).toFixed(1)}g
                          </div>
                          <div className="text-zinc-400 text-xs font-medium">
                            sugar
                          </div>
                        </div>
                      )}
                      {analysis.sodium && (
                        <div className="text-center p-3 bg-zinc-700/30 rounded-lg">
                          <div className="text-red-400 font-semibold text-lg">
                            {Math.round(analysis.sodium * adjustedServings)}mg
                          </div>
                          <div className="text-zinc-400 text-xs font-medium">
                            sodium
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Instructions */}
              <div className="text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon
                    icon="mdi:check-circle"
                    className="w-5 h-5 text-green-400"
                  />
                  <span className="text-green-400 font-semibold">
                    Ready to Save!
                  </span>
                </div>
                <p className="text-green-300 text-sm">
                  Click the "Save Meal" button below to add this food to your
                  meal
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:alert"
                  className="w-5 h-5 text-red-400 mt-0.5"
                />
                <div className="flex-1">
                  <h5 className="text-red-400 font-semibold mb-1">
                    Analysis Failed
                  </h5>
                  <p className="text-red-300 text-sm mb-3">{error}</p>

                  <div className="flex flex-wrap gap-2">
                    {error.includes("manual input") && !manualInput && (
                      <button
                        onClick={() => setManualInput(true)}
                        className="flex items-center gap-2 px-3 py-2 text-[#FF6B00] hover:text-[#FF6B00]/80 text-sm bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 rounded-lg border border-[#FF6B00]/30 transition-all duration-200"
                      >
                        <Icon icon="mdi:keyboard" className="w-4 h-4" />
                        Try Manual Input
                      </button>
                    )}

                    {selectedImage && (
                      <button
                        onClick={resetToUpload}
                        className="flex items-center gap-2 px-3 py-2 text-blue-400 hover:text-blue-300 text-sm bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/30 transition-all duration-200"
                      >
                        <Icon icon="mdi:camera-retake" className="w-4 h-4" />
                        Try Different Image
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
