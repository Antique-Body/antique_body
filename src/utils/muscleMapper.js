/**
 * Muscle Mapping Utility for react-body-highlighter
 * Maps exercise muscle groups to supported body parts
 */

// Supported muscles from react-body-highlighter:
// Back: trapezius, upper-back, lower-back
// Chest: chest
// Arms: biceps, triceps, forearm, back-deltoids, front-deltoids
// Abs: abs, obliques
// Legs: adductor, hamstring, quadriceps, abductors, calves, gluteal
// Head: head, neck

export const MUSCLE_TO_BODY_PART_MAP = {
  // Chest
  chest: ["chest"],
  pectorals: ["chest"],
  pecs: ["chest"],

  // Back
  back: ["upper-back", "lower-back"],
  "upper-back": ["upper-back"],
  "lower-back": ["lower-back"],
  lats: ["upper-back"],
  latissimus: ["upper-back"],
  rhomboids: ["upper-back"],
  trapezius: ["trapezius"],
  traps: ["trapezius"],

  // Shoulders
  shoulders: ["front-deltoids", "back-deltoids"],
  deltoids: ["front-deltoids", "back-deltoids"],
  "front-deltoids": ["front-deltoids"],
  "back-deltoids": ["back-deltoids"],
  "rear-deltoids": ["back-deltoids"],
  "anterior-deltoids": ["front-deltoids"],
  "posterior-deltoids": ["back-deltoids"],

  // Arms
  biceps: ["biceps"],
  triceps: ["triceps"],
  forearms: ["forearm"],
  forearm: ["forearm"],

  // Core/Abs
  abs: ["abs"],
  abdominals: ["abs"],
  core: ["abs", "obliques"],
  obliques: ["obliques"],

  // Legs - Front
  quadriceps: ["quadriceps"],
  quads: ["quadriceps"],
  glutes: ["gluteal"],
  gluteus: ["gluteal"],
  gluteal: ["gluteal"],
  calves: ["calves"],
  adductors: ["adductor"],
  adductor: ["adductor"],
  abductors: ["abductors"],

  // Legs - Back
  hamstrings: ["hamstring"],
  hamstring: ["hamstring"],

  // Head/Neck
  neck: ["neck"],
  head: ["head"],
};

/**
 * Muscle group display name mapping - converts internal names to proper display names
 */
export const MUSCLE_DISPLAY_NAMES = {
  // Chest
  chest: "Chest",
  pectorals: "Pectorals",
  pecs: "Pecs",

  // Back
  back: "Back",
  "upper-back": "Upper Back",
  "lower-back": "Lower Back",
  "lower back": "Lower Back",
  lats: "Lats",
  latissimus: "Latissimus Dorsi",
  rhomboids: "Rhomboids",
  trapezius: "Trapezius",
  traps: "Traps",

  // Shoulders
  shoulders: "Shoulders",
  deltoids: "Deltoids",
  "front-deltoids": "Front Deltoids",
  "back-deltoids": "Back Deltoids",
  "rear-deltoids": "Rear Deltoids",
  "anterior-deltoids": "Anterior Deltoids",
  "posterior-deltoids": "Posterior Deltoids",

  // Arms
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Forearms",
  forearm: "Forearm",

  // Core/Abs
  abs: "Abs",
  abdominals: "Abdominals",
  core: "Core",
  obliques: "Obliques",

  // Legs
  quadriceps: "Quadriceps",
  quads: "Quads",
  glutes: "Glutes",
  gluteus: "Gluteus",
  gluteal: "Glutes",
  calves: "Calves",
  adductors: "Adductors",
  adductor: "Adductors",
  abductors: "Abductors",
  hamstrings: "Hamstrings",
  hamstring: "Hamstrings",

  // Head/Neck
  neck: "Neck",
  head: "Head",

  // Special cases
  "full body": "Full Body",
  cardio: "Cardio",
  legs: "Legs",
  arms: "Arms",
  "hip flexors": "Hip Flexors",
};

/**
 * Determines the primary anatomical view based on muscle groups
 * Returns 'anterior' (front) or 'posterior' (back)
 */
