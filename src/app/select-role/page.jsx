"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Background from "@/components/background";
import RoleCardCompact from "@/components/custom/RoleCardCompact";
import { FullScreenLoader } from "@/components/custom/FullScreenLoader";

export default function SelectRole() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelection = async (role) => {
    if (!session?.user?.email) return;

    setSelectedRole(role);
    setLoading(true);
    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          role: role,
        }),
      });

      if (response.ok) {
        const routeMap = {
          TRAINER: "/trainer-dashboard",
          CLIENT: "/user-dashboard",
          SOLO: "/workout-plan",
        };
        router.push(routeMap[role] || "/");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  // Journey text mapping to make it more thematic
  const journeyText = {
    TRAINER: "Preparing your Trainer Journey",
    CLIENT: "Preparing your Training Journey",
    SOLO: "Preparing your Workout Journey",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white relative">
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6 spartacus-font text-[#ff7800]">
          Choose Your Path
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Select how you want to experience your fitness journey
        </p>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {/* Top row with Trainer and Client */}
          <div className="grid md:grid-cols-2 gap-5">
            <RoleCardCompact
              title="Become a Trainer"
              description="Create your trainer profile, acquire clients, and track their progress. Share your expertise and help others achieve their fitness goals."
              role="TRAINER"
              onClick={() => handleRoleSelection("TRAINER")}
              loading={loading && selectedRole === "TRAINER"}
              isSelected={selectedRole === "TRAINER"}
            />

            <RoleCardCompact
              title="Train with a Coach"
              description="Connect with professional trainers who will guide your fitness journey, providing personalized workouts and nutrition advice."
              role="CLIENT"
              onClick={() => handleRoleSelection("CLIENT")}
              loading={loading && selectedRole === "CLIENT"}
              isSelected={selectedRole === "CLIENT"}
            />
          </div>

          {/* Bottom row with Solo option */}
          <div className="max-w-md mx-auto w-full">
            <RoleCardCompact
              title="Custom Workout Plan"
              description="Get a personalized workout plan based on your preferences, fitness level, and goals. Train independently with AI-generated exercises."
              role="SOLO"
              onClick={() => handleRoleSelection("SOLO")}
              loading={loading && selectedRole === "SOLO"}
              isSelected={selectedRole === "SOLO"}
              special={true}
            />
          </div>
        </div>
      </div>

      {/* Full-screen loading overlay when loading */}
      {loading && selectedRole && (
        <FullScreenLoader
          text={journeyText[selectedRole] || "Preparing your Journey"}
        />
      )}
    </main>
  );
}
