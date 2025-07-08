"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { Modal } from "@/components/common/Modal";

export default function UnrequestConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  trainer,
  cooldownHours = 24,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error unrequesting trainer:", error);
      setError("Failed to remove request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!trainer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Coaching Request"
      primaryButtonText={isSubmitting ? "Removing..." : "Remove Request"}
      secondaryButtonText="Cancel"
      primaryButtonAction={handleConfirm}
      secondaryButtonAction={onClose}
      primaryButtonDisabled={isSubmitting}
      size="small"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-900/20 border border-red-700/30 p-3 flex items-center gap-2">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-400"
              width={18}
              height={18}
            />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-400 flex-shrink-0"
            width={24}
            height={24}
          />
          <div>
            <p className="text-red-400 font-medium mb-1">Important Notice</p>
            <p className="text-sm text-red-300">
              After removing this request, you won't be able to request this
              trainer again for the next {cooldownHours} hour
              {cooldownHours === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white font-medium">
            Are you sure you want to remove your coaching request from{" "}
            <span className="text-[#3E92CC]">
              {trainer.firstName} {trainer.lastName || ""}
            </span>
            ?
          </p>

          <div className="bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
            <p className="text-sm text-zinc-300">
              <strong>What happens next:</strong>
            </p>
            <ul className="text-sm text-zinc-400 mt-2 space-y-1">
              <li className="flex items-start gap-2">
                <Icon
                  icon="mdi:clock-outline"
                  className="text-zinc-500 mt-0.5 flex-shrink-0"
                  width={14}
                  height={14}
                />
                <span>{cooldownHours}-hour cooldown period begins</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  icon="mdi:account-remove"
                  className="text-zinc-500 mt-0.5 flex-shrink-0"
                  width={14}
                  height={14}
                />
                <span>Request will be permanently removed</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon
                  icon="mdi:lock"
                  className="text-zinc-500 mt-0.5 flex-shrink-0"
                  width={14}
                  height={14}
                />
                <span>
                  You cannot request this trainer again until cooldown expires
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
