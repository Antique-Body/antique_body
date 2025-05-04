"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MuscleGroupSelector = ({ onBack }) => {
  const { t } = useTranslation();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [hoveredExercise, setHoveredExercise] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [savedExercises, setSavedExercises] = useState([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  // Load saved exercises from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedExercises');
    if (saved) {
      setSavedExercises(JSON.parse(saved));
    }
  }, []);

  const handleSaveExercise = (exercise) => {
    const newSavedExercises = [...savedExercises, {
      ...exercise,
      muscleGroup: selectedMuscleGroup.name,
      dateAdded: new Date().toISOString(),
      id: Date.now()
    }];
    
    setSavedExercises(newSavedExercises);
    localStorage.setItem('savedExercises', JSON.stringify(newSavedExercises));
    
    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const muscleGroups = [
    {
      id: 1,
      name: "Chest",
      icon: "💪",
      color: "#e74c3c",
      description: "Build a strong and defined chest with these targeted exercises",
      muscleImage: "/images/muscles/chest.png", // You'll need to add these images
      exercises: [
        {
          name: "Bench Press",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "4",
          reps: "8-12",
          videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
          targetAreas: ["Upper Chest", "Middle Chest", "Lower Chest"],
          muscleActivation: {
            primary: ["Pectoralis Major"],
            secondary: ["Front Deltoids", "Triceps"],
          },
          form: [
            "Lie on bench with feet flat on ground",
            "Grip bar slightly wider than shoulder width",
            "Lower bar to chest with controlled movement",
            "Press bar up to starting position"
          ],
          tips: [
            "Keep wrists straight",
            "Maintain natural arch in lower back",
            "Keep elbows at 45-degree angle"
          ]
        },
        { name: "Incline Dumbbell Press", equipment: "Dumbbells", difficulty: "Intermediate", sets: "3", reps: "10-12" },
        { name: "Cable Flyes", equipment: "Cable Machine", difficulty: "Beginner", sets: "3", reps: "12-15" },
        { name: "Push-ups", equipment: "Bodyweight", difficulty: "Beginner", sets: "3", reps: "Max" },
        { name: "Dips", equipment: "Bodyweight", difficulty: "Intermediate", sets: "3", reps: "8-12" }
      ]
    },
    {
      id: 2,
      name: "Back",
      icon: "🔙",
      color: "#3498db",
      description: "Develop a strong and wide back for improved posture and strength",
      exercises: [
        { name: "Pull-ups", equipment: "Bodyweight", difficulty: "Intermediate", sets: "4", reps: "6-10" },
        { name: "Bent Over Rows", equipment: "Barbell", difficulty: "Intermediate", sets: "4", reps: "8-12" },
        { name: "Lat Pulldowns", equipment: "Cable Machine", difficulty: "Beginner", sets: "3", reps: "12-15" },
        { name: "T-Bar Rows", equipment: "Machine", difficulty: "Intermediate", sets: "3", reps: "10-12" },
        { name: "Deadlifts", equipment: "Barbell", difficulty: "Advanced", sets: "4", reps: "6-8" }
      ]
    },
    {
      id: 3,
      name: "Shoulders",
      icon: "🎯",
      color: "#9b59b6",
      description: "Build strong and defined shoulders for a balanced upper body",
      exercises: [
        { name: "Overhead Press", equipment: "Barbell", difficulty: "Intermediate", sets: "4", reps: "8-10" },
        { name: "Lateral Raises", equipment: "Dumbbells", difficulty: "Beginner", sets: "3", reps: "12-15" },
        { name: "Face Pulls", equipment: "Cable Machine", difficulty: "Beginner", sets: "3", reps: "15-20" },
        { name: "Upright Rows", equipment: "Barbell", difficulty: "Intermediate", sets: "3", reps: "10-12" },
        { name: "Shrugs", equipment: "Dumbbells", difficulty: "Beginner", sets: "4", reps: "12-15" }
      ]
    },
    {
      id: 4,
      name: "Arms",
      icon: "💪",
      color: "#2ecc71",
      description: "Sculpt and strengthen your arms with these effective exercises",
      exercises: [
        { name: "Bicep Curls", equipment: "Dumbbells", difficulty: "Beginner", sets: "4", reps: "10-12" },
        { name: "Tricep Pushdowns", equipment: "Cable Machine", difficulty: "Beginner", sets: "3", reps: "12-15" },
        { name: "Hammer Curls", equipment: "Dumbbells", difficulty: "Beginner", sets: "3", reps: "10-12" },
        { name: "Skull Crushers", equipment: "EZ Bar", difficulty: "Intermediate", sets: "3", reps: "10-12" },
        { name: "Chin-ups", equipment: "Bodyweight", difficulty: "Intermediate", sets: "3", reps: "Max" }
      ]
    },
    {
      id: 5,
      name: "Legs",
      icon: "🦵",
      color: "#f1c40f",
      description: "Build powerful legs and improve overall strength with these exercises",
      exercises: [
        { name: "Squats", equipment: "Barbell", difficulty: "Intermediate", sets: "5", reps: "8-10" },
        { name: "Lunges", equipment: "Bodyweight/Dumbbells", difficulty: "Beginner", sets: "3", reps: "12 each" },
        { name: "Leg Press", equipment: "Machine", difficulty: "Beginner", sets: "4", reps: "10-12" },
        { name: "Romanian Deadlifts", equipment: "Barbell", difficulty: "Intermediate", sets: "4", reps: "10-12" },
        { name: "Calf Raises", equipment: "Machine", difficulty: "Beginner", sets: "4", reps: "15-20" }
      ]
    },
    {
      id: 6,
      name: "Core",
      icon: "🎯",
      color: "#FF6B00",
      description: "Strengthen your core and improve stability with these targeted exercises",
      exercises: [
        { name: "Crunches", equipment: "Bodyweight", difficulty: "Beginner", sets: "3", reps: "15-20" },
        { name: "Planks", equipment: "Bodyweight", difficulty: "Beginner", sets: "3", reps: "30-60 sec" },
        { name: "Russian Twists", equipment: "Bodyweight/Weight", difficulty: "Intermediate", sets: "3", reps: "20 each" },
        { name: "Hanging Leg Raises", equipment: "Bodyweight", difficulty: "Intermediate", sets: "3", reps: "12-15" },
        { name: "Ab Wheel Rollouts", equipment: "Ab Wheel", difficulty: "Advanced", sets: "3", reps: "10-12" }
      ]
    }
  ];

  const renderExerciseDetails = () => {
    if (!selectedExercise) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-[#111] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#111] p-6 border-b border-[#333] flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
            <button 
              onClick={() => setSelectedExercise(null)}
              className="w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Video and Primary Info */}
              <div>
                <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
                  <iframe 
                    src={selectedExercise.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#222]">
                    <p className="text-sm text-gray-400 mb-1">Sets</p>
                    <p className="text-lg font-medium">{selectedExercise.sets}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#222]">
                    <p className="text-sm text-gray-400 mb-1">Reps</p>
                    <p className="text-lg font-medium">{selectedExercise.reps}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Target Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.targetAreas.map((area, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-sm"
                          style={{
                            background: `${selectedMuscleGroup.color}20`,
                            color: selectedMuscleGroup.color,
                            border: `1px solid ${selectedMuscleGroup.color}40`
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Muscle Activation</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Primary</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedExercise.muscleActivation.primary.map((muscle, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-full bg-[#FF6B00] bg-opacity-20 text-[#FF6B00] text-sm border border-[#FF6B00] border-opacity-20">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Secondary</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedExercise.muscleActivation.secondary.map((muscle, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-full bg-[#3498db] bg-opacity-20 text-[#3498db] text-sm border border-[#3498db] border-opacity-20">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form and Tips */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Proper Form</h3>
                  <div className="space-y-3">
                    {selectedExercise.form.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#222]">
                        <span className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-sm flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Pro Tips</h3>
                  <div className="space-y-3">
                    {selectedExercise.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#222]">
                        <span className="text-[#FF6B00]">💡</span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Muscle Targeting</h3>
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-[#222] p-4">
                    <img 
                      src={selectedMuscleGroup.muscleImage} 
                      alt={`${selectedExercise.name} muscle targeting`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#333]">
              <button 
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-3 bg-[#222] hover:bg-[#333] rounded-xl transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => handleSaveExercise(selectedExercise)}
                className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, ${selectedMuscleGroup.color}BB)`,
                  boxShadow: `0 8px 20px -8px ${selectedMuscleGroup.color}80`,
                }}
              >
                Add to Workout Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full bg-[#222] hover:bg-[#333] flex items-center justify-center transition-colors"
            onClick={onBack}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          <h2 className="text-3xl font-bold">{selectedMuscleGroup ? selectedMuscleGroup.name : "Muscle Groups"}</h2>
        </div>
        {selectedMuscleGroup && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Exercises:</span>
            <span className="text-2xl font-bold" style={{ color: selectedMuscleGroup.color }}>
              {selectedMuscleGroup.exercises.length}
            </span>
          </div>
        )}
      </div>

      {!selectedMuscleGroup ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {muscleGroups.map((group) => (
            <div
              key={group.id}
              className="group rounded-2xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
              style={{ 
                borderColor: `${group.color}40`,
                boxShadow: `0 10px 30px -10px ${group.color}20`
              }}
              onClick={() => setSelectedMuscleGroup(group)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ 
                    background: `${group.color}20`,
                    border: `1px solid ${group.color}40`
                  }}
                >
                  <span className="text-3xl">{group.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{group.name}</h3>
                  <p className="text-sm text-gray-400">{group.exercises.length} exercises</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-2">
                {group.exercises.slice(0, 3).map((exercise, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      background: `${group.color}20`,
                      border: `1px solid ${group.color}40`,
                      color: group.color
                    }}
                  >
                    {exercise.name}
                  </span>
                ))}
                {group.exercises.length > 3 && (
                  <span 
                    className="text-xs px-3 py-1.5 rounded-full bg-[#222] text-gray-300 border border-[#333]"
                  >
                    +{group.exercises.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Section */}
          <div 
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${selectedMuscleGroup.color}20, transparent)`,
              border: `1px solid ${selectedMuscleGroup.color}40`,
              boxShadow: `0 10px 30px -10px ${selectedMuscleGroup.color}20`
            }}
          >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
              style={{
                background: `linear-gradient(45deg, transparent, ${selectedMuscleGroup.color})`,
                filter: 'blur(100px)',
                transform: 'translateX(30%)'
              }}
            />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5"
              style={{
                background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, transparent)`,
                filter: 'blur(60px)',
                transform: 'translateX(-20%)'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-8 mb-8">
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform"
                  style={{ 
                    background: `${selectedMuscleGroup.color}20`,
                    border: `2px solid ${selectedMuscleGroup.color}40`,
                    boxShadow: `0 8px 20px -8px ${selectedMuscleGroup.color}40`
                  }}
                >
                  <span className="text-5xl">{selectedMuscleGroup.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-3xl font-bold" style={{ color: selectedMuscleGroup.color }}>
                      {selectedMuscleGroup.name} Training
                    </h3>
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        background: `${selectedMuscleGroup.color}20`,
                        color: selectedMuscleGroup.color,
                        border: `1px solid ${selectedMuscleGroup.color}40`
                      }}
                    >
                      {selectedMuscleGroup.exercises.length} Exercises
                    </span>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{selectedMuscleGroup.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedMuscleGroup.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <p className="text-sm text-gray-400">Recommended Frequency</p>
                  </div>
                  <p className="text-xl font-medium">2-3 times per week</p>
                </div>
                <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedMuscleGroup.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <p className="text-sm text-gray-400">Recovery Time</p>
                  </div>
                  <p className="text-xl font-medium">48-72 hours</p>
                </div>
                <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedMuscleGroup.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <p className="text-sm text-gray-400">Exercises per Session</p>
                  </div>
                  <p className="text-xl font-medium">3-5 exercises</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Recommended Exercises</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] transition-colors">
                  Filter
                </button>
                <button className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] transition-colors">
                  Sort by Difficulty
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedMuscleGroup.exercises.map((exercise, idx) => (
                <div 
                  key={idx}
                  className="group p-6 rounded-2xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f] hover:from-[#222] hover:to-[#1A1A1A] transition-all duration-300 transform hover:-translate-y-1"
                  onMouseEnter={() => setHoveredExercise(idx)}
                  onMouseLeave={() => setHoveredExercise(null)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-xl font-medium mb-2">{exercise.name}</h4>
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="text-sm">{exercise.equipment}</span>
                      </div>
                    </div>
                    <span 
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        exercise.difficulty === "Beginner" 
                          ? "bg-green-500 bg-opacity-20 text-green-400 border border-green-500 border-opacity-20" 
                          : exercise.difficulty === "Intermediate"
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-20"
                          : "bg-red-500 bg-opacity-20 text-red-400 border border-red-500 border-opacity-20"
                      }`}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-[#222] group-hover:bg-[#333] transition-colors">
                      <p className="text-sm text-gray-400 mb-1">Sets</p>
                      <p className="text-lg font-medium">{exercise.sets}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#222] group-hover:bg-[#333] transition-colors">
                      <p className="text-sm text-gray-400 mb-1">Reps</p>
                      <p className="text-lg font-medium">{exercise.reps}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button 
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      View Details
                    </button>
                    <button 
                      className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform group-hover:scale-105"
                      style={{ 
                        background: hoveredExercise === idx ? selectedMuscleGroup.color : `${selectedMuscleGroup.color}20`,
                        color: hoveredExercise === idx ? 'white' : selectedMuscleGroup.color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveExercise(exercise);
                      }}
                    >
                      Add to Workout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-[#333]">
            <button 
              className="px-6 py-3 bg-[#222] hover:bg-[#333] rounded-xl transition-colors flex items-center gap-2"
              onClick={() => setSelectedMuscleGroup(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Muscle Groups
            </button>
            
            <button 
              className="px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, ${selectedMuscleGroup.color}BB)`,
                boxShadow: `0 8px 20px -8px ${selectedMuscleGroup.color}80`,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Custom Workout
            </button>
          </div>
        </div>
      )}

      {/* Add saved message notification */}
      {showSavedMessage && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fadeIn">
          Exercise added to workout plan!
        </div>
      )}

      {/* Render exercise details modal */}
      {selectedExercise && renderExerciseDetails()}
    </div>
  );
};

export default MuscleGroupSelector; 