"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";

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
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Upcoming Trainings</h2>

        <div className="space-y-4">
          {userData.upcoming_trainings.map(training => (
            <Card
              key={training.id}
              variant="dark"
              className="cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
              width="100%"
              maxWidth="none"
              onClick={() => toggleExpandTraining(training.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{training.date}</h3>
                  <p className="text-gray-400">{training.time}</p>
                </div>
                <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                  {training.type}
                </span>
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
                <div>
                  <h3 className="text-lg font-bold">{training.date}</h3>
                  <p className="text-gray-400">{training.time}</p>
                </div>
                <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">
                  {training.type}
                </span>
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

        <Button variant="orangeOutline" fullWidth>
          View Training History
        </Button>
      </Card>
    </div>
  );
}
