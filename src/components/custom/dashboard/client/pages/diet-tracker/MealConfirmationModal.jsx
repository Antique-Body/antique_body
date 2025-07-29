"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { Modal } from "@/components/common/Modal";

export const MealConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  meal,
  option,
  mealTime,
}) => {
  const [adjustedNutrition, setAdjustedNutrition] = useState({
    calories: option?.calories || 0,
    protein: option?.protein || 0,
    carbs: option?.carbs || 0,
    fat: option?.fat || 0,
  });
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Update nutrition values when portion changes
  const updateNutrition = (multiplier) => {
    setPortionMultiplier(multiplier);
    setAdjustedNutrition({
      calories: Math.round((option?.calories || 0) * multiplier),
      protein: Math.round((option?.protein || 0) * multiplier * 10) / 10,
      carbs: Math.round((option?.carbs || 0) * multiplier * 10) / 10,
      fat: Math.round((option?.fat || 0) * multiplier * 10) / 10,
    });
  };

  const handleConfirm = async () => {
    if (!option) return;

    setIsSubmitting(true);
    try {
      const mealData = {
        ...option,
        calories: adjustedNutrition.calories,
        protein: adjustedNutrition.protein,
        carbs: adjustedNutrition.carbs,
        fat: adjustedNutrition.fat,
        portionMultiplier,
        notes: notes.trim() || undefined,
      };

      await onConfirm(meal, mealData);
      onClose();
    } catch (error) {
      console.error("Error confirming meal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMealDisplayName = (name) => {
    switch (name?.toLowerCase()) {
      case "breakfast":
        return "Doručak";
      case "lunch":
        return "Ručak";
      case "dinner":
        return "Večera";
      case "snack":
        return "Užina";
      default:
        return name || "Obrok";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold">Potvrdi obrok</span>
            <div className="text-sm text-zinc-400 font-normal">
              {getMealDisplayName(meal?.name)} • {formatTime(mealTime)}
            </div>
          </div>
        </div>
      }
      size="medium"
      primaryButtonText={isSubmitting ? "Dodavanje..." : "Potvrdi obrok"}
      primaryButtonAction={handleConfirm}
      primaryButtonDisabled={isSubmitting}
      secondaryButtonText="Otkaži"
      secondaryButtonAction={onClose}
    >
      <div className="space-y-6">
        {/* Meal Preview */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-start gap-4">
            {/* Image or Video Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
              {option?.imageUrl && (
                <img
                  src={option.imageUrl}
                  alt={option.name}
                  className="w-full h-full object-cover"
                />
              )}
              {option?.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center hover:bg-black/60 transition-colors"
                >
                  <Icon icon="mdi:play-circle" className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {option?.name}
                </h3>
                {option?.videoUrl && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all text-xs"
                  >
                    <Icon icon="mdi:video" className="w-3 h-3" />
                    Video
                  </button>
                )}
              </div>

              {option?.description && (
                <p className="text-zinc-400 text-sm mb-3">
                  {option.description}
                </p>
              )}
              {option?.ingredients && (
                <div className="mb-3">
                  <p className="text-zinc-300 text-xs font-medium mb-1">
                    Sastojci:
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {Array.isArray(option.ingredients)
                      ? option.ingredients.join(", ")
                      : option.ingredients}
                  </p>
                </div>
              )}
              {option?.recipe && (
                <div>
                  <p className="text-zinc-300 text-xs font-medium mb-1">
                    Priprema:
                  </p>
                  <p className="text-zinc-400 text-xs">
                    {option.recipe.length > 100
                      ? `${option.recipe.substring(0, 100)}...`
                      : option.recipe}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {showVideo && option?.videoUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setShowVideo(false)}
          >
            <div
              className="relative w-full max-w-4xl mx-4 bg-zinc-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-700">
                <h3 className="text-lg font-semibold text-white">
                  Kako pripremiti: {option.name}
                </h3>
                <button
                  onClick={() => setShowVideo(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={option.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={`Video: ${option.name}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Portion Control */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Količina obroka
          </label>
          <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm">Porcija:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    updateNutrition(Math.max(0.25, portionMultiplier - 0.25))
                  }
                  disabled={portionMultiplier <= 0.25}
                  className="w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:minus" className="w-4 h-4 text-white" />
                </button>

                <div className="px-4 py-2 bg-zinc-900/80 rounded-lg min-w-[80px] text-center">
                  <span className="text-white font-semibold">
                    {portionMultiplier}x
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateNutrition(portionMultiplier + 0.25)}
                  className="w-8 h-8 rounded-lg bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Quick portion buttons */}
            <div className="flex gap-2 mb-4">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((multiplier) => (
                <button
                  key={multiplier}
                  type="button"
                  onClick={() => updateNutrition(multiplier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    portionMultiplier === multiplier
                      ? "bg-green-500 text-white"
                      : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                  }`}
                >
                  {multiplier}x
                </button>
              ))}
            </div>

            {/* Nutrition Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-orange-400 font-bold text-lg">
                  {adjustedNutrition.calories}
                </div>
                <div className="text-zinc-400 text-xs">kalorije</div>
              </div>
              <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">
                  {adjustedNutrition.protein}g
                </div>
                <div className="text-zinc-400 text-xs">proteini</div>
              </div>
              <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-yellow-400 font-bold text-lg">
                  {adjustedNutrition.carbs}g
                </div>
                <div className="text-zinc-400 text-xs">ugljeni h.</div>
              </div>
              <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                <div className="text-green-400 font-bold text-lg">
                  {adjustedNutrition.fat}g
                </div>
                <div className="text-zinc-400 text-xs">masti</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Napomene (opciono)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dodaj napomenu o tome kako si pripremio obrok, šta si promijenio, itd..."
            className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder:text-zinc-500 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 focus:outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Confirmation Message */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon
              icon="mdi:information"
              className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-green-300 text-sm font-medium mb-1">
                Spreman za logovanje
              </p>
              <p className="text-green-400/80 text-xs">
                Click "Confirm Meal" to add this meal to your daily nutrition
                plan. You can always edit or delete the meal later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
