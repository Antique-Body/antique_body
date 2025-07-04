import { MEAL_CONFIG, DEFAULT_MEALS } from "./defaultSettings";

import prisma from "@/lib/prisma";
// Abstract config for meal validation

// Validation for meal data
function validateMealData(data) {
  const errors = [];

  MEAL_CONFIG.requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (typeof data[field] === "string" && !data[field].trim())
    ) {
      errors.push(`Field '${field}' is required.`);
    }
  });

  if (data.mealType && !MEAL_CONFIG.validMealTypes.includes(data.mealType)) {
    errors.push(
      `Invalid meal type. Valid types: ${MEAL_CONFIG.validMealTypes.join(", ")}`
    );
  }

  if (
    data.difficulty &&
    !MEAL_CONFIG.validDifficulties.includes(data.difficulty)
  ) {
    errors.push(
      `Invalid difficulty. Valid difficulties: ${MEAL_CONFIG.validDifficulties.join(
        ", "
      )}`
    );
  }

  if (data.cuisine && !MEAL_CONFIG.validCuisines.includes(data.cuisine)) {
    errors.push(
      `Invalid cuisine. Valid cuisines: ${MEAL_CONFIG.validCuisines.join(", ")}`
    );
  }

  if (
    data.preparationTime &&
    (data.preparationTime <= 0 || !Number.isInteger(data.preparationTime))
  ) {
    errors.push("Preparation time must be a positive integer.");
  }

  if (data.calories && data.calories < 0) {
    errors.push("Calories must be 0 or greater.");
  }
  if (data.protein && data.protein < 0) {
    errors.push("Protein must be 0 or greater.");
  }
  if (data.carbs && data.carbs < 0) {
    errors.push("Carbs must be 0 or greater.");
  }
  if (data.fat && data.fat < 0) {
    errors.push("Fat must be 0 or greater.");
  }

  return errors;
}

// Process meal data for DB
function processMealData(data) {
  return {
    name: data.name.trim(),
    mealType: data.mealType,
    difficulty: data.difficulty,
    preparationTime: parseInt(data.preparationTime) || 15,
    calories: parseFloat(data.calories) || 0,
    protein: parseFloat(data.protein) || 0,
    carbs: parseFloat(data.carbs) || 0,
    fat: parseFloat(data.fat) || 0,
    dietary: Array.isArray(data.dietary) ? data.dietary : [],
    cuisine: data.cuisine || "other",
    ingredients: data.ingredients.trim(),
    recipe: data.recipe.trim(),
    imageUrl: data.imageUrl || null,
    video: data.video || null,
  };
}

/**
 * Creates default meals for a trainer
 */
async function createDefaultMeals(trainerInfoId) {
  const meals = [];
  for (const mealData of DEFAULT_MEALS) {
    const meal = await prisma.meal.create({
      data: {
        trainerId: trainerInfoId,
        ...processMealData(mealData),
      },
    });
    meals.push(meal);
  }
  return meals;
}

/**
 * Creates a meal with all details
 */
async function createMealWithDetails(formData, trainerInfoId) {
  const validationErrors = validateMealData(formData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" "));
  }
  const mealData = processMealData(formData);
  const meal = await prisma.meal.create({
    data: {
      trainerId: trainerInfoId,
      ...mealData,
    },
  });
  return meal;
}

/**
 * Gets all meals for a specific trainer
 */
