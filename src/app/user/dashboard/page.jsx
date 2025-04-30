"use client";
import { BrandLogo, Card } from "@components/custom";

import Background from "@/components/background";

export default function UserDashboard() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      <Background />

      <div className="relative z-20 mx-auto flex h-screen max-w-[550px] flex-col items-center px-5 py-5">
        <header className="w-full justify-center pt-10 text-center">
          <BrandLogo />
        </header>

        <div className="flex flex-1 items-center justify-center">
          <Card width="100%">
            <div className="mb-4 text-center text-2xl font-bold sm:text-3xl">Welcome to Your Dashboard</div>
            <div className="text-center text-base text-[#aaa]">Your personalized fitness journey starts here</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
