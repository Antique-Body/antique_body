import { Button } from "@/components/common/Button";
import { TimerIcon, WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const WorkoutOverview = ({ currentDay, onStartTraining }) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
            <span className="font-bold text-[#FF6B00]">
              {currentDay.isToday ? "TODAY" : currentDay.id}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{currentDay.name}</h2>
        </div>
        <div className="flex items-center text-gray-300">
          <TimerIcon size={16} className="mr-1 text-[#FF6B00]" />
          <span>{currentDay.estimatedTime}</span>
        </div>
      </div>

      {currentDay.note && (
        <div className="mb-4 rounded-lg bg-[rgba(255,107,0,0.07)] p-3 text-sm text-gray-300">
          <p><span className="font-semibold text-[#FF6B00]">Note:</span> {currentDay.note}</p>
        </div>
      )}

      <div className="mb-4 rounded-lg bg-[rgba(20,20,20,0.4)] p-4">
        <h3 className="mb-3 flex items-center text-sm font-semibold text-white">
          <WorkoutIcon size={16} className="mr-2 text-[#FF6B00]" />
          Workout Overview
        </h3>
        
        <ul className="mb-4 space-y-2">
          {currentDay.exercises.map((exercise) => (
            <li key={exercise.id} className="flex items-center justify-between rounded-md bg-[rgba(30,30,30,0.5)] p-2 text-sm">
              <span className="text-white">{exercise.name}</span>
              <span className="text-gray-400">{exercise.sets} sets × {exercise.reps}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex items-center justify-between rounded-md bg-[rgba(30,30,30,0.5)] p-2 text-sm">
          <span className="text-white">Water Intake Goal</span>
          <span className="text-blue-400">{currentDay.waterRecommendation} ml</span>
        </div>
      </div>

      <Button 
        variant="orangeFilled" 
        fullWidth 
        onClick={onStartTraining}
        className="py-4 text-lg"
      >
        Start Today's Workout
      </Button>
    </Card>
  ); 