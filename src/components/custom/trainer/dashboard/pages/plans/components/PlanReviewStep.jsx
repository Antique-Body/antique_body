"use client";

import { Button } from "@/components/common/Button";
import { CheckIcon, StrengthIcon, TimerIcon } from "@/components/common/Icons";
import mockExercises from "../exercises/data/mockExercises";

export const PlanReviewStep = ({ planData, onSubmit }) => {
  const findExerciseName = (id) => {
    const exercise = mockExercises.find(ex => ex.id.toString() === id);
    return exercise ? exercise.name : "Unknown Exercise";
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Review Your Training Plan</h2>
      <p className="mb-8 text-gray-400">
        Review all details of your training plan before saving. You can go back to previous steps to make changes if
        needed.
      </p>

      <div className="mb-8 space-y-10">
        {/* Plan Overview Section */}
        <section className="rounded-xl border border-[#333] bg-gradient-to-b from-[rgba(30,30,30,0.4)] to-[rgba(20,20,20,0.4)] p-6">
          <div className="mb-5 flex items-center">
            <span className="mr-2 text-[#FF6B00]">
              <CheckIcon size={24} />
            </span>
            <h3 className="text-xl font-bold text-white">Plan Overview</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Plan Type</h4>
                <p className="text-lg font-medium text-white">{planData.type}</p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Title</h4>
                <p className="text-lg font-medium text-white">{planData.title}</p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Target Athletes</h4>
                <p className="text-lg font-medium text-white">{planData.forAthletes}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Summary</h4>
                <p className="text-lg font-medium text-white">{planData.summary}</p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">Description</h4>
                <div className="rounded-lg bg-[rgba(0,0,0,0.2)] p-4">
                  <p className="text-gray-300">{planData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Schedule Section */}
        <section className="rounded-xl border border-[#333] bg-gradient-to-b from-[rgba(30,30,30,0.4)] to-[rgba(20,20,20,0.4)] p-6">
          <div className="mb-5 flex items-center">
            <span className="mr-2 text-[#FF6B00]">
              <CheckIcon size={24} />
            </span>
            <h3 className="text-xl font-bold text-white">Training Schedule</h3>
          </div>

          <div className="space-y-6">
            {planData.days.map((day, dayIndex) => (
              <div key={dayIndex} className="rounded-lg bg-[rgba(40,40,40,0.3)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                      <span className="font-bold text-[#FF6B00]">{dayIndex + 1}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-white">{day.name}</h4>
                  </div>
                  
                  {day.estimatedTime && (
                    <div className="flex items-center text-gray-300">
                      <TimerIcon size={18} className="mr-2 text-[#FF6B00]" />
                      <span>{day.estimatedTime}</span>
                    </div>
                  )}
                </div>

                {day.note && (
                  <div className="mb-4 rounded-lg bg-[rgba(0,0,0,0.2)] p-3">
                    <p className="text-gray-300">{day.note}</p>
                  </div>
                )}

                <div className="mt-4">
                  <h5 className="mb-3 flex items-center text-md font-semibold text-gray-300">
                    <StrengthIcon size={18} className="mr-2 text-[#FF6B00]" />
                    Exercises
                  </h5>
                  
                  {day.exercises.length > 0 ? (
                    <div className="overflow-hidden rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-[#333] text-left">
                              <th className="bg-[rgba(20,20,20,0.4)] p-3 font-medium text-gray-400">Exercise</th>
                              <th className="bg-[rgba(20,20,20,0.4)] p-3 text-center font-medium text-gray-400">Sets</th>
                              <th className="bg-[rgba(20,20,20,0.4)] p-3 text-center font-medium text-gray-400">Reps</th>
                              <th className="bg-[rgba(20,20,20,0.4)] p-3 text-center font-medium text-gray-400">Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((exercise, exerciseIndex) => (
                              <tr
                                key={exerciseIndex}
                                className={`border-b border-[#333] transition-colors ${
                                  exerciseIndex % 2 === 0 ? "bg-[rgba(30,30,30,0.2)]" : "bg-[rgba(20,20,20,0.2)]"
                                } hover:bg-[rgba(255,107,0,0.05)]`}
                              >
                                <td className="p-3 font-medium text-white">{findExerciseName(exercise.exercise)}</td>
                                <td className="p-3 text-center text-white">{exercise.sets}</td>
                                <td className="p-3 text-center text-white">{exercise.reps}</td>
                                <td className="p-3 text-center text-white">{exercise.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-[rgba(20,20,20,0.3)] p-4 text-center text-gray-400">
                      No exercises added for this day
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nutrition Plan Section */}
        <section className="rounded-xl border border-[#333] bg-gradient-to-b from-[rgba(30,30,30,0.4)] to-[rgba(20,20,20,0.4)] p-6">
          <div className="mb-5 flex items-center">
            <span className="mr-2 text-[#FF6B00]">
              <CheckIcon size={24} />
            </span>
            <h3 className="text-xl font-bold text-white">Nutrition Plan</h3>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] p-5">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Daily Calories</h4>
              <p className="text-2xl font-bold text-[#FF6B00]">{planData.nutrition.dailyCalories}</p>
            </div>

            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] p-5">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Protein</h4>
              <p className="text-2xl font-bold text-[#FF6B00]">{planData.nutrition.macros.protein}</p>
            </div>

            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] p-5">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Carbs</h4>
              <p className="text-2xl font-bold text-[#FF6B00]">{planData.nutrition.macros.carbs}</p>
            </div>

            <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] p-5">
              <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">Fats</h4>
              <p className="text-2xl font-bold text-[#FF6B00]">{planData.nutrition.macros.fats}</p>
            </div>
          </div>

          <div className="rounded-lg bg-[rgba(40,40,40,0.3)] p-5">
            <h4 className="mb-3 text-lg font-semibold text-white">Nutrition Strategy</h4>
            <div className="rounded-lg bg-[rgba(0,0,0,0.2)] p-4">
              <p className="text-gray-300">{planData.nutrition.mealPlan}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10">
        <Button onClick={onSubmit} variant="orangeFilled" className="w-full py-4 text-lg font-semibold">
          Save Training Plan
        </Button>
      </div>
    </div>
  );
};
