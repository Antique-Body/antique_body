// Configs for default plans
export const TRAINING_PLAN_CONFIG = [
  {
    title: "Total Body Transformation",
    description:
      "Modern, science-based plan for full body transformation. Includes strength, HIIT, and mobility sessions. Perfect for busy professionals.",
    coverImage:
      "https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg",
    price: 49,
    duration: 6,
    durationType: "weeks",
    keyFeatures: [
      "Personalized schedule",
      "Video instructions",
      "Progress tracking",
      "24/7 chat support",
      "Flexible rescheduling",
    ],
    trainingType: "with-trainer",
    timeline: [
      {
        week: "1",
        title: "Kickoff & Assessment",
        description: "Initial assessment and light full body workouts.",
      },
      {
        week: "2-3",
        title: "Strength Foundation",
        description: "Progressive overload, focus on form and technique.",
      },
      {
        week: "4-5",
        title: "HIIT & Conditioning",
        description: "Add HIIT and mobility for fat loss and flexibility.",
      },
      {
        week: "6",
        title: "Peak Week",
        description: "Test your progress, max out, and get feedback.",
      },
    ],
    features: {
      onlineCalls: true,
      support24_7: true,
      liveTraining: true,
      mealPlanning: true,
      recoveryPlans: true,
      progressTracking: true,
      flexibleScheduling: true,
      personalizedNutrition: true,
    },
    sessionsPerWeek: 4,
    sessionFormat: "inPerson",
    difficultyLevel: "beginner",
    schedule: [
      {
        day: "Monday",
        name: "Full Body Strength",
        type: "strength",
        duration: 60,
        exercises: [
          {
            name: "Barbell Squat",
            reps: 10,
            rest: 60,
            sets: 3,
            type: "strength",
            level: "beginner",
            imageUrl:
              "https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg",
            location: "gym",
            equipment: true,
            instructions:
              "Stand with feet shoulder-width apart, squat down, keep back straight, return up.",
            muscleGroups: [
              { name: "quadriceps" },
              { name: "glutes" },
              { name: "core" },
            ],
          },
          {
            name: "Push-ups",
            reps: 15,
            rest: 45,
            sets: 3,
            type: "bodyweight",
            level: "beginner",
            imageUrl:
              "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
            location: "home",
            equipment: false,
            instructions:
              "Start in plank, lower chest to floor, push back up, keep core tight.",
            muscleGroups: [
              { name: "chest" },
              { name: "shoulders" },
              { name: "triceps" },
            ],
          },
        ],
        description: "Focus on compound movements.",
      },
      {
        day: "Wednesday",
        name: "HIIT & Core",
        type: "hiit",
        duration: 45,
        exercises: [
          {
            name: "Burpees",
            reps: 12,
            rest: 30,
            sets: 4,
            type: "hiit",
            level: "beginner",
            imageUrl:
              "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
            location: "home",
            equipment: false,
            instructions:
              "Squat, jump to plank, push-up, jump back, stand and jump.",
            muscleGroups: [{ name: "full body" }],
          },
          {
            name: "Plank",
            reps: 1,
            rest: 30,
            sets: 3,
            type: "core",
            level: "beginner",
            imageUrl:
              "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
            location: "home",
            equipment: false,
            instructions: "Hold plank position for 45 seconds.",
            muscleGroups: [{ name: "core" }, { name: "shoulders" }],
          },
        ],
        description: "HIIT intervals and core stability.",
      },
      {
        day: "Friday",
        name: "Mobility & Recovery",
        type: "mobility",
        duration: 40,
        exercises: [
          {
            name: "Dynamic Stretching",
            reps: 1,
            rest: 0,
            sets: 1,
            type: "mobility",
            level: "beginner",
            imageUrl:
              "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg",
            location: "home",
            equipment: false,
            instructions:
              "Perform dynamic stretches for all major muscle groups.",
            muscleGroups: [{ name: "full body" }],
          },
        ],
        description: "Mobility, stretching, and active recovery.",
      },
    ],
  },
  {
    title: "Lean & Strong Express",
    description:
      "Fast-paced plan for fat loss and muscle definition. Includes HIIT, core, and functional training.",
    coverImage:
      "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
    price: 39,
    duration: 4,
    durationType: "weeks",
    keyFeatures: [
      "HIIT sessions",
      "Core focus",
      "Minimal equipment",
      "Weekly check-ins",
    ],
    trainingType: "with-trainer",
    timeline: [
      {
        week: "1",
        title: "HIIT Kickoff",
        description: "Introduction to HIIT and core basics.",
      },
      {
        week: "2",
        title: "Intensity Up",
        description: "Increase intensity, add circuits.",
      },
      {
        week: "3",
        title: "Functional Moves",
        description: "Add functional and balance exercises.",
      },
      {
        week: "4",
        title: "Final Push",
        description: "Peak week, test endurance and strength.",
      },
    ],
    features: {
      onlineCalls: true,
      support24_7: false,
      liveTraining: true,
      mealPlanning: false,
      recoveryPlans: true,
      progressTracking: true,
      flexibleScheduling: true,
      personalizedNutrition: false,
    },
    sessionsPerWeek: 3,
    sessionFormat: "online",
    difficultyLevel: "intermediate",
    schedule: [
      {
        day: "Tuesday",
        name: "HIIT Circuit",
        type: "hiit",
        duration: 40,
        exercises: [
          {
            name: "Jumping Jacks",
            reps: 30,
            rest: 20,
            sets: 3,
            type: "hiit",
            level: "intermediate",
            imageUrl:
              "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
            location: "home",
            equipment: false,
            instructions:
              "Jump feet out while raising arms overhead, return to start.",
            muscleGroups: [{ name: "full body" }],
          },
          {
            name: "Mountain Climbers",
            reps: 20,
            rest: 20,
            sets: 3,
            type: "hiit",
            level: "intermediate",
            imageUrl:
              "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
            location: "home",
            equipment: false,
            instructions: "Start in plank, alternate knees to chest quickly.",
            muscleGroups: [{ name: "core" }, { name: "shoulders" }],
          },
        ],
        description: "High intensity circuit for fat loss.",
      },
      {
        day: "Thursday",
        name: "Core & Balance",
        type: "core",
        duration: 35,
        exercises: [
          {
            name: "Russian Twists",
            reps: 20,
            rest: 30,
            sets: 3,
            type: "core",
            level: "intermediate",
            imageUrl:
              "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
            location: "home",
            equipment: false,
            instructions:
              "Sit, lean back, twist torso side to side holding weight.",
            muscleGroups: [{ name: "core" }],
          },
          {
            name: "Single Leg Balance",
            reps: 10,
            rest: 30,
            sets: 2,
            type: "balance",
            level: "intermediate",
            imageUrl:
              "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg",
            location: "home",
            equipment: false,
            instructions: "Stand on one leg, hold for 30 seconds, switch legs.",
            muscleGroups: [{ name: "legs" }, { name: "core" }],
          },
        ],
        description: "Core strength and balance work.",
      },
    ],
  },
  {
    title: "Strength Builder Pro",
    description:
      "Advanced plan for building serious strength. Includes heavy lifts, accessory work, and recovery.",
    coverImage:
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    price: 59,
    duration: 8,
    durationType: "weeks",
    keyFeatures: [
      "Heavy compound lifts",
      "Accessory work",
      "Mobility routines",
      "Weekly progress review",
    ],
    trainingType: "with-trainer",
    timeline: [
      {
        week: "1-2",
        title: "Base Building",
        description: "Establish baseline strength and technique.",
      },
      {
        week: "3-6",
        title: "Progressive Overload",
        description: "Increase weights, add volume.",
      },
      {
        week: "7-8",
        title: "Peak & Test",
        description: "Test maxes, deload, and review progress.",
      },
    ],
    features: {
      onlineCalls: false,
      support24_7: false,
      liveTraining: true,
      mealPlanning: false,
      recoveryPlans: true,
      progressTracking: true,
      flexibleScheduling: false,
      personalizedNutrition: false,
    },
    sessionsPerWeek: 5,
    sessionFormat: "inPerson",
    difficultyLevel: "advanced",
    schedule: [
      {
        day: "Monday",
        name: "Heavy Squat Day",
        type: "strength",
        duration: 75,
        exercises: [
          {
            name: "Barbell Back Squat",
            reps: 5,
            rest: 120,
            sets: 5,
            type: "strength",
            level: "advanced",
            imageUrl:
              "https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg",
            location: "gym",
            equipment: true,
            instructions: "Heavy squats, focus on depth and form.",
            muscleGroups: [
              { name: "quadriceps" },
              { name: "glutes" },
              { name: "core" },
            ],
          },
        ],
        description: "Heavy squats and accessory work.",
      },
      {
        day: "Wednesday",
        name: "Bench & Pull",
        type: "strength",
        duration: 70,
        exercises: [
          {
            name: "Barbell Bench Press",
            reps: 5,
            rest: 120,
            sets: 5,
            type: "strength",
            level: "advanced",
            imageUrl:
              "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
            location: "gym",
            equipment: true,
            instructions: "Heavy bench press, focus on control.",
            muscleGroups: [
              { name: "chest" },
              { name: "triceps" },
              { name: "shoulders" },
            ],
          },
          {
            name: "Pull-ups",
            reps: 8,
            rest: 90,
            sets: 4,
            type: "strength",
            level: "advanced",
            imageUrl:
              "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
            location: "gym",
            equipment: false,
            instructions: "Strict pull-ups, full range of motion.",
            muscleGroups: [{ name: "back" }, { name: "biceps" }],
          },
        ],
        description: "Bench press and pulling movements.",
      },
      {
        day: "Friday",
        name: "Deadlift & Mobility",
        type: "strength",
        duration: 80,
        exercises: [
          {
            name: "Barbell Deadlift",
            reps: 5,
            rest: 120,
            sets: 5,
            type: "strength",
            level: "advanced",
            imageUrl:
              "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
            location: "gym",
            equipment: true,
            instructions: "Heavy deadlifts, focus on hip drive.",
            muscleGroups: [
              { name: "hamstrings" },
              { name: "glutes" },
              { name: "lower back" },
            ],
          },
          {
            name: "Mobility Flow",
            reps: 1,
            rest: 0,
            sets: 1,
            type: "mobility",
            level: "advanced",
            imageUrl:
              "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg",
            location: "home",
            equipment: false,
            instructions: "Full body mobility routine for recovery.",
            muscleGroups: [{ name: "full body" }],
          },
        ],
        description: "Deadlifts and mobility work.",
      },
    ],
  },
];

