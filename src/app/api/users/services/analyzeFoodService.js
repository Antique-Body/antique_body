// services/analyzeFoodService.js

// Configuration constants
const HF_API_KEY = process.env.HF_API_KEY;
const USDA_API_KEY = process.env.USDA_API_KEY;
const NUTRITIONIX_APP_ID = process.env.NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = process.env.NUTRITIONIX_API_KEY;

// Best Hugging Face models for food recognition
const MODELS = {
  primary: "nateraw/food", // Specialized food classifier
  secondary: "google/vit-base-patch16-224", // Vision Transformer
  fallback: "microsoft/resnet-50", // ResNet for general classification
  food_specific: "Kaludi/food-category-classification-v2.0", // Another food-specific model
};

const NON_FOOD_KEYWORDS = [
  "person",
  "people",
  "human",
  "face",
  "hand",
  "finger",
  "body",
  "car",
  "truck",
  "vehicle",
  "building",
  "house",
  "furniture",
  "electronics",
  "phone",
  "computer",
  "laptop",
  "tablet",
  "camera",
  "television",
  "tv",
  "chair",
  "table",
  "desk",
  "bed",
  "sofa",
  "clothing",
  "shirt",
  "pants",
  "shoes",
  "animal",
  "pet",
  "dog",
  "cat",
  "bird",
  "plant",
  "tree",
  "flower",
  "book",
  "paper",
];

/**
 * Convert buffer to base64
 */
function bufferToBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

/**
 * Check if detected item is food
 */
function isFoodItem(label) {
  const lowerLabel = label.toLowerCase();

  // Filter out non-food items
  const isNonFood = NON_FOOD_KEYWORDS.some((keyword) =>
    lowerLabel.includes(keyword.toLowerCase())
  );

  if (isNonFood) return false;

  // Additional food validation
  const foodIndicators = [
    "food",
    "meal",
    "dish",
    "cooked",
    "fried",
    "baked",
    "grilled",
    "fresh",
    "organic",
    "raw",
    "steamed",
    "boiled",
    "roasted",
  ];

  const hasFoodIndicator = foodIndicators.some((indicator) =>
    lowerLabel.includes(indicator)
  );

  // If it has food indicators, it's likely food
  if (hasFoodIndicator) return true;

  // Common food categories that might not have indicators
  const foodCategories = [
    "meat",
    "chicken",
    "beef",
    "pork",
    "fish",
    "seafood",
    "vegetable",
    "fruit",
    "bread",
    "pasta",
    "rice",
    "grain",
    "dairy",
    "cheese",
    "milk",
    "yogurt",
    "egg",
    "nut",
    "soup",
    "salad",
    "sandwich",
    "burger",
    "pizza",
    "cake",
    "cookie",
    "dessert",
    "beverage",
    "drink",
    "juice",
    "coffee",
  ];

  return foodCategories.some(
    (category) => lowerLabel.includes(category) || category.includes(lowerLabel)
  );
}

/**
 * Clean and normalize food names
 */
