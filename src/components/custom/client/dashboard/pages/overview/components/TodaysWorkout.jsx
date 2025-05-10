import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/common/Button";
import { WorkoutIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const TodaysWorkout = ({ workout }) => {
    const router = useRouter();

    return (
        <Card variant="dark" className="mt-6" width="100%" maxWidth="none">
            <h2 className="mb-4 flex items-center text-xl font-bold">
                <WorkoutIcon className="mr-2" stroke="#FF6B00" />
                Today's Workout
            </h2>

            {/* Today is Friday, show Friday's workout */}
            <Card variant="dark" width="100%" maxWidth="none">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold">{workout.focus}</h3>
                    <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                        Friday
                    </span>
                </div>

                <div className="space-y-3">
                    {workout.exercises.map((exercise, index) => (
                        <div key={index} className="rounded-lg border border-[#333] bg-[#1a1a1a] p-3">
                            <div className="flex justify-between">
                                <p className="font-medium">{exercise.name}</p>
                                <p className="text-sm text-gray-400">{exercise.weight}</p>
                            </div>
                            <p className="text-sm text-gray-400">
                                {exercise.sets} sets × {exercise.reps}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>

            <Button variant="orangeOutline" fullWidth className="mt-4" onClick={() => router.push("/client/dashboard/program")}>
                View Full Program
            </Button>
        </Card>
    );
};
