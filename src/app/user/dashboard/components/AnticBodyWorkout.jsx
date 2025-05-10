"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const AnticBodyWorkout = ({ workout, onComplete, onCancel }) => {
  const [timer, setTimer] = useState("01:00");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [workoutElapsedTime, setWorkoutElapsedTime] = useState(0);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");
  const [workoutPhase, setWorkoutPhase] = useState("warmup"); // warmup, main, cooldown
  const [isRestPhase, setIsRestPhase] = useState(false);
  
  // All available muscle groups from exercises
  const muscleGroups = ["All", "Legs", "Chest", "Back", "Shoulders", "Arms", "Core"];
  
  // Dynamic workout phases based on exercise completion
  const phases = [
    { id: "warmup", name: "Warm Up", description: "Get your body ready" },
    { id: "main", name: "Main Workout", description: "High intensity training" },
    { id: "cooldown", name: "Cool Down", description: "Recover and stretch" }
  ];

  // Initialize exercises from passed workout data or use defaults
  useEffect(() => {
    if (workout && workout.exercises) {
      const formattedExercises = workout.exercises.map((ex, index) => ({
        id: index + 1,
        name: ex.name,
        sets: ex.sets || 3,
        reps: ex.reps || "10-12",
        completed: false,
        active: index === 0, // Set first exercise as active
        description: ex.instructions || ex.notes || "Complete all sets with proper form",
        weight: ex.weight || "Use appropriate weight",
        restTime: parseInt(ex.restTime) || 60,
        calories: Math.floor(Math.random() * 50) + 50, // Just a placeholder calculation
        videoUrl: ex.videoUrl || getDefaultVideoUrl(ex.name),
        thumbnailUrl: ex.thumbnailUrl || getDefaultThumbnailUrl(ex.name),
        muscleGroup: ex.muscleGroup || "",
        equipment: ex.equipment || ""
      }));
      setExercises(formattedExercises);
    } else {
      // Use default exercises if none are provided
      setExercises([
        {
          id: 1,
          name: "Barbell Squats",
          sets: 3,
          reps: 12,
          completed: false,
          active: true,
          description: "Lower the body by bending the knees and hips, keeping the back straight and knees in line with toes. Push through heels to return to standing position.",
          weight: 80,
          restTime: 90,
          calories: 120,
          videoUrl: "https://v.animethemes.moe/MajoNoTabitabi-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/barbell-squat.jpg",
          muscleGroup: "Legs",
          equipment: "Barbell"
        },
        {
          id: 2,
          name: "Bench Press",
          sets: 4,
          reps: 10,
          completed: false,
          description: "Lie flat on bench with feet on floor. Grip bar slightly wider than shoulder width. Lower bar to mid-chest, then press up until arms are fully extended.",
          weight: 65,
          restTime: 60,
          calories: 100,
          videoUrl: "https://v.animethemes.moe/DeathParade-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/bench-press.jpg",
          muscleGroup: "Chest",
          equipment: "Barbell"
        },
        {
          id: 3,
          name: "Pull-ups",
          sets: 3,
          reps: "Max",
          completed: false,
          description: "Hang from bar with palms facing away. Pull body up until chin is over bar, then lower with control until arms are fully extended.",
          weight: "Bodyweight",
          restTime: 90,
          calories: 80,
          videoUrl: "https://v.animethemes.moe/ReZero-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/pull-up.jpg",
          muscleGroup: "Back",
          equipment: "Pull-up Bar"
        },
        {
          id: 4,
          name: "Deadlift",
          sets: 3,
          reps: 8,
          completed: false,
          description: "Stand with feet hip-width apart, grip bar with hands just outside knees. Keep back straight, push through heels and lift by extending hips and knees.",
          weight: 100,
          restTime: 120,
          calories: 150,
          videoUrl: "https://v.animethemes.moe/AttackOnTitan-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/deadlift.jpg",
          muscleGroup: "Back/Legs",
          equipment: "Barbell"
        },
        {
          id: 5,
          name: "Shoulder Press",
          sets: 3,
          reps: 12,
          completed: false,
          description: "Sit or stand with bar at shoulder height. Press weight overhead until arms are fully extended. Lower with control back to starting position.",
          weight: 45,
          restTime: 60,
          calories: 70,
          videoUrl: "https://v.animethemes.moe/DrStone-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/overhead-press.jpg",
          muscleGroup: "Shoulders",
          equipment: "Barbell"
        },
        {
          id: 6,
          name: "Bicep Curls",
          sets: 3,
          reps: 15,
          completed: false,
          description: "Stand with dumbbells at sides, palms facing forward. Curl weights toward shoulders while keeping elbows close to body. Lower with control.",
          weight: 20,
          restTime: 45,
          calories: 50,
          videoUrl: "https://v.animethemes.moe/OnePunchMan-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/bicep-curl.jpg",
          muscleGroup: "Arms",
          equipment: "Dumbbells"
        },
        {
          id: 7,
          name: "Tricep Dips",
          sets: 3,
          reps: 12,
          completed: false,
          description: "Support body between parallel bars with arms extended. Lower body by bending arms until shoulders are at elbow level, then press back up.",
          weight: "Bodyweight",
          restTime: 60,
          calories: 60,
          videoUrl: "https://v.animethemes.moe/Overlord-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/tricep-dip.jpg",
          muscleGroup: "Arms",
          equipment: "Parallel Bars"
        },
        {
          id: 8,
          name: "Leg Press",
          sets: 3,
          reps: 12,
          completed: false,
          description: "Sit in machine with feet on platform at shoulder width. Lower platform by bending knees to 90 degrees, then press back up without locking knees.",
          weight: 150,
          restTime: 90,
          calories: 100,
          videoUrl: "https://v.animethemes.moe/JujutsuKaisen-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/leg-press.jpg",
          muscleGroup: "Legs",
          equipment: "Machine"
        },
        {
          id: 9,
          name: "Lat Pulldown",
          sets: 3,
          reps: 12,
          completed: false,
          description: "Sit at machine, grip bar wider than shoulder width. Pull bar down to chest level while keeping back straight, then control the return.",
          weight: 55,
          restTime: 60,
          calories: 70,
          videoUrl: "https://v.animethemes.moe/DemonSlayer-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/lat-pulldown.jpg",
          muscleGroup: "Back",
          equipment: "Cable Machine"
        },
        {
          id: 10,
          name: "Cable Flyes",
          sets: 3,
          reps: 15,
          completed: false,
          description: "Stand between cable stations with arms extended to sides. Bring hands together in front of chest in an arcing motion, then return with control.",
          weight: 15,
          restTime: 45,
          calories: 40,
          videoUrl: "https://v.animethemes.moe/HunterXHunter2011-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/cable-fly.jpg",
          muscleGroup: "Chest",
          equipment: "Cable Machine"
        },
        {
          id: 11,
          name: "Plank",
          sets: 3,
          reps: "60 seconds",
          completed: false,
          description: "Support body on forearms and toes, maintaining straight line from head to heels. Engage core and hold position without sagging or raising hips.",
          weight: "Bodyweight",
          restTime: 45,
          calories: 30,
          videoUrl: "https://v.animethemes.moe/FullmetalAlchemistBrotherhood-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/plank.jpg",
          muscleGroup: "Core",
          equipment: "None"
        },
        {
          id: 12,
          name: "Russian Twists",
          sets: 3,
          reps: 20,
          completed: false,
          description: "Sit on floor with knees bent, feet elevated. Twist torso to touch weight to floor on each side, engaging obliques throughout movement.",
          weight: 10,
          restTime: 45,
          calories: 40,
          videoUrl: "https://v.animethemes.moe/TokyoGhoul-OP1.mp4",
          thumbnailUrl: "https://cdn.muscleandstrength.com/sites/default/files/russian-twist.jpg",
          muscleGroup: "Core",
          equipment: "Dumbbell/Plate"
        }
      ]);
    }
    
    // Start workout timer
    setWorkoutStartTime(new Date());
  }, [workout]);

  // Helper functions for video and thumbnail URLs
  function getDefaultVideoUrl(exerciseName) {
    const exerciseVideos = {
      "Barbell Squats": "https://v.animethemes.moe/MajoNoTabitabi-OP1.mp4",
      "Bench Press": "https://v.animethemes.moe/DeathParade-OP1.mp4",
      "Pull-ups": "https://v.animethemes.moe/ReZero-OP1.mp4",
      "Deadlift": "https://v.animethemes.moe/AttackOnTitan-OP1.mp4",
      "Shoulder Press": "https://v.animethemes.moe/DrStone-OP1.mp4",
      "Bicep Curls": "https://v.animethemes.moe/OnePunchMan-OP1.mp4",
      "Tricep Dips": "https://v.animethemes.moe/Overlord-OP1.mp4",
      "Leg Press": "https://v.animethemes.moe/JujutsuKaisen-OP1.mp4",
      "Lat Pulldown": "https://v.animethemes.moe/DemonSlayer-OP1.mp4",
      "Cable Flyes": "https://v.animethemes.moe/HunterXHunter2011-OP1.mp4",
      "Plank": "https://v.animethemes.moe/FullmetalAlchemistBrotherhood-OP1.mp4",
      "Russian Twists": "https://v.animethemes.moe/TokyoGhoul-OP1.mp4",
    };
    
    return exerciseVideos[exerciseName] || "https://v.animethemes.moe/MajoNoTabitabi-OP1.mp4";
  }
  
  function getDefaultThumbnailUrl(exerciseName) {
    const exerciseThumbnails = {
      "Barbell Squats": "https://cdn.muscleandstrength.com/sites/default/files/barbell-squat.jpg",
      "Bench Press": "https://cdn.muscleandstrength.com/sites/default/files/bench-press.jpg",
      "Pull-ups": "https://cdn.muscleandstrength.com/sites/default/files/pull-up.jpg",
      "Deadlift": "https://cdn.muscleandstrength.com/sites/default/files/deadlift.jpg",
      "Shoulder Press": "https://cdn.muscleandstrength.com/sites/default/files/overhead-press.jpg",
      "Bicep Curls": "https://cdn.muscleandstrength.com/sites/default/files/bicep-curl.jpg",
      "Tricep Dips": "https://cdn.muscleandstrength.com/sites/default/files/tricep-dip.jpg",
      "Leg Press": "https://cdn.muscleandstrength.com/sites/default/files/leg-press.jpg",
      "Lat Pulldown": "https://cdn.muscleandstrength.com/sites/default/files/lat-pulldown.jpg",
      "Cable Flyes": "https://cdn.muscleandstrength.com/sites/default/files/cable-fly.jpg",
      "Plank": "https://cdn.muscleandstrength.com/sites/default/files/plank.jpg",
      "Russian Twists": "https://cdn.muscleandstrength.com/sites/default/files/russian-twist.jpg",
    };
    
    return exerciseThumbnails[exerciseName] || "https://cdn.muscleandstrength.com/sites/default/files/barbell-squat.jpg";
  }

  // Timer for rest periods
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const [minutes, seconds] = prevTime.split(":").map(Number);
          if (minutes === 0 && seconds === 0) {
            setIsTimerRunning(false);
            return "01:00";
          }
          if (seconds === 0) {
            return `${String(minutes - 1).padStart(2, "0")}:59`;
          }
          return `${String(minutes).padStart(2, "0")}:${String(seconds - 1).padStart(2, "0")}`;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Calculate timer progress percentage
  const calculateTimerProgress = () => {
    const [minutes, seconds] = timer.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const maxSeconds = 60; // Using 60 seconds as default
    
    if (activeExercise) {
      return (totalSeconds / activeExercise.restTime) * 100;
    }
    
    return (totalSeconds / maxSeconds) * 100;
  };

  // Overall workout timer
  useEffect(() => {
    if (!workoutStartTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - workoutStartTime) / 1000);
      setWorkoutElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [workoutStartTime]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimer("01:00");
    setIsTimerRunning(false);
  };

  const selectExercise = (id) => {
    const updatedExercises = exercises.map((ex) => ({
      ...ex,
      active: ex.id === id,
    }));
    setExercises(updatedExercises);
  };

  const markExerciseComplete = (id) => {
    const updatedExercises = exercises.map((ex) => {
      if (ex.id === id) {
        return { ...ex, completed: true };
      }
      return ex;
    });
    
    setExercises(updatedExercises);
    
    // Start rest phase if this is enabled
    if (!isRestPhase) {
      startRestPhase();
    }
    
    // Check if all exercises are completed
    const allCompleted = updatedExercises.every(ex => ex.completed);
    if (allCompleted) {
      setIsConfirmationVisible(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const completeWorkout = () => {
    if (onComplete) {
      onComplete({
        duration: workoutElapsedTime,
        completedExercises: exercises.filter(ex => ex.completed).length,
        totalExercises: exercises.length,
        caloriesBurned: totalCalories
      });
    }
  };

 

  const progressPercentage =
    (exercises.filter((ex) => ex.completed).length / exercises.length) * 100;

  const totalCalories = exercises.reduce(
    (sum, ex) => sum + (ex.completed ? ex.calories : 0),
    0
  );
  
  const totalTime = formatTime(workoutElapsedTime);

  const activeExercise = exercises.find(ex => ex.active) || exercises[0];

  const toggleVideoDisplay = () => {
    setShowVideo(!showVideo);
    if (!showVideo) {
      setVideoLoading(true);
    }
  };

  const handleVideoLoaded = () => {
    setVideoLoading(false);
  };

  // Get exercises filtered by muscle group and phase
  const getFilteredExercises = () => {
    if (selectedMuscleGroup === "All") {
      return exercises;
    }
    return exercises.filter(ex => ex.muscleGroup.includes(selectedMuscleGroup));
  };

  // Determine workout phase based on completion percentage
  useEffect(() => {
    const completedCount = exercises.filter(ex => ex.completed).length;
    const totalCount = exercises.length;
    const completionPercentage = (completedCount / totalCount) * 100;
    
    if (completionPercentage < 15) {
      setWorkoutPhase("warmup");
    } else if (completionPercentage < 85) {
      setWorkoutPhase("main");
    } else {
      setWorkoutPhase("cooldown");
    }
  }, [exercises]);
  
  // Enter rest phase after completing an exercise
  const startRestPhase = () => {
    setIsRestPhase(true);
    setIsTimerRunning(true);
  };
  
  // End rest phase and continue to next exercise
  const endRestPhase = () => {
    setIsRestPhase(false);
    setIsTimerRunning(false);
    resetTimer();
    
    // Auto-select next uncompleted exercise
    const nextUncompleted = exercises.find(ex => !ex.completed);
    if (nextUncompleted) {
      selectExercise(nextUncompleted.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black text-white overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="fixed w-full h-full overflow-hidden z-10">
        {/* Greek Column */}
        <div className="absolute w-[200px] h-[300px] top-1/2 left-[10%] transform -translate-y-1/2 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
            <path d="M100,0 L120,20 L120,280 L80,280 L80,20 Z" fill="#FFFFFF" />
            <path d="M70,20 L130,20 L140,40 L60,40 Z" fill="#FFFFFF" />
            <path d="M70,280 L130,280 L140,300 L60,300 Z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Greek Statue */}
        <div className="absolute w-[150px] h-[200px] top-1/2 right-[10%] transform -translate-y-1/2 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200">
            <path
              d="M75,0 C85,0 95,10 95,20 C95,30 85,40 75,40 C65,40 55,30 55,20 C55,10 65,0 75,0 Z"
              fill="#FFFFFF"
            />
            <path
              d="M75,40 L60,60 L40,50 C35,55 30,65 35,75 C40,80 50,75 60,70 L65,75 L60,180 L90,180 L85,75 L90,70 C100,75 110,75 115,70 C120,65 115,55 110,50 L90,60 L75,40 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && activeExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#111] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#333]">
            <div className="p-4 border-b border-[#333] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{activeExercise.name} - Technique Guide</h3>
              </div>
              <button
                onClick={toggleVideoDisplay}
                className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black relative">
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="w-16 h-16 border-4 border-gray-600 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              )}
              <video 
                src={activeExercise.videoUrl} 
                className="w-full h-full object-contain"
                controls
                autoPlay
                onLoadedData={handleVideoLoaded}
                poster={activeExercise.thumbnailUrl}
              />
            </div>
            <div className="p-6">
              <h4 className="font-medium text-lg mb-3 text-orange-500">Proper Form & Technique:</h4>
              <p className="text-gray-300 leading-relaxed">{activeExercise.description}</p>
              
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-[#222] p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Recommended Sets</p>
                  <p className="font-medium">{activeExercise.sets}</p>
                </div>
                <div className="bg-[#222] p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Target Reps</p>
                  <p className="font-medium">{activeExercise.reps}</p>
                </div>
                <div className="bg-[#222] p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Rest Time</p>
                  <p className="font-medium">{activeExercise.restTime}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[550px] mx-auto p-5 relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-5 pt-3 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="text-lg font-bold">
              ANTIC <span className="text-orange-500">BODY</span>
            </h2>
          </div>
          <button 
            onClick={() => setIsConfirmationVisible(true)}
            className="w-10 h-10 bg-[#333] hover:bg-[#444] rounded-full flex justify-center items-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Workout Header */}
        <div className="mb-5">
          <div className="text-2xl md:text-3xl font-bold mb-1 flex items-center">
            <span>Today's <span className="text-orange-500">Workout</span></span>
            <span className="ml-3 text-sm bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-0.5 rounded-full">
              {selectedMuscleGroup === "All" ? "Full Body" : selectedMuscleGroup}
            </span>
          </div>
          <p className="text-gray-400 flex items-center gap-2">
            <span>{workout?.name || 'Full Body Strength'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{exercises.length} exercises</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>Est. {Math.floor(exercises.reduce((sum, ex) => sum + ex.calories, 0) * 0.6)} - {exercises.reduce((sum, ex) => sum + ex.calories, 0)} cal</span>
          </p>
        </div>

        {/* Workout Phases */}
        <div className="relative mb-6">
          <div className="absolute h-1 bg-[#222] left-0 right-0 top-[14px] rounded-full"></div>
          <div 
            className="absolute h-1 bg-gradient-to-r from-orange-500 to-orange-400 left-0 top-[14px] rounded-full transition-all duration-300"
            style={{ 
              width: `${workoutPhase === "warmup" ? 16.7 : workoutPhase === "main" ? 50 : 100}%` 
            }}
          ></div>
          
          <div className="flex justify-between relative">
            {phases.map((phase, index) => (
              <div 
                key={phase.id}
                className={`flex flex-col items-center justify-center ${
                  workoutPhase === phase.id ? "opacity-100" : "opacity-70"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                  workoutPhase === phase.id 
                    ? "bg-orange-500 shadow-lg shadow-orange-500/20" 
                    : phases.findIndex(p => p.id === workoutPhase) > index
                      ? "bg-green-500 shadow-lg shadow-green-500/20"
                      : "bg-[#333]"
                }`}>
                  {phases.findIndex(p => p.id === workoutPhase) > index 
                    ? "✓" 
                    : index + 1}
                </div>
                <p className="text-xs mt-2 font-medium">{phase.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#111] p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-400">Time</p>
            </div>
            <p className="text-xl font-semibold">{totalTime}</p>
          </div>
          <div className="bg-[#111] p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm text-gray-400">Progress</p>
            </div>
            <p className="text-xl font-semibold">{Math.round(progressPercentage)}%</p>
          </div>
          <div className="bg-[#111] p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-400">Calories</p>
            </div>
            <p className="text-xl font-semibold">{totalCalories}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-[#222] rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}></div>
        </div>

        {/* Rest Phase or Exercise Details */}
        {isRestPhase ? (
          <div className="bg-[#111] rounded-2xl p-5 mb-5">
            <div className="text-center mb-5">
              <h3 className="text-2xl font-bold text-orange-500 mb-1">Rest Period</h3>
              <p className="text-gray-400">Take a short break before your next exercise</p>
            </div>
            
            <div className="flex justify-center items-center mb-8">
              <div className="w-40 h-40 rounded-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#333"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FF6B00"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 - (282.7 * calculateTimerProgress()) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex justify-center items-center">
                  <span className="text-4xl font-bold">{timer}</span>
                </div>
              </div>
            </div>
            
            {/* Next exercise preview */}
            {activeExercise && (
              <div className="mb-8 bg-[#1a1a1a] p-4 rounded-lg">
                <p className="text-center text-sm text-gray-400 mb-3">Coming up next:</p>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={activeExercise.thumbnailUrl} 
                      alt={activeExercise.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{activeExercise.name}</h4>
                      <span className="text-xs bg-[#333] px-1.5 py-0.5 rounded text-gray-300">
                        {activeExercise.muscleGroup}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                      <span>{activeExercise.sets} sets</span>
                      <span>•</span>
                      <span>{activeExercise.reps} reps</span>
                      <span>•</span>
                      <span>{activeExercise.weight}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center gap-3 sticky bottom-0 bg-[#111] pt-3">
              <button
                onClick={toggleTimer}
                className={`flex-1 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
                  isTimerRunning
                    ? "bg-[#333] text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20"
                }`}>
                {isTimerRunning ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={endRestPhase}
                className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Skip Rest
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#111] rounded-2xl p-5 mb-5">
            {activeExercise && (
              <>
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-2xl font-bold">{activeExercise.name}</h2>
                    <span className="text-xs font-medium bg-orange-500 bg-opacity-20 text-orange-500 px-2 py-0.5 rounded">
                      {activeExercise.muscleGroup}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {activeExercise.description}
                  </p>
                </div>
                
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 relative cursor-pointer shadow-xl" 
                  onClick={toggleVideoDisplay}
                >
                  <Image 
                    src={activeExercise.thumbnailUrl} 
                    alt={activeExercise.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center hover:bg-opacity-20 transition-all">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <p className="text-sm text-white font-medium flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Watch technique guide
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#222] p-4 rounded-lg flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Sets</p>
                    <p className="font-medium text-lg">{activeExercise.sets}</p>
                  </div>
                  <div className="bg-[#222] p-4 rounded-lg flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Reps</p>
                    <p className="font-medium text-lg">{activeExercise.reps}</p>
                  </div>
                  <div className="bg-[#222] p-4 rounded-lg flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">Weight</p>
                    <p className="font-medium text-lg">{activeExercise.weight}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-12 bg-[#222] rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-300">Rest: {activeExercise.restTime}s</span>
                  </div>
                  <div className="flex-1 h-12 bg-[#222] rounded-lg flex items-center justify-center">
                    <span className="text-sm text-gray-300">Equipment: {activeExercise.equipment}</span>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-[#111] pt-3">
                  {!activeExercise.completed ? (
                    <button
                      onClick={() => markExerciseComplete(activeExercise.id)}
                      className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-lg font-semibold text-lg transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete Exercise
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 bg-green-500 text-white rounded-lg font-semibold text-lg flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Exercise Completed
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Muscle Group Filter */}
        <div className="mb-4 overflow-x-auto custom-scrollbar-x">
          <div className="flex space-x-2 min-w-min pb-1">
            {muscleGroups.map(group => (
              <button
                key={group}
                onClick={() => setSelectedMuscleGroup(group)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedMuscleGroup === group
                    ? "bg-orange-500 text-white"
                    : "bg-[#222] text-gray-300 hover:bg-[#333]"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="bg-[#111] rounded-2xl p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Workout Timeline</h3>
            <div className="text-sm px-3 py-1 bg-[#222] rounded-lg text-gray-400">
              {exercises.filter(ex => ex.completed).length}/{exercises.length} completed
            </div>
          </div>
          
          <div className="space-y-4 h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {workoutPhase === "warmup" && (
              <div className="px-3 py-2 bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-20 rounded-lg mb-2">
                <p className="text-orange-500 text-sm font-medium">Warm Up Phase</p>
              </div>
            )}
            
            {workoutPhase === "main" && exercises.filter(ex => ex.completed).length > 0 && (
              <div className="px-3 py-2 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-lg mb-2">
                <p className="text-green-500 text-sm font-medium">Warm Up Phase Completed</p>
              </div>
            )}
            
            {getFilteredExercises().map((exercise, index) => (
              <div
                key={exercise.id}
                onClick={() => selectExercise(exercise.id)}
                className={`p-4 rounded-lg cursor-pointer transition relative ${
                  exercise.active
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-400/20 border border-orange-500/40"
                    : exercise.completed
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-[#191919] border border-[#333] hover:border-[#444]"
                }`}
              >
                {index < getFilteredExercises().length - 1 && (
                  <div className="absolute left-4 top-[4rem] bottom-[-1.5rem] w-0.5 bg-[#333] z-0">
                    {exercise.completed && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500 z-10"></div>}
                  </div>
                )}
                
                <div className="flex gap-4 items-start relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0 ${
                      exercise.completed
                        ? "bg-green-500 text-white"
                        : exercise.active
                        ? "bg-orange-500 text-white"
                        : "bg-[#333] text-white"
                    }`}
                  >
                    {exercise.completed ? (
                      "✓"
                    ) : (
                      <span className="text-sm">{exercise.id}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <span className="text-xs bg-[#333] px-1.5 py-0.5 rounded text-gray-300">
                            {exercise.muscleGroup}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {exercise.sets} sets × {exercise.reps} reps • {exercise.weight}
                        </p>
                      </div>
                      
                      <div 
                        className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
                        onClick={(e) => {
                          e.stopPropagation();
                          selectExercise(exercise.id);
                          toggleVideoDisplay();
                        }}
                      >
                        <Image 
                          src={exercise.thumbnailUrl} 
                          alt={exercise.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-orange-500/80 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 bg-[#222] rounded-md text-xs text-gray-400">
                        {exercise.restTime}s rest
                      </span>
                      <span className="inline-block px-2 py-1 bg-[#222] rounded-md text-xs text-gray-400">
                        ~{exercise.calories} cal
                      </span>
                      <span className="inline-block px-2 py-1 bg-[#222] rounded-md text-xs text-gray-400">
                        {exercise.equipment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {workoutPhase === "cooldown" && exercises.filter(ex => !ex.completed).length === 0 && (
              <div className="px-3 py-2 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-lg mt-2">
                <p className="text-green-500 text-sm font-medium">Great job! Workout completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx >{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #222;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ff6b00;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #ff8533;
          }
          .custom-scrollbar-x::-webkit-scrollbar {
            height: 4px;
          }
          .custom-scrollbar-x::-webkit-scrollbar-track {
            background: #222;
            border-radius: 10px;
          }
          .custom-scrollbar-x::-webkit-scrollbar-thumb {
            background: #ff6b00;
            border-radius: 10px;
          }
          .custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
            background: #ff8533;
          }
        `}</style>

        {/* Confirmation Modal */}
        {isConfirmationVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] max-w-md w-full rounded-xl p-6 shadow-xl border border-[#333]">
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-orange-500 bg-opacity-20 rounded-full">
                  {exercises.every(ex => ex.completed) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2">
                  {exercises.every(ex => ex.completed) 
                    ? "Workout Complete! 🎉" 
                    : "End Workout?"}
                </h3>
                
                {exercises.every(ex => ex.completed) ? (
                  <div className="mb-4 text-gray-300">
                    Congratulations on completing your workout! You've crushed all {exercises.length} exercises.
                  </div>
                ) : (
                  <div className="mb-4 text-gray-300">
                    You've completed {exercises.filter(ex => ex.completed).length} of {exercises.length} exercises. Are you sure you want to end this workout?
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2 bg-[#222] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Time</p>
                  <p className="font-medium text-xl">{totalTime}</p>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Exercises</p>
                  <p className="font-medium text-xl">{exercises.filter(ex => ex.completed).length}/{exercises.length}</p>
                </div>
                
                <div className="bg-[#222] p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-1">Calories</p>
                  <p className="font-medium text-xl">{totalCalories}</p>
                </div>
              </div>
              
              {/* Muscle groups trained */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Muscle Groups Trained:</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(exercises.filter(ex => ex.completed).map(ex => ex.muscleGroup))).map(group => (
                    <span key={group} className="px-2 py-1 bg-[#333] text-xs rounded-md text-gray-300">
                      {group}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirmationVisible(false)}
                  className="flex-1 py-3 bg-[#333] hover:bg-[#444] text-white rounded-lg font-medium transition">
                  Continue Workout
                </button>
                <button
                  onClick={completeWorkout}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-lg font-medium transition shadow-lg shadow-orange-500/20">
                  {exercises.every(ex => ex.completed) ? "Finish" : "End Workout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnticBodyWorkout;
