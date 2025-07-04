"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullScreenLoader } from "@/components/common";
import {
  RoleCard,
  ActionFooter,
} from "@/components/custom/select-role/components";

const DEFAULT_BACKGROUNDS = {
  trainer:
    "https://blog.nasm.org/hubfs/top%205%20reasons%20to%20become%20a%20personal%20trainer%20header%20blog%20updated.jpg",
  client:
    "https://goat-fitness.com/wp-content/uploads/2022/01/shutterstock_1822207589.jpg",
};
// Role redirects
const ROLE_REDIRECTS = {
  trainer: "/trainer/personal-details",
  client: "/client/personal-details",
};

// Role titles for loading state

// Role configuration
const ROLES_CONFIG = {
  trainer: {
    title: "role.preparing.trainer",
    description: "role.trainer.description",
    icon: "mdi mdi-dumbbell",
    color: "#FF7800",
    secondaryColor: "#FFA94D",
    gradient: "from-orange-500 to-amber-500",
    background: DEFAULT_BACKGROUNDS.trainer,
    features: [
      { icon: "mdi-certificate", text: "role.trainer.feature1" },
      { icon: "mdi-account-multiple", text: "role.trainer.feature2" },
      { icon: "mdi-chart-line", text: "role.trainer.feature3" },
    ],
  },
  client: {
    title: "role.preparing.client",
    description: "role.client.description",
    icon: "mdi mdi-account-group",
    color: "#3B82F6",
    secondaryColor: "#60A5FA",
    gradient: "from-blue-500 to-indigo-500",
    background: DEFAULT_BACKGROUNDS.client,
    features: [
      { icon: "mdi-account-check", text: "role.client.feature1" },
      { icon: "mdi-calendar-check", text: "role.client.feature2" },
      { icon: "mdi-heart-pulse", text: "role.client.feature3" },
    ],
  },
};

export default function SelectRole() {
  const { t } = useTranslation();
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState(null);

  // Handle role selection
  const handleRoleClick = useCallback(
    (role) => {
      setSelectedRole(role === selectedRole ? null : role);
      setError(null);
    },
    [selectedRole]
  );

  // Handle role confirmation
  const handleConfirmRole = useCallback(async () => {
    if (!session || (!session?.user?.email && !session?.user?.phone)) {
      setError(t("common.unauthenticated"));
      return;
    }
    if (!selectedRole) {
      setError(t("role.selection.select_role"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/update-role", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          role: selectedRole,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        throw new Error(
          errorData.error ||
            t("role.update.failed", { status: response.status })
        );
      }

      await update({
        role: selectedRole,
        hasCompletedTrainingSetup: true,
      });

      const redirectPath = ROLE_REDIRECTS[selectedRole] || "/";
      router.push(redirectPath);
    } catch (error) {
      console.error("Error updating role:", error);
      setError(error.message || t("common.unknown_error"));
      setLoading(false);
    }
  }, [session, selectedRole, update, router, t]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white flex flex-col">
      {/* Premium background with lighting effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full bg-[#FF6B00]/20 blur-[150px]"></div>
        <div className="absolute bottom-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#FF9A00]/20 blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/10 blur-[200px]"></div>
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex flex-col z-10 pt-16 sm:pt-20 pb-24 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col h-full">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
              <span className="text-white block mb-2">
                {t("role.selection.title")}
              </span>
              <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block">
                {t("role.selection.subtitle")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              {t("role.selection.description")}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-sm max-w-lg mx-auto backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="mdi mdi-alert-circle text-xl text-red-400"></span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Role selection cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.entries(ROLES_CONFIG).map(([key, config]) => (
              <RoleCard
                key={key}
                role={key}
                config={config}
                isSelected={selectedRole === key}
                onClick={handleRoleClick}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action footer */}
      {selectedRole && (
        <ActionFooter
          selectedRole={selectedRole}
          config={ROLES_CONFIG[selectedRole]}
          onContinue={handleConfirmRole}
          t={t}
        />
      )}

      {/* Loading overlay */}

      <FullScreenLoader
        text={`Preparing your ${
          ROLES_CONFIG[selectedRole]?.title
            .replace("role.preparing.", "")
            .charAt(0)
            .toUpperCase() +
          ROLES_CONFIG[selectedRole]?.title
            .replace("role.preparing.", "")
            .slice(1)
        } Journey`}
        isVisible={loading && selectedRole}
      />

      {/* MDI Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css"
      />

      {/* CSS for premium effects */}
      <style jsx>{`
        .bg-radial-gradient {
          background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.7) 100%
          );
        }
      `}</style>
    </div>
  );
}
