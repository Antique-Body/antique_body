import { Button } from "@/components/common/Button";
import { ArrowRight, CalendarIcon, CheckIcon } from "@/components/common/Icons";
import { useEffect, useState } from "react";

export const WorkoutComplete = ({ 
  isOpen, 
  currentDay, 
  completedExercisesCount, 
  totalExercises, 
  waterIntake, 
  waterGoal, 
  onContinue 
}) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  // Generate a random next workout date (2-3 days from today)
  const getNextWorkoutDate = () => {
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 2) + 2; // Random number between 2-3
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return nextDate.toLocaleDateString('en-US', options);
  };
  
  const nextWorkoutDate = getNextWorkoutDate();
  
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger entrance animation
      const timer = setTimeout(() => setAnimateIn(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" 
         style={{ backdropFilter: 'blur(8px)' }}>
      <div 
        className={`w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-b from-[#1A1A1A] to-[#111] p-0 shadow-2xl transition-all duration-500 ${animateIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}
      >
        {/* Confetti top border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6B00] via-[#FFC107] to-[#FF6B00] animate-gradient"></div>
        
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[rgba(255,107,0,0.2)] to-[rgba(255,154,0,0.1)]">
            <CheckIcon size={36} className="text-[#FF6B00]" />
          </div>
          
          <h2 className="mb-1 text-center text-2xl font-bold text-white">Congratulations!</h2>
          <p className="mb-6 text-center text-gray-300">
            You've completed your {currentDay.name || "daily"} workout! Your progress has been tracked.
          </p>
          
          <div className="mb-5 rounded-lg bg-[rgba(20,20,20,0.7)] p-4">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[rgba(30,30,30,0.5)] p-3 text-center">
                <p className="text-xs text-gray-400">Exercises</p>
                <p className="text-xl font-bold text-[#FF6B00]">{completedExercisesCount}/{totalExercises}</p>
              </div>
              <div className="rounded-lg bg-[rgba(30,30,30,0.5)] p-3 text-center">
                <p className="text-xs text-gray-400">Water Intake</p>
                <p className="text-xl font-bold text-[#03A9F4]">{Math.round((waterIntake/waterGoal) * 100)}%</p>
              </div>
            </div>
            <div className="rounded-lg bg-[rgba(30,30,30,0.5)] p-3 text-center">
              <p className="text-xs text-gray-400">Time Spent</p>
              <p className="text-xl font-bold text-white">{currentDay.estimatedTime || "30 min"}</p>
            </div>
          </div>
          
          {/* Next workout info */}
          <div className="mb-6 flex items-center rounded-lg border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.05)] p-4">
            <CalendarIcon size={24} className="mr-3 text-[#FF6B00]" />
            <div>
              <p className="text-sm font-semibold text-white">Next Training Session</p>
              <p className="text-xs text-gray-300">{nextWorkoutDate} - See you then!</p>
            </div>
          </div>
          
          <Button
            variant="orangeFilled"
            fullWidth
            onClick={onContinue}
            className="py-3.5"
          >
            Continue
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 