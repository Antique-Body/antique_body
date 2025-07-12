import { NextResponse } from "next/server";

// API Keys
const HF_API_KEY = "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";
const USDA_API_KEY = "FB0PddhzFxWrUI2mgAf4CGt7oHqIt3UHLyeVFl2k";
const NUTRITIONIX_APP_ID = "4224c603";
const NUTRITIONIX_API_KEY = "67bb3800d9e56c2b46d5b99aa15c809e";

// Common non-food items to filter out
const commonNonFoodItems = [
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
  "couch",
  "lamp",
  "light",
  "clothing",
  "shirt",
  "pants",
  "dress",
  "shoes",
  "hat",
  "jacket",
  "animal",
  "pet",
  "dog",
  "cat",
  "bird",
  "fish",
  "plant",
  "tree",
  "flower",
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const manualInput = formData.get("manualInput");
    const manualFoodName = formData.get("manualFoodName");
    const manualServingSize = formData.get("manualServingSize");
    const manualServingUnit = formData.get("manualServingUnit");
    const manualDescription = formData.get("manualDescription");

    // If manual input is provided, skip image analysis
    if (manualInput === "true" && manualFoodName) {
      // Validate required fields
      if (!manualServingSize || !manualServingUnit) {
        return NextResponse.json(
          { error: "Please provide both serving size and unit" },
          { status: 400 }
        );
      }

      // Try multiple databases for the best result
      const nutritionalInfo = await getBestNutritionalInfo(manualFoodName);

      if (!nutritionalInfo) {
        return NextResponse.json(
          {
            error:
              "Could not find nutritional information for this food in any database",
          },
          { status: 404 }
        );
      }

      // Override the serving size and unit with manual input
      nutritionalInfo.servingSize = parseFloat(manualServingSize);
      nutritionalInfo.servingUnit = manualServingUnit;
      if (manualDescription) {
        nutritionalInfo.description = manualDescription;
      }

      // Adjust nutritional values based on the new serving size
      const servingRatio =
        nutritionalInfo.servingSize / nutritionalInfo.servingWeight;
      nutritionalInfo.calories = Math.round(
        nutritionalInfo.calories * servingRatio
      );
      nutritionalInfo.proteins = +(
        nutritionalInfo.proteins * servingRatio
      ).toFixed(1);
      nutritionalInfo.carbs = +(nutritionalInfo.carbs * servingRatio).toFixed(
        1
      );
      nutritionalInfo.fats = +(nutritionalInfo.fats * servingRatio).toFixed(1);
      nutritionalInfo.fiber = +(nutritionalInfo.fiber * servingRatio).toFixed(
        1
      );
      nutritionalInfo.sugar = +(nutritionalInfo.sugar * servingRatio).toFixed(
        1
      );
      nutritionalInfo.sodium = Math.round(
        nutritionalInfo.sodium * servingRatio
      );
      nutritionalInfo.potassium = Math.round(
        nutritionalInfo.potassium * servingRatio
      );

      return NextResponse.json({
        foodName: manualFoodName,
        confidence: 1.0,
        ...nutritionalInfo,
      });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Try multiple AI models for better accuracy
    const [convnextResult, foodModelResult] = await Promise.all([
      analyzeWithConvNext(base64Image),
      analyzeWithFoodModel(base64Image),
    ]);

    // Combine results from both models
    const combinedResult = combineModelResults(convnextResult, foodModelResult);

    if (!combinedResult) {
      return NextResponse.json(
        {
          error:
            "Could not identify food with sufficient confidence. Please try again with a clearer food image or use manual input.",
        },
        { status: 400 }
      );
    }

    const { foodName, confidence } = combinedResult;

    const isLikelyNonFood = commonNonFoodItems.some((item) =>
      foodName.toLowerCase().includes(item.toLowerCase())
    );

    if (isLikelyNonFood) {
      return NextResponse.json(
        {
          error:
            "The image appears to contain a non-food item. Please provide a clear image of food or use manual input.",
        },
        { status: 400 }
      );
    }

    // Get detailed nutritional information from multiple sources
    const nutritionalInfo = await getBestNutritionalInfo(foodName);

    if (!nutritionalInfo) {
      return NextResponse.json(
        {
          error:
            "Could not find nutritional information for this food in any database. Please try manual input.",
        },
        { status: 404 }
      );
    }

    // Additional validation: check if the nutritional values make sense
    if (!isValidNutritionalInfo(nutritionalInfo)) {
      return NextResponse.json(
        {
          error:
            "The nutritional information seems incorrect. Please try manual input.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      foodName,
      confidence,
      ...nutritionalInfo,
    });
  } catch (error) {
    console.error("Error analyzing food:", error);
    return NextResponse.json(
      { error: "Failed to analyze food image. Please try manual input." },
      { status: 500 }
    );
  }
}

async function analyzeWithConvNext(base64Image) {
  try {
    // First try with Microsoft's ResNet model
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/resnet-50",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: base64Image,
        }),
      }
    );

    if (!response.ok) {
      console.error("ResNet API error:", await response.text());
      // If ResNet fails, try with nateraw/food model as fallback
      return await analyzeWithFallbackModel(base64Image);
    }
    return await response.json();
  } catch (error) {
    console.error("ResNet error:", error);
    // If ResNet fails, try with nateraw/food model as fallback
    return await analyzeWithFallbackModel(base64Image);
  }
}

