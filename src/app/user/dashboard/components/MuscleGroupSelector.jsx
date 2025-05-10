"use client";
import { useEffect, useState } from "react";

import {
  ArmsIcon,
  BackIcon,
  ChestIcon,
  CoreIcon,
  LegsIcon,
  ShouldersIcon
} from "../../../../components/common/Icons";

const MuscleGroupSelector = ({ onBack }) => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [hoveredExercise, setHoveredExercise] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [savedExercises, setSavedExercises] = useState([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoExercise, setCurrentVideoExercise] = useState(null);

  // Load saved exercises from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedExercises");
    if (saved) {
      setSavedExercises(JSON.parse(saved));
    }
  }, []);

  const handleSaveExercise = (exercise) => {
    const newSavedExercises = [
      ...savedExercises,
      {
        ...exercise,
        muscleGroup: selectedMuscleGroup.name,
        dateAdded: new Date().toISOString(),
        id: Date.now(),
      },
    ];

    setSavedExercises(newSavedExercises);
    localStorage.setItem("savedExercises", JSON.stringify(newSavedExercises));

    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const handleVideoClick = (exercise) => {
    setCurrentVideoExercise(exercise);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  const muscleGroups = [
    {
      id: 1,
      name: "Chest",
      icon: ChestIcon,
      color: "#e74c3c",
      description:
        "Build a strong and defined chest with these targeted exercises",
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
            "Press bar up to starting position",
          ],
          tips: [
            "Keep wrists straight",
            "Maintain natural arch in lower back",
            "Keep elbows at 45-degree angle",
          ],
        },
        {
          name: "Incline Dumbbell Press",
          equipment: "Dumbbells",
          difficulty: "Intermediate",
          sets: "3",
          reps: "10-12",
        },
        {
          name: "Cable Flyes",
          equipment: "Cable Machine",
          difficulty: "Beginner",
          sets: "3",
          reps: "12-15",
        },
        {
          name: "Push-ups",
          equipment: "Bodyweight",
          difficulty: "Beginner",
          sets: "3",
          reps: "Max",
        },
        {
          name: "Dips",
          equipment: "Bodyweight",
          difficulty: "Intermediate",
          sets: "3",
          reps: "8-12",
        },
      ],
    },
    {
      id: 2,
      name: "Back",
      icon: BackIcon,
      color: "#3498db",
      description:
        "Develop a strong and wide back for improved posture and strength",
      exercises: [
        {
          name: "Pull-ups",
          equipment: "Bodyweight",
          difficulty: "Intermediate",
          sets: "4",
          reps: "6-10",
        },
        {
          name: "Bent Over Rows",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "4",
          reps: "8-12",
        },
        {
          name: "Lat Pulldowns",
          equipment: "Cable Machine",
          difficulty: "Beginner",
          sets: "3",
          reps: "12-15",
        },
        {
          name: "T-Bar Rows",
          equipment: "Machine",
          difficulty: "Intermediate",
          sets: "3",
          reps: "10-12",
        },
        {
          name: "Deadlifts",
          equipment: "Barbell",
          difficulty: "Advanced",
          sets: "4",
          reps: "6-8",
        },
      ],
    },
    {
      id: 3,
      name: "Shoulders",
      icon: ShouldersIcon,
      color: "#9b59b6",
      description:
        "Build strong and defined shoulders for a balanced upper body",
      exercises: [
        {
          name: "Overhead Press",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "4",
          reps: "8-10",
        },
        {
          name: "Lateral Raises",
          equipment: "Dumbbells",
          difficulty: "Beginner",
          sets: "3",
          reps: "12-15",
        },
        {
          name: "Face Pulls",
          equipment: "Cable Machine",
          difficulty: "Beginner",
          sets: "3",
          reps: "15-20",
        },
        {
          name: "Upright Rows",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "3",
          reps: "10-12",
        },
        {
          name: "Shrugs",
          equipment: "Dumbbells",
          difficulty: "Beginner",
          sets: "4",
          reps: "12-15",
        },
      ],
    },
    {
      id: 4,
      name: "Arms",
      icon: ArmsIcon,
      color: "#2ecc71",
      description:
        "Sculpt and strengthen your arms with these effective exercises",
      exercises: [
        {
          name: "Bicep Curls",
          equipment: "Dumbbells",
          difficulty: "Beginner",
          sets: "4",
          reps: "10-12",
        },
        {
          name: "Tricep Pushdowns",
          equipment: "Cable Machine",
          difficulty: "Beginner",
          sets: "3",
          reps: "12-15",
        },
        {
          name: "Hammer Curls",
          equipment: "Dumbbells",
          difficulty: "Beginner",
          sets: "3",
          reps: "10-12",
        },
        {
          name: "Skull Crushers",
          equipment: "EZ Bar",
          difficulty: "Intermediate",
          sets: "3",
          reps: "10-12",
        },
        {
          name: "Chin-ups",
          equipment: "Bodyweight",
          difficulty: "Intermediate",
          sets: "3",
          reps: "Max",
        },
      ],
    },
    {
      id: 5,
      name: "Legs",
      icon: LegsIcon,
      color: "#f1c40f",
      description:
        "Build powerful legs and improve overall strength with these exercises",
      exercises: [
        {
          name: "Squats",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "5",
          reps: "8-10",
        },
        {
          name: "Lunges",
          equipment: "Bodyweight/Dumbbells",
          difficulty: "Beginner",
          sets: "3",
          reps: "12 each",
        },
        {
          name: "Leg Press",
          equipment: "Machine",
          difficulty: "Beginner",
          sets: "4",
          reps: "10-12",
        },
        {
          name: "Romanian Deadlifts",
          equipment: "Barbell",
          difficulty: "Intermediate",
          sets: "4",
          reps: "10-12",
        },
        {
          name: "Calf Raises",
          equipment: "Machine",
          difficulty: "Beginner",
          sets: "4",
          reps: "15-20",
        },
      ],
    },
    {
      id: 6,
      name: "Core",
      icon: CoreIcon,
      color: "#FF6B00",
      description:
        "Strengthen your core and improve stability with these targeted exercises",
      exercises: [
        {
          name: "Crunches",
          equipment: "Bodyweight",
          difficulty: "Beginner",
          sets: "3",
          reps: "15-20",
        },
        {
          name: "Planks",
          equipment: "Bodyweight",
          difficulty: "Beginner",
          sets: "3",
          reps: "30-60 sec",
        },
        {
          name: "Russian Twists",
          equipment: "Bodyweight/Weight",
          difficulty: "Intermediate",
          sets: "3",
          reps: "20 each",
        },
        {
          name: "Hanging Leg Raises",
          equipment: "Bodyweight",
          difficulty: "Intermediate",
          sets: "3",
          reps: "12-15",
        },
        {
          name: "Ab Wheel Rollouts",
          equipment: "Ab Wheel",
          difficulty: "Advanced",
          sets: "3",
          reps: "10-12",
        },
      ],
    },
  ];

  const renderExerciseDetails = () => {
    if (!selectedExercise) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-[#111] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-[#111] p-6 border-b border-[#333] flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
            <button
              onClick={() => setSelectedExercise(null)}
              className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#222] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Equipment</p>
                <p className="font-medium">{selectedExercise.equipment}</p>
              </div>
              <div className="bg-[#222] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Difficulty</p>
                <p className="font-medium">{selectedExercise.difficulty}</p>
              </div>
              <div className="bg-[#222] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Sets</p>
                <p className="font-medium">{selectedExercise.sets}</p>
              </div>
              <div className="bg-[#222] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Reps</p>
                <p className="font-medium">{selectedExercise.reps}</p>
              </div>
            </div>

            {selectedExercise.videoUrl && (
              <div className="mb-6">
                <button
                  onClick={() => handleVideoClick(selectedExercise)}
                  className="w-full py-3 bg-[#333] hover:bg-[#444] text-white rounded-lg transition flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Watch Exercise Video
                </button>
              </div>
            )}

            {selectedExercise.targetAreas && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Target Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.targetAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#222] rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedExercise.muscleActivation && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Muscle Activation
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Primary</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.muscleActivation.primary.map(
                        (muscle, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#333] rounded-full text-sm"
                          >
                            {muscle}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Secondary</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.muscleActivation.secondary.map(
                        (muscle, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#222] rounded-full text-sm"
                          >
                            {muscle}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedExercise.form && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Proper Form</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {selectedExercise.form.map((step, index) => (
                    <li key={index} className="text-gray-300">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {selectedExercise.tips && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Tips</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index} className="text-gray-300">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => handleSaveExercise(selectedExercise)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-lg font-medium transition shadow-lg shadow-orange-500/20"
            >
              Save Exercise
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Video modal component
  const renderVideoModal = () => {
    if (!showVideo || !currentVideoExercise) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
        <div className="bg-[#111] rounded-2xl max-w-4xl w-full overflow-hidden">
          <div className="p-4 border-b border-[#333] flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              How to perform: {currentVideoExercise.name}
            </h3>
            <button
              onClick={closeVideo}
              className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="aspect-video w-full bg-black relative">
            {/* Support both embedded YouTube videos and direct video files */}
            {currentVideoExercise.videoUrl.includes('youtube.com/embed') ? (
              <iframe
                src={currentVideoExercise.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={currentVideoExercise.videoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>
          <div className="p-4">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <p className="text-gray-400">
              {currentVideoExercise.form?.join(' ') || 
               "Perform the exercise with proper form and control, focusing on the target muscles."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black text-white overflow-x-hidden pb-20">
      <div className="w-full animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#222] to-[#333] hover:bg-[#333] flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
              onClick={onBack}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-400 bg-clip-text text-transparent">
              {selectedMuscleGroup ? selectedMuscleGroup.name : "Muscle Groups"}
            </h2>
          </div>
          {selectedMuscleGroup && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#222] to-[#1A1A1A] px-4 py-2 rounded-full shadow-inner">
              <span className="text-gray-400">Exercises:</span>
              <span
                className="text-2xl font-bold"
                style={{ color: selectedMuscleGroup.color }}>
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
                  boxShadow: `0 10px 30px -10px ${group.color}20`,
                }}
                onClick={() => setSelectedMuscleGroup(group)}>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${group.color}40, ${group.color}20)`,
                      boxShadow: `0 8px 20px -6px ${group.color}30`,
                    }}>
                    <group.icon size={32} style={{ color: group.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{group.name}</h3>
                    <p className="text-sm text-gray-400">
                      {group.exercises.length} exercises
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{group.description}</p>
                <div className="flex flex-wrap gap-2">
                  {group.exercises.slice(0, 3).map((exercise, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${group.color}30, ${group.color}10)`,
                        border: `1px solid ${group.color}40`,
                        color: group.color,
                      }}>
                      {exercise.name}
                    </span>
                  ))}
                  {group.exercises.length > 3 && (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-[#222] to-[#333] text-gray-300 border border-[#444] hover:border-[#555] transition-all duration-300 hover:shadow-md">
                      +{group.exercises.length - 3} more
                    </span>
                  )}
                </div>
                <div className="mt-4 h-1 w-full rounded-full bg-[#222] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-full w-1/2 rounded-full moving-line" style={{ background: `linear-gradient(90deg, transparent, ${group.color}, transparent)` }}></div>
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
                boxShadow: `0 10px 30px -10px ${selectedMuscleGroup.color}20`,
              }}>
              {/* Decorative Background Elements */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full opacity-10"
                style={{
                  background: `linear-gradient(45deg, transparent, ${selectedMuscleGroup.color})`,
                  filter: "blur(100px)",
                  transform: "translateX(30%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, transparent)`,
                  filter: "blur(60px)",
                  transform: "translateX(-20%)",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start gap-8 mb-8">
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center transform hover:scale-105 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${selectedMuscleGroup.color}40, ${selectedMuscleGroup.color}20)`,
                      border: `2px solid ${selectedMuscleGroup.color}40`,
                      boxShadow: `0 8px 20px -8px ${selectedMuscleGroup.color}40`,
                    }}>
                    <selectedMuscleGroup.icon size={36} style={{ color: selectedMuscleGroup.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3
                        className="text-3xl font-bold"
                        style={{ color: selectedMuscleGroup.color }}>
                        {selectedMuscleGroup.name} Training
                      </h3>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${selectedMuscleGroup.color}30, ${selectedMuscleGroup.color}10)`,
                          color: selectedMuscleGroup.color,
                          border: `1px solid ${selectedMuscleGroup.color}40`,
                        }}>
                        {selectedMuscleGroup.exercises.length} Exercises
                      </span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {selectedMuscleGroup.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedMuscleGroup.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <p className="text-sm text-gray-400">
                        Recommended Frequency
                      </p>
                    </div>
                    <p className="text-xl font-medium">2-3 times per week</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedMuscleGroup.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <p className="text-sm text-gray-400">Recovery Time</p>
                    </div>
                    <p className="text-xl font-medium">48-72 hours</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-black bg-opacity-50 backdrop-blur-sm border border-[#333] hover:border-[#444] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selectedMuscleGroup.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                      <p className="text-sm text-gray-400">
                        Exercises per Session
                      </p>
                    </div>
                    <p className="text-xl font-medium">3-5 exercises</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B00] to-orange-400 bg-clip-text text-transparent">Recommended Exercises</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#222] to-[#1A1A1A] hover:from-[#2A2A2A] hover:to-[#222] transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                    Filter
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#222] to-[#1A1A1A] hover:from-[#2A2A2A] hover:to-[#222] transition-colors shadow-md hover:shadow-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                    Sort by Difficulty
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {selectedMuscleGroup.exercises.map((exercise, idx) => (
                  <div
                    key={idx}
                    className="group p-6 rounded-2xl border border-[#333] bg-gradient-to-br from-[#1A1A1A] to-[#0f0f0f] hover:from-[#222] hover:to-[#1A1A1A] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:border-[selectedMuscleGroup.color]"
                    onMouseEnter={() => setHoveredExercise(idx)}
                    onMouseLeave={() => setHoveredExercise(null)}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-xl font-medium mb-2 group-hover:text-[selectedMuscleGroup.color] transition-colors">
                          {exercise.name}
                        </h4>
                        <div className="flex items-center gap-2 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span className="text-sm">{exercise.equipment}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-md ${
                          exercise.difficulty === "Beginner"
                            ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/20"
                            : exercise.difficulty === "Intermediate"
                              ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/20"
                              : "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/20"
                        }`}>
                        {exercise.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#222] to-[#1A1A1A] group-hover:from-[#2A2A2A] group-hover:to-[#222] transition-colors shadow-inner">
                        <p className="text-sm text-gray-400 mb-1">Sets</p>
                        <p className="text-lg font-medium">{exercise.sets}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#222] to-[#1A1A1A] group-hover:from-[#2A2A2A] group-hover:to-[#222] transition-colors shadow-inner">
                        <p className="text-sm text-gray-400 mb-1">Reps</p>
                        <p className="text-lg font-medium">{exercise.reps}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                        onClick={() => setSelectedExercise(exercise)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        View Details
                      </button>
                      <button
                        className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg"
                        style={{
                          background:
                            hoveredExercise === idx
                              ? `linear-gradient(135deg, ${selectedMuscleGroup.color}, ${selectedMuscleGroup.color}CC)`
                              : `linear-gradient(135deg, ${selectedMuscleGroup.color}30, ${selectedMuscleGroup.color}10)`,
                          color:
                            hoveredExercise === idx
                              ? "white"
                              : selectedMuscleGroup.color,
                          boxShadow: hoveredExercise === idx 
                              ? `0 8px 20px -8px ${selectedMuscleGroup.color}80`
                              : `0 4px 12px -4px ${selectedMuscleGroup.color}40`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveExercise(exercise);
                        }}>
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                          Add to Workout
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-[#333]">
              <button
                className="px-6 py-3 bg-gradient-to-r from-[#222] to-[#1A1A1A] hover:from-[#2A2A2A] hover:to-[#222] rounded-xl transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                onClick={() => setSelectedMuscleGroup(null)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Muscle Groups
              </button>

              <button
                className="px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${selectedMuscleGroup.color}, ${selectedMuscleGroup.color}BB)`,
                  boxShadow: `0 8px 20px -8px ${selectedMuscleGroup.color}80`,
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Custom Workout
              </button>
            </div>
          </div>
        )}

        {/* Exercise Details Modal */}
        {renderExerciseDetails()}

        {/* Video Modal */}
        {renderVideoModal()}

        {/* Saved Message Toast */}
        {showSavedMessage && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
            Exercise saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default MuscleGroupSelector;
