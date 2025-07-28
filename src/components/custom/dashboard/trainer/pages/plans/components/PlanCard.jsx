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
          onClick={handleViewClick}
          className="flex cursor-pointer !p-0 flex-col sm:flex-row overflow-hidden hover:border-[#FF6B00] transition-all duration-300"
        >
          {/* Left side with image - Only on larger screens */}
          {coverImage && (
            <div className="relative w-full sm:w-48 h-32 sm:h-auto overflow-hidden">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${
                    isNutrition
                      ? "bg-green-900/80 text-green-100"
                      : "bg-blue-900/80 text-blue-100"
                  }`}
                >
                  {isNutrition ? "Nutrition" : "Training"}
                </span>
              </div>
              {price && (
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-md bg-[#FF6B00]/20 text-[#FF6B00]">
                    ${price}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {clientCount > 0 && (
                <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Icon icon="mdi:account-group" className="w-3 h-3" />
                  {clientCount}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                <span>{duration || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar" className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-auto">
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
                className={`text-xs px-3 py-1.5 ${clientCount > 0 ? "bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#FF5500] hover:to-[#FF7700] shadow-lg shadow-[#FF6B00]/25" : ""}`}
              >
                {clientCount > 0 ? "Track" : "Assign"}
              </Button>

              <Button
                variant="ghost"
                size="small"
                leftIcon={<Icon icon="mdi:pencil" className="w-4 h-4" />}
                onClick={handleEditClick}
                className="text-xs px-3 py-1.5 text-gray-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                size="small"
                leftIcon={<Icon icon="mdi:content-copy" className="w-4 h-4" />}
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
