import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Apstraktna konfiguracija za exercise validaciju
const EXERCISE_CONFIG = {
  requiredFields: [
    "name",
    "location",
    "equipment",
    "type",
    "level",
    "description",
    "instructions",
    "muscleGroups",
  ],
  validTypes: ["strength", "bodyweight", "cardio", "flexibility", "balance"],
  validLevels: ["beginner", "intermediate", "advanced"],
  validLocations: ["gym", "home", "outdoor"],
};

// Default exercises data
const DEFAULT_EXERCISES = [
  {
    name: "Barbell Squat",
    location: "gym",
    equipment: true,
    type: "strength",
    level: "intermediate",
    description:
      "A compound lower body exercise that targets multiple muscle groups including quadriceps, hamstrings, glutes, and core.",
    instructions:
      "1. Stand with feet shoulder-width apart, barbell resting on upper back\n2. Keep chest up, core engaged\n3. Lower body by bending knees and hips\n4. Descend until thighs are parallel to ground\n5. Drive through heels to return to starting position\n6. Repeat for desired number of reps",
    muscleGroups: ["quadriceps", "hamstrings", "glutes", "core"],
    imageUrl:
      "https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    video: "https://www.youtube.com/watch?v=aclHkVaku9U",
  },
  {
    name: "Push-ups",
    location: "home",
    equipment: false,
    type: "bodyweight",
    level: "beginner",
    description:
      "A classic bodyweight exercise that builds upper body strength and core stability.",
    instructions:
      "1. Start in plank position with hands slightly wider than shoulders\n2. Lower body by bending elbows\n3. Keep body in straight line from head to heels\n4. Lower until chest nearly touches ground\n5. Push back up to starting position\n6. Repeat for desired number of reps",
    muscleGroups: ["chest", "shoulders", "triceps", "core"],
    imageUrl:
      "https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
  },
  {
    name: "Plank",
    location: "home",
    equipment: false,
    type: "bodyweight",
    level: "beginner",
    description:
      "An isometric core exercise that improves stability and posture.",
    instructions:
      "1. Start in forearm plank position\n2. Keep body in straight line from head to heels\n3. Engage core muscles\n4. Hold position for 30-60 seconds\n5. Maintain steady breathing throughout\n6. Gradually increase hold time as strength improves",
    muscleGroups: ["core", "shoulders", "back"],
    imageUrl:
      "https://images.pexels.com/photos/4056530/pexels-photo-4056530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    video: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
  },
];

// Apstraktna validacija exercise podataka
function validateExerciseData(data) {
  const errors = [];

  EXERCISE_CONFIG.requiredFields.forEach((field) => {
    if (
      !data[field] ||
      (Array.isArray(data[field]) && data[field].length === 0)
    ) {
      errors.push(`Field '${field}' is required.`);
    }
  });

  if (data.type && !EXERCISE_CONFIG.validTypes.includes(data.type)) {
    errors.push(
      `Invalid exercise type. Valid types: ${EXERCISE_CONFIG.validTypes.join(
        ", "
      )}`
    );
  }

  if (data.level && !EXERCISE_CONFIG.validLevels.includes(data.level)) {
    errors.push(
      `Invalid exercise level. Valid levels: ${EXERCISE_CONFIG.validLevels.join(
        ", "
      )}`
    );
  }

  if (
    data.location &&
    !EXERCISE_CONFIG.validLocations.includes(data.location)
  ) {
    errors.push(
      `Invalid location. Valid locations: ${EXERCISE_CONFIG.validLocations.join(
        ", "
      )}`
    );
  }

  return errors;
}

// Apstraktna obrada muscle groups
function processMuscleGroups(muscleGroups) {
  return muscleGroups.map((name) => ({ name }));
}

// Apstraktna obrada exercise podataka
function processExerciseData(data) {
  return {
    name: data.name,
    location: data.location,
    equipment: data.equipment,
    type: data.type,
    level: data.level,
    description: data.description,
    instructions: data.instructions,
    video: data.video || null,
    imageUrl: data.imageUrl || null,
  };
}

/**
 * Creates default exercises for a trainer
 */
