export const NUTRITION_PLAN_TEMPLATES = [
  {
    title: "Weight Loss Kickstart",
    description:
      "A calorie deficit plan focused on healthy weight loss. Includes balanced macros, meal ideas, and daily calorie targets.",
    coverImage:
      "https://images.pexels.com/photos/593836/pexels-photo-593836.jpeg",
    price: 39,
    duration: 6,
    durationType: "weeks",
    keyFeatures: [
      "Calorie deficit",
      "Meal prep friendly",
      "Balanced macros",
      "Simple recipes",
      "Progress tracking",
    ],
    nutritionInfo: {
      calories: 1700,
      protein: 120,
      carbs: 180,
      fats: 50,
    },
    timeline: [
      {
        week: "1",
        title: "Kickoff & Assessment",
        description: "Initial assessment and meal planning.",
      },
      {
        week: "2-3",
        title: "Routine Building",
        description: "Establish healthy eating habits and meal prep.",
      },
      {
        week: "4-5",
        title: "Macro Focus",
        description: "Fine-tune macros and portion sizes.",
      },
      {
        week: "6",
        title: "Review & Adjust",
        description: "Assess progress and adjust plan as needed.",
      },
    ],
    targetGoal: "weight-loss",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Oatmeal with Berries",
                fat: 6,
                carbs: 40,
                protein: 8,
                calories: 220,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description: "Cook oats in water, top with fresh berries.",
                ingredients: ["oats", "water", "blueberries", "strawberries"],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Grilled Chicken Salad",
                fat: 8,
                carbs: 15,
                protein: 30,
                calories: 280,
                imageUrl:
                  "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
                description:
                  "Grilled chicken breast on mixed greens with vinaigrette.",
                ingredients: [
                  "chicken breast",
                  "mixed greens",
                  "olive oil",
                  "lemon",
                  "tomato",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Baked Salmon & Veggies",
                fat: 12,
                carbs: 18,
                protein: 28,
                calories: 320,
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "Baked salmon fillet with steamed broccoli and carrots.",
                ingredients: [
                  "salmon",
                  "broccoli",
                  "carrots",
                  "olive oil",
                  "lemon",
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
                name: "Greek Yogurt Bowl",
                fat: 4,
                carbs: 25,
                protein: 15,
                calories: 180,
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description: "Greek yogurt with honey and granola.",
                ingredients: ["Greek yogurt", "honey", "granola", "berries"],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Turkey Wrap",
                fat: 7,
                carbs: 30,
                protein: 22,
                calories: 250,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description: "Whole wheat wrap with turkey breast and veggies.",
                ingredients: [
                  "whole wheat wrap",
                  "turkey breast",
                  "lettuce",
                  "tomato",
                  "mustard",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "18:30",
            options: [
              {
                name: "Stir Fry Tofu & Veggies",
                fat: 10,
                carbs: 20,
                protein: 18,
                calories: 220,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "Tofu stir-fried with mixed vegetables and soy sauce.",
                ingredients: [
                  "tofu",
                  "broccoli",
                  "carrots",
                  "soy sauce",
                  "bell pepper",
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
    recommendedFrequency: "3 meals, 2 snacks per day",
    adaptability: "Flexible substitutions allowed",
    mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"],
    supplementRecommendations: "Multivitamin, Omega-3",
    cookingTime: "<30 min/day",
  },
  {
    title: "Muscle Gain Nutrition",
    description:
      "High-protein, calorie surplus plan for muscle growth. Includes meal ideas, macro breakdowns, and supplement tips.",
    coverImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    price: 49,
    duration: 8,
    durationType: "weeks",
    keyFeatures: [
      "High protein",
      "Calorie surplus",
      "Muscle building meals",
      "Supplement guidance",
      "Easy meal prep",
    ],
    nutritionInfo: {
      calories: 2500,
      protein: 180,
      carbs: 300,
      fats: 70,
    },
    timeline: [
      {
        week: "1-2",
        title: "Foundation",
        description: "Establish eating schedule and protein targets.",
      },
      {
        week: "3-5",
        title: "Surplus Phase",
        description: "Increase calories and track progress.",
      },
      {
        week: "6-8",
        title: "Refinement",
        description: "Adjust macros for optimal muscle gain.",
      },
    ],
    targetGoal: "muscle-gain",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "07:30",
            options: [
              {
                name: "Protein Pancakes",
                fat: 10,
                carbs: 50,
                protein: 30,
                calories: 350,
                imageUrl:
                  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
                description:
                  "Blend oats, protein powder, eggs, cook as pancakes.",
                ingredients: ["oats", "protein powder", "eggs", "banana"],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Chicken & Rice Bowl",
                fat: 8,
                carbs: 60,
                protein: 40,
                calories: 420,
                imageUrl:
                  "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
                description:
                  "Grilled chicken breast with brown rice and veggies.",
                ingredients: [
                  "chicken breast",
                  "brown rice",
                  "broccoli",
                  "carrots",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:30",
            options: [
              {
                name: "Beef Power Bowl",
                fat: 18,
                carbs: 55,
                protein: 45,
                calories: 600,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "Lean beef with sweet potato, spinach, and quinoa.",
                ingredients: ["lean beef", "sweet potato", "spinach", "quinoa"],
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
                name: "Egg & Avocado Toast",
                fat: 14,
                carbs: 35,
                protein: 20,
                calories: 320,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description: "Whole grain toast with avocado and poached eggs.",
                ingredients: ["whole grain bread", "avocado", "eggs"],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Tuna Pasta Salad",
                fat: 10,
                carbs: 60,
                protein: 35,
                calories: 410,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description: "Pasta salad with tuna, peas, and olive oil.",
                ingredients: ["pasta", "tuna", "peas", "olive oil"],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Turkey Chili",
                fat: 12,
                carbs: 40,
                protein: 38,
                calories: 390,
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description: "Lean turkey chili with beans and tomatoes.",
                ingredients: [
                  "lean turkey",
                  "beans",
                  "tomato",
                  "onion",
                  "spices",
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
        description: "Rest and recovery day.",
      },
    ],
    recommendedFrequency: "4 meals, 2 snacks per day",
    adaptability: "Vegetarian options included",
    mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"],
    supplementRecommendations: "Whey protein, Creatine",
    cookingTime: "<45 min/day",
  },
  {
    title: "Balanced Maintenance Plan",
    description:
      "A balanced nutrition plan for maintaining weight and health. Focuses on whole foods, variety, and flexible eating.",
    coverImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    price: 29,
    duration: 4,
    durationType: "weeks",
    keyFeatures: [
      "Balanced macros",
      "Whole foods",
      "Flexible meals",
      "Easy to follow",
      "Minimal prep",
    ],
    nutritionInfo: {
      calories: 2000,
      protein: 130,
      carbs: 220,
      fats: 60,
    },
    timeline: [
      {
        week: "1",
        title: "Kickoff",
        description: "Set up meal schedule and grocery list.",
      },
      {
        week: "2-3",
        title: "Routine",
        description: "Follow meal plan and adjust as needed.",
      },
      {
        week: "4",
        title: "Review",
        description: "Assess and maintain progress.",
      },
    ],
    targetGoal: "maintenance",
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
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
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Chicken Caesar Salad",
                fat: 12,
                carbs: 18,
                protein: 28,
                calories: 320,
                imageUrl:
                  "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
                description:
                  "Grilled chicken, romaine, croutons, Caesar dressing.",
                ingredients: [
                  "chicken breast",
                  "romaine",
                  "croutons",
                  "Caesar dressing",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Vegetable Stir Fry",
                fat: 10,
                carbs: 35,
                protein: 12,
                calories: 210,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "Mixed vegetables stir-fried with tofu and soy sauce.",
                ingredients: [
                  "tofu",
                  "broccoli",
                  "carrots",
                  "soy sauce",
                  "bell pepper",
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
                name: "Egg & Veggie Scramble",
                fat: 9,
                carbs: 10,
                protein: 14,
                calories: 170,
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description: "Eggs scrambled with spinach, tomato, and onion.",
                ingredients: ["eggs", "spinach", "tomato", "onion"],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Turkey Sandwich",
                fat: 8,
                carbs: 30,
                protein: 22,
                calories: 250,
                imageUrl:
                  "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg",
                description:
                  "Whole wheat bread, turkey, lettuce, tomato, mustard.",
                ingredients: [
                  "whole wheat bread",
                  "turkey",
                  "lettuce",
                  "tomato",
                  "mustard",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "18:30",
            options: [
              {
                name: "Grilled Fish & Veggies",
                fat: 11,
                carbs: 20,
                protein: 25,
                calories: 260,
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description: "Grilled white fish with roasted vegetables.",
                ingredients: [
                  "white fish",
                  "zucchini",
                  "bell pepper",
                  "olive oil",
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
        description: "Flexible day: adjust meals as needed.",
      },
    ],
    recommendedFrequency: "3 meals, 1 snack per day",
    adaptability: "Gluten-free options included",
    mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"],
    supplementRecommendations: "Optional",
    cookingTime: "<30 min/day",
  },
];