async function getMealsByTrainerInfoId(trainerInfoId) {
  return await prisma.meal.findMany({
    where: { trainerId: trainerInfoId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Gets a single meal by ID
 */
async function getMealById(mealId) {
  return await prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      trainerInfo: {
        include: {
          trainerProfile: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Updates a meal
 */
async function updateMeal(mealId, data) {
  const validationErrors = validateMealData(data);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" "));
  }
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
  });
  if (!meal) {
    throw new Error("Meal not found");
  }
  const mealData = processMealData(data);
  const updatedMeal = await prisma.meal.update({
    where: { id: mealId },
    data: mealData,
    include: {
      trainerInfo: {
        include: {
          trainerProfile: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
  return updatedMeal;
}

/**
 * Deletes a meal
 */
async function deleteMeal(mealId) {
  if (!mealId) throw new Error("Meal id is required");
  return await prisma.meal.delete({
    where: { id: mealId },
  });
}

// Filtering config
const FILTER_CONFIG = {
  searchFields: ["name", "ingredients", "recipe"],
  sortFields: {
    name: "name",
    mealType: "mealType",
    difficulty: "difficulty",
    preparationTime: "preparationTime",
    calories: "calories",
    dateCreated: "createdAt",
  },
};

// Build search filter for meals
function buildSearchFilter(search) {
  if (!search || search.trim() === "") return {};
  const searchTerm = search.trim().toLowerCase();
  const searchTerms = searchTerm.split(/\s+/).filter((term) => term.length > 0);
  if (searchTerms.length === 0) return {};
  const searchConditions = searchTerms.map((term) => ({
    OR: [
      { name: { contains: term } },
      { ingredients: { contains: term } },
      { recipe: { contains: term } },
    ],
  }));
  if (searchConditions.length === 1) {
    return searchConditions[0];
  } else {
    return {
      AND: searchConditions,
    };
  }
}

// Build sort order
function buildSortOrder(sortBy, sortOrder) {
  const field = FILTER_CONFIG.sortFields[sortBy];
  if (!field) return { name: sortOrder };
  return { [field]: sortOrder };
}

// Build preparation time filter
function buildPreparationTimeFilter(preparationTime) {
  if (!preparationTime) return {};

  // Handle range filters like "0-15", "15-30", "30-60", "60+"
  if (preparationTime.includes("-")) {
    const [min, max] = preparationTime.split("-").map(Number);
    return {
      preparationTime: {
        gte: min,
        lte: max,
      },
    };
  } else if (preparationTime.includes("+")) {
    const min = parseInt(preparationTime.replace("+", ""));
    return {
      preparationTime: {
        gte: min,
      },
    };
  }

  // If it's a direct number, treat as exact match
  const timeValue = parseInt(preparationTime);
  if (!isNaN(timeValue)) {
    return {
      preparationTime: timeValue,
    };
  }

  return {};
}

// Build dietary filter for JSON array
function buildDietaryFilter(dietary) {
  if (!dietary) return {};

  return {
    dietary: {
      array_contains: dietary,
    },
  };
}

/**
 * Gets all meals with filtering and pagination
 */
async function getAllMeals(options = {}) {
  try {
    const {
      search = "",
      mealType = "",
      difficulty = "",
      dietary = "",
      cuisine = "",
      preparationTime = "",
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 12,
    } = options;
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    const validSortFields = [
      "name",
      "mealType",
      "difficulty",
      "preparationTime",
      "calories",
      "createdAt",
    ];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field: ${sortBy}`);
    }
    if (!["asc", "desc"].includes(sortOrder)) {
      throw new Error(`Invalid sort order: ${sortOrder}`);
    }
    const where = {
      ...(search && buildSearchFilter(search)),
      ...(mealType && { mealType }),
      ...(difficulty && { difficulty }),
      ...(cuisine && { cuisine }),
      ...buildDietaryFilter(dietary),
      ...buildPreparationTimeFilter(preparationTime),
    };
    const orderBy = buildSortOrder(sortBy, sortOrder);
    const skip = (page - 1) * limit;
    const [meals, totalCount] = await Promise.all([
      prisma.meal.findMany({
        where,
        orderBy,
        take: limit,
        skip,
      }),
      prisma.meal.count({ where }),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      meals,
      pagination: {
        total: totalCount,
        pages: totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error("Error in getAllMeals:", error);
    throw error;
  }
}

/**
 * Gets filtered meals for a specific trainer with advanced filtering, sorting, and pagination
 */
async function getTrainerMealsWithFilters(trainerInfoId, options = {}) {
  try {
    const {
      search = "",
      mealType = "",
      difficulty = "",
      dietary = "",
      cuisine = "",
      preparationTime = "",
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      limit = 12,
    } = options;
    if (!trainerInfoId) {
      throw new Error("Trainer info ID is required");
    }
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    const validSortFields = [
      "name",
      "mealType",
      "difficulty",
      "preparationTime",
      "calories",
      "createdAt",
    ];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field: ${sortBy}`);
    }
    if (!["asc", "desc"].includes(sortOrder)) {
      throw new Error(`Invalid sort order: ${sortOrder}`);
    }
    const where = {
      trainerId: trainerInfoId,
      ...(search && buildSearchFilter(search)),
      ...(mealType && { mealType }),
      ...(difficulty && { difficulty }),
      ...(cuisine && { cuisine }),
      ...buildDietaryFilter(dietary),
      ...buildPreparationTimeFilter(preparationTime),
    };
    const orderBy = buildSortOrder(sortBy, sortOrder);
    const skip = (page - 1) * limit;
    const [meals, totalCount] = await Promise.all([
      prisma.meal.findMany({
        where,
        orderBy,
        take: limit,
        skip,
      }),
      prisma.meal.count({ where }),
    ]);
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      meals,
      pagination: {
        total: totalCount,
        pages: totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error) {
    console.error("Error in getTrainerMealsWithFilters:", error);
    throw error;
  }
}

export const mealService = {
  createMealWithDetails,
  createDefaultMeals,
  getMealsByTrainerInfoId,
  getTrainerMealsWithFilters,
  getMealById,
  updateMeal,
  deleteMeal,
  getAllMeals,
};
