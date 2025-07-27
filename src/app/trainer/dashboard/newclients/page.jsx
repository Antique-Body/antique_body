"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState, useContext } from "react";

import { BadgeContext } from "../layout";

import { InfoBanner } from "@/components/common/InfoBanner";
import {
  RequestCard,
  ClientDetailsModal,
  ProfileImageModal,
  ResponseModal,
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/custom/dashboard/trainer/pages/newclients/components";

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
    setResponseError("");
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

  return (
    <div className="px-4 py-5 max-w-7xl mx-auto">
      {/* Header with gradient underline */}
      <div className="mb-8 relative pb-2">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          New Client Requests
        </h1>
        <p className="text-zinc-400 max-w-2xl">
          Review and respond to coaching requests from potential clients. Accept
          requests to start working with new clients or reject if you're unable
          to take on more clients at this time.
        </p>
      </div>

      {/* Status Banner */}
      <div className="mb-6">
        <InfoBanner
          icon={
            coachingRequests.length > 0
              ? "mdi:account-multiple"
              : "mdi:account-alert"
          }
          title={`Pending Requests (${coachingRequests.length})`}
          subtitle={
            coachingRequests.length === 0
              ? "No pending coaching requests at the moment."
              : coachingRequests.length === 1
              ? "You have 1 pending coaching request to review."
              : `You have ${coachingRequests.length} pending coaching requests to review.`
          }
          variant={coachingRequests.length > 0 ? "primary" : "info"}
          buttonText={coachingRequests.length === 0 ? "Refresh" : null}
          onButtonClick={
            coachingRequests.length === 0 ? fetchCoachingRequests : null
          }
        />
      </div>

      {/* Coaching Requests */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={fetchCoachingRequests} />
      ) : coachingRequests.length > 0 ? (
        <div className="flex flex-col gap-4">
          {coachingRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewDetails={handleViewDetails}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onProfileImageClick={handleProfileImageClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Helpful tips section when there are no requests */}
      {!loading && !error && coachingRequests.length === 0 && (
        <div className="mt-8 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon
              icon="mdi:lightbulb-on"
              className="text-[#FF9A00]"
              width={20}
              height={20}
            />
            Tips to Attract More Clients
          </h3>
          <ul className="space-y-3 text-zinc-400">
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Complete your trainer profile with detailed information about
                your expertise and experience
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Add professional photos and certifications to build credibility
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Create sample training plans that showcase your coaching
                methodology
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-[#FF7800]/10 p-1.5 rounded-full mt-0.5">
                <Icon
                  icon="mdi:check"
                  className="text-[#FF7800]"
                  width={16}
                  height={16}
                />
              </div>
              <span>
                Share your profile link on social media to reach potential
                clients
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Profile Image Modal */}
      <ProfileImageModal
        isOpen={showProfileImage}
        onClose={() => setShowProfileImage(false)}
        profileImage={selectedProfileImage}
      />

      {/* Details Modal */}
      <ClientDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        clientDetails={selectedClientDetails}
        onProfileImageClick={handleProfileImageClick}
      />

      {/* Response Modal */}
      <ResponseModal
        isOpen={showResponseModal}
        onClose={handleCloseModal}
        selectedRequest={selectedRequest}
        responseType={responseType}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isSubmitting={isSubmitting}
        onSubmit={handleResponseSubmit}
        responseError={responseError}
      />
    </div>
  );
}
