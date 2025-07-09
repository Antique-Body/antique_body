"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState, useContext } from "react";

import { BadgeContext } from "../layout";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export default function NewClientsPage() {
  const { refreshBadgeCounts } = useContext(BadgeContext);
  const [coachingRequests, setCoachingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseType, setResponseType] = useState(""); // "accept" or "reject"
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [responseError, setResponseError] = useState("");

  // Fetch coaching requests
  const fetchCoachingRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/coaching-requests?role=trainer&status=pending"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coaching requests");
      }

      const data = await response.json();
      if (data.success) {
        setCoachingRequests(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching coaching requests:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachingRequests();
  }, []);

  const handleAcceptRequest = (request) => {
    setSelectedRequest(request);
    setResponseType("accept");
    setShowResponseModal(true);
  };

  const handleRejectRequest = (request) => {
    setSelectedRequest(request);
    setResponseType("reject");
    setShowResponseModal(true);
  };

  const handleResponseSubmit = async () => {
    if (!selectedRequest || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/coaching-requests/${selectedRequest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: responseType === "accept" ? "accepted" : "rejected",
            rejectionReason: responseType === "reject" ? rejectionReason : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update request");
      }

      // Remove the request from the list
      setCoachingRequests((prev) =>
        prev.filter((req) => req.id !== selectedRequest.id)
      );

      // Refresh badge counts using context
      if (refreshBadgeCounts) {
        refreshBadgeCounts();
      }

      // Close modal and reset state
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseType("");
      setRejectionReason("");
      setResponseError("");
    } catch (error) {
      console.error("Error updating request:", error);
      setResponseError("Failed to update request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowResponseModal(false);
    setSelectedRequest(null);
    setResponseType("");
    setRejectionReason("");
  };

  const handleProfileImageClick = (imageUrl, clientName) => {
    setSelectedProfileImage({ url: imageUrl, name: clientName });
    setShowProfileImage(true);
  };

  const handleViewDetails = (request) => {
    setSelectedClientDetails(request);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedClientDetails(null);
  };

  const getExperienceText = (level) => {
    if (!level) return "Unknown";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Unknown Goal";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  // Function to map activity names to proper labels with null safety
  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Unknown Activity";

    const activity = ACTIVITY_TYPES.find(
      (a) =>
        a.id === activityName ||
        (a.label && a.label.toLowerCase() === activityName.toLowerCase())
    );
    return activity
      ? activity.label
      : activityName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading coaching requests...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load coaching requests
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
            <Button
              type="button"
              className="mt-4"
              variant="primary"
              onClick={fetchCoachingRequests}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          New Client Requests
        </h1>
        <p className="text-zinc-400">
          Review and respond to coaching requests from potential clients
        </p>
      </div>

      {/* Status Banner */}
      <div className="mb-6">
        <InfoBanner
          icon="mdi:account-multiple"
          title={`Pending Requests (${coachingRequests.length})`}
          subtitle={
            coachingRequests.length === 0
              ? "No pending coaching requests at the moment."
              : `You have ${coachingRequests.length} pending coaching requests to review.`
          }
          variant="info"
        />
      </div>

      {/* Coaching Requests */}
      {coachingRequests.length > 0 ? (
        <div className="flex flex-col gap-4">
          {coachingRequests.map((request) => (
            <div
              key={request.id}
              className="relative group w-full bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 hover:border-blue-400/70 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden"
            >
              {/* Main Card Content */}
              <div className="flex items-center p-4 gap-4">
                {/* Profile Section */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Profile Image */}
                  <div
                    className="relative cursor-pointer group/image flex-shrink-0"
                    tabIndex="0"
                    onClick={() =>
                      handleProfileImageClick(
                        request.client.clientProfile.profileImage,
                        `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProfileImageClick(
                          request.client.clientProfile.profileImage,
                          `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`
                        );
                      }
                    }}
                  >
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl ring-2 ring-white/10 group-hover/image:ring-blue-400/60 shadow-md transition-all duration-300">
                      {request.client.clientProfile.profileImage ? (
                        <Image
                          src={request.client.clientProfile.profileImage}
                          alt={`${request.client.clientProfile.firstName} profile`}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover/image:scale-105"
                          width={56}
                          height={56}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                          <Icon
                            icon="mdi:account"
                            width={20}
                            height={20}
                            color="white"
                          />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Icon
                        icon="mdi:eye"
                        className="text-white"
                        width={14}
                        height={14}
                      />
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate mb-1">
                      {request.client.clientProfile.firstName}{" "}
                      {request.client.clientProfile.lastName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:calendar" width={12} height={12} />
                        <span>
                          {calculateAge(
                            request.client.clientProfile.dateOfBirth
                          )}{" "}
                          years
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:map-marker" width={12} height={12} />
                        <span className="truncate">
                          {request.client.clientProfile.location?.city ||
                            "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Preview */}
                {request.note && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50 max-w-xs">
                    <Icon
                      icon="mdi:message-text"
                      className="text-cyan-400 flex-shrink-0"
                      width={14}
                      height={14}
                    />
                    <p className="text-slate-300 text-sm italic truncate">
                      "{request.note}"
                    </p>
                  </div>
                )}

                {/* Medical Alert */}
                {(request.client.clientProfile.medicalConditions ||
                  request.client.clientProfile.allergies) && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-900/30 rounded-lg border border-amber-600/40">
                    <Icon
                      icon="mdi:medical-bag"
                      className="text-amber-400"
                      width={14}
                      height={14}
                    />
                    <span className="text-amber-300 text-xs font-medium">
                      Medical Info
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* View Details Button */}
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleViewDetails(request)}
                    leftIcon={<Icon icon="mdi:eye" width={14} height={14} />}
                    className="px-3 py-2 bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/50 hover:border-slate-500/70 text-slate-200 hover:text-white transition-all duration-200 rounded-lg text-xs font-medium"
                  >
                    <span className="hidden sm:inline">Details</span>
                  </Button>

                  {/* Accept Button */}
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleAcceptRequest(request)}
                    leftIcon={<Icon icon="mdi:check" width={14} height={14} />}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
                  >
                    <span className="hidden sm:inline">Accept</span>
                  </Button>

                  {/* Reject Button */}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleRejectRequest(request)}
                    leftIcon={<Icon icon="mdi:close" width={14} height={14} />}
                    className="px-3 py-2 bg-red-600/90 hover:bg-red-500 border border-red-500/50 hover:border-red-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
                  >
                    <span className="hidden sm:inline">Reject</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-zinc-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-zinc-700/30">
            <Icon
              icon="mdi:account-multiple-outline"
              className="text-zinc-500"
              width={40}
              height={40}
            />
          </div>
          <h3 className="text-xl font-semibold text-zinc-300 mb-2">
            No Pending Requests
          </h3>
          <p className="text-zinc-500 max-w-md mx-auto">
            You don't have any coaching requests at the moment. New requests
            will appear here when potential clients reach out.
          </p>
        </div>
      )}

      {/* Profile Image Modal */}
      {showProfileImage && selectedProfileImage && (
        <Modal
          isOpen={showProfileImage}
          onClose={() => setShowProfileImage(false)}
          footerButtons={false}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:account"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <span>Profile Photo</span>
            </div>
          }
          hideButtons={true}
        >
          <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-zinc-900/50">
            {selectedProfileImage.url ? (
              <Image
                src={selectedProfileImage.url}
                alt={selectedProfileImage.name}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                <Icon icon="mdi:account" width={96} height={96} color="white" />
              </div>
            )}
          </div>
          <p className="text-center text-zinc-400 mt-4 font-medium">
            {selectedProfileImage.name}
          </p>
        </Modal>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedClientDetails && (
        <Modal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          footerButtons={false}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:account-details"
                width={24}
                height={24}
                className="text-[#3E92CC]"
              />
              <span>Client Details</span>
            </div>
          }
          hideButtons={true}
          className="max-w-4xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pb-6">
            {/* Profile Header */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/0 to-zinc-900 pointer-events-none" />
              <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-zinc-700/30 overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
                <div className="relative flex items-start gap-6">
                  <div className="h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-[#3E92CC]/20 flex-shrink-0">
                    {selectedClientDetails.client.clientProfile.profileImage ? (
                      <Image
                        src={
                          selectedClientDetails.client.clientProfile
                            .profileImage
                        }
                        alt={`${selectedClientDetails.client.clientProfile.firstName} profile`}
                        className="object-cover w-full h-full"
                        width={112}
                        height={112}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                        <Icon
                          icon="mdi:account"
                          width={48}
                          height={48}
                          color="white"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-3xl font-bold text-white mb-3">
                        {selectedClientDetails.client.clientProfile.firstName}{" "}
                        {selectedClientDetails.client.clientProfile.lastName}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/30 text-blue-400 text-sm font-medium rounded-full border border-blue-700/30">
                        <Icon icon="mdi:dumbbell" width={16} height={16} />
                        Experience Level:{" "}
                        {getExperienceText(
                          selectedClientDetails.client.clientProfile
                            .experienceLevel
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 text-purple-400 text-sm font-medium rounded-full border border-purple-700/30">
                        <Icon icon="mdi:calendar" width={16} height={16} />
                        {calculateAge(
                          selectedClientDetails.client.clientProfile.dateOfBirth
                        )}{" "}
                        years old
                      </span>
                      {selectedClientDetails.client.clientProfile.location
                        ?.city && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/30 text-emerald-400 text-sm font-medium rounded-full border border-emerald-700/30">
                          <Icon icon="mdi:map-marker" width={16} height={16} />
                          {
                            selectedClientDetails.client.clientProfile.location
                              .city
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Icon
                      icon="mdi:target"
                      className="text-blue-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-zinc-400 text-sm font-medium">
                    Primary Goal
                  </span>
                </div>
                <p className="text-white font-medium">
                  {getFitnessGoalText(
                    selectedClientDetails.client.clientProfile.primaryGoal
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Icon
                      icon="mdi:human-male-height"
                      className="text-purple-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-zinc-400 text-sm font-medium">
                    Physical Stats
                  </span>
                </div>
                <p className="text-white font-medium">
                  {selectedClientDetails.client.clientProfile.height}cm •{" "}
                  {selectedClientDetails.client.clientProfile.weight}kg
                </p>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Icon
                      icon="mdi:clock-outline"
                      className="text-emerald-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-zinc-400 text-sm font-medium">
                    Request Date
                  </span>
                </div>
                <p className="text-white font-medium">
                  {new Date(
                    selectedClientDetails.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Preferred Activities */}
            {selectedClientDetails.client.clientProfile.preferredActivities
              .length > 0 && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <Icon
                      icon="mdi:dumbbell"
                      className="text-green-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <h4 className="text-white font-medium">
                    Preferred Activities
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedClientDetails.client.clientProfile.preferredActivities.map(
                    (activity) => (
                      <span
                        key={activity.id}
                        className="px-3 py-1.5 bg-green-900/30 text-green-400 text-sm font-medium rounded-full border border-green-800/30"
                      >
                        {mapActivityToLabel(activity.name)}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            {selectedClientDetails.client.clientProfile.languages &&
              selectedClientDetails.client.clientProfile.languages.length >
                0 && (
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Icon
                        icon="mdi:translate"
                        className="text-blue-400"
                        width={20}
                        height={20}
                      />
                    </div>
                    <h4 className="text-white font-medium">Languages</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedClientDetails.client.clientProfile.languages.map(
                      (language) => (
                        <span
                          key={language.id}
                          className="px-3 py-1.5 bg-blue-900/30 text-blue-400 text-sm font-medium rounded-full border border-blue-800/30"
                        >
                          {language.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Medical Information */}
            {(selectedClientDetails.client.clientProfile.medicalConditions ||
              selectedClientDetails.client.clientProfile.allergies) && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Icon
                      icon="mdi:medical-bag"
                      className="text-amber-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <h4 className="text-white font-medium">
                    Medical Information
                  </h4>
                </div>
                <div className="space-y-3">
                  {selectedClientDetails.client.clientProfile
                    .medicalConditions && (
                    <div className="flex items-start gap-3 bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
                      <Icon
                        icon="mdi:medical-bag"
                        className="text-amber-400 mt-1"
                        width={20}
                        height={20}
                      />
                      <div>
                        <p className="text-amber-400 font-medium text-sm mb-1">
                          Medical Conditions
                        </p>
                        <p className="text-amber-300/90 text-sm">
                          {
                            selectedClientDetails.client.clientProfile
                              .medicalConditions
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedClientDetails.client.clientProfile.allergies && (
                    <div className="flex items-start gap-3 bg-red-900/20 rounded-xl p-4 border border-red-700/30">
                      <Icon
                        icon="mdi:alert"
                        className="text-red-400 mt-1"
                        width={20}
                        height={20}
                      />
                      <div>
                        <p className="text-red-400 font-medium text-sm mb-1">
                          Allergies
                        </p>
                        <p className="text-red-300/90 text-sm">
                          {selectedClientDetails.client.clientProfile.allergies}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Message */}
            {selectedClientDetails.note && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Icon
                      icon="mdi:message-text"
                      className="text-blue-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <h4 className="text-white font-medium">
                    Message from Client
                  </h4>
                </div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                  <p className="text-zinc-300 text-sm italic">
                    "{selectedClientDetails.note}"
                  </p>
                </div>
              </div>
            )}

            {/* Client Description */}
            {selectedClientDetails.client.clientProfile.description && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Icon
                      icon="mdi:account-details"
                      className="text-purple-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <h4 className="text-white font-medium">About Client</h4>
                </div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                  <p className="text-zinc-300 text-sm">
                    {selectedClientDetails.client.clientProfile.description}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {/* Remove the bottom action buttons */}
          </div>
        </Modal>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <Modal
          isOpen={showResponseModal}
          onClose={handleCloseModal}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon={
                  responseType === "accept"
                    ? "mdi:check-circle"
                    : "mdi:close-circle"
                }
                width={24}
                height={24}
                className={
                  responseType === "accept" ? "text-green-400" : "text-red-400"
                }
              />
              {responseType === "accept" ? "Accept" : "Reject"} Coaching Request
            </div>
          }
          footerButtons={true}
          primaryButtonText={
            responseType === "accept" ? "Accept Client" : "Reject Request"
          }
          primaryButtonAction={handleResponseSubmit}
          primaryButtonDisabled={isSubmitting}
          secondaryButtonText="Cancel"
          secondaryButtonAction={handleCloseModal}
        >
          <div className="space-y-6">
            {/* Client Profile Summary */}
            <div className="flex items-center gap-4 bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
              <div className="h-20 w-20 overflow-hidden rounded-xl ring-2 ring-[#3E92CC]/20">
                {selectedRequest.client.clientProfile.profileImage ? (
                  <Image
                    src={selectedRequest.client.clientProfile.profileImage}
                    alt={`${selectedRequest.client.clientProfile.firstName} profile`}
                    className="object-cover w-full h-full"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                    <Icon
                      icon="mdi:account"
                      width={32}
                      height={32}
                      color="white"
                    />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {selectedRequest.client.clientProfile.firstName}{" "}
                  {selectedRequest.client.clientProfile.lastName}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                    {getExperienceText(
                      selectedRequest.client.clientProfile.experienceLevel
                    )}
                  </span>
                  <span className="px-2 py-1 bg-purple-900/30 text-purple-400 text-xs rounded-full">
                    {calculateAge(
                      selectedRequest.client.clientProfile.dateOfBirth
                    )}{" "}
                    years
                  </span>
                  {selectedRequest.client.clientProfile.location?.city && (
                    <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                      <Icon icon="mdi:map-marker" width={12} height={12} />
                      {selectedRequest.client.clientProfile.location.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Primary Goal */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:target"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <span className="text-zinc-400 text-sm">Primary Goal</span>
                </div>
                <p className="text-white font-medium">
                  {getFitnessGoalText(
                    selectedRequest.client.clientProfile.primaryGoal
                  )}
                </p>
              </div>

              {/* Physical Stats */}
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:human-male-height"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <span className="text-zinc-400 text-sm">Physical Stats</span>
                </div>
                <p className="text-white font-medium">
                  {selectedRequest.client.clientProfile.height}cm •{" "}
                  {selectedRequest.client.clientProfile.weight}kg
                </p>
              </div>
            </div>

            {/* Preferred Activities */}
            {selectedRequest.client.clientProfile.preferredActivities?.length >
              0 && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">
                    Preferred Activities
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.client.clientProfile.preferredActivities.map(
                    (activity) => (
                      <span
                        key={activity.id}
                        className="px-3 py-1.5 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-800/30"
                      >
                        {mapActivityToLabel(activity.name)}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Client Message */}
            {selectedRequest.note && (
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:message-text"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">
                    Message from Client
                  </h4>
                </div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                  <p className="text-zinc-300 text-sm italic">
                    "{selectedRequest.note}"
                  </p>
                </div>
              </div>
            )}

            {/* Medical Information Alert */}
            {(selectedRequest.client.clientProfile.medicalConditions ||
              selectedRequest.client.clientProfile.allergies) && (
              <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/10 rounded-xl p-4 border border-amber-700/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:medical-bag"
                    className="text-amber-400 mt-1"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-amber-400 font-medium">
                      Important Health Information
                    </p>
                    <p className="text-amber-300/90 text-sm mt-1">
                      This client has disclosed medical conditions or allergies.
                      Please review their full profile for details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {responseType === "accept" ? (
              <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 rounded-xl p-4 border border-green-700/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:information"
                    className="text-green-400 mt-0.5"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-green-400 font-medium mb-1">
                      Ready to start coaching?
                    </p>
                    <p className="text-sm text-green-300">
                      By accepting this request, you'll be able to create
                      personalized workout plans and begin your coaching journey
                      with {selectedRequest.client.clientProfile.firstName}.
                      You'll have immediate access to create programs and
                      communicate directly.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 rounded-xl p-4 border border-red-700/30 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Icon
                      icon="mdi:alert"
                      className="text-red-400 mt-0.5"
                      width={20}
                      height={20}
                    />
                    <div>
                      <p className="text-red-400 font-medium mb-1">
                        Rejecting this request
                      </p>
                      <p className="text-sm text-red-300">
                        The client will be notified that their request was
                        declined. Please provide a brief reason.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
                  <FormField
                    type="textarea"
                    id="rejection-reason"
                    name="rejectionReason"
                    label="Reason for rejection (optional)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Currently at capacity, not a good fit for specialization, etc."
                    rows={3}
                    maxLength={200}
                    disabled={isSubmitting}
                    className="mb-0"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    {rejectionReason.length}/200 characters
                  </p>
                </div>
              </div>
            )}

            {responseError && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 text-center text-red-400">
                {responseError}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
