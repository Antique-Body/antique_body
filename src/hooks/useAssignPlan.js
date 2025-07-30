import { useState, useCallback } from "react";

/**
 * Hook for managing plan assignment to clients
 * Handles both training and nutrition plan assignments
 */
export const useAssignPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [assignType, setAssignType] = useState(null); // "training" or "nutrition"

  // Fetch available plans for assignment
  const fetchPlans = useCallback(async (type) => {
    try {
      setPlansLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/trainer/plans?type=${type}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }
      
      const data = await response.json();
      setPlans(data);
      return data;
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message);
      throw err;
    } finally {
      setPlansLoading(false);
    }
  }, []);

  // Assign training plan to client
  const assignTrainingPlan = useCallback(async (clientId, planId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/coaching-requests/${clientId}/assign-training-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: String(planId) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to assign training plan");
      }

      return data;
    } catch (err) {
      console.error("Error assigning training plan:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign nutrition plan to client
  const assignNutritionPlan = useCallback(async (clientId, planId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/coaching-requests/${clientId}/assign-nutrition-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: String(planId) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to assign nutrition plan");
      }

      return data;
    } catch (err) {
      console.error("Error assigning nutrition plan:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Replace existing training plan
  const replaceTrainingPlan = useCallback(async (clientId, planId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/coaching-requests/${clientId}/replace-training-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: String(planId) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to replace training plan");
      }

      return data;
    } catch (err) {
      console.error("Error replacing training plan:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Replace existing nutrition plan
  const replaceNutritionPlan = useCallback(async (clientId, planId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/coaching-requests/${clientId}/replace-nutrition-plan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: String(planId) }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to replace nutrition plan");
      }

      return data;
    } catch (err) {
      console.error("Error replacing nutrition plan:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic assign plan function that chooses the right method
  const assignPlan = useCallback(async (clientId, planId, type, shouldReplace = false) => {
    if (type === "training") {
      return shouldReplace 
        ? replaceTrainingPlan(clientId, planId)
        : assignTrainingPlan(clientId, planId);
    } else if (type === "nutrition") {
      return shouldReplace
        ? replaceNutritionPlan(clientId, planId)
        : assignNutritionPlan(clientId, planId);
    } else {
      throw new Error("Invalid plan type. Must be 'training' or 'nutrition'");
    }
  }, [assignTrainingPlan, assignNutritionPlan, replaceTrainingPlan, replaceNutritionPlan]);

  // Get assigned nutrition plans for a client
  const getAssignedNutritionPlans = useCallback(async (clientId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plans`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assigned nutrition plans");
      }

      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error("Error fetching assigned nutrition plans:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear selected plan
  const clearSelection = useCallback(() => {
    setSelectedPlan(null);
    setAssignType(null);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setPlans([]);
    setSelectedPlan(null);
    setAssignType(null);
    setError(null);
    setLoading(false);
    setPlansLoading(false);
  }, []);

  return {
    // State
    loading,
    error,
    plans,
    plansLoading,
    selectedPlan,
    assignType,

    // Actions
    fetchPlans,
    assignPlan,
    assignTrainingPlan,
    assignNutritionPlan,
    replaceTrainingPlan,
    replaceNutritionPlan,
    getAssignedNutritionPlans,

    // Setters
    setSelectedPlan,
    setAssignType,

    // Utils
    clearError,
    clearSelection,
    reset,
  };
};

export default useAssignPlan;