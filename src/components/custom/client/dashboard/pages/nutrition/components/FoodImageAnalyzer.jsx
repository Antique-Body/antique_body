import Image from "next/image";
import { useState } from "react";

import { AIImageScanner } from "./AIImageScanner";
import { MacroDistribution } from "./MacroDistribution";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { CameraIcon, CloseXIcon, InfoIcon, TrashIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
export const FoodImageAnalyzer = ({ onAddToMeal, dailyGoals, dailyMacros }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mealTime, setMealTime] = useState("");
    const [adjustedServings, setAdjustedServings] = useState(1);
    const [manualInput, setManualInput] = useState(false);
    const [manualFoodName, setManualFoodName] = useState("");
    const [manualServingSize, setManualServingSize] = useState("");
    const [manualServingUnit, setManualServingUnit] = useState("g");
    const [manualDescription, setManualDescription] = useState("");

    // For daily goals tracking
    const { calorieGoal = 2400, proteinGoal = 180, carbsGoal = 240, fatGoal = 80 } = dailyGoals || {};
    const {
        calories: consumedCalories = 0,
        protein: consumedProtein = 0,
        carbs: consumedCarbs = 0,
        fat: consumedFat = 0,
    } = dailyMacros || {};

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

    // Calculate percent of daily goals this food represents
    const goalPercentages = adjustedAnalysis
        ? {
              calories: Math.round((adjustedAnalysis.calories / calorieGoal) * 100),
              protein: Math.round((adjustedAnalysis.proteins / proteinGoal) * 100),
              carbs: Math.round((adjustedAnalysis.carbs / carbsGoal) * 100),
              fat: Math.round((adjustedAnalysis.fats / fatGoal) * 100),
          }
        : { calories: 0, protein: 0, carbs: 0, fat: 0 };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysis(null);
            setError(null);
            setAdjustedServings(1);
        }
    };

    const clearImage = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedImage(null);
        setPreviewUrl(null);
        setAnalysis(null);
        setError(null);
    };

    const analyzeImage = async () => {
        if (!selectedImage && !manualInput) return;

        setLoading(true);
        setError(null);

        try {
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

            const response = await fetch("/api/nutrition/analyze-food", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error?.includes("manual input")) {
                    setManualInput(true);
                    throw new Error(data.error);
                }
                throw new Error(data.error || "Failed to analyze image");
            }

            setAnalysis(data);
            // Auto-set to a default meal time based on current time
            const hour = new Date().getHours();
            if (hour < 11) setMealTime("Breakfast");
            else if (hour < 15) setMealTime("Lunch");
            else if (hour < 19) setMealTime("Dinner");
            else setMealTime("Snack");
        } catch (err) {
            setError(err.message || "Failed to analyze the image. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetAnalysis = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedImage(null);
        setPreviewUrl(null);
        setAnalysis(null);
        setError(null);
        setMealTime("");
        setAdjustedServings(1);
    };

    const addToMeals = () => {
        if (!adjustedAnalysis) return;

        const newItem = {
            id: Date.now(),
            name: adjustedAnalysis.foodName,
            amount: `${adjustedAnalysis.servingSize} ${adjustedAnalysis.servingUnit}`,
            calories: adjustedAnalysis.calories,
            protein: adjustedAnalysis.proteins,
            carbs: adjustedAnalysis.carbs,
            fat: adjustedAnalysis.fats,
            fiber: adjustedAnalysis.fiber || 0,
            image: previewUrl, // Save the image URL with the meal
        };

        onAddToMeal(newItem, mealTime);
        resetAnalysis();
    };

    // Helper function to render progress bars
    const renderProgressBar = (consumed, goal, value, label, color) => {
        const total = consumed + value;
        const consumedPercent = Math.round((consumed / goal) * 100);
        const thisItemPercent = Math.round((value / goal) * 100);
        
        // Define gradient based on color
        const getGradient = () => {
            switch(color) {
                case "bg-[#FF6B00]": return "bg-gradient-to-r from-[#FF5000] to-[#FF8000]";
                case "bg-blue-500": return "bg-gradient-to-r from-blue-600 to-blue-400";
                case "bg-green-500": return "bg-gradient-to-r from-green-600 to-green-400";
                case "bg-yellow-500": return "bg-gradient-to-r from-yellow-600 to-yellow-400";
                default: return color;
            }
        };

        return (
            <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`mr-2 h-3 w-3 rounded-full ${color}`}></div>
                        <span className="text-sm font-medium">{label}</span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">{total}</span>
                        <span className="text-gray-400">
                            /{goal} {label !== "Calories" ? "g" : ""}
                        </span>
                    </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#222] shadow-inner">
                    <div className="flex h-full">
                        {/* Already consumed */}
                        <div 
                            className={`h-full ${getGradient()} transition-all duration-500`} 
                            style={{ width: `${consumedPercent}%` }}
                        ></div>
                        
                        {/* This item's contribution */}
                        <div 
                            className={`h-full ${getGradient()} opacity-50 transition-all duration-500`} 
                            style={{ width: `${thisItemPercent}%` }}
                        >
                            {/* Pulse animation if this item contributes significantly */}
                            {thisItemPercent > 10 && (
                                <div className="h-full w-full animate-pulse bg-white opacity-20"></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card variant="darkStrong" width="100%" maxWidth="none">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Food Photo Analysis</h2>
                {(previewUrl || analysis) && (
                    <Button variant="ghost" size="small" className="p-1 hover:bg-transparent" onClick={resetAnalysis}>
                        <CloseXIcon />
                    </Button>
                )}
            </div>

            {!previewUrl && !manualInput ? (
                <Card variant="dark" width="100%" maxWidth="none" className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                            <CameraIcon size={32} className="text-[#FF6B00]" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">AI-Powered Food Analysis</h3>
                        <p className="mb-6 text-base text-gray-300">
                            Upload a food photo to automatically identify and calculate its nutritional content
                        </p>

                        <div className="bg-[rgba(30,30,30,0.7)] p-4 rounded-lg mb-6 text-left max-w-lg">
                            <h4 className="font-medium mb-2 flex items-center text-sm">
                                <InfoIcon size={16} className="mr-2 text-[#FF6B00]" />
                                How it works
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-gray-300 space-y-2">
                                <li>Take a clear photo of your food</li>
                                <li>Upload the image for AI analysis</li>
                                <li>Review the nutritional information</li>
                                <li>Add it to your meal log with one click</li>
                            </ol>
                        </div>

                        <FormField
                            label=""
                            type="file"
                            name="foodImage"
                            accept="image/*"
                            capture="environment"
                            onChange={handleImageUpload}
                            className="w-full max-w-xs"
                        />

                        <div className="flex items-center mt-4 text-xs text-gray-400">
                            <InfoIcon size={12} className="mr-1" />
                            <span>For best results, take a photo in good lighting with the food clearly visible</span>
                        </div>

                        <Button
                            variant="ghost"
                            className="mt-4 text-[#FF6B00] hover:text-[#FF6B00]/80"
                            onClick={() => setManualInput(true)}
                        >
                            Can't take a photo? Enter food manually
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card variant="dark" width="100%" maxWidth="none" className="overflow-hidden">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                        {/* Image Column */}
                        <div className="md:col-span-2">
                            {!manualInput && (
                                <div className="relative h-60 w-full overflow-hidden rounded-lg bg-black">
                                    {previewUrl && (
                                        <>
                                            <Image src={previewUrl} alt="Food preview" fill className="object-contain" />
                                            <AIImageScanner isScanning={loading} previewUrl={previewUrl} />
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="mt-4 flex justify-between">
                                {!analysis ? (
                                    <>
                                        {!manualInput ? (
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={clearImage}
                                                leftIcon={<TrashIcon size={14} />}
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => {
                                                    setManualInput(false);
                                                    setManualFoodName("");
                                                    setManualServingSize("");
                                                    setManualServingUnit("g");
                                                    setManualDescription("");
                                                }}
                                                leftIcon={<TrashIcon size={14} />}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button
                                            variant="orangeFilled"
                                            size="small"
                                            onClick={analyzeImage}
                                            disabled={loading || (manualInput && !manualFoodName)}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                                    Analyzing...
                                                </span>
                                            ) : manualInput ? (
                                                "Search Food"
                                            ) : (
                                                "Analyze Food"
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <div className="w-full">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-xl font-bold capitalize">{analysis.foodName}</h3>
                                            <div className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                                {analysis.confidence > 0.9 ? "High Confidence" : "Medium Confidence"}
                                            </div>
                                        </div>
                                        <p className="mb-2 text-sm text-gray-400">
                                            {analysis.description || "No description available"}
                                        </p>
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-medium">Source:</span>{" "}
                                                    {analysis.brandName || "Generic"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">
                                                    <span className="font-medium">Serving Size:</span> {analysis.servingSize}{" "}
                                                    {analysis.servingUnit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {manualInput && !analysis && (
                                <div className="mt-4 space-y-4">
                                    <FormField
                                        label="Food Name"
                                        type="text"
                                        value={manualFoodName}
                                        onChange={(e) => setManualFoodName(e.target.value)}
                                        placeholder="Enter food name (e.g., Cevapcici, Pizza, etc.)"
                                        className="w-full"
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            label="Serving Size"
                                            type="number"
                                            value={manualServingSize}
                                            onChange={(e) => setManualServingSize(e.target.value)}
                                            placeholder="Enter serving size"
                                            className="w-full"
                                            required
                                            min="0"
                                            step="0.1"
                                        />

                                        <FormField
                                            label="Serving Unit"
                                            type="select"
                                            value={manualServingUnit}
                                            onChange={(e) => setManualServingUnit(e.target.value)}
                                            className="w-full"
                                            required
                                            options={[
                                                { value: "g", label: "Grams (g)" },
                                                { value: "oz", label: "Ounces (oz)" },
                                                { value: "ml", label: "Milliliters (ml)" },
                                                { value: "cup", label: "Cups" },
                                                { value: "tbsp", label: "Tablespoons (tbsp)" },
                                                { value: "tsp", label: "Teaspoons (tsp)" },
                                                { value: "piece", label: "Piece" },
                                                { value: "slice", label: "Slice" },
                                                { value: "serving", label: "Serving" },
                                            ]}
                                        />
                                    </div>

                                    <FormField
                                        label="Description (Optional)"
                                        type="textarea"
                                        value={manualDescription}
                                        onChange={(e) => setManualDescription(e.target.value)}
                                        placeholder="Add any additional details about the food (e.g., preparation method, ingredients, etc.)"
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Nutrition Details Column */}
                        <div className="flex flex-col md:col-span-3">
                            {!analysis ? (
                                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                    {loading ? (
                                        <div className="flex flex-col items-center">
                                            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
                                            <p className="text-gray-300">Analyzing your food image...</p>
                                            <p className="mt-2 text-sm text-gray-400">
                                                This may take a few moments while we identify the food and calculate its
                                                nutritional content.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="mb-4 text-gray-300">
                                                Upload and analyze a food image to see detailed nutritional breakdown and how it
                                                fits into your daily goals
                                            </p>
                                            <div className="w-full rounded-lg bg-[rgba(40,40,40,0.5)] p-4">
                                                <p className="text-sm text-gray-400">Once analyzed, you'll see:</p>
                                                <ul className="mt-2 list-inside list-disc text-sm text-gray-400">
                                                    <li>Calories and macronutrients</li>
                                                    <li>How it fits into your daily goals</li>
                                                    <li>Detailed vitamin and mineral content</li>
                                                    <li>Ability to adjust portion size</li>
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col">
                                    {/* Adjust Servings */}
                                    <div className="mb-4 rounded-lg bg-[rgba(30,30,30,0.7)] p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="text-sm font-medium">Adjust Serving Size</p>
                                            <div className="flex items-center">
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setAdjustedServings(Math.max(0.5, adjustedServings - 0.5))}
                                                    disabled={adjustedServings <= 0.5}
                                                >
                                                    <span className="text-lg font-bold">-</span>
                                                </Button>
                                                <span className="mx-2 min-w-[3rem] text-center font-medium">
                                                    {adjustedServings.toFixed(1)}x
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => setAdjustedServings(adjustedServings + 0.5)}
                                                >
                                                    <span className="text-lg font-bold">+</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Nutrition Values */}
                                    <div className="mb-6 grid grid-cols-4 gap-2">
                                        <div className="rounded-lg bg-[rgba(255,107,0,0.15)] p-3 text-center">
                                            <p className="text-xs font-medium text-gray-400">Calories</p>
                                            <p className="text-lg font-bold text-[#FF6B00]">{adjustedAnalysis.calories}</p>
                                            <p className="text-xs text-[#FF6B00]">{goalPercentages.calories}% of goal</p>
                                        </div>
                                        <div className="rounded-lg bg-[rgba(59,130,246,0.15)] p-3 text-center">
                                            <p className="text-xs font-medium text-gray-400">Protein</p>
                                            <p className="text-lg font-bold text-blue-500">{adjustedAnalysis.proteins}g</p>
                                            <p className="text-xs text-blue-500">{goalPercentages.protein}% of goal</p>
                                        </div>
                                        <div className="rounded-lg bg-[rgba(34,197,94,0.15)] p-3 text-center">
                                            <p className="text-xs font-medium text-gray-400">Carbs</p>
                                            <p className="text-lg font-bold text-green-500">{adjustedAnalysis.carbs}g</p>
                                            <p className="text-xs text-green-500">{goalPercentages.carbs}% of goal</p>
                                        </div>
                                        <div className="rounded-lg bg-[rgba(234,179,8,0.15)] p-3 text-center">
                                            <p className="text-xs font-medium text-gray-400">Fat</p>
                                            <p className="text-lg font-bold text-yellow-500">{adjustedAnalysis.fats}g</p>
                                            <p className="text-xs text-yellow-500">{goalPercentages.fat}% of goal</p>
                                        </div>
                                    </div>

                                    {/* Macro Distribution */}
                                    <div className="mb-6">
                                        <h4 className="mb-2 text-sm font-medium flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-[#FF6B00]" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M229.86,77.86a6,6,0,0,0-6,6v50.55l-88-88V26a6,6,0,0,0-12,0V57.86l-51.13-51.13a6,6,0,0,0-8.49,8.49L115.76,66.73,24.16,142.77a6,6,0,0,0,7.4,9.46L123.9,77.65l88,88H162a6,6,0,0,0,0,12h67.89a6,6,0,0,0,6-6V83.86A6,6,0,0,0,229.86,77.86Z"></path>
                                            </svg>
                                            Macro Distribution for This Food
                                        </h4>
                                        <div className="p-3 bg-[#0f0f0f]/50 rounded-xl border border-[#272727] shadow-inner">
                                            <MacroDistribution
                                                protein={analysis.proteins * 4}
                                                carbs={analysis.carbs * 4}
                                                fat={analysis.fats * 9}
                                                size="small"
                                            />
                                        </div>
                                    </div>

                                    {/* Daily Goals Progress */}
                                    <div className="mb-6">
                                        <h4 className="mb-2 text-sm font-medium">Impact on Daily Targets</h4>
                                        {renderProgressBar(
                                            consumedCalories,
                                            calorieGoal,
                                            adjustedAnalysis.calories,
                                            "Calories",
                                            "bg-[#FF6B00]"
                                        )}
                                        {renderProgressBar(
                                            consumedProtein,
                                            proteinGoal,
                                            adjustedAnalysis.proteins,
                                            "Protein",
                                            "bg-blue-500"
                                        )}
                                        {renderProgressBar(
                                            consumedCarbs,
                                            carbsGoal,
                                            adjustedAnalysis.carbs,
                                            "Carbs",
                                            "bg-green-500"
                                        )}
                                        {renderProgressBar(consumedFat, fatGoal, adjustedAnalysis.fats, "Fat", "bg-yellow-500")}
                                    </div>

                                    {/* Additional Nutrition Info */}
                                    <div className="mb-6 rounded-lg bg-[rgba(30,30,30,0.7)] p-3">
                                        <h4 className="mb-2 text-sm font-medium">Additional Nutrition</h4>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Fiber:</span>
                                                <span>{adjustedAnalysis.fiber || 0}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Sugar:</span>
                                                <span>{adjustedAnalysis.sugar || 0}g</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Sodium:</span>
                                                <span>{adjustedAnalysis.sodium || 0}mg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Potassium:</span>
                                                <span>{adjustedAnalysis.potassium || 0}mg</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add to Meal Log */}
                                    <div className="mt-auto">
                                        <FormField
                                            label="Select Meal"
                                            type="select"
                                            value={mealTime}
                                            onChange={(e) => setMealTime(e.target.value)}
                                            className="mb-4"
                                            backgroundStyle="transparent"
                                            options={[
                                                { value: "Breakfast", label: "Breakfast" },
                                                { value: "Lunch", label: "Lunch" },
                                                { value: "Dinner", label: "Dinner" },
                                                { value: "Snack", label: "Snack" },
                                                { value: "Pre-Workout", label: "Pre-Workout" },
                                                { value: "Post-Workout", label: "Post-Workout" },
                                            ]}
                                        />

                                        <Button
                                            variant="orangeFilled"
                                            onClick={addToMeals}
                                            disabled={!mealTime}
                                            className="w-full"
                                        >
                                            Add to Meal Log
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-start rounded-lg bg-red-900/20 p-3 text-sm text-red-200">
                            <p className="mb-2 sm:mb-0">{error}</p>
                            {error.includes("manual input") && !manualInput && (
                                <Button
                                    variant="ghost"
                                    className="whitespace-nowrap pl-0 sm:pl-2 text-[#FF6B00] hover:text-[#FF6B00]/80"
                                    onClick={() => setManualInput(true)}
                                >
                                    Enter food manually instead
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
            )}
        </Card>
    );
};
