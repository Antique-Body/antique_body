"use client";

import { useState } from "react";

import { MessageClientModal } from "./MessageClientModal";

import { Button } from "@/components/common/Button";
import { CalendarIcon, MessageIcon } from "@/components/common/Icons";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components";

export const ClientHeader = ({ client }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Format client type and sport for display
  const getClientTypeLabel = () => {
    let label = client.type.charAt(0).toUpperCase() + client.type.slice(1);
    if (client.sport) {
      label += ` (${client.sport.charAt(0).toUpperCase() + client.sport.slice(1)})`;
    }
    return label;
  };

  return (
    <>
      <div className="relative mb-6 rounded-xl border border-[#333] bg-[rgba(20,20,20,0.95)] p-6 backdrop-blur-sm">
        {/* Greek pattern top border */}

        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            {/* Client avatar/initials */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-xl font-bold text-white">
              {client.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-900 px-3 py-1 text-xs text-green-200">{client.status}</span>
                <span className="rounded-full bg-[rgba(255,107,0,0.2)] px-3 py-1 text-xs text-[#FF6B00]">
                  {client.plan}
                </span>
                <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-200">{getClientTypeLabel()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setShowMessageModal(true)} leftIcon={<MessageIcon size={16} />}>
              Message
            </Button>
            <Button
              variant="orangeFilled"
              onClick={() => setShowScheduleModal(true)}
              leftIcon={<CalendarIcon size={16} />}
            >
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Client summary stats */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.8)] p-3">
            <div className="mb-1 text-xs text-gray-400">Goal</div>
            <div className="font-medium">{client.goal}</div>
          </div>
          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.8)] p-3">
            <div className="mb-1 text-xs text-gray-400">Client Since</div>
            <div className="font-medium">{client.joinDate}</div>
          </div>
          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.8)] p-3">
            <div className="mb-1 text-xs text-gray-400">Next Session</div>
            <div className="font-medium">{client.nextSession}</div>
          </div>
          <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.8)] p-3">
            <div className="mb-1 text-xs text-gray-400">Total Sessions</div>
            <div className="font-medium">{client.progress?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Message modal */}
      {showMessageModal && (
        <MessageClientModal client={client} onClose={() => setShowMessageModal(false)} onSend={() => {}} />
      )}

      {/* Schedule session modal */}
      {showScheduleModal && (
        <ScheduleSessionModal client={client} onClose={() => setShowScheduleModal(false)} onSchedule={() => {}} />
      )}
    </>
  );
};
