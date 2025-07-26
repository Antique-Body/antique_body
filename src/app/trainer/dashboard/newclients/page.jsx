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
    if (!level) return "Experience Not Specified";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Goal Not Specified";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  // Function to map activity names to proper labels with null safety
  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Activity Not Specified";

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
          {coachingRequests.map((request) => {
            const clientGender =
              request.client?.clientProfile?.gender?.toLowerCase();
            const isMale = clientGender === "male";
            const isFemale = clientGender === "female";

            // Gender-based styling with elegant colors
            const genderStyles = {
              background: isMale
                ? "bg-gradient-to-r from-slate-900/95 via-blue-900/10 to-slate-900/95"
                : isFemale
                ? "bg-gradient-to-r from-slate-900/95 via-purple-900/10 to-slate-900/95"
                : "bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95",
              border: isMale
                ? "border-cyan-600/30 hover:border-cyan-400/50"
                : isFemale
                ? "border-violet-600/30 hover:border-violet-400/50"
                : "border-slate-700/50 hover:border-blue-400/70",
              shadow: isMale
                ? "hover:shadow-cyan-500/10"
                : isFemale
                ? "hover:shadow-violet-500/10"
                : "hover:shadow-blue-500/20",
              profileRing: isMale
                ? "ring-cyan-400/40"
                : isFemale
                ? "ring-violet-400/40"
                : "ring-white/10",
              genderIcon: isMale
                ? "mdi:gender-male"
                : isFemale
                ? "mdi:gender-female"
                : null,
              genderColor: isMale
                ? "text-cyan-400"
                : isFemale
                ? "text-violet-400"
                : "text-gray-400",
              accent: isMale
                ? "from-cyan-500/10 to-blue-500/10"
                : isFemale
                ? "from-violet-500/10 to-purple-500/10"
                : "from-blue-500/10 to-blue-500/10",
            };

            return (
              <div
                key={request.id}
                className={`relative group w-full ${genderStyles.background} border ${genderStyles.border} rounded-xl shadow-lg ${genderStyles.shadow} transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden`}
              >
                {/* Gender Accent Strip - suptilno */}
                {(isMale || isFemale) && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${genderStyles.accent} opacity-70`}
                  />
                )}

                {/* Main Card Content */}
                <div className="flex items-center p-4 gap-4">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Profile Image */}
                    <div
                      className="relative cursor-pointer group/image flex-shrink-0"
                      tabIndex="0"
                      role="button"
                      aria-label={`View profile image of ${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`}
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
                      <div
                        className={`relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl ring-2 ring-white/10 group-hover/image:${genderStyles.profileRing} shadow-md transition-all duration-300`}
                      >
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-white truncate">
                          {request.client.clientProfile.firstName}{" "}
                          {request.client.clientProfile.lastName}
                        </h3>

                        {/* Suptilna gender ikonica */}
                        {genderStyles.genderIcon && (
                          <div
                            className={`p-1 rounded-full ${
                              isMale
                                ? "bg-blue-500/20 border border-blue-400/30"
                                : "bg-pink-500/20 border border-pink-400/30"
                            }`}
                          >
                            <Icon
                              icon={genderStyles.genderIcon}
                              className={
                                isMale ? "text-blue-400" : "text-pink-400"
                              }
                              width={12}
                              height={12}
                            />
                          </div>
                        )}
                      </div>
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
                      leftIcon={
                        <Icon icon="mdi:check" width={14} height={14} />
                      }
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 hover:border-emerald-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
                    >
                      <span className="hidden sm:inline">Accept</span>
                    </Button>

                    {/* Reject Button */}
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleRejectRequest(request)}
                      leftIcon={
                        <Icon icon="mdi:close" width={14} height={14} />
                      }
                      className="px-3 py-2 bg-red-600/90 hover:bg-red-500 border border-red-500/50 hover:border-red-400/70 text-white transition-all duration-200 rounded-lg text-xs font-medium"
                    >
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
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
          <div className="flex justify-center items-center w-full h-[70vh]">
            {selectedProfileImage.url ? (
              <div
                className="relative rounded-2xl overflow-hidden border-4 border-blue-400/30 shadow-2xl bg-zinc-900/70"
                style={{
                  width: "min(600px, 90vw)",
                  height: "min(600px, 70vh)",
                }}
              >
                <Image
                  src={selectedProfileImage.url}
                  alt={selectedProfileImage.name}
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 90vw, 600px"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-[300px] w-[300px] items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8] rounded-2xl border-4 border-blue-400/30 shadow-2xl">
                <Icon
                  icon="mdi:account"
                  width={128}
                  height={128}
                  color="white"
                />
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
            {/* Profile Header - Compact */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  {/* Profile Image */}
                  <div
                    className="relative flex-shrink-0 cursor-pointer"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProfileImageClick(
                          selectedClientDetails.client.clientProfile
                            .profileImage,
                          `${selectedClientDetails.client.clientProfile.firstName} ${selectedClientDetails.client.clientProfile.lastName}`
                        );
                      }
                    }}
                    onClick={() =>
                      handleProfileImageClick(
                        selectedClientDetails.client.clientProfile.profileImage,
                        `${selectedClientDetails.client.clientProfile.firstName} ${selectedClientDetails.client.clientProfile.lastName}`
                      )
                    }
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-lg ring-2 ring-slate-600/30 shadow-lg hover:ring-blue-400/50 transition-all duration-300">
                      {selectedClientDetails.client.clientProfile
                        .profileImage ? (
                        <Image
                          src={
                            selectedClientDetails.client.clientProfile
                              .profileImage
                          }
                          alt={`${selectedClientDetails.client.clientProfile.firstName} profile`}
                          className="object-cover w-full h-full"
                          width={80}
                          height={80}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                          <Icon
                            icon="mdi:account"
                            width={32}
                            height={32}
                            className="text-slate-300"
                          />
                        </div>
                      )}
                    </div>
                    {/* Gender Badge */}
                    {selectedClientDetails.client.clientProfile.gender && (
                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 shadow-lg ${
                          selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                          "male"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                              "female"
                            ? "bg-gradient-to-br from-pink-500 to-pink-600"
                            : "bg-gradient-to-br from-slate-500 to-slate-600"
                        }`}
                      >
                        <Icon
                          icon={
                            selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                            "male"
                              ? "mdi:gender-male"
                              : selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                                "female"
                              ? "mdi:gender-female"
                              : "mdi:help"
                          }
                          width={12}
                          height={12}
                          className="text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                      {selectedClientDetails.client.clientProfile.firstName}{" "}
                      {selectedClientDetails.client.clientProfile.lastName}
                    </h2>

                    {/* Info Pills - Compact */}
                    <div className="flex flex-wrap gap-2">
                      {/* Experience Level */}
                      <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="mdi:dumbbell"
                            width={14}
                            height={14}
                            className="text-blue-400"
                          />
                          <span className="text-slate-300 text-xs font-medium">
                            {getExperienceText(
                              selectedClientDetails.client.clientProfile
                                .experienceLevel
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Age */}
                      <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="mdi:calendar"
                            width={14}
                            height={14}
                            className="text-purple-400"
                          />
                          <span className="text-slate-300 text-xs font-medium">
                            {calculateAge(
                              selectedClientDetails.client.clientProfile
                                .dateOfBirth
                            )}{" "}
                            yrs
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      {selectedClientDetails.client.clientProfile.location
                        ?.city && (
                        <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                          <div className="flex items-center gap-1">
                            <Icon
                              icon="mdi:map-marker"
                              width={14}
                              height={14}
                              className="text-emerald-400"
                            />
                            <span className="text-slate-300 text-xs font-medium">
                              {
                                selectedClientDetails.client.clientProfile
                                  .location.city
                              }
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Gender */}
                      {selectedClientDetails.client.clientProfile.gender && (
                        <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                          <div className="flex items-center gap-1">
                            <Icon
                              icon={
                                selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                                "male"
                                  ? "mdi:gender-male"
                                  : "mdi:gender-female"
                              }
                              width={14}
                              height={14}
                              className={
                                selectedClientDetails.client.clientProfile.gender.toLowerCase() ===
                                "male"
                                  ? "text-blue-400"
                                  : "text-pink-400"
                              }
                            />
                            <span className="text-slate-300 text-xs font-medium capitalize">
                              {
                                selectedClientDetails.client.clientProfile
                                  .gender
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information - Compact Layout */}
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Primary Goal */}
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Icon
                      icon="mdi:target"
                      className="text-blue-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Primary Goal</h4>
                    <p className="text-slate-400 text-xs">Training objective</p>
                  </div>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                  <p className="text-white font-medium break-words">
                    {getFitnessGoalText(
                      selectedClientDetails.client.clientProfile.primaryGoal
                    )}
                  </p>
                </div>
              </div>

              {/* Physical Stats */}
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Icon
                      icon="mdi:human-male-height"
                      className="text-purple-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Physical Stats</h4>
                    <p className="text-slate-400 text-xs">Body measurements</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        icon="mdi:ruler"
                        className="text-purple-400"
                        width={16}
                        height={16}
                      />
                      <span className="text-slate-400 text-xs">Height</span>
                    </div>
                    <p className="text-white font-medium">
                      {selectedClientDetails.client.clientProfile.height &&
                      selectedClientDetails.client.clientProfile.height > 0
                        ? `${selectedClientDetails.client.clientProfile.height}cm`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        icon="mdi:weight"
                        className="text-purple-400"
                        width={16}
                        height={16}
                      />
                      <span className="text-slate-400 text-xs">Weight</span>
                    </div>
                    <p className="text-white font-medium">
                      {selectedClientDetails.client.clientProfile.weight &&
                      selectedClientDetails.client.clientProfile.weight > 0
                        ? `${selectedClientDetails.client.clientProfile.weight}kg`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Date */}
              <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <Icon
                      icon="mdi:clock-outline"
                      className="text-emerald-400"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Request Date</h4>
                    <p className="text-slate-400 text-xs">When submitted</p>
                  </div>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="mdi:calendar-today"
                      className="text-emerald-400"
                      width={18}
                      height={18}
                    />
                    <p className="text-white font-medium">
                      {new Date(
                        selectedClientDetails.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferred Activities */}
            {selectedClientDetails.client.clientProfile.preferredActivities
              .length > 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <Icon
                        icon="mdi:dumbbell"
                        className="text-green-400"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        Preferred Activities
                      </h4>
                      <p className="text-slate-400 text-xs">
                        Training preferences
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClientDetails.client.clientProfile.preferredActivities.map(
                      (activity) => (
                        <div
                          key={activity.id}
                          className="bg-slate-900/30 rounded-lg p-3 border border-slate-700/30 min-w-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                            <span className="text-slate-200 text-sm font-medium truncate">
                              {mapActivityToLabel(activity.name)}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Languages */}
            {selectedClientDetails.client.clientProfile.languages &&
              selectedClientDetails.client.clientProfile.languages.length >
                0 && (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Icon
                          icon="mdi:translate"
                          className="text-indigo-400"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Languages</h4>
                        <p className="text-slate-400 text-xs">
                          Communication preferences
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClientDetails.client.clientProfile.languages.map(
                        (language) => (
                          <div
                            key={language.id}
                            className="bg-slate-900/30 rounded-lg px-3 py-2 border border-slate-700/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                              <span className="text-slate-200 text-sm font-medium whitespace-nowrap">
                                {language.name}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
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
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-lg ring-2 ring-slate-600/30 shadow-lg">
                    {selectedRequest.client.clientProfile.profileImage ? (
                      <Image
                        src={selectedRequest.client.clientProfile.profileImage}
                        alt={`${selectedRequest.client.clientProfile.firstName} profile`}
                        className="object-cover w-full h-full"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                        <Icon
                          icon="mdi:account"
                          width={32}
                          height={32}
                          className="text-slate-300"
                        />
                      </div>
                    )}
                  </div>
                  {/* Gender Badge */}
                  {selectedRequest.client.clientProfile.gender && (
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 shadow-lg ${
                        selectedRequest.client.clientProfile.gender.toLowerCase() ===
                        "male"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600"
                          : selectedRequest.client.clientProfile.gender.toLowerCase() ===
                            "female"
                          ? "bg-gradient-to-br from-pink-500 to-pink-600"
                          : "bg-gradient-to-br from-slate-500 to-slate-600"
                      }`}
                    >
                      <Icon
                        icon={
                          selectedRequest.client.clientProfile.gender.toLowerCase() ===
                          "male"
                            ? "mdi:gender-male"
                            : selectedRequest.client.clientProfile.gender.toLowerCase() ===
                              "female"
                            ? "mdi:gender-female"
                            : "mdi:help"
                        }
                        width={12}
                        height={12}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Client Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {selectedRequest.client.clientProfile.firstName}{" "}
                    {selectedRequest.client.clientProfile.lastName}
                  </h3>

                  {/* Info Pills - Compact */}
                  <div className="flex flex-wrap gap-2">
                    {/* Experience Level */}
                    <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:dumbbell"
                          width={14}
                          height={14}
                          className="text-blue-400"
                        />
                        <span className="text-slate-300 text-xs font-medium">
                          {getExperienceText(
                            selectedRequest.client.clientProfile.experienceLevel
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Age */}
                    <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                      <div className="flex items-center gap-1">
                        <Icon
                          icon="mdi:calendar"
                          width={14}
                          height={14}
                          className="text-purple-400"
                        />
                        <span className="text-slate-300 text-xs font-medium">
                          {calculateAge(
                            selectedRequest.client.clientProfile.dateOfBirth
                          )}{" "}
                          yrs
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    {selectedRequest.client.clientProfile.location?.city && (
                      <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                        <div className="flex items-center gap-1">
                          <Icon
                            icon="mdi:map-marker"
                            width={14}
                            height={14}
                            className="text-emerald-400"
                          />
                          <span className="text-slate-300 text-xs font-medium">
                            {selectedRequest.client.clientProfile.location.city}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Gender */}
                    {selectedRequest.client.clientProfile.gender && (
                      <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                        <div className="flex items-center gap-1">
                          <Icon
                            icon={
                              selectedRequest.client.clientProfile.gender.toLowerCase() ===
                              "male"
                                ? "mdi:gender-male"
                                : "mdi:gender-female"
                            }
                            width={14}
                            height={14}
                            className={
                              selectedRequest.client.clientProfile.gender.toLowerCase() ===
                              "male"
                                ? "text-blue-400"
                                : "text-pink-400"
                            }
                          />
                          <span className="text-slate-300 text-xs font-medium capitalize">
                            {selectedRequest.client.clientProfile.gender}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs mb-1">Height</p>
                    <p className="text-white font-medium">
                      {selectedRequest.client.clientProfile.height &&
                      selectedRequest.client.clientProfile.height > 0
                        ? `${selectedRequest.client.clientProfile.height}cm`
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-xs mb-1">Weight</p>
                    <p className="text-white font-medium">
                      {selectedRequest.client.clientProfile.weight &&
                      selectedRequest.client.clientProfile.weight > 0
                        ? `${selectedRequest.client.clientProfile.weight}kg`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
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
