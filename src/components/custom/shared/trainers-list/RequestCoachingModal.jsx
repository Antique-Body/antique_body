"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Modal } from "@/components/common/Modal";
import { useCurrentUser } from "@/hooks";
import { generateChatId } from "@/utils/chatUtils";

export default function RequestCoachingModal({
  isOpen,
  onClose,
  trainer,
  onSubmitRequest,
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
  const [messageStatus, setMessageStatus] = useState(""); // "sending", "sent", "error"
  
  const { getClientId, getRole, loading: userLoading } = useCurrentUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (activeTab === "request") {
      await handleSubmitRequest();
    } else {
      await handleSubmitMessage();
    }
  };

  const handleSubmitMessage = async () => {
    if (!message.trim() || isSubmitting || userLoading) return;

    setIsSubmitting(true);
    setMessageStatus("sending");
    setSubmitError("");

    try {
      const role = getRole();
      const clientId = getClientId();

      if (role !== "client" || !clientId || !trainer?.id) {
        throw new Error("Unable to send message. Please try again.");
      }

      // Generate chat ID
      const chatId = generateChatId(trainer.id, clientId);

      // Send the message (this will create the conversation automatically)
      const response = await fetch(`/api/messages/direct/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setMessageStatus("sent");
      setMessage("");
      
      // Redirect to the chat after a brief delay to show success feedback
      setTimeout(() => {
        setMessageStatus("");
        onClose();
        // Navigate to the messages page with the chat ID
        router.push(`/client/dashboard/messages/${encodeURIComponent(chatId)}`);
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitError(error.message);
      setMessageStatus("error");
    } finally {
      setIsSubmitting(false);
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
      onSubmitRequest(trainer);

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
    setMessageStatus("");
    onClose();
  };

  const isSubmitDisabled = () => {
    if (activeTab === "request") {
      return hasRequested || !canRequestMore || isSubmitting;
    } else {
      return !message.trim() || isSubmitting || userLoading;
    }
  };

  const getRequestButtonText = () => {
    if (activeTab === "message") {
      if (messageStatus === "sending") return "Sending...";
      if (messageStatus === "sent") return "Message Sent!";
      if (isSubmitting) return "Sending...";
      return "Send Message";
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
      <div className="mb-6 rounded-lg bg-gradient-to-br from-zinc-800/90 via-zinc-900/95 to-black p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:ring-[#3E92CC]/20">
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 transform overflow-hidden rounded-2xl ring-2 ring-[#3E92CC]/30 transition-all duration-300 hover:scale-105 hover:ring-[#3E92CC]/50">
            {trainer.profileImage ? (
              <Image
                src={trainer.profileImage}
                alt={`${trainer.firstName} profile`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                width={96}
                height={96}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] via-[#2D7EB8] to-[#1A4B6D]">
                <Icon
                  icon="mdi:account"
                  width={48}
                  height={48}
                  className="text-white/90"
                />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold text-white">
              {trainer.firstName} {trainer.lastName || ""}
            </h3>
            <p className="inline-flex items-center rounded-full bg-[#3E92CC]/10 px-3 py-1 text-sm font-medium text-[#3E92CC]">
              {trainer.specialties?.map((s) => s.name).join(", ")}
            </p>
            <div className="flex items-center gap-4 text-sm">
              {trainer.trainerInfo?.rating && (
                <div className="flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1">
                  <Icon
                    icon="mdi:star"
                    className="text-yellow-400"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium text-yellow-400">
                    {trainer.trainerInfo.rating.toFixed(1)}
                  </span>
                </div>
              )}
              {trainer.location && (
                <div className="flex items-center gap-2 rounded-full bg-zinc-700/30 px-3 py-1">
                  <Icon
                    icon="mdi:map-marker"
                    className="text-zinc-400"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium text-zinc-400">
                    {trainer.location.city}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-2 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-1.5 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("request")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "request"
                ? "bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8] text-white shadow-lg shadow-[#3E92CC]/20"
                : "text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
            }`}
          >
            <Icon
              icon="mdi:account-multiple"
              className="transition-transform duration-300 group-hover:scale-110"
              width={18}
              height={18}
            />
            Request Coaching
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("message")}
            disabled={false}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "message"
                ? "bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8] text-white shadow-lg shadow-[#3E92CC]/20"
                : "text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
            }`}
          >
            <Icon icon="mdi:message-text" width={18} height={18} />
            Send Message
          </button>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-4 animate-fadeIn rounded-lg bg-gradient-to-br from-red-900/20 to-red-950/30 p-4 ring-1 ring-red-500/30">
          <div className="flex items-center gap-3">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-400"
              width={20}
              height={20}
            />
            <p className="text-red-400 text-sm font-medium">{submitError}</p>
          </div>
        </div>
      )}

      {/* Request Tab Content */}
      {activeTab === "request" && (
        <div className="space-y-5">
          {/* Request Limit Banner */}
          <div
            className={`rounded-xl bg-gradient-to-br p-4 ring-1 transition-all duration-300 ${
              !canRequestMore
                ? "from-orange-900/20 to-orange-950/30 ring-orange-500/30"
                : hasRequested
                  ? "from-green-900/20 to-green-950/30 ring-green-500/30"
                  : "from-blue-900/20 to-blue-950/30 ring-blue-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`rounded-full p-2 ${
                  !canRequestMore
                    ? "bg-orange-500/10"
                    : hasRequested
                      ? "bg-green-500/10"
                      : "bg-blue-500/10"
                }`}
              >
                <Icon
                  icon="mdi:account-multiple"
                  className={
                    !canRequestMore
                      ? "text-orange-400"
                      : hasRequested
                        ? "text-green-400"
                        : "text-blue-400"
                  }
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h4
                  className={`text-lg font-semibold ${
                    !canRequestMore
                      ? "text-orange-400"
                      : hasRequested
                        ? "text-green-400"
                        : "text-blue-400"
                  }`}
                >
                  Requests: {requestedCount}/{maxRequests}
                </h4>
                <p className="mt-1 text-sm text-zinc-300">
                  {!canRequestMore
                    ? "You've reached the maximum number of trainer requests. You can remove existing requests to add new ones."
                    : hasRequested
                      ? "You have already requested this trainer. They will respond soon."
                      : `You can request ${
                          maxRequests - requestedCount
                        } more trainers.`}
                </p>
              </div>
            </div>
          </div>

          {hasRequested ? (
            <div className="rounded-xl bg-gradient-to-br from-green-900/20 to-green-950/30 p-5 ring-1 ring-green-500/30">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <Icon
                    icon="mdi:check-circle"
                    className="text-green-400"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-green-400">
                    Request Already Sent
                  </p>
                  <p className="mt-1 text-sm text-green-300">
                    You have already requested this trainer. They will respond
                    soon.
                  </p>
                </div>
              </div>
            </div>
          ) : !canRequestMore ? (
            <div className="rounded-xl bg-gradient-to-br from-orange-900/20 to-orange-950/30 p-5 ring-1 ring-orange-500/30">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-orange-500/10 p-2">
                  <Icon
                    icon="mdi:alert-circle"
                    className="text-orange-400"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold text-orange-400">
                    Request Limit Reached
                  </p>
                  <p className="mt-1 text-sm text-orange-300">
                    You've reached the maximum of {maxRequests} trainer
                    requests. Remove some existing requests to add new ones.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-gradient-to-br from-[#3E92CC]/10 to-[#2D7EB8]/5 p-5 ring-1 ring-[#3E92CC]/20">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#3E92CC]/10 p-2">
                    <Icon
                      icon="mdi:information"
                      className="text-[#3E92CC]"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      What happens next?
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {trainer.firstName} will receive your request and can
                      accept or decline. If accepted, they'll be able to create
                      personalized workout plans and provide ongoing guidance
                      for your fitness journey.
                    </p>
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-3">
                <label
                  htmlFor="coaching-request-note"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Tell {trainer.firstName} about yourself
                  <span className="ml-1 text-zinc-500">(optional)</span>
                </label>
                <textarea
                  id="coaching-request-note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share your fitness goals, experience level, any injuries or limitations, preferred workout style, or what you hope to achieve..."
                  rows={5}
                  maxLength={500}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 px-4 py-3 text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 transition-all duration-300 focus:outline-none focus:ring-[#3E92CC]/30 disabled:opacity-50"
                />
                <p className="text-sm text-zinc-500">
                  This helps {trainer.firstName} understand your needs better
                </p>
                <div className="flex justify-end">
                  <span className="text-xs text-zinc-500">
                    {note.length}/500 characters
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Message Tab Content */}
      {activeTab === "message" && (
        <div className="space-y-5">
          {/* Success Message */}
          {messageStatus === "sent" && (
            <div className="rounded-xl bg-gradient-to-br from-green-900/20 to-green-950/30 p-4 ring-1 ring-green-500/30">
              <div className="flex items-center gap-3">
                <Icon
                  icon="mdi:check-circle"
                  className="text-green-400"
                  width={20}
                  height={20}
                />
                <p className="text-green-400 text-sm font-medium">
                  Message sent successfully! Redirecting to your conversation...
                </p>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="rounded-xl bg-gradient-to-br from-[#3E92CC]/10 to-[#2D7EB8]/5 p-5 ring-1 ring-[#3E92CC]/20">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#3E92CC]/10 p-2">
                <Icon
                  icon="mdi:information"
                  className="text-[#3E92CC]"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  Send a direct message
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Start a conversation with {trainer.firstName} by sending them a message. 
                  This will create a new conversation that you can continue in your messages.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="coaching-message"
              className="block text-sm font-medium text-zinc-300"
            >
              Your message to {trainer.firstName}
            </label>
            <textarea
              id="coaching-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, ask questions about their training style, or share your fitness goals..."
              className="w-full rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 px-4 py-3 text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 transition-all duration-300 focus:outline-none focus:ring-[#3E92CC]/30 disabled:opacity-50"
              rows="6"
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">
                {message.length}/1000 characters
              </span>
              <span className="text-zinc-400">
                Message will create a new conversation
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
