import { useState, useEffect, useCallback } from "react";

export function useTrainingPlan(id, planId) {
  const [plan, setPlan] = useState(null);
  const [lastSavedPlan, setLastSavedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSaveBar, setShowSaveBar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  // Check for unsaved changes
  useEffect(() => {
    if (!plan || !lastSavedPlan) return;
    const hasChanges = JSON.stringify(plan) !== JSON.stringify(lastSavedPlan);
    setShowSaveBar(hasChanges);
    setIsNavigationBlocked(hasChanges);
  }, [plan, lastSavedPlan]);

  // Navigation blocking effect
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isNavigationBlocked) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (isNavigationBlocked) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isNavigationBlocked]);

  // Fetch plan
  useEffect(() => {
    async function fetchPlan() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/coaching-requests/${id}/assigned-training-plans`
        );
        const data = await res.json();
        if (!res.ok || !data.success)
          throw new Error(data.error || "Failed to fetch plan");
        const assigned = data.data.find((p) => p.id === planId);
        if (!assigned) throw new Error("Plan not found");
        setPlan(assigned.planData);
        setLastSavedPlan(assigned.planData);
      } catch (err) {
        setError(err.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [id, planId]);

  // Enhanced navigation handler with save bar shake
  const handleNavigationAttempt = useCallback(
    (navigationFn) => {
      if (isNavigationBlocked) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800);
        return false;
      }
      navigationFn();
      return true;
    },
    [isNavigationBlocked]
  );

  // Method to trigger shake when navigation is blocked
  const triggerNavigationBlock = useCallback(() => {
    if (isNavigationBlocked) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
      return true; // Navigation was blocked
    }
    return false; // Navigation allowed
  }, [isNavigationBlocked]);

  // Safe navigation wrapper
  const safeNavigate = useCallback(
    (navigationCallback) => {
      if (isNavigationBlocked) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800);
        return false;
      }
      if (typeof navigationCallback === "function") {
        navigationCallback();
      }
      return true;
    },
    [isNavigationBlocked]
  );

  // Save handler
  const handleSavePlan = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(
        `/api/coaching-requests/${id}/assigned-training-plan/${planId}/edit`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planData: plan }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "Failed to save");
      setLastSavedPlan(plan);
      setShowSaveBar(false);
      setIsNavigationBlocked(false);
    } catch (err) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
      alert(err.message || "Failed to save plan");
    } finally {
      setIsSaving(false);
    }
  };

  // Discard handler
  const handleDiscardPlan = () => {
    setPlan(lastSavedPlan);
    setShowSaveBar(false);
    setIsNavigationBlocked(false);
  };

  // Method to update lastSavedPlan when workout is automatically saved
  // This prevents save bar from showing after automatic workout completion saves
  const updateLastSavedPlan = useCallback((newPlan) => {
    if (newPlan) {
      setLastSavedPlan(newPlan);
      setShowSaveBar(false);
      setIsNavigationBlocked(false);
    }
  }, []);

  // Plan modification functions
  const updateWarmupDescription = (dayIdx, value) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx ? { ...day, warmupDescription: value } : day
      ),
    }));
  };

  const addTrainingDay = (newDay) => {
    setPlan((prev) => ({
      ...prev,
      schedule: [...prev.schedule, newDay],
    }));
  };

  const updateDayDetails = (dayIdx, updates) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, idx) =>
        idx === dayIdx ? { ...day, ...updates } : day
      ),
    }));
  };

  const addExercise = (dayIdx, exercise) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                {
                  ...exercise,
                  sets: exercise.sets || 3,
                  reps: exercise.reps || 10,
                  rest: exercise.rest || 60,
                },
              ],
            }
          : day
      ),
    }));
  };

  const removeExercise = (dayIdx, exerciseIdx) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.filter(
                (_, eIdx) => eIdx !== exerciseIdx
              ),
            }
          : day
      ),
    }));
  };

  const replaceExercise = (dayIdx, exerciseIdx, newExercise) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx ? newExercise : exercise
              ),
            }
          : day
      ),
    }));
  };

  const updateExerciseParams = (dayIdx, exerciseIdx, field, value) => {
    setPlan((prev) => ({
      ...prev,
      schedule: prev.schedule.map((day, dIdx) =>
        dIdx === dayIdx
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIdx) =>
                eIdx === exerciseIdx
                  ? { ...exercise, [field]: value }
                  : exercise
              ),
            }
          : day
      ),
    }));
  };

  return {
    // State
    plan,
    setPlan,
    lastSavedPlan,
    loading,
    error,
    showSaveBar,
    isSaving,
    isShaking,
    isNavigationBlocked,

    // Actions
    handleSavePlan,
    handleDiscardPlan,
    handleNavigationAttempt,
    triggerNavigationBlock,
    safeNavigate,
    updateLastSavedPlan,
    updateWarmupDescription,
    addTrainingDay,
    updateDayDetails,
    addExercise,
    removeExercise,
    replaceExercise,
    updateExerciseParams,
  };
}