async function analyzeWithFallbackModel(base64Image) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nateraw/food",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: base64Image,
        }),
      }
    );

    if (!response.ok) {
      console.error("Fallback model API error:", await response.text());
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Fallback model error:", error);
    return null;
  }
}

async function analyzeWithFoodModel(base64Image) {
  try {
    // Using a more specialized model for food recognition
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nateraw/food",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: base64Image,
        }),
      }
    );

    if (!response.ok) {
      console.error("Food Model API error:", await response.text());
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Food Model error:", error);
    return null;
  }
}

// Add meat-specific validation
function validateMeatType(foodName, confidence) {
  const meatTypes = {
    chicken: [
      "chicken",
      "poultry",
      "hen",
      "rooster",
      "breast",
      "thigh",
      "wing",
      "drumstick",
      "leg",
      "whole chicken",
    ],
    beef: [
      "beef",
      "steak",
      "cow",
      "burger",
      "patty",
      "ground beef",
      "ribeye",
      "sirloin",
      "tenderloin",
      "roast",
    ],
    pork: [
      "pork",
      "pig",
      "bacon",
      "ham",
      "sausage",
      "chop",
      "loin",
      "belly",
      "ribs",
      "shoulder",
    ],
    lamb: ["lamb", "mutton", "sheep", "lamb chop", "lamb leg", "lamb shoulder"],
    turkey: [
      "turkey",
      "turkey breast",
      "turkey thigh",
      "turkey leg",
      "turkey wing",
    ],
    fish: [
      "fish",
      "salmon",
      "tuna",
      "cod",
      "trout",
      "bass",
      "tilapia",
      "halibut",
      "mackerel",
      "sardine",
    ],
    seafood: [
      "shrimp",
      "prawn",
      "crab",
      "lobster",
      "mussel",
      "clam",
      "oyster",
      "scallop",
      "squid",
      "octopus",
    ],
  };

  // Check if the food name contains any meat-related terms
  const lowerFoodName = foodName.toLowerCase();
  let detectedMeatType = null;
  let meatConfidence = 0;
  let bestMatch = null;

  for (const [meatType, keywords] of Object.entries(meatTypes)) {
    const matches = keywords.filter((keyword) =>
      lowerFoodName.includes(keyword)
    );
    if (matches.length > 0) {
      const currentConfidence = matches.length / keywords.length;
      if (currentConfidence > meatConfidence) {
        meatConfidence = currentConfidence;
        detectedMeatType = meatType;
        bestMatch = matches[0];
      }
    }
  }

  // If we detected a meat type but the confidence is too low, return null
  if (detectedMeatType && meatConfidence < 0.2) {
    return null;
  }

  // If we have a good meat match, use the specific meat term
  if (bestMatch && meatConfidence > 0.3) {
    foodName = bestMatch;
  }

  return {
    foodName,
    confidence: confidence * (detectedMeatType ? 1.3 : 1), // Boost confidence more for meat matches
    meatType: detectedMeatType,
  };
}

