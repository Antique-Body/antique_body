"use client";

import { WorkInProgress } from "@/components/common";

export default function ClientsPage() {
  return (
    <div className="px-4 py-5">
      <WorkInProgress
        title="Clients"
        subtitle="Your clients"
        description="We're building a comprehensive client management system with client profiles, progress tracking, and AI-powered recommendations. Your path to success awaits!"
      />
    </div>
  );
}
