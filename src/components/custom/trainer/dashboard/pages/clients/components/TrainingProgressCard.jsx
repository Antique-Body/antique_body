import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";

export const TrainingProgressCard = ({
    clientData,
    allWorkouts,
    scheduledWorkouts,
    onOpenWorkoutModal,
    onViewWorkoutDetail,
}) => (
    <Card variant="darkStrong" width="100%" maxWidth="none">
        <h3 className="mb-4 flex items-center text-xl font-semibold">
            <Icon icon="mdi:dumbbell" width={20} color="#4CAF50" className="mr-2" />
            Training Progress
        </h3>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-[rgba(30,30,30,0.8)] p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-[#FF6B00]">{clientData.training?.completed || 0}</div>
                <div className="text-sm text-gray-400">Completed Workouts</div>
            </div>
            <div className="rounded-lg bg-[rgba(30,30,30,0.8)] p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-[#FF6B00]">
                    {(clientData.training?.remaining || 0) + scheduledWorkouts.filter((w) => w.status === "upcoming").length}
                </div>
                <div className="text-sm text-gray-400">Scheduled/Remaining</div>
            </div>
            <div className="rounded-lg bg-[rgba(30,30,30,0.8)] p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-[#FF6B00]">{clientData.training?.completionRate || 0}%</div>
                <div className="text-sm text-gray-400">Completion Rate</div>
            </div>
            <div className="rounded-lg bg-[rgba(30,30,30,0.8)] p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-[#FF6B00]">{clientData.training?.avgIntensity || 0}</div>
                <div className="text-sm text-gray-400">Avg. Intensity (1-5)</div>
            </div>
        </div>

        <div className="mb-4">
            <h4 className="mb-3 font-medium">Program Progress</h4>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm">Overall Completion</span>
                <span className="text-sm font-medium">{clientData.training?.overallProgress || 0}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#333]">
                <div
                    className="h-full rounded-full bg-[#FF6B00]"
                    style={{ width: `${clientData.training?.overallProgress || 0}%` }}
                ></div>
            </div>
        </div>

        <div className="mb-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium">Workouts</h4>
                <Button
                    variant="outlineOrange"
                    size="sm"
                    leftIcon={<Icon icon="mdi:plus" width={16} />}
                    onClick={onOpenWorkoutModal}
                >
                    Schedule Workout
                </Button>
            </div>
            <div className="space-y-3">
                {allWorkouts.map((workout, index) => (
                    <div key={index} className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)] p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{workout.name}</div>
                                <div className="text-sm text-gray-400">
                                    {workout.status === "upcoming" ? "Scheduled for" : "Completed on"} {workout.date}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                        workout.status === "completed"
                                            ? "bg-green-900/40 text-green-400"
                                            : workout.status === "upcoming"
                                              ? "bg-blue-900/40 text-blue-400"
                                              : "bg-yellow-900/40 text-yellow-400"
                                    }`}
                                >
                                    {workout.status === "completed"
                                        ? "Completed"
                                        : workout.status === "upcoming"
                                          ? "Upcoming"
                                          : "Partial"}
                                </div>
                                <Button variant="outlineLight" size="xs" onClick={() => onViewWorkoutDetail(workout)}>
                                    Details
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <div className="rounded-full bg-[#333] px-2 py-1 text-xs">{workout.stats.exercises}</div>
                            <div className="rounded-full bg-[#333] px-2 py-1 text-xs">Water goal: {workout.stats.water}</div>
                        </div>
                    </div>
                ))}

                <div className="mt-4 flex justify-between">
                    <Button variant="outlineOrange" size="sm">
                        View Activity Calendar
                    </Button>
                    <Button variant="outlineLight" size="sm">
                        View All Workouts
                    </Button>
                </div>
            </div>
        </div>

        <div>
            <h4 className="mb-3 font-medium">Exercise Adherence</h4>
            <div className="overflow-hidden rounded-lg bg-[rgba(30,30,30,0.6)]">
                <div className="grid grid-cols-4 gap-2 border-b border-[#333] bg-[rgba(20,20,20,0.3)] p-2 text-xs font-medium text-gray-300">
                    <div>Exercise Type</div>
                    <div>Completed</div>
                    <div>Skipped</div>
                    <div>Adherence</div>
                </div>

                {clientData.training?.adherence?.map((item, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-4 gap-2 p-2 text-xs ${
                            index < clientData.training.adherence.length - 1 ? "border-b border-[#333]" : ""
                        }`}
                    >
                        <div>{item.type}</div>
                        <div>{item.completed}</div>
                        <div>{item.skipped}</div>
                        <div>{item.rate}%</div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-6 flex justify-end">
            <Button variant="orangeFilled" leftIcon={<Icon icon="mdi:message" width={16} />} className="w-full sm:w-auto">
                Send Training Feedback
            </Button>
        </div>
    </Card>
);
