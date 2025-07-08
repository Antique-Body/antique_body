"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { FormField } from "@/components/common/FormField";

export default function RequestCoachingModal({
  isOpen,
  onClose,
  trainer,
  onSubmitRequest,
  onSubmitMessage,
  hasRequested = false,
  canRequestMore = true,
  requestedCount = 0,
  maxRequests = 5,
}) {
  const [activeTab, setActiveTab] = useState("request");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    if (activeTab === "request") {
      await handleSubmitRequest();
    } else {
      onSubmitMessage(trainer, message);
    }
  };

  const handleSubmitRequest = async () => {
    if (hasRequested || !canRequestMore || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/coaching-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainerId: trainer.id,
          note: note.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      // Call the parent callback for UI updates
      onSubmitRequest(trainer, note);

      // Refresh badge counts
      if (window.refreshClientBadges) {
        window.refreshClientBadges();
      }

      // Clear inputs and close modal
      setNote("");
      onClose();
    } catch (error) {
      console.error("Error submitting coaching request:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNote("");
    setMessage("");
    setSubmitError("");
    onClose();
  };

  const isSubmitDisabled = () => {
    if (activeTab === "request") {
      return hasRequested || !canRequestMore || isSubmitting;
    } else {
      return true; // Messaging is completely disabled
    }
  };

  const getRequestButtonText = () => {
    if (activeTab === "message") {
      return "Feature Disabled";
    }
    if (isSubmitting) {
      return "Sending...";
    }
    if (hasRequested) {
      return "Already Requested";
    }
    if (!canRequestMore) {
      return "Limit Reached";
    }
    return "Send Request";
  };

  if (!trainer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon={
              activeTab === "request"
                ? "mdi:account-multiple"
                : "mdi:message-text"
            }
            width={18}
            height={18}
            className="text-[#3E92CC]"
          />
          {activeTab === "request" ? "Request Coaching" : "Send Message"}
        </div>
      }
      confirmButtonText={
        activeTab === "request" ? getRequestButtonText() : "Send Message"
      }
      cancelButtonText="Cancel"
      onConfirm={handleSubmit}
      primaryButtonAction={handleSubmit}
      secondaryButtonAction={handleClose}
      confirmButtonDisabled={isSubmitDisabled()}
    >
      {/* Enhanced Trainer Info Card */}
      <div className="mb-6 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 p-4">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-[#3E92CC]/20">
            {trainer.profileImage ? (
              <Image
                src={trainer.profileImage}
                alt={`${trainer.firstName} profile`}
                className="object-cover"
                width={80}
                height={80}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                <Icon icon="mdi:account" width={40} height={40} color="white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">
              {trainer.firstName} {trainer.lastName || ""}
            </h3>
            <p className="text-[#3E92CC] font-medium mb-2">
              {trainer.specialties?.map((s) => s.name).join(", ")}
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              {trainer.trainerInfo?.rating && (
                <div className="flex items-center gap-1">
                  <Icon
                    icon="mdi:star"
                    className="text-yellow-400"
                    width={16}
                    height={16}
                  />
                  <span>{trainer.trainerInfo.rating.toFixed(1)}</span>
                </div>
              )}
              {trainer.location && (
                <div className="flex items-center gap-1">
                  <Icon
                    icon="mdi:map-marker"
                    className="text-zinc-400"
                    width={16}
                    height={16}
                  />
                  <span>{trainer.location.city}</span>
                </div>
              )}
              {trainer.pricePerSession && (
                <div className="flex items-center gap-1">
                  <Icon
                    icon="mdi:currency-usd"
                    className="text-green-400"
                    width={16}
                    height={16}
                  />
                  <span>${trainer.pricePerSession}/session</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg bg-zinc-800/50 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("request")}
            className={`flex-1 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "request"
                ? "bg-[#3E92CC] text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            <Icon
              icon="mdi:account-multiple"
              className="mr-2 inline"
              width={16}
              height={16}
            />
            Request Coaching
          </button>
          <button
            type="button"
            onClick={() => {}} // Completely disable click
            disabled={true}
            className="flex-1 rounded-md px-4 py-3 text-sm font-medium opacity-40 cursor-not-allowed bg-zinc-800/50 text-zinc-500"
          >
            <Icon
              icon="mdi:message-text-off"
              className="mr-2 inline"
              width={16}
              height={16}
            />
            Send Message
            <span className="ml-1 text-xs">(Disabled)</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 rounded-lg bg-red-900/20 border border-red-700 p-3">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-400"
              width={16}
              height={16}
            />
            <p className="text-red-400 text-sm font-medium">{submitError}</p>
          </div>
        </div>
      )}

      {/* Request Tab Content */}
      {activeTab === "request" && (
        <div className="space-y-4">
          {/* Request Limit Banner */}
          <InfoBanner
            icon="mdi:account-multiple"
            title={`Requests: ${requestedCount}/${maxRequests}`}
            subtitle={
              !canRequestMore
                ? "You've reached the maximum number of trainer requests. You can remove existing requests to add new ones."
                : hasRequested
                ? "You have already requested this trainer. They will respond soon."
                : `You can request ${
                    maxRequests - requestedCount
                  } more trainers.`
            }
            variant={
              !canRequestMore ? "primary" : hasRequested ? "success" : "info"
            }
          />

          {hasRequested ? (
            <div className="rounded-lg bg-green-900/20 border border-green-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-400"
                  width={20}
                  height={20}
                />
                <p className="text-green-400 font-medium">
                  Request Already Sent
                </p>
              </div>
              <p className="text-sm text-green-300">
                You have already requested this trainer. They will respond soon.
              </p>
            </div>
          ) : !canRequestMore ? (
            <div className="rounded-lg bg-orange-900/20 border border-orange-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  icon="mdi:alert-circle"
                  className="text-orange-400"
                  width={20}
                  height={20}
                />
                <p className="text-orange-400 font-medium">
                  Request Limit Reached
                </p>
              </div>
              <p className="text-sm text-orange-300">
                You've reached the maximum of {maxRequests} trainer requests.
                Remove some existing requests to add new ones.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-blue-900/20 border border-blue-700 p-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:information"
                    className="text-[#3E92CC] mt-0.5"
                    width={20}
                    height={20}
                  />
                  <div>
                    <p className="text-white font-medium mb-1">
                      What happens next?
                    </p>
                    <p className="text-sm text-zinc-300">
                      {trainer.firstName} will receive your request and can
                      accept or decline. If accepted, they'll be able to create
                      personalized workout plans and provide ongoing guidance
                      for your fitness journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <FormField
                type="textarea"
                id="coaching-request-note"
                name="note"
                label={`Tell ${trainer.firstName} about yourself (optional)`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your fitness goals, experience level, any injuries or limitations, preferred workout style, or what you hope to achieve..."
                rows={5}
                maxLength={500}
                disabled={isSubmitting}
                subLabel={`This helps ${trainer.firstName} understand your needs better`}
                className="mb-0"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-zinc-500">
                  {note.length}/500 characters
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Message Tab Content */}
      {activeTab === "message" && (
        <div className="space-y-4">
          <InfoBanner
            icon="mdi:message-text-outline"
            title="Messaging Feature Coming Soon"
            subtitle="Direct messaging with trainers will be available in a future update. For now, you can request coaching to get started with your fitness journey."
            variant="success"
          />

          <div className="rounded-lg bg-zinc-800/50 border border-zinc-700 p-4">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:chat-outline"
                className="text-zinc-400 mt-0.5"
                width={20}
                height={20}
              />
              <div>
                <p className="text-white font-medium mb-1">
                  Feature in Development
                </p>
                <p className="text-sm text-zinc-300">
                  We're working on adding direct messaging capabilities. In the
                  meantime, you can request coaching from {trainer.firstName} to
                  start your fitness journey together.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Your message to {trainer.firstName} (Coming Soon)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="This feature will be available soon. For now, please use the Request Coaching tab to get started."
              className="w-full rounded-lg bg-zinc-800/50 border border-zinc-600 px-3 py-3 text-zinc-400 placeholder-zinc-500 resize-none transition-colors cursor-not-allowed"
              rows="6"
              maxLength={1000}
              disabled={true}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-zinc-500">Feature coming soon</p>
              <p className="text-xs text-zinc-400">
                Use Request Coaching instead
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
