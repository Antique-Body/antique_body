"use client";

import { Modal } from "@/components/common";
import { RoleCardCompact } from "@/components/custom";
import { FullScreenLoader } from "@/components/custom/FullScreenLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

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

const ROLE_REDIRECTS = {
    trainer: "/trainer-dashboard",
    client: "/client-dashboard",
    user: "/user/training-setup",
    admin: "/admin-dashboard",
};

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
            <h1 className="text-4xl font-bold mb-6 spartacus-font text-[#ff7800]">Choose Your Path</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Select how you want to experience your fitness journey
            </p>

            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">{error}</div>}

            <div className="flex flex-col gap-6 max-w-3xl mx-auto">{roleCards}</div>

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

            {loading && selectedRole && <FullScreenLoader text={ROLE_TITLES[selectedRole] || "Preparing your Journey"} />}
        </div>
    );
}
