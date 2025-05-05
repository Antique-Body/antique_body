import { Button } from "@/components/common/Button";
import { EditIcon, PlusIcon, WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const TrainingProgramCard = ({ currentPlan, onOpenPlanModal, onOpenWorkoutModal }) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <h3 className="mb-4 flex items-center text-xl font-semibold">
        <WorkoutIcon size={20} stroke="#FF6B00" className="mr-2" />
        Training Program
      </h3>

      {currentPlan ? (
        <div className="mb-4">
          <div className="mb-2 font-medium">Current Program:</div>
          <div className="mb-4 rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
            <div className="mb-2 text-lg text-[#FF6B00]">
              {currentPlan.title}
            </div>
            <p className="text-sm text-gray-400">
              {currentPlan.summary}
            </p>
            
            {/* Show days preview */}
            <div className="mt-3">
              <div className="mb-1 text-sm font-medium">Training Schedule:</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {currentPlan.days.map((day) => (
                  <div key={day.day} className="rounded border border-[#333] bg-[rgba(20,20,20,0.4)] p-2 text-xs">
                    <div className="font-medium">Day {day.day}</div>
                    <div className="text-gray-400">{day.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outlineOrange" 
              leftIcon={<EditIcon size={16} />} 
              onClick={onOpenPlanModal}
            >
              Modify Training Plan
            </Button>
            <Button 
              variant="orangeFilled" 
              leftIcon={<PlusIcon size={16} />}
              onClick={onOpenWorkoutModal}
            >
              Schedule Workout
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
              <WorkoutIcon size={20} stroke="#FF6B00" />
            </div>
            <div>
              <div className="font-medium">No Program Assigned</div>
              <p className="text-sm text-gray-400">
                Assign a training program to help your client achieve their goals
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.3)] p-4">
            <div className="mb-3 flex items-center">
              <div className="mr-2 rounded-full bg-yellow-600 px-2 py-1 text-xs font-medium">Action Needed</div>
              <span className="text-sm text-gray-400">Create a personalized training experience</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="orangeFilled"
                leftIcon={<PlusIcon size={16} />}
                className="w-full justify-center py-2.5 text-sm font-medium"
                onClick={onOpenPlanModal}
              >
                Assign Training Program
              </Button>
              <Button
                variant="outlineOrange"
                leftIcon={<PlusIcon size={16} />}
                className="w-full justify-center py-2.5 text-sm font-medium"
                onClick={onOpenWorkoutModal}
              >
                Schedule Single Workout
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  ); 