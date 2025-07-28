"use client";

import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { Card, Modal, FormField, Button } from "@/components/common";

import { MealLibrarySelector } from "../../../../meals/components";
import { MealModal } from "../../../../meals/components/MealModal";

// Helper to check if a URL is a YouTube link
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
};

// Dietary preferences options
const DIETARY_PREFERENCES = [
  { id: "vegan", label: "Vegan", icon: "mdi:leaf", color: "text-green-400" },
  { id: "vegetarian", label: "Vegetarian", icon: "mdi:carrot", color: "text-green-500" },
  { id: "keto", label: "Keto", icon: "mdi:food-steak", color: "text-purple-400" },
  { id: "paleo", label: "Paleo", icon: "mdi:food-drumstick", color: "text-orange-400" },
  { id: "mediterranean", label: "Mediterranean", icon: "mdi:fish", color: "text-blue-400" },
  { id: "glutenFree", label: "Gluten Free", icon: "mdi:wheat-off", color: "text-yellow-400" },
  { id: "dairyFree", label: "Dairy Free", icon: "mdi:cow-off", color: "text-red-400" },
  { id: "lowCarb", label: "Low Carb", icon: "mdi:bread-slice-outline", color: "text-indigo-400" },
  { id: "highProtein", label: "High Protein", icon: "mdi:food-drumstick", color: "text-pink-400" },
  { id: "intermittentFasting", label: "Intermittent Fasting", icon: "mdi:clock", color: "text-cyan-400" },
];