function combineModelResults(convnextResult, foodModelResult) {
  if (!convnextResult && !foodModelResult) return null;

  // Combine and weight the results from both models
  const results = [];

  if (convnextResult) {
    // Filter out non-food items from convnext results
    const foodResults = convnextResult.filter((r) => {
      const label = r.label.toLowerCase();
      return !commonNonFoodItems.some((item) =>
        label.includes(item.toLowerCase())
      );
    });
    results.push(...foodResults.map((r) => ({ ...r, weight: 0.6 }))); // Give more weight to ResNet results
  }

  if (foodModelResult) {
    // Food model results get lower weight as fallback
    results.push(...foodModelResult.map((r) => ({ ...r, weight: 0.4 })));
  }

  // Group by label and combine scores
  const combined = results.reduce((acc, curr) => {
    if (!acc[curr.label]) {
      acc[curr.label] = { label: curr.label, score: 0, weight: 0 };
    }
    acc[curr.label].score += curr.score * curr.weight;
    acc[curr.label].weight += curr.weight;
    return acc;
  }, {});

  // Calculate weighted average and sort
  const finalResults = Object.values(combined)
    .map((r) => ({
      label: r.label,
      score: r.score / r.weight,
    }))
    .sort((a, b) => b.score - a.score);

  // Lower confidence threshold for better recognition
  if (finalResults.length === 0 || finalResults[0].score < 0.15) {
    return null;
  }

  // If we have multiple results, check the confidence gap
  if (finalResults.length > 1) {
    const topScore = finalResults[0].score;
    const secondScore = finalResults[1].score;

    // Very small gap requirement for better performance
    if (topScore - secondScore < 0.03) {
      return null;
    }
  }

  // Clean up the food name
  let foodName = finalResults[0].label;
  // Remove common prefixes/suffixes that might confuse the nutrition database
  foodName = foodName.replace(
    /^(a |an |the |some |piece of |slice of |bowl of |plate of )/i,
    ""
  );
  foodName = foodName.replace(
    /(, cooked|, raw|, prepared|, ready to eat)$/i,
    ""
  );

  // Validate meat type and adjust confidence
  const validatedResult = validateMeatType(foodName, finalResults[0].score);
  if (!validatedResult) {
    return null;
  }

  return {
    foodName: validatedResult.foodName,
    confidence: validatedResult.confidence,
    meatType: validatedResult.meatType,
  };
}

async function getBestNutritionalInfo(foodName) {
  try {
    // Try multiple databases in parallel
    const [usdaInfo, nutritionixInfo, openFoodFactsInfo] = await Promise.all([
      getUSDAInfo(foodName),
      getNutritionixInfo(foodName),
      getOpenFoodFactsInfo(foodName),
    ]);

    // Combine and select the best information
    const combinedInfo = combineNutritionalInfo(
      usdaInfo,
      nutritionixInfo,
      openFoodFactsInfo
    );
    return combinedInfo;
  } catch (error) {
    console.error("Error fetching nutritional info:", error);
    return null;
  }
}

