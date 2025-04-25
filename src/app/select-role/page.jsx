"use client";

import Background from "@/components/background";
import { FullScreenLoader } from "@/components/custom/FullScreenLoader";
import RoleCardCompact from "@/components/custom/RoleCardCompact";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, lazy, Suspense } from "react";
import Background from "@/components/background/Background";
import RoleCardCompact from "@/components/custom/RoleCardCompact";
import { FullScreenLoader } from "@/components/custom/FullScreenLoader";
import Modal from "@/components/custom/Modal";

// Lazy load the Background component to reduce initial bundle size
const LazyBackground = lazy(() => import("@/components/background/Background"));

const ROLE_TITLES = {
  trainer: "Preparing your Trainer Journey",
  client: "Preparing your Client Journey",
  user: "Preparing your User Journey",
  admin: "Preparing your Admin Journey",
};

const ROLE_DESCRIPTIONS = {
  trainer: "a Trainer",
  client: "a Client",
  user: "a User",
  admin: "an Admin",
};

// Simple placeholder for Background while loading
const BackgroundPlaceholder = () => <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#161616]" />;

export default function SelectRole() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [error, setError] = useState(null);

  const handleRoleClick = useCallback((role) => {
    setPendingRole(role);
    setIsModalOpen(true);
    setError(null);
  }, []);

  const handleConfirmRole = useCallback(async () => {
    if (!session?.user?.email || !pendingRole) return;

    setIsModalOpen(false);
    setSelectedRole(pendingRole);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          role: pendingRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      // Update the session to include the new role
      await update({ role: pendingRole });

      // Let the middleware handle the redirect based on the new role
      router.push("/");
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message);
      setLoading(false);
      setSelectedRole(null);
    }
  }, [session?.user?.email, pendingRole, router, update]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingRole(null);
    setError(null);
  }, []);

  // Memoize role cards to prevent unnecessary re-renders
  const roleCards = useMemo(() => (
    <>
      {/* Top row with Trainer and Client */}
      <div className="grid md:grid-cols-2 gap-5">
        <RoleCardCompact
          title="Become a Trainer"
          description="Create your trainer profile, acquire clients, and track their progress. Share your expertise and help others achieve their fitness goals."
          role="trainer"
          onClick={() => handleRoleClick("trainer")}
          loading={loading && selectedRole === "trainer"}
          isSelected={selectedRole === "trainer"}
        />

        <RoleCardCompact
          title="Train with a Coach"
          description="Connect with professional trainers who will guide your fitness journey, providing personalized workouts and nutrition advice."
          role="client"
          onClick={() => handleRoleClick("client")}
          loading={loading && selectedRole === "client"}
          isSelected={selectedRole === "client"}
        />
      </div>

      {/* Bottom row with Solo option */}
      <div className="max-w-md mx-auto w-full">
        <RoleCardCompact
          title="Custom Workout Plan"
          description="Get a personalized workout plan based on your preferences, fitness level, and goals. Train independently with AI-generated exercises."
          role="user"
          onClick={() => handleRoleClick("user")}
          loading={loading && selectedRole === "user"}
          isSelected={selectedRole === "user"}
          special={true}
        />
      </div>
    </>
  ), [handleRoleClick, loading, selectedRole]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white relative">
      <Suspense fallback={<BackgroundPlaceholder />}>
        <LazyBackground
          parthenon={true}
          runner={true}
          discus={true}
          colosseum={true}
          column={false}
          vase={false}
        />
      </Suspense>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-6 spartacus-font text-[#ff7800]">
          Choose Your Path
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Select how you want to experience your fitness journey
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {roleCards}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmRole}
        title="Confirm Your Path"
        message={pendingRole ? `Are you sure you want to continue as ${ROLE_DESCRIPTIONS[pendingRole]}?` : ""}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        confirmButtonColor="bg-[#ff7800] hover:bg-[#e66e00]"
      />

      {/* Full-screen loading overlay when loading */}
      {loading && selectedRole && (
        <FullScreenLoader
          text={ROLE_TITLES[selectedRole] || "Preparing your Journey"}
        />
      )}
    </main>
  );
}