"use client";
import { Button } from "@/components/common/Button";
import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export default function ProgramPage() {
  // Sample user data
  const userData = {
    name: "Jamie Smith",
    coach: "Alex Miller",
    planName: "Strength Building",
    planStart: "Mar 15, 2025",
    planEnd: "Jun 15, 2025",
    progress: {
      completed: 12,
      total: 36,
      nextMilestone: "Deadlift 100kg",
    },
    workout_plan: {
      monday: {
        focus: "Lower Body",
        exercises: [
          { name: "Squats", sets: 4, reps: "8-10", weight: "60kg" },
          { name: "Deadlifts", sets: 3, reps: "6-8", weight: "80kg" },
          { name: "Leg Press", sets: 3, reps: "10-12", weight: "120kg" },
          { name: "Walking Lunges", sets: 3, reps: "12 each leg", weight: "10kg dumbbells" },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: "Body weight" },
        ],
      },
      wednesday: {
        focus: "Upper Body",
        exercises: [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: "55kg" },
          { name: "Pull-ups", sets: 3, reps: "6-8", weight: "Body weight" },
          { name: "Shoulder Press", sets: 3, reps: "8-10", weight: "35kg" },
          { name: "Bent-over Rows", sets: 3, reps: "10-12", weight: "40kg" },
          { name: "Tricep Dips", sets: 3, reps: "10-12", weight: "Body weight" },
        ],
      },
      friday: {
        focus: "Full Body & HIIT",
        exercises: [
          { name: "Clean and Press", sets: 4, reps: "6-8", weight: "40kg" },
          { name: "KB Swings", sets: 3, reps: "15", weight: "20kg" },
          { name: "Box Jumps", sets: 3, reps: "10", weight: "Body weight" },
          { name: "Battle Ropes", sets: 4, reps: "30 seconds", weight: "N/A" },
          { name: "Burpees", sets: 3, reps: "15", weight: "Body weight" },
        ],
      },
    },
  };

  return (
    <div className="space-y-6">
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Training Program</h2>
          <span className="rounded-lg border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-3 py-1 text-sm font-medium text-[#FF6B00]">
            {userData.planName}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap text-sm">
          <div className="mb-2 mr-4">
            <span className="text-gray-400">Start Date:</span>
            <span className="ml-1 text-white">{userData.planStart}</span>
          </div>
          <div className="mb-2 mr-4">
            <span className="text-gray-400">End Date:</span>
            <span className="ml-1 text-white">{userData.planEnd}</span>
          </div>
          <div className="mb-2 mr-4">
            <span className="text-gray-400">Coach:</span>
            <span className="ml-1 text-white">{userData.coach}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-1 flex justify-between text-sm">
            <span>Program Progress</span>
            <span>{Math.round((userData.progress.completed / userData.progress.total) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#333]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
              style={{
                width: `${(userData.progress.completed / userData.progress.total) * 100}%`,
              }}
            ></div>
          </div>
          <p className="mt-1 text-xs text-gray-400">Next milestone: {userData.progress.nextMilestone}</p>
        </div>

        {/* Monday Workout */}
        <Card variant="dark" className="mb-4" width="100%" maxWidth="none">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">{userData.workout_plan.monday.focus}</h3>
            <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">Monday</span>
          </div>

          <div className="space-y-2">
            {userData.workout_plan.monday.exercises.map((exercise, index) => (
              <div key={index} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
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
        </Card>

        {/* Wednesday Workout */}
        <Card variant="dark" className="mb-4" width="100%" maxWidth="none">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">{userData.workout_plan.wednesday.focus}</h3>
            <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">
              Wednesday
            </span>
          </div>

          <div className="space-y-2">
            {userData.workout_plan.wednesday.exercises.map((exercise, index) => (
              <div key={index} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
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
        </Card>

        {/* Friday Workout */}
        <Card variant="dark" width="100%" maxWidth="none">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold">{userData.workout_plan.friday.focus}</h3>
            <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
              Friday (Today)
            </span>
          </div>

          <div className="space-y-2">
            {userData.workout_plan.friday.exercises.map((exercise, index) => (
              <div key={index} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
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
        </Card>

        <div className="mt-6">
          <Button variant="orangeFilled" fullWidth leftIcon={<PlusIcon />}>
            Add Workout Session
          </Button>
        </div>
      </Card>
    </div>
  );
}
