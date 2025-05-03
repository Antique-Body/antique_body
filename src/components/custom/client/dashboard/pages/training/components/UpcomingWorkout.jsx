import { TimerIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const UpcomingWorkout = ({ tomorrowDay }) => {
  if (!tomorrowDay) return null;
  
  return (
    <Card variant="dark" width="100%" maxWidth="none">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(100,100,100,0.15)]">
            <span className="text-xs font-medium text-gray-400">NEXT</span>
          </div>
          <h3 className="font-medium text-gray-300">Coming Up: {tomorrowDay.name}</h3>
        </div>
        <div className="flex items-center text-gray-400">
          <TimerIcon size={14} className="mr-1" />
          <span className="text-sm">{tomorrowDay.estimatedTime}</span>
        </div>
      </div>
    </Card>
  );
}; 