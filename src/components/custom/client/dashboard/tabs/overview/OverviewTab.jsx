export const OverviewTab = ({ userData }) => {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Next Session */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF6B00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Next Training
                    </h2>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{userData.upcoming_trainings[0].date}</h3>
                                <p className="text-gray-400">{userData.upcoming_trainings[0].time}</p>
                            </div>
                            <span className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                {userData.upcoming_trainings[0].type}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-300">{userData.upcoming_trainings[0].focus}</p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="text-[#FF6B00] mr-1">📍</span>
                            {userData.upcoming_trainings[0].location}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                            <span className="text-[#FF6B00] mr-1">📝</span>
                            {userData.upcoming_trainings[0].notes}
                        </p>
                    </div>

                    <button className="w-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                        View All Trainings
                    </button>
                </div>

                {/* Messages Preview */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF6B00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        Coach Messages
                    </h2>

                    <div className="space-y-3">
                        {userData.messages.slice(0, 2).map((message) => (
                            <div
                                key={message.id}
                                className={`bg-[rgba(30,30,30,0.8)] p-3 rounded-xl border ${
                                    message.unread && message.from === "Coach Alex" ? "border-[#FF6B00]" : "border-[#333]"
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-bold">{message.from}</p>
                                    <p className="text-xs text-gray-400">{message.time}</p>
                                </div>
                                <p className="text-sm text-gray-300">{message.content}</p>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-4 bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00] flex items-center justify-center gap-2">
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
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Send Message
                    </button>
                </div>

                {/* Nutrition Summary */}
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF6B00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2"
                        >
                            <path d="M3 3h18v18H3V3z"></path>
                            <path d="M9 3v18"></path>
                            <path d="M15 3v18"></path>
                            <path d="M3 9h18"></path>
                            <path d="M3 15h18"></path>
                        </svg>
                        Nutrition Overview
                    </h2>

                    <div className="space-y-3">
                        <div className="bg-[rgba(30,30,30,0.8)] p-3 rounded-xl border border-[#333]">
                            <p className="text-sm font-medium text-gray-400 mb-1">Daily Target</p>
                            <p className="font-bold text-xl mb-2">{userData.stats.calorieGoal} cal</p>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Protein</p>
                                    <p className="font-bold text-sm">{userData.stats.proteinGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Carbs</p>
                                    <p className="font-bold text-sm">{userData.stats.carbsGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: "60%" }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Fat</p>
                                    <p className="font-bold text-sm">{userData.stats.fatGoal}g</p>
                                    <div className="h-1 bg-[#333] rounded-full mt-1">
                                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                        Open Nutrition Tracker
                    </button>
                </div>
            </div>

            {/* Progress Graph */}
            <div className="mt-6 bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Body Composition Progress
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Weight Progression</h3>
                        <div className="h-52 relative">
                            {/* Simple weight chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-6 bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] rounded-t-sm transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${((entry.weight - 70) / 10) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.weight} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                        <h3 className="font-medium mb-3">Body Fat Progression</h3>
                        <div className="h-52 relative">
                            {/* Simple body fat chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full h-full flex items-end justify-center">
                                            <div
                                                className="w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm transition-all duration-500 hover:w-8"
                                                style={{
                                                    height: `${(entry.bodyFat / 25) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-2 text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.bodyFat}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-4 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                    View Detailed Progress
                </button>
            </div>

            {/* Today's Workout */}
            <div className="mt-6 bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6B00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                        <line x1="6" y1="1" x2="6" y2="4"></line>
                        <line x1="10" y1="1" x2="10" y2="4"></line>
                        <line x1="14" y1="1" x2="14" y2="4"></line>
                    </svg>
                    Today's Workout
                </h2>

                {/* Today is Friday, show Friday's workout */}
                <div className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold">{userData.workout_plan.friday.focus}</h3>
                        <span className="bg-[rgba(255,107,0,0.15)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                            Friday
                        </span>
                    </div>

                    <div className="space-y-3">
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

                <button className="w-full mt-4 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                    View Full Program
                </button>
            </div>
        </div>
    );
};
