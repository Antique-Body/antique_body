"use client";

import { WorkInProgress } from "@/components/common";

export default function UpcomingTrainingsPage() {
  return (
    <div className="px-4 py-5">
      <WorkInProgress
        title="Upcoming Trainings"
        subtitle="Your upcoming training sessions"
        description="We're building a comprehensive training system with workout plans, exercise library, progress tracking, and AI-powered recommendations. Your path to strength awaits!"
      />
    </div>
  );
}
