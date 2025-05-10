import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/common/Button";
import { TimerIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const NextTraining = ({ training }) => {
    const router = useRouter();

    return (
        <Card variant="dark" width="100%" maxWidth="none">
            <h2 className="mb-4 flex items-center text-xl font-bold">
                <TimerIcon className="mr-2" stroke="#FF6B00" />
                Next Training
            </h2>

            <Card variant="dark" className="mb-4" width="100%" maxWidth="none">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold">{training.date}</h3>
                        <p className="text-gray-400">{training.time}</p>
                    </div>
                    <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                        {training.type}
                    </span>
                </div>
                <p className="mt-2 text-gray-300">{training.focus}</p>
                <p className="mt-1 text-sm text-gray-400">
                    <span className="mr-1 text-[#FF6B00]">📍</span>
                    {training.location}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    <span className="mr-1 text-[#FF6B00]">📝</span>
                    {training.notes}
                </p>
            </Card>

            <Button variant="orangeOutline" fullWidth onClick={() => router.push("/client/dashboard/upcoming-trainings")}>
                View All Trainings
            </Button>
        </Card>
    );
};
