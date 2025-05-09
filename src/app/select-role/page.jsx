"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/common/Modal";
import { DEFAULT_BACKGROUNDS } from "@/components/custom/select-role/components/RoleCardCompact";
import { Card } from "@/components/custom/index";

// Role configuration with clear visual identifiers
const ROLES_CONFIG = {
    trainer: {
        title: "role.trainer.become",
        description: "role.trainer.description",
        icon: "mdi mdi-dumbbell",
        color: "#FF7800",
        gradient: "from-orange-500 to-amber-500",
        background: DEFAULT_BACKGROUNDS.trainer,
        redirect: "/trainer/personal-details",
        features: [
            { icon: "mdi-certificate", text: "role.trainer.feature1" },
            { icon: "mdi-account-multiple", text: "role.trainer.feature2" },
            { icon: "mdi-chart-line", text: "role.trainer.feature3" },
        ],
    },
    client: {
        title: "role.client.train_with_coach",
        description: "role.client.description",
        icon: "mdi mdi-account-group",
        color: "#3B82F6",
        gradient: "from-blue-500 to-indigo-500",
        background: DEFAULT_BACKGROUNDS.client,
        redirect: "/client/personal-details",
        features: [
            { icon: "mdi-account-check", text: "role.client.feature1" },
            { icon: "mdi-calendar-check", text: "role.client.feature2" },
            { icon: "mdi-heart-pulse", text: "role.client.feature3" },
        ],
    },
    user: {
        title: "role.user.custom_workout",
        description: "role.user.description",
        icon: "mdi mdi-account-outline",
        color: "#10B981",
        gradient: "from-emerald-500 to-teal-500",
        background: DEFAULT_BACKGROUNDS.user,
        redirect: "/user/training-setup",
        features: [
            { icon: "mdi-run", text: "role.user.feature1" },
            { icon: "mdi-database", text: "role.user.feature2" },
            { icon: "mdi-trophy", text: "role.user.feature3" },
        ],
    },
};

// Animation configurations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.15,
            duration: 0.8,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
};

