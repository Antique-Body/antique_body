"use client";

import { FullScreenLoader } from "@/components/custom/FullScreenLoader";
import RoleCardCompact from "@/components/custom/RoleCardCompact";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";

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
const BackgroundPlaceholder = () => (
  <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#161616]" />
);

export default function SelectRole() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      setLoading(false);
      setSelectedRole(null);
    };
  }, []);

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
      // Koristimo PATCH metodu umesto POST jer vaš API koristi PATCH
      const response = await fetch("/api/users/update-role", {
        method: "PATCH", // Promenjena metoda iz POST u PATCH
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          role: pendingRole,
        }),
      });

      // Proveravamo prvo da li je odgovor OK pre nego što pozovemo response.json()
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to update role: ${response.status}`
        );
      }

      // Sada bezbedno pozivamo json() nakon što smo proverili status
      const data = await response.json();

      await update({
        role: pendingRole,
        hasCompletedTrainingSetup: pendingRole !== "user",
      });

      const redirectPath = ROLE_REDIRECTS[pendingRole];
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message || "Unknown error occurred");
      setLoading(false);
      setSelectedRole(null);
    }
  }, [session?.user?.email, pendingRole, router, update]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingRole(null);
    setError(null);
  }, []);

  const roleCards = useMemo(
    () => (
      <>
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
    ),
    [handleRoleClick, loading, selectedRole]
  );

  return (
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

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">{roleCards}</div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmRole}
        title="Confirm Your Path"
        message={
          pendingRole
            ? `Are you sure you want to continue as ${ROLE_DESCRIPTIONS[pendingRole]}?`
            : ""
        }
        message={
          pendingRole
            ? `Are you sure you want to continue as ${ROLE_DESCRIPTIONS[pendingRole]}?`
            : ""
        }
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        confirmButtonColor="bg-[#ff7800] hover:bg-[#e66e00]"
      />

      {loading && selectedRole && (
        <FullScreenLoader
          text={ROLE_TITLES[selectedRole] || "Preparing your Journey"}
        />
      )}
    </div>
  );
}