function cleanFoodName(label) {
  return label
    .replace(/^(a |an |the |some |piece of |slice of |bowl of |plate of )/i, "")
    .replace(/(, cooked|, raw|, prepared|, ready to eat|, fresh)$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Analyze with specific Hugging Face model
 */
async function analyzeWithModel(base64Image, modelName, modelType) {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: base64Image,
          options: {
            wait_for_model: true,
            use_cache: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Model ${modelName} failed:`, errorText);
      return null;
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return null;
    }

    // Process results based on model type
    return processModelResults(results, modelType, modelName);
  } catch (error) {
    console.warn(`Model ${modelName} error:`, error.message);
    return null;
  }
}

/**
 * Process model results based on type
 */
function processModelResults(results, modelType, modelName) {
  const foodResults = results
    .filter((result) => isFoodItem(result.label))
    .map((result) => ({
      label: cleanFoodName(result.label),
      score: result.score,
      confidence: result.score,
    }))
    .sort((a, b) => b.score - a.score);

  if (foodResults.length === 0) {
    return null;
  }

  return {
    modelType,
    modelName,
    results: foodResults,
    topResult: foodResults[0],
  };
}

/**
 * Run multiple AI models for better accuracy
 */
async function runMultiModelAnalysis(base64Image) {
  const modelPromises = [
    analyzeWithModel(base64Image, MODELS.primary, "primary"),
    analyzeWithModel(base64Image, MODELS.food_specific, "food_specific"),
    analyzeWithModel(base64Image, MODELS.secondary, "secondary"),
  ];

  const results = await Promise.allSettled(modelPromises);

  return results
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);
}

/**
 * Select best result from multiple models
 */
function selectBestResult(analysisResults) {
  if (!analysisResults || analysisResults.length === 0) {
    return null;
  }

  // Weight different models
  const modelWeights = {
    primary: 1.0,
    food_specific: 0.9,
    secondary: 0.7,
  };

  // Combine results with weighted scoring
  const combinedResults = new Map();

  analysisResults.forEach((analysis) => {
    const weight = modelWeights[analysis.modelType] || 0.5;

    analysis.results.forEach((result) => {
      const key = result.label.toLowerCase();
      const weightedScore = result.score * weight;

      if (combinedResults.has(key)) {
        const existing = combinedResults.get(key);
        existing.totalScore += weightedScore;
        existing.count += 1;
        existing.maxScore = Math.max(existing.maxScore, result.score);
      } else {
        combinedResults.set(key, {
          label: result.label,
          totalScore: weightedScore,
          maxScore: result.score,
          count: 1,
        });
      }
    });
  });

  // Calculate final scores and sort
  const finalResults = Array.from(combinedResults.values())
    .map((item) => ({
      foodName: item.label,
      confidence:
        (item.totalScore / item.count) *
        Math.min(1.2, 1 + (item.count - 1) * 0.1), // Boost if multiple models agree
      maxConfidence: item.maxScore,
      agreementCount: item.count,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  if (finalResults.length === 0 || finalResults[0].confidence < 0.3) {
    return null;
  }

  const best = finalResults[0];
  const alternatives = finalResults.slice(1, 4); // Top 3 alternatives

  return {
    foodName: best.foodName,
    confidence: Math.min(0.99, best.confidence), // Cap at 99%
    modelUsed: "ensemble",
    alternatives: alternatives.map((alt) => ({
      name: alt.foodName,
      confidence: alt.confidence,
    })),
  };
}

/**
 * Extract nutrients from USDA data
 */
function extractUSDANutrients(food) {
  const nutrients = food.foodNutrients || [];
  const findNutrient = (ids) => {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      const nutrient = nutrients.find((n) => n.nutrientId === id);
      if (nutrient && nutrient.value) return nutrient.value;
    }
    return 0;
  };

  return {
    source: "USDA",
    confidence: 0.9,
    foodName: food.description,
    calories: Math.round(findNutrient([1008])), // Energy
    proteins: Number(findNutrient([1003]).toFixed(1)), // Protein
    carbs: Number(findNutrient([1005]).toFixed(1)), // Carbohydrates
    fats: Number(findNutrient([1004]).toFixed(1)), // Total lipid (fat)
    fiber: Number(findNutrient([1079]).toFixed(1)), // Fiber
    sugar: Number(findNutrient([2000]).toFixed(1)), // Total sugars
    sodium: Math.round(findNutrient([1093])), // Sodium
    potassium: Math.round(findNutrient([1092])), // Potassium
    servingSize: 100,
    servingUnit: "g",
    servingWeight: 100,
    brandName: food.brandName || "Generic",
    description: food.description || food.foodName,
  };
}

/**
 * Get USDA nutrition data
 */
async function getUSDANutrition(foodName) {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(foodName)}&pageSize=5&sortBy=score&dataType=Foundation,SR%20Legacy`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.foods || data.foods.length === 0) return null;

    // Find best match
    const bestMatch =
      data.foods.find((food) =>
        food.description.toLowerCase().includes(foodName.toLowerCase())
      ) || data.foods[0];

    return extractUSDANutrients(bestMatch);
  } catch (error) {
    console.warn("USDA API error:", error);
    return null;
  }
}

/**
 * Get Nutritionix data
 */
async function getNutritionixData(foodName) {
  try {
    const response = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        headers: {
          "x-app-id": NUTRITIONIX_APP_ID,
          "x-app-key": NUTRITIONIX_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `1 serving ${foodName}`,
          timezone: "US/Eastern",
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.foods || data.foods.length === 0) return null;

    const food = data.foods[0];
    return {
      source: "Nutritionix",
      confidence: 0.8,
      foodName: food.food_name,
      calories: Math.round(food.nf_calories || 0),
      proteins: Number((food.nf_protein || 0).toFixed(1)),
      carbs: Number((food.nf_total_carbohydrate || 0).toFixed(1)),
      fats: Number((food.nf_total_fat || 0).toFixed(1)),
      fiber: Number((food.nf_dietary_fiber || 0).toFixed(1)),
      sugar: Number((food.nf_sugars || 0).toFixed(1)),
      sodium: Math.round(food.nf_sodium || 0),
      potassium: Math.round(food.nf_potassium || 0),
      servingSize: food.serving_qty || 1,
      servingUnit: food.serving_unit || "serving",
      servingWeight: food.serving_weight_grams || 100,
      brandName: food.brand_name || "Generic",
      description: food.food_name,
    };
  } catch (error) {
    console.warn("Nutritionix API error:", error);
    return null;
  }
}

/**
 * Get OpenFoodFacts data
 */
async function getOpenFoodFactsData(foodName) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=5`
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.products || data.products.length === 0) return null;

    const product = data.products[0];
    const nutriments = product.nutriments || {};

    return {
      source: "OpenFoodFacts",
      confidence: 0.7,
      foodName: product.product_name || foodName,
      calories: Math.round(nutriments["energy-kcal_100g"] || 0),
      proteins: Number((nutriments.proteins_100g || 0).toFixed(1)),
      carbs: Number((nutriments.carbohydrates_100g || 0).toFixed(1)),
      fats: Number((nutriments.fat_100g || 0).toFixed(1)),
      fiber: Number((nutriments.fiber_100g || 0).toFixed(1)),
      sugar: Number((nutriments.sugars_100g || 0).toFixed(1)),
      sodium: Math.round((nutriments.sodium_100g || 0) * 1000), // Convert to mg
      potassium: Math.round(nutriments.potassium_100g || 0),
      servingSize: 100,
      servingUnit: "g",
      servingWeight: 100,
      brandName: product.brands || "Generic",
      description: product.product_name || foodName,
    };
  } catch (error) {
    console.warn("OpenFoodFacts API error:", error);
    return null;
  }
}

/**
 * Validate nutrition data ranges
 */
function validateNutritionData(data) {
  const checks = [
    data.calories >= 0 && data.calories <= 3000,
    data.proteins >= 0 && data.proteins <= 150,
    data.carbs >= 0 && data.carbs <= 300,
    data.fats >= 0 && data.fats <= 150,
    data.fiber >= 0 && data.fiber <= 100,
    data.sugar >= 0 && data.sugar <= 150,
    data.sodium >= 0 && data.sodium <= 10000,
    data.potassium >= 0 && data.potassium <= 5000,
  ];

  return checks.every((check) => check === true);
}

/**
 * Combine nutrition data from multiple sources
 */
function combineNutritionData(sources) {
  if (sources.length === 0) return null;

  // Sort by confidence
  sources.sort((a, b) => b.confidence - a.confidence);

  const primary = sources[0];
  const combined = { ...primary };

  // For each nutrient, use weighted average if multiple sources have values
  const nutrients = [
    "calories",
    "proteins",
    "carbs",
    "fats",
    "fiber",
    "sugar",
    "sodium",
    "potassium",
  ];

  nutrients.forEach((nutrient) => {
    const values = sources
      .filter((s) => s[nutrient] && s[nutrient] > 0)
      .map((s) => ({ value: s[nutrient], confidence: s.confidence }));

    if (values.length > 1) {
      const totalConfidence = values.reduce((sum, v) => sum + v.confidence, 0);
      const weightedValue = values.reduce(
        (sum, v) => sum + (v.value * v.confidence) / totalConfidence,
        0
      );
      combined[nutrient] =
        nutrient === "calories" ||
        nutrient === "sodium" ||
        nutrient === "potassium"
          ? Math.round(weightedValue)
          : Number(weightedValue.toFixed(1));
    }
  });

  // Validate nutrition data
  if (!validateNutritionData(combined)) {
    return null;
  }

  return combined;
}

/**
 * Get nutritional information from multiple sources
 */
async function getNutritionalInfo(foodName) {
  try {
    // Try multiple nutrition databases in parallel
    const nutritionPromises = [
      getUSDANutrition(foodName),
      getNutritionixData(foodName),
      getOpenFoodFactsData(foodName),
    ];

    const results = await Promise.allSettled(nutritionPromises);
    const validResults = results
      .filter((result) => result.status === "fulfilled" && result.value)
      .map((result) => result.value);

    if (validResults.length === 0) {
      return null;
    }

    // Combine and validate nutrition data
    return combineNutritionData(validResults);
  } catch (error) {
    console.error("Nutrition lookup error:", error);
    return null;
  }
}

/**
 * Process manual input
 */
async function processManualInput(manualData) {
  const { foodName, servingSize, servingUnit, description } = manualData;

  if (!foodName || !servingSize || !servingUnit) {
    throw new Error("Missing required manual input fields");
  }

  const nutritionData = await getNutritionalInfo(foodName);

  if (!nutritionData) {
    throw new Error("Could not find nutritional information for this food");
  }

  // Adjust for serving size
  const servingWeight = nutritionData.servingWeight;
  if (!servingWeight || servingWeight <= 0) {
    throw new Error(
      "Invalid serving weight data - cannot calculate serving ratio"
    );
  }

  const servingRatio = parseFloat(servingSize) / servingWeight;

  return {
    success: true,
    data: {
      foodName,
      confidence: 1.0,
      source: "manual_input",
      calories: Math.round(nutritionData.calories * servingRatio),
      proteins: Number((nutritionData.proteins * servingRatio).toFixed(1)),
      carbs: Number((nutritionData.carbs * servingRatio).toFixed(1)),
      fats: Number((nutritionData.fats * servingRatio).toFixed(1)),
      fiber: Number((nutritionData.fiber * servingRatio).toFixed(1)),
      sugar: Number((nutritionData.sugar * servingRatio).toFixed(1)),
      sodium: Math.round(nutritionData.sodium * servingRatio),
      potassium: Math.round(nutritionData.potassium * servingRatio),
      servingSize: parseFloat(servingSize),
      servingUnit,
      servingWeight: parseFloat(servingSize),
      brandName: nutritionData.brandName,
      description: description || nutritionData.description,
    },
  };
}

/**
 * Main food analysis method
 */
async function analyzeFood(imageBuffer, manualData = null) {
  try {
    // Handle manual input
    if (manualData?.isManual) {
      return await processManualInput(manualData);
    }

    // Validate image
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error("No image data provided");
    }

    // Convert to base64
    const base64Image = bufferToBase64(imageBuffer);

    // Run multiple models in parallel for better accuracy
    const analysisResults = await runMultiModelAnalysis(base64Image);

    // Process and validate results
    const bestResult = selectBestResult(analysisResults);

    if (!bestResult) {
      throw new Error("Could not identify food with sufficient confidence");
    }

    // Get nutritional information
    const nutritionData = await getNutritionalInfo(bestResult.foodName);

    if (!nutritionData) {
      throw new Error("Could not find nutritional information for this food");
    }

    return {
      success: true,
      data: {
        foodName: bestResult.foodName,
        confidence: bestResult.confidence,
        modelUsed: bestResult.modelUsed,
        alternatives: bestResult.alternatives,
        ...nutritionData,
      },
    };
  } catch (error) {
    console.error("Food analysis error:", error);
    return {
      success: false,
      error: error.message || "Failed to analyze food",
    };
  }
}

export const foodAnalysisService = {
  analyzeFood,
  getNutritionalInfo,
  processManualInput,
};
