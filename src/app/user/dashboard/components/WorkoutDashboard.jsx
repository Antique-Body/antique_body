"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RecommendedProgram from "./RecommendedProgram";
import WorkoutPlans from "./WorkoutPlans";
import MuscleGroupSelector from "./MuscleGroupSelector";

export default function WorkoutDashboard() {
  const { t } = useTranslation();
  const [showMuscleGroups, setShowMuscleGroups] = useState(false);
  
  // Recommended custom training program for client
  const recommendedTraining = {
    name: "Advanced Hypertrophy Program - Week 1",
    icon: "crown",
    summary: "Customized 4-Day Split for Your First Week",
    description: "This personalized program was designed based on your goals, experience level, and schedule. Week 1 follows an optimized upper/lower split to establish a foundation for progressive muscle growth while providing sufficient recovery between sessions.",
    color: "#9d4edd",
    preferences: {
      location: "Gym",
      equipment: "Full Equipment",
      duration: "60-75 min",
      frequency: "4 days/week"
    },
    days: [
      {
        name: "Week 1, Day 1: Upper Body Push",
        exercises: [
          { name: "Incline Barbell Bench Press", sets: 4, reps: "8-10", restTime: "90-120 sec", notes: "Focus on controlled eccentric" },
          { name: "Seated Dumbbell Shoulder Press", sets: 4, reps: "10-12", restTime: "90 sec", notes: "Full range of motion" },
          { name: "Cable Flyes", sets: 3, reps: "12-15", restTime: "60 sec", notes: "Squeeze at peak contraction" },
          { name: "Lateral Raises", sets: 4, reps: "12-15", restTime: "60 sec", notes: "Maintain tension throughout" },
          { name: "Skull Crushers", sets: 3, reps: "10-12", restTime: "60-90 sec", notes: "Keep elbows fixed" },
          { name: "Rope Pushdowns", sets: 3, reps: "12-15", restTime: "60 sec", notes: "Focus on mind-muscle connection" }
        ]
      },
      {
        name: "Week 1, Day 2: Lower Body",
        exercises: [
          { name: "Barbell Back Squats", sets: 4, reps: "8-10", restTime: "120-180 sec", notes: "Push through heels" },
          { name: "Romanian Deadlifts", sets: 4, reps: "10-12", restTime: "90-120 sec", notes: "Focus on hamstring stretch" },
          { name: "Walking Lunges", sets: 3, reps: "12 each", restTime: "90 sec", notes: "Control the descent" },
          { name: "Leg Extensions", sets: 3, reps: "12-15", restTime: "60-90 sec", notes: "Squeeze quads at top" },
          { name: "Seated Leg Curls", sets: 3, reps: "12-15", restTime: "60 sec", notes: "Focus on contraction" },
          { name: "Standing Calf Raises", sets: 4, reps: "15-20", restTime: "60 sec", notes: "Full stretch at bottom" }
        ]
      },
      {
        name: "Week 1, Day 3: Upper Body Pull",
        exercises: [
          { name: "Weighted Pull-ups", sets: 4, reps: "8-10", restTime: "90-120 sec", notes: "Full range of motion" },
          { name: "Bent Over Barbell Rows", sets: 4, reps: "10-12", restTime: "90 sec", notes: "Pull to lower chest" },
          { name: "Single-Arm Dumbbell Rows", sets: 3, reps: "12 each", restTime: "60-90 sec", notes: "Focus on lat contraction" },
          { name: "Face Pulls", sets: 3, reps: "15-20", restTime: "60 sec", notes: "External rotation at end" },
          { name: "EZ Bar Curls", sets: 3, reps: "10-12", restTime: "60-90 sec", notes: "Control the eccentric" },
          { name: "Hammer Curls", sets: 3, reps: "12-15", restTime: "60 sec", notes: "Keep elbows fixed" }
        ]
      },
      {
        name: "Week 1, Day 4: Lower Body & Core",
        exercises: [
          { name: "Barbell Hip Thrusts", sets: 4, reps: "10-12", restTime: "90-120 sec", notes: "Focus on glute contraction" },
          { name: "Hack Squats", sets: 4, reps: "10-12", restTime: "90 sec", notes: "Control the descent" },
          { name: "Bulgarian Split Squats", sets: 3, reps: "10-12 each", restTime: "90 sec", notes: "Keep torso upright" },
          { name: "Seated Calf Raises", sets: 4, reps: "15-20", restTime: "60 sec", notes: "Pause at bottom position" },
          { name: "Cable Crunches", sets: 3, reps: "15-20", restTime: "60 sec", notes: "Round the spine" },
          { name: "Hanging Leg Raises", sets: 3, reps: "12-15", restTime: "60 sec", notes: "Control the movement" }
        ]
      }
    ],
    notes: [
      "This is your Week 1 starting plan - we'll adjust intensity for subsequent weeks",
      "Start each workout with a 5-10 minute dynamic warm-up",
      "Rest 48 hours between training similar muscle groups",
      "First week focus: Learn proper form before increasing weights",
      "Track your Week 1 workouts to establish your baseline",
      "Nutrition: Aim for 1.8-2g protein per kg bodyweight daily",
      "Sleep 7-9 hours for optimal recovery and growth"
    ],
    progressionStrategy: {
      weekTwo: "Increase weights by 5-10% where form allows",
      weekThree: "Add 1 set to main compound exercises",
      weekFour: "Reduce rest periods by 15-30 seconds"
    }
  };

  // Training types with preferences
  const trainingTypes = [
    {
      id: 1,
      name: "Explosive Power",
      icon: "lightning",
      summary: "Speed & Power Training",
      description: "Develop fast-twitch muscle fibers and athletic explosiveness with plyometrics and power-focused movements.",
      color: "#FF6B00",
      preferences: {
        location: "Gym",
        equipment: "Full Equipment",
        duration: "45-60 min",
        frequency: "3-4 days/week"
      },
      exercises: [
        { name: "Box Jumps", sets: 4, reps: "8", restTime: "90 sec" },
        { name: "Medicine Ball Slams", sets: 3, reps: "10", restTime: "60 sec" },
        { name: "Hang Cleans", sets: 4, reps: "6", restTime: "120 sec" },
        { name: "Plyometric Push-ups", sets: 3, reps: "Max", restTime: "90 sec" },
        { name: "Speed Squats", sets: 4, reps: "10", restTime: "90 sec" }
      ]
    },
    {
      id: 2,
      name: "Athletic Speed",
      icon: "zap",
      summary: "Agility & Quickness",
      description: "Enhance your speed, agility and reaction time with sprint training and dynamic movement patterns.",
      color: "#3498db",
      preferences: {
        location: "Gym/Outdoor",
        equipment: "Minimal",
        duration: "30-45 min",
        frequency: "2-3 days/week"
      },
      exercises: [
        { name: "Sprint Intervals", sets: 6, reps: "30 sec", restTime: "60 sec" },
        { name: "Ladder Drills", sets: 4, reps: "30 sec", restTime: "45 sec" },
        { name: "Shuttle Runs", sets: 5, reps: "40 yards", restTime: "60 sec" },
        { name: "Depth Jumps", sets: 4, reps: "8", restTime: "90 sec" },
        { name: "Resistance Band Sprints", sets: 3, reps: "20 yards", restTime: "90 sec" }
      ]
    },
    {
      id: 3,
      name: "Strength Focus",
      icon: "dumbbell",
      summary: "Max Power Output",
      description: "Build raw strength with heavy compound movements and progressive overload principles.",
      color: "#e74c3c",
      preferences: {
        location: "Gym",
        equipment: "Full Equipment",
        duration: "60-75 min",
        frequency: "3-4 days/week"
      },
      exercises: [
        { name: "Barbell Squats", sets: 5, reps: "5", restTime: "180 sec" },
        { name: "Deadlifts", sets: 5, reps: "5", restTime: "180 sec" },
        { name: "Bench Press", sets: 5, reps: "5", restTime: "150 sec" },
        { name: "Weighted Pull-ups", sets: 4, reps: "6-8", restTime: "120 sec" },
        { name: "Military Press", sets: 4, reps: "6-8", restTime: "120 sec" }
      ]
    },
    {
      id: 4,
      name: "Functional Fitness",
      icon: "activity",
      summary: "Real-World Strength",
      description: "Improve everyday movement patterns with functional exercises that translate to daily activities.",
      color: "#2ecc71",
      preferences: {
        location: "Gym/Home",
        equipment: "Mixed",
        duration: "45-60 min",
        frequency: "4-5 days/week"
      },
      exercises: [
        { name: "Kettlebell Swings", sets: 4, reps: "15", restTime: "60 sec" },
        { name: "TRX Rows", sets: 3, reps: "12", restTime: "60 sec" },
        { name: "Goblet Squats", sets: 4, reps: "12", restTime: "60 sec" },
        { name: "Turkish Get-ups", sets: 3, reps: "5 each", restTime: "90 sec" },
        { name: "Medicine Ball Woodchoppers", sets: 3, reps: "12 each", restTime: "60 sec" }
      ]
    },
    {
      id: 5,
      name: "Fat Loss",
      icon: "flame",
      summary: "Burn & Tone",
      description: "High-intensity interval training combined with cardio to maximize calorie burn and promote fat loss.",
      color: "#9b59b6",
      preferences: {
        location: "Gym/Home",
        equipment: "Minimal",
        duration: "30-45 min",
        frequency: "4-5 days/week"
      },
      exercises: [
        { name: "Burpees", sets: 4, reps: "12", restTime: "30 sec" },
        { name: "Mountain Climbers", sets: 4, reps: "30 sec", restTime: "30 sec" },
        { name: "Jump Rope", sets: 3, reps: "2 min", restTime: "60 sec" },
        { name: "Squat Jumps", sets: 4, reps: "15", restTime: "45 sec" },
        { name: "Circuit Training", sets: 3, reps: "45 sec each", restTime: "15 sec" }
      ]
    },
    {
      id: 6,
      name: "Muscle Building",
      icon: "award",
      summary: "Hypertrophy Focus",
      description: "Strategic volume and progressive overload training designed to maximize muscle growth and definition.",
      color: "#f1c40f",
      preferences: {
        location: "Gym",
        equipment: "Full Equipment",
        duration: "60-75 min",
        frequency: "4-5 days/week"
      },
      exercises: [
        { name: "Barbell Rows", sets: 4, reps: "10-12", restTime: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 4, reps: "8-12", restTime: "90 sec" },
        { name: "Romanian Deadlifts", sets: 3, reps: "10-12", restTime: "90 sec" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", restTime: "60 sec" },
        { name: "Lateral Raises", sets: 4, reps: "12-15", restTime: "60 sec" }
      ]
    }
  ];

  // Featured workouts
  const featuredWorkouts = [
    {
      title: "30-Day Strength Builder",
      level: "Intermediate",
      duration: "45 min",
      color: "#e74c3c",
      users: 856
    },
    {
      title: "HIIT Core Challenge",
      level: "Advanced",
      duration: "30 min",
      color: "#f1c40f",
      users: 1243
    },
    {
      title: "Full Body Toning",
      level: "Beginner",
      duration: "60 min",
      color: "#2ecc71",
      users: 972
    }
  ];

  return (
    <div className="w-full">
      {showMuscleGroups ? (
        <MuscleGroupSelector onBack={() => setShowMuscleGroups(false)} />
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Weekly Progress</h3>
                <div className="w-8 h-8 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold mb-2">3 of 5</p>
              <p className="text-gray-400 text-sm">Workouts completed this week</p>
              <div className="mt-4 flex gap-1.5">
                <div className="h-2 rounded-full flex-1 bg-[#FF6B00]"></div>
                <div className="h-2 rounded-full flex-1 bg-[#FF6B00]"></div>
                <div className="h-2 rounded-full flex-1 bg-[#FF6B00]"></div>
                <div className="h-2 rounded-full flex-1 bg-[#222]"></div>
                <div className="h-2 rounded-full flex-1 bg-[#222]"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Next Workout</h3>
                <div className="w-8 h-8 rounded-full bg-[#3498db] bg-opacity-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-xl font-bold mb-1">Upper Body Pull</p>
              <p className="text-gray-400 text-sm mb-3">Scheduled for tomorrow, 5:30 PM</p>
              <button className="w-full py-2 px-4 bg-[#3498db] bg-opacity-10 border border-[#3498db] border-opacity-30 rounded-lg text-[#3498db] text-sm font-medium hover:bg-opacity-20 transition-colors">
                View Details
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Personal Records</h3>
                <div className="w-8 h-8 rounded-full bg-[#9d4edd] bg-opacity-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9d4edd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Bench Press</p>
                    <p className="font-bold">100 kg</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500 bg-opacity-20 text-green-400">+5 kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Squat</p>
                    <p className="font-bold">140 kg</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500 bg-opacity-20 text-green-400">+10 kg</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended Program */}
          <RecommendedProgram program={recommendedTraining} />

          {/* Or choose your own separator */}
          <div className="flex items-center my-12">
            <div className="flex-grow h-px bg-[#333]"></div>
            <div className="px-4 text-sm text-gray-400">{t("or_create_your_own")}</div>
            <div className="flex-grow h-px bg-[#333]"></div>
          </div>
          
          {/* Training Types and Muscle Group Cards */}
          <WorkoutPlans 
            trainingTypes={trainingTypes} 
            onShowMuscleGroups={() => setShowMuscleGroups(true)} 
          />
          
          {/* Featured Workouts */}
          <div className="mt-16 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{t("featured_workouts")}</h3>
              <button className="text-[#3498db] hover:underline text-sm font-medium">
                {t("view_all")}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredWorkouts.map((workout, index) => (
                <div 
                  key={index}
                  className="rounded-xl overflow-hidden bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-[#333] hover:border-gray-500 transition-all duration-300 p-4 cursor-pointer"
                >
                  <div 
                    className="h-36 rounded-lg mb-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(45deg, ${workout.color}40, transparent)`
                    }}
                  >
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-full px-3 py-1 text-xs">
                      {workout.level}
                    </div>
                    
                    <svg
                      className="absolute bottom-4 right-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M10 8l6 4-6 4V8z"></path>
                    </svg>
                  </div>
                  
                  <h4 className="font-medium text-lg mb-1">{workout.title}</h4>
                  <p className="text-gray-400 text-sm">{workout.duration} • {workout.users} {t("active_users")}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes moveUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes moveLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s forwards;
        }
        
        .moving-line {
          animation: moveLine 8s infinite linear;
        }
      `}</style>
    </div>
  );
} 