export const MealPlanning = ({ data, onChange }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [showAddDayPopover, setShowAddDayPopover] = useState(false);
  const [showCopyDayModal, setShowCopyDayModal] = useState(false);
  const [showCopyMealModal, setShowCopyMealModal] = useState(false);
  const [showMealLibraryModal, setShowMealLibraryModal] = useState(false);
  const [activeMealIndex, setActiveMealIndex] = useState(null);
  const [activeMediaType, setActiveMediaType] = useState({});
  const [showMediaPreview, setShowMediaPreview] = useState(null);
  const [popoverPosition, setPopoverPosition] = useState({
    right: false,
    top: false,
  });
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const [showCreateMeal, setShowCreateMeal] = useState(false);
  const [subtitleExists, setSubtitleExists] = useState(false);
  const [lastCheckedSubtitleUrl, setLastCheckedSubtitleUrl] = useState("");
  const [error, setError] = useState("");
  const [expandedMeals, setExpandedMeals] = useState(new Set());
  const [expandedDays, setExpandedDays] = useState(new Set());

  // --- STATE for meal library pagination/search ---
  const [libraryMeals, setLibraryMeals] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryHasMore, setLibraryHasMore] = useState(true);
  const [libraryPage, setLibraryPage] = useState(1);
  const [librarySearch, setLibrarySearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [useStaticLibrary, setUseStaticLibrary] = useState(false); // Toggle between static and backend
  const searchTimeoutRef = useRef(null);

  const days = data.days || [];
  const selectedDay = days[selectedDayIndex];

  // Calculate popover position
  const calculatePopoverPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if popover would go off the right edge
    const wouldOverflowRight = buttonRect.left + 224 > viewportWidth - 20; // 224px = w-56

    // Check if popover would go off the bottom edge
    const wouldOverflowBottom = buttonRect.bottom + 200 > viewportHeight - 20; // estimated popover height

    setPopoverPosition({
      right: wouldOverflowRight,
      top: wouldOverflowBottom,
    });
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowAddDayPopover(false);
      }
    };

    if (showAddDayPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showAddDayPopover]);

  // Calculate position when opening popover
  const handleOpenPopover = () => {
    calculatePopoverPosition();
    setShowAddDayPopover(!showAddDayPopover);
  };

  const generateId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : uuidv4();

  const addDay = (copyFromIdx = null) => {
    if (days.length >= 30) return;

    let newMeals = [];
    if (copyFromIdx !== null && days[copyFromIdx]) {
      newMeals = structuredClone(days[copyFromIdx].meals);
    }

    const newDay = {
      id: uuidv4(),
      name: `Day ${days.length + 1}`,
      isRestDay: false,
      description: "",
      meals: newMeals,
    };

    const newDays = [...days, newDay];
    onChange({ days: newDays });
    const newDayIndex = days.length;
    setSelectedDayIndex(newDayIndex);
    setExpandedDays((prev) => new Set([...prev, newDayIndex]));
    setShowAddDayPopover(false);
    setShowCopyDayModal(false);
  };

  const addCheatDay = () => {
    if (days.length >= 30) return;

    const cheatDay = {
      id: uuidv4(),
      name: `Day ${days.length + 1}`,
      isRestDay: true,
      description: "Describe your cheat day (e.g. free meal, treat, etc.)",
      meals: [],
    };

    const newDays = [...days, cheatDay];
    onChange({ days: newDays });
    const newDayIndex = days.length;
    setSelectedDayIndex(newDayIndex);
    setExpandedDays((prev) => new Set([...prev, newDayIndex]));
    setShowAddDayPopover(false);
  };

  const deleteDay = (idx) => {
    const newDays = days
      .filter((_, i) => i !== idx)
      .map((day, index) => ({
        ...day,
        name: `Day ${index + 1}`,
      }));

    onChange({ days: newDays });

    // Clean up expanded days state
    setExpandedDays((prev) => {
      const newSet = new Set();
      prev.forEach((dayIndex) => {
        if (dayIndex < idx) {
          newSet.add(dayIndex);
        } else if (dayIndex > idx) {
          newSet.add(dayIndex - 1);
        }
      });
      return newSet;
    });

    // Clean up expanded meals state
    setExpandedMeals((prev) => {
      const newSet = new Set();
      prev.forEach((mealKey) => {
        const [dayIdx, mealIdx] = mealKey.split("-").map(Number);
        if (dayIdx < idx) {
          newSet.add(mealKey);
        } else if (dayIdx > idx) {
          newSet.add(`${dayIdx - 1}-${mealIdx}`);
        }
      });
      return newSet;
    });

    if (selectedDayIndex >= newDays.length) {
      setSelectedDayIndex(Math.max(0, newDays.length - 1));
    } else if (idx === selectedDayIndex) {
      setSelectedDayIndex(Math.max(0, selectedDayIndex - 1));
    }
  };

  const updateDay = (dayIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      [field]: value,
    };

    onChange({ days: updatedDays });
  };

  const addMeal = () => {
    if (!selectedDay) return;

    const newMeal = {
      id: generateId(),
      name: "New Meal",
      time: "",
      options: [], // Start with no options
    };

    updateDay(selectedDayIndex, "meals", [...selectedDay.meals, newMeal]);

    // Auto-expand the new meal and the day
    const newMealIndex = selectedDay.meals.length;
    setExpandedMeals(
      (prev) => new Set([...prev, `${selectedDayIndex}-${newMealIndex}`])
    );
    setExpandedDays((prev) => new Set([...prev, selectedDayIndex]));
  };

  const removeMeal = (mealIndex) => {
    if (!selectedDay) return;

    const updatedMeals = [...selectedDay.meals];
    updatedMeals.splice(mealIndex, 1);
    updateDay(selectedDayIndex, "meals", updatedMeals);

    // Remove from expanded meals and clean up
    setExpandedMeals((prev) => {
      const newSet = new Set();
      prev.forEach((mealKey) => {
        const [dayIdx, mealIdx] = mealKey.split("-").map(Number);
        if (dayIdx !== selectedDayIndex) {
          newSet.add(mealKey);
        } else if (mealIdx < mealIndex) {
          newSet.add(mealKey);
        } else if (mealIdx > mealIndex) {
          newSet.add(`${dayIdx}-${mealIdx - 1}`);
        }
      });
      return newSet;
    });
  };

  const updateMeal = (mealIndex, field, value) => {
    if (!selectedDay) return;

    const updatedMeals = [...selectedDay.meals];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      [field]: value,
    };

    updateDay(selectedDayIndex, "meals", updatedMeals);
  };

  const toggleMealExpansion = (mealIndex) => {
    const mealKey = `${selectedDayIndex}-${mealIndex}`;
    setExpandedMeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mealKey)) {
        newSet.delete(mealKey);
      } else {
        newSet.add(mealKey);
      }
      return newSet;
    });
  };

  const isMealExpanded = (mealIndex) =>
    expandedMeals.has(`${selectedDayIndex}-${mealIndex}`);

  const toggleDayExpansion = (dayIndex) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex);
      } else {
        newSet.add(dayIndex);
      }
      return newSet;
    });
  };

  const isDayExpanded = (dayIndex) => expandedDays.has(dayIndex);

  const handleVideoError = (videoUrl, _optionId) => {
    setError(
      `Failed to load video for meal option. Please check the video URL: ${videoUrl}`
    );
  };

  // Fetch meals from backend with pagination and search
  const fetchLibraryMeals = async ({
    page = 1,
    search = "",
    append = false,
  } = {}) => {
    if (append) {
      setLibraryLoading(true);
    } else {
      setSearchLoading(true);
    }

    try {
      const response = await fetch(
        `/api/users/trainer/meals?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=10`
      );
      const data = await response.json();
      if (data.success) {
        setLibraryMeals((prev) =>
          append ? [...prev, ...data.meals] : data.meals
        );
        setLibraryHasMore(data.pagination?.hasNextPage ?? false);
        setLibraryPage(page);
      } else {
        setLibraryHasMore(false);
        setLibraryMeals(append ? (prev) => prev : []);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      setLibraryHasMore(false);
      setLibraryMeals(append ? (prev) => prev : []);
    } finally {
      if (append) {
        setLibraryLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  };

  // Open modal and load first page
  const addMealFromLibrary = (mealIndex) => {
    setShowMealLibraryModal(true);
    setActiveMealIndex(mealIndex);
    setLibraryMeals([]);
    setLibraryPage(1);
    setLibrarySearch("");
    setLibraryHasMore(true);
    setSearchLoading(false);
    setLibraryLoading(false);
    fetchLibraryMeals({ page: 1, search: "", append: false });
  };

  // Handle search in modal with debounce
  const handleLibrarySearch = (value) => {
    setLibrarySearch(value);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      setLibraryPage(1);
      setLibraryHasMore(true);
      fetchLibraryMeals({ page: 1, search: value, append: false });
    }, 300); // 300ms debounce
  };

  // Handle scroll in modal
  const handleLibraryScroll = () => {
    if (!libraryLoading && libraryHasMore) {
      fetchLibraryMeals({
        page: libraryPage + 1,
        search: librarySearch,
        append: true,
      });
    }
  };

  // Cleanup timeout on unmount
  useEffect(
    () => () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    },
    []
  );

  const handleCreateMeal = async (mealData) => {
    try {
      const response = await fetch("/api/users/trainer/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      const result = await response.json();

      if (result.success) {
        const mealToAdd = {
          id: generateId(),
          name: mealData.name,
          description: mealData.recipe,
          ingredients: typeof mealData.ingredients === 'string' 
            ? mealData.ingredients.split(",").map((i) => i.trim())
            : mealData.ingredients,
          calories: mealData.calories,
          protein: mealData.protein,
          carbs: mealData.carbs,
          fat: mealData.fat,
          imageUrl: mealData.imageUrl,
          videoUrl: mealData.videoUrl,
          dietary: mealData.dietary || [],
        };

        const updatedMeals = [...selectedDay.meals];
        updatedMeals[activeMealIndex].options.push(mealToAdd);
        updateDay(selectedDayIndex, "meals", updatedMeals);

        // Auto-expand the day and meal
        setExpandedDays((prev) => new Set([...prev, selectedDayIndex]));
        setExpandedMeals(
          (prev) => new Set([...prev, `${selectedDayIndex}-${activeMealIndex}`])
        );

        setShowCreateMeal(false);
        setError("");
      } else {
        setError("Failed to create meal. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating meal:", error);
      setError(
        "An error occurred while creating the meal. Please try again later."
      );
    }
  };

  const removeMealOption = (mealIndex, optionIndex) => {
    if (!selectedDay) return;

    const updatedMeals = [...selectedDay.meals];
    updatedMeals[mealIndex].options.splice(optionIndex, 1);
    updateDay(selectedDayIndex, "meals", updatedMeals);
  };

  const handleSelectMealFromLibrary = async (libraryMeal) => {
    if (!selectedDay || activeMealIndex === null) return;

    const newMealOption = {
      id: generateId(),
      name: libraryMeal.name,
      description: libraryMeal.recipe,
      ingredients: typeof libraryMeal.ingredients === 'string' 
        ? libraryMeal.ingredients.split(",").map((i) => i.trim())
        : libraryMeal.ingredients,
      calories: libraryMeal.calories,
      protein: libraryMeal.protein,
      carbs: libraryMeal.carbs,
      fat: libraryMeal.fat,
      imageUrl: libraryMeal.imageUrl,
      videoUrl: libraryMeal.videoUrl,
      dietary: libraryMeal.dietary || [],
    };

    const updatedMeals = [...selectedDay.meals];
    updatedMeals[activeMealIndex].options.push(newMealOption);
    updateDay(selectedDayIndex, "meals", updatedMeals);

    // Auto-expand the day and meal
    setExpandedDays((prev) => new Set([...prev, selectedDayIndex]));
    setExpandedMeals(
      (prev) => new Set([...prev, `${selectedDayIndex}-${activeMealIndex}`])
    );

    setShowMealLibraryModal(false);
    setActiveMealIndex(null);
  };

  const copyDayFromAnother = (fromDayIdx) => {
    if (!days[fromDayIdx]) return;

    const dayToCopy = structuredClone(days[fromDayIdx]);
    dayToCopy.id = uuidv4();
    dayToCopy.name = `Day ${days.length + 1}`;

    // Regenerate IDs for meals and options
    dayToCopy.meals = dayToCopy.meals.map((meal) => ({
      ...meal,
      id: generateId(),
      options: meal.options.map((option) => ({
        ...option,
        id: generateId(),
      })),
    }));

    const newDays = [...days, dayToCopy];
    onChange({ days: newDays });
    const newDayIndex = days.length;
    setSelectedDayIndex(newDayIndex);
    setExpandedDays((prev) => new Set([...prev, newDayIndex]));

    // Auto-expand all meals in the copied day
    const newMealKeys = dayToCopy.meals.map(
      (_, mealIndex) => `${newDayIndex}-${mealIndex}`
    );
    setExpandedMeals((prev) => new Set([...prev, ...newMealKeys]));

    setShowCopyDayModal(false);
    setShowAddDayPopover(false);
  };

  const copyMealFromAnotherDay = (fromDayIdx, fromMealIdx) => {
    if (!selectedDay || !days[fromDayIdx]?.meals?.[fromMealIdx]) return;

    const mealToCopy = structuredClone(days[fromDayIdx].meals[fromMealIdx]);
    mealToCopy.id = generateId();

    updateDay(selectedDayIndex, "meals", [...selectedDay.meals, mealToCopy]);
    setExpandedDays((prev) => new Set([...prev, selectedDayIndex]));

    // Auto-expand the copied meal
    const newMealIndex = selectedDay.meals.length;
    setExpandedMeals(
      (prev) => new Set([...prev, `${selectedDayIndex}-${newMealIndex}`])
    );

    setShowCopyMealModal(false);
  };

  const updateMealOption = (mealIndex, optionIndex, field, value) => {
    if (!selectedDay) return;

    const updatedMeals = [...selectedDay.meals];
    updatedMeals[mealIndex].options[optionIndex] = {
      ...updatedMeals[mealIndex].options[optionIndex],
      [field]: value,
    };

    updateDay(selectedDayIndex, "meals", updatedMeals);
  };

  useEffect(() => {
    if (
      showMediaPreview &&
      showMediaPreview.type === "video" &&
      showMediaPreview.url
    ) {
      const vttUrl = showMediaPreview.url.replace(/\.[^/.]+$/, ".vtt");
      if (vttUrl !== lastCheckedSubtitleUrl) {
        setLastCheckedSubtitleUrl(vttUrl);
        fetch(vttUrl, { method: "HEAD" })
          .then((res) => setSubtitleExists(res.ok))
          .catch(() => setSubtitleExists(false));
      }
    } else {
      setSubtitleExists(false);
      setLastCheckedSubtitleUrl("");
    }
  }, [showMediaPreview, lastCheckedSubtitleUrl]);

  // Auto-expand selected day
  useEffect(() => {
    if (selectedDayIndex !== null) {
      setExpandedDays((prev) => new Set([...prev, selectedDayIndex]));
    }
  }, [selectedDayIndex]);

  useEffect(() => {
    if (selectedDay && selectedDay.meals) {
      // Removed debug logs for meals and options
    }
  }, [selectedDay]);


  // Handle dietary preferences for individual meal options
  const toggleMealOptionDietaryPreference = (mealIndex, optionIndex, prefId) => {
    if (!selectedDay) return;

    const updatedMeals = [...selectedDay.meals];
    const currentDietary = updatedMeals[mealIndex].options[optionIndex].dietary || [];
    const isSelected = currentDietary.includes(prefId);
    
    const newDietary = isSelected 
      ? currentDietary.filter(id => id !== prefId)
      : [...currentDietary, prefId];
    
    updatedMeals[mealIndex].options[optionIndex] = {
      ...updatedMeals[mealIndex].options[optionIndex],
      dietary: newDietary,
    };

    updateDay(selectedDayIndex, "meals", updatedMeals);
  };

  if (!selectedDay) {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
            Meal Planning
          </h2>
          <p className="text-sm sm:text-base text-gray-400">
            Create daily meal plans for your nutrition program
          </p>
        </motion.div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            No days available. Please add a day first.
          </p>
          <Button variant="orangeFilled" onClick={() => addDay()}>
            Add First Day
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Meal Planning
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Create daily meal plans for your nutrition program
        </p>
      </motion.div>


      {/* Day Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[#1a1a1a] rounded-lg border border-[#333] p-3 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
            <Icon
              icon="mdi:calendar-month"
              className="w-4 h-4 text-[#FF6B00]"
            />
            Days Overview ({days.length}/30)
          </h3>
        </div>

        {/* Days Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3">
          {days.map((day, idx) => (
            <div key={day.id || idx} className="relative group">
              <button
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm relative overflow-hidden ${
                  selectedDayIndex === idx
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white shadow-lg scale-105"
                    : "bg-[#222] text-gray-400 hover:text-white hover:bg-[#333] hover:scale-102"
                }`}
              >
                <div className="truncate">{day.name}</div>
                {day.isRestDay && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full" />
                )}
                {day.meals && day.meals.length > 0 && !day.isRestDay && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00] opacity-60" />
                )}
              </button>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDay(idx);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  title="Delete day"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Add Day Quick Button with Popover */}
          {days.length < 30 && (
            <div className="relative">
              <button
                type="button"
                ref={buttonRef}
                onClick={handleOpenPopover}
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border-2 border-dashed border-[#444] text-gray-500 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-all duration-200 text-xs sm:text-sm flex items-center justify-center group"
                title="Add new day"
              >
                <Icon
                  icon="mdi:plus"
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                />
              </button>

              {/* Add Day Popover */}
              <AnimatePresence>
                {showAddDayPopover && (
                  <motion.div
                    ref={popoverRef}
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                      y: popoverPosition.top ? 10 : -10,
                    }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      y: popoverPosition.top ? 10 : -10,
                    }}
                    transition={{ duration: 0.15 }}
                    className={`absolute z-50 w-56 bg-[#2a2a2a] border border-[#444] rounded-xl shadow-2xl overflow-hidden ${
                      popoverPosition.right ? "right-0" : "left-0"
                    } ${
                      popoverPosition.top ? "bottom-full mb-2" : "top-full mt-2"
                    }`}
                    style={{
                      // Ensure popover doesn't go beyond viewport on mobile
                      maxWidth: "calc(100vw - 2rem)",
                    }}
                  >
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => addDay()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-white hover:bg-[#FF6B00] rounded-lg transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/20 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="mdi:plus"
                            className="w-4 h-4 text-[#FF6B00] group-hover:text-white"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm">Add New Day</div>
                          <div className="text-xs text-gray-400 group-hover:text-white/80 truncate">
                            Create a blank day
                          </div>
                        </div>
                      </button>

                      {days.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowCopyDayModal(true);
                            setShowAddDayPopover(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-white hover:bg-[#FF6B00] rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Icon
                              icon="mdi:content-copy"
                              className="w-4 h-4 text-blue-400 group-hover:text-white"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm">
                              Copy from Day
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-white/80 truncate">
                              Duplicate existing day
                            </div>
                          </div>
                        </button>
                      )}

                      <div className="border-t border-[#444] mt-2 pt-2">
                        <button
                          type="button"
                          onClick={addCheatDay}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-white hover:bg-[#FF6B00] rounded-lg transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 group-hover:bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Icon
                              icon="mdi:food-variant"
                              className="w-4 h-4 text-green-400 group-hover:text-white"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm">
                              Add Cheat Day
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-white/80 truncate">
                              Free meal day
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Selected Day Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#222] rounded-xl border border-[#333] overflow-hidden"
      >
        {/* Day Header - Always Visible */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-[#2a2a2a] border-b border-[#444] gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => toggleDayExpansion(selectedDayIndex)}
              className="flex items-center gap-2 text-white hover:text-[#FF6B00] transition-colors w-full text-left py-2 -my-2 px-2 -mx-2 rounded-lg hover:bg-[#FF6B00]/10"
            >
              <Icon
                icon={
                  isDayExpanded(selectedDayIndex)
                    ? "mdi:chevron-down"
                    : "mdi:chevron-right"
                }
                className="w-6 h-6 transition-transform duration-200 flex-shrink-0"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon
                  icon="mdi:food"
                  className="w-5 h-5 text-[#FF6B00] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold truncate">
                    {selectedDay.name} - Meal Plan
                  </h3>
                  {selectedDay.isRestDay && (
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full inline-block mt-1">
                      Cheat Day
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
          {!selectedDay.isRestDay && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="orangeOutline"
                size="small"
                onClick={addMeal}
                leftIcon={<Icon icon="mdi:plus" className="w-4 h-4" />}
                className="flex-1 sm:flex-initial text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Add Meal</span>
                <span className="sm:hidden">Add Meal</span>
              </Button>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowCopyMealModal(true)}
                leftIcon={<Icon icon="mdi:content-copy" className="w-4 h-4" />}
                className="flex-1 sm:flex-initial text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Copy Meal</span>
                <span className="sm:hidden">Copy Meal</span>
              </Button>
            </div>
          )}
        </div>

        {/* Day Content - Collapsible */}
        <AnimatePresence>
          {isDayExpanded(selectedDayIndex) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                {selectedDay.isRestDay ? (
                  <div className="space-y-4">
                    <FormField
                      label="Cheat Day Description"
                      name="description"
                      type="textarea"
                      value={selectedDay.description}
                      onChange={(e) =>
                        updateDay(
                          selectedDayIndex,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe this cheat day (e.g. free meal, treat, etc.)"
                      rows={3}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDay.meals.length === 0 ? (
                      <div className="text-center py-8">
                        <Icon
                          icon="mdi:food-off"
                          className="w-12 h-12 text-gray-500 mx-auto mb-4"
                        />
                        <p className="text-gray-400 mb-4">No meals added yet</p>
                        <Button variant="orangeFilled" onClick={addMeal}>
                          Add First Meal
                        </Button>
                      </div>
                    ) : (
                      selectedDay.meals.map((meal, mealIndex) => (
                        <div
                          key={meal.id || mealIndex}
                          className="bg-[#242424] rounded-lg border border-[#444] overflow-hidden"
                        >
                          {/* Meal Header - Always Visible */}
                          <div className="flex items-center justify-between p-4 bg-[#2a2a2a] border-b border-[#444]">
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleMealExpansion(mealIndex)}
                                className="flex items-center gap-2 text-white hover:text-[#FF6B00] transition-colors w-full text-left py-2 -my-2 px-2 -mx-2 rounded-lg hover:bg-[#FF6B00]/10"
                              >
                                <Icon
                                  icon={
                                    isMealExpanded(mealIndex)
                                      ? "mdi:chevron-down"
                                      : "mdi:chevron-right"
                                  }
                                  className="w-5 h-5 transition-transform duration-200 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium truncate">
                                      {meal.name || "New Meal"}
                                    </span>
                                    {meal.time && (
                                      <span className="text-sm text-gray-400 flex-shrink-0">
                                        ({meal.time})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {meal.options && meal.options.length > 0 && (
                                <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-1 rounded-full flex-shrink-0">
                                  {meal.options.length} option
                                  {meal.options.length !== 1 ? "s" : ""}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeMeal(mealIndex)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                title="Remove meal"
                              >
                                <Icon
                                  icon="mdi:trash-can-outline"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                />
                              </button>
                            </div>
                          </div>

                          {/* Meal Content - Collapsible */}
                          <AnimatePresence>
                            {isMealExpanded(mealIndex) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 space-y-4">
                                  {/* Meal Details */}
                                  <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                                    <FormField
                                      label="Meal Name"
                                      name="name"
                                      value={meal.name}
                                      onChange={(e) =>
                                        updateMeal(
                                          mealIndex,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., Breakfast, Lunch, Dinner"
                                      className="flex-1"
                                    />
                                    <FormField
                                      label="Time"
                                      name="time"
                                      value={meal.time}
                                      onChange={(e) =>
                                        updateMeal(
                                          mealIndex,
                                          "time",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., 8:00 AM"
                                      className="w-full sm:w-32"
                                    />
                                  </div>

                                  {/* Meal Options */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-white">
                                        Options
                                      </h4>
                                    </div>

                                    {meal.options.length === 0 ? (
                                      <div className="text-center py-8 bg-[#2a2a2a] rounded-lg border border-[#444]">
                                        <Icon
                                          icon="mdi:food-off"
                                          className="w-12 h-12 text-gray-500 mx-auto mb-4"
                                        />
                                        <p className="text-gray-400 mb-2">
                                          No meal options added yet
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Add options from the library or create
                                          new ones
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="grid gap-4">
                                        {meal.options.map(
                                          (option, optionIndex) => {
                                            const activeMedia =
                                              activeMediaType[option.id] ||
                                              "image";

                                            return (
                                              <Card
                                                key={option.id || optionIndex}
                                                variant="dark"
                                                hover={true}
                                                hoverBorderColor="#666"
                                                borderColor="#555"
                                                padding="0"
                                                className="shadow-lg !p-0"
                                              >
                                                {/* Mobile Layout - Stacked */}
                                                <div className="block sm:hidden">
                                                  {/* Meal details on top */}
                                                  <div className="p-4">
                                                    <div className="flex items-start justify-between mb-4">
                                                      <FormField
                                                        label="Name"
                                                        name="name"
                                                        value={option.name}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "name",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter meal name"
                                                        className="flex-1 mr-2"
                                                      />
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          removeMealOption(
                                                            mealIndex,
                                                            optionIndex
                                                          )
                                                        }
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Remove option"
                                                      >
                                                        <Icon
                                                          icon="mdi:trash-can-outline"
                                                          className="w-4 h-4 sm:w-5 sm:h-5"
                                                        />
                                                      </button>
                                                    </div>

                                                    {/* Nutritional Info */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                                      <FormField
                                                        label="Calories"
                                                        name="calories"
                                                        type="number"
                                                        value={option.calories}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "calories",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="kcal"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Protein"
                                                        name="protein"
                                                        type="number"
                                                        value={option.protein}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "protein",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Carbs"
                                                        name="carbs"
                                                        type="number"
                                                        value={option.carbs}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "carbs",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Fat"
                                                        name="fat"
                                                        type="number"
                                                        value={option.fat}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "fat",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                    </div>

                                                    {/* Ingredients and Instructions */}
                                                    <div className="space-y-3">
                                                      <FormField
                                                        label="Ingredients"
                                                        name="ingredients"
                                                        type="textarea"
                                                        value={
                                                          Array.isArray(
                                                            option.ingredients
                                                          )
                                                            ? option.ingredients.join(
                                                                ", "
                                                              )
                                                            : option.ingredients
                                                        }
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "ingredients",
                                                            e.target.value
                                                              .split(",")
                                                              .map((i) =>
                                                                i.trim()
                                                              )
                                                          )
                                                        }
                                                        placeholder="Enter ingredients, separated by commas"
                                                        rows={2}
                                                      />
                                                      <FormField
                                                        label="Instructions"
                                                        name="description"
                                                        type="textarea"
                                                        value={
                                                          option.description
                                                        }
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "description",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter meal preparation instructions"
                                                        rows={2}
                                                      />

                                                      {/* Dietary Preferences for this meal option */}
                                                      <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                          Dietary Preferences
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                          {DIETARY_PREFERENCES.map((pref) => {
                                                            const isSelected = (option.dietary || []).includes(pref.id);
                                                            return (
                                                              <button
                                                                key={pref.id}
                                                                type="button"
                                                                onClick={() => toggleMealOptionDietaryPreference(mealIndex, optionIndex, pref.id)}
                                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                  isSelected
                                                                    ? "bg-[#FF6B00] text-white shadow-lg"
                                                                    : "bg-[#242424] text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                                                                }`}
                                                              >
                                                                <Icon icon={pref.icon} className={`w-4 h-4 ${isSelected ? "text-white" : pref.color}`} />
                                                                {pref.label}
                                                              </button>
                                                            );
                                                          })}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Media preview below */}
                                                  <div className="border-t border-[#555] bg-[#3a3a3a]/90">
                                                    {/* Media type selector */}
                                                    <div className="flex border-b border-[#555]">
                                                      <Button
                                                        variant="ghost"
                                                        size="small"
                                                        onClick={() =>
                                                          setActiveMediaType(
                                                            (prev) => ({
                                                              ...prev,
                                                              [option.id]:
                                                                "image",
                                                            })
                                                          )
                                                        }
                                                        className={`flex-1 rounded-none border-r border-[#555] ${
                                                          activeMedia ===
                                                          "image"
                                                            ? "bg-[#FF6B00]/30 text-[#FF6B00] border-[#FF6B00]/60"
                                                            : "text-gray-300 hover:text-white hover:bg-[#555]/70"
                                                        }`}
                                                        leftIcon={
                                                          <Icon
                                                            icon="mdi:image"
                                                            className="w-4 h-4"
                                                          />
                                                        }
                                                      >
                                                        Image
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="small"
                                                        onClick={() =>
                                                          setActiveMediaType(
                                                            (prev) => ({
                                                              ...prev,
                                                              [option.id]:
                                                                "video",
                                                            })
                                                          )
                                                        }
                                                        className={`flex-1 rounded-none ${
                                                          activeMedia ===
                                                          "video"
                                                            ? "bg-[#FF6B00]/30 text-[#FF6B00] border-[#FF6B00]/60"
                                                            : "text-gray-300 hover:text-white hover:bg-[#555]/70"
                                                        }`}
                                                        leftIcon={
                                                          <Icon
                                                            icon="mdi:video"
                                                            className="w-4 h-4"
                                                          />
                                                        }
                                                      >
                                                        Video
                                                      </Button>
                                                    </div>

                                                    {/* Media preview area */}
                                                    <div className="p-4">
                                                      {activeMedia ===
                                                      "image" ? (
                                                        option.imageUrl ? (
                                                          <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                              setShowMediaPreview(
                                                                {
                                                                  type: "image",
                                                                  url: option.imageUrl,
                                                                  name: option.name,
                                                                }
                                                              )
                                                            }
                                                            className="w-full h-48 p-0 relative rounded-lg overflow-hidden bg-black/40 hover:bg-black/50"
                                                          >
                                                            <Image
                                                              src={
                                                                option.imageUrl
                                                              }
                                                              alt={option.name}
                                                              className="object-cover w-full h-full"
                                                              width={1000}
                                                              height={1000}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                              <div className="bg-white/40 backdrop-blur-sm rounded-full p-3">
                                                                <Icon
                                                                  icon="mdi:magnify"
                                                                  className="w-6 h-6 text-white"
                                                                />
                                                              </div>
                                                            </div>
                                                          </Button>
                                                        ) : (
                                                          <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                                                            <div className="text-center py-8">
                                                              <Icon
                                                                icon="mdi:image-off"
                                                                className="w-12 h-12 mx-auto mb-3 text-gray-500"
                                                              />
                                                              <span className="text-sm text-gray-400">
                                                                No image
                                                                available
                                                              </span>
                                                            </div>
                                                          </div>
                                                        )
                                                      ) : option.videoUrl ? (
                                                        isYouTubeUrl(
                                                          option.videoUrl
                                                        ) ? (
                                                          <div className="relative w-full h-48 aspect-video">
                                                            <iframe
                                                              width="100%"
                                                              height="100%"
                                                              src={`https://www.youtube.com/embed/${
                                                                option.videoUrl
                                                                  .split(
                                                                    "v="
                                                                  )[1]
                                                                  ?.split(
                                                                    "&"
                                                                  )[0] ||
                                                                option.videoUrl.split(
                                                                  "youtu.be/"
                                                                )[1]
                                                              }`}
                                                              title={
                                                                option.name ||
                                                                "YouTube video player"
                                                              }
                                                              frameBorder="0"
                                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                              allowFullScreen
                                                              className="w-full h-full rounded-lg"
                                                            ></iframe>
                                                          </div>
                                                        ) : (
                                                          <div className="relative w-full h-48">
                                                            <video
                                                              src={
                                                                option.videoUrl
                                                              }
                                                              controls
                                                              autoPlay
                                                              className="w-full h-full rounded-lg"
                                                              onError={() => {
                                                                handleVideoError(
                                                                  option.videoUrl,
                                                                  option.id
                                                                );
                                                              }}
                                                              onLoadStart={() => {
                                                                // Video load started
                                                              }}
                                                              onLoadedData={() => {
                                                                // Video data loaded
                                                              }}
                                                              onPlay={() => {
                                                                // Video started playing
                                                              }}
                                                            >
                                                              {subtitleExists && (
                                                                <track
                                                                  kind="captions"
                                                                  src={option.videoUrl.replace(
                                                                    /\.[^/.]+$/,
                                                                    ".vtt"
                                                                  )}
                                                                  srcLang="en"
                                                                  label="English"
                                                                  default
                                                                />
                                                              )}
                                                              Your browser does
                                                              not support the
                                                              video tag.
                                                            </video>
                                                          </div>
                                                        )
                                                      ) : (
                                                        <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                                                          <div className="text-center py-8">
                                                            <Icon
                                                              icon="mdi:video-off"
                                                              className="w-12 h-12 mx-auto mb-3 text-gray-500"
                                                            />
                                                            <span className="text-sm text-gray-400">
                                                              No video available
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Desktop Layout - Side by side */}
                                                <div className="hidden sm:flex">
                                                  {/* Left side - Meal details */}
                                                  <div className="flex-1 p-4">
                                                    <div className="flex items-start justify-between mb-4">
                                                      <FormField
                                                        label="Name"
                                                        name="name"
                                                        value={option.name}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "name",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter meal name"
                                                        className="flex-1 mr-2"
                                                      />
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          removeMealOption(
                                                            mealIndex,
                                                            optionIndex
                                                          )
                                                        }
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Remove option"
                                                      >
                                                        <Icon
                                                          icon="mdi:trash-can-outline"
                                                          className="w-4 h-4 sm:w-5 sm:h-5"
                                                        />
                                                      </button>
                                                    </div>

                                                    {/* Nutritional Info */}
                                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                                      <FormField
                                                        label="Calories"
                                                        name="calories"
                                                        type="number"
                                                        value={option.calories}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "calories",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="kcal"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Protein"
                                                        name="protein"
                                                        type="number"
                                                        value={option.protein}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "protein",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Carbs"
                                                        name="carbs"
                                                        type="number"
                                                        value={option.carbs}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "carbs",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                      <FormField
                                                        label="Fat"
                                                        name="fat"
                                                        type="number"
                                                        value={option.fat}
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "fat",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="g"
                                                        className="text-center"
                                                      />
                                                    </div>

                                                    {/* Ingredients and Instructions */}
                                                    <div className="space-y-3">
                                                      <FormField
                                                        label="Ingredients"
                                                        name="ingredients"
                                                        type="textarea"
                                                        value={
                                                          Array.isArray(
                                                            option.ingredients
                                                          )
                                                            ? option.ingredients.join(
                                                                ", "
                                                              )
                                                            : option.ingredients
                                                        }
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "ingredients",
                                                            e.target.value
                                                              .split(",")
                                                              .map((i) =>
                                                                i.trim()
                                                              )
                                                          )
                                                        }
                                                        placeholder="Enter ingredients, separated by commas"
                                                        rows={2}
                                                      />
                                                      <FormField
                                                        label="Instructions"
                                                        name="description"
                                                        type="textarea"
                                                        value={
                                                          option.description
                                                        }
                                                        onChange={(e) =>
                                                          updateMealOption(
                                                            mealIndex,
                                                            optionIndex,
                                                            "description",
                                                            e.target.value
                                                          )
                                                        }
                                                        placeholder="Enter meal preparation instructions"
                                                        rows={2}
                                                      />

                                                      {/* Dietary Preferences for this meal option */}
                                                      <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                                          Dietary Preferences
                                                        </label>
                                                        <div className="flex flex-wrap gap-2">
                                                          {DIETARY_PREFERENCES.map((pref) => {
                                                            const isSelected = (option.dietary || []).includes(pref.id);
                                                            return (
                                                              <button
                                                                key={pref.id}
                                                                type="button"
                                                                onClick={() => toggleMealOptionDietaryPreference(mealIndex, optionIndex, pref.id)}
                                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                  isSelected
                                                                    ? "bg-[#FF6B00] text-white shadow-lg"
                                                                    : "bg-[#242424] text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                                                                }`}
                                                              >
                                                                <Icon icon={pref.icon} className={`w-4 h-4 ${isSelected ? "text-white" : pref.color}`} />
                                                                {pref.label}
                                                              </button>
                                                            );
                                                          })}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {/* Right side - Media preview */}
                                                  <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#555]/50 flex flex-col backdrop-blur-sm">
                                                    {/* Media type selector */}
                                                    <div className="flex p-2 gap-2 border-b border-[#555]/50">
                                                      <Button
                                                        variant="ghost"
                                                        size="small"
                                                        onClick={() =>
                                                          setActiveMediaType(
                                                            (prev) => ({
                                                              ...prev,
                                                              [option.id]:
                                                                "image",
                                                            })
                                                          )
                                                        }
                                                        className={`flex-1 rounded-xl py-2.5 px-4 transition-all duration-300 ${
                                                          activeMedia ===
                                                          "image"
                                                            ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                                        }`}
                                                        leftIcon={
                                                          <Icon
                                                            icon="mdi:image"
                                                            className="w-4 h-4 sm:w-5 sm:h-5"
                                                          />
                                                        }
                                                      >
                                                        <span className="text-sm font-medium">
                                                          Image
                                                        </span>
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="small"
                                                        onClick={() =>
                                                          setActiveMediaType(
                                                            (prev) => ({
                                                              ...prev,
                                                              [option.id]:
                                                                "video",
                                                            })
                                                          )
                                                        }
                                                        className={`flex-1 rounded-xl py-2.5 px-4 transition-all duration-300 ${
                                                          activeMedia ===
                                                          "video"
                                                            ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                                        }`}
                                                        leftIcon={
                                                          <Icon
                                                            icon="mdi:video"
                                                            className="w-4 h-4"
                                                          />
                                                        }
                                                      >
                                                        <span className="flex items-center justify-center gap-2">
                                                          Video
                                                        </span>
                                                      </Button>
                                                    </div>

                                                    {/* Media preview area */}
                                                    <div className="flex-1 p-4">
                                                      {activeMedia ===
                                                      "image" ? (
                                                        option.imageUrl ? (
                                                          <Button
                                                            variant="ghost"
                                                            onClick={() =>
                                                              setShowMediaPreview(
                                                                {
                                                                  type: "image",
                                                                  url: option.imageUrl,
                                                                  name: option.name,
                                                                }
                                                              )
                                                            }
                                                            className="w-full h-full p-0 relative rounded-lg overflow-hidden bg-black/40 hover:bg-black/50"
                                                          >
                                                            <Image
                                                              src={
                                                                option.imageUrl
                                                              }
                                                              alt={option.name}
                                                              className="object-cover"
                                                              width={1000}
                                                              height={1000}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                                                              <div className="bg-white/40 backdrop-blur-sm rounded-full p-3">
                                                                <Icon
                                                                  icon="mdi:magnify"
                                                                  className="w-6 h-6 text-white"
                                                                />
                                                              </div>
                                                            </div>
                                                          </Button>
                                                        ) : (
                                                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                                                            <div className="text-center py-8">
                                                              <Icon
                                                                icon="mdi:image-off"
                                                                className="w-12 h-12 mx-auto mb-3 text-gray-500"
                                                              />
                                                              <span className="text-sm text-gray-400">
                                                                No image
                                                                available
                                                              </span>
                                                            </div>
                                                          </div>
                                                        )
                                                      ) : option.videoUrl ? (
                                                        isYouTubeUrl(
                                                          option.videoUrl
                                                        ) ? (
                                                          <div className="relative w-full h-full aspect-video">
                                                            <iframe
                                                              width="100%"
                                                              height="100%"
                                                              src={`https://www.youtube.com/embed/${
                                                                option.videoUrl
                                                                  .split(
                                                                    "v="
                                                                  )[1]
                                                                  ?.split(
                                                                    "&"
                                                                  )[0] ||
                                                                option.videoUrl.split(
                                                                  "youtu.be/"
                                                                )[1]
                                                              }`}
                                                              title={
                                                                option.name ||
                                                                "YouTube video player"
                                                              }
                                                              frameBorder="0"
                                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                              allowFullScreen
                                                              className="w-full h-full rounded-lg"
                                                            ></iframe>
                                                          </div>
                                                        ) : (
                                                          <div className="relative w-full h-full">
                                                            <video
                                                              src={
                                                                option.videoUrl
                                                              }
                                                              controls
                                                              autoPlay
                                                              className="w-full h-full rounded-lg"
                                                              onError={() => {
                                                                handleVideoError(
                                                                  option.videoUrl,
                                                                  option.id
                                                                );
                                                              }}
                                                              onLoadStart={() => {
                                                                // Video load started
                                                              }}
                                                              onLoadedData={() => {
                                                                // Video data loaded
                                                              }}
                                                              onPlay={() => {
                                                                // Video started playing
                                                              }}
                                                            >
                                                              {subtitleExists && (
                                                                <track
                                                                  kind="captions"
                                                                  src={option.videoUrl.replace(
                                                                    /\.[^/.]+$/,
                                                                    ".vtt"
                                                                  )}
                                                                  srcLang="en"
                                                                  label="English"
                                                                  default
                                                                />
                                                              )}
                                                              Your browser does
                                                              not support the
                                                              video tag.
                                                            </video>
                                                          </div>
                                                        )
                                                      ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#4a4a4a] rounded-lg border-2 border-dashed border-[#666]">
                                                          <div className="text-center py-8">
                                                            <Icon
                                                              icon="mdi:video-off"
                                                              className="w-12 h-12 mx-auto mb-3 text-gray-500"
                                                            />
                                                            <span className="text-sm text-gray-400">
                                                              No video available
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </Card>
                                            );
                                          }
                                        )}
                                      </div>
                                    )}

                                    {/* Novi gumbi ispod kartica */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                      <Button
                                        variant="primary"
                                        onClick={() =>
                                          addMealFromLibrary(mealIndex)
                                        }
                                        className="w-full py-3 text-base font-semibold bg-[#FF6B00] hover:bg-[#FF6B00]/90 border-0"
                                        leftIcon={
                                          <Icon
                                            icon="mdi:library"
                                            className="w-5 h-5"
                                          />
                                        }
                                      >
                                        Add Option from Library
                                      </Button>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setActiveMealIndex(mealIndex);
                                          setShowCreateMeal(true);
                                        }}
                                        className="w-full py-3 text-base font-semibold border-2 border-green-400/60 text-green-300 hover:bg-green-500/20 hover:border-green-400/80 hover:text-green-200 backdrop-blur-sm"
                                        leftIcon={
                                          <Icon
                                            icon="mdi:plus-circle"
                                            className="w-5 h-5"
                                          />
                                        }
                                      >
                                        Create New Meal Option
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Copy Day Modal */}
      <Modal
        isOpen={showCopyDayModal}
        onClose={() => setShowCopyDayModal(false)}
        title="Copy Day"
        footerButtons={false}
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm mb-4">
            Select a day to copy its meal plan and structure
          </p>

          {days.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Icon
                icon="mdi:calendar-remove"
                className="w-12 h-12 mx-auto mb-3 opacity-50"
              />
              <p>No days available to copy</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {days.map((day, idx) => (
                <button
                  type="button"
                  key={day.id || idx}
                  onClick={() => copyDayFromAnother(idx)}
                  className="w-full text-left p-4 rounded-lg bg-[#222] hover:bg-[#FF6B00] transition-all duration-200 group border border-[#333] hover:border-[#FF6B00]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white group-hover:text-white">
                          {day.name}
                        </span>
                        {day.isRestDay && (
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                            Cheat Day
                          </span>
                        )}
                      </div>
                      {!day.isRestDay && (
                        <div className="text-sm text-gray-400 group-hover:text-white/80 mt-1">
                          {day.meals?.length || 0} meals
                        </div>
                      )}
                      {day.isRestDay && day.description && (
                        <div className="text-sm text-gray-400 group-hover:text-white/80 mt-1 truncate">
                          {day.description}
                        </div>
                      )}
                    </div>
                    <Icon
                      icon="mdi:content-copy"
                      className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Copy Meal Modal */}
      <Modal
        isOpen={showCopyMealModal}
        onClose={() => setShowCopyMealModal(false)}
        title="Copy Meal From Another Day"
        footerButtons={false}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-gray-400 text-sm mb-4">
            Select a meal from another day to copy to {selectedDay?.name}
          </p>

          {days.filter(
            (d, dIdx) =>
              dIdx !== selectedDayIndex && d.meals && d.meals.length > 0
          ).length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Icon
                icon="mdi:food-off"
                className="w-12 h-12 mx-auto mb-3 opacity-50"
              />
              <p>No meals to copy from other days</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {days.map((d, dIdx) =>
                dIdx !== selectedDayIndex && d.meals && d.meals.length > 0 ? (
                  <div key={d.id || dIdx} className="space-y-2">
                    <h4 className="font-medium text-white text-sm bg-[#333] px-3 py-2 rounded-lg">
                      {d.name}
                    </h4>
                    {d.meals.map((meal, mIdx) => (
                      <button
                        type="button"
                        key={meal.id || mIdx}
                        className="w-full text-left px-4 py-3 rounded-lg bg-[#222] text-white hover:bg-[#FF6B00] transition-all duration-200 border border-[#333] hover:border-[#FF6B00] group"
                        onClick={() => copyMealFromAnotherDay(dIdx, mIdx)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {meal.name}
                            </div>
                            {meal.time && (
                              <div className="text-xs text-gray-400 group-hover:text-white/80 mt-1">
                                {meal.time}
                              </div>
                            )}
                            {meal.options && meal.options.length > 0 && (
                              <div className="text-xs text-gray-400 group-hover:text-white/80">
                                {meal.options.length} option
                                {meal.options.length !== 1 ? "s" : ""}
                              </div>
                            )}
                          </div>
                          <Icon
                            icon="mdi:content-copy"
                            className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Add MealModal */}
      <MealModal
        isOpen={showCreateMeal}
        onClose={() => setShowCreateMeal(false)}
        mode="create"
        onSave={handleCreateMeal}
      />

      {/* Meal Library Modal */}
      <Modal
        isOpen={showMealLibraryModal}
        onClose={() => {
          setShowMealLibraryModal(false);
          setActiveMealIndex(null);
          setLibraryMeals([]);
          setLibrarySearch("");
          setLibraryPage(1);
          setLibraryHasMore(true);
          setSearchLoading(false);
          setUseStaticLibrary(false);
        }}
        title="Add Meal from Library"
        size="large"
        footerButtons={false}
        className="sm:max-w-4xl lg:max-w-6xl" // Increased width for laptops
      >
        <div className="w-full sm:w-[600px]">
          <MealLibrarySelector
            meals={libraryMeals}
            loading={libraryLoading}
            searchLoading={searchLoading}
            searchTerm={librarySearch}
            onSearch={handleLibrarySearch}
            onSelectMeal={handleSelectMealFromLibrary}
            onClose={() => {
              setShowMealLibraryModal(false);
              setActiveMealIndex(null);
              setLibraryMeals([]);
              setLibrarySearch("");
              setLibraryPage(1);
              setLibraryHasMore(true);
              setSearchLoading(false);
              setUseStaticLibrary(false);
            }}
            onScroll={handleLibraryScroll}
            hasMore={libraryHasMore}
            useStaticData={useStaticLibrary} // Use static data based on state
          />
        </div>
      </Modal>

      {/* Add Media Preview Modal */}
      <Modal
        isOpen={!!showMediaPreview}
        onClose={() => setShowMediaPreview(null)}
        title={showMediaPreview?.name || "Media Preview"}
        size="large"
      >
        {showMediaPreview &&
          (showMediaPreview.type === "image" ? (
            <Image
              src={showMediaPreview.url}
              alt={showMediaPreview.name || "Preview"}
              className="w-full h-auto rounded-lg"
              width={1000}
              height={1000}
            />
          ) : showMediaPreview.type === "video" &&
            showMediaPreview.url &&
            showMediaPreview.url !== "" ? (
            <video
              src={showMediaPreview.url}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            >
              {subtitleExists && (
                <track
                  kind="captions"
                  src={showMediaPreview.url.replace(/\.[^/.]+$/, ".vtt")}
                  srcLang="en"
                  label="English"
                  default
                />
              )}
            </video>
          ) : (
            <div className="text-center py-8">
              <Icon
                icon="mdi:file-question"
                className="w-12 h-12 text-gray-500 mx-auto mb-3"
              />
              <p className="text-gray-400">Media not available</p>
            </div>
          ))}
      </Modal>

      {/* Error Message */}
      {error && (
        <div className="p-3 mb-2 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
