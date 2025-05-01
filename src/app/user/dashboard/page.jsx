"use client";
import Background from "@/components/background";
import { BrandLogo, Card } from "@components/custom";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
      <Background />

      <div className="max-w-[550px] mx-auto px-5 py-5 relative z-20 h-screen flex flex-col items-center">
        <header className="pt-10 w-full text-center justify-center">
          <BrandLogo />
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card width="100%">
            <div className="text-2xl sm:text-3xl font-bold mb-4 text-center">
              Welcome to Your Dashboard
            </div>
            <div className="text-[#aaa] text-base text-center">
              Your personalized fitness journey starts here
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
