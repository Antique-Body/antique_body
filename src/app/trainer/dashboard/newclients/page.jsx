"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";

export default function NewClientsPage() {
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

      // Refresh badge counts
      if (window.refreshTrainerBadges) {
        window.refreshTrainerBadges();
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
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent"></div>
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
            <button
              className="mt-4 rounded-lg bg-[#3E92CC] px-4 py-2 text-white hover:bg-[#2D7EB8] transition-colors"
              onClick={fetchCoachingRequests}
            >
              Try Again
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {coachingRequests.map((request) => (
            <Card
              key={request.id}
              variant="clientCard"
              hover={true}
              className="overflow-visible"
            >
              <div className="flex items-center gap-4">
                {/* Profile Image */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() =>
                    handleProfileImageClick(
                      request.client.clientProfile.profileImage,
                      `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName}`
                    )
                  }
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl ring-2 ring-[#3E92CC]/20 transition-all duration-300 group-hover:ring-[#3E92CC]/50">
                    {request.client.clientProfile.profileImage ? (
                      <Image
                        src={request.client.clientProfile.profileImage}
                        alt={`${request.client.clientProfile.firstName} profile`}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                        <Icon
                          icon="mdi:account"
                          width={24}
                          height={24}
                          color="white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {request.client.clientProfile.firstName}{" "}
                    {request.client.clientProfile.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                      {getExperienceText(
                        request.client.clientProfile.experienceLevel
                      )}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-xs rounded-full">
                      {new Date().getFullYear() -
                        new Date(
                          request.client.clientProfile.dateOfBirth
                        ).getFullYear()}{" "}
                      years
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-zinc-900/50 rounded-lg p-2">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="mdi:target"
                      className="text-[#3E92CC]"
                      width={16}
                      height={16}
                    />
                    <span className="text-zinc-400 text-xs">Goal</span>
                  </div>
                  <p className="text-white text-sm mt-0.5 truncate">
                    {getFitnessGoalText(
                      request.client.clientProfile.primaryGoal
                    )}
                  </p>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-2">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-[#3E92CC]"
                      width={16}
                      height={16}
                    />
                    <span className="text-zinc-400 text-xs">Location</span>
                  </div>
                  <p className="text-white text-sm mt-0.5 truncate">
                    {request.client.clientProfile.location?.city ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => handleViewDetails(request)}
                  leftIcon={<Icon icon="mdi:eye" width={16} height={16} />}
                >
                  Details
                </Button>
                <Button
                  variant="orangeFilled"
                  size="small"
                  onClick={() => handleAcceptRequest(request)}
                  leftIcon={<Icon icon="mdi:check" width={16} height={16} />}
                >
                  Accept
                </Button>
                <Button
                  variant="modalCancel"
                  size="small"
                  onClick={() => handleRejectRequest(request)}
                  leftIcon={<Icon icon="mdi:close" width={16} height={16} />}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon
            icon="mdi:account-multiple-outline"
            className="text-zinc-600 mx-auto mb-4"
            width={64}
            height={64}
          />
          <p className="text-xl font-medium text-zinc-400 mb-2">
            No Pending Requests
          </p>
          <p className="text-zinc-500">
            You don't have any coaching requests at the moment. Check back
            later!
          </p>
        </div>
      )}

      {/* Profile Image Modal */}
      {showProfileImage && selectedProfileImage && (
        <Modal
          isOpen={showProfileImage}
          onClose={() => setShowProfileImage(false)}
          title={`Profile Photo - ${selectedProfileImage.name}`}
          hideButtons={true}
        >
          <div className="relative aspect-square w-full max-w-2xl mx-auto rounded-xl overflow-hidden">
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
        </Modal>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedClientDetails && (
        <Modal
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:account-details"
                width={24}
                height={24}
                className="text-[#3E92CC]"
              />
              Client Details
            </div>
          }
          hideButtons={true}
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Profile Header */}
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-xl ring-4 ring-[#3E92CC]/20">
                  {selectedClientDetails.client.clientProfile.profileImage ? (
                    <Image
                      src={
                        selectedClientDetails.client.clientProfile.profileImage
                      }
                      alt={`${selectedClientDetails.client.clientProfile.firstName} profile`}
                      className="object-cover w-full h-full"
                      width={96}
                      height={96}
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
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedClientDetails.client.clientProfile.firstName}{" "}
                    {selectedClientDetails.client.clientProfile.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full">
                      {getExperienceText(
                        selectedClientDetails.client.clientProfile
                          .experienceLevel
                      )}
                    </span>
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full">
                      {new Date().getFullYear() -
                        new Date(
                          selectedClientDetails.client.clientProfile.dateOfBirth
                        ).getFullYear()}{" "}
                      years
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:map-marker"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <span className="text-zinc-400 text-sm">Location</span>
                </div>
                <p className="text-white font-medium">
                  {selectedClientDetails.client.clientProfile.location?.city ||
                    "Not specified"}
                </p>
              </Card>
              <Card variant="dark" className="overflow-visible">
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
                    selectedClientDetails.client.clientProfile.primaryGoal
                  )}
                </p>
              </Card>
              <Card variant="dark" className="overflow-visible">
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
                  {selectedClientDetails.client.clientProfile.height}cm •{" "}
                  {selectedClientDetails.client.clientProfile.weight}kg
                </p>
              </Card>
            </div>

            {/* Preferred Activities */}
            {selectedClientDetails.client.clientProfile.preferredActivities
              .length > 0 && (
              <Card variant="dark" className="overflow-visible">
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
                  {selectedClientDetails.client.clientProfile.preferredActivities.map(
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
              </Card>
            )}

            {/* Languages */}
            {selectedClientDetails.client.clientProfile.languages &&
              selectedClientDetails.client.clientProfile.languages.length >
                0 && (
                <Card variant="dark" className="overflow-visible">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon
                      icon="mdi:translate"
                      className="text-[#3E92CC]"
                      width={20}
                      height={20}
                    />
                    <h4 className="text-white font-medium">Languages</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedClientDetails.client.clientProfile.languages.map(
                      (language) => (
                        <span
                          key={language.id}
                          className="px-3 py-1.5 bg-blue-900/30 text-blue-400 text-sm rounded-full border border-blue-800/30"
                        >
                          {language.name}
                        </span>
                      )
                    )}
                  </div>
                </Card>
              )}

            {/* Medical Information */}
            {(selectedClientDetails.client.clientProfile.medicalConditions ||
              selectedClientDetails.client.clientProfile.allergies) && (
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:medical-bag"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">
                    Medical Information
                  </h4>
                </div>
                <div className="space-y-3">
                  {selectedClientDetails.client.clientProfile
                    .medicalConditions && (
                    <div className="flex items-start gap-2 bg-amber-900/20 rounded-lg p-3 border border-amber-700/30">
                      <Icon
                        icon="mdi:medical-bag"
                        className="text-amber-400 mt-1"
                        width={16}
                        height={16}
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
                    <div className="flex items-start gap-2 bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                      <Icon
                        icon="mdi:alert"
                        className="text-red-400 mt-1"
                        width={16}
                        height={16}
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
              </Card>
            )}

            {/* Client Message */}
            {selectedClientDetails.note && (
              <Card variant="dark" className="overflow-visible">
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
                <p className="text-zinc-300 text-sm italic bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                  "{selectedClientDetails.note}"
                </p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-zinc-900 p-4 -mx-6 -mb-6 border-t border-zinc-800">
              <Button
                variant="orangeFilled"
                onClick={() => {
                  handleAcceptRequest(selectedClientDetails);
                  handleCloseDetailsModal();
                }}
                leftIcon={<Icon icon="mdi:check" width={20} height={20} />}
                fullWidth
              >
                Accept Request
              </Button>
              <Button
                variant="modalCancel"
                onClick={() => {
                  handleRejectRequest(selectedClientDetails);
                  handleCloseDetailsModal();
                }}
                leftIcon={<Icon icon="mdi:close" width={20} height={20} />}
                fullWidth
              >
                Reject Request
              </Button>
            </div>
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
          confirmButtonText={
            isSubmitting
              ? "Processing..."
              : responseType === "accept"
              ? "Accept Client"
              : "Reject Request"
          }
          cancelButtonText="Cancel"
          onConfirm={handleResponseSubmit}
          primaryButtonAction={handleResponseSubmit}
          secondaryButtonAction={handleCloseModal}
          confirmButtonDisabled={isSubmitting}
        >
          <div className="space-y-6">
            {/* Client Profile Summary */}
            <div className="flex items-center gap-4 bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
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
                    {new Date().getFullYear() -
                      new Date(
                        selectedRequest.client.clientProfile.dateOfBirth
                      ).getFullYear()}{" "}
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
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
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
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
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
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
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
              <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
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
                <p className="text-zinc-300 text-sm italic bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  "{selectedRequest.note}"
                </p>
              </div>
            )}

            {/* Medical Information Alert */}
            {(selectedRequest.client.clientProfile.medicalConditions ||
              selectedRequest.client.clientProfile.allergies) && (
              <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30">
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
              <div className="bg-green-900/20 border border-green-700 rounded-xl p-4">
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
              <div className="space-y-3">
                <div className="bg-red-900/20 border border-red-700 rounded-xl p-4">
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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Reason for rejection (optional)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Currently at capacity, not a good fit for specialization, etc."
                    className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-3 text-white placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none transition-colors"
                    rows="3"
                    maxLength={200}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    {rejectionReason.length}/200 characters
                  </p>
                </div>
              </div>
            )}
            {responseError && (
              <div className="text-center text-red-400 py-2">
                {responseError}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
