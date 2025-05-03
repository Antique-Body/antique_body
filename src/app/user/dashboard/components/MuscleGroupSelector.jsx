"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MuscleGroupSelector = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  
  const muscleGroups = [
    {
      id: 1,
      name: "Chest",
      color: "#e74c3c",
      exercises: [
        { name: "Bench Press", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Incline Dumbbell Press", equipment: "Dumbbells", difficulty: "Intermediate" },
        { name: "Cable Flyes", equipment: "Cable Machine", difficulty: "Beginner" },
        { name: "Push-ups", equipment: "Bodyweight", difficulty: "Beginner" },
        { name: "Dips", equipment: "Bodyweight", difficulty: "Intermediate" }
      ]
    },
    {
      id: 2,
      name: "Back",
      color: "#3498db",
      exercises: [
        { name: "Pull-ups", equipment: "Bodyweight", difficulty: "Intermediate" },
        { name: "Bent Over Rows", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Lat Pulldowns", equipment: "Cable Machine", difficulty: "Beginner" },
        { name: "T-Bar Rows", equipment: "Machine", difficulty: "Intermediate" },
        { name: "Deadlifts", equipment: "Barbell", difficulty: "Advanced" }
      ]
    },
    {
      id: 3,
      name: "Shoulders",
      color: "#9b59b6",
      exercises: [
        { name: "Overhead Press", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Lateral Raises", equipment: "Dumbbells", difficulty: "Beginner" },
        { name: "Face Pulls", equipment: "Cable Machine", difficulty: "Beginner" },
        { name: "Upright Rows", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Shrugs", equipment: "Dumbbells", difficulty: "Beginner" }
      ]
    },
    {
      id: 4,
      name: "Arms",
      color: "#2ecc71",
      exercises: [
        { name: "Bicep Curls", equipment: "Dumbbells", difficulty: "Beginner" },
        { name: "Tricep Pushdowns", equipment: "Cable Machine", difficulty: "Beginner" },
        { name: "Hammer Curls", equipment: "Dumbbells", difficulty: "Beginner" },
        { name: "Skull Crushers", equipment: "EZ Bar", difficulty: "Intermediate" },
        { name: "Chin-ups", equipment: "Bodyweight", difficulty: "Intermediate" }
      ]
    },
    {
      id: 5,
      name: "Legs",
      color: "#f1c40f",
      exercises: [
        { name: "Squats", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Lunges", equipment: "Bodyweight/Dumbbells", difficulty: "Beginner" },
        { name: "Leg Press", equipment: "Machine", difficulty: "Beginner" },
        { name: "Romanian Deadlifts", equipment: "Barbell", difficulty: "Intermediate" },
        { name: "Calf Raises", equipment: "Machine", difficulty: "Beginner" }
      ]
    },
    {
      id: 6,
      name: "Core",
      color: "#FF6B00",
      exercises: [
        { name: "Crunches", equipment: "Bodyweight", difficulty: "Beginner" },
        { name: "Planks", equipment: "Bodyweight", difficulty: "Beginner" },
        { name: "Russian Twists", equipment: "Bodyweight/Weight", difficulty: "Intermediate" },
        { name: "Hanging Leg Raises", equipment: "Bodyweight", difficulty: "Intermediate" },
        { name: "Ab Wheel Rollouts", equipment: "Ab Wheel", difficulty: "Advanced" }
      ]
    }
  ];

  return (
    <div className="w-full animate-fadeIn">
      <div className="flex items-center mb-8">
        <button 
          className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
          onClick={onBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="text-2xl font-bold">{selectedMuscleGroup ? selectedMuscleGroup.name : t("muscle_groups")}</h2>
      </div>

      {!selectedMuscleGroup ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {muscleGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: `${group.color}40` }}
              onClick={() => setSelectedMuscleGroup(group)}
            >
              <div 
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                style={{ 
                  background: `${group.color}20`,
                  border: `1px solid ${group.color}40`
                }}
              >
                <span className="text-2xl" style={{ color: group.color }}>
                  {group.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">{group.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{t("exercises_available", { count: group.exercises.length })}</p>
              <div className="flex flex-wrap gap-2">
                {group.exercises.slice(0, 3).map((exercise, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 rounded-full bg-[#222] text-gray-300"
                  >
                    {exercise.name}
                  </span>
                ))}
                {group.exercises.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#222] text-gray-300">
                    +{group.exercises.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div 
              className="rounded-xl p-6 mb-6"
              style={{ 
                background: `linear-gradient(135deg, ${selectedMuscleGroup.color}20, transparent)`,
                border: `1px solid ${selectedMuscleGroup.color}40` 
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: selectedMuscleGroup.color }}>
                {t("about")} {selectedMuscleGroup.name} {t("training")}
              </h3>
              <p className="text-gray-300 mb-4">
                {t("muscle_group_description", { muscle: selectedMuscleGroup.name })}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm px-3 py-1 rounded-full bg-[#222] text-gray-300">
                  {t("recommended")}: 2-3 {t("times_per_week")}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-[#222] text-gray-300">
                  {t("recovery")}: 48-72 {t("hours")}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-[#222] text-gray-300">
                  {t("exercises_per_workout")}: 3-5
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">{t("recommended_exercises")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMuscleGroup.exercises.map((exercise, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl border border-[#333] bg-[#1A1A1A] hover:bg-[#222] transition-colors duration-300"
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{exercise.name}</h4>
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${
                        exercise.difficulty === "Beginner" 
                          ? "bg-green-500 bg-opacity-20 text-green-400" 
                          : exercise.difficulty === "Intermediate"
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                          : "bg-red-500 bg-opacity-20 text-red-400"
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{exercise.equipment}</p>
                  <div className="mt-3 flex justify-end">
                    <button 
                      className="text-xs px-3 py-1 rounded-full text-white"
                      style={{ 
                        background: `${selectedMuscleGroup.color}40`,
                      }}
                    >
                      {t("add_to_workout")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button 
              className="px-4 py-2 bg-transparent border border-[#333] rounded-xl hover:border-white transition-all duration-300"
              onClick={() => setSelectedMuscleGroup(null)}
            >
              {t("back_to_all_muscle_groups")}
            </button>
            
            <button 
              className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, ${selectedMuscleGroup.color}BB)`,
                boxShadow: `0 8px 16px -8px ${selectedMuscleGroup.color}80`,
              }}
            >
              {t("create_custom_workout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MuscleGroupSelector; 