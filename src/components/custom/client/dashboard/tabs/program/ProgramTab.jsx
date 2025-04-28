import React from "react";

export const ProgramTab = ({ userData }) => {
    return (
        <div className="space-y-6">
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Your Training Program</h2>
                    <span className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-3 rounded-lg text-sm font-medium">
                        {userData.planName}
                    </span>
                </div>

                <div className="flex flex-wrap text-sm mb-4">
                    <div className="mr-4 mb-2">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="ml-1 text-white">{userData.planStart}</span>
                    </div>
                    <div className="mr-4 mb-2">
                        <span className="text-gray-400">End Date:</span>
                        <span className="ml-1 text-white">{userData.planEnd}</span>
                    </div>
                    <div className="mr-4 mb-2">
                        <span className="text-gray-400">Coach:</span>
                        <span className="ml-1 text-white">{userData.coach}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Program Progress</span>
                        <span>{Math.round((userData.progress.completed / userData.progress.total) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full"
                            style={{
                                width: `${(userData.progress.completed / userData.progress.total) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Next milestone: {userData.progress.nextMilestone}</p>
                </div>

                {/* Monday Workout */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">{userData.workout_plan.monday.focus}</h3>
                        <span className="bg-[rgba(40,40,40,0.8)] text-gray-300 py-1 px-2 rounded text-xs font-medium">
                            Monday
                        </span>
                    </div>

                    <div className="space-y-2">
                        {userData.workout_plan.monday.exercises.map((exercise, index) => (
                            <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                                <div className="flex justify-between">
                                    <p className="font-medium">{exercise.name}</p>
                                    <p className="text-sm text-gray-400">{exercise.weight}</p>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {exercise.sets} sets × {exercise.reps}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wednesday Workout */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">{userData.workout_plan.wednesday.focus}</h3>
                        <span className="bg-[rgba(40,40,40,0.8)] text-gray-300 py-1 px-2 rounded text-xs font-medium">
                            Wednesday
                        </span>
                    </div>

                    <div className="space-y-2">
                        {userData.workout_plan.wednesday.exercises.map((exercise, index) => (
                            <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                                <div className="flex justify-between">
                                    <p className="font-medium">{exercise.name}</p>
                                    <p className="text-sm text-gray-400">{exercise.weight}</p>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {exercise.sets} sets × {exercise.reps}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Friday Workout */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">{userData.workout_plan.friday.focus}</h3>
                        <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                            Friday (Today)
                        </span>
                    </div>

                    <div className="space-y-2">
                        {userData.workout_plan.friday.exercises.map((exercise, index) => (
                            <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg border border-[#333]">
                                <div className="flex justify-between">
                                    <p className="font-medium">{exercise.name}</p>
                                    <p className="text-sm text-gray-400">{exercise.weight}</p>
                                </div>
                                <p className="text-sm text-gray-400">
                                    {exercise.sets} sets × {exercise.reps}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
