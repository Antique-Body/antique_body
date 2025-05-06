"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState("week");

    // Sample user stats (this would ideally come from your API/database)
    const userStats = {
        weeklyStats: {
            workoutsCompleted: 3,
            totalWorkoutTime: 180, // in minutes
            avgCaloriesBurned: 450,
            topMuscleGroups: ["Chest", "Back", "Legs"],
        },
        monthlyStats: {
            workoutsCompleted: 12,
            totalWorkoutTime: 720, // in minutes
            avgCaloriesBurned: 480,
            topMuscleGroups: ["Back", "Chest", "Arms"],
        },
        userPreferences: {
            goal: "Strength",
            fitnessLevel: "Intermediate",
            workoutDuration: "45-60 min",
            workoutsPerWeek: 4,
            focusAreas: ["Upper Body", "Core"],
            equipment: "Full Gym Access"
        },
        nutrition: {
            dailyCalories: 2400,
            proteinGoal: 180,
            proteinConsumed: 150,
            carbsGoal: 220,
            carbsConsumed: 190,
            fatsGoal: 80,
            fatsConsumed: 65,
        },
        recentWorkouts: [
            {
                id: 1,
                name: "Full Body HIIT",
                date: "Yesterday",
                duration: "45 min",
                intensity: "High",
                caloriesBurned: 520,
            },
            {
                id: 2,
                name: "Push Day",
                date: "Monday",
                duration: "60 min",
                intensity: "Medium",
                caloriesBurned: 410,
            },
            {
                id: 3,
                name: "Pull Day",
                date: "Last Saturday",
                duration: "55 min",
                intensity: "Medium",
                caloriesBurned: 380,
            },
        ],
        tailoredProgram: {
            id: 1,
            title: "Custom Strength Builder",
            level: "Intermediate",
            focus: "Upper Body & Core",
            workoutsPerWeek: 4,
            duration: "8 weeks",
            description: "A personalized strength training program based on your preferences and goals, focusing on upper body and core development.",
            matchScore: 96,
            nextWorkout: {
                name: "Upper Body Power",
                scheduledFor: "Tomorrow, 9:00 AM",
                duration: "60 min",
                exercises: [
                    { name: "Bench Press", sets: 4, reps: "8-10" },
                    { name: "Bent Over Rows", sets: 4, reps: "8-10" },
                    { name: "Shoulder Press", sets: 3, reps: "10-12" },
                    { name: "Pull-ups", sets: 3, reps: "8-10" },
                    { name: "Tricep Pushdowns", sets: 3, reps: "12-15" },
                    { name: "Bicep Curls", sets: 3, reps: "12-15" }
                ]
            },
            benefits: ["Increased strength", "Muscle hypertrophy", "Improved posture", "Better metabolism"],
            image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
            progress: {
                completed: 3,
                total: 32,
                percentage: 9
            }
        }
    };

    // Choose stats based on selected period
    const stats = selectedPeriod === "week" ? userStats.weeklyStats : userStats.monthlyStats;

    const handleStartProgram = () => {
        router.push("/user/dashboard/workout");
    };

    return (
        <div className="space-y-8">
            {/* Welcome message */}
            <div className="bg-gradient-to-r from-[#222] to-[#333] rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
                </h1>
                <p className="text-gray-300">Here's an overview of your fitness journey.</p>
            </div>

            {/* Tailored Program Section */}
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Your Tailored Program
                        </h2>
                        <span className="bg-[#FF6B00] text-white text-sm px-3 py-1 rounded-full flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {userStats.tailoredProgram.matchScore}% Match
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="h-48 rounded-xl overflow-hidden">
                                <img src={userStats.tailoredProgram.image} alt={userStats.tailoredProgram.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Duration:</span>
                                    <span className="font-medium">{userStats.tailoredProgram.duration}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Level:</span>
                                    <span className="font-medium">{userStats.tailoredProgram.level}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Focus:</span>
                                    <span className="font-medium">{userStats.tailoredProgram.focus}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Sessions per week:</span>
                                    <span className="font-medium">{userStats.tailoredProgram.workoutsPerWeek}</span>
                                </div>
                            </div>
                            
                            {/* Program Progress */}
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-400">Program Progress:</span>
                                    <span className="text-sm font-medium">{userStats.tailoredProgram.progress.percentage}%</span>
                                </div>
                                <div className="w-full bg-[#333] rounded-full h-2 mb-1">
                                    <div 
                                        className="bg-[#FF6B00] h-2 rounded-full" 
                                        style={{ width: `${userStats.tailoredProgram.progress.percentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 text-right">
                                    {userStats.tailoredProgram.progress.completed} of {userStats.tailoredProgram.progress.total} workouts
                                </p>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <div className="h-full flex flex-col">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{userStats.tailoredProgram.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{userStats.tailoredProgram.description}</p>
                                </div>
                                
                                <div className="bg-[#252525] rounded-xl p-4 mb-4 flex-grow">
                                    <h4 className="text-md font-medium mb-3 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Next Workout: {userStats.tailoredProgram.nextWorkout.name}
                                    </h4>
                                    <div className="text-sm text-gray-300 mb-1">{userStats.tailoredProgram.nextWorkout.scheduledFor} • {userStats.tailoredProgram.nextWorkout.duration}</div>
                                    
                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        {userStats.tailoredProgram.nextWorkout.exercises.slice(0, 4).map((exercise, index) => (
                                            <div key={index} className="bg-[#333] rounded-lg p-2 text-sm">
                                                <div className="font-medium">{exercise.name}</div>
                                                <div className="text-gray-400 text-xs">{exercise.sets} sets × {exercise.reps}</div>
                                            </div>
                                        ))}
                                        {userStats.tailoredProgram.nextWorkout.exercises.length > 4 && (
                                            <div className="bg-[#333] rounded-lg p-2 text-sm flex items-center justify-center">
                                                <span className="text-gray-400">+{userStats.tailoredProgram.nextWorkout.exercises.length - 4} more</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-auto">
                                    <button 
                                        onClick={handleStartProgram} 
                                        className="w-full py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56200] hover:to-[#e57733] text-white rounded-lg transition flex items-center justify-center shadow-lg shadow-orange-500/20 transform hover:translate-y-[-2px]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Start Your Workout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Stats</h2>
                    <div className="bg-[#222] rounded-lg p-1">
                        <button
                            className={`px-4 py-1.5 text-sm rounded-md transition ${
                                selectedPeriod === "week" ? "bg-[#FF6B00] text-white" : "text-gray-400"
                            }`}
                            onClick={() => setSelectedPeriod("week")}>
                            This Week
                        </button>
                        <button
                            className={`px-4 py-1.5 text-sm rounded-md transition ${
                                selectedPeriod === "month" ? "bg-[#FF6B00] text-white" : "text-gray-400"
                            }`}
                            onClick={() => setSelectedPeriod("month")}>
                            This Month
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#1a1a1a] rounded-xl p-5">
                        <div className="text-gray-400 text-sm mb-1">Workouts Completed</div>
                        <div className="text-2xl font-bold">{stats.workoutsCompleted}</div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl p-5">
                        <div className="text-gray-400 text-sm mb-1">Total Workout Time</div>
                        <div className="text-2xl font-bold">{stats.totalWorkoutTime} min</div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl p-5">
                        <div className="text-gray-400 text-sm mb-1">Avg. Calories Burned</div>
                        <div className="text-2xl font-bold">{stats.avgCaloriesBurned}</div>
                    </div>
                    
                    <div className="bg-[#1a1a1a] rounded-xl p-5">
                        <div className="text-gray-400 text-sm mb-1">Top Muscle Groups</div>
                        <div className="text-sm font-medium">
                            {stats.topMuscleGroups.map((group, i) => (
                                <span key={i} className="inline-block bg-[#333] rounded-full px-3 py-1 mr-2 mb-2">
                                    {group}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Two column section with nutrition */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Preferences */}
                <div className="bg-[#1a1a1a] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
                    <div className="space-y-4">
                        <div className="bg-[#222] rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Fitness Goal</h3>
                                <p className="text-gray-400 text-sm">{userStats.userPreferences.goal}</p>
                            </div>
                            <div className="bg-[#333] p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="bg-[#222] rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Preferred Workout Duration</h3>
                                <p className="text-gray-400 text-sm">{userStats.userPreferences.workoutDuration}</p>
                            </div>
                            <div className="bg-[#333] p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="bg-[#222] rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">Focus Areas</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {userStats.userPreferences.focusAreas.map((area, index) => (
                                        <span key={index} className="bg-[#333] text-xs px-2 py-1 rounded-full text-gray-300">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#333] p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => router.push("/user/dashboard/settings")}
                            className="w-full py-3 mt-3 bg-gradient-to-r from-[#222] to-[#333] hover:from-[#2A2A2A] hover:to-[#444] text-white rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Update Preferences
                        </button>
                    </div>
                </div>

                {/* Nutrition overview */}
                <div className="bg-[#1a1a1a] rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Nutrition Overview</h2>
                    <div className="mb-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Daily Calories</span>
                            <span>{userStats.nutrition.dailyCalories} kcal</span>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Protein */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Protein</span>
                                <span>{userStats.nutrition.proteinConsumed}g / {userStats.nutrition.proteinGoal}g</span>
                            </div>
                            <div className="w-full bg-[#333] rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${(userStats.nutrition.proteinConsumed / userStats.nutrition.proteinGoal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        {/* Carbs */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Carbs</span>
                                <span>{userStats.nutrition.carbsConsumed}g / {userStats.nutrition.carbsGoal}g</span>
                            </div>
                            <div className="w-full bg-[#333] rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${(userStats.nutrition.carbsConsumed / userStats.nutrition.carbsGoal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        {/* Fats */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <span>Fats</span>
                                <span>{userStats.nutrition.fatsConsumed}g / {userStats.nutrition.fatsGoal}g</span>
                            </div>
                            <div className="w-full bg-[#333] rounded-full h-2">
                                <div
                                    className="bg-yellow-500 h-2 rounded-full"
                                    style={{ width: `${(userStats.nutrition.fatsConsumed / userStats.nutrition.fatsGoal) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => router.push("/user/dashboard/nutrition")}
                            className="w-full py-3 mt-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56200] hover:to-[#e57733] text-white rounded-lg transition shadow-lg shadow-orange-500/20 transform hover:translate-y-[-2px] flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                <path d="M7 2v20"></path>
                                <path d="M21 15V2"></path>
                                <path d="M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
                            </svg>
                            Log Nutrition
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent workouts */}
            <div className="bg-[#1a1a1a] rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
                {userStats.recentWorkouts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-[#333]">
                                <tr>
                                    <th className="py-3 text-left">Workout</th>
                                    <th className="py-3 text-left">Date</th>
                                    <th className="py-3 text-left">Duration</th>
                                    <th className="py-3 text-left">Intensity</th>
                                    <th className="py-3 text-left">Calories</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userStats.recentWorkouts.map((workout) => (
                                    <tr key={workout.id} className="border-b border-[#333]">
                                        <td className="py-4">{workout.name}</td>
                                        <td className="py-4 text-gray-400">{workout.date}</td>
                                        <td className="py-4">{workout.duration}</td>
                                        <td className="py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs ${
                                                    workout.intensity === "High"
                                                        ? "bg-red-900/50 text-red-300"
                                                        : workout.intensity === "Medium"
                                                        ? "bg-yellow-900/50 text-yellow-300"
                                                        : "bg-green-900/50 text-green-300"
                                                }`}
                                            >
                                                {workout.intensity}
                                            </span>
                                        </td>
                                        <td className="py-4">{workout.caloriesBurned} kcal</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-[#222] rounded-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-gray-400 mb-4">You haven't logged any workouts yet</p>
                        <button 
                            onClick={() => router.push("/user/dashboard/workout")}
                            className="px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#e56200] hover:to-[#e57733] text-white rounded-lg transition shadow-lg shadow-orange-500/20 transform hover:translate-y-[-2px] inline-flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Start Your First Workout
                        </button>
                    </div>
                )}
                {userStats.recentWorkouts.length > 0 && (
                    <button 
                        onClick={() => router.push("/user/dashboard/progress")}
                        className="w-full md:w-auto px-6 py-3 mt-4 bg-gradient-to-r from-[#222] to-[#333] hover:from-[#2A2A2A] hover:to-[#444] text-white rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                        View All Workouts
                    </button>
                )}
            </div>
        </div>
    );
} 