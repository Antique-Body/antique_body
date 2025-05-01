"use client";

import { Button, ProgressBar, TextField } from "@components/common";
import { Card } from "@components/custom";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Constants
const UNIT_SYSTEMS = {
  METRIC: "metric",
  IMPERIAL: "imperial",
};

const BMI_CATEGORIES = {
  UNDERWEIGHT: { max: 18.5, label: "Underweight", color: "text-blue-400", gradientFrom: "from-blue-500", gradientTo: "to-blue-600" },
  NORMAL: { max: 25, label: "Normal weight", color: "text-green-400", gradientFrom: "from-green-500", gradientTo: "to-green-600" },
  OVERWEIGHT: { max: 30, label: "Overweight", color: "text-yellow-400", gradientFrom: "from-yellow-500", gradientTo: "to-yellow-600" },
  OBESE: { max: Infinity, label: "Obese", color: "text-red-400", gradientFrom: "from-red-500", gradientTo: "to-red-600" },
};

const CONVERSION_FACTORS = {
  WEIGHT: {
    IMPERIAL_TO_METRIC: 0.453592,
    METRIC_TO_IMPERIAL: 2.20462,
  },
  HEIGHT: {
    IMPERIAL_TO_METRIC: 2.54, // inches to cm
    METRIC_TO_IMPERIAL: 0.393701, // cm to inches
  },
};

// Validation constraints
const CONSTRAINTS = {
  METRIC: {
    weight: { min: 30, max: 300 },
    height: { min: 100, max: 250 },
  },
  IMPERIAL: {
    weight: { min: 66, max: 660 },
    height: { min: 3.3, max: 8.2 },
  }
};

// Helper functions
const getBmiCategory = (bmi) => {
  if (!bmi) return null;

  const bmiValue = parseFloat(bmi);
  for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
    if (bmiValue < category.max) {
      return category;
    }
  }
  
  return BMI_CATEGORIES.OBESE;
};

// Calculate BMI with the correct units
const calculateBmi = (weight, height, unitSystem) => {
  const weightInKg = unitSystem === UNIT_SYSTEMS.METRIC ? weight : weight * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC;
  
  // For metric: height is in cm, so divide by 100 to get meters
  // For imperial: height is in feet, convert to cm, then divide by 100 to get meters
  const heightInM = unitSystem === UNIT_SYSTEMS.METRIC ? 
    height / 100 : 
    (height * 30.48) / 100; // 1 foot = 30.48 cm
  
  return weightInKg / (heightInM * heightInM);
};

