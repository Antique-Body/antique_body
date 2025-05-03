import { Button } from "@/components/common/Button";
import { ArrowRight, CheckIcon } from "@/components/common/Icons";

export const WorkoutComplete = ({ 
  isOpen, 
  currentDay, 
  completedExercisesCount, 
  totalExercises, 
  waterIntake, 
  waterGoal, 
  onContinue 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-[#222] to-[#111] p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(76,175,80,0.15)]">
          <CheckIcon size={36} className="text-[#4CAF50]" />
        </div>
        
        <h2 className="mb-2 text-center text-2xl font-bold text-white">Workout Complete!</h2>
        <p className="mb-6 text-center text-gray-300">
          Great job completing your {currentDay.name} workout! Your progress has been saved.
        </p>
        
        <div className="mb-4 rounded-lg bg-[rgba(30,30,30,0.7)] p-4">
          <div className="mb-2 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400">Exercises</p>
              <p className="text-xl font-bold text-[#4CAF50]">{completedExercisesCount}/{totalExercises}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Water Intake</p>
              <p className="text-xl font-bold text-[#03A9F4]">{waterIntake}/{waterGoal} ml</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Time Spent</p>
            <p className="text-xl font-bold text-[#FF6B00]">{currentDay.estimatedTime}</p>
          </div>
        </div>
        
        <Button
          variant="orangeFilled"
          fullWidth
          onClick={onContinue}
          leftIcon={<ArrowRight size={16} />}
          className="py-3"
        >
          Continue to Next Workout
        </Button>
      </div>
    </div>
  );
}; 