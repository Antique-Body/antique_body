// Drag and Drop item types
export const ItemTypes = {
  TRAINING_DAY: "training_day",
  EXERCISE: "exercise",
};

// Exercise types
export const EXERCISE_TYPES = {
  STRENGTH: "strength",
  HIIT: "hiit",
  CARDIO: "cardio",
  MOBILITY: "mobility",
  CORE: "core",
  BODYWEIGHT: "bodyweight",
};

// Training day types
export const TRAINING_DAY_TYPES = {
  STRENGTH: "strength",
  HIIT: "hiit",
  CARDIO: "cardio",
  TRAINING: "training",
  REST: "rest",
};

// Muscle groups
export const MUSCLE_GROUPS = {
  CHEST: "chest",
  BACK: "back",
  LEGS: "legs",
  SHOULDERS: "shoulders",
  ARMS: "arms",
  CORE: "core",
  GLUTES: "glutes",
  QUADRICEPS: "quadriceps",
  HAMSTRINGS: "hamstrings",
  CALVES: "calves",
  TRICEPS: "triceps",
  BICEPS: "biceps",
  FULL_BODY: "full body",
};

// Default values
export const DEFAULT_VALUES = {
  EXERCISE_SETS: 3,
  EXERCISE_REPS: 10,
  EXERCISE_REST: 60, // seconds
  TRAINING_DAY_DURATION: 60, // minutes
  REST_DAY_DURATION: 0,
};

// View modes
export const VIEW_MODES = {
  OVERVIEW: "OVERVIEW",
  LIVE: "LIVE",
  REVIEW: "REVIEW",
};

// Progress status
export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

// Exercise difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  EXPERT: "expert",
};

// Equipment types
export const EQUIPMENT_TYPES = {
  BODYWEIGHT: "bodyweight",
  DUMBBELLS: "dumbbells",
  BARBELL: "barbell",
  KETTLEBELL: "kettlebell",
  RESISTANCE_BANDS: "resistance_bands",
  PULL_UP_BAR: "pull_up_bar",
  BENCH: "bench",
  CABLE_MACHINE: "cable_machine",
  SMITH_MACHINE: "smith_machine",
  MEDICINE_BALL: "medicine_ball",
};

// Workout session states
export const SESSION_STATES = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  RESTING: "resting",
  PAUSED: "paused",
  COMPLETED: "completed",
  ENDED: "ended",
};

// Training day status
export const TRAINING_DAY_STATUS = {
  LOCKED: "locked",
  UNLOCKED: "unlocked",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ENDED: "ended",
};

// Time constants
export const TIME_CONSTANTS = {
  MIN_REST_TIME: 0,
  MAX_REST_TIME: 600, // 10 minutes
  MIN_EXERCISE_DURATION: 1,
  MAX_EXERCISE_DURATION: 1440, // 24 hours in minutes
  DEFAULT_SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
};

// API endpoints
export const API_ENDPOINTS = {
  COACHING_REQUESTS: "/api/coaching-requests",
  TRAINING_PLANS: "/assigned-training-plans",
  EDIT_PLAN: "/assigned-training-plan",
};

// Local storage keys
export const STORAGE_KEYS = {
  WORKOUT_DATA: "workout_data",
  SESSION_STATE: "session_state",
  USER_PREFERENCES: "user_preferences",
};

// Icon mappings for exercise types
export const EXERCISE_TYPE_ICONS = {
  [EXERCISE_TYPES.STRENGTH]: "mdi:dumbbell",
  [EXERCISE_TYPES.HIIT]: "mdi:flash",
  [EXERCISE_TYPES.CARDIO]: "mdi:heart-pulse",
  [EXERCISE_TYPES.MOBILITY]: "mdi:yoga",
  [EXERCISE_TYPES.CORE]: "mdi:abs",
  [EXERCISE_TYPES.BODYWEIGHT]: "mdi:human-handsup",
};

// Icon mappings for muscle groups
export const MUSCLE_GROUP_ICONS = {
  [MUSCLE_GROUPS.CHEST]: "mdi:arm-flex",
  [MUSCLE_GROUPS.BACK]: "mdi:human-handsdown",
  [MUSCLE_GROUPS.LEGS]: "mdi:human-male",
  [MUSCLE_GROUPS.SHOULDERS]: "mdi:arm-flex-outline",
  [MUSCLE_GROUPS.ARMS]: "mdi:arm-flex",
  [MUSCLE_GROUPS.CORE]: "mdi:abs",
  [MUSCLE_GROUPS.GLUTES]: "mdi:human-male-boy",
};

// Color themes for different exercise types
export const EXERCISE_TYPE_COLORS = {
  [EXERCISE_TYPES.STRENGTH]: {
    bg: "bg-red-900/30",
    text: "text-red-400",
    border: "border-red-700/30",
    gradient: "from-red-500 to-pink-600",
  },
  [EXERCISE_TYPES.HIIT]: {
    bg: "bg-orange-900/30",
    text: "text-orange-400",
    border: "border-orange-700/30",
    gradient: "from-orange-500 to-yellow-600",
  },
  [EXERCISE_TYPES.CARDIO]: {
    bg: "bg-blue-900/30",
    text: "text-blue-400",
    border: "border-blue-700/30",
    gradient: "from-blue-500 to-cyan-600",
  },
  [EXERCISE_TYPES.MOBILITY]: {
    bg: "bg-green-900/30",
    text: "text-green-400",
    border: "border-green-700/30",
    gradient: "from-green-500 to-emerald-600",
  },
  [EXERCISE_TYPES.CORE]: {
    bg: "bg-purple-900/30",
    text: "text-purple-400",
    border: "border-purple-700/30",
    gradient: "from-purple-500 to-indigo-600",
  },
  [EXERCISE_TYPES.BODYWEIGHT]: {
    bg: "bg-yellow-900/30",
    text: "text-yellow-400",
    border: "border-yellow-700/30",
    gradient: "from-yellow-500 to-orange-600",
  },
};
