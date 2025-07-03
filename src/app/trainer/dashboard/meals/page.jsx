"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import {
  MealCard,
  MealModal,
  MealFilters,
} from "@/components/custom/dashboard/trainer/pages/meals/components";
import { NoResults, Pagination } from "@/components/custom/shared";
import { useMeals } from "@/hooks";

/**
 * Displays and manages the trainer's meal library, providing filtering, pagination, and CRUD operations via a modal interface.
 *
 * Renders a responsive grid of meal cards with options to view, create, edit, and delete meals. Includes filter controls, pagination, and handles loading and error states. Meal details and editing are managed through a modal dialog.
 */
export default function MealsPage() {
  const {
    meals,
    loading,
    error,
    pagination,
    filters,
    fetchTrainerMealsWithFilters,
    updateFilters,
    changePage,
    clearFilters,
    createMeal,
    updateMeal,
    deleteMeal,
  } = useMeals();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  // Load meals data on component mount
  useEffect(() => {
    fetchTrainerMealsWithFilters();
  }, [fetchTrainerMealsWithFilters]);

  // Handle page change
  const handlePageChange = async (newPage) => {
    await changePage(newPage);
  };

  // Handle creating a new meal
  const handleCreateMeal = () => {
    setSelectedMeal(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleViewMeal = (meal) => {
    setSelectedMeal(meal);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveMeal = async (mealData) => {
    if (modalMode === "create") {
      const result = await createMeal(mealData);
      if (result.success) {
        setIsModalOpen(false);
      }
    } else if (modalMode === "edit") {
      const result = await updateMeal(mealData.id, mealData);
      if (result.success) {
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteMeal = async (mealId) => {
    const result = await deleteMeal(mealId);
    if (result.success) {
      setIsModalOpen(false);
    }
  };

  // Loading state
  if (loading && meals.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading meals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && meals.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Failed to load meals
          </p>
          <p className="mt-2 text-zinc-400">{error}</p>
          <Button
            variant="orangeFilled"
            size="large"
            className="h-12 w-[120px] mt-4"
            onClick={() => fetchTrainerMealsWithFilters()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[96rem] mx-auto px-4 py-6 relative">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Meal Library</h1>
        <Button
          variant="orangeFilled"
          size="large"
          className="h-12 flex items-center justify-center gap-2"
          onClick={handleCreateMeal}
        >
          <Icon icon="mdi:plus" width={20} height={20} />
          <span className="text-md text-nowrap font-medium">Create Meal</span>
        </Button>
      </div>

      {/* Filters */}
      <MealFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        totalMeals={pagination.total}
      />

      {/* Meal Cards or No Results */}
      <div className="min-h-[400px]">
        {meals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onView={() => handleViewMeal(meal)}
                onEdit={() => handleEditMeal(meal)}
                onDelete={handleDeleteMeal}
              />
            ))}
          </div>
        ) : (
          <NoResults
            onClearFilters={clearFilters}
            variant="orange"
            title="No meals match your criteria"
            message="We couldn't find any meals matching your current filters. Try adjusting your search criteria or clearing all filters."
          />
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.pages}
          onPageChange={handlePageChange}
          variant="orange"
        />
      )}

      {/* Meal Modal */}
      <MealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        meal={selectedMeal}
        onSave={handleSaveMeal}
        onDelete={handleDeleteMeal}
      />
    </div>
  );
}
