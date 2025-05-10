"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const WorkoutPage = () => {
    const params = useParams();
    const [workout, setWorkout] = useState(null);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [timer, setTimer] = useState("01:00");
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [workoutProgress, setWorkoutProgress] = useState(0);

    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // Fetch workout data
    useEffect(() => {
        // In a real app, this would fetch from your API
        const mockWorkout = {
            id: params.id,
            name: "Advanced Hypertrophy Program",
            exercises: [
                {
                    name: "Barbell Bench Press",
                    sets: 4,
                    reps: "8-10",
                    restTime: 60,
                    weight: 65,
                    notes: "Focus on controlled eccentric",
                },
                {
                    name: "Incline Dumbbell Press",
                    sets: 3,
                    reps: "10-12",
                    restTime: 60,
                    weight: 45,
                    notes: "Full range of motion",
                },
                {
                    name: "Cable Flyes",
                    sets: 3,
                    reps: "12-15",
                    restTime: 60,
                    weight: 30,
                    notes: "Squeeze at peak contraction",
                },
                {
                    name: "Lateral Raises",
                    sets: 4,
                    reps: "12-15",
                    restTime: 60,
                    weight: 15,
                    notes: "Maintain tension throughout",
                },
                {
                    name: "Skull Crushers",
                    sets: 3,
                    reps: "10-12",
                    restTime: 60,
                    weight: 40,
                    notes: "Keep elbows fixed",
                },
                {
                    name: "Rope Pushdowns",
                    sets: 3,
                    reps: "12-15",
                    restTime: 60,
                    weight: 35,
                    notes: "Focus on mind-muscle connection",
                },
            ],
        };
        setWorkout(mockWorkout);
    }, [params.id]);

    const toggleTimer = () => {
        setIsTimerRunning(!isTimerRunning);
    };

    const resetTimer = () => {
        setTimer("01:00");
        setIsTimerRunning(false);
    };

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                const [minutes, seconds] = timer.split(":").map(Number);
                if (minutes === 0 && seconds === 0) {
                    setIsTimerRunning(false);
                    return;
                }
                if (seconds === 0) {
                    setTimer(`${String(minutes - 1).padStart(2, "0")}:59`);
                } else {
                    setTimer(`${String(minutes).padStart(2, "0")}:${String(seconds - 1).padStart(2, "0")}`);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const completeExercise = () => {
        setCompletedExercises((prev) => [...prev, currentExercise]);
        if (currentExercise < workout.exercises.length - 1) {
            setCurrentExercise((prev) => prev + 1);
            setCurrentSet(1);
        } else {
            setWorkoutProgress(100);
            setShowCompletionModal(true);
        }
    };

    const updateProgress = useCallback(() => {
        const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
        const completedSets = completedExercises.length + (currentSet - 1);
        setWorkoutProgress((completedSets / totalSets) * 100);
    }, [workout, completedExercises, currentSet]);

    useEffect(() => {
        if (workout) {
            updateProgress();
        }
    }, [workout, updateProgress]);

    // Add exercise video URLs
    const exerciseVideos = {
        "Barbell Bench Press": "https://www.youtube.com/embed/rT7DgCr-3pg",
        "Incline Dumbbell Press": "https://www.youtube.com/embed/0G2_XV7slIg",
        "Cable Flyes": "https://www.youtube.com/embed/Iwe6AmxVf7o",
        "Lateral Raises": "https://www.youtube.com/embed/3VcKaXpzqRo",
        "Skull Crushers": "https://www.youtube.com/embed/d_KZxkY_0cM",
        "Rope Pushdowns": "https://www.youtube.com/embed/vB5OHsJ3EME",
    };

    if (!workout) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-[#FF6B00] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Background Shapes */}
            <div className="fixed w-full h-full overflow-hidden z-10">
                {/* Parthenon */}
                <div className="absolute w-[200px] h-[80px] top-0 left-1/2 transform -translate-x-1/2 -translate-y-[40%] opacity-40 filter brightness-0 invert-[56%] sepia-[83%] saturate-[1500%] hue-rotate-[360deg] brightness-100 contrast-[106%]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
                        <path
                            d="M10,60 L190,60 L170,20 L30,20 Z M25,60 L25,40 L35,40 L35,60 Z M45,60 L45,40 L55,40 L55,60 Z M65,60 L65,40 L75,40 L75,60 Z M85,60 L85,40 L95,40 L95,60 Z M105,60 L105,40 L115,40 L115,60 Z M125,60 L125,40 L135,40 L135,60 Z M145,60 L145,40 L155,40 L155,60 Z M165,60 L165,40 L175,40 L175,60 Z"
                            fill="#FFFFFF"
                        />
                    </svg>
                </div>

                {/* Discus thrower */}
                <div className="absolute w-[100px] h-[100px] top-0 right-[30%] transform translate-y-[30%] opacity-40 filter brightness-0 invert-[56%] sepia-[83%] saturate-[1500%] hue-rotate-[360deg] brightness-100 contrast-[106%]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <path
                            d="M50,20 C53,20 55,22 55,25 C55,28 53,30 50,30 C47,30 45,28 45,25 C45,22 47,20 50,20 Z M50,35 L43,45 L28,40 C25,43 22,48 25,53 C28,55 35,53 43,50 L46,53 L43,75 L55,75 L58,53 L65,50 C72,53 77,50 75,45 C72,40 65,40 58,43 L50,35 Z"
                            fill="#FFFFFF"
                        />
                        <circle cx="28" cy="45" r="6" fill="#FFFFFF" />
                    </svg>
                </div>

                {/* Colosseum */}
                <div className="absolute w-[200px] h-[100px] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[40%] opacity-40 filter brightness-0 invert-[56%] sepia-[83%] saturate-[1500%] hue-rotate-[360deg] brightness-100 contrast-[106%]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
                        <ellipse cx="100" cy="60" rx="80" ry="30" fill="none" stroke="#FFFFFF" strokeWidth="3" />
                        <ellipse cx="100" cy="60" rx="65" ry="25" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <path
                            d="M35,60 L35,40 M45,60 L45,35 M55,60 L55,30 M65,60 L65,28 M75,60 L75,25 M85,60 L85,24 M95,60 L95,23 M105,60 L105,23 M115,60 L115,24 M125,60 L125,25 M135,60 L135,28 M145,60 L145,30 M155,60 L155,35 M165,60 L165,40"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>

            <div className="max-w-[550px] mx-auto p-5 relative z-20 pb-32">
                {/* Header */}
                <header className="sticky top-0 bg-black/80 backdrop-blur-sm mb-5 pt-3 w-full flex justify-between items-center z-30">
                    <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 400 400">
                            <defs>
                                <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: "#FF7800", stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: "#FF9A00", stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <g transform="translate(200, 200) scale(0.8)">
                                <path
                                    d="M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z
                       M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0
                       C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z"
                                    fill="url(#orangeGradient)"
                                />
                                <circle cx="-40" cy="-5" r="10" fill="#000" stroke="#FF7800" strokeWidth="1" />
                            </g>
                        </svg>
                        <h2 className="text-lg font-bold">
                            ANTIC <span className="text-orange-500">BODY</span>
                        </h2>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-orange-900/30">
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
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </header>

                {/* Workout Header */}
                <div className="mb-5 text-center">
                    <div className="text-2xl md:text-3xl font-bold mb-1">
                        Today's <span className="text-orange-500">Workout</span>
                    </div>
                    <div className="text-gray-400 text-sm md:text-base">Follow the plan to achieve your goals</div>
                </div>

                {/* Workout Details */}
                <div className="flex justify-center gap-4 my-5">
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[70px] md:min-w-[80px] border border-neutral-800">
                        <div className="text-xl text-orange-500 mb-1">🔥</div>
                        <div className="text-sm md:text-base font-semibold">320</div>
                        <div className="text-xs text-gray-400">CALORIES</div>
                    </div>
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[70px] md:min-w-[80px] border border-neutral-800">
                        <div className="text-xl text-orange-500 mb-1">⏱️</div>
                        <div className="text-sm md:text-base font-semibold">45</div>
                        <div className="text-xs text-gray-400">MINUTES</div>
                    </div>
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-4 flex flex-col items-center min-w-[70px] md:min-w-[80px] border border-neutral-800">
                        <div className="text-xl text-orange-500 mb-1">🏋️</div>
                        <div className="text-sm md:text-base font-semibold">{workout.exercises.length}</div>
                        <div className="text-xs text-gray-400">EXERCISES</div>
                    </div>
                </div>

                {/* Workout Plan Section */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-5 mb-5 shadow-xl shadow-black/30 border border-neutral-800">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-800">
                        <div className="text-xl font-semibold flex items-center gap-2">
                            <span>📋</span> Workout Plan
                        </div>
                        <div className="workout-progress">
                            {completedExercises.length + 1}/{workout.exercises.length}
                        </div>
                    </div>

                    <div className="h-1.5 bg-neutral-800 rounded-sm mb-5 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-sm"
                            style={{ width: `${workoutProgress}%` }}
                        ></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {workout.exercises.map((exercise, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentExercise(index)}
                                className={`bg-neutral-800/50 rounded-xl p-4 flex items-center cursor-pointer transition-all duration-300 border border-neutral-700 hover:translate-y-[-2px] hover:shadow-md hover:shadow-black/20 hover:border-orange-500 ${
                                    completedExercises.includes(index)
                                        ? "border-orange-500 bg-gradient-to-br from-neutral-800/50 to-neutral-700/50"
                                        : ""
                                } ${index === currentExercise ? "border-orange-500 shadow-md shadow-orange-500/30" : ""}`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full border-2 ${
                                        completedExercises.includes(index)
                                            ? "bg-orange-500 border-orange-500"
                                            : "border-neutral-600"
                                    } flex justify-center items-center mr-4 text-sm transition-all duration-300`}
                                >
                                    {completedExercises.includes(index) && "✓"}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm md:text-base font-semibold mb-1">{exercise.name}</div>
                                    <div className="flex gap-2 text-xs md:text-sm text-gray-400">
                                        <div>{exercise.sets} sets</div>
                                        <div>•</div>
                                        <div>{exercise.reps} reps</div>
                                    </div>
                                </div>
                                <div className="text-2xl text-orange-500">
                                    {completedExercises.includes(index) ? "🔄" : index === currentExercise ? "➡️" : "🔒"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Exercise Card */}
                <div className="relative overflow-hidden bg-neutral-800/70 rounded-xl p-5 mb-5 border border-neutral-700 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-orange-500 before:to-orange-400">
                    <div className="mb-4">
                        <div className="text-xl md:text-2xl font-bold mb-1 flex items-center gap-3">
                            <span className="text-orange-500">{String(currentExercise + 1).padStart(2, "0")}</span>{" "}
                            {workout.exercises[currentExercise].name}
                        </div>
                        <div className="text-sm text-gray-400">{workout.exercises[currentExercise].notes}</div>
                    </div>

                    {/* Video Demonstration */}
                    <div className="w-full aspect-video bg-neutral-800 rounded-xl mb-5 overflow-hidden">
                        <iframe
                            src={exerciseVideos[workout.exercises[currentExercise].name]}
                            title="Exercise Demonstration"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="w-full h-[200px] bg-neutral-800 rounded-xl mb-5 overflow-hidden flex justify-center items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="120"
                            height="120"
                            viewBox="0 0 200 200"
                            stroke="#FF7800"
                            fill="none"
                        >
                            {/* Bench */}
                            <rect x="60" y="120" width="80" height="20" rx="5" fill="#333" />
                            <line x1="70" y1="140" x2="70" y2="160" strokeWidth="6" />
                            <line x1="130" y1="140" x2="130" y2="160" strokeWidth="6" />

                            {/* Bar */}
                            <line x1="30" y1="100" x2="170" y2="100" strokeWidth="8" />
                            <circle cx="50" cy="100" r="15" fill="#444" />
                            <circle cx="150" cy="100" r="15" fill="#444" />

                            {/* Person */}
                            <ellipse cx="100" cy="110" rx="25" ry="15" />
                            <circle cx="100" cy="75" r="15" />
                            <line x1="75" y1="100" x2="60" y2="80" strokeWidth="4" />
                            <line x1="125" y1="100" x2="140" y2="80" strokeWidth="4" />
                            <line x1="60" y1="80" x2="45" y2="100" strokeWidth="4" />
                            <line x1="140" y1="80" x2="155" y2="100" strokeWidth="4" />
                            <line x1="100" y1="110" x2="100" y2="140" strokeWidth="4" />
                            <line x1="100" y1="140" x2="80" y2="170" strokeWidth="4" />
                            <line x1="100" y1="140" x2="120" y2="170" strokeWidth="4" />
                        </svg>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700">
                            <div className="text-lg font-bold mb-1">
                                {workout.exercises[currentExercise].sets} <span className="text-orange-500">sets</span>
                            </div>
                            <div className="text-xs text-gray-400">TOTAL SETS</div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700">
                            <div className="text-lg font-bold mb-1">
                                {workout.exercises[currentExercise].reps} <span className="text-orange-500">reps</span>
                            </div>
                            <div className="text-xs text-gray-400">PER SET</div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700">
                            <div className="text-lg font-bold mb-1">
                                {workout.exercises[currentExercise].restTime} <span className="text-orange-500">sec</span>
                            </div>
                            <div className="text-xs text-gray-400">REST TIME</div>
                        </div>
                        <div className="bg-neutral-900/50 rounded-lg p-3 border border-neutral-700">
                            <div className="text-lg font-bold mb-1">
                                {workout.exercises[currentExercise].weight} <span className="text-orange-500">kg</span>
                            </div>
                            <div className="text-xs text-gray-400">SUGGESTED WEIGHT</div>
                        </div>
                    </div>

                    <div className="bg-neutral-900/50 rounded-xl p-5 flex flex-col items-center mb-5 border border-neutral-700">
                        <div className="text-3xl md:text-4xl font-bold mb-3 font-mono">{timer}</div>
                        <div className="flex gap-4">
                            <button
                                onClick={toggleTimer}
                                className="py-2 px-5 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                            >
                                {isTimerRunning ? "Pause" : "Start Rest"}
                            </button>
                            <button
                                onClick={resetTimer}
                                className="py-2 px-5 rounded-lg font-semibold bg-transparent text-gray-400 border border-neutral-600"
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

                        {Array.from({
                            length: workout.exercises[currentExercise].sets,
                        }).map((_, setNum) => (
                            <div key={setNum} className="grid grid-cols-3 gap-2 mb-2 items-center">
                                <div className="font-semibold text-orange-500">{setNum + 1}</div>
                                <input
                                    type="text"
                                    className="bg-neutral-800/80 border border-neutral-600 text-white rounded-md p-2 text-sm w-full focus:outline-none focus:border-orange-500"
                                    defaultValue={setNum === 0 ? workout.exercises[currentExercise].weight : ""}
                                />
                                <input
                                    type="text"
                                    className="bg-neutral-800/80 border border-neutral-600 text-white rounded-md p-2 text-sm w-full focus:outline-none focus:border-orange-500"
                                    defaultValue={setNum === 0 ? workout.exercises[currentExercise].reps.split("-")[0] : ""}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        className="bg-gradient-to-r from-orange-500 to-orange-400 text-white p-4 w-full rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-md shadow-orange-500/30 relative overflow-hidden hover:translate-y-[-2px] hover:shadow-lg hover:shadow-orange-500/40"
                        onClick={completeExercise}
                    >
                        Complete Exercise
                    </button>
                </div>
            </div>

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-neutral-900 rounded-3xl max-w-2xl w-full overflow-hidden animate-scaleIn border border-neutral-800 my-8">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Workout Complete! 🎉</h2>
                                <p className="text-gray-400">Great job! You've completed your training session.</p>
                            </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-neutral-800 rounded-xl p-4">
                                    <div className="text-sm text-gray-400 mb-1">Total Volume</div>
                                    <div className="text-2xl font-bold">2,450 kg</div>
                                </div>
                                <div className="bg-neutral-800 rounded-xl p-4">
                                    <div className="text-sm text-gray-400 mb-1">Calories Burned</div>
                                    <div className="text-2xl font-bold">320 kcal</div>
                                </div>
                                <div className="bg-neutral-800 rounded-xl p-4">
                                    <div className="text-sm text-gray-400 mb-1">Exercises</div>
                                    <div className="text-2xl font-bold">{workout.exercises.length}</div>
                                </div>
                                <div className="bg-neutral-800 rounded-xl p-4">
                                    <div className="text-sm text-gray-400 mb-1">Total Sets</div>
                                    <div className="text-2xl font-bold">
                                        {workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)}
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                                <div className="space-y-4">
                                    <div className="bg-neutral-800 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Next Workout</h4>
                                                <p className="text-sm text-gray-400">
                                                    Lower Body Focus - Scheduled for tomorrow
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-neutral-800 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium mb-1">Recovery Tips</h4>
                                                <p className="text-sm text-gray-400">
                                                    Get 7-8 hours of sleep and stay hydrated
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post-Workout Nutrition */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Post-Workout Nutrition</h3>
                                <div className="bg-neutral-800 rounded-xl p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span className="text-sm">Protein shake (30g protein)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span className="text-sm">Banana or apple for quick carbs</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span className="text-sm">Water with electrolytes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-orange-500">•</span>
                                            <span className="text-sm">Meal within 2 hours: Lean protein + complex carbs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-xl font-medium transition-all duration-300"
                                    onClick={() => (window.location.href = "/user/dashboard")}
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl font-medium transition-all duration-300"
                                    onClick={() => (window.location.href = "/user/progress")}
                                >
                                    View Progress
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutPage;
