"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "@/components/common/Modal";
import { DEFAULT_BACKGROUNDS } from "@/components/custom/select-role/components/RoleCardCompact";

// Role configuration data
const ROLES_CONFIG = {
  trainer: {
    title: "role.trainer.become",
    description: "role.trainer.description",
    icon: "mdi mdi-dumbbell",
    color: "#FF5722",
    gradient: "from-orange-600 to-red-600",
    background: DEFAULT_BACKGROUNDS.trainer,
    redirect: "/trainer/personal-details",
    features: [
      { icon: "mdi-certificate", text: "role.trainer.feature1" },
      { icon: "mdi-account-multiple", text: "role.trainer.feature2" },
      { icon: "mdi-chart-line", text: "role.trainer.feature3" }
    ]
  },
  client: {
    title: "role.client.train_with_coach",
    description: "role.client.description",
    icon: "mdi mdi-account-group",
    color: "#FFFFFF",
    gradient: "from-blue-600 to-indigo-600",
    background: DEFAULT_BACKGROUNDS.client,
    redirect: "/client/personal-details",
    features: [
      { icon: "mdi-account-check", text: "role.client.feature1" },
      { icon: "mdi-calendar-check", text: "role.client.feature2" },
      { icon: "mdi-heart-pulse", text: "role.client.feature3" }
    ]
  },
  user: {
    title: "role.user.custom_workout",
    description: "role.user.description",
    icon: "mdi mdi-account-outline",
    color: "#4CAF50",
    gradient: "from-green-600 to-emerald-600",
    background: DEFAULT_BACKGROUNDS.user,
    redirect: "/user/training-setup",
    features: [
      { icon: "mdi-run", text: "role.user.feature1" },
      { icon: "mdi-database", text: "role.user.feature2" },
      { icon: "mdi-trophy", text: "role.user.feature3" }
    ]
  }
};

// Animations configuration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 12, stiffness: 100 }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.98 }
};

const nameVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } }
};

const circleVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

