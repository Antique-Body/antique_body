import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";
import { Icon } from "@iconify/react";

export const WorkoutOverview = ({ currentDay, onStartTraining }) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          {currentDay.isToday ? (
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D4D] shadow-lg shadow-orange-900/30">
              <span className="font-bold text-white text-xs">TODAY</span>
            </div>
          ) : (
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] border border-[#FF6B00]/20">
              <span className="font-bold text-[#FF6B00]">{currentDay.id}</span>
            </div>
          )}
          <h2 className="text-xl font-bold text-white">{currentDay.name}</h2>
        </div>
        <div className="flex items-center text-gray-300 bg-[rgba(255,255,255,0.05)] px-3 py-1.5 rounded-full">
          <Icon icon="mdi:clock-time-four-outline" className="mr-2 text-[#FF6B00]" />
          <span>{currentDay.estimatedTime}</span>
        </div>
      </div>

      {currentDay.note && (
        <div className="mb-4 rounded-lg bg-[rgba(255,107,0,0.07)] p-3.5 text-sm text-gray-300 border border-[#FF6B00]/10">
          <p><span className="font-semibold text-[#FF6B00]">Note:</span> {currentDay.note}</p>
        </div>
      )}

      <div className="mb-5 rounded-lg bg-[rgba(20,20,20,0.4)] p-5 border border-gray-800/40">
        <h3 className="mb-4 flex items-center text-sm font-semibold text-white">
          <Icon icon="mdi:dumbbell" className="mr-2 text-[#FF6B00] text-lg" />
          Workout Overview
        </h3>
        
        <ul className="mb-5 space-y-2.5">
          {currentDay.exercises.map((exercise) => (
            <li key={exercise.id} className="flex items-center justify-between rounded-md bg-[rgba(30,30,30,0.5)] p-3 text-sm hover:bg-[rgba(40,40,40,0.5)] transition-colors">
              <span className="text-white font-medium">{exercise.name}</span>
              <span className="text-gray-400 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">{exercise.sets} sets × {exercise.reps}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex items-center justify-between rounded-md bg-[rgba(30,30,30,0.5)] p-3 text-sm border-l-2 border-blue-400">
          <div className="flex items-center">
            <Icon icon="mdi:water" className="mr-2 text-blue-400" />
            <span className="text-white">Water Intake Goal</span>
          </div>
          <span className="text-blue-400 font-medium">{currentDay.waterRecommendation} ml</span>
        </div>
      </div>

      <Button 
        variant="orangeFilled" 
        fullWidth 
        onClick={onStartTraining}
        className="py-4 text-lg flex items-center justify-center"
      >
        <Icon icon="mdi:run-fast" className="mr-2" />
        Start Today's Workout
      </Button>
    </Card>
  ); 