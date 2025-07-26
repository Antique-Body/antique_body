"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";


import {
  fetchPlanDetails,
  deletePlan,
} from "@/app/api/users/services/planService";
import { Card, ErrorMessage } from "@/components/common";
import { Button } from "@/components/common/Button";
import {
  ClockIcon,
  CopyIcon,
  DollarIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  ViewIcon,
} from "@/components/common/Icons";
import { Modal } from "@/components/common/Modal";

import { PlanPreviewModal } from "./PlanPreviewModal";

export const PlanCard = ({
  id,
  title,
  description,
  coverImage,
  createdAt,
  type,
  duration,
  clientCount = 0,
  price,
  editUrl,
  index = 0,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingPlanDetails, setLoadingPlanDetails] = useState(false);
  const [detailedPlanData, setDetailedPlanData] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isCopyRotating, setIsCopyRotating] = useState(false);
  const [isEditRotating, setIsEditRotating] = useState(false);
  const copyTimeoutRef = useRef(null);
  const editTimeoutRef = useRef(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const formattedDate = new Date(createdAt).toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isNutrition = type === "nutrition";

  // Cleanup timeouts on unmount
  useEffect(() => {
    function cleanup() {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
    }
    return cleanup;
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const handleCardClick = (e) => {
    // Don't open modal if clicking on one of the buttons
    if (e.target.closest("button")) {
      return;
    }
    handleViewClick();
  };

  const fetchPlanDetailsHandler = async () => {
    try {
      setLoadingPlanDetails(true);
      const planData = await fetchPlanDetails(id, type);
      // Transform the data to match what PlanPreviewModal expects
      const transformedData = {
        id: planData.id,
        title: planData.title,
        description: planData.description,
        image: planData.coverImage,
        createdAt: planData.createdAt,
        duration: planData.duration
          ? `${planData.duration} ${planData.durationType || "weeks"}`
          : "Not specified",
        clientCount: planData.clientCount || 0,
        price: planData.price,
        keyFeatures: planData.keyFeatures || [],
        schedule: planData.schedule || [],
        timeline: planData.timeline || [],
        editUrl,
      };
      if (isNutrition) {
        transformedData.nutritionInfo = planData.nutritionInfo;
        transformedData.mealTypes = planData.mealTypes;
        transformedData.supplementRecommendations =
          planData.supplementRecommendations;
        transformedData.cookingTime = planData.cookingTime;
        if (planData.days) {
          transformedData.days = planData.days;
        }
        transformedData.targetGoal = planData.targetGoal;
      } else {
        transformedData.trainingType = planData.trainingType;
        transformedData.sessionsPerWeek = planData.sessionsPerWeek;
        transformedData.sessionFormat = planData.sessionFormat;
        transformedData.difficultyLevel = planData.difficultyLevel;
        transformedData.features = planData.features;
      }
      setDetailedPlanData(transformedData);
      return transformedData;
    } catch {
      return {
        id,
        title,
        description,
        image: coverImage,
        createdAt,
        duration,
        clientCount,
        price,
        keyFeatures: [],
        schedule: [],
        editUrl,
      };
    } finally {
      setLoadingPlanDetails(false);
    }
  };

  const handleViewClick = async () => {
    const planData = await fetchPlanDetailsHandler();
    setDetailedPlanData(planData);
    setIsModalOpen(true);
  };

  const handleCopyClick = () => {
    setIsCopyRotating(true);
    // Navigate to the same edit page but with a query param to indicate it's a copy operation
    router.push(
      `${editUrl}?mode=copy&title=${encodeURIComponent(`Copy of ${title}`)}`
    );
    // Reset rotation after a short delay and store timeout ID for cleanup
    copyTimeoutRef.current = setTimeout(() => setIsCopyRotating(false), 1000);
  };

  const handleTrackClick = async () => {
    setIsEditRotating(true);
    try {
      // Fetch active assignments for this specific plan
      const response = await fetch(
        `/api/users/trainer/plans/${id}/assignments`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        // If unauthorized, redirect to login
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }

        throw new Error(
          `Failed to fetch plan assignments: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.success)
        throw new Error(data.error || "Failed to fetch plan assignments");

      const assignments = data.data || [];

      if (assignments.length === 0) {
        // No assigned plans found - navigate to client selection page to assign the plan
        router.push(
          `/trainer/dashboard/clients?planId=${id}&type=${type}&action=assign`
        );
      } else if (assignments.length === 1) {
        // Only one client has this plan - navigate directly to their plan page
        const assignment = assignments[0];
        // Use assignedPlanId directly with the new API - no need for coachingRequestId
        router.push(
          `/trainer/dashboard/assigned-plans/${assignment.assignedPlanId}?type=${type}`
        );
      } else {
        // Multiple clients have this plan - navigate to tracking overview page
        router.push(
          `/trainer/dashboard/plans/${id}/track?type=${type}&assignments=${encodeURIComponent(
            JSON.stringify(assignments)
          )}`
        );
      }
    } catch (error) {
      console.error("Error in handleTrackClick:", error);
      // Fallback to original behavior - go to clients page for assignment
      router.push(
        `/trainer/dashboard/clients?planId=${id}&type=${type}&action=assign`
      );
    } finally {
      // Reset rotation after a short delay and store timeout ID for cleanup
      editTimeoutRef.current = setTimeout(() => setIsEditRotating(false), 1000);
    }
  };

  const handleEditClick = () => {
    // Use the correct edit URL based on plan type
    if (isNutrition) {
      router.push(`/trainer/dashboard/plans/nutrition/edit/${id}`);
    } else {
      router.push(`/trainer/dashboard/plans/training/edit/${id}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deletePlan(id, isNutrition ? "nutrition" : "training");
      if (onDelete) onDelete(id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete plan:", error);
      setDeleteError(
        t("plans.delete_error", "Failed to delete plan. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full cursor-pointer"
        onClick={handleCardClick}
      >
        {deleteError && <ErrorMessage error={deleteError} />}
        <Card
          variant="darkStrong"
          width="100%"
          className="flex h-full flex-col overflow-hidden hover:border-[#FF6B00] transition-all duration-300 !p-0"
        >
          <div className="relative h-32 sm:h-40 overflow-hidden">
            {coverImage && (
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>

            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  isNutrition
                    ? "bg-green-900/80 text-green-100"
                    : "bg-blue-900/80 text-blue-100"
                }`}
              >
                {isNutrition ? "Nutrition" : "Training"}
              </span>

              {price && (
                <span className="flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#FF6B00]/20 text-[#FF6B00]">
                  <DollarIcon size={12} className="mr-1" />${price}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-2 sm:p-4">
            <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-bold text-white line-clamp-1">
              {title}
            </h3>
            <p className="mb-2 sm:mb-3 text-sm text-gray-400 line-clamp-2">
              {description}
            </p>

            <div className="mt-auto space-y-2 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <ClockIcon size={16} className="text-gray-500" />
                  <span>{duration || "Not specified"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <UsersIcon size={16} className="text-gray-500" />
                  <span
                    className={`font-medium ${
                      clientCount > 0 ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    {clientCount} {clientCount === 1 ? "client" : "clients"}
                  </span>
                  {clientCount > 0 && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1"></div>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs">{formattedDate}</span>
                </div>
              </div>

              <div
                className="grid grid-cols-2 gap-2 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="darkOutline"
                  size="small"
                  leftIcon={<ViewIcon size={14} />}
                  onClick={handleViewClick}
                  loading={loadingPlanDetails}
                  className="hover:border-blue-400 hover:text-blue-300 hover:scale-105 hover:shadow-md transition-all duration-200 text-xs px-3 py-2 h-9 font-medium"
                >
                  {loadingPlanDetails ? "Loading..." : "View"}
                </Button>
                <Button
                  onClick={handleTrackClick}
                  variant="primary"
                  size="small"
                  leftIcon={
                    <EditIcon
                      size={14}
                      className={`transition-transform duration-300 ${
                        isEditRotating ? "animate-rotate-once" : ""
                      }`}
                    />
                  }
                  className={`${
                    clientCount > 0
                      ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#FF5500] hover:to-[#FF7700] shadow-lg shadow-[#FF6B00]/25"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600"
                  } hover:scale-105 hover:shadow-lg transition-all duration-200 text-xs px-3 py-2 h-9 font-medium border-0 relative`}
                  disabled={clientCount === 0}
                  title={
                    clientCount === 0
                      ? "No clients assigned to this plan"
                      : `Track progress for ${clientCount} ${
                          clientCount === 1 ? "client" : "clients"
                        }`
                  }
                >
                  {clientCount > 0 ? "Track" : "Assign"}
                  {clientCount > 1 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                      {clientCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Additional Actions */}
              <div
                className="flex justify-center gap-1 mt-2"
                onClick={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                aria-label="Plan action buttons"
              >
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<EditIcon size={12} />}
                  onClick={handleEditClick}
                  className="hover:bg-zinc-800 hover:text-blue-400 transition-all duration-200 text-xs px-2 py-1 h-7 text-zinc-500"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={
                    <CopyIcon
                      size={12}
                      className={`transition-transform duration-300 ${
                        isCopyRotating ? "animate-rotate-once" : ""
                      }`}
                    />
                  }
                  onClick={handleCopyClick}
                  className="hover:bg-zinc-800 hover:text-[#FF6B00] transition-all duration-200 text-xs px-2 py-1 h-7 text-zinc-500"
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<TrashIcon size={12} />}
                  onClick={handleDeleteClick}
                  className="hover:bg-zinc-800 hover:text-red-400 transition-all duration-200 text-xs px-2 py-1 h-7 text-zinc-500"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <PlanPreviewModal
        plan={detailedPlanData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        days={detailedPlanData?.days}
        type={type}
      />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t("plans.delete_title", "Obriši plan")}
        message={
          <span>
            {t(
              "plans.delete_message",
              "Jesi li siguran da želiš obrisati plan"
            )}{" "}
            <span className="font-semibold">{title}</span>?
          </span>
        }
        confirmButtonText={
          deleting
            ? t("plans.deleting", "Brišem...")
            : t("plans.delete_confirm", "Da, obriši")
        }
        cancelButtonText={t("common.cancel", "Ne")}
        primaryButtonDisabled={deleting}
        primaryButtonAction={confirmDelete}
        secondaryButtonAction={() => setShowDeleteModal(false)}
        footerButtons
        footerBorder
        size="small"
      />
    </>
  );
};
