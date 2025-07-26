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
    trainingType: "with_trainer",
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
        day: 1,
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
    trainingType: "with_trainer",
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
        day: 2,
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
    trainingType: "with_trainer",
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
        day: 1,
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
    title: "Muscle Gain Nutrition Plan",
    description:
      "A detailed nutrition plan for building muscle mass, with high protein intake and balanced meals.",
    coverImage:
      "https://storage.googleapis.com/antique-body-app/cover-images/b57ed1dd-08bd-4d02-8c4d-61472a77c99d.png",
    price: 100,
    duration: 8,
    durationType: "months",
    keyFeatures: [
      "Meal-based plan",
      "High protein intake",
      "Customizable to goals",
      "Supplement recommendations included",
    ],
    timeline: [
      {
        week: "First week",
        title: "Obese Week",
        description:
          "Focus on adapting to the new regime and increasing protein intake.",
      },
    ],
    nutritionInfo: {
      fats: 0,
      carbs: 100,
      protein: 200,
      calories: 2000,
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
            name: "Breakfast",
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
            name: "Breakfast",
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
        description: "Cheat day: free meal or dessert.",
      },
    ],
    recommendedFrequency: "every day",
    adaptability: "Can be adapted to individual needs",
  },
  {
    title: "Definition Nutrition Plan",
    description:
      "A plan for fat loss and muscle preservation, with low fat and optimal protein intake.",
    coverImage:
      "https://www.allrecipes.com/thmb/xPSphQUyrNBb_DIAVBS1NcvxtKY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/69471-baby-spinach-omelet-hero-4x3-5e7db70704f141edb6aee119a1d750c6.jpg",
    price: 80,
    duration: 6,
    durationType: "weeks",
    keyFeatures: [
      "Low fat intake",
      "Simple recipes",
      "Calorie adjustment",
      "Quick preparation",
    ],
    timeline: [
      {
        week: "1-2",
        title: "Introduction to Deficit",
        description: "Gradual calorie reduction and increased vegetables.",
      },
    ],
    nutritionInfo: {
      fats: 30,
      carbs: 120,
      protein: 150,
      calories: 1600,
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
            name: "Protein Omelette",
            time: "07:30",
            options: [
              {
                name: "Egg White Omelette",
                fat: 5,
                carbs: 8,
                protein: 25,
                calories: 180,
                imageUrl:
                  "https://www.allrecipes.com/thmb/xPSphQUyrNBb_DIAVBS1NcvxtKY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/69471-baby-spinach-omelet-hero-4x3-5e7db70704f141edb6aee119a1d750c6.jpg",
                description:
                  "1. Whisk egg whites, add vegetables, cook in a pan without oil.",
                ingredients: ["egg whites", "bell pepper", "spinach", "tomato"],
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
        description: "Rest and recovery day.",
      },
    ],
    recommendedFrequency: "every day",
    adaptability: "Adaptable for vegetarians and people with allergies",
  },
  {
    title: "Balanced Nutrition Plan",
    description:
      "A plan for maintaining health and energy, with balanced macronutrients and diverse meals.",
    coverImage:
      "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
    price: 60,
    duration: 4,
    durationType: "weeks",
    keyFeatures: [
      "Balanced macronutrients",
      "Family-friendly meals",
      "Easy preparation",
      "Diverse recipes",
    ],
    timeline: [
      {
        week: "1",
        title: "Introduction to Balanced Nutrition",
        description: "Learning the basics and meal planning.",
      },
    ],
    nutritionInfo: {
      fats: 40,
      carbs: 180,
      protein: 110,
      calories: 2000,
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
            name: "Oatmeal",
            time: "08:00",
            options: [
              {
                name: "Oatmeal with Fruit",
                fat: 7,
                carbs: 40,
                protein: 10,
                calories: 220,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description: "Cook oats in milk, add fruit of choice.",
                ingredients: ["oats", "milk", "banana", "blueberries"],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "",
      },
    ],
    recommendedFrequency: "every day",
    adaptability: "Suitable for all ages",
  },
];

export const EXERCISE_CONFIG = {
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
export const DEFAULT_EXERCISES = [
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
      "https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg",
    videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
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
      "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg",
    videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
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
      "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
    videoUrl: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
  },
];

export const MEAL_CONFIG = {
  requiredFields: [
    "name",
    "mealType",
    "difficulty",
    "preparationTime",
    "ingredients",
    "recipe",
  ],
  validMealTypes: ["breakfast", "lunch", "dinner", "snack", "dessert"],
  validDifficulties: ["easy", "medium", "hard"],
  validCuisines: [
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
  ],
};

// Default meals data
export const DEFAULT_MEALS = [
  {
    name: "Greek Yogurt Bowl",
    mealType: "breakfast",
    difficulty: "easy",
    preparationTime: 5,
    calories: 320,
    protein: 20,
    carbs: 35,
    fat: 8,
    dietary: ["vegetarian", "gluten-free"],
    cuisine: "mediterranean",
    ingredients: "Greek yogurt, honey, granola, mixed berries, chia seeds",
    recipe:
      "1. Place Greek yogurt in a bowl. 2. Top with granola and mixed berries. 3. Drizzle with honey. 4. Sprinkle chia seeds on top. 5. Serve immediately.",
    imageUrl:
      "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
    videoUrl: null,
  },
  {
    name: "Grilled Chicken Salad",
    mealType: "lunch",
    difficulty: "medium",
    preparationTime: 25,
    calories: 450,
    protein: 35,
    carbs: 15,
    fat: 28,
    dietary: ["gluten-free", "high-protein"],
    cuisine: "american",
    ingredients:
      "Chicken breast, mixed greens, cherry tomatoes, cucumber, avocado, olive oil, lemon juice",
    recipe:
      "1. Season and grill chicken breast for 6-8 minutes per side. 2. Let rest and slice. 3. Combine mixed greens, tomatoes, cucumber in a bowl. 4. Top with sliced chicken and avocado. 5. Drizzle with olive oil and lemon juice.",
    imageUrl:
      "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
    videoUrl: null,
  },
  {
    name: "Salmon Teriyaki Bowl",
    mealType: "dinner",
    difficulty: "medium",
    preparationTime: 30,
    calories: 520,
    protein: 40,
    carbs: 45,
    fat: 18,
    dietary: ["gluten-free", "high-protein"],
    cuisine: "asian",
    ingredients:
      "Salmon fillet, brown rice, broccoli, carrots, teriyaki sauce, sesame seeds",
    recipe:
      "1. Cook brown rice according to package instructions. 2. Steam broccoli and carrots until tender. 3. Pan-sear salmon with teriyaki sauce for 4-5 minutes per side. 4. Serve salmon over rice with vegetables. 5. Garnish with sesame seeds.",
    imageUrl:
      "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
    videoUrl: null,
  },
];
