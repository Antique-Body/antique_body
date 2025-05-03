import { Button } from "@/components/common/Button";

export const WaterTracker = ({ waterIntake, waterGoal, onAddWater }) => {
  return (
    <div className="mb-6 rounded-lg border border-[#333] bg-[rgba(20,20,20,0.3)] p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center text-sm font-semibold text-white">
          <svg className="mr-2 h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a.75.75 0 0 1 .67.41l5.1 10.5a6.44 6.44 0 0 1-11.54 0l5.1-10.5A.75.75 0 0 1 10 2Z"></path>
          </svg>
          Water Tracker
        </h3>
        <span className="text-sm font-medium text-blue-400">
          {waterIntake}/{waterGoal} ml
        </span>
      </div>
      
      <div className="mt-3 flex w-full space-x-2">
        <Button 
          variant="blueOutline" 
          onClick={() => onAddWater(250)}
          className="flex-1"
        >
          +250ml
        </Button>
        <Button 
          variant="blueOutline" 
          onClick={() => onAddWater(500)}
          className="flex-1"
        >
          +500ml
        </Button>
        <Button 
          variant="blueOutline" 
          onClick={() => onAddWater(1000)}
          className="flex-1"
        >
          +1000ml
        </Button>
      </div>
    </div>
  );
}; 