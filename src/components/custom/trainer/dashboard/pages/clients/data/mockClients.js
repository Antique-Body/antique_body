const mockClients = [
  {
    id: "1",
    name: "John Doe",
    status: "Active",
    plan: "Pro Athlete",
    goal: "Build Muscle",
    joinDate: "Jan 15, 2025",
    nextSession: "Apr 12, 2025",
    type: "gym",
    assignedPlan: "gym-burn-fat", // ID of the assigned plan
    progress: [
      { date: "2025-04-01", benchPress: 80, squat: 100, deadlift: 120, weight: 80, bodyFat: 15 },
      { date: "2025-04-08", benchPress: 85, squat: 105, deadlift: 125, weight: 81, bodyFat: 14.8 },
      { date: "2025-04-15", benchPress: 87.5, squat: 110, deadlift: 130, weight: 81.5, bodyFat: 14.5 },
    ],
    nutrition: { protein: 160, carbs: 250, fats: 60, calories: 2200 },
    training: {
      completed: 12,
      remaining: 8,
      completionRate: 85,
      avgIntensity: 4.8,
      overallProgress: 60,
      recentWorkouts: [
        {
          name: "Lower Body Power",
          date: "Apr 15, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "90%", duration: "65min" },
          details: {
            planned: "Day 1 - Lower Body Power",
            note: "Focus on form rather than weight. Take your time between sets to fully recover.",
            waterGoal: 1000,
            waterConsumed: 900,
            exercises: [
              {
                name: "Barbell Back Squat",
                planned: "4 sets × 8-10",
                sets: [
                  { set: 1, reps: 10, weight: 90 },
                  { set: 2, reps: 10, weight: 90 },
                  { set: 3, reps: 9, weight: 90 },
                  { set: 4, reps: 8, weight: 90 }
                ],
                completed: true
              },
              {
                name: "Romanian Deadlift",
                planned: "3 sets × 10-12",
                sets: [
                  { set: 1, reps: 12, weight: 85 },
                  { set: 2, reps: 12, weight: 85 },
                  { set: 3, reps: 10, weight: 85 }
                ],
                completed: true
              },
              {
                name: "Walking Lunges",
                planned: "3 sets × 12 (each leg)",
                sets: [
                  { set: 1, reps: 12, weight: "Body" },
                  { set: 2, reps: 12, weight: "Body" },
                  { set: 3, reps: 12, weight: "Body" }
                ],
                completed: true
              },
              {
                name: "Leg Press",
                planned: "3 sets × 12-15",
                sets: [
                  { set: 1, reps: 15, weight: 140 },
                  { set: 2, reps: 14, weight: 140 },
                  { set: 3, reps: 12, weight: 140 }
                ],
                completed: true
              },
              {
                name: "Standing Calf Raises",
                planned: "4 sets × 15-20",
                sets: [
                  { set: 1, reps: 20, weight: 60 },
                  { set: 2, reps: 18, weight: 60 },
                  { set: 3, reps: 17, weight: 60 },
                  { set: 4, reps: 15, weight: 60 }
                ],
                completed: true
              }
            ]
          }
        },
        {
          name: "Upper Body Strength",
          date: "Apr 12, 2025",
          status: "partial",
          stats: { exercises: "4/5 completed", water: "65%", duration: "45min" },
          details: {
            planned: "Day 2 - Upper Body Strength",
            note: "Maintain proper breathing - exhale on exertion, inhale on return. Focus on controlled movements.",
            waterGoal: 1000,
            waterConsumed: 650,
            exercises: [
              {
                name: "Bench Press",
                planned: "4 sets × 8-10",
                sets: [
                  { set: 1, reps: 10, weight: 70 },
                  { set: 2, reps: 9, weight: 70 },
                  { set: 3, reps: 8, weight: 70 },
                  { set: 4, reps: 8, weight: 70 }
                ],
                completed: true
              },
              {
                name: "Bent Over Rows",
                planned: "4 sets × 10-12",
                sets: [
                  { set: 1, reps: 12, weight: 65 },
                  { set: 2, reps: 11, weight: 65 },
                  { set: 3, reps: 10, weight: 65 },
                  { set: 4, reps: 10, weight: 65 }
                ],
                completed: true
              },
              {
                name: "Overhead Press",
                planned: "3 sets × 8-10",
                sets: [
                  { set: 1, reps: 10, weight: 45 },
                  { set: 2, reps: 9, weight: 45 },
                  { set: 3, reps: 8, weight: 45 }
                ],
                completed: true
              },
              {
                name: "Pull-Ups",
                planned: "3 sets × 8-10",
                sets: [
                  { set: 1, reps: 8, weight: "Body" },
                  { set: 2, reps: 7, weight: "Body" },
                  { set: 3, reps: 6, weight: "Body" }
                ],
                completed: true
              },
              {
                name: "Tricep Dips",
                planned: "3 sets × 10-12",
                sets: [],
                completed: false
              }
            ]
          }
        },
        {
          name: "Leg Day",
          date: "Apr 8, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "100%", duration: "72min" }
        }
      ],
      adherence: [
        { type: "Strength", completed: "24 sets", skipped: "3 sets", rate: 89 },
        { type: "Cardio", completed: "95 min", skipped: "15 min", rate: 86 },
        { type: "Flexibility", completed: "15 exercises", skipped: "5 exercises", rate: 75 }
      ]
    }
  },
  {
    id: "2",
    name: "Sarah Williams",
    status: "Active",
    plan: "Recovery",
    goal: "football",
    joinDate: "Feb 3, 2025",
    nextSession: "Apr 10, 2025",
    type: "athlete",
    sport: "football",
    assignedPlan: "football-pro", // Football plan
    progress: [
      { date: "2025-04-01", sprint: 12.5, agility: 8.2, kickAccuracy: 75, weight: 65, bodyFat: 18 },
      { date: "2025-04-08", sprint: 12.2, agility: 8.0, kickAccuracy: 78, weight: 65.5, bodyFat: 17.8 },
      { date: "2025-04-15", sprint: 11.9, agility: 7.8, kickAccuracy: 82, weight: 65, bodyFat: 17.5 },
    ],
    nutrition: { protein: 120, carbs: 300, fats: 50, calories: 2100 },
    training: {
      completed: 15,
      remaining: 5,
      completionRate: 90,
      avgIntensity: 4.5,
      overallProgress: 75,
      recentWorkouts: [
        {
          name: "Sport-Specific Training",
          date: "Apr 15, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "95%", duration: "75min" }
        },
        {
          name: "Agility & Speed",
          date: "Apr 12, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "85%", duration: "60min" }
        },
        {
          name: "Recovery & Stretching",
          date: "Apr 8, 2025",
          status: "partial",
          stats: { exercises: "5/7 completed", water: "70%", duration: "40min" }
        }
      ],
      adherence: [
        { type: "Sport-specific", completed: "28 drills", skipped: "4 drills", rate: 88 },
        { type: "Conditioning", completed: "110 min", skipped: "20 min", rate: 85 },
        { type: "Recovery", completed: "12 sessions", skipped: "3 sessions", rate: 80 }
      ]
    }
  },
  {
    id: "3",
    name: "Mike Chen",
    status: "Active",
    plan: "Weight Loss",
    goal: "Fat Loss",
    joinDate: "Mar 10, 2025",
    nextSession: "Apr 15, 2025",
    type: "gym",
    // No assigned plan yet
    progress: [
      { date: "2025-04-01", cardio: 35, caloriesBurned: 450, weight: 92, bodyFat: 24 },
      { date: "2025-04-08", cardio: 40, caloriesBurned: 520, weight: 90.5, bodyFat: 23.5 },
      { date: "2025-04-15", cardio: 45, caloriesBurned: 580, weight: 89, bodyFat: 23 },
    ],
    nutrition: { protein: 140, carbs: 180, fats: 55, calories: 1800 },
    training: {
      completed: 8,
      remaining: 12,
      completionRate: 70,
      avgIntensity: 3.9,
      overallProgress: 40,
      recentWorkouts: [
        {
          name: "HIIT Cardio",
          date: "Apr 15, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "80%", duration: "45min" }
        },
        {
          name: "Core & Cardio",
          date: "Apr 12, 2025",
          status: "partial",
          stats: { exercises: "6/10 completed", water: "65%", duration: "35min" }
        },
        {
          name: "Full Body Circuit",
          date: "Apr 8, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "90%", duration: "55min" }
        }
      ],
      adherence: [
        { type: "Strength", completed: "18 sets", skipped: "6 sets", rate: 75 },
        { type: "Cardio", completed: "120 min", skipped: "30 min", rate: 80 },
        { type: "Flexibility", completed: "10 exercises", skipped: "5 exercises", rate: 67 }
      ]
    }
  },
  {
    id: "4",
    name: "Emma Johnson",
    status: "Active",
    plan: "Elite Performance",
    goal: "basketball",
    joinDate: "Jan 5, 2025",
    nextSession: "Apr 14, 2025",
    type: "basketball",
    assignedPlan: "basketball-elite", // Basketball plan
    progress: [
      { date: "2025-04-01", verticalJump: 60, shootingAccuracy: 72, sprint: 8.6, weight: 75, bodyFat: 12 },
      { date: "2025-04-08", verticalJump: 62, shootingAccuracy: 75, sprint: 8.4, weight: 74.5, bodyFat: 11.8 },
      { date: "2025-04-15", verticalJump: 65, shootingAccuracy: 78, sprint: 8.2, weight: 74, bodyFat: 11.5 },
    ],
    nutrition: { protein: 150, carbs: 280, fats: 55, calories: 2200 },
    training: {
      completed: 18,
      remaining: 2,
      completionRate: 92,
      avgIntensity: 4.9,
      overallProgress: 90,
      recentWorkouts: [
        {
          name: "Shooting & Drills",
          date: "Apr 15, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "95%", duration: "90min" }
        },
        {
          name: "Agility & Speed",
          date: "Apr 12, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "90%", duration: "75min" }
        },
        {
          name: "Strength & Conditioning",
          date: "Apr 8, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "100%", duration: "80min" }
        }
      ],
      adherence: [
        { type: "Shooting", completed: "320 shots", skipped: "80 shots", rate: 80 },
        { type: "Agility", completed: "18 drills", skipped: "2 drills", rate: 90 },
        { type: "Strength", completed: "15 exercises", skipped: "3 exercises", rate: 83 }
      ]
    }
  },
  {
    id: "5",
    name: "Carlos Rodriguez",
    status: "Active",
    plan: "Sports Conditioning",
    goal: "tennis",
    joinDate: "Feb 20, 2025",
    nextSession: "Apr 16, 2025",
    type: "tennis",
    // No assigned plan yet
    progress: [
      { date: "2025-04-01", serveSpeed: 165, forehandAccuracy: 75, backhandAccuracy: 70, weight: 72, bodyFat: 14 },
      { date: "2025-04-08", serveSpeed: 168, forehandAccuracy: 78, backhandAccuracy: 72, weight: 71.5, bodyFat: 13.8 },
      { date: "2025-04-15", serveSpeed: 172, forehandAccuracy: 80, backhandAccuracy: 75, weight: 71, bodyFat: 13.5 },
    ],
    nutrition: { protein: 145, carbs: 260, fats: 55, calories: 2100 },
    training: {
      completed: 10,
      remaining: 10,
      completionRate: 75,
      avgIntensity: 4.3,
      overallProgress: 50,
      recentWorkouts: [
        {
          name: "Technical Skills",
          date: "Apr 15, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "85%", duration: "70min" }
        },
        {
          name: "Match Simulation",
          date: "Apr 12, 2025",
          status: "partial",
          stats: { exercises: "8/10 completed", water: "75%", duration: "60min" }
        },
        {
          name: "Strength & Mobility",
          date: "Apr 8, 2025",
          status: "completed",
          stats: { exercises: "All completed", water: "90%", duration: "65min" }
        }
      ],
      adherence: [
        { type: "Technical", completed: "25 drills", skipped: "5 drills", rate: 83 },
        { type: "Conditioning", completed: "95 min", skipped: "25 min", rate: 79 },
        { type: "Recovery", completed: "10 sessions", skipped: "2 sessions", rate: 83 }
      ]
    }
  },
];

export default mockClients;