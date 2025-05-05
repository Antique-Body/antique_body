"use client";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import Image from "next/image";
import { useState } from "react";
import { ExerciseForm } from "./ExerciseForm";

export const ExerciseModal = ({ isOpen, onClose, mode = "view", exercise = null, onSave }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  
  if (!isOpen) return null;

  // Switch to edit mode from view mode
  const handleEditClick = () => {
    setCurrentMode("edit");
  };

  // Handle form submission
  const handleSave = (updatedExercise) => {
    onSave(updatedExercise);
    onClose();
  };

  // Handle modal close
  const handleClose = () => {
    setCurrentMode(mode); // Reset to initial mode
    onClose();
  };

  // View mode content
  const ViewModeContent = () => (
    <div className="w-full">
      {/* Exercise Image */}
      <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg relative">
        <Image 
          src={exercise.imageUrl || "/images/placeholder-exercise.jpg"} 
          alt={exercise.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
          className="object-cover"
        />
      </div>

      {/* Exercise Details */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Details</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium text-white">Location:</span> {exercise.location === 'gym' ? 'Gym' : 'Home'}</p>
            <p><span className="font-medium text-white">Equipment:</span> {exercise.equipment ? 'Required' : 'Not required'}</p>
            <p><span className="font-medium text-white">Type:</span> {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}</p>
            <p><span className="font-medium text-white">Level:</span> {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Target Muscles</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.muscleGroups.map((muscle, index) => (
              <div key={index} className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-1 text-sm text-[#FF6B00]">
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description & Instructions */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Description</h3>
        <p className="text-gray-300">{exercise.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Instructions</h3>
        <p className="text-gray-300">{exercise.instructions}</p>
      </div>

      {/* Video demo if available */}
      {exercise.video && (
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold">Video Demonstration</h3>
         <div className="aspect-video w-full overflow-hidden rounded-lg">
  {exercise.video.includes("youtube.com") || exercise.video.includes("youtu.be") ? (
    <iframe
      src={exercise.video.replace("watch?v=", "embed/")}
      className="h-full w-full"
      allowFullScreen
    />
  ) : (
    <video src={exercise.video} controls className="h-full w-full" />
  )}
</div>

        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-end">
        <Button
          variant="orangeFilled"
          onClick={handleEditClick}
        >
          Edit Exercise
        </Button>
      </div>
    </div>
  );

  if (currentMode === "view") {
    return (
      <Modal 
        isOpen={isOpen}
        onClose={handleClose}
        title={exercise.name}
        size="large"
        footerButtons={false}
      >
        <ViewModeContent />
      </Modal>
    );
  } 
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Add New Exercise" : "Edit Exercise"}
      size="large"
      footerButtons={false}
    >
      <ExerciseForm 
        exercise={exercise} 
        onSave={handleSave} 
        onCancel={handleClose} 
      />
    </Modal>
  );
}; 