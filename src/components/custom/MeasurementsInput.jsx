"use client";

import { Button, ProgressBar, TextField } from "@components/common";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

// Constants
const UNIT_SYSTEMS = {
  METRIC: "metric",
  IMPERIAL: "imperial",
};

const BMI_CATEGORIES = {
  UNDERWEIGHT: {
    max: 18.5,
    label: "Underweight",
    color: "text-blue-400",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
  },
  NORMAL: {
    max: 25,
    label: "Normal weight",
    color: "text-green-400",
    gradientFrom: "from-green-500",
    gradientTo: "to-green-600",
  },
  OVERWEIGHT: {
    max: 30,
    label: "Overweight",
    color: "text-yellow-400",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-600",
  },
  OBESE: {
    max: Infinity,
    label: "Obese",
    color: "text-red-400",
    gradientFrom: "from-red-500",
    gradientTo: "to-red-600",
  },
};

const CONVERSION_FACTORS = {
  WEIGHT: {
    IMPERIAL_TO_METRIC: 0.453592,
    METRIC_TO_IMPERIAL: 2.20462,
  },
  HEIGHT: {
    IMPERIAL_TO_METRIC: 2.54,
    METRIC_TO_IMPERIAL: 0.393701,
  },
};

// Helper functions
const getBmiCategory = bmi => {
  if (!bmi) return null;

  const bmiValue = parseFloat(bmi);
  for (const [_, category] of Object.entries(BMI_CATEGORIES)) {
    if (bmiValue < category.max) {
      return category;
    }
  }

  return BMI_CATEGORIES.OBESE;
};

const calculateBmi = (weight, height, unitSystem) => {
  const weightInKg =
    unitSystem === UNIT_SYSTEMS.METRIC ? weight : weight * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC;
  const heightInM =
    unitSystem === UNIT_SYSTEMS.METRIC ? height / 100 : (height * CONVERSION_FACTORS.HEIGHT.IMPERIAL_TO_METRIC) / 100;

  return weightInKg / (heightInM * heightInM);
};

const convertValue = (value, fromSystem, toSystem, type) => {
  if (!value) return "";

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "";

  if (fromSystem === toSystem) return value;

  if (type === "weight") {
    return fromSystem === UNIT_SYSTEMS.METRIC
      ? (numValue * CONVERSION_FACTORS.WEIGHT.METRIC_TO_IMPERIAL).toFixed(1)
      : (numValue * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC).toFixed(1);
  } else if (type === "height") {
    return fromSystem === UNIT_SYSTEMS.METRIC
      ? (numValue * CONVERSION_FACTORS.HEIGHT.METRIC_TO_IMPERIAL).toFixed(1)
      : (numValue * CONVERSION_FACTORS.HEIGHT.IMPERIAL_TO_METRIC).toFixed(1);
  }

  return value;
};