export const MeasurementsInput = ({ onSelect }) => {
  // State
  const [unitSystem, setUnitSystem] = useState(UNIT_SYSTEMS.METRIC);
  const [measurements, setMeasurements] = useState({
    weight: "",
    height: "",
    inches: "", // For imperial system only
  });
  const [errors, setErrors] = useState({
    weight: null,
    height: null,
    inches: null, // For imperial system only
  });
  const [touched, setTouched] = useState({
    weight: false,
    height: false,
    inches: false, // For imperial system only
  });
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Refs to track previous values
  const prevMeasurements = useRef(measurements);
  const prevUnitSystem = useRef(unitSystem);
  const prevTouched = useRef(touched);

  // Memoized constraints based on unit system
  const constraints = useMemo(() => 
    unitSystem === UNIT_SYSTEMS.METRIC ? 
      CONSTRAINTS.METRIC : 
      CONSTRAINTS.IMPERIAL, 
  [unitSystem]);

  // Event handlers
  const handleChange = useCallback((field, value) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleUnitChange = useCallback((system) => {
    if (system === unitSystem) return;
    
    setUnitSystem(system);
    
    // Convert values when switching units
    if (system === UNIT_SYSTEMS.METRIC) {
      // Convert from imperial to metric
      const weightInKg = measurements.weight ? 
        parseFloat(measurements.weight) * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC : "";
      
      // Convert from feet and inches to cm
      let heightInCm = "";
      if (measurements.height || measurements.inches) {
        const feet = parseFloat(measurements.height) || 0;
        const inches = parseFloat(measurements.inches) || 0;
        const totalInches = (feet * 12) + inches;
        heightInCm = totalInches * 2.54; // Convert inches to cm
      }
      
      setMeasurements({
        weight: weightInKg ? weightInKg.toFixed(1) : "",
        height: heightInCm ? heightInCm.toFixed(1) : "",
        inches: "", // Clear inches field
      });
    } else {
      // Convert from metric to imperial
      const weightInLbs = measurements.weight ? 
        parseFloat(measurements.weight) * CONVERSION_FACTORS.WEIGHT.METRIC_TO_IMPERIAL : "";
      
      // Convert from cm to feet and inches
      let feet = "";
      let inches = "";
      if (measurements.height) {
        const heightInInches = parseFloat(measurements.height) / 2.54; // Convert cm to inches
        feet = Math.floor(heightInInches / 12); // Get whole feet
        inches = (heightInInches % 12).toFixed(1); // Get remaining inches
      }
      
      setMeasurements({
        weight: weightInLbs ? weightInLbs.toFixed(1) : "",
        height: feet.toString(),
        inches: inches.toString(),
      });
    }

    // Clear errors when changing units
    setErrors({ weight: null, height: null, inches: null });
  }, [measurements, unitSystem]);

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
      measurements.height !== prevMeasurements.current.height ||
      measurements.inches !== prevMeasurements.current.inches;
    const unitSystemChanged = unitSystem !== prevUnitSystem.current;
    const touchedChanged = 
      touched.weight !== prevTouched.current.weight || 
      touched.height !== prevTouched.current.height ||
      touched.inches !== prevTouched.current.inches;

    if (!measurementsChanged && !unitSystemChanged && !touchedChanged) {
      return;
    }

    const weightValue = parseFloat(measurements.weight);
    
    let heightValue;
    if (unitSystem === UNIT_SYSTEMS.METRIC) {
      heightValue = parseFloat(measurements.height);
    } else {
      // For imperial, combine feet and inches
      const feet = parseFloat(measurements.height) || 0;
      const inches = parseFloat(measurements.inches) || 0;
      
      // Convert to decimal feet for BMI calculation
      heightValue = feet + (inches / 12);
    }

    const hasValidWeight = !isNaN(weightValue) && weightValue > 0 && 
                          weightValue >= constraints.weight.min && 
                          weightValue <= constraints.weight.max;
    
    let hasValidHeight;
    if (unitSystem === UNIT_SYSTEMS.METRIC) {
      hasValidHeight = !isNaN(heightValue) && heightValue > 0 && 
                       heightValue >= constraints.height.min && 
                       heightValue <= constraints.height.max;
    } else {
      // For imperial, feet should be between min and max, and inches should be 0-11
      const feet = parseFloat(measurements.height) || 0;
      const inches = parseFloat(measurements.inches) || 0;
      
      const validFeet = !isNaN(feet) && feet >= Math.floor(constraints.height.min) && 
                        feet <= Math.floor(constraints.height.max);
      const validInches = !isNaN(inches) && inches >= 0 && inches < 12;
      
      // Also check total height is within range
      const totalHeightInFeet = feet + (inches / 12);
      const withinRange = totalHeightInFeet >= constraints.height.min && 
                          totalHeightInFeet <= constraints.height.max;
      
      hasValidHeight = validFeet && validInches && withinRange;
    }

    const newErrors = {};
    if (touched.weight && !hasValidWeight) {
      newErrors.weight = `Please enter a valid weight between ${constraints.weight.min} and ${constraints.weight.max} ${unitSystem === UNIT_SYSTEMS.METRIC ? 'kg' : 'lb'}`;
    }
    
    if (unitSystem === UNIT_SYSTEMS.METRIC) {
      if (touched.height && !hasValidHeight) {
        newErrors.height = `Please enter a valid height between ${constraints.height.min} and ${constraints.height.max} cm`;
      }
    } else {
      // For imperial, validate feet and inches separately
      const feet = parseFloat(measurements.height);
      const inches = parseFloat(measurements.inches);
      
      if (touched.height && (isNaN(feet) || feet < Math.floor(constraints.height.min) || feet > Math.floor(constraints.height.max))) {
        newErrors.height = `Please enter a valid feet value between ${Math.floor(constraints.height.min)} and ${Math.floor(constraints.height.max)}`;
      }
      
      if (touched.inches && (isNaN(inches) || inches < 0 || inches >= 12)) {
        newErrors.inches = "Please enter a valid inches value between 0 and 11.9";
      }
      
      // Also check if the combined height is within range
      if (touched.height && touched.inches && hasValidHeight === false) {
        newErrors.height = `Total height must be between ${constraints.height.min} and ${constraints.height.max} feet`;
      }
    }

    setErrors(newErrors);
    const newIsValid = hasValidWeight && hasValidHeight;
    setIsValid(newIsValid);

    if (newIsValid) {
      const calculatedBmi = calculateBmi(weightValue, heightValue, unitSystem);
      const bmiValue = Number(calculatedBmi.toFixed(2));
      
      setBmi(bmiValue);
      setBmiCategory(getBmiCategory(bmiValue));

      // Always convert measurements to metric for the API
      const weightInKg = unitSystem === UNIT_SYSTEMS.METRIC ? 
        weightValue : 
        weightValue * CONVERSION_FACTORS.WEIGHT.IMPERIAL_TO_METRIC;
      
      // Convert height to cm for API
      let heightInCm;
      if (unitSystem === UNIT_SYSTEMS.METRIC) {
        heightInCm = heightValue;
      } else {
        // Convert height from feet and inches to cm
        const feet = parseFloat(measurements.height) || 0;
        const inches = parseFloat(measurements.inches) || 0;
        const totalInches = (feet * 12) + inches;
        heightInCm = totalInches * 2.54; // Convert inches to cm
      }

      // Only call onSelect if the values have actually changed
      const newMeasurements = {
        weight: parseFloat(weightInKg.toFixed(2)),
        height: parseFloat(heightInCm.toFixed(2)),
        bmi: bmiValue,
        isValid: newIsValid,
      };

      // Check if the new measurements are different from the previous ones
      const prevMeasurementsStr = JSON.stringify(prevMeasurements.current);
      const newMeasurementsStr = JSON.stringify(newMeasurements);
      
      if (prevMeasurementsStr !== newMeasurementsStr) {
        onSelect(newMeasurements);
      }
    } else {
      setBmi(null);
      setBmiCategory(null);
      // Only call onSelect with null if we previously had valid measurements
      if (prevMeasurements.current.isValid) {
        onSelect(null);
      }
    }

    // Update refs with current values
    prevMeasurements.current = { ...measurements, isValid: newIsValid };
    prevUnitSystem.current = unitSystem;
    prevTouched.current = touched;
  }, [measurements, unitSystem, touched, onSelect, constraints]);

  // Render BMI display
  const renderBmiDisplay = () => {
    if (!bmi || !bmiCategory) return null;
    
    return (
      <div className="mt-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#222]">
        <h3 className="text-lg font-semibold mb-2">Your BMI</h3>
        <div className="flex items-center justify-between mb-3">
          <div className="text-3xl font-bold">{bmi}</div>
          <div className={`text-lg font-medium ${bmiCategory.color}`}>
            {bmiCategory.label}
          </div>
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
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => handleUnitChange(UNIT_SYSTEMS.METRIC)}
          variant={unitSystem === UNIT_SYSTEMS.METRIC ? "primary" : "secondary"}
          className="min-w-[140px]">
          Metric (kg/cm)
        </Button>
        <Button
          onClick={() => handleUnitChange(UNIT_SYSTEMS.IMPERIAL)}
          variant={unitSystem === UNIT_SYSTEMS.IMPERIAL ? "primary" : "secondary"}
          className="min-w-[140px]">
          Imperial (lb/ft)
        </Button>
      </div>

      <Card width="100%" topBorderColor={false} borderTop={false}>
        <TextField
          id="weight-input"
          name="weight"
          label={`Weight (${unitSystem === UNIT_SYSTEMS.METRIC ? "kg" : "lb"})`}
          type="number"
          placeholder={`Enter your weight in ${
            unitSystem === UNIT_SYSTEMS.METRIC ? "kilograms" : "pounds"
          }`}
          value={measurements.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          onBlur={() => handleBlur("weight")}
          error={errors.weight}
          min={constraints.weight.min}
          max={constraints.weight.max}
          step={0.1}
          className="w-full mb-4"
        />

        {unitSystem === UNIT_SYSTEMS.METRIC ? (
          // Metric height input (single field for cm)
          <TextField
            id="height-input"
            name="height"
            label="Height (cm)"
            type="number"
            placeholder="Enter your height in centimeters"
            value={measurements.height}
            onChange={(e) => handleChange("height", e.target.value)}
            onBlur={() => handleBlur("height")}
            error={errors.height}
            min={constraints.height.min}
            max={constraints.height.max}
            step={0.1}
            className="w-full"
          />
        ) : (
          // Imperial height input (two fields for feet and inches)
          <div className="flex gap-4 w-full">
            <TextField
              id="feet-input"
              name="height"
              label="Height (feet)"
              type="number"
              placeholder="Feet"
              value={measurements.height}
              onChange={(e) => handleChange("height", e.target.value)}
              onBlur={() => handleBlur("height")}
              error={errors.height}
              min={Math.floor(constraints.height.min)}
              max={Math.floor(constraints.height.max)}
              step={1}
              className="w-full"
            />
            <TextField
              id="inches-input"
              name="inches"
              label="Inches"
              type="number"
              placeholder="Inches"
              value={measurements.inches}
              onChange={(e) => handleChange("inches", e.target.value)}
              onBlur={() => handleBlur("inches")}
              error={errors.inches}
              min={0}
              max={11.9}
              step={0.1}
              className="w-full"
            />
          </div>
        )}
      </Card>

      {renderBmiDisplay()}
    </div>
  );
};

export default MeasurementsInput;
