const mockPlans = [
  {
    id: "football-pro",
    title: "Football Pro Training",
    type: "Football",
    summary:
      "Professional training plan designed for football players to enhance endurance, agility, and explosive power.",
    description:
      "This comprehensive football training plan is designed to improve all aspects of a player's performance on the field. Focus areas include cardiovascular endurance, explosive power for sprinting and jumping, agility for quick direction changes, and sport-specific drills to enhance ball control and field awareness.",
    forAthletes: "Football players at intermediate to advanced levels",
    days: [
      {
        day: 1,
        focus: "Lower Body Power",
        exercises: [
          { name: "Squat Jumps", sets: 4, reps: "10", rest: "60 sec" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "12 each leg", rest: "45 sec" },
          { name: "Box Jumps", sets: 4, reps: "8", rest: "90 sec" },
          { name: "Agility Ladder Drills", sets: 3, reps: "30 sec", rest: "30 sec" },
          { name: "Sprint Intervals", sets: 10, reps: "20m", rest: "45 sec" },
        ],
      },
      {
        day: 2,
        focus: "Upper Body & Core",
        exercises: [
          { name: "Push-ups", sets: 4, reps: "15", rest: "45 sec" },
          { name: "Medicine Ball Throws", sets: 3, reps: "12", rest: "60 sec" },
          { name: "Pull-ups", sets: 3, reps: "max", rest: "90 sec" },
          { name: "Plank Variations", sets: 3, reps: "45 sec", rest: "30 sec" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", rest: "45 sec" },
        ],
      },
      {
        day: 3,
        focus: "Agility & Reaction",
        exercises: [
          { name: "Cone Drills", sets: 4, reps: "30 sec", rest: "30 sec" },
          { name: "Shuttle Runs", sets: 5, reps: "40m", rest: "45 sec" },
          { name: "Reaction Ball Drills", sets: 3, reps: "1 min", rest: "45 sec" },
          { name: "T-Drill", sets: 4, reps: "1", rest: "60 sec" },
          { name: "Side-to-Side Hops", sets: 3, reps: "20", rest: "45 sec" },
        ],
      },
      {
        day: 4,
        focus: "Endurance & Recovery",
        exercises: [
          { name: "Tempo Runs", sets: 1, reps: "20 min", rest: "0" },
          { name: "Dynamic Stretching", sets: 1, reps: "10 min", rest: "0" },
          { name: "Foam Rolling", sets: 1, reps: "10 min", rest: "0" },
          { name: "Light Technical Drills", sets: 5, reps: "2 min", rest: "1 min" },
          { name: "Yoga for Athletes", sets: 1, reps: "20 min", rest: "0" },
        ],
      },
    ],
    nutrition: {
      dailyCalories: 2800,
      macros: {
        protein: "30%",
        carbs: "50%",
        fats: "20%",
      },
      mealPlan:
        "High carb intake on training days, moderate protein throughout, focus on recovery nutrition post-training",
    },
  },
  {
    id: "basketball-elite",
    title: "Basketball Elite Performance",
    type: "Basketball",
    summary: "Elite basketball training plan focused on vertical jump, quick footwork, and game-specific conditioning.",
    description:
      "This basketball-specific training plan is designed to enhance the key physical attributes needed on the court: vertical jumping ability, rapid acceleration and deceleration, lateral quickness, and sport-specific endurance. Incorporates both strength training and skill development.",
    forAthletes: "Basketball players looking to improve their physical performance",
    days: [
      {
        day: 1,
        focus: "Vertical Jump & Power",
        exercises: [
          { name: "Depth Jumps", sets: 4, reps: "8", rest: "90 sec" },
          { name: "Weighted Squats", sets: 4, reps: "6-8", rest: "2 min" },
          { name: "Calf Raises", sets: 3, reps: "15", rest: "45 sec" },
          { name: "Box Jumps", sets: 4, reps: "10", rest: "90 sec" },
          { name: "Single-Leg Bounds", sets: 3, reps: "10 each leg", rest: "60 sec" },
        ],
      },
      {
        day: 2,
        focus: "Lateral Quickness",
        exercises: [
          { name: "Defensive Slides", sets: 4, reps: "30 sec", rest: "30 sec" },
          { name: "Lateral Bounds", sets: 3, reps: "10 each side", rest: "45 sec" },
          { name: "Spider Drills", sets: 4, reps: "1", rest: "60 sec" },
          { name: "Lateral Resistance Band Walks", sets: 3, reps: "15 each side", rest: "45 sec" },
          { name: "Defensive Shuffle to Sprint", sets: 4, reps: "30 sec", rest: "30 sec" },
        ],
      },
      {
        day: 3,
        focus: "Upper Body & Core",
        exercises: [
          { name: "Medicine Ball Chest Pass", sets: 3, reps: "12", rest: "45 sec" },
          { name: "Pull-ups/Lat Pulldowns", sets: 4, reps: "10", rest: "60 sec" },
          { name: "Push-ups with Shoulder Tap", sets: 3, reps: "12", rest: "45 sec" },
          { name: "Rotational Medicine Ball Throws", sets: 3, reps: "10 each side", rest: "45 sec" },
          { name: "Hanging Leg Raises", sets: 3, reps: "12", rest: "45 sec" },
        ],
      },
      {
        day: 4,
        focus: "Game-Specific Conditioning",
        exercises: [
          { name: "Court Sprints (Baseline to Baseline)", sets: 10, reps: "1", rest: "30 sec" },
          { name: "Defensive Slide Conditioning", sets: 4, reps: "45 sec", rest: "30 sec" },
          { name: "3-Point Line Drills", sets: 5, reps: "1 min", rest: "45 sec" },
          { name: "Suicide Sprints", sets: 5, reps: "1", rest: "60 sec" },
          { name: "Jump Shot Conditioning", sets: 3, reps: "2 min", rest: "1 min" },
        ],
      },
    ],
    nutrition: {
      dailyCalories: 3000,
      macros: {
        protein: "25%",
        carbs: "55%",
        fats: "20%",
      },
      mealPlan:
        "Carbohydrate-focused for sustained energy, protein intake spread throughout the day, hydration strategy for games and practices",
    },
  },
  {
    id: "track-field-performance",
    title: "Track & Field Performance",
    type: "Athletics",
    summary:
      "Specialized training for track and field athletes with focus on explosive power, sprint mechanics, and event-specific training.",
    description:
      "This comprehensive track and field program is designed to develop the fundamental athletic qualities needed across various events: acceleration, maximum velocity, explosive power, and event-specific technical skills. Can be customized further based on specific events.",
    forAthletes: "Track and field athletes of all levels",
    days: [
      {
        day: 1,
        focus: "Sprint Technique",
        exercises: [
          { name: "A-Skips", sets: 3, reps: "20m", rest: "45 sec" },
          { name: "B-Skips", sets: 3, reps: "20m", rest: "45 sec" },
          { name: "Acceleration Drills", sets: 5, reps: "10-30m", rest: "90 sec" },
          { name: "Sprint Starts", sets: 8, reps: "20m", rest: "2 min" },
          { name: "Flying 30m", sets: 4, reps: "1", rest: "3 min" },
        ],
      },
      {
        day: 2,
        focus: "Plyometrics & Power",
        exercises: [
          { name: "Depth Jumps", sets: 4, reps: "6", rest: "90 sec" },
          { name: "Bounding", sets: 3, reps: "30m", rest: "2 min" },
          { name: "Single-Leg Hops", sets: 3, reps: "10 each leg", rest: "60 sec" },
          { name: "Standing Long Jump", sets: 5, reps: "3", rest: "90 sec" },
          { name: "Med Ball Throws", sets: 4, reps: "8", rest: "60 sec" },
        ],
      },
      {
        day: 3,
        focus: "Strength Development",
        exercises: [
          { name: "Power Cleans", sets: 5, reps: "3-5", rest: "2-3 min" },
          { name: "Back Squats", sets: 4, reps: "5", rest: "2-3 min" },
          { name: "Romanian Deadlifts", sets: 3, reps: "8", rest: "2 min" },
          { name: "Pull-ups", sets: 3, reps: "max", rest: "90 sec" },
          { name: "Core Circuit", sets: 3, reps: "30 sec each", rest: "30 sec" },
        ],
      },
      {
        day: 4,
        focus: "Speed Endurance",
        exercises: [
          { name: "150m Intervals", sets: 6, reps: "1", rest: "3 min" },
          { name: "Flying 40m x 4", sets: 3, reps: "1", rest: "4 min" },
          { name: "200m at 80%", sets: 4, reps: "1", rest: "4 min" },
          { name: "Ladder Sprints", sets: 1, reps: "300m-200m-100m", rest: "5 min" },
          { name: "Recovery Jog", sets: 1, reps: "10 min", rest: "0" },
        ],
      },
    ],
    nutrition: {
      dailyCalories: 3200,
      macros: {
        protein: "25%",
        carbs: "55%",
        fats: "20%",
      },
      mealPlan:
        "High carb on intense training days, protein for recovery, nutrient timing around workouts, competition day nutrition strategy",
    },
  },
  {
    id: "gym-burn-fat",
    title: "Burn Fat & Transform",
    type: "Gym",
    summary:
      "Fat-burning program designed to maximize calorie expenditure, boost metabolism, and achieve sustainable fat loss.",
    description:
      "This fat loss training program combines high-intensity interval training, strategic resistance training, and metabolic conditioning to maximize calorie burn both during and after workouts. The plan is designed to preserve muscle mass while targeting fat loss through a strategic combination of exercises.",
    forAthletes: "Anyone looking to reduce body fat while maintaining muscle mass",
    days: [
      {
        day: 1,
        focus: "HIIT & Upper Body",
        exercises: [
          { name: "Warm-up", sets: 1, reps: "5 min", rest: "0" },
          { name: "Circuit: Push-ups, Rows, Shoulder Press", sets: 3, reps: "45 sec each", rest: "15 sec" },
          { name: "EMOM: Battle Ropes, Mountain Climbers", sets: 10, reps: "30 sec work/30 sec rest", rest: "0" },
          { name: "Dumbbell Complex", sets: 4, reps: "8 each", rest: "60 sec" },
          { name: "Tabata Finisher", sets: 4, reps: "20 sec on/10 sec off", rest: "0" },
        ],
      },
      {
        day: 2,
        focus: "Lower Body & Core",
        exercises: [
          { name: "Goblet Squats", sets: 4, reps: "15", rest: "45 sec" },
          { name: "Romanian Deadlifts", sets: 4, reps: "12", rest: "45 sec" },
          { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "30 sec" },
          { name: "Plank Circuit", sets: 3, reps: "30 sec each variation", rest: "15 sec" },
          { name: "Interval Cardio", sets: 10, reps: "30 sec sprint/30 sec walk", rest: "0" },
        ],
      },
      {
        day: 3,
        focus: "Active Recovery",
        exercises: [
          { name: "Light Cardio", sets: 1, reps: "20 min", rest: "0" },
          { name: "Dynamic Stretching", sets: 1, reps: "10 min", rest: "0" },
          { name: "Foam Rolling", sets: 1, reps: "15 min", rest: "0" },
          { name: "Mobility Work", sets: 2, reps: "5 min", rest: "30 sec" },
          { name: "Light Yoga", sets: 1, reps: "20 min", rest: "0" },
        ],
      },
      {
        day: 4,
        focus: "Metabolic Resistance",
        exercises: [
          { name: "Kettlebell Swings", sets: 5, reps: "20", rest: "30 sec" },
          { name: "Burpees", sets: 5, reps: "10", rest: "30 sec" },
          { name: "Rower Intervals", sets: 6, reps: "250m", rest: "60 sec" },
          { name: "Medicine Ball Slams", sets: 4, reps: "15", rest: "30 sec" },
          { name: "Full Body Circuit", sets: 3, reps: "40 sec work/20 sec rest", rest: "60 sec between rounds" },
        ],
      },
      {
        day: 5,
        focus: "Total Body & Cardio",
        exercises: [
          { name: "Dumbbell Thrusters", sets: 4, reps: "12", rest: "45 sec" },
          { name: "Pull-ups/Assisted Pull-ups", sets: 4, reps: "max", rest: "45 sec" },
          { name: "Box Jump Variations", sets: 4, reps: "10", rest: "45 sec" },
          { name: "Battle Rope Intervals", sets: 5, reps: "30 sec", rest: "30 sec" },
          { name: "Stair Climber Finisher", sets: 1, reps: "10 min", rest: "0" },
        ],
      },
    ],
    nutrition: {
      dailyCalories: "10-20% deficit from maintenance",
      macros: {
        protein: "35-40%",
        carbs: "30-35%",
        fats: "25-30%",
      },
      mealPlan:
        "Higher protein to preserve muscle, moderate carbs focused around workouts, strategic calorie deficit, emphasis on whole foods and adequate fiber",
    },
  },
];

export default mockPlans;
