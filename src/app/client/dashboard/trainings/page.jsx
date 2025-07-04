"use client";

import { WorkInProgress } from "@/components/common";

export default function TrainingsPage() {
  return (
    <div className="px-4 py-5">
      <WorkInProgress
        title="Trainings"
        subtitle="Your training sessions"
        description="We're building a comprehensive training system with workout plans, exercise library, progress tracking, and AI-powered recommendations. Your path to strength awaits!"
      />
    </div>
  );
}
