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
      size="medium"
    >
      <div className="space-y-6 py-2">
        {error && (
          <div className="rounded-xl bg-red-900/20 border border-red-700/30 p-4 flex items-center gap-3">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-400"
              width={22}
              height={22}
            />
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        )}
        <div className="flex items-start gap-4 p-5 bg-red-900/20 border border-red-700/30 rounded-xl">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-400 flex-shrink-0"
            width={28}
            height={28}
          />
          <div>
            <p className="text-red-400 font-semibold text-lg mb-2">
              Important Notice
            </p>
            <p className="text-sm text-red-300 leading-relaxed">
              After removing this request, you won't be able to request this
              trainer again for the next {cooldownHours} hour
              {cooldownHours === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-white text-lg font-medium">
            Are you sure you want to remove your coaching request from{" "}
            <span className="text-[#3E92CC] font-semibold">
              {trainer.firstName} {trainer.lastName || ""}
            </span>
            ?
          </p>

          <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700/50">
            <p className="text-white font-medium text-base mb-4">
              What happens next:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="bg-zinc-700/50 p-2 rounded-lg">
                  <Icon
                    icon="mdi:clock-outline"
                    className="text-zinc-300"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-zinc-300 font-medium">
                  {cooldownHours}-hour cooldown period begins
                </span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="bg-zinc-700/50 p-2 rounded-lg">
                  <Icon
                    icon="mdi:account-remove"
                    className="text-zinc-300"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-zinc-300 font-medium">
                  Request will be permanently removed
                </span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                <div className="bg-zinc-700/50 p-2 rounded-lg">
                  <Icon
                    icon="mdi:lock"
                    className="text-zinc-300"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-zinc-300 font-medium">
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
