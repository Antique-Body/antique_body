"use client";

import { Icon } from "@iconify/react";
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
  const [detailedPlanData, setDetailedPlanData] = useState(null);
  const [deleteError, setDeleteError] = useState("");
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
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      },
    },
  };

  const fetchPlanDetailsHandler = async () => {
    try {
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
    }
  };

  const handleViewClick = async () => {
    const planData = await fetchPlanDetailsHandler();
    setDetailedPlanData(planData);
    setIsModalOpen(true);
  };

  const handleCopyClick = () => {
    // Navigate to the same edit page but with a query param to indicate it's a copy operation
    router.push(
      `${editUrl}?mode=copy&title=${encodeURIComponent(`Copy of ${title}`)}`
    );
  };

  const handleTrackClick = async () => {
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
      {deleteError && <ErrorMessage error={deleteError} />}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <Card
          variant="darkStrong"
          className="group !p-0 hover:border-[#FF6B00] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/10 overflow-hidden p-0"
        >
          <div className="flex h-36">
            {/* Image Section - Left side, full height, no padding */}
            {coverImage && (
              <div className="relative w-32 sm:w-40 flex-shrink-0">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
              </div>
            )}

            {/* Content Section - Right side with padding */}
            <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
              {/* Top Section - Title, Description, Meta */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        {title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-md flex-shrink-0 ${
                          isNutrition
                            ? "bg-green-900/30 text-green-400"
                            : "bg-blue-900/30 text-blue-400"
                        }`}
                      >
                        {isNutrition ? "Nutrition" : "Training"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {price && (
                      <span className="px-2 py-1 text-xs font-medium rounded-md bg-[#FF6B00]/20 text-[#FF6B00]">
                        ${price}
                      </span>
                    )}
                    {clientCount > 0 && (
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Icon icon="mdi:account-group" className="w-3 h-3" />
                        {clientCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
                    <span>{duration || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:calendar" className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{formattedDate}</span>
                    <span className="sm:hidden">
                      {new Date(createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  onClick={handleViewClick}
                  variant="darkOutline"
                  size="small"
                  leftIcon={<Icon icon="mdi:eye" className="w-4 h-4" />}
                  className="text-xs px-3 py-1.5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 flex-shrink-0"
                >
                  <span className="hidden sm:inline">View</span>
                </Button>

                <Button
                  onClick={handleTrackClick}
                  variant={clientCount > 0 ? "primary" : "darkOutline"}
                  size="small"
                  leftIcon={
                    <Icon
                      icon={
                        clientCount > 0 ? "mdi:chart-line" : "mdi:account-plus"
                      }
                      className="w-4 h-4"
                    />
                  }
                  className={`text-xs px-3 py-1.5 flex-shrink-0 ${clientCount > 0 ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#FF5500] hover:to-[#FF7700] shadow-lg shadow-[#FF6B00]/25" : ""}`}
                >
                  <span className="hidden sm:inline">
                    {clientCount > 0 ? "Track" : "Assign"}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="small"
                  leftIcon={<Icon icon="mdi:pencil" className="w-4 h-4" />}
                  onClick={handleEditClick}
                  className="text-xs px-3 py-1.5 text-gray-400 hover:text-blue-300 hover:bg-blue-900/20 flex-shrink-0"
                >
                  <span className="hidden sm:inline">Edit</span>
                </Button>

                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={
                      <Icon icon="mdi:content-copy" className="w-4 h-4" />
                    }
                    onClick={handleCopyClick}
                    className="text-xs px-3 py-1.5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10"
                  >
                    Copy
                  </Button>

                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={<Icon icon="mdi:trash" className="w-4 h-4" />}
                    onClick={handleDeleteClick}
                    className="text-xs px-3 py-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>

                {/* Mobile Menu Button for Additional Actions */}
                <div className="md:hidden ml-auto">
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="small"
                      leftIcon={
                        <Icon icon="mdi:dots-vertical" className="w-4 h-4" />
                      }
                      className="text-xs px-2 py-1.5 text-gray-400 hover:text-white"
                    />
                    <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                      <button
                        onClick={handleCopyClick}
                        className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 flex items-center gap-2"
                      >
                        <Icon icon="mdi:content-copy" className="w-3.5 h-3.5" />
                        Copy
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Icon icon="mdi:trash" className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
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
        title={t("plans.delete_title", "Delete Plan")}
        message={
          <span>
            {t(
              "plans.delete_message",
              "Are you sure you want to delete the plan"
            )}{" "}
            <span className="font-semibold">{title}</span>?
          </span>
        }
        confirmButtonText={
          deleting
            ? t("plans.deleting", "Deleting...")
            : t("plans.delete_confirm", "Yes, delete")
        }
        cancelButtonText={t("common.cancel", "No")}
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
