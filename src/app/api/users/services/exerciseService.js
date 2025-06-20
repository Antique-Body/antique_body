import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Creates an exercise with all details and relations.
 * formData: {
 *   name, location, equipment, type, level, description, instructions,
 *   video, imageUrl, muscleGroups: [string array]
 * }
 */
async function createExerciseWithDetails(formData, trainerProfileId) {
  const requiredFields = [
    "name",
    "location",
    "equipment",
    "type",
    "level",
    "description",
    "instructions",
    "muscleGroups",
  ];

  for (const field of requiredFields) {
    if (
      !formData[field] ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      throw new Error(`Field '${field}' is required.`);
    }
  }

  const exercise = await prisma.exercise.create({
    data: {
      trainerProfileId,
      name: formData.name,
      location: formData.location,
      equipment: formData.equipment,
      type: formData.type,
      level: formData.level,
      description: formData.description,
      instructions: formData.instructions,
      video: formData.video || null,
      imageUrl: formData.imageUrl || null,
      muscleGroups: {
        create: formData.muscleGroups.map((name) => ({ name })),
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
      trainerProfile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return exercise;
}

/**
 * Gets all exercises for a specific trainer
 */
async function getExercisesByTrainerId(trainerProfileId) {
  return await prisma.exercise.findMany({
    where: { trainerProfileId },
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
      trainerProfile: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  });
}

/**
 * Updates an exercise
 */
async function updateExercise(exerciseId, data) {
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

    // Update exercise data
    const updatedExercise = await tx.exercise.update({
      where: { id: exerciseId },
      data: {
        name: data.name,
        location: data.location,
        equipment: data.equipment,
        type: data.type,
        level: data.level,
        description: data.description,
        instructions: data.instructions,
        video: data.video || null,
        imageUrl: data.imageUrl || null,
        muscleGroups: {
          create: data.muscleGroups.map((name) => ({ name })),
        },
      },
      include: {
        muscleGroups: true,
        exerciseInfo: true,
        trainerProfile: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
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

  const queryOptions = {
    include: {
      muscleGroups: true,
      exerciseInfo: true,
      trainerProfile: {
        select: {
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
    where: {},
  };

  // Search filter
  if (search) {
    const searchTerms = search.toLowerCase().split(" ");
    queryOptions.where.OR = [
      ...searchTerms.map((term) => ({
        OR: [
          { name: { contains: term } },
          { description: { contains: term } },
          { instructions: { contains: term } },
          {
            muscleGroups: {
              some: {
                name: { contains: term },
              },
            },
          },
        ],
      })),
    ];
  }

  // Type filter
  if (type) {
    queryOptions.where.type = type;
  }

  // Level filter
  if (level) {
    queryOptions.where.level = level;
  }

  // Location filter
  if (location) {
    queryOptions.where.location = location;
  }

  // Equipment filter
  if (equipment !== undefined && equipment !== null) {
    queryOptions.where.equipment = equipment === "true";
  }

  // Sorting
  if (sortBy === "name") {
    queryOptions.orderBy = { name: sortOrder };
  } else if (sortBy === "type") {
    queryOptions.orderBy = { type: sortOrder };
  } else if (sortBy === "level") {
    queryOptions.orderBy = { level: sortOrder };
  } else if (sortBy === "dateCreated") {
    queryOptions.orderBy = { createdAt: sortOrder };
  } else if (sortBy === "rating") {
    queryOptions.orderBy = { exerciseInfo: { averageRating: sortOrder } };
  }

  // Pagination
  if (limit) {
    const skip = (page - 1) * limit;
    queryOptions.take = limit;
    queryOptions.skip = skip;
  }

  const [exercises, totalExercises] = await Promise.all([
    prisma.exercise.findMany(queryOptions),
    prisma.exercise.count({ where: queryOptions.where }),
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
  getExercisesByTrainerId,
  getExerciseById,
  updateExercise,
  deleteExercise,
  getAllExercises,
  createOrUpdateExerciseInfo,
};
