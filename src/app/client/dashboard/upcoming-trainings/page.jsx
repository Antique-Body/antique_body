"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";

export default function ClientUpcomingTrainingsPage() {
  const [expandedTrainingId, setExpandedTrainingId] = useState(null);

  // Add custom animation style
  const animationStyle = `
    @keyframes gradient-x {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
      background-size: 200% 100%;
    }
  `;

  // Enhanced user data
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
        coach: "Alex Miller",
        trainingName: "Strength & Conditioning"
      },
      {
        id: 2,
        date: "Apr 15, 2025",
        time: "14:00 - 15:00",
        type: "In-person",
        location: "Urban Gym Downtown",
        focus: "Upper body strength",
        notes: "Focus on bench press technique",
        coach: "Sarah Johnson",
        trainingName: "Power Building"
      },
      {
        id: 3,
        date: "Apr 18, 2025",
        time: "18:30 - 19:30",
        type: "Virtual",
        location: "Zoom",
        focus: "HIIT workout & nutrition review",
        notes: "Update food diary before session",
        coach: "Michael Chen",
        trainingName: "Metabolic Conditioning"
      },
    ],
    past_trainings: [
      {
        id: 4,
        date: "Apr 8, 2025",
        time: "10:00 - 11:00",
        type: "In-person",
        location: "City Fitness Center",
        focus: "Full body workout",
        feedback: "Good form on squats, need to work on shoulder mobility",
        coach: "Alex Miller",
        trainingName: "Functional Fitness"
      },
      {
        id: 5,
        date: "Apr 5, 2025",
        time: "10:00 - 11:00",
        type: "In-person",
        location: "Urban Gym Downtown",
        focus: "Core stability & conditioning",
        feedback: "Excellent effort on planks, improved endurance",
        coach: "Sarah Johnson",
        trainingName: "Core Blast"
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
      <style dangerouslySetInnerHTML={{ __html: animationStyle }} />
      
      {/* Upcoming Trainings */}
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Upcoming Trainings</h2>

        <div className="space-y-4">
          {userData.upcoming_trainings.map((training, index) => (
            <Card
              key={training.id}
              variant="dark"
              className={`cursor-pointer transition-all duration-300 hover:border-[#FF6B00] ${
                index === 0 ? 'relative overflow-hidden' : ''
              }`}
              width="100%"
              maxWidth="none"
              onClick={() => toggleExpandTraining(training.id)}
            >
              {index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.08)] to-transparent animate-gradient-x pointer-events-none"></div>
              )}
              
              {index === 0 && (
                <div className="absolute left-0 top-0 h-full w-1 bg-[#FF6B00]"></div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold ${index === 0 ? 'text-[#FF6B00]' : ''}`}>{training.date}</h3>
                    <p className="text-gray-400">{training.time}</p>
                    {index === 0 && (
                      <span className="text-xs font-medium text-[#FF6B00] border border-[#FF6B00] rounded px-1.5 py-0.5">Next</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-300">
                    <p>{training.type === "In-person" ? training.location : "Virtual Session"}</p>
                    <span className="mx-2">•</span>
                    <p>Coach: {training.coach}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                    {training.type}
                  </span>
                  <p className="mt-1 text-right text-sm font-medium text-gray-300">{training.trainingName}</p>
                </div>
              </div>

              <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                <div className="mt-2 border-t border-[#444] pt-3">
                  <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                  <p className="mb-3 text-gray-300">{training.focus}</p>

                  <p className="mb-1 font-medium text-[#FF6B00]">Location:</p>
                  <p className="mb-3 text-gray-300">{training.location}</p>

                  <p className="mb-1 font-medium text-[#FF6B00]">Notes:</p>
                  <p className="text-gray-300">{training.notes}</p>

                  <div className="mt-4 flex space-x-3">
                    <Button variant="orangeFilled" className="flex-1">
                      Confirm Attendance
                    </Button>
                    <Button variant="orangeOutline" className="flex-1">
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Past Trainings */}
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Past Trainings</h2>

        <div className="space-y-4">
          {userData.past_trainings.map(training => (
            <Card
              key={training.id}
              variant="dark"
              className="cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
              width="100%"
              maxWidth="none"
              onClick={() => toggleExpandTraining(training.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{training.date}</h3>
                    <p className="text-gray-400">{training.time}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-300">
                    <p>{training.type === "In-person" ? training.location : "Virtual Session"}</p>
                    <span className="mx-2">•</span>
                    <p>Coach: {training.coach}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">
                    {training.type}
                  </span>
                  <p className="mt-1 text-right text-sm font-medium text-gray-300">{training.trainingName}</p>
                </div>
              </div>

              <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                <div className="mt-2 border-t border-[#444] pt-3">
                  <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                  <p className="mb-3 text-gray-300">{training.focus}</p>

                  <p className="mb-1 font-medium text-[#FF6B00]">Coach Feedback:</p>
                  <p className="text-gray-300">{training.feedback}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="orangeOutline" fullWidth className="mt-4">
          View Training History
        </Button>
      </Card>
    </div>
  );
}
