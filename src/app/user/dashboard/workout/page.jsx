"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MuscleGroupSelector from "../components/MuscleGroupSelector";
import RecommendedProgram from "../components/RecommendedProgram";
import WorkoutPlans from "../components/WorkoutPlans";
import AnticBodyWorkout from "../components/AnticBodyWorkout";

export default function WorkoutPage() {
    const router = useRouter();
    const [showMuscleGroups, setShowMuscleGroups] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [activeWorkout, setActiveWorkout] = useState(false);
    const [currentExerciseVideo, setCurrentExerciseVideo] = useState(null);

    // Recommended custom training program for client
    const recommendedTraining = {
        name: "Advanced Hypertrophy Program - Week 1",
        icon: "crown",
        summary: "Customized 4-Day Split for Your First Week",
        description:
            "This personalized program was designed based on your goals, experience level, and schedule. Week 1 follows an optimized upper/lower split to establish a foundation for progressive muscle growth while providing sufficient recovery between sessions.",
        color: "#9d4edd",
        preferences: {
            location: "Gym",
            equipment: "Full Equipment",
            duration: "60-75 min",
            frequency: "4 days/week",
        },
        days: [
            {
                name: "Week 1, Day 1: Upper Body Push",
                exercises: [
                    {
                        name: "Incline Barbell Bench Press",
                        sets: 4,
                        reps: "8-10",
                        restTime: "90-120 sec",
                        notes: "Focus on controlled eccentric",
                    },
                    {
                        name: "Seated Dumbbell Shoulder Press",
                        sets: 4,
                        reps: "10-12",
                        restTime: "90 sec",
                        notes: "Full range of motion",
                    },
                    {
                        name: "Cable Flyes",
                        sets: 3,
                        reps: "12-15",
                        restTime: "60 sec",
                        notes: "Squeeze at peak contraction",
                    },
                    {
                        name: "Lateral Raises",
                        sets: 4,
                        reps: "12-15",
                        restTime: "60 sec",
                        notes: "Maintain tension throughout",
                    },
                    {
                        name: "Skull Crushers",
                        sets: 3,
                        reps: "10-12",
                        restTime: "60-90 sec",
                        notes: "Keep elbows fixed",
                    },
                    {
                        name: "Rope Pushdowns",
                        sets: 3,
                        reps: "12-15",
                        restTime: "60 sec",
                        notes: "Focus on mind-muscle connection",
                    },
                ]
            },
            // other days would be included here but omitted for brevity
        ],
        notes: [
            "This is your Week 1 starting plan - we'll adjust intensity for subsequent weeks",
            "Start each workout with a 5-10 minute dynamic warm-up",
            "Rest 48 hours between training similar muscle groups",
            "First week focus: Learn proper form before increasing weights",
            "Track your Week 1 workouts to establish your baseline",
            "Nutrition: Aim for 1.8-2g protein per kg bodyweight daily",
            "Sleep 7-9 hours for optimal recovery and growth",
        ],
        progressionStrategy: {
            weekTwo: "Increase weights by 5-10% where form allows",
            weekThree: "Add 1 set to main compound exercises",
            weekFour: "Reduce rest periods by 15-30 seconds",
        },
    };

    // Training types with preferences
    const trainingTypes = [
        {
            id: 1,
            name: "Explosive Power",
            icon: "lightning",
            summary: "Speed & Power Training",
            description:
                "Develop fast-twitch muscle fibers and athletic explosiveness with plyometrics and power-focused movements.",
            color: "#FF6B00",
            preferences: {
                location: "Gym",
                equipment: "Full Equipment",
                duration: "45-60 min",
                frequency: "3-4 days/week",
            },
            exercises: [
                { name: "Box Jumps", sets: 4, reps: "8", restTime: "90 sec" },
                {
                    name: "Medicine Ball Slams",
                    sets: 3,
                    reps: "10",
                    restTime: "60 sec",
                },
                { name: "Hang Cleans", sets: 4, reps: "6", restTime: "120 sec" },
                {
                    name: "Plyometric Push-ups",
                    sets: 3,
                    reps: "Max",
                    restTime: "90 sec",
                },
                { name: "Speed Squats", sets: 4, reps: "10", restTime: "90 sec" },
            ],
        },
        // Other training types would be here (omitted for brevity)
    ];

    // Featured workouts (shortened for brevity)
    const featuredWorkouts = [
        {
            title: "30-Day Strength Builder",
            level: "Intermediate",
            duration: "45 min",
            color: "#e74c3c",
            users: 856,
            description: "A comprehensive strength program designed to increase your power and muscle mass over 30 days",
            schedule: "3-4 days per week",
            equipment: "Full gym access required",
            workouts: [
                {
                    name: "Day 1: Upper Body Power",
                    exercises: [
                        { 
                            name: "Bench Press", 
                            sets: 4, 
                            reps: "8-10", 
                            rest: "90 sec",
                            videoUrl: "https://example.com/videos/bench-press.mp4",
                            instructions: "Lie on bench with feet flat on floor. Grip barbell with hands slightly wider than shoulder-width. Lower bar to mid-chest, then press back up."
                        },
                        { 
                            name: "Bent Over Rows", 
                            sets: 4, 
                            reps: "8-10", 
                            rest: "90 sec",
                            videoUrl: "https://example.com/videos/bent-over-rows.mp4",
                            instructions: "Hinge at hips with slight knee bend, keeping back flat. Pull barbell to lower chest, squeezing shoulder blades together."
                        },
                        { 
                            name: "Military Press", 
                            sets: 3, 
                            reps: "8-10", 
                            rest: "90 sec",
                            videoUrl: "https://example.com/videos/military-press.mp4",
                            instructions: "Start with barbell at shoulder height. Press weight overhead until arms are fully extended. Lower with control."
                        },
                        { 
                            name: "Pull-ups", 
                            sets: 3, 
                            reps: "Max", 
                            rest: "120 sec",
                            videoUrl: "https://example.com/videos/pull-ups.mp4",
                            instructions: "Hang from bar with hands shoulder-width apart. Pull up until chin clears the bar, then lower with control."
                        }
                    ]
                }
            ]
        },
        {
            title: "Functional Fitness Bootcamp",
            level: "All Levels",
            duration: "35 min",
            color: "#2ecc71",
            users: 1243,
            description: "High-intensity functional training that combines cardio and strength for overall fitness improvement",
            schedule: "2-3 days per week",
            equipment: "Minimal equipment needed",
            workouts: [
                {
                    name: "Full Body HIIT Circuit",
                    exercises: [
                        { 
                            name: "Burpees", 
                            sets: 3, 
                            reps: "15", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/burpees.mp4",
                            instructions: "Start standing, drop to floor into push-up position, perform push-up, jump feet toward hands, then jump up with hands overhead."
                        },
                        { 
                            name: "Kettlebell Swings", 
                            sets: 3, 
                            reps: "20", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/kettlebell-swings.mp4",
                            instructions: "Stand with feet shoulder-width apart, hinge at hips and swing kettlebell between legs, then thrust hips forward to swing weight to shoulder height."
                        },
                        { 
                            name: "Mountain Climbers", 
                            sets: 3, 
                            reps: "30 sec", 
                            rest: "15 sec",
                            videoUrl: "https://example.com/videos/mountain-climbers.mp4",
                            instructions: "Start in push-up position, alternately bring knees toward chest in running motion while keeping hips low and core engaged."
                        },
                        { 
                            name: "Box Jumps", 
                            sets: 3, 
                            reps: "12", 
                            rest: "45 sec",
                            videoUrl: "https://example.com/videos/box-jumps.mp4",
                            instructions: "Stand facing box, drop into quarter squat, swing arms back then forward as you jump onto box with soft landing."
                        }
                    ]
                }
            ]
        },
        {
            title: "Core & Mobility Focus",
            level: "Beginner",
            duration: "30 min",
            color: "#3498db",
            users: 952,
            description: "Strengthen your core while improving flexibility and joint mobility",
            schedule: "3-5 days per week",
            equipment: "Mat and resistance bands",
            workouts: [
                {
                    name: "Core Stability Workout",
                    exercises: [
                        { 
                            name: "Plank Variations", 
                            sets: 3, 
                            reps: "45 sec hold", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/plank-variations.mp4",
                            instructions: "Start in forearm plank position with body in straight line. Keep core tight and shoulders away from ears."
                        },
                        { 
                            name: "Russian Twists", 
                            sets: 3, 
                            reps: "20 (10 each side)", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/russian-twists.mp4",
                            instructions: "Sit with knees bent, feet elevated. Lean back slightly, rotate torso to tap floor on each side."
                        },
                        { 
                            name: "Bird Dogs", 
                            sets: 3, 
                            reps: "12 each side", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/bird-dogs.mp4",
                            instructions: "Start on hands and knees. Simultaneously extend opposite arm and leg while keeping back flat and core engaged."
                        },
                        { 
                            name: "Dead Bug", 
                            sets: 3, 
                            reps: "10 each side", 
                            rest: "30 sec",
                            videoUrl: "https://example.com/videos/dead-bug.mp4",
                            instructions: "Lie on back with arms up and knees bent 90°. Lower opposite arm and leg while maintaining lower back contact with floor."
                        }
                    ]
                }
            ]
        }
    ];

    // Sample user preferences
    const userPreferences = {
        goal: "Strength",
        fitnessLevel: "Intermediate",
        workoutDuration: "45-60 min",
        workoutsPerWeek: 4,
        focusAreas: ["Upper Body", "Core"],
        equipment: "Full Gym Access"
    };

    // Tailored program based on user preferences
    const tailoredProgram = {
        id: 1,
        title: "Custom Strength Builder",
        level: "Intermediate",
        focus: "Upper Body & Core",
        workoutsPerWeek: 4,
        duration: "8 weeks",
        description: "A personalized strength training program based on your preferences and goals, focusing on upper body and core development.",
        matchScore: 96,
        completedWorkouts: 2,
        totalWorkouts: 32,
        progress: {
            weeks: [
                { week: 1, completed: 2, total: 4 },
                { week: 2, completed: 0, total: 4 },
                // other weeks would be here
            ]
        },
        nextWorkout: {
            name: "Upper Body Power",
            day: "Day 3",
            scheduledFor: "Today",
            duration: "60 min",
            exercises: [
                { name: "Bench Press", sets: 4, reps: "8-10", rest: "90 sec" },
                { name: "Bent Over Rows", sets: 4, reps: "8-10", rest: "90 sec" },
                // other exercises would be here
            ]
        },
        benefits: ["Increased strength", "Muscle hypertrophy", "Improved posture", "Better metabolism"],
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop"
    };

    const handleWorkoutSelect = (workout) => {
        setSelectedWorkout(workout);
    };

    const startWorkout = (workout = null) => {
        if (workout) {
            setSelectedWorkout(workout);
        }
        setActiveWorkout(true);
    };

    const showExerciseVideo = (exercise) => {
        setCurrentExerciseVideo(exercise);
    };

    const hideExerciseVideo = () => {
        setCurrentExerciseVideo(null);
    };

    const renderWorkoutDetails = () => {
        if (!selectedWorkout) return null;
        
        // Check if workouts array exists and has items
        const hasWorkouts = selectedWorkout.workouts && selectedWorkout.workouts.length > 0;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-[#111] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-[#111] p-6 border-b border-[#333] flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">{selectedWorkout.title}</h2>
                            <p className="text-gray-400">{selectedWorkout.description}</p>
                        </div>
                        <button
                            onClick={() => setSelectedWorkout(null)}
                            className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors">
                            ✕
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[#222] p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Level</p>
                                <p className="font-medium">{selectedWorkout.level}</p>
                            </div>
                            <div className="bg-[#222] p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Duration</p>
                                <p className="font-medium">{selectedWorkout.duration}</p>
                            </div>
                            <div className="bg-[#222] p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Schedule</p>
                                <p className="font-medium">{selectedWorkout.schedule}</p>
                            </div>
                            <div className="bg-[#222] p-4 rounded-lg">
                                <p className="text-gray-400 text-sm">Equipment</p>
                                <p className="font-medium">{selectedWorkout.equipment}</p>
                            </div>
                        </div>
                        
                        {hasWorkouts && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">{selectedWorkout.workouts[0].name}</h3>
                                
                                <div className="space-y-4 mb-6">
                                    {selectedWorkout.workouts[0].exercises.map((exercise, idx) => (
                                        <div key={idx} className="bg-[#222] p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium mb-2">{exercise.name}</h4>
                                                <button 
                                                    onClick={() => showExerciseVideo(exercise)} 
                                                    className="w-8 h-8 rounded-lg bg-[#333] flex items-center justify-center hover:bg-[#444] transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="bg-[#333] px-3 py-1 rounded-full">{exercise.sets} sets</span>
                                                <span className="bg-[#333] px-3 py-1 rounded-full">{exercise.reps}</span>
                                                <span className="bg-[#333] px-3 py-1 rounded-full">{exercise.rest} rest</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">{exercise.instructions}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        
                        <button 
                            onClick={() => startWorkout(selectedWorkout)}
                            className="w-full px-6 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56200] hover:to-[#e57733] text-white rounded-lg transition flex items-center justify-center text-lg font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Workout
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Exercise video modal
    const renderExerciseVideoModal = () => {
        if (!currentExerciseVideo) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                <div className="bg-[#111] rounded-2xl max-w-4xl w-full overflow-hidden">
                    <div className="p-4 border-b border-[#333] flex justify-between items-center">
                        <h3 className="text-xl font-semibold">How to perform: {currentExerciseVideo.name}</h3>
                        <button
                            onClick={hideExerciseVideo}
                            className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center hover:bg-[#333] transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="aspect-video w-full bg-black relative">
                        <video 
                            src={currentExerciseVideo.videoUrl} 
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                        />
                    </div>
                    <div className="p-4">
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <p className="text-gray-400">{currentExerciseVideo.instructions}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (showMuscleGroups) {
        return <MuscleGroupSelector onBack={() => setShowMuscleGroups(false)} />;
    }

    if (activeWorkout) {
        // Fix by safely accessing workout data
        let workoutData = tailoredProgram.nextWorkout;
        
        // Only use selectedWorkout's data if it exists and has workouts
        if (selectedWorkout && selectedWorkout.workouts && selectedWorkout.workouts.length > 0) {
            workoutData = selectedWorkout.workouts[0];
        }
        
        return <AnticBodyWorkout 
            workout={workoutData}
            onComplete={() => {
                setActiveWorkout(false);
                // Here you would update the completed workouts counter
            }}
            onCancel={() => setActiveWorkout(false)}
        />;
    }

    return (
        <div className="space-y-8">
            {/* Program Overview */}
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-xl overflow-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10" />
                        </svg>
                        {tailoredProgram.title}
                    </h1>
                    <span className="bg-[#FF6B00] text-white text-sm px-3 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tailoredProgram.matchScore}% Match
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-1">
                        <div className="h-48 rounded-xl overflow-hidden mb-4">
                            <img src={tailoredProgram.image} alt={tailoredProgram.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="bg-[#252525] rounded-xl p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Duration:</span>
                                <span className="font-medium">{tailoredProgram.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Level:</span>
                                <span className="font-medium">{tailoredProgram.level}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Focus:</span>
                                <span className="font-medium">{tailoredProgram.focus}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Sessions per week:</span>
                                <span className="font-medium">{tailoredProgram.workoutsPerWeek}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div className="bg-[#252525] rounded-xl p-5 h-full flex flex-col">
                            <h2 className="text-lg font-semibold mb-1">Program Progress</h2>
                            <p className="text-gray-400 text-sm mb-4">You've completed {tailoredProgram.completedWorkouts} of {tailoredProgram.totalWorkouts} workouts</p>
                            
                            <div className="mb-2 flex justify-between items-center">
                                <span className="text-sm text-gray-400">Overall progress:</span>
                                <span className="text-sm font-medium">{Math.round((tailoredProgram.completedWorkouts / tailoredProgram.totalWorkouts) * 100)}%</span>
                            </div>
                            <div className="w-full bg-[#333] rounded-full h-2 mb-6">
                                <div 
                                    className="bg-[#FF6B00] h-2 rounded-full" 
                                    style={{ width: `${(tailoredProgram.completedWorkouts / tailoredProgram.totalWorkouts) * 100}%` }}
                                ></div>
                            </div>
                            
                            <div className="mt-auto text-sm text-center text-gray-400">
                                Based on your preferences for <span className="text-white">{userPreferences.goal}</span> training 
                                focusing on <span className="text-white">{userPreferences.focusAreas.join(" & ")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Workout Section */}
            <div className="bg-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Next Workout
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#252525] text-white text-sm px-3 py-1 rounded-lg">
                            {tailoredProgram.nextWorkout.day}
                        </span>
                        <span className="bg-[#252525] text-white text-sm px-3 py-1 rounded-lg">
                            {tailoredProgram.nextWorkout.duration}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold">{tailoredProgram.nextWorkout.name}</h3>
                    <p className="text-gray-400 text-sm">{tailoredProgram.nextWorkout.scheduledFor}</p>
                </div>

                <button 
                    onClick={startWorkout}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56200] hover:to-[#e57733] text-white rounded-lg transition flex items-center justify-center text-lg font-medium shadow-lg shadow-orange-500/20 transform hover:translate-y-[-2px]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Workout
                </button>
            </div>

            {/* Other Training Options Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Other Training Options</h2>
                
                {/* Training Types and Muscle Group Cards */}
                <WorkoutPlans
                    trainingTypes={trainingTypes}
                    onShowMuscleGroups={() => setShowMuscleGroups(true)}
                />

                {/* Featured Workouts */}
                <div className="mt-16 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Featured Workouts</h3>
                        <button className="text-[#3498db] hover:underline text-sm font-medium">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredWorkouts.map((workout, index) => (
                            <div
                                key={index}
                                onClick={() => handleWorkoutSelect(workout)}
                                className="rounded-xl overflow-hidden bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-[#333] hover:border-gray-500 transition-all duration-300 p-4 cursor-pointer">
                                <div
                                    className="h-36 rounded-lg mb-4 relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(45deg, ${workout.color}40, transparent)`,
                                    }}>
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
                                        strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M10 8l6 4-6 4V8z"></path>
                                    </svg>
                                </div>

                                <h4 className="font-medium text-lg mb-1">{workout.title}</h4>
                                <p className="text-gray-400 text-sm">
                                    {workout.duration} • {workout.users} active users
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Workout Details Modal */}
            {renderWorkoutDetails()}
            
            {/* Exercise Video Modal */}
            {renderExerciseVideoModal()}
        </div>
    );
} 