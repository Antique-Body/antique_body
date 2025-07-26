// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Check if string is empty or just whitespace
const isEmpty = (str) => !str || str.trim() === "";

// Validate registration data
export const validateRegistration = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { email, password } = data;

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate login credentials
export const validateLogin = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { email, password } = data;

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate user update data
export const validateUserUpdate = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { phone } = data;

  if (phone !== undefined) {
    if (isEmpty(phone)) {
      errors.phone = "Phone cannot be empty";
    } else if (!phone.startsWith("+")) {
      errors.phone = "Phone number must start with +";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate role update data
export const validateRoleUpdate = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { role, userId } = data;

  if (!userId) {
    errors.userId = "User ID is required";
  }

  if (isEmpty(role)) {
    errors.role = "Role is required";
  } else if (
    !["user", "client", "trainer", "admin"].includes(role.toLowerCase())
  ) {
    errors.role = "Invalid role";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate training setup data
export const validateTrainingSetup = (data) => {
  const errors = {};

  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const { title, description, duration, maxParticipants } = data;

  if (isEmpty(title)) {
    errors.title = "Title is required";
  }

  if (isEmpty(description)) {
    errors.description = "Description is required";
  }

  if (!duration || isNaN(duration) || duration <= 0) {
    errors.duration = "Duration must be a positive number";
  }

  if (!maxParticipants || isNaN(maxParticipants) || maxParticipants <= 0) {
    errors.maxParticipants = "Maximum participants must be a positive number";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate email
export const validateEmail = (email) => {
  const errors = {};

  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Please provide a valid email";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTrainerProfile = (data) => {
  const errors = {};
  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }
  const requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "trainerSince",
  ];
  for (const field of requiredFields) {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      errors[field] = `Field '${field}' is required.`;
    }
  }

  if (data.location) {
    if (!data.location.city || !data.location.country) {
      errors.location = "City and country are required.";
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExercise = (data) => {
  const errors = {};
  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const requiredFields = [
    "name",
    "location",
    "type",
    "level",
    "description",
    "instructions",
    "muscleGroups",
  ];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      errors[field] = `Field '${field}' is required.`;
    }
  }

  // Special handling for equipment field - it can be boolean
  if (data.equipment === undefined || data.equipment === null) {
    errors.equipment = "Field 'equipment' is required.";
  }

  // Validate type
  const validTypes = [
    "strength",
    "bodyweight",
    "cardio",
    "flexibility",
    "balance",
  ];
  if (data.type && !validTypes.includes(data.type)) {
    errors.type = "Invalid exercise type.";
  }

  // Validate level
  const validLevels = ["beginner", "intermediate", "advanced"];
  if (data.level && !validLevels.includes(data.level)) {
    errors.level = "Invalid exercise level.";
  }

  // Validate location
  const validLocations = ["gym", "home", "outdoor"];
  if (data.location && !validLocations.includes(data.location)) {
    errors.location = "Invalid location.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMeal = (data) => {
  const errors = {};
  if (!data) {
    return { valid: false, errors: { general: "No data provided" } };
  }

  const requiredFields = [
    "name",
    "mealType",
    "difficulty",
    "ingredients",
    "recipe",
  ];

  for (const field of requiredFields) {
    if (
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
    ) {
      errors[field] = `Field '${field}' is required.`;
    }
  }

  // Validate meal type
  const validMealTypes = ["breakfast", "lunch", "dinner", "snack", "dessert"];
  if (data.mealType && !validMealTypes.includes(data.mealType)) {
    errors.mealType = "Invalid meal type.";
  }

  // Validate difficulty
  const validDifficulties = ["easy", "medium", "hard"];
  if (data.difficulty && !validDifficulties.includes(data.difficulty)) {
    errors.difficulty = "Invalid difficulty level.";
  }

  // Validate cuisine
  const validCuisines = [
    "italian",
    "mexican",
    "asian",
    "mediterranean",
    "american",
    "indian",
    "french",
    "greek",
    "middle-eastern",
    "international",
    "other",
  ];
  if (data.cuisine && !validCuisines.includes(data.cuisine)) {
    errors.cuisine = "Invalid cuisine type.";
  }

  // Validate numeric fields
  if (
    data.preparationTime !== undefined &&
    (isNaN(data.preparationTime) || data.preparationTime <= 0)
  ) {
    errors.preparationTime = "Preparation time must be a positive number.";
  }

  if (
    data.calories !== undefined &&
    (isNaN(data.calories) || data.calories < 0)
  ) {
    errors.calories = "Calories must be 0 or greater.";
  }

  if (data.protein !== undefined && (isNaN(data.protein) || data.protein < 0)) {
    errors.protein = "Protein must be 0 or greater.";
  }

  if (data.carbs !== undefined && (isNaN(data.carbs) || data.carbs < 0)) {
    errors.carbs = "Carbs must be 0 or greater.";
  }

  if (data.fat !== undefined && (isNaN(data.fat) || data.fat < 0)) {
    errors.fat = "Fat must be 0 or greater.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
