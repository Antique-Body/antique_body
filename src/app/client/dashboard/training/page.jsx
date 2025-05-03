"use client";
import { useEffect, useState } from "react";

// Import the components
import { Modal } from "@/components/common/Modal";
import {
  CompletionAnimation,
  ProgramHeader,
  TrainingSession,
  UpcomingWorkout,
  WorkoutComplete,
  WorkoutOverview
} from "@/components/custom/client/dashboard/pages/training/components";
import mockTrainings from "@/components/custom/client/dashboard/pages/training/data/mockTrainings";
// Add CSS animation for the ping effect
const animationStyles = `
  @keyframes ping-slow {
    0% {
      transform: scale(0.2);
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  .animate-ping-slow {
    animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export default function TrainingPage() {
  // State management
  const [activeDay, setActiveDay] = useState(null);
  const [showStartTraining, setShowStartTraining] = useState(true);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000); // ml
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  

  useEffect(() => {
    // Set the first day as active by default
    if (mockTrainings.days.length > 0 && activeDay === null) {
      // Find today's training if available
      const todayTraining = mockTrainings.days.find(day => day.isToday);
      setActiveDay(todayTraining ? todayTraining.id : mockTrainings.days[0].id);
      
      // Set water goal based on active day
      if (todayTraining) {
        setWaterGoal(todayTraining.waterRecommendation);
      } else {
        setWaterGoal(mockTrainings.days[0].waterRecommendation);
      }
    }
  }, [activeDay]);

  const getCurrentDay = () => {
    return mockTrainings.days.find(day => day.id === activeDay);
  };

  const getTomorrowDay = () => {
    return mockTrainings.days.find(day => day.isTomorrow);
  };

  const handleStartTraining = () => {
    setShowStartTraining(false);
    setIsTrainingActive(true);
  };

  const handleExerciseView = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleExerciseComplete = (exerciseId) => {
    // Mark the exercise as completed
    setCompletedExercises({
      ...completedExercises,
      [exerciseId]: true
    });
    
    // Automatically close the exercise view after marking complete
    setSelectedExercise(null);
    
    // Check if all exercises are completed
    const currentDay = getCurrentDay();
    const updatedCompleted = {
      ...completedExercises,
      [exerciseId]: true
    };
    
    const allCompleted = currentDay.exercises.every(ex => updatedCompleted[ex.id]);
    
    if (allCompleted && waterIntake >= waterGoal * 0.7) {
      // Only show completion modal if water intake is at least 70% of goal and all exercises are done
      setShowCompletionModal(true);
    }
  };

  const handleWaterIntake = (amount) => {
    const newIntake = Math.min(waterIntake + amount, waterGoal);
    setWaterIntake(newIntake);
  };

  const handleCompleteTraining = () => {
    // Check if all exercises are completed
    const currentDay = getCurrentDay();
    const allCompleted = currentDay.exercises.every(ex => completedExercises[ex.id]);
    
    if (!allCompleted) {
      // Show confirmation modal if not all exercises are completed
      setShowConfirmationModal(true);
      return;
    }
    
    // If all exercises are done, proceed with completion
    startCompletionSequence();
  };

  const startCompletionSequence = () => {
    setShowAnimation(true);
    
    // Mark all exercises as completed
    const currentDay = getCurrentDay();
    const newCompleted = { ...completedExercises };
    currentDay.exercises.forEach(ex => {
      newCompleted[ex.id] = true;
    });
    setCompletedExercises(newCompleted);
    
    // Show completion animation for 3 seconds before showing modal
    setTimeout(() => {
      setShowAnimation(false);
      setShowCompletionModal(true);
    }, 3000);
  };
  
  const handleConfirmCompleteAnyway = () => {
    setShowConfirmationModal(false);
    startCompletionSequence();
  };

  const handleSessionComplete = () => {
    // Here you would typically send data to your backend
    // For now, we'll just close the modal and reset states
    setShowCompletionModal(false);
    setIsTrainingActive(false);
    setShowStartTraining(true);
    
    // Find the next day in the program
    const currentDayIndex = mockTrainings.days.findIndex(day => day.id === activeDay);
    if (currentDayIndex < mockTrainings.days.length - 1) {
      setActiveDay(mockTrainings.days[currentDayIndex + 1].id);
    }
    
    // Reset states for new session
    setCompletedExercises({});
    setWaterIntake(0);
    setSelectedExercise(null);
  };

  const resetSession = () => {
    setCompletedExercises({});
    setWaterIntake(0);
    setSelectedExercise(null);
    setShowCompletionModal(false);
    setIsTrainingActive(false);
    setShowStartTraining(true);
  };
  
  const currentDay = getCurrentDay();
  const tomorrowDay = getTomorrowDay();
  const completedExercisesCount = currentDay 
    ? Object.keys(completedExercises).filter(id => completedExercises[id]).length 
    : 0;
  const totalExercises = currentDay ? currentDay.exercises.length : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Add the CSS styles for animation */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Program Header */}
      <ProgramHeader program={mockTrainings} />

      {currentDay && (
        <>
          {/* Today's Workout Overview */}
          {showStartTraining && !isTrainingActive && (
            <WorkoutOverview 
              currentDay={currentDay} 
              onStartTraining={handleStartTraining} 
            />
          )}

          {/* Active Training Session */}
          {isTrainingActive && (
            <TrainingSession 
              currentDay={currentDay}
              completedExercises={completedExercises}
              completedExercisesCount={completedExercisesCount}
              totalExercises={totalExercises}
              waterIntake={waterIntake}
              waterGoal={waterGoal}
              selectedExercise={selectedExercise}
              onExerciseView={handleExerciseView}
              onExerciseComplete={handleExerciseComplete}
              onAddWater={handleWaterIntake}
              onCompleteTraining={handleCompleteTraining}
              onResetSession={resetSession}
              setSelectedExercise={setSelectedExercise}
            />
          )}

          {/* Upcoming Workout Preview (only shown when not in active training) */}
          {!isTrainingActive && (
            <UpcomingWorkout tomorrowDay={tomorrowDay} />
          )}
        </>
      )}

      {/* Confirmation Modal for Incomplete Workout */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        title="Incomplete Workout"
        primaryButtonText="Complete Anyway"
        secondaryButtonText="Continue Training"
        primaryButtonAction={handleConfirmCompleteAnyway}
        secondaryButtonAction={() => setShowConfirmationModal(false)}
      >
        <div className="">
          <p className="mb-3 text-gray-300">
            You haven't completed all exercises for this workout. Are you sure you want to mark it as completed?
          </p>
        </div>
      </Modal>

      {/* Completion Animation */}
      <CompletionAnimation isVisible={showAnimation} />

      {/* Workout Complete Modal */}
      <WorkoutComplete 
        isOpen={showCompletionModal}
        currentDay={currentDay || {}}
        completedExercisesCount={completedExercisesCount}
        totalExercises={totalExercises}
        waterIntake={waterIntake}
        waterGoal={waterGoal}
        onContinue={handleSessionComplete}
      />
    </div>
  );
} 