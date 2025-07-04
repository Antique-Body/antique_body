"use client";

import { WorkInProgress } from "@/components/common";

export default function HealthPage() {
  return (
    <div className="px-4 py-5">
      <WorkInProgress
        title="Health"
        subtitle="Your health and wellness"
        description="We're building a comprehensive health and wellness system with personalized recommendations, progress tracking, and AI-powered insights. Your path to health awaits!"
      />
    </div>
  );
}
