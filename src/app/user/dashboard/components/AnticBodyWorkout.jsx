"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const AnticBodyWorkout = () => {
  const { t } = useTranslation();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(1);
  const [timer, setTimer] = useState("01:00");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [exercises, setExercises] = useState([
    { 
      id: 1, 
      name: "Barbell Squats", 
      sets: 3, 
      reps: 12, 
      completed: true,
      description: "Build lower body strength and power",
      weight: 80,
      restTime: 90,
      calories: 120
    },
    {
      id: 2,
      name: "Bench Press",
      sets: 4,
      reps: 10,
      completed: false,
      active: true,
      description: "Develop chest strength and power",
      weight: 65,
      restTime: 60,
      calories: 100
    },
    { 
      id: 3, 
      name: "Pull-ups", 
      sets: 3, 
      reps: "Max", 
      completed: false,
      description: "Build back and bicep strength",
      weight: "Bodyweight",
      restTime: 90,
      calories: 80
    },
    { 
      id: 4, 
      name: "Deadlift", 
      sets: 3, 
      reps: 8, 
      completed: false,
      description: "Full body strength and power",
      weight: 100,
      restTime: 120,
      calories: 150
    },
    { 
      id: 5, 
      name: "Shoulder Press", 
      sets: 3, 
      reps: 12, 
      completed: false,
      description: "Build shoulder strength and stability",
      weight: 45,
      restTime: 60,
      calories: 70
    },
    { 
      id: 6, 
      name: "Bicep Curls", 
      sets: 3, 
      reps: 15, 
      completed: false,
      description: "Isolate and build bicep muscles",
      weight: 20,
      restTime: 45,
      calories: 50
    },
  ]);

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
    setActiveExerciseIndex(id - 1);
  };

  const progressPercentage = (exercises.filter((ex) => ex.completed).length / exercises.length) * 100;

  const totalCalories = exercises.reduce((sum, ex) => sum + (ex.completed ? ex.calories : 0), 0);
  const totalTime = exercises.reduce((sum, ex) => sum + (ex.completed ? ex.restTime : 0), 0) / 60;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-black text-white overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="fixed w-full h-full overflow-hidden z-10">
        {/* Greek Column */}
        <div className="absolute w-[200px] h-[300px] top-1/2 left-[10%] transform -translate-y-1/2 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
            <path d="M100,0 L120,20 L120,280 L80,280 L80,20 Z" fill="#FFFFFF"/>
            <path d="M70,20 L130,20 L140,40 L60,40 Z" fill="#FFFFFF"/>
            <path d="M70,280 L130,280 L140,300 L60,300 Z" fill="#FFFFFF"/>
          </svg>
        </div>

        {/* Greek Statue */}
        <div className="absolute w-[150px] h-[200px] top-1/2 right-[10%] transform -translate-y-1/2 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 200">
            <path d="M75,0 C85,0 95,10 95,20 C95,30 85,40 75,40 C65,40 55,30 55,20 C55,10 65,0 75,0 Z" fill="#FFFFFF"/>
            <path d="M75,40 L60,60 L40,50 C35,55 30,65 35,75 C40,80 50,75 60,70 L65,75 L60,180 L90,180 L85,75 L90,70 C100,75 110,75 115,70 C120,65 115,55 110,50 L90,60 L75,40 Z" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>

      <div className="max-w-[550px] mx-auto p-5 relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-5 pt-3 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold">
              ANTIC <span className="text-orange-500">BODY</span>
            </h2>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex justify-center items-center cursor-pointer shadow-lg shadow-orange-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </header>

        {/* Workout Header */}
        <div className="mb-5 text-center">
          <div className="text-2xl md:text-3xl font-bold mb-1">
            Today's <span className="text-orange-500">Workout</span>
          </div>
          <div className="text-gray-400 text-sm md:text-base">
            Follow the plan to achieve your goals
          </div>
        </div>

        {/* Workout Stats */}
        <div className="flex justify-center gap-4 my-5">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[80px] md:min-w-[90px] border border-neutral-800 shadow-lg">
            <div className="text-xl text-orange-500 mb-1">🔥</div>
            <div className="text-sm md:text-base font-semibold">{totalCalories}</div>
            <div className="text-xs text-gray-400">CALORIES</div>
          </div>
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[80px] md:min-w-[90px] border border-neutral-800 shadow-lg">
            <div className="text-xl text-orange-500 mb-1">⏱️</div>
            <div className="text-sm md:text-base font-semibold">{Math.round(totalTime)}</div>
            <div className="text-xs text-gray-400">MINUTES</div>
          </div>
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[80px] md:min-w-[90px] border border-neutral-800 shadow-lg">
            <div className="text-xl text-orange-500 mb-1">🏋️</div>
            <div className="text-sm md:text-base font-semibold">{exercises.length}</div>
            <div className="text-xs text-gray-400">EXERCISES</div>
          </div>
        </div>

        {/* Workout Plan Section */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-5 mb-5 shadow-xl shadow-black/30 border border-neutral-800">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-800">
            <div className="text-xl font-semibold flex items-center gap-2">
              <span>📋</span> Workout Plan
            </div>
            <div className="workout-progress text-orange-500 font-semibold">
              {exercises.filter(ex => ex.completed).length}/{exercises.length}
            </div>
          </div>

          <div className="h-2 bg-neutral-800 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="flex flex-col gap-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => selectExercise(exercise.id)}
                className={`bg-neutral-800/50 rounded-xl p-4 flex items-center cursor-pointer transition-all duration-300 border border-neutral-700 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 hover:border-orange-500 ${
                  exercise.completed
                    ? "border-orange-500 bg-gradient-to-br from-neutral-800/50 to-neutral-700/50"
                    : ""
                } ${
                  exercise.active
                    ? "border-orange-500 shadow-lg shadow-orange-500/30"
                    : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 ${
                    exercise.completed
                      ? "bg-orange-500 border-orange-500"
                      : "border-neutral-600"
                  } flex justify-center items-center mr-4 text-sm transition-all duration-300`}
                >
                  {exercise.completed && "✓"}
                </div>
                <div className="flex-1">
                  <div className="text-sm md:text-base font-semibold mb-1">
                    {exercise.name}
                  </div>
                  <div className="flex gap-2 text-xs md:text-sm text-gray-400">
                    <div>{exercise.sets} sets</div>
                    <div>•</div>
                    <div>{exercise.reps} reps</div>
                  </div>
                </div>
                <div className="text-2xl text-orange-500">
                  {exercise.completed ? "🔄" : exercise.active ? "➡️" : "🔒"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Exercise Card */}
        <div className="relative overflow-hidden bg-neutral-800/70 rounded-xl p-5 mb-5 border border-neutral-700 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-orange-500 before:to-orange-400 shadow-xl">
          <div className="mb-4">
            <div className="text-xl md:text-2xl font-bold mb-1 flex items-center gap-3">
              <span className="text-orange-500">
                {String(activeExerciseIndex + 1).padStart(2, "0")}
              </span>{" "}
              {exercises[activeExerciseIndex].name}
            </div>
            <div className="text-sm text-gray-400">
              {exercises[activeExerciseIndex].description}
            </div>
          </div>

          <div className="w-full h-[200px] bg-neutral-800 rounded-xl mb-5 overflow-hidden flex justify-center items-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 200 200"
              stroke="#FF7800"
              fill="none"
            >
              {/* Exercise-specific SVG content */}
              {exercises[activeExerciseIndex].name === "Bench Press" && (
                <>
                  <rect x="60" y="120" width="80" height="20" rx="5" fill="#333" />
                  <line x1="70" y1="140" x2="70" y2="160" strokeWidth="6" />
                  <line x1="130" y1="140" x2="130" y2="160" strokeWidth="6" />
                  <line x1="30" y1="100" x2="170" y2="100" strokeWidth="8" />
                  <circle cx="50" cy="100" r="15" fill="#444" />
                  <circle cx="150" cy="100" r="15" fill="#444" />
                  <ellipse cx="100" cy="110" rx="25" ry="15" />
                  <circle cx="100" cy="75" r="15" />
                  <line x1="75" y1="100" x2="60" y2="80" strokeWidth="4" />
                  <line x1="125" y1="100" x2="140" y2="80" strokeWidth="4" />
                  <line x1="60" y1="80" x2="45" y2="100" strokeWidth="4" />
                  <line x1="140" y1="80" x2="155" y2="100" strokeWidth="4" />
                  <line x1="100" y1="110" x2="100" y2="140" strokeWidth="4" />
                  <line x1="100" y1="140" x2="80" y2="170" strokeWidth="4" />
                  <line x1="100" y1="140" x2="120" y2="170" strokeWidth="4" />
                </>
              )}
              {/* Add more exercise-specific SVGs here */}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700 shadow-inner">
              <div className="text-lg font-bold mb-1">
                {exercises[activeExerciseIndex].sets} <span className="text-orange-500">sets</span>
              </div>
              <div className="text-xs text-gray-400">TOTAL SETS</div>
            </div>
            <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700 shadow-inner">
              <div className="text-lg font-bold mb-1">
                {exercises[activeExerciseIndex].reps} <span className="text-orange-500">reps</span>
              </div>
              <div className="text-xs text-gray-400">PER SET</div>
            </div>
            <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700 shadow-inner">
              <div className="text-lg font-bold mb-1">
                {exercises[activeExerciseIndex].restTime} <span className="text-orange-500">sec</span>
              </div>
              <div className="text-xs text-gray-400">REST TIME</div>
            </div>
            <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700 shadow-inner">
              <div className="text-lg font-bold mb-1">
                {exercises[activeExerciseIndex].weight} <span className="text-orange-500">kg</span>
              </div>
              <div className="text-xs text-gray-400">SUGGESTED WEIGHT</div>
            </div>
          </div>

          <div className="bg-neutral-900/50 rounded-xl p-5 flex flex-col items-center mb-5 border border-neutral-700 shadow-inner">
            <div className="text-3xl md:text-4xl font-bold mb-3 font-mono">
              {timer}
            </div>
            <div className="flex gap-4">
              <button
                onClick={toggleTimer}
                className="py-2 px-5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
              >
                {isTimerRunning ? "Pause" : "Start Rest"}
              </button>
              <button
                onClick={resetTimer}
                className="py-2 px-5 rounded-lg font-semibold bg-transparent text-gray-400 border border-neutral-600 hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-5">
            <div className="grid grid-cols-3 gap-2 text-gray-400 text-sm font-semibold pb-1 border-b border-neutral-700 mb-3">
              <div>SET</div>
              <div>WEIGHT (KG)</div>
              <div>REPS</div>
            </div>

            {Array.from({ length: exercises[activeExerciseIndex].sets }).map((_, setNum) => (
              <div
                key={setNum}
                className="grid grid-cols-3 gap-2 mb-2 items-center"
              >
                <div className="font-semibold text-orange-500">{setNum + 1}</div>
                <input
                  type="text"
                  className="bg-neutral-800/80 border border-neutral-600 text-white rounded-md p-2 text-sm w-full focus:outline-none focus:border-orange-500 transition-all duration-300"
                  defaultValue={setNum === 0 ? exercises[activeExerciseIndex].weight : ""}
                />
                <input
                  type="text"
                  className="bg-neutral-800/80 border border-neutral-600 text-white rounded-md p-2 text-sm w-full focus:outline-none focus:border-orange-500 transition-all duration-300"
                  defaultValue={setNum === 0 ? exercises[activeExerciseIndex].reps : ""}
                />
              </div>
            ))}
          </div>

          <button className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 w-full rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-orange-500/30 relative overflow-hidden hover:translate-y-[-2px] hover:shadow-xl hover:shadow-orange-500/40">
            Complete Exercise
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-neutral-950/95 backdrop-blur-md py-4 border-t border-neutral-800 z-50">
          <div className="max-w-[550px] mx-auto flex justify-around">
            <div className="flex flex-col items-center p-1 text-orange-500 cursor-pointer transition-all duration-300 rounded-lg hover:bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <div className="text-xs font-medium">Home</div>
            </div>

            <div className="flex flex-col items-center p-1 text-gray-500 cursor-pointer transition-all duration-300 rounded-lg hover:bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div className="text-xs font-medium">Progress</div>
            </div>

            <div className="flex flex-col items-center p-1 text-gray-500 cursor-pointer transition-all duration-300 rounded-lg hover:bg-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <div className="text-xs font-medium">Settings</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnticBodyWorkout; 