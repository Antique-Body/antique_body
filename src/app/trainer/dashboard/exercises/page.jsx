"use client";

import { ExercisesList } from "@/components/custom/trainer/dashboard/pages/exercises/components";
import mockExercises from "@/components/custom/trainer/dashboard/pages/exercises/data/mockExercises";
import { useEffect, useState } from "react";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setExercises(mockExercises);
  }, []);

  // Handle updating exercises (create, edit, delete)
  const handleExercisesUpdate = (updatedExercises) => {
    setExercises(updatedExercises);
    
    // In a real app, you would persist these changes to a database
    console.log("Exercises updated:", updatedExercises);
  };

  return (
    <div className="w-full pb-12">
      <div className="mb-6 px-6 py-4">
        <h1 className="mb-2 text-3xl font-bold text-white">Exercise Library</h1>
        <p className="text-gray-400">Create and manage custom exercises for your training plans</p>
      </div>

      <div className="px-6">
        <ExercisesList exercises={exercises} onUpdate={handleExercisesUpdate} />
      </div>
    </div>
  );
};

export default ExercisesPage;