async function createDefaultExercises(trainerInfoId) {
  const exercises = [];

  for (const exerciseData of DEFAULT_EXERCISES) {
    const exercise = await prisma.exercise.create({
      data: {
        trainerInfoId,
        ...processExerciseData(exerciseData),
        muscleGroups: {
          create: processMuscleGroups(exerciseData.muscleGroups),
        },
        exerciseInfo: {
          create: {
            totalUses: 0,
            totalRatings: 0,
          },
        },
      },
      include: {
        muscleGroups: true,
        exerciseInfo: true,
        trainerInfo: {
          include: {
            trainerProfile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    exercises.push(exercise);
  }

  return exercises;
}

/**
 * Creates an exercise with all details and relations.
 */
async function createExerciseWithDetails(formData, trainerInfoId) {
  const validationErrors = validateExerciseData(formData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" "));
  }

  const exerciseData = processExerciseData(formData);

  const exercise = await prisma.exercise.create({
    data: {
      trainerInfoId,
      ...exerciseData,
      muscleGroups: {
        create: processMuscleGroups(formData.muscleGroups),
      },
      exerciseInfo: {
        create: {
          totalUses: 0,
          totalRatings: 0,
        },
      },
    },
    include: {
      muscleGroups: true,
      exerciseInfo: true,
      trainerInfo: {
        include: {
          trainerProfile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return exercise;
}

/**
 * Gets all exercises for a specific trainer
 */
async function getExercisesByTrainerInfoId(trainerInfoId) {
  return await prisma.exercise.findMany({
    where: { trainerInfoId },
    include: {
      muscleGroups: true,
      exerciseInfo: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Gets a single exercise by ID
 */
async function getExerciseById(exerciseId) {
  return await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      muscleGroups: true,
      exerciseInfo: true,
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
 * Updates an exercise
 */
async function updateExercise(exerciseId, data) {
  const validationErrors = validateExerciseData(data);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(" "));
  }

  return await prisma.$transaction(async (tx) => {
    const exercise = await tx.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    // Delete existing muscle groups
    await tx.exerciseMuscleGroup.deleteMany({
      where: { exerciseId },
    });

    const exerciseData = processExerciseData(data);

    // Update exercise data
    const updatedExercise = await tx.exercise.update({
      where: { id: exerciseId },
      data: {
        ...exerciseData,
        muscleGroups: {
          create: processMuscleGroups(data.muscleGroups),
        },
      },
      include: {
        muscleGroups: true,
        exerciseInfo: true,
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

    return updatedExercise;
  });
}

/**
 * Deletes an exercise
 */
async function deleteExercise(exerciseId) {
  return await prisma.exercise.delete({
    where: { id: exerciseId },
  });
}

// Apstraktna konfiguracija za filtriranje
const FILTER_CONFIG = {
  searchFields: ["name", "description", "instructions"],
  sortFields: {
    name: "name",
    type: "type",
    level: "level",
    dateCreated: "createdAt",
    rating: "exerciseInfo.averageRating",
  },
};

// Apstraktna obrada search filtera
function buildSearchFilter(search) {
  if (!search) return {};

  const searchTerms = search.toLowerCase().split(" ");
  return {
    OR: searchTerms.map((term) => ({
      OR: [
        ...FILTER_CONFIG.searchFields.map((field) => ({
          [field]: { contains: term },
        })),
        {
          muscleGroups: {
            some: { name: { contains: term } },
          },
        },
      ],
    })),
  };
}

// Apstraktna obrada sortiranja
function buildSortOrder(sortBy, sortOrder) {
  const field = FILTER_CONFIG.sortFields[sortBy];
  if (!field) return { name: sortOrder };

  if (field.includes(".")) {
    const [relation, relationField] = field.split(".");
    return { [relation]: { [relationField]: sortOrder } };
  }

  return { [field]: sortOrder };
}

/**
 * Gets all exercises with filtering and pagination
 */
async function getAllExercises(options = {}) {
  const {
    limit,
    page = 1,
    search,
    type,
    level,
    location,
    equipment,
    sortBy = "name",
    sortOrder = "asc",
  } = options;

  // Build where clause
  const where = {
    ...buildSearchFilter(search),
    ...(type && { type }),
    ...(level && { level }),
    ...(location && { location }),
    ...(equipment !== undefined &&
      equipment !== null && { equipment: equipment === "true" }),
  };

  // Build query options
  const queryOptions = {
    include: {
      muscleGroups: true,
      exerciseInfo: true,
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
    where,
    orderBy: buildSortOrder(sortBy, sortOrder),
  };

  // Add pagination
  if (limit) {
    const skip = (page - 1) * limit;
    queryOptions.take = limit;
    queryOptions.skip = skip;
  }

  const [exercises, totalExercises] = await Promise.all([
    prisma.exercise.findMany(queryOptions),
    prisma.exercise.count({ where }),
  ]);

  return {
    exercises,
    pagination: {
      total: totalExercises,
      pages: limit ? Math.ceil(totalExercises / limit) : 1,
      currentPage: page,
      limit: limit || totalExercises,
    },
  };
}

/**
 * Creates or updates exercise info
 */
async function createOrUpdateExerciseInfo(exerciseId, infoData) {
  const existing = await prisma.exerciseInfo.findUnique({
    where: { exerciseId },
  });

  if (existing) {
    return await prisma.exerciseInfo.update({
      where: { exerciseId },
      data: infoData,
    });
  } else {
    return await prisma.exerciseInfo.create({
      data: {
        exerciseId,
        ...infoData,
      },
    });
  }
}

export const exerciseService = {
  createExerciseWithDetails,
  createDefaultExercises,
  getExercisesByTrainerInfoId,
  getExerciseById,
  updateExercise,
  deleteExercise,
  getAllExercises,
  createOrUpdateExerciseInfo,
};
