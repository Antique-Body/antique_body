"use client";

import { Button } from "@/components/common/Button";
import { PlusIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared/FormField";
import { useState } from "react";
import { CreateExerciseCard } from "./CreateExerciseCard";
import { ExerciseCard } from "./ExerciseCard";
import { ExerciseModal } from "./ExerciseModal";

export const ExercisesList = ({ exercises, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Filter exercises based on search and filter criteria
  const filteredExercises = exercises.filter(exercise => {
    // Search term filter
    const matchesSearch = 
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Location filter
    const matchesLocation = filterLocation ? exercise.location === filterLocation : true;
    
    // Type filter
    const matchesType = filterType ? exercise.type === filterType : true;
    
    // Level filter
    const matchesLevel = filterLevel ? exercise.level === filterLevel : true;
    
    // Equipment filter
    const matchesEquipment = 
      filterEquipment === "with" ? exercise.equipment :
      filterEquipment === "without" ? !exercise.equipment : 
      true;
    
    return matchesSearch && matchesLocation && matchesType && matchesLevel && matchesEquipment;
  });

  // Exercise stats
  const totalExercises = exercises.length;
  const gymExercises = exercises.filter(e => e.location === "gym").length;
  const homeExercises = exercises.filter(e => e.location === "home").length;
  const withEquipment = exercises.filter(e => e.equipment).length;
  const withoutEquipment = exercises.filter(e => !e.equipment).length;

  // Open create exercise modal
  const handleCreateClick = () => {
    setSelectedExercise(null);
    setModalMode("create");
    setModalOpen(true);
  };

  // Open view exercise modal
  const handleViewExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("view");
    setModalOpen(true);
  };

  // Open edit exercise modal
  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Delete exercise
  const handleDeleteExercise = (exerciseId) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      const updatedExercises = exercises.filter(ex => ex.id !== exerciseId);
      onUpdate(updatedExercises);
    }
  };

  // Save updated exercise
  const handleSaveExercise = (updatedExercise) => {
    let newExercises;
    
    if (modalMode === "create") {
      newExercises = [...exercises, updatedExercise];
    } else {
      newExercises = exercises.map(ex => 
        ex.id === updatedExercise.id ? updatedExercise : ex
      );
    }
    
    onUpdate(newExercises);
    setModalOpen(false);
  };

  // Preset filter options
  const locationOptions = [
    { value: "", label: "All Locations" },
    { value: "gym", label: "Gym" },
    { value: "home", label: "Home" }
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "strength", label: "Strength" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flexibility" },
    { value: "balance", label: "Balance" }
  ];

  const levelOptions = [
    { value: "", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  const equipmentOptions = [
    { value: "", label: "All Equipment" },
    { value: "with", label: "With Equipment" },
    { value: "without", label: "No Equipment" }
  ];

  return (
    <div className="w-full">
      {/* Stats Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
          <h3 className="mb-1 text-lg font-bold">Total</h3>
          <p className="text-2xl font-semibold text-[#FF6B00]">{totalExercises}</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
          <h3 className="mb-1 text-lg font-bold">Gym</h3>
          <p className="text-2xl font-semibold text-orange-400">{gymExercises}</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
          <h3 className="mb-1 text-lg font-bold">Home</h3>
          <p className="text-2xl font-semibold text-cyan-400">{homeExercises}</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
          <h3 className="mb-1 text-lg font-bold">With Equip.</h3>
          <p className="text-2xl font-semibold text-purple-400">{withEquipment}</p>
        </div>
        <div className="rounded-xl bg-[#1a1a1a] p-4 text-center">
          <h3 className="mb-1 text-lg font-bold">No Equip.</h3>
          <p className="text-2xl font-semibold text-green-400">{withoutEquipment}</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <FormField
              type="text"
              placeholder="Search exercises by name, muscle group..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="mb-0"
            />
          </div>
          <Button 
            variant="orangeFilled" 
            className="!h-fit mt-3"
            onClick={handleCreateClick}
            leftIcon={<PlusIcon size={16} />}
          >
            New Exercise
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <FormField
            type="select"
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value)}
            options={locationOptions}
            className="min-w-[150px] max-w-[200px]"
          />
          <FormField
            type="select"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            options={typeOptions}
            className="min-w-[150px] max-w-[200px]"
          />
          <FormField
            type="select"
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            options={levelOptions}
            className="min-w-[150px] max-w-[200px]"
          />
          <FormField
            type="select"
            value={filterEquipment}
            onChange={e => setFilterEquipment(e.target.value)}
            options={equipmentOptions}
            className="min-w-[150px] max-w-[200px]"
          />
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map(exercise => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            onView={handleViewExercise}
            onEdit={handleEditExercise}
            onDelete={handleDeleteExercise}
          />
        ))}

        <CreateExerciseCard onClick={handleCreateClick} />
      </div>

      {/* Exercise Modal */}
      {modalOpen && (
        <ExerciseModal 
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          mode={modalMode}
          exercise={selectedExercise}
          onSave={handleSaveExercise}
        />
      )}
    </div>
  );
}; 