async function getUSDAInfo(foodName) {
  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
        foodName
      )}&pageSize=1`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.foods || data.foods.length === 0) return null;

    const food = data.foods[0];
    const nutrients = food.foodNutrients;

    const findNutrient = (id) => {
      const nutrient = nutrients.find((n) => n.nutrientId === id);
      return nutrient ? nutrient.value : 0;
    };

    return {
      source: "USDA",
      confidence: 0.8,
      calories: findNutrient(1008),
      proteins: findNutrient(1003),
      carbs: findNutrient(1005),
      fats: findNutrient(1004),
      fiber: findNutrient(1079),
      sugar: findNutrient(2000),
      sodium: findNutrient(1093),
      servingSize: food.servingSize || 100,
      servingUnit: food.servingSizeUnit || "g",
      servingWeight: food.servingSize || 100,
      brandName: food.brandName || "Generic",
      description: food.description || foodName,
      // Additional nutrients
      saturatedFat: findNutrient(1258),
      cholesterol: findNutrient(1253),
      potassium: findNutrient(1092),
      vitaminA: findNutrient(1106),
      vitaminC: findNutrient(1162),
      calcium: findNutrient(1087),
      iron: findNutrient(1089),
      // More detailed nutrients
      magnesium: findNutrient(1090),
      zinc: findNutrient(1095),
      vitaminD: findNutrient(1114),
      vitaminE: findNutrient(1158),
      vitaminK: findNutrient(1185),
      thiamin: findNutrient(1165),
      riboflavin: findNutrient(1166),
      niacin: findNutrient(1167),
      vitaminB6: findNutrient(1175),
      folate: findNutrient(1177),
      vitaminB12: findNutrient(1178),
      phosphorus: findNutrient(1091),
      selenium: findNutrient(1103),
      copper: findNutrient(1098),
      manganese: findNutrient(1101),
      caffeine: findNutrient(1057),
      alcohol: findNutrient(1018),
      water: findNutrient(1051),
      ash: findNutrient(1007),
    };
  } catch (error) {
    console.error("Error fetching USDA info:", error);
    return null;
  }
}

async function getNutritionixInfo(foodName) {
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
          query: foodName,
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
      confidence: 0.7,
      calories: food.nf_calories || 0,
      proteins: food.nf_protein || 0,
      carbs: food.nf_total_carbohydrate || 0,
      fats: food.nf_total_fat || 0,
      fiber: food.nf_dietary_fiber || 0,
      sugar: food.nf_sugars || 0,
      sodium: food.nf_sodium || 0,
      servingSize: food.serving_qty || 1,
      servingUnit: food.serving_unit || "serving",
      servingWeight: food.serving_weight_grams || 0,
      brandName: food.brand_name || "Generic",
      description: food.food_name || foodName,
      saturatedFat: food.nf_saturated_fat || 0,
      cholesterol: food.nf_cholesterol || 0,
      potassium: food.nf_potassium || 0,
      vitaminA: food.full_nutrients?.find((n) => n.attr_id === 320)?.value || 0,
      vitaminC: food.full_nutrients?.find((n) => n.attr_id === 401)?.value || 0,
      calcium: food.full_nutrients?.find((n) => n.attr_id === 301)?.value || 0,
      iron: food.full_nutrients?.find((n) => n.attr_id === 303)?.value || 0,
    };
  } catch (error) {
    console.error("Error fetching Nutritionix info:", error);
    return null;
  }
}

async function getOpenFoodFactsInfo(foodName) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        foodName
      )}&search_simple=1&action=process&json=1`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.products || data.products.length === 0) return null;

    const product = data.products[0];
    const nutriments = product.nutriments || {};

    return {
      source: "OpenFoodFacts",
      confidence: 0.75,
      calories: nutriments["energy-kcal_100g"] || 0,
      proteins: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      fats: nutriments.fat_100g || 0,
      fiber: nutriments.fiber_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      sodium: (nutriments.sodium_100g || 0) * 1000, // Convert to mg
      servingSize: 100,
      servingUnit: "g",
      servingWeight: 100,
      brandName: product.brands || "Generic",
      description: product.product_name || foodName,
      saturatedFat: nutriments["saturated-fat_100g"] || 0,
      cholesterol: nutriments.cholesterol_100g || 0,
      potassium: nutriments.potassium_100g || 0,
      vitaminA: nutriments["vitamin-a_100g"] || 0,
      vitaminC: nutriments["vitamin-c_100g"] || 0,
      calcium: nutriments.calcium_100g || 0,
      iron: nutriments.iron_100g || 0,
      // Additional nutrients
      magnesium: nutriments.magnesium_100g || 0,
      zinc: nutriments.zinc_100g || 0,
      vitaminD: nutriments["vitamin-d_100g"] || 0,
      vitaminE: nutriments["vitamin-e_100g"] || 0,
      vitaminK: nutriments["vitamin-k_100g"] || 0,
      thiamin: nutriments["vitamin-b1_100g"] || 0,
      riboflavin: nutriments["vitamin-b2_100g"] || 0,
      niacin: nutriments["vitamin-b3_100g"] || 0,
      vitaminB6: nutriments["vitamin-b6_100g"] || 0,
      folate: nutriments["vitamin-b9_100g"] || 0,
      vitaminB12: nutriments["vitamin-b12_100g"] || 0,
      phosphorus: nutriments.phosphorus_100g || 0,
      selenium: nutriments.selenium_100g || 0,
      copper: nutriments.copper_100g || 0,
      manganese: nutriments.manganese_100g || 0,
      caffeine: nutriments.caffeine_100g || 0,
      alcohol: nutriments.alcohol_100g || 0,
      water: nutriments.water_100g || 0,
      ash: nutriments.ash_100g || 0,
    };
  } catch (error) {
    console.error("Error fetching OpenFoodFacts info:", error);
    return null;
  }
}

