"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullScreenLoader, RoleCardCompact } from "@/components";
import { Modal } from "@/components/common/Modal";

const ROLE_TITLES = {
    trainer: "role.preparing.trainer",
    client: "role.preparing.client",
    user: "role.preparing.user",
    admin: "role.preparing.admin",
};

const ROLE_DESCRIPTIONS = {
    trainer: "role.trainer.label",
    client: "role.client.label",
    user: "role.user.label",
    admin: "role.admin",
};

const ROLE_REDIRECTS = {
    trainer: "/trainer/personal-details",
    client: "/client/personal-details",
    user: "/user/training-setup",
    admin: "/admin/dashboard",
};

export default function SelectRole() {
    const { t } = useTranslation();
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(
        () => () => {
            setLoading(false);
            setSelectedRole(null);
        },
        []
    );

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
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: session.user.email,
                    role: pendingRole,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || t("role.update.failed", { status: response.status }));
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
            setError(error.message || t("common.unknown_error"));
            setLoading(false);
            setSelectedRole(null);
        }
    }, [session?.user?.email, pendingRole, router, update, t]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setPendingRole(null);
        setError(null);
    }, []);

    const roleCards = useMemo(
        () => (
            <>
                <div className="grid md:grid-cols-2 gap-5 auto-rows-fr">
                    <RoleCardCompact
                        title={t("role.trainer.become")}
                        description={t("role.trainer.description")}
                        role="trainer"
                        onClick={() => handleRoleClick("trainer")}
                        loading={loading && selectedRole === "trainer"}
                        isSelected={selectedRole === "trainer"}
                    />

                    <RoleCardCompact
                        title={t("role.client.train_with_coach")}
                        description={t("role.client.description")}
                        role="client"
                        onClick={() => handleRoleClick("client")}
                        loading={loading && selectedRole === "client"}
                        isSelected={selectedRole === "client"}
                    />
                </div>

                <div className="max-w-md mx-auto w-full">
                    <RoleCardCompact
                        title={t("role.user.custom_workout")}
                        description={t("role.user.description")}
                        role="user"
                        onClick={() => handleRoleClick("user")}
                        loading={loading && selectedRole === "user"}
                        isSelected={selectedRole === "user"}
                    />
                </div>
            </>
        ),
        [handleRoleClick, loading, selectedRole, t]
    );

    return (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-6 spartacus-font text-[#ff7800]">{t("role.selection.title")}</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">{t("role.selection.description")}</p>

            {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">{error}</div>}

            <div className="flex flex-col gap-6 max-w-3xl mx-auto">{roleCards}</div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleConfirmRole}
                title={t("role.selection.confirm_path")}
                confirmButtonText={t("common.continue")}
                cancelButtonText={t("common.cancel")}
                confirmButtonColor="bg-[#ff7800] hover:bg-[#e66e00]"
            >
                <div className="">
                    <p className="mb-3 text-gray-300">
                        {pendingRole && t("role.selection.continue_as", { role: t(ROLE_DESCRIPTIONS[pendingRole]) })}
                    </p>
                </div>
            </Modal>

            {loading && selectedRole && <FullScreenLoader text={t(ROLE_TITLES[selectedRole] || "role.preparing.journey")} />}
        </div>
    );
}