// Help center component with Framer Motion animations
const HelpText = () => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  return (
    <>
      <div className="flex justify-center mt-4 relative">
        <button
          className="text-gray-400 hover:text-orange-400 text-sm flex items-center gap-1.5 transition-colors duration-200 bg-black/20 hover:bg-black/30 rounded-full px-4 py-2 border border-gray-800"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowHelpModal(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t("role.selection.help_choosing")}
        </button>
        
        {showTooltip && (
          <div className="absolute bottom-full mb-2 bg-black/90 text-white text-xs p-2 rounded shadow-lg max-w-xs">
            {t("role.selection.help_choosing")}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45"></div>
          </div>
        )}
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
        <div className="py-3 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-orange-500/10 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-white">
              {t("role.selection.help_choosing")}
            </h3>
            
            <div className="space-y-4 text-gray-300 text-sm">
              <p className="leading-relaxed">
                <span className="font-semibold text-orange-400">{t("role.trainer.label")}:</span> {t("role.selection.help_modal.trainer_help")}
              </p>
              
              <p className="leading-relaxed">
                <span className="font-semibold text-orange-400">{t("role.client.label")}:</span> {t("role.selection.help_modal.client_help")}
              </p>
              
              <p className="leading-relaxed">
                <span className="font-semibold text-orange-400">{t("role.user.label")}:</span> {t("role.selection.help_modal.user_help")}
              </p>
              
              <div className="pt-2 border-t border-gray-800 mt-4">
                <a 
                  href="mailto:support@antiquebody.com"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t("role.selection.help_modal.contact_support")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Role card component with dynamic styling based on role
const RoleOption = ({ role, config, isSelected, onClick, loading }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${isSelected ? 'ring-2 ring-offset-2 ring-offset-black ring-white/30' : ''}`}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background image with overlay */}
      <div className="relative aspect-[5/3] md:aspect-[3/2] w-full overflow-hidden">
        <Image 
          src={config.background}
          alt={t(config.title)}
          fill
          className="object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        {/* Gradient overlay changes on hover */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-70 z-10 transition-opacity duration-300`}
          animate={{ opacity: isHovered ? 0.8 : 0.6 }}
        />
        
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30 z-20"></div>
      </div>

      {/* Content container */}
      <div className="absolute inset-0 z-30 p-5 md:p-6 flex flex-col justify-between text-white">
        {/* Role icon and title */}
        <div className="flex items-start justify-between">
          <motion.div 
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md"
            variants={circleVariants}
          >
            <i className={`${config.icon} text-2xl`}></i>
          </motion.div>
          
          {isSelected && (
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <span className="mdi mdi-check text-lg"></span>
            </motion.div>
          )}
        </div>
        
        {/* Role title and description */}
        <div className="mt-auto">
          <motion.h3 
            className="text-xl md:text-2xl font-bold mb-2 spartacus-font" 
            variants={nameVariants}
          >
            {t(config.title)}
          </motion.h3>
          
          <motion.p 
            className="text-sm md:text-base text-white/90 mb-4 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t(config.description)}
          </motion.p>
          
          {/* Features */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {config.features.map((feature, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-xs"
              >
                <i className={`mdi ${feature.icon}`} style={{ color: config.color }}></i>
                <span>{t(feature.text)}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Call to action button */}
        <motion.div 
          className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 md:p-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <span className="mdi mdi-arrow-right text-lg"></span>
        </motion.div>
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
    </motion.div>
  );
};

// Animated confirmation dialog for role selection
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
      confirmButtonColor={`bg-[${config.color}] hover:bg-[${config.color}]/90`}
      size="small"
    >
      <div className="py-4 text-center">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Role image with animated overlay */}
          <div className="w-full h-40 relative rounded-xl overflow-hidden mb-6">
            <Image 
              src={config.background}
              alt={t(config.title)}
              fill
              className="object-cover"
            />
            
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-70`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.6 }}
            />
            
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Centered role icon */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, delay: 0.2 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border-2 border-white/30">
                <i className={`${config.icon} text-4xl text-white`}></i>
              </div>
            </motion.div>
          </div>
          
          {/* Role title with animated underline */}
          <div className="relative mb-2">
            <motion.h3 
              className="text-2xl font-bold spartacus-font text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t(config.title)}
            </motion.h3>
            
            <motion.div 
              className="h-0.5 w-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </div>
          
          {/* Description with fade-in animation */}
          <motion.p 
            className="text-gray-300 text-sm max-w-xs mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t("role.selection.confirm_description", { role: t(config.title).toLowerCase() })}
          </motion.p>
          
          {/* Feature list with staggered animation */}
          <motion.div 
            className="space-y-3 w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {config.features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="flex items-center gap-3 text-left p-3 rounded-lg bg-white/5 border border-white/10"
                variants={itemVariants}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${config.color}30` }}>
                  <i className={`mdi ${feature.icon}`} style={{ color: config.color }}></i>
                </div>
                <span className="text-sm text-gray-300">{t(feature.text)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css';
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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white p-4 md:p-6">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 bg-black -z-20"></div>
      
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500 opacity-20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600 opacity-20 blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-green-500 opacity-15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        </motion.div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
      </div>

      {/* Main content container with entrance animation */}
      <motion.div 
        className="container mx-auto max-w-6xl z-10 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Header section */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="relative w-16 h-16 mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500 opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <span className="mdi mdi-shield-account text-3xl"></span>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-3 spartacus-font tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("role.selection.title")}
          </motion.h1>
          
          <motion.p 
            className="text-sm md:text-base text-gray-300 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {t("role.selection.description")}
          </motion.p>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm max-w-lg mx-auto"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <span className="mdi mdi-alert-circle text-lg text-red-400"></span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role selection grid with staggered animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8"
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
              onClick={() => handleRoleClick(key)}
              loading={loading && selectedRole === key}
            />
          ))}
        </motion.div>

        {/* Help section */}
        <HelpText />
      </motion.div>

      {/* Role confirmation dialog */}
      <RoleConfirmDialog
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmRole}
        role={pendingRole}
      />

      {/* Full screen loader */}
      <AnimatePresence>
        {loading && selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-orange-500/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="mdi mdi-shield-account text-3xl text-orange-500"></span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {t(ROLES_CONFIG[selectedRole]?.title || "role.preparing.journey")}
            </h3>
            
            <p className="text-gray-400 text-sm animate-pulse">
              {t("role.preparing.please_wait")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MDI Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.2.96/css/materialdesignicons.min.css" />
    </div>
  );
}
