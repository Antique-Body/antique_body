"use client";
import { useState } from "react";

export default function TrainingsPage() {
    const [expandedTrainingId, setExpandedTrainingId] = useState(null);

    // Sample user data
    const userData = {
        upcoming_trainings: [
            {
                id: 1,
                date: "Apr 12, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                location: "City Fitness Center",
                focus: "Lower body power & mobility",
                notes: "Bring resistance bands",
            },
            {
                id: 2,
                date: "Apr 15, 2025",
                time: "14:00 - 15:00",
                type: "In-person",
                location: "City Fitness Center",
                focus: "Upper body strength",
                notes: "Focus on bench press technique",
            },
            {
                id: 3,
                date: "Apr 18, 2025",
                time: "18:30 - 19:30",
                type: "Virtual",
                location: "Zoom",
                focus: "HIIT workout & nutrition review",
                notes: "Update food diary before session",
            },
        ],
        past_trainings: [
            {
                id: 4,
                date: "Apr 8, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                focus: "Full body workout",
                feedback: "Good form on squats, need to work on shoulder mobility",
            },
            {
                id: 5,
                date: "Apr 5, 2025",
                time: "10:00 - 11:00",
                type: "In-person",
                focus: "Core stability & conditioning",
                feedback: "Excellent effort on planks, improved endurance",
            },
        ],
    };

    const toggleExpandTraining = id => {
        if (expandedTrainingId === id) {
            setExpandedTrainingId(null);
        } else {
            setExpandedTrainingId(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upcoming Trainings */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Upcoming Trainings</h2>

                <div className="space-y-4">
                    {userData.upcoming_trainings.map(training => (
                        <div
                            key={training.id}
                            className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
                            onClick={() => toggleExpandTraining(training.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{training.date}</h3>
                                    <p className="text-gray-400">{training.time}</p>
                                </div>
                                <span className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium">
                                    {training.type}
                                </span>
                            </div>

                            <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                                <div className="border-t border-[#444] pt-3 mt-2">
                                    <p className="font-medium text-[#FF6B00] mb-1">Focus:</p>
                                    <p className="text-gray-300 mb-3">{training.focus}</p>

                                    <p className="font-medium text-[#FF6B00] mb-1">Location:</p>
                                    <p className="text-gray-300 mb-3">{training.location}</p>

                                    <p className="font-medium text-[#FF6B00] mb-1">Notes:</p>
                                    <p className="text-gray-300">{training.notes}</p>

                                    <div className="flex space-x-3 mt-4">
                                        <button className="flex-1 bg-[#FF6B00] text-white py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:bg-[#FF9A00]">
                                            Confirm Attendance
                                        </button>
                                        <button className="flex-1 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Reschedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Past Trainings */}
            <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-6 z-30 backdrop-blur-lg border border-[#222] shadow-lg">
                <h2 className="text-xl font-bold mb-4">Past Trainings</h2>

                <div className="space-y-4">
                    {userData.past_trainings.map(training => (
                        <div
                            key={training.id}
                            className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
                            onClick={() => toggleExpandTraining(training.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{training.date}</h3>
                                    <p className="text-gray-400">{training.time}</p>
                                </div>
                                <span className="bg-[rgba(40,40,40,0.8)] text-gray-300 py-1 px-2 rounded text-xs font-medium">
                                    {training.type}
                                </span>
                            </div>

                            <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                                <div className="border-t border-[#444] pt-3 mt-2">
                                    <p className="font-medium text-[#FF6B00] mb-1">Focus:</p>
                                    <p className="text-gray-300 mb-3">{training.focus}</p>

                                    <p className="font-medium text-[#FF6B00] mb-1">Coach Feedback:</p>
                                    <p className="text-gray-300">{training.feedback}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                    View Training History
                </button>
            </div>
        </div>
    );
}
