import { useState, useCallback } from "react";

export const useAIFoodAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [getAnalysisData, setGetAnalysisData] = useState(null);
  const [setManualInput, setSetManualInput] = useState(null);

  // Store the callbacks from FoodImageAnalyzer
  const handleOnAnalyze = useCallback((getDataFn, setManualInputFn) => {
    setGetAnalysisData(() => getDataFn);
    setSetManualInput(() => setManualInputFn);
  }, []);

  // Reset analysis state
  const handleCancel = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  // Analyze food using AI
  const analyzeFood = useCallback(async () => {
    if (!getAnalysisData) return;

    const analysisData = getAnalysisData();
    if (!analysisData) {
      setError("Please upload an image or enter food details manually");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/nutrition/analyze-food", {
        method: "POST",
        body: analysisData.formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("manual input")) {
          if (setManualInput) setManualInput(true);
          throw new Error(data.error);
        }
        throw new Error(data.error || "Failed to analyze image");
      }

      setAnalysis(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to analyze the image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [getAnalysisData, setManualInput]);

  return {
    analysis,
    error,
    isAnalyzing,
    handleOnAnalyze,
    handleCancel,
    analyzeFood,
    setError,
  };
};
