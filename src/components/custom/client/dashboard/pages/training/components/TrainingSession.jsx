import { Button } from "@/components/common/Button";
import { TimerIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { ExerciseDetail } from "./ExerciseDetail";
import { ExerciseList } from "./ExerciseList";
import { SessionProgress } from "./SessionProgress";
import { WaterTracker } from "./WaterTracker";

export const TrainingSession = ({
  currentDay,
  completedExercises,
  completedExercisesCount,
  totalExercises,
  waterIntake,
  waterGoal,
  selectedExercise,
  onExerciseView,
  onExerciseComplete,
  onAddWater,
  onCompleteTraining,
  onResetSession,
  setSelectedExercise
}) => {
  return (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <h2 className="text-lg font-bold text-white">{currentDay.name}</h2>
        <div className="flex items-center text-gray-300">
          <TimerIcon size={16} className="mr-1 text-[#FF6B00]" />
          <span>{currentDay.estimatedTime}</span>
        </div>
      </div>

      {/* Session Progress */}
      <SessionProgress 
        completedExercisesCount={completedExercisesCount}
        totalExercises={totalExercises}
        waterIntake={waterIntake}
        waterGoal={waterGoal}
      />

      {/* Water Tracker */}
      <WaterTracker 
        waterIntake={waterIntake} 
        waterGoal={waterGoal} 
        onAddWater={onAddWater} 
      />

      {/* Exercises List or Selected Exercise */}
      {selectedExercise ? (
        <ExerciseDetail
          exercise={selectedExercise}
          isCompleted={completedExercises[selectedExercise.id]}
          onMarkComplete={() => onExerciseComplete(selectedExercise.id)}
          onClose={() => setSelectedExercise(null)}
        />
      ) : (
        <>
          <ExerciseList
            exercises={currentDay.exercises}
            completedExercises={completedExercises}
            onViewExercise={onExerciseView}
          />

          <div className="mt-6">
            <Button
              variant="orangeFilled"
              fullWidth
              className="py-3 text-base"
              onClick={onCompleteTraining}
            >
              Complete Workout
            </Button>
            
            <Button 
              variant="subtle" 
              fullWidth 
              onClick={onResetSession}
              className="mt-2"
            >
              Exit Workout
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}; 