export const NUTRITION_PLAN_CONFIG = [
  {
    title: "Plan ishrane za mišićnu masu",
    description:
      "Detaljan plan ishrane za izgradnju mišićne mase, s visokim unosom proteina i balansiranim obrocima.",
    coverImage:
      "https://storage.googleapis.com/antique-body-app/cover-images/b57ed1dd-08bd-4d02-8c4d-61472a77c99d.png",
    price: 100,
    duration: 8,
    durationType: "months",
    keyFeatures: [
      "Plan po ishrani",
      "Visok unos proteina",
      "Prilagodljivo ciljevima",
      "Uključene preporuke za suplemente",
    ],
    timeline: [
      {
        week: "prva sedmica",
        title: "Sedmica gojaznih",
        description:
          "Fokus na navikavanje na novi režim i povećanje unosa proteina.",
      },
    ],
    nutritionInfo: {
      fats: "00",
      carbs: "100",
      protein: "200",
      calories: "2000",
    },
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    supplementRecommendations: "Whey protein",
    cookingTime: "30-40 min",
    targetGoal: "muscle-gain",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Doručak",
            time: "08:00",
            options: [
              {
                name: "Post-Workout Protein Pancakes",
                fat: 12,
                carbs: 45,
                protein: 38,
                calories: 485,
                imageUrl:
                  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
                description:
                  "1. Blend oats into flour. 2. Mix protein powder, oat flour, baking powder, cinnamon. 3. Combine egg whites, mashed banana, almond milk. 4. Mix wet and dry ingredients. 5. Cook pancakes in non-stick pan. 6. Top with Greek yogurt.",
                ingredients: [
                  "Protein powder (vanilla)",
                  "oats",
                  "egg whites",
                  "banana",
                  "Greek yogurt",
                  "cinnamon",
                  "baking powder",
                  "almond milk",
                ],
              },
              {
                name: "Lean Beef Power Bowl",
                fat: 22,
                carbs: 48,
                protein: 52,
                calories: 625,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "1. Cook brown rice and quinoa. 2. Roast diced sweet potato. 3. Sauté lean beef with garlic and onion. 4. Steam spinach and bell peppers. 5. Combine all ingredients in bowl. 6. Drizzle with olive oil.",
                ingredients: [
                  "Lean ground beef (93/7)",
                  "brown rice",
                  "sweet potato",
                  "spinach",
                  "quinoa",
                  "bell peppers",
                  "olive oil",
                  "garlic",
                  "onion",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "",
      },
      {
        name: "Day 2",
        meals: [
          {
            name: "Doručak",
            time: "08:00",
            options: [
              {
                name: "Post-Workout Protein Pancakes",
                fat: 12,
                carbs: 45,
                protein: 38,
                calories: 485,
                imageUrl:
                  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
                description:
                  "1. Blend oats into flour. 2. Mix protein powder, oat flour, baking powder, cinnamon. 3. Combine egg whites, mashed banana, almond milk. 4. Mix wet and dry ingredients. 5. Cook pancakes in non-stick pan. 6. Top with Greek yogurt.",
                ingredients: [
                  "Protein powder (vanilla)",
                  "oats",
                  "egg whites",
                  "banana",
                  "Greek yogurt",
                  "cinnamon",
                  "baking powder",
                  "almond milk",
                ],
              },
              {
                name: "Lean Beef Power Bowl",
                fat: 22,
                carbs: 48,
                protein: 52,
                calories: 625,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "1. Cook brown rice and quinoa. 2. Roast diced sweet potato. 3. Sauté lean beef with garlic and onion. 4. Steam spinach and bell peppers. 5. Combine all ingredients in bowl. 6. Drizzle with olive oil.",
                ingredients: [
                  "Lean ground beef (93/7)",
                  "brown rice",
                  "sweet potato",
                  "spinach",
                  "quinoa",
                  "bell peppers",
                  "olive oil",
                  "garlic",
                  "onion",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "",
      },
      {
        name: "Day 3",
        meals: [],
        isRestDay: true,
        description: "Cheat day: slobodan obrok ili poslastica.",
      },
    ],
    recommendedFrequency: "svaki dan",
    adaptability: "Može se prilagoditi individualnim potrebama",
  },
  {
    title: "Plan ishrane za definiciju",
    description:
      "Plan za gubitak masnog tkiva i očuvanje mišićne mase, s niskim udjelom masti i optimalnim unosom proteina.",
    coverImage:
      "https://images.pexels.com/photos/593836/pexels-photo-593836.jpeg",
    price: 80,
    duration: 6,
    durationType: "weeks",
    keyFeatures: [
      "Nizak unos masti",
      "Jednostavni recepti",
      "Prilagodba kalorija",
      "Brza priprema",
    ],
    timeline: [
      {
        week: "1-2",
        title: "Uvod u deficit",
        description: "Postepeno smanjenje kalorija i povećanje povrća.",
      },
    ],
    nutritionInfo: {
      fats: "30",
      carbs: "120",
      protein: "150",
      calories: "1600",
    },
    mealTypes: ["breakfast", "lunch", "dinner"],
    supplementRecommendations: "Multivitamin",
    cookingTime: "20-30 min",
    targetGoal: "fat-loss",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Proteinski omlet",
            time: "07:30",
            options: [
              {
                name: "Omlet od bjelanjaka",
                fat: 5,
                carbs: 8,
                protein: 25,
                calories: 180,
                imageUrl:
                  "https://images.pexels.com/photos/593836/pexels-photo-593836.jpeg",
                description:
                  "1. Umutiti bjelanjke, dodati povrće, peći na tavi bez ulja.",
                ingredients: ["bjelanjci", "paprika", "špinat", "paradajz"],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "",
      },
      {
        name: "Day 2",
        meals: [],
        isRestDay: true,
        description: "Dan za odmor i regeneraciju.",
      },
    ],
    recommendedFrequency: "svaki dan",
    adaptability: "Prilagodljivo vegetarijancima i osobama s alergijama",
  },
  {
    title: "Balansirani plan ishrane",
    description:
      "Plan za održavanje zdravlja i energije, s uravnoteženim makronutrijentima i raznovrsnim obrocima.",
    coverImage:
      "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
    price: 60,
    duration: 4,
    durationType: "weeks",
    keyFeatures: [
      "Balansirani makronutrijenti",
      "Obroci za cijelu porodicu",
      "Jednostavna priprema",
      "Raznovrsni recepti",
    ],
    timeline: [
      {
        week: "1",
        title: "Uvod u balansiranu prehranu",
        description: "Upoznavanje s osnovama i planiranje obroka.",
      },
    ],
    nutritionInfo: {
      fats: "40",
      carbs: "180",
      protein: "110",
      calories: "2000",
    },
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    supplementRecommendations: "Omega-3",
    cookingTime: "25-35 min",
    targetGoal: "health",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Zobena kaša",
            time: "08:00",
            options: [
              {
                name: "Zobena kaša s voćem",
                fat: 7,
                carbs: 40,
                protein: 10,
                calories: 220,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description:
                  "Skuhati zobene pahuljice u mlijeku, dodati voće po izboru.",
                ingredients: [
                  "zobene pahuljice",
                  "mlijeko",
                  "banana",
                  "borovnice",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "",
      },
    ],
    recommendedFrequency: "svaki dan",
    adaptability: "Pogodno za sve uzraste",
  },
];

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createDefaultPlansForTrainer(trainerInfoId) {
  // Check if plans already exist
  const existingTraining = await prisma.trainingPlan.count({
    where: { trainerInfoId },
  });
  const existingNutrition = await prisma.nutritionPlan.count({
    where: { trainerInfoId },
  });
  if (existingTraining > 0 || existingNutrition > 0) return;

  await Promise.all([
    ...TRAINING_PLAN_CONFIG.map((plan) =>
      prisma.trainingPlan.create({
        data: { ...plan, trainerInfoId, isActive: true, isPublished: false },
      })
    ),
    ...NUTRITION_PLAN_CONFIG.map((plan) =>
      prisma.nutritionPlan.create({
        data: { ...plan, trainerInfoId, isActive: true, isPublished: false },
      })
    ),
  ]);
}

// Utility functions for plan management (API calls)
const API_URL = "/api/users/trainer/plans";

export const fetchPlans = async (type = "training") => {
  const res = await fetch(`${API_URL}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

export const fetchPlanDetails = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}?type=${type}`);
  if (!res.ok) throw new Error("Failed to fetch plan details");
  return res.json();
};

export const createPlan = async (plan, type = "training") => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create plan");
  }
  return res.json();
};

export const updatePlan = async (planId, plan, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update plan");
  }
  return res.json();
};

export const putPlan = async (planId, plan, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...plan, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to replace plan");
  }
  return res.json();
};

export const deletePlan = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}?type=${type}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete plan");
  }
  return res.json();
};

export const softDeletePlan = async (planId, type = "training") => {
  const res = await fetch(`${API_URL}/${planId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: false, type }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to soft delete plan");
  }
  return res.json();
};
