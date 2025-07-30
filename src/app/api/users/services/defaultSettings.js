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
        title: "Adaptation Week",
        description:
          "Focus on adapting to the new regime and increasing protein intake.",
      },
    ],
    nutritionInfo: {
      fats: 65,
      carbs: 250,
      protein: 180,
      calories: 2500,
    },
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    supplementRecommendations: "Whey protein, Creatine, Multivitamin",
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
                dietary: ["high-protein", "vegetarian"],
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
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Lean Beef Power Bowl",
                fat: 22,
                carbs: 48,
                protein: 52,
                calories: 625,
                dietary: ["high-protein", "gluten-free"],
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
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Pre-Workout Energy Smoothie",
                fat: 8,
                carbs: 38,
                protein: 28,
                calories: 325,
                dietary: ["high-protein", "vegetarian"],
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "1. Add all ingredients to blender. 2. Blend until smooth and creamy. 3. Add ice for desired consistency. 4. Consume 30-45 minutes before workout.",
                ingredients: [
                  "Whey protein powder",
                  "banana",
                  "oats",
                  "almond milk",
                  "espresso shot",
                  "Greek yogurt",
                  "honey",
                  "ice",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Salmon Power Plate",
                fat: 28,
                carbs: 35,
                protein: 46,
                calories: 615,
                dietary: ["high-protein", "gluten-free", "keto"],
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "1. Season and bake salmon at 400°F for 15 minutes. 2. Cook quinoa with garlic. 3. Massage kale with lemon and olive oil. 4. Slice avocado and halve tomatoes. 5. Plate salmon over quinoa and kale. 6. Top with avocado and almonds.",
                ingredients: [
                  "Atlantic salmon fillet",
                  "quinoa",
                  "kale",
                  "avocado",
                  "cherry tomatoes",
                  "lemon",
                  "olive oil",
                  "garlic",
                  "almonds",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "High protein day to support muscle growth",
      },
      {
        name: "Day 2",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Egg White Protein Scramble",
                fat: 8,
                carbs: 18,
                protein: 32,
                calories: 285,
                dietary: ["high-protein", "vegetarian", "keto"],
                imageUrl:
                  "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg",
                description:
                  "1. Spray pan with cooking spray. 2. Sauté vegetables until tender. 3. Pour in egg whites and whole eggs. 4. Scramble until fluffy. 5. Add cheese and herbs. 6. Serve immediately.",
                ingredients: [
                  "Egg whites",
                  "whole eggs",
                  "spinach",
                  "mushrooms",
                  "bell peppers",
                  "low-fat cheese",
                  "cooking spray",
                  "herbs",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Grilled Chicken Meal Prep",
                fat: 18,
                carbs: 42,
                protein: 48,
                calories: 545,
                dietary: ["high-protein", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
                description:
                  "1. Season chicken with herbs and spices. 2. Grill chicken breast until cooked through. 3. Steam broccoli and asparagus. 4. Cook jasmine rice. 5. Portion into meal prep containers. 6. Drizzle with lemon and olive oil.",
                ingredients: [
                  "Chicken breast",
                  "jasmine rice",
                  "broccoli",
                  "asparagus",
                  "olive oil",
                  "lemon",
                  "herbs",
                  "garlic powder",
                  "paprika",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Casein Protein Night Bowl",
                fat: 8,
                carbs: 28,
                protein: 30,
                calories: 295,
                dietary: ["high-protein", "vegetarian"],
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "1. Mix casein protein with small amount of water to form paste. 2. Fold in Greek yogurt. 3. Add almond butter and vanilla. 4. Top with berries and chia seeds. 5. Consume before bed for overnight recovery.",
                ingredients: [
                  "Casein protein powder",
                  "Greek yogurt",
                  "almond butter",
                  "berries",
                  "chia seeds",
                  "vanilla extract",
                  "stevia",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Lean Steak Performance Meal",
                fat: 25,
                carbs: 48,
                protein: 55,
                calories: 665,
                dietary: ["high-protein", "gluten-free", "keto"],
                imageUrl:
                  "https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg",
                description:
                  "1. Season steak with garlic and rosemary. 2. Grill steak to desired doneness. 3. Roast sweet potato wedges. 4. Sauté green beans and mushrooms. 5. Let steak rest, then slice. 6. Drizzle with balsamic reduction.",
                ingredients: [
                  "Sirloin steak (lean cut)",
                  "sweet potato",
                  "green beans",
                  "mushrooms",
                  "garlic",
                  "rosemary",
                  "olive oil",
                  "balsamic vinegar",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Focus on lean proteins and complex carbs",
      },
      {
        name: "Day 3",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Cottage Cheese Power Bowl",
                fat: 12,
                carbs: 32,
                protein: 35,
                calories: 365,
                dietary: ["high-protein", "vegetarian", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "1. Place cottage cheese in bowl. 2. Add vanilla extract and cinnamon. 3. Top with granola and berries. 4. Drizzle with honey. 5. Sprinkle chopped walnuts. 6. Serve immediately.",
                ingredients: [
                  "Low-fat cottage cheese",
                  "granola",
                  "mixed berries",
                  "honey",
                  "walnuts",
                  "cinnamon",
                  "vanilla extract",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Chicken Protein Wrap",
                fat: 15,
                carbs: 42,
                protein: 45,
                calories: 485,
                dietary: ["high-protein"],
                imageUrl:
                  "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg",
                description:
                  "1. Slice grilled chicken breast. 2. Spread hummus on tortilla. 3. Layer lettuce, tomatoes, cucumber, onion. 4. Add chicken and feta cheese. 5. Roll tightly, securing with toothpick. 6. Cut in half to serve.",
                ingredients: [
                  "Whole wheat tortilla",
                  "grilled chicken breast",
                  "hummus",
                  "lettuce",
                  "tomatoes",
                  "cucumber",
                  "red onion",
                  "feta cheese",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Post-Workout Recovery Shake",
                fat: 8,
                carbs: 48,
                protein: 35,
                calories: 425,
                dietary: ["high-protein", "vegetarian"],
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "1. Add all ingredients to blender. 2. Blend until completely smooth. 3. Consume within 30 minutes post-workout for optimal recovery. 4. Add ice for preferred consistency.",
                ingredients: [
                  "Whey protein isolate",
                  "banana",
                  "white rice (cooked and cooled)",
                  "coconut water",
                  "leucine supplement",
                  "ice",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Turkey Meatball Pasta Bowl",
                fat: 20,
                carbs: 52,
                protein: 44,
                calories: 580,
                dietary: ["high-protein"],
                imageUrl:
                  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
                description:
                  "1. Mix turkey with egg, breadcrumbs, herbs for meatballs. 2. Bake meatballs at 375°F for 20 minutes. 3. Cook whole wheat pasta. 4. Heat marinara sauce. 5. Sauté spinach. 6. Combine all ingredients, top with parmesan.",
                ingredients: [
                  "Lean ground turkey",
                  "whole wheat pasta",
                  "spinach",
                  "marinara sauce",
                  "parmesan",
                  "egg",
                  "breadcrumbs",
                  "Italian herbs",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Carb cycling day with moderate carbs",
      },
      {
        name: "Day 4",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Turkey and Sweet Potato Hash",
                fat: 15,
                carbs: 42,
                protein: 38,
                calories: 445,
                dietary: ["high-protein", "gluten-free", "paleo"],
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "1. Dice and roast sweet potato. 2. Cook ground turkey with spices. 3. Sauté peppers and onion. 4. Combine turkey and vegetables. 5. Create wells and crack eggs into them. 6. Cover until eggs are cooked, add spinach.",
                ingredients: [
                  "Ground turkey (lean)",
                  "sweet potato",
                  "bell peppers",
                  "onion",
                  "eggs",
                  "spinach",
                  "olive oil",
                  "paprika",
                  "cumin",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Tuna Protein Salad",
                fat: 12,
                carbs: 25,
                protein: 42,
                calories: 385,
                dietary: ["high-protein", "gluten-free", "low-carb"],
                imageUrl:
                  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                description:
                  "1. Drain tuna and flake. 2. Mix Greek yogurt with lemon and mustard for dressing. 3. Combine mixed greens, cucumber, tomatoes, chickpeas. 4. Top with tuna. 5. Drizzle with yogurt dressing.",
                ingredients: [
                  "Canned tuna in water",
                  "mixed greens",
                  "chickpeas",
                  "cucumber",
                  "tomatoes",
                  "Greek yogurt",
                  "lemon juice",
                  "Dijon mustard",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Greek Yogurt Protein Parfait",
                fat: 8,
                carbs: 35,
                protein: 28,
                calories: 315,
                dietary: ["high-protein", "vegetarian", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "1. Mix protein powder into Greek yogurt. 2. Layer yogurt mixture with granola in glass. 3. Add layer of mixed berries. 4. Repeat layers. 5. Top with almonds and chia seeds. 6. Drizzle with honey.",
                ingredients: [
                  "Greek yogurt (0% fat)",
                  "protein powder",
                  "granola",
                  "mixed berries",
                  "honey",
                  "almonds",
                  "chia seeds",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Baked Cod with Quinoa",
                fat: 12,
                carbs: 48,
                protein: 42,
                calories: 485,
                dietary: ["high-protein", "gluten-free", "dairy-free"],
                imageUrl:
                  "https://images.pexels.com/photos/725993/pexels-photo-725993.jpeg",
                description:
                  "1. Season cod with herbs and lemon. 2. Bake cod at 400°F for 12-15 minutes. 3. Cook quinoa. 4. Sauté zucchini and squash with garlic. 5. Add cherry tomatoes at end. 6. Serve cod over quinoa and vegetables.",
                ingredients: [
                  "Cod fillet",
                  "quinoa",
                  "zucchini",
                  "yellow squash",
                  "lemon",
                  "herbs",
                  "olive oil",
                  "garlic",
                  "cherry tomatoes",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Lean protein focus with healthy fats",
      },
      {
        name: "Day 5",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Protein-Packed Oatmeal",
                fat: 12,
                carbs: 48,
                protein: 32,
                calories: 395,
                dietary: ["high-protein", "vegetarian"],
                imageUrl:
                  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
                description:
                  "1. Cook oats with almond milk. 2. Stir in protein powder when oats are nearly done. 3. Add peanut butter and cinnamon. 4. Top with sliced banana and chia seeds. 5. Drizzle with small amount of maple syrup.",
                ingredients: [
                  "Steel-cut oats",
                  "protein powder",
                  "almond milk",
                  "peanut butter",
                  "banana",
                  "chia seeds",
                  "cinnamon",
                  "maple syrup",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Mexican Protein Bowl",
                fat: 22,
                carbs: 45,
                protein: 42,
                calories: 535,
                dietary: ["high-protein", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "1. Cook brown rice with cilantro and lime. 2. Grill seasoned chicken breast. 3. Heat black beans with cumin. 4. Roast corn and bell peppers. 5. Assemble bowl with all ingredients. 6. Top with avocado, salsa, and Greek yogurt.",
                ingredients: [
                  "Grilled chicken",
                  "black beans",
                  "brown rice",
                  "avocado",
                  "salsa",
                  "corn",
                  "bell peppers",
                  "lime",
                  "cilantro",
                  "Greek yogurt",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Protein Smoothie Bowl",
                fat: 12,
                carbs: 42,
                protein: 32,
                calories: 395,
                dietary: ["high-protein", "vegetarian", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "1. Blend protein powder, frozen berries, banana, and yogurt until thick. 2. Pour into bowl. 3. Top with granola, coconut flakes, and hemp seeds. 4. Add fresh fruit if desired. 5. Serve immediately.",
                ingredients: [
                  "Vanilla protein powder",
                  "frozen berries",
                  "banana",
                  "Greek yogurt",
                  "granola",
                  "coconut flakes",
                  "hemp seeds",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Mediterranean Chicken Skewers",
                fat: 22,
                carbs: 35,
                protein: 48,
                calories: 525,
                dietary: ["high-protein", "gluten-free", "dairy-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "1. Cut chicken and vegetables into chunks. 2. Marinate in olive oil, lemon, and herbs. 3. Thread onto skewers alternating chicken and vegetables. 4. Grill 12-15 minutes, turning frequently. 5. Serve with crumbled feta. 6. Garnish with fresh herbs.",
                ingredients: [
                  "Chicken thighs",
                  "red bell peppers",
                  "zucchini",
                  "red onion",
                  "olive oil",
                  "lemon",
                  "oregano",
                  "garlic",
                  "feta cheese",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "High carb day for energy and recovery",
      },
      {
        name: "Day 6",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "High-Protein French Toast",
                fat: 18,
                carbs: 38,
                protein: 35,
                calories: 465,
                dietary: ["high-protein", "vegetarian"],
                imageUrl:
                  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
                description:
                  "1. Whisk eggs, egg whites, protein powder, and almond milk. 2. Add cinnamon and vanilla to mixture. 3. Dip bread slices in egg mixture. 4. Cook in non-stick pan until golden. 5. Top with Greek yogurt and berries. 6. Serve warm.",
                ingredients: [
                  "Whole grain bread",
                  "egg whites",
                  "whole eggs",
                  "protein powder",
                  "almond milk",
                  "cinnamon",
                  "vanilla",
                  "Greek yogurt",
                  "berries",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Asian Lettuce Cups with Ground Turkey",
                fat: 16,
                carbs: 22,
                protein: 38,
                calories: 385,
                dietary: ["high-protein", "gluten-free", "low-carb"],
                imageUrl:
                  "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg",
                description:
                  "1. Cook ground turkey until browned and cooked through. 2. Add ginger, garlic, and mushrooms. 3. Stir in diced water chestnuts. 4. Season with soy sauce and sesame oil. 5. Serve in lettuce cups. 6. Garnish with green onions.",
                ingredients: [
                  "Ground turkey",
                  "butter lettuce",
                  "water chestnuts",
                  "mushrooms",
                  "ginger",
                  "garlic",
                  "soy sauce",
                  "sesame oil",
                  "green onions",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Protein Power Muffins",
                fat: 12,
                carbs: 28,
                protein: 24,
                calories: 285,
                dietary: ["high-protein", "vegetarian", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
                description:
                  "1. Preheat oven to 350°F. 2. Mix dry ingredients in one bowl. 3. Combine wet ingredients in another bowl. 4. Fold wet into dry ingredients with blueberries. 5. Fill muffin cups and bake 18-20 minutes. 6. Cool before serving.",
                ingredients: [
                  "Almond flour",
                  "protein powder",
                  "eggs",
                  "Greek yogurt",
                  "blueberries",
                  "baking powder",
                  "vanilla",
                  "stevia",
                  "almond milk",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Italian Chicken Meatballs with Zucchini Noodles",
                fat: 28,
                carbs: 18,
                protein: 44,
                calories: 485,
                dietary: ["high-protein", "gluten-free", "low-carb"],
                imageUrl:
                  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
                description:
                  "1. Mix ground chicken with egg, almond flour, and Italian herbs. 2. Form into meatballs and bake at 375°F for 20 minutes. 3. Spiralize zucchini into noodles. 4. Heat marinara sauce. 5. Sauté zucchini noodles briefly. 6. Serve meatballs over noodles with sauce and parmesan.",
                ingredients: [
                  "Ground chicken",
                  "zucchini",
                  "marinara sauce",
                  "parmesan cheese",
                  "basil",
                  "oregano",
                  "garlic",
                  "egg",
                  "almond flour",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Low carb day to optimize fat burning",
      },
      {
        name: "Day 7",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "High-Protein Breakfast Quinoa Bowl",
                fat: 12,
                carbs: 52,
                protein: 28,
                calories: 425,
                dietary: ["high-protein", "vegetarian", "gluten-free"],
                imageUrl:
                  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
                description:
                  "1. Cook quinoa in almond milk until creamy. 2. Stir in protein powder while warm. 3. Add cinnamon and vanilla. 4. Top with sliced banana and walnuts. 5. Sprinkle with chia seeds. 6. Drizzle with maple syrup if desired.",
                ingredients: [
                  "Quinoa",
                  "almond milk",
                  "protein powder",
                  "banana",
                  "walnuts",
                  "cinnamon",
                  "vanilla",
                  "maple syrup",
                  "chia seeds",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Korean BBQ Pork Bowl",
                fat: 18,
                carbs: 48,
                protein: 45,
                calories: 555,
                dietary: ["high-protein", "gluten-free", "dairy-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "1. Marinate sliced pork in soy sauce, ginger, and garlic. 2. Cook brown rice. 3. Stir-fry pork until cooked through. 4. Prepare cucumber salad with sesame oil. 5. Assemble bowl with rice, pork, kimchi, and cucumber. 6. Garnish with sesame seeds.",
                ingredients: [
                  "Pork tenderloin",
                  "brown rice",
                  "kimchi",
                  "cucumber",
                  "sesame oil",
                  "soy sauce",
                  "ginger",
                  "garlic",
                  "sesame seeds",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Chocolate Protein Energy Balls",
                fat: 8,
                carbs: 18,
                protein: 12,
                calories: 185,
                dietary: ["high-protein", "vegetarian", "gluten-free", "vegan"],
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "1. Soak dates in warm water until soft. 2. Blend dates, protein powder, and almond butter. 3. Mix in oats and chia seeds. 4. Add vanilla extract. 5. Roll into balls and coat with coconut. 6. Refrigerate for 30 minutes before serving.",
                ingredients: [
                  "Chocolate protein powder",
                  "dates",
                  "almond butter",
                  "oats",
                  "chia seeds",
                  "coconut flakes",
                  "vanilla extract",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Stuffed Bell Peppers with Turkey",
                fat: 18,
                carbs: 35,
                protein: 38,
                calories: 465,
                dietary: ["high-protein", "gluten-free", "dairy-free"],
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "1. Cut tops off bell peppers and remove seeds. 2. Cook ground turkey with onions and garlic. 3. Mix in cauliflower rice and diced tomatoes. 4. Season with Italian herbs. 5. Stuff peppers with mixture. 6. Bake covered at 375°F for 25 minutes.",
                ingredients: [
                  "Bell peppers",
                  "ground turkey",
                  "cauliflower rice",
                  "onion",
                  "tomatoes",
                  "Italian herbs",
                  "garlic",
                  "olive oil",
                  "nutritional yeast",
                ],
              },
            ],
          },
        ],
        isRestDay: true,
        description: "Recovery day with lighter meals and flexibility",
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
  validDietaryOptions: [
    "high-protein",
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "keto",
    "paleo",
    "low-carb",
    "low-fat",
    "high-fiber",
    "anti-inflammatory",
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