// Help text component with sleek design
const HelpText = () => {
    const { t } = useTranslation();
    const [showHelpModal, setShowHelpModal] = useState(false);

    return (
        <>
            <div className="flex justify-center mt-6 relative">
                <button
                    className="text-gray-300 hover:text-white text-sm flex items-center gap-2 transition-colors duration-200 hover:bg-white/10 rounded-full px-4 py-2 border border-white/10"
                    onClick={() => setShowHelpModal(true)}
                >
                    <span className="mdi mdi-help-circle text-lg text-[#FF7800]"></span>
                    {t("role.selection.help_choosing")}
                </button>
            </div>

            <Modal
                isOpen={showHelpModal}
                onClose={() => setShowHelpModal(false)}
                title={t("role.selection.help_choosing")}
                confirmButtonText={t("common.continue")}
                confirmButtonColor="bg-[#ff7800] hover:bg-[#e66e00]"
                size="small"
                primaryButtonAction={() => setShowHelpModal(false)}
            >
                <div className="py-3">
                    <div className="space-y-5">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-orange-500/20 p-2 rounded-full flex-shrink-0">
                                    <span className="mdi mdi-dumbbell text-lg text-orange-400"></span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-orange-400 mb-1">{t("role.trainer.label")}</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {t("role.selection.help_modal.trainer_help")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-blue-500/20 p-2 rounded-full flex-shrink-0">
                                    <span className="mdi mdi-account-group text-lg text-blue-400"></span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-400 mb-1">{t("role.client.label")}</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {t("role.selection.help_modal.client_help")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 bg-emerald-500/20 p-2 rounded-full flex-shrink-0">
                                    <span className="mdi mdi-account-outline text-lg text-emerald-400"></span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-400 mb-1">{t("role.user.label")}</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {t("role.selection.help_modal.user_help")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-800 mt-2 text-center">
                            <a
                                href="mailto:support@antiquebody.com"
                                className="inline-flex items-center text-[#FF7800] hover:text-orange-400 gap-1 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="mdi mdi-email-outline"></span>
                                {t("role.selection.help_modal.contact_support")}
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

// Role card component with clear visual differentiation
const RoleOption = ({ role, config, isSelected, onClick, loading }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    // Define card style properties based on role
    const getCardStyleProps = () => {
        let styleProps = {
            accentColor: config.color,
            animate: true,
            animationVariant: "fadeIn",
            backdropBlur: "sm",
            glowEffect: isSelected,
            glowColor: `${config.color}40`,
            borderWidth: isSelected ? "2px" : "1px",
            hoverScale: "1.02",
        };

        // Role-specific enhancements
        if (role === "trainer") {
            styleProps = {
                ...styleProps,
                cardStyle: "gradient",
                customGradient: "rgba(40,20,10,0.8),rgba(30,15,5,0.8)",
                animationVariant: "slideUp",
            };
        } else if (role === "client") {
            styleProps = {
                ...styleProps,
                cardStyle: "glass",
                animationVariant: "slideIn",
            };
        } else if (role === "user") {
            styleProps = {
                ...styleProps,
                accentCorner: isSelected,
                accentCornerPosition: "top-right",
                accentCornerColor: config.color,
                cardStyle: "premium",
                animationVariant: "scale",
            };
        }

        return styleProps;
    };

    return (
        <Card
            className={`relative overflow-hidden cursor-pointer h-full`}
            borderTop={false}
            borderColor={isSelected ? config.color : "rgba(255,255,255,0.1)"}
            shadow={isSelected ? `0 0 20px ${config.color}30` : "0 5px 15px rgba(0,0,0,0.2)"}
            bgGradientFrom={isSelected ? "rgba(22,22,22,0.95)" : "rgba(18,18,18,0.85)"}
            bgGradientTo={isSelected ? "rgba(28,28,28,0.95)" : "rgba(24,24,24,0.85)"}
            padding="0"
            width="100%"
            onClick={() => onClick(role)}
            // Hover effects
            hoverTranslateY="-5px"
            hoverBorderColor={config.color}
            hoverShadow={`0 15px 30px rgba(0,0,0,0.3), 0 5px 15px ${config.color}20`}
            hoverBgGradientFrom="rgba(25,25,25,0.9)"
            hoverBgGradientTo="rgba(30,30,30,0.9)"
            // Enhanced props
            {...getCardStyleProps()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background image with improved visibility */}
            <div className="relative aspect-[16/9] md:aspect-video w-full overflow-hidden">
                <Image
                    src={config.background}
                    alt={t(config.title)}
                    fill
                    className="object-cover"
                    style={{
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.5s ease-out",
                    }}
                    priority
                />

                {/* Gradient overlay with reduced opacity for better image visibility */}
                <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-10 z-10`}></div>

                {/* Dark overlay adjusted for better image visibility */}
                <div className="absolute inset-0 bg-black/10 z-20"></div>
            </div>

            {/* Content */}
            <div className="relative z-30 p-4 sm:p-5 lg:p-6">
                {/* Role badge */}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${config.gradient}`}
                    >
                        <i className={`${config.icon} text-xl sm:text-2xl text-white`}></i>
                    </div>

                    {isSelected && (
                        <motion.div 
                            className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 ml-auto"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="mdi mdi-check text-lg"></span>
                        </motion.div>
                    )}
                </div>

                {/* Role title and description */}
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{t(config.title)}</h3>
                <p className="text-gray-200 mb-4 sm:mb-5 text-sm leading-relaxed">{t(config.description)}</p>

                {/* Feature list for clarity - responsive adjustments */}
                <div className="space-y-2 mb-4">
                    {config.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                            <span 
                                className={`mdi ${feature.icon} text-base sm:text-lg`} 
                                style={{ color: config.color }}
                            ></span>
                            <span>{t(feature.text)}</span>
                        </div>
                    ))}
                </div>

                {/* Call to action button - responsive adjustments */}
                <div className="mt-auto pt-2">
                    <button
                        className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-gradient-to-r ${config.gradient} text-white text-sm sm:text-base font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2`}
                    >
                        <span>{t("role.selection.select_role")}</span>
                        <span className="mdi mdi-arrow-right"></span>
                    </button>
                </div>
            </div>

            {/* Loading overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span className="text-white text-sm font-medium">Loading...</span>
                    </div>
                </div>
            )}
        </Card>
    );
};

// Confirmation dialog with clear visual representation of the role
const RoleConfirmDialog = ({ isOpen, onClose, onConfirm, role }) => {
    const { t } = useTranslation();
    const config = role ? ROLES_CONFIG[role] : null;

    if (!config) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title=""
            confirmButtonText={t("common.continue")}
            cancelButtonText={t("common.back")}
            confirmButtonColor={`bg-[${config.color}] hover:opacity-90`}
            size="small"
        >
            <div className="py-4 text-center">
                <div className="flex flex-col items-center">
                    {/* Role header with icon */}
                    <div className="mb-6">
                        <div
                            className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} mx-auto flex items-center justify-center mb-4`}
                        >
                            <i className={`${config.icon} text-4xl text-white`}></i>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{t(config.title)}</h3>
                    </div>

                    <p className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed mb-6">
                        {t("role.selection.confirm_description", { role: t(config.title).toLowerCase() })}
                    </p>

                    {/* Feature list */}
                    <div className="space-y-3 w-full">
                        {config.features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 border border-white/10"
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-${role}-100/20`}
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <i className={`mdi ${feature.icon}`} style={{ color: config.color }}></i>
                                </div>
                                <span className="text-sm text-gray-200">{t(feature.text)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
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
    const [pageLoaded, setPageLoaded] = useState(false);

    // Control page initialization animation
    useEffect(() => {
        const timer = setTimeout(() => setPageLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Load Material Design Icons
    useEffect(() => {
        const mdiLink = document.querySelector('link[href*="materialdesignicons"]');
        if (!mdiLink) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css";
            document.head.appendChild(link);
        }
    }, []);

    // Handle role selection
    const handleRoleClick = useCallback((role) => {
        setPendingRole(role);
        setIsModalOpen(true);
        setError(null);
    }, []);

    // Handle role confirmation
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

            // Redirect to appropriate page
            const redirectPath = ROLES_CONFIG[pendingRole].redirect;
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

    // Close modal handler
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setPendingRole(null);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
            {/* Main background with effects from home page */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
                <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
                <div
                    className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#FF6B00]/10 blur-[150px] animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 relative z-10">
                {/* Header with clear purpose - improved responsive styling */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center text-xs sm:text-sm font-medium mb-4 sm:mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                        <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                            <span className="mdi mdi-account text-sm" />
                        </span>
                        {t("role.selection.step")}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-5 leading-tight">
                        <span className="text-white block mb-1 sm:mb-2">{t("role.selection.title")}</span>
                        <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block">
                            {t("role.selection.subtitle")}
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">{t("role.selection.description")}</p>
                </div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200 text-xs sm:text-sm max-w-lg mx-auto"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="mdi mdi-alert-circle text-lg text-red-400"></span>
                                <span>{error}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Role selection cards with improved responsive grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={pageLoaded ? "visible" : "hidden"}
                >
                    {Object.entries(ROLES_CONFIG).map(([key, config]) => (
                        <RoleOption
                            key={key}
                            role={key}
                            config={config}
                            isSelected={selectedRole === key}
                            onClick={handleRoleClick}
                            loading={loading && selectedRole === key}
                        />
                    ))}
                </motion.div>

                {/* Help text with improved responsive styling */}
                <div className="mt-6 sm:mt-8">
                    <HelpText />
                </div>

                {/* Note about changing later */}
                <div className="text-center text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8">
                    <p>{t("role.selection.can_change_later")}</p>
                </div>
            </div>

            {/* Role confirmation dialog */}
            <RoleConfirmDialog isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirmRole} role={pendingRole} />

            {/* Full screen loader */}
            <AnimatePresence>
                {loading && selectedRole && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
                    >
                        <div className="relative w-16 sm:w-20 h-16 sm:h-20 mb-4 sm:mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-[#FF6B00]/20 animate-ping"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#FF6B00] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                            {t(ROLES_CONFIG[selectedRole]?.title || "role.preparing.journey")}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-400">{t("role.preparing.please_wait")}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MDI Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css" />
        </div>
    );
}
