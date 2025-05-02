"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";
import { TrashIcon, PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FormField } from "@/components/shared";

export const PlanDaysStep = ({ initialData = [], onSubmit, _planType }) => {
  const [days, setDays] = useState(
    initialData.length > 0
      ? initialData
      : [
          {
            day: 1,
            focus: "",
            exercises: [{ name: "", sets: "", reps: "", rest: "", videoUrl: "" }],
          },
        ],
  );

  const addDay = () => {
    setDays(prev => [
      ...prev,
      {
        day: prev.length + 1,
        focus: "",
        exercises: [{ name: "", sets: "", reps: "", rest: "", videoUrl: "" }],
      },
    ]);
  };

  const removeDay = dayIndex => {
    if (days.length === 1) return;

    setDays(prev => {
      const newDays = prev.filter((_, index) => index !== dayIndex);
      // Update day numbers
      return newDays.map((day, index) => ({
        ...day,
        day: index + 1,
      }));
    });
  };

  const addExercise = dayIndex => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].exercises.push({ name: "", sets: "", reps: "", rest: "", videoUrl: "" });
      return newDays;
    });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    if (days[dayIndex].exercises.length === 1) return;

    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].exercises = newDays[dayIndex].exercises.filter((_, index) => index !== exerciseIndex);
      return newDays;
    });
  };

  const handleDayChange = (dayIndex, field, value) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex][field] = value;
      return newDays;
    });
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    setDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex].exercises[exerciseIndex][field] = value;
      return newDays;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(days);
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Training Schedule</h2>
      <p className="mb-6 text-gray-400">
        Design your training schedule by adding days and exercises. Include detailed instructions and optional video
        links for demonstrations.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 space-y-8">
          {days.map((day, dayIndex) => (
            <Card key={dayIndex} variant="dark" width="100%" maxWidth="100%" className="relative">
              <div className="absolute right-4 top-4">
                <Button
                  type="button"
                  onClick={() => removeDay(dayIndex)}
                  className="p-1 text-gray-400 transition-colors hover:text-red-500"
                  disabled={days.length === 1}
                  variant="ghost"
                  size="small"
                  leftIcon={<TrashIcon size={16} />}
                />
              </div>

              <div className="mb-6">
                <div className="mb-4 flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                    <span className="font-bold text-[#FF6B00]">{day.day}</span>
                  </div>
                  <FormField
                    type="text"
                    value={day.focus}
                    onChange={e => handleDayChange(dayIndex, "focus", e.target.value)}
                    placeholder="Day Focus (e.g., Lower Body, HIIT, Recovery)"
                    className="m-0 flex-1"
                    required
                    backgroundStyle="semi-transparent"
                  />
                </div>

                <div className="space-y-4">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="relative rounded-md border border-[#333] p-4">
                      <div className="absolute right-2 top-2">
                        <Button
                          type="button"
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                          disabled={day.exercises.length === 1}
                          variant="ghost"
                          size="small"
                          leftIcon={<TrashIcon size={14} />}
                        />
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <FormField
                            label="Exercise Name"
                            type="text"
                            value={exercise.name}
                            onChange={e => handleExerciseChange(dayIndex, exerciseIndex, "name", e.target.value)}
                            placeholder="E.g., Bench Press, Squat Jumps"
                            required
                            backgroundStyle="darker"
                            className="mb-0"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <FormField
                            label="Sets"
                            type="text"
                            value={exercise.sets}
                            onChange={e => handleExerciseChange(dayIndex, exerciseIndex, "sets", e.target.value)}
                            placeholder="3-5"
                            required
                            backgroundStyle="darker"
                            className="mb-0"
                          />
                          <FormField
                            label="Reps"
                            type="text"
                            value={exercise.reps}
                            onChange={e => handleExerciseChange(dayIndex, exerciseIndex, "reps", e.target.value)}
                            placeholder="8-12"
                            required
                            backgroundStyle="darker"
                            className="mb-0"
                          />
                          <FormField
                            label="Rest"
                            type="text"
                            value={exercise.rest}
                            onChange={e => handleExerciseChange(dayIndex, exerciseIndex, "rest", e.target.value)}
                            placeholder="60 sec"
                            required
                            backgroundStyle="darker"
                            className="mb-0"
                          />
                        </div>
                      </div>

                      <FormField
                        label="Video URL (Optional)"
                        type="url"
                        value={exercise.videoUrl || ""}
                        onChange={e => handleExerciseChange(dayIndex, exerciseIndex, "videoUrl", e.target.value)}
                        placeholder="https://example.com/video-demonstration"
                        backgroundStyle="darker"
                        subLabel="Add a URL to a video demonstrating the exercise"
                        className="mb-0"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={() => addExercise(dayIndex)}
                  className="mt-4 flex items-center text-sm text-[#FF6B00] transition-colors hover:text-[#FF9A00]"
                  variant="ghostOrange"
                  size="small"
                  leftIcon={<PlusIcon size={14} className="mr-1" />}
                >
                  Add Exercise
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button type="button" variant="subtle" onClick={addDay} className="flex-1" leftIcon={<PlusIcon size={14} />}>
            Add Another Day
          </Button>
          <Button type="submit" variant="orangeFilled" className="flex-1">
            Continue to Nutrition Plan
          </Button>
        </div>
      </form>
    </div>
  );
};
