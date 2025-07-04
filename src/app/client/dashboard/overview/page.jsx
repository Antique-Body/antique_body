"use client";

import { WorkInProgress } from "@/components/common";

export default function OverviewPage() {
  return (
    <div className="px-4 py-5">
      <WorkInProgress
        title="Overview Dashboard"
        subtitle="We're crafting your personalized overview experience"
        description="Your comprehensive dashboard with progress tracking, recent activities, and personalized insights is being carefully built. Soon you'll have a complete view of your fitness journey!"
      />
    </div>
  );
}
