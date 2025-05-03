"use client";

import { Button } from "@/components/common/Button";
import {
  CheckIcon,
  PlusIcon,
  StrengthIcon,
  TrashIcon
} from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FormField } from "@/components/shared";
import { useState } from "react";
import mockExercises from "../exercises/data/mockExercises";

export const PlanDaysStep = ({ initialData = [], onSubmit, planType }) => {
  const [days, setDays] = useState(initialData.length > 0 ? initialData : [{ 
    name: "Day 1", 
    exercises: [],
    estimatedTime: "",
    note: ""
  }]);

  const addDay = () => {
    setDays([...days, { 
      name: `Day ${days.length + 1}`, 
      exercises: [],
      estimatedTime: "",
      note: ""
    }]);
  };

  const removeDay = (index) => {
    const newDays = [...days];
    newDays.splice(index, 1);
    setDays(newDays);
  };

  const updateDay = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addExercise = (dayIndex) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
    });
    setDays(newDays);
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const updateExercise = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exerciseIndex] = {
      ...newDays[dayIndex].exercises[exerciseIndex],
      [field]: value
    };
    setDays(newDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(days);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">Training Schedule</h2>
      <p className="mb-8 text-gray-400">
        Create your training plan by adding exercises for each day. Set the number of sets, reps, and rest periods for each exercise.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {days.map((day, dayIndex) => (
            <Card 
            width="100%"
            maxWidth="100%"
              key={dayIndex}
              variant="darkStrong" 
              className="relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#FF7800] to-[#FF9A00]"></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <FormField
                    label="Day Name"
                    id={`day-name-${dayIndex}`}
                    name={`day-name-${dayIndex}`}
                    type="text"
                    value={day.name}
                    onChange={(e) => updateDay(dayIndex, "name", e.target.value)}
                    required
                    className="mb-0 flex-1 mr-4"
                    backgroundStyle="darker"
                  />
                  
                  <FormField
                    label="Estimated Time"
                    id={`estimated-time-${dayIndex}`}
                    name={`estimated-time-${dayIndex}`}
                    type="text"
                    value={day.estimatedTime}
                    onChange={(e) => updateDay(dayIndex, "estimatedTime", e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="mb-0 w-40"
                    backgroundStyle="darker"
                  />
                  
                  {days.length > 1 && (
                    <Button 
                      variant="ghost"
                      onClick={() => removeDay(dayIndex)}
                      className="ml-2 self-end mb-4"
                      leftIcon={<TrashIcon size={16} />}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <FormField
                  label="Training Notes"
                  id={`day-note-${dayIndex}`}
                  name={`day-note-${dayIndex}`}
                  type="textarea"
                  value={day.note}
                  onChange={(e) => updateDay(dayIndex, "note", e.target.value)}
                  placeholder="Add any notes for this training day"
                  backgroundStyle="darker"
                  rows={2}
                />
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <StrengthIcon size={20} className="mr-2 text-[#FF6B00]" />
                    Exercises
                  </h3>
                  
                  {day.exercises.length === 0 ? (
                    <div className="text-center py-8 bg-[rgba(20,20,20,0.3)] rounded-lg">
                      <p className="text-gray-400">No exercises added yet</p>
                      <Button
                        variant="orangeOutline"
                        className="mt-4"
                        leftIcon={<PlusIcon size={16} />}
                        onClick={() => addExercise(dayIndex)}
                      >
                        Add First Exercise
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <Card
                          width="100%"
                          maxWidth="100%"
                          key={exerciseIndex}
                          variant="dark"
                          className="relative overflow-hidden"
                        >
                          <div className="flex flex-wrap p-4 gap-x-4 gap-y-4">
                            <FormField
                              label="Exercise"
                              id={`exercise-${dayIndex}-${exerciseIndex}`}
                              name={`exercise-${dayIndex}-${exerciseIndex}`}
                              type="select"
                              value={exercise.exercise}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, "exercise", e.target.value)}
                              options={mockExercises.map(ex => ({
                                value: ex.id.toString(),
                                label: ex.name
                              }))}
                              required
                              className="mb-0 flex-1 min-w-[250px]"
                              backgroundStyle="darker"
                            />
                            
                            <FormField
                              label="Sets"
                              id={`sets-${dayIndex}-${exerciseIndex}`}
                              name={`sets-${dayIndex}-${exerciseIndex}`}
                              type="text"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, "sets", e.target.value)}
                              placeholder="e.g. 3"
                              className="mb-0 w-20"
                              backgroundStyle="darker"
                            />
                            
                            <FormField
                              label="Reps"
                              id={`reps-${dayIndex}-${exerciseIndex}`}
                              name={`reps-${dayIndex}-${exerciseIndex}`}
                              type="text"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, "reps", e.target.value)}
                              placeholder="e.g. 12"
                              className="mb-0 w-20"
                              backgroundStyle="darker"
                            />
                            
                            <FormField
                              label="Weight"
                              id={`weight-${dayIndex}-${exerciseIndex}`}
                              name={`weight-${dayIndex}-${exerciseIndex}`}
                              type="text"
                              value={exercise.weight}
                              onChange={(e) => updateExercise(dayIndex, exerciseIndex, "weight", e.target.value)}
                              placeholder="e.g. 60kg"
                              className="mb-0 w-28"
                              backgroundStyle="darker"
                            />
                            
                            <Button
                              variant="ghost"
                              onClick={() => removeExercise(dayIndex, exerciseIndex)}
                              className="self-end mb-4 text-red-400 hover:text-red-300"
                              leftIcon={<TrashIcon size={16} />}
                            >
                              Remove
                            </Button>
                          </div>
                        </Card>
                      ))}
                      
                      <Button
                        variant="subtle"
                        onClick={() => addExercise(dayIndex)}
                        className="mt-2"
                        leftIcon={<PlusIcon size={16} />}
                      >
                        Add Exercise
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          <div className="flex justify-center">
            <Button
              variant="orangeOutline"
              onClick={addDay}
              className="px-6"
              leftIcon={<PlusIcon size={16} />}
            >
              Add Training Day
            </Button>
          </div>
          
          <div className="pt-6">
            <Button 
              type="submit" 
              variant="orangeFilled" 
              className="w-full py-3"
              leftIcon={<CheckIcon size={16} />}
            >
              Continue to Nutrition Plan
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
