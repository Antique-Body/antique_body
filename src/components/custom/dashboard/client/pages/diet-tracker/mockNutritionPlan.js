// Mock nutrition plans for different goals
export const mockNutritionPlans = [
  {
    id: "lean-bulk-plan",
    title: "Lean Bulk Muscle Gain Plan",
    subtitle: "Build lean muscle mass with precision nutrition",
    description:
      "A scientifically designed nutrition plan for building lean muscle mass with minimal fat gain. Features high protein intake, strategic carb timing, and balanced meals to fuel your muscle growth.",
    goal: "Build lean muscle mass",
    coverImage:
      "https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2015/11/Person-Prepping-Vegetables-On-A-Cutting-Board-For-A-Meal-Plan-Prep.jpg?quality=86&strip=all",
    price: 120,
    duration: 12,
    durationType: "weeks",
    dailyCaloriesGoal: 2800,
    dailyProteinGoal: 200,
    dailyCarbsGoal: 300,
    dailyFatGoal: 100,
    nutritionInfo: {
      calories: 2800,
      protein: 200,
      carbs: 300,
      fats: 100,
    },
    color: "#10B981", // Green
    icon: "mdi:dumbbell",
    tags: ["High Protein", "Muscle Building", "Performance"],
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "07:00",
            options: [
              {
                name: "Protein Pancake Stack",
                calories: 520,
                protein: 42,
                carbs: 48,
                fat: 14,
                imageUrl:
                  "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
                description:
                  "High-protein pancakes with Greek yogurt and berries for muscle fuel.",
                ingredients: [
                  "Oat flour",
                  "Protein powder",
                  "Eggs",
                  "Greek yogurt",
                  "Berries",
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
                calories: 680,
                protein: 55,
                carbs: 52,
                fat: 22,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "Lean ground beef with quinoa, sweet potato, and vegetables.",
                ingredients: [
                  "Lean ground beef",
                  "Quinoa",
                  "Sweet potato",
                  "Spinach",
                  "Bell peppers",
                ],
              },
            ],
          },
          {
            name: "Pre-Workout",
            time: "16:00",
            options: [
              {
                name: "Energy Boost Smoothie",
                calories: 380,
                protein: 32,
                carbs: 45,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "Perfect pre-workout fuel with fast-acting carbs and protein.",
                ingredients: [
                  "Whey protein",
                  "Banana",
                  "Oats",
                  "Almond milk",
                  "Honey",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:30",
            options: [
              {
                name: "Salmon Power Plate",
                calories: 620,
                protein: 48,
                carbs: 38,
                fat: 28,
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "Atlantic salmon with quinoa and roasted vegetables.",
                ingredients: [
                  "Salmon fillet",
                  "Quinoa",
                  "Broccoli",
                  "Asparagus",
                  "Olive oil",
                ],
              },
            ],
          },
          {
            name: "Evening Snack",
            time: "21:30",
            options: [
              {
                name: "Casein Recovery Bowl",
                calories: 320,
                protein: 35,
                carbs: 28,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "Slow-digesting protein for overnight muscle recovery.",
                ingredients: [
                  "Casein protein",
                  "Greek yogurt",
                  "Berries",
                  "Almonds",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description:
          "High-calorie muscle building day with optimal protein timing",
      },
    ],
    type: "nutrition",
  },

  {
    id: "rapid-fat-loss-plan",
    title: "Rapid Fat Loss Cut Plan",
    subtitle: "Lose weight quickly while preserving muscle",
    description:
      "An aggressive yet sustainable fat loss plan designed to help you shed weight rapidly while maintaining lean muscle mass. Features strategic meal timing and nutrient-dense foods.",
    goal: "Lose weight quickly while preserving muscle",
    coverImage:
      "https://c4.wallpaperflare.com/wallpaper/664/878/471/sportswear-tape-measure-weight-loss-wallpaper-preview.jpg",
    price: 100,
    duration: 8,
    durationType: "weeks",
    dailyCaloriesGoal: 1600,
    dailyProteinGoal: 160,
    dailyCarbsGoal: 120,
    dailyFatGoal: 60,
    nutritionInfo: {
      calories: 1600,
      protein: 160,
      carbs: 120,
      fats: 60,
    },
    color: "#EF4444", // Red
    icon: "mdi:fire",
    tags: ["Fat Loss", "High Protein", "Low Calorie"],
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Egg White Veggie Scramble",
                calories: 280,
                protein: 32,
                carbs: 18,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg",
                description:
                  "High-protein, low-calorie breakfast to kickstart your metabolism.",
                ingredients: [
                  "Egg whites",
                  "Spinach",
                  "Mushrooms",
                  "Bell peppers",
                  "Low-fat cheese",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Grilled Chicken Salad",
                calories: 420,
                protein: 45,
                carbs: 25,
                fat: 12,
                imageUrl:
                  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                description:
                  "Lean protein with nutrient-dense vegetables and light dressing.",
                ingredients: [
                  "Chicken breast",
                  "Mixed greens",
                  "Cucumber",
                  "Tomatoes",
                  "Balsamic vinegar",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "16:00",
            options: [
              {
                name: "Protein Shake",
                calories: 180,
                protein: 30,
                carbs: 8,
                fat: 2,
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description:
                  "Quick protein boost to maintain muscle during cutting phase.",
                ingredients: ["Whey protein isolate", "Water", "Ice", "Stevia"],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Baked Cod with Vegetables",
                calories: 380,
                protein: 42,
                carbs: 22,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/725993/pexels-photo-725993.jpeg",
                description:
                  "Lean white fish with fiber-rich vegetables for satiety.",
                ingredients: [
                  "Cod fillet",
                  "Zucchini",
                  "Brussels sprouts",
                  "Lemon",
                  "Herbs",
                ],
              },
            ],
          },
          {
            name: "Evening Snack",
            time: "21:00",
            options: [
              {
                name: "Greek Yogurt Bowl",
                calories: 160,
                protein: 20,
                carbs: 12,
                fat: 4,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description: "Low-calorie, high-protein evening snack.",
                ingredients: ["Greek yogurt (0% fat)", "Berries", "Cinnamon"],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Low-calorie, high-protein day optimized for fat loss",
      },
    ],
    type: "nutrition",
  },

  {
    id: "keto-fat-burn-plan",
    title: "Low-Carb Keto Fat Burn Plan",
    subtitle: "Burn fat through ketosis",
    description:
      "A ketogenic nutrition plan designed to put your body into ketosis for maximum fat burning. High in healthy fats, moderate protein, and very low carbs.",
    goal: "Burn fat through ketosis",
    coverImage:
      "https://www.drberg.com/wp-content/uploads/2025/04/ketogenic-low-carbs-diet-concept-healthy-10_125893.jpg?w=992&h=672",
    price: 110,
    duration: 10,
    durationType: "weeks",
    dailyCaloriesGoal: 2000,
    dailyProteinGoal: 130,
    dailyCarbsGoal: 25,
    dailyFatGoal: 155,
    nutritionInfo: {
      calories: 2000,
      protein: 130,
      carbs: 25,
      fats: 155,
    },
    color: "#8B5CF6", // Purple
    icon: "mdi:lightning-bolt",
    tags: ["Keto", "High Fat", "Very Low Carb"],
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Keto Avocado Eggs",
                calories: 480,
                protein: 28,
                carbs: 6,
                fat: 38,
                imageUrl:
                  "https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg",
                description:
                  "Creamy avocado boats filled with eggs and topped with cheese.",
                ingredients: [
                  "Avocado",
                  "Eggs",
                  "Bacon",
                  "Cheddar cheese",
                  "Chives",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Salmon Spinach Salad",
                calories: 520,
                protein: 35,
                carbs: 8,
                fat: 38,
                imageUrl:
                  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                description:
                  "Rich salmon with spinach, avocado, and olive oil dressing.",
                ingredients: [
                  "Salmon",
                  "Spinach",
                  "Avocado",
                  "Olive oil",
                  "Walnuts",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "16:00",
            options: [
              {
                name: "Fat Bomb Smoothie",
                calories: 320,
                protein: 15,
                carbs: 5,
                fat: 28,
                imageUrl:
                  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg",
                description: "High-fat smoothie to maintain ketosis.",
                ingredients: [
                  "Coconut oil",
                  "MCT oil",
                  "Protein powder",
                  "Coconut milk",
                  "Stevia",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Ribeye with Butter Vegetables",
                calories: 680,
                protein: 52,
                carbs: 6,
                fat: 48,
                imageUrl:
                  "https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg",
                description:
                  "Juicy ribeye steak with butter-sautéed low-carb vegetables.",
                ingredients: [
                  "Ribeye steak",
                  "Asparagus",
                  "Mushrooms",
                  "Butter",
                  "Garlic",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "High-fat, very low-carb day to maintain ketosis",
      },
    ],
    type: "nutrition",
  },

  {
    id: "balanced-maintenance-plan",
    title: "Balanced Weight Maintenance Plan",
    subtitle: "Maintain current healthy weight",
    description:
      "A perfectly balanced nutrition plan to maintain your current healthy weight. Features a variety of whole foods with balanced macronutrients for sustained energy and health.",
    goal: "Maintain current healthy weight",
    coverImage:
      "https://thumbs.dreamstime.com/b/holding-schematic-meal-plan-diet-various-healthy-products-background-weight-loss-right-nutrition-concept-162073789.jpg",
    price: 80,
    duration: 12,
    durationType: "weeks",
    dailyCaloriesGoal: 2200,
    dailyProteinGoal: 140,
    dailyCarbsGoal: 240,
    dailyFatGoal: 90,
    nutritionInfo: {
      calories: 2200,
      protein: 140,
      carbs: 240,
      fats: 90,
    },
    color: "#3B82F6", // Blue
    icon: "mdi:scale-balance",
    tags: ["Balanced", "Maintenance", "Sustainable"],
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Overnight Oats Bowl",
                calories: 420,
                protein: 22,
                carbs: 52,
                fat: 12,
                imageUrl:
                  "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
                description:
                  "Nutritious overnight oats with protein powder and fresh fruits.",
                ingredients: [
                  "Oats",
                  "Protein powder",
                  "Greek yogurt",
                  "Berries",
                  "Almond butter",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "12:30",
            options: [
              {
                name: "Mediterranean Bowl",
                calories: 540,
                protein: 32,
                carbs: 58,
                fat: 18,
                imageUrl:
                  "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg",
                description:
                  "Fresh Mediterranean flavors with quinoa, chicken, and vegetables.",
                ingredients: [
                  "Chicken breast",
                  "Quinoa",
                  "Chickpeas",
                  "Cucumber",
                  "Feta cheese",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "15:30",
            options: [
              {
                name: "Apple with Almond Butter",
                calories: 280,
                protein: 8,
                carbs: 32,
                fat: 14,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description: "Simple, satisfying snack with natural sweetness.",
                ingredients: ["Apple", "Almond butter", "Cinnamon"],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Herb-Crusted Chicken with Sweet Potato",
                calories: 520,
                protein: 42,
                carbs: 45,
                fat: 18,
                imageUrl:
                  "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
                description:
                  "Perfectly seasoned chicken with roasted sweet potato and greens.",
                ingredients: [
                  "Chicken thigh",
                  "Sweet potato",
                  "Mixed greens",
                  "Herbs",
                  "Olive oil",
                ],
              },
            ],
          },
          {
            name: "Evening Snack",
            time: "21:00",
            options: [
              {
                name: "Greek Yogurt Parfait",
                calories: 240,
                protein: 18,
                carbs: 28,
                fat: 6,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "Light evening treat with probiotics and antioxidants.",
                ingredients: ["Greek yogurt", "Granola", "Berries", "Honey"],
              },
            ],
          },
        ],
        isRestDay: false,
        description: "Balanced nutrition day with variety and moderation",
      },
    ],
    type: "nutrition",
  },

  {
    id: "plant-based-loss-plan",
    title: "Plant-Based Weight Loss Plan",
    subtitle: "Lose weight on a vegan diet",
    description:
      "A comprehensive plant-based nutrition plan for weight loss. Rich in fiber, plant proteins, and nutrient-dense foods while keeping calories controlled for effective weight management.",
    goal: "Lose weight on a vegan diet",
    coverImage:
      "https://www.verywellfit.com/thmb/a-jxm4m24yQQnwZ7W3Y3_7zol-o=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Vegan-Weight-Loss-Meal-PlanV2-b0d769515c1b4beaacf1584d6c7287a6.png",
    price: 90,
    duration: 10,
    durationType: "weeks",
    dailyCaloriesGoal: 1800,
    dailyProteinGoal: 110,
    dailyCarbsGoal: 200,
    dailyFatGoal: 65,
    nutritionInfo: {
      calories: 1800,
      protein: 110,
      carbs: 200,
      fats: 65,
    },
    color: "#059669", // Emerald
    icon: "mdi:leaf",
    tags: ["Plant-Based", "Vegan", "High Fiber"],
    days: [
      {
        name: "Day 1",
        meals: [
          {
            name: "Breakfast",
            time: "08:00",
            options: [
              {
                name: "Protein Smoothie Bowl",
                calories: 380,
                protein: 28,
                carbs: 45,
                fat: 12,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "Thick smoothie bowl topped with fresh fruits and seeds.",
                ingredients: [
                  "Plant protein powder",
                  "Banana",
                  "Berries",
                  "Chia seeds",
                  "Coconut flakes",
                ],
              },
            ],
          },
          {
            name: "Lunch",
            time: "13:00",
            options: [
              {
                name: "Buddha Bowl with Tahini",
                calories: 480,
                protein: 22,
                carbs: 58,
                fat: 18,
                imageUrl:
                  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
                description:
                  "Colorful bowl with quinoa, legumes, and creamy tahini dressing.",
                ingredients: [
                  "Quinoa",
                  "Chickpeas",
                  "Roasted vegetables",
                  "Tahini",
                  "Hemp seeds",
                ],
              },
            ],
          },
          {
            name: "Snack",
            time: "16:00",
            options: [
              {
                name: "Hummus with Vegetables",
                calories: 220,
                protein: 12,
                carbs: 22,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "Protein-rich hummus with crunchy fresh vegetables.",
                ingredients: [
                  "Hummus",
                  "Carrots",
                  "Celery",
                  "Bell peppers",
                  "Cucumber",
                ],
              },
            ],
          },
          {
            name: "Dinner",
            time: "19:00",
            options: [
              {
                name: "Lentil Walnut Bolognese",
                calories: 450,
                protein: 25,
                carbs: 52,
                fat: 15,
                imageUrl:
                  "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg",
                description:
                  "Hearty plant-based bolognese with lentils and walnuts over pasta.",
                ingredients: [
                  "Red lentils",
                  "Walnuts",
                  "Whole wheat pasta",
                  "Tomato sauce",
                  "Nutritional yeast",
                ],
              },
            ],
          },
          {
            name: "Evening Snack",
            time: "21:00",
            options: [
              {
                name: "Chia Pudding",
                calories: 180,
                protein: 8,
                carbs: 18,
                fat: 8,
                imageUrl:
                  "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg",
                description:
                  "Creamy chia pudding with almond milk and vanilla.",
                ingredients: [
                  "Chia seeds",
                  "Almond milk",
                  "Vanilla",
                  "Maple syrup",
                  "Berries",
                ],
              },
            ],
          },
        ],
        isRestDay: false,
        description:
          "Plant-based day focused on whole foods and complete proteins",
      },
    ],
    type: "nutrition",
  },
];

// Keep the original for backward compatibility
export const mockNutritionPlan = mockNutritionPlans[0];