export const MeasurementsInput = ({ onSelect }) => {
  // State
  const [unitSystem, setUnitSystem] = useState(UNIT_SYSTEMS.METRIC);
  const [measurements, setMeasurements] = useState({
    weight: "",
    height: "",
  });
  const [errors, setErrors] = useState({
    weight: null,
    height: null,
  });
  const [touched, setTouched] = useState({
    weight: false,
    height: false,
  });
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState(null);

  // Refs to track previous values
  const prevMeasurements = useRef(measurements);
  const prevUnitSystem = useRef(unitSystem);
  const prevTouched = useRef(touched);

  // Memoized constraints based on unit system
  const constraints = useMemo(
    () => ({
      weight: unitSystem === UNIT_SYSTEMS.METRIC ? { min: 30, max: 300, step: 0.1 } : { min: 66, max: 660, step: 0.1 },
      height:
        unitSystem === UNIT_SYSTEMS.METRIC ? { min: 100, max: 250, step: 0.1 } : { min: 3.3, max: 8.2, step: 0.1 },
    }),
    [unitSystem],
  );

  // Event handlers
  const handleChange = useCallback((field, value) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback(field => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleUnitChange = useCallback(
    system => {
      setUnitSystem(system);

      // Convert values when switching units
      setMeasurements({
        weight: convertValue(measurements.weight, unitSystem, system, "weight"),
        height: convertValue(measurements.height, unitSystem, system, "height"),
      });

      // Clear errors when changing units
      setErrors({ weight: null, height: null });
    },
    [measurements, unitSystem],
  );

  // Calculate BMI progress value for the progress bar
  const getBmiProgressValue = useCallback(() => {
    if (!bmi) return 0;

    // BMI typically ranges from 15 to 40
    const minBmi = 15;
    const maxBmi = 40;
    const bmiValue = parseFloat(bmi);

    if (bmiValue < minBmi) return 0;
    if (bmiValue > maxBmi) return 100;

    return ((bmiValue - minBmi) / (maxBmi - minBmi)) * 100;
  }, [bmi]);

  // Validate measurements and calculate BMI
  useEffect(() => {
    // Check if any relevant values have changed
    const measurementsChanged =
      measurements.weight !== prevMeasurements.current.weight ||
      measurements.height !== prevMeasurements.current.height;
    const unitSystemChanged = unitSystem !== prevUnitSystem.current;
    const touchedChanged =
      touched.weight !== prevTouched.current.weight || touched.height !== prevTouched.current.height;

    if (!measurementsChanged && !unitSystemChanged && !touchedChanged) {
      return;
    }

    const weightValue = parseFloat(measurements.weight);
    const heightValue = parseFloat(measurements.height);

    const hasValidWeight = !isNaN(weightValue) && weightValue > 0;
    const hasValidHeight = !isNaN(heightValue) && heightValue > 0;

    const newErrors = {};
    if (touched.weight && !hasValidWeight) {
      newErrors.weight = "Please enter a valid weight";
    }
    if (touched.height && !hasValidHeight) {
      newErrors.height = "Please enter a valid height";
    }

    setErrors(newErrors);
    const newIsValid = hasValidWeight && hasValidHeight;

    if (newIsValid) {
      const calculatedBmi = calculateBmi(weightValue, heightValue, unitSystem);
      const bmiValue = Number(calculatedBmi.toFixed(2));

      setBmi(bmiValue);
      setBmiCategory(getBmiCategory(bmiValue));

      // Convert height back to cm for API
      const heightInCm =
        unitSystem === UNIT_SYSTEMS.METRIC
          ? heightValue
          : heightValue * CONVERSION_FACTORS.HEIGHT.IMPERIAL_TO_METRIC * 100;

      onSelect({
        weight:
          unitSystem === UNIT_SYSTEMS.METRIC ? weightValue : weightValue * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC,
        height: heightInCm,
        bmi: bmiValue,
        isValid: newIsValid,
      });
    } else {
      setBmi(null);
      setBmiCategory(null);
      onSelect(null);
    }

    // Update refs with current values
    prevMeasurements.current = measurements;
    prevUnitSystem.current = unitSystem;
    prevTouched.current = touched;
  }, [measurements, unitSystem, touched, onSelect]);

  // Render BMI display
  const renderBmiDisplay = () => {
    if (!bmi || !bmiCategory) return null;

    return (
      <div className="mt-6 rounded-lg border border-[#222] bg-[#0a0a0a] p-4">
        <h3 className="mb-2 text-lg font-semibold">Your BMI</h3>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-3xl font-bold">{bmi}</div>
          <div className={`text-lg font-medium ${bmiCategory.color}`}>{bmiCategory.label}</div>
        </div>

        <ProgressBar
          value={getBmiProgressValue()}
          maxValue={100}
          height="h-3"
          gradientFrom={bmiCategory.gradientFrom}
          gradientTo={bmiCategory.gradientTo}
          showPercentage={false}
          showValues={false}
          className="mb-2"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span>Underweight</span>
          <span>Normal</span>
          <span>Overweight</span>
          <span>Obese</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="mb-6 flex justify-center gap-4">
        <Button
          onClick={() => handleUnitChange(UNIT_SYSTEMS.METRIC)}
          variant={unitSystem === UNIT_SYSTEMS.METRIC ? "primary" : "secondary"}
          className="min-w-[140px]"
        >
          Metric (kg/cm)
        </Button>
        <Button
          onClick={() => handleUnitChange(UNIT_SYSTEMS.IMPERIAL)}
          variant={unitSystem === UNIT_SYSTEMS.IMPERIAL ? "primary" : "secondary"}
          className="min-w-[140px]"
        >
          Imperial (lb/ft)
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border border-[#222] bg-[#111] p-6 shadow-lg">
        <TextField
          id="weight-input"
          name="weight"
          label={`Weight (${unitSystem === UNIT_SYSTEMS.METRIC ? "kg" : "lb"})`}
          type="number"
          placeholder={`Enter your weight in ${unitSystem === UNIT_SYSTEMS.METRIC ? "kilograms" : "pounds"}`}
          value={measurements.weight}
          onChange={e => handleChange("weight", e.target.value)}
          onBlur={() => handleBlur("weight")}
          error={errors.weight}
          min={constraints.weight.min}
          max={constraints.weight.max}
          step={constraints.weight.step}
        />

        <TextField
          id="height-input"
          name="height"
          label={`Height (${unitSystem === UNIT_SYSTEMS.METRIC ? "cm" : "ft"})`}
          type="number"
          placeholder={`Enter your height in ${unitSystem === UNIT_SYSTEMS.METRIC ? "centimeters" : "feet"}`}
          value={measurements.height}
          onChange={e => handleChange("height", e.target.value)}
          onBlur={() => handleBlur("height")}
          error={errors.height}
          min={constraints.height.min}
          max={constraints.height.max}
          step={constraints.height.step}
        />
      </div>

      {renderBmiDisplay()}
    </div>
  );
};

export default MeasurementsInput;