export const getPrimaryAnatomicalView = (muscleGroups = []) => {
  if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
    return "anterior"; // default to front view
  }

  // Define muscle groups that are primarily visible from the back
  const posteriorMuscles = [
    "hamstrings",
    "hamstring",
    "glutes",
    "gluteus",
    "gluteal",
    "lower back",
    "lower-back",
    "upper-back",
    "upper back",
    "back",
    "lats",
    "latissimus",
    "rhomboids",
    "trapezius",
    "traps",
    "rear-deltoids",
    "back-deltoids",
    "posterior-deltoids",
  ];

  // Define muscle groups that are primarily visible from the front
  const anteriorMuscles = [
    "chest",
    "pectorals",
    "pecs",
    "quadriceps",
    "quads",
    "abs",
    "abdominals",
    "core",
    "obliques",
    "biceps",
    "front-deltoids",
    "anterior-deltoids",
    "calves",
    "adductors",
    "adductor",
    "hip flexors",
  ];

  let posteriorCount = 0;
  let anteriorCount = 0;

  muscleGroups.forEach((muscle) => {
    const muscleString =
      typeof muscle === "string"
        ? muscle.toLowerCase().trim()
        : (muscle?.name || muscle?.value || muscle?.label || "")
            .toLowerCase()
            .trim();

    if (posteriorMuscles.includes(muscleString)) {
      posteriorCount++;
    } else if (anteriorMuscles.includes(muscleString)) {
      anteriorCount++;
    }
  });

  // If more posterior muscles, show back view; otherwise show front view
  return posteriorCount > anteriorCount ? "posterior" : "anterior";
};

/**
 * Formats muscle group display name
 * @param {string|object} muscle - Muscle group string or object
 * @returns {string} Properly formatted display name
 */
export const formatMuscleDisplayName = (muscle) => {
  let muscleString = "";

  if (typeof muscle === "string") {
    muscleString = muscle;
  } else if (typeof muscle === "object" && muscle !== null) {
    muscleString = muscle.name || muscle.value || muscle.label || "";
  }

  if (!muscleString) return "Unknown";

  const normalizedMuscle = muscleString.toLowerCase().trim();

  // Return mapped display name or capitalize the original
  return (
    MUSCLE_DISPLAY_NAMES[normalizedMuscle] ||
    muscleString.charAt(0).toUpperCase() + muscleString.slice(1)
  );
};

/**
 * Converts exercise muscle groups to react-body-highlighter format
 * @param {Array} muscleGroups - Array of muscle group strings
 * @returns {Array} Array of supported muscle names for react-body-highlighter
 */
export const convertToBodyHighlighterMuscles = (muscleGroups = []) => {
  if (!Array.isArray(muscleGroups)) return [];

  const supportedMuscles = [];

  muscleGroups.forEach((muscle) => {
    // Handle both string and object muscle groups
    let muscleString = "";
    if (typeof muscle === "string") {
      muscleString = muscle;
    } else if (typeof muscle === "object" && muscle !== null) {
      // Handle object with name, value, or label property
      muscleString = muscle.name || muscle.value || muscle.label || "";
    }

    if (!muscleString) return;

    const normalizedMuscle = muscleString.toLowerCase().trim();
    const mappedMuscles = MUSCLE_TO_BODY_PART_MAP[normalizedMuscle];

    if (mappedMuscles) {
      supportedMuscles.push(...mappedMuscles);
    }
  });

  // Remove duplicates
  return [...new Set(supportedMuscles)];
};

/**
 * Generates exercise data for react-body-highlighter
 * @param {string} exerciseName - Name of the exercise
 * @param {Array} muscleGroups - Array of muscle groups
 * @param {number} frequency - Optional frequency/intensity (defaults to 1)
 * @returns {Object} Exercise data object for react-body-highlighter
 */
export const generateExerciseData = (
  exerciseName,
  muscleGroups = [],
  frequency = 1
) => ({
  name: exerciseName,
  muscles: convertToBodyHighlighterMuscles(muscleGroups),
  frequency: frequency,
});

/**
 * Muscle group descriptions for tooltips and information
 */
export const MUSCLE_DESCRIPTIONS = {
  // Back
  trapezius: "Upper back muscle that moves the shoulder blades",
  "upper-back": "Upper back muscles including rhomboids and middle traps",
  "lower-back": "Lower back muscles including erector spinae",

  // Chest
  chest: "Pectoral muscles for pushing movements",

  // Arms
  biceps: "Front arm muscles for pulling and flexing",
  triceps: "Back arm muscles for pushing and extending",
  forearm: "Lower arm muscles for grip and wrist movement",
  "back-deltoids": "Rear shoulder muscles",
  "front-deltoids": "Front shoulder muscles",

  // Abs
  abs: "Abdominal muscles for core stability",
  obliques: "Side abdominal muscles for rotation",

  // Legs
  adductor: "Inner thigh muscles",
  hamstring: "Back thigh muscles",
  quadriceps: "Front thigh muscles",
  abductors: "Outer thigh muscles",
  calves: "Lower leg muscles",
  gluteal: "Glute muscles",

  // Head
  head: "Head and facial muscles",
  neck: "Neck muscles",
};

/**
 * Color scheme for different muscle activation levels
 */
export const MUSCLE_COLORS = {
  default: "#B6BDC3", // Default unworked muscle color
  highlighted: ["#FF6B00", "#FF8533", "#FFA366"], // Orange gradient for different intensities
  primary: "#FF6B00", // Primary highlight color
  secondary: "#FF8533", // Secondary highlight color
  tertiary: "#FFA366", // Tertiary highlight color
};