function combineNutritionalInfo(usdaInfo, nutritionixInfo, openFoodFactsInfo) {
  const sources = [usdaInfo, nutritionixInfo, openFoodFactsInfo].filter(
    Boolean
  );
  if (sources.length === 0) return null;

  // Sort sources by confidence
  sources.sort((a, b) => b.confidence - a.confidence);

  // Use the highest confidence source as base
  const baseInfo = sources[0];

  // Combine information from all sources, preferring higher confidence values
  const combinedInfo = { ...baseInfo };

  // For each nutrient, use the value from the source with highest confidence
  const nutrients = [
    "calories",
    "proteins",
    "carbs",
    "fats",
    "fiber",
    "sugar",
    "sodium",
    "saturatedFat",
    "cholesterol",
    "potassium",
    "vitaminA",
    "vitaminC",
    "calcium",
    "iron",
  ];

  nutrients.forEach((nutrient) => {
    const values = sources
      .filter((s) => s[nutrient] !== undefined && s[nutrient] !== 0)
      .map((s) => ({ value: s[nutrient], confidence: s.confidence }));

    if (values.length > 0) {
      // Use weighted average if multiple sources have values
      const totalConfidence = values.reduce((sum, v) => sum + v.confidence, 0);
      combinedInfo[nutrient] = values.reduce(
        (sum, v) => sum + (v.value * v.confidence) / totalConfidence,
        0
      );
    }
  });

  // Round numeric values
  Object.keys(combinedInfo).forEach((key) => {
    if (typeof combinedInfo[key] === "number") {
      combinedInfo[key] = Number(combinedInfo[key].toFixed(1));
    }
  });

  return combinedInfo;
}

function isValidNutritionalInfo(info) {
  // Check if the nutritional values are within reasonable ranges
  const checks = [
    info.calories > 0 && info.calories < 2000, // Most single food items shouldn't exceed 2000 calories
    info.proteins >= 0 && info.proteins < 100, // Most foods don't have more than 100g protein
    info.carbs >= 0 && info.carbs < 200, // Most foods don't have more than 200g carbs
    info.fats >= 0 && info.fats < 100, // Most foods don't have more than 100g fat
    info.sugar >= 0 && info.sugar < 100, // Most foods don't have more than 100g sugar
    info.sodium >= 0 && info.sodium < 5000, // Most foods don't have more than 5000mg sodium
    info.fiber >= 0 && info.fiber < 50, // Most foods don't have more than 50g fiber
  ];

  // All checks must pass
  return checks.every((check) => check === true);
}
