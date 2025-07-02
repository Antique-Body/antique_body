const mockPlans = [
  {
    id: "4",
    title: "Beginner Strength Program",
    description:
      "Full body strength program for beginners with progressive overload and proper technique focus.",
    summary:
      "A comprehensive strength-building program designed for beginners to establish proper form and build foundational strength.",
    image:
      "https://cdn.gymaholic.co/articles/best-workout-plans-for-women/woman.jpg",
    price: 99,
    createdAt: "2023-09-10",
    planType: "training",
    duration: "6 weeks",
    clientCount: 32,
    days: [
      { day: 1, focus: "Full Body Foundations", type: "Strength" },
      { day: 2, focus: "Mobility & Recovery", type: "Active Recovery" },
      { day: 3, focus: "Upper Body Focus", type: "Strength" },
      { day: 4, focus: "Core & Cardio", type: "Conditioning" },
      { day: 5, focus: "Lower Body Power", type: "Strength" },
      { day: 6, focus: "Active Recovery", type: "Flexibility" },
      { day: 7, focus: "Rest Day", type: "Rest" },
    ],
    nutrition: {
      dailyCalories: "1800-2200",
      macros: {
        protein: "30%",
        carbs: "45%",
        fats: "25%",
      },
      mealPlan:
        "Focus on whole foods with 3 main meals and 2 snacks. Protein with each meal to support muscle recovery.",
    },
    editUrl: "/trainer/dashboard/plans/training/4",
  },
  {
    id: "5",
    title: "HIIT Cardio Challenge",
    description:
      "High intensity interval training program designed to boost cardiovascular fitness and burn fat.",
    summary:
      "Intense cardio program that uses intervals of high-intensity work and active recovery to maximize calorie burn and improve endurance.",
    image:
      "https://media.istockphoto.com/id/1332405544/photo/asian-indian-mid-adult-macho-man-practicing-battle-rope-in-gym.jpg?s=612x612&w=0&k=20&c=pYcFTEk8u8TSfbyui90HPCAjctjvenjHnHT6rNy1-qA=",
    price: 89,
    createdAt: "2023-10-05",
    planType: "training",
    duration: "4 weeks",
    clientCount: 28,
    days: [
      { day: 1, focus: "Tabata Circuits", type: "HIIT" },
      { day: 2, focus: "Steady State Cardio", type: "Endurance" },
      { day: 3, focus: "Metabolic Conditioning", type: "HIIT" },
      { day: 4, focus: "Recovery & Mobility", type: "Active Recovery" },
      { day: 5, focus: "Sprint Intervals", type: "HIIT" },
    ],
    nutrition: {
      dailyCalories: "Caloric deficit of 300-500",
      macros: {
        protein: "35%",
        carbs: "40%",
        fats: "25%",
      },
      mealPlan:
        "Timed nutrition with carbs primarily before and after workouts. Focus on recovery with protein intake within 30 minutes post-workout.",
    },
    editUrl: "/trainer/dashboard/plans/training/5",
  },
  {
    id: "6",
    title: "Advanced Strength Training",
    description:
      "A comprehensive plan designed for building strength and muscle mass with compound exercises.",
    summary:
      "Advanced program for experienced lifters targeting maximum strength and muscle development through progressive overload.",
    image:
      "https://wallpapers.com/images/hd/man-picking-up-a-fitness-barbell-vdiphsb8pi2ktc5c.jpg",
    price: 129,
    createdAt: "2024-02-20",
    planType: "training",
    duration: "10 weeks",
    clientCount: 15,
    days: [
      { day: 1, focus: "Lower Body Power", type: "Strength" },
      { day: 2, focus: "Upper Body Push", type: "Strength" },
      { day: 3, focus: "Active Recovery", type: "Mobility" },
      { day: 4, focus: "Back & Biceps", type: "Hypertrophy" },
      { day: 5, focus: "Lower Body Hypertrophy", type: "Hypertrophy" },
      { day: 6, focus: "Conditioning Circuit", type: "Cardio" },
      { day: 7, focus: "Rest Day", type: "Rest" },
    ],
    nutrition: {
      dailyCalories: "2500-3000",
      macros: {
        protein: "30-35%",
        carbs: "45-50%",
        fats: "20-25%",
      },
      mealPlan:
        "High calorie and protein intake to support muscle growth. Strategically timed carbohydrates around workouts for optimal performance.",
    },
    editUrl: "/trainer/dashboard/plans/training/6",
  },
];

export default mockPlans;
