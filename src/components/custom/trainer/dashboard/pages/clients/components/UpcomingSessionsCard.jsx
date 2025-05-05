import { Button } from "@/components/common/Button";
import { ClockIcon, PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const UpcomingSessionsCard = ({ scheduledWorkouts, clientData, onOpenWorkoutModal }) => {
  const upcomingWorkouts = scheduledWorkouts.filter(w => w.status === "upcoming")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <Card variant="darkStrong" hover={true} width="100%" maxWidth="none">
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <ClockIcon size={20} stroke="#FF6B00" className="mr-2" />
        Upcoming Sessions
      </h3>

      {upcomingWorkouts.length > 0 ? (
        <div className="space-y-3">
          {upcomingWorkouts.map((workout, index) => (
            <div key={index} className="rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{workout.date}</div>
                  <div className="text-sm text-gray-400">{workout.name}</div>
                </div>
                <div className="rounded bg-[rgba(255,107,0,0.2)] px-2 py-1 text-xs text-[#FF6B00]">Upcoming</div>
              </div>
            </div>
          ))}
          <Button 
            variant="orangeFilled" 
            className="w-full" 
            leftIcon={<PlusIcon size={16} />}
            onClick={onOpenWorkoutModal}
          >
            Schedule New Session
          </Button>
        </div>
      ) : (
        <div>
          <div className="mb-4 rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{clientData.nextSession || "No upcoming sessions"}</div>
                <div className="text-sm text-gray-400">Regular Training</div>
              </div>
              <div className="rounded bg-[rgba(255,107,0,0.2)] px-2 py-1 text-xs text-[#FF6B00]">Upcoming</div>
            </div>
          </div>

          <Button 
            variant="orangeFilled" 
            className="w-full" 
            leftIcon={<PlusIcon size={16} />}
            onClick={onOpenWorkoutModal}
          >
            Schedule New Session
          </Button>
        </div>
      )}
    </Card>
  );
}; 