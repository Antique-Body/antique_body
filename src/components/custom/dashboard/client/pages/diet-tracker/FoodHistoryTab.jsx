"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/common/Button";

export const FoodHistoryTab = ({
  mealName,
  onUseHistoryItem,
  onDeleteHistoryItem,
  isSubmitting = false,
  fetchHistoryFn,
}) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // Fetch history when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      let data;

      if (fetchHistoryFn) {
        // Use provided custom fetch function
        data = await fetchHistoryFn();
      } else {
        // Default fetch logic
        const mealType = mealName?.toLowerCase();
        const params = new URLSearchParams({ limit: "20" });
        if (mealType) {
          params.append("mealType", mealType);
        }
        const response = await fetch(
          `/api/users/client/diet-tracker/custom-meals?${params.toString()}`
        );
        const result = await response.json();
        data = result.success ? result.data : [];
      }

      setHistoryItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching food history:", error);
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [fetchHistoryFn, mealName]);

  const handleUseHistoryItem = async (item) => {
    try {
      await onUseHistoryItem(item);
    } catch (error) {
      console.error("Error using history item:", error);
    }
  };

  const handleDeleteHistoryItem = async (itemId) => {
    try {
      setDeletingItemId(itemId);
      setDeleteError(null);

      const success = await onDeleteHistoryItem(itemId);

      if (success) {
        // Update local state after successful deletion
        setHistoryItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        setDeleteError("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      setDeleteError("An error occurred while deleting. Please try again.");
    } finally {
      setDeletingItemId(null);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {mealName ? `Your ${mealName} History` : "Your Food History"}
        </h3>
        <span className="text-sm text-zinc-400">
          {historyItems.length} saved items
        </span>
      </div>

      {deleteError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:alert" className="w-4 h-4 text-red-400" />
            <p className="text-red-400 text-sm">{deleteError}</p>
          </div>
        </div>
      )}

      {historyLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-zinc-400">Loading history...</span>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="text-center py-8 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <Icon
            icon={
              mealName?.toLowerCase() === "snack"
                ? "mdi:food-apple"
                : "mdi:food"
            }
            className="w-12 h-12 text-zinc-500 mx-auto mb-3"
          />
          <h4 className="text-white font-medium mb-2">No History Yet</h4>
          <p className="text-zinc-400 text-sm mb-4">
            Create your first custom {mealName?.toLowerCase() || "food"} to
            start building your history.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-zinc-800/40 to-zinc-800/20 rounded-xl border border-zinc-700/40 p-4 hover:border-zinc-600/50 hover:from-zinc-800/60 hover:to-zinc-800/30 transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold text-sm truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-0.5 rounded-full font-medium">
                          {item.usageCount}x used
                        </span>
                        {item.mealType && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium capitalize">
                            {item.mealType}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-1 mb-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-1.5 ml-3">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleUseHistoryItem(item)}
                      disabled={isSubmitting}
                      className="h-8 px-3 text-xs bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 hover:bg-[#FF6B00]/20"
                    >
                      <Icon icon="mdi:check" className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Use</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      disabled={deletingItemId === item.id}
                      className={`h-8 px-2 ${
                        deletingItemId === item.id
                          ? "bg-red-500/20 text-red-300"
                          : "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                      }`}
                    >
                      {deletingItemId === item.id ? (
                        <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Icon icon="mdi:delete" className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Nutrition Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                    <div className="text-[#FF6B00] font-semibold text-sm">
                      {Math.round(item.calories)}
                    </div>
                    <div className="text-zinc-400 text-xs">cal</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                    <div className="text-blue-400 font-semibold text-sm">
                      {Math.round(item.protein)}g
                    </div>
                    <div className="text-zinc-400 text-xs">protein</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                    <div className="text-green-400 font-semibold text-sm">
                      {Math.round(item.carbs)}g
                    </div>
                    <div className="text-zinc-400 text-xs">carbs</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-700/20 rounded-lg border border-zinc-600/20">
                    <div className="text-yellow-400 font-semibold text-sm">
                      {Math.round(item.fat)}g
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
                      Last used {formatDate(item.lastUsed)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Icon icon="mdi:star" className="w-3 h-3" />
                    <span className="text-xs">Saved item</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
