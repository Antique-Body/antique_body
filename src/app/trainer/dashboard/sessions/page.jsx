"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components";
import { FormField } from "@/components/shared/FormField";

const SessionsPage = () => {
  // Sample data
  const sessions = [
    {
      id: 1,
      clientName: "John Doe",
      clientId: 1,
      date: "Apr 12, 2025",
      time: "10:00 - 11:00",
      type: "In-person",
      location: "City Fitness Center",
      status: "confirmed",
      paid: true,
      focus: "Lower body power & mobility",
      notes: "Bring resistance bands",
    },
    {
      id: 2,
      clientName: "Sarah Williams",
      clientId: 2,
      date: "Apr 10, 2025",
      time: "14:00 - 15:00",
      type: "In-person",
      location: "Rehab Center",
      status: "confirmed",
      paid: true,
      focus: "Knee rehabilitation exercises",
      notes: "Foam roller needed",
    },
    {
      id: 3,
      clientName: "Mike Chen",
      clientId: 3,
      date: "Apr 9, 2025",
      time: "18:30 - 19:30",
      type: "Virtual",
      location: "Zoom",
      status: "confirmed",
      paid: false,
      focus: "HIIT workout & nutrition review",
      notes: "Check food diary before session",
    },
    {
      id: 4,
      clientName: "New Client",
      clientId: null,
      date: "Apr 11, 2025",
      time: "09:00 - 10:00",
      type: "In-person",
      location: "City Fitness Center",
      status: "pending",
      paid: false,
      focus: "Initial assessment",
      notes: "First session - evaluation and goal setting",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Filter and search functionality
  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.focus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? session.status === filterStatus : true;
    const matchesType = filterType ? session.type === filterType : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpand = sessionId => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  const openNewSessionModal = () => {
    setSelectedSession(null);
    setModalOpen(true);
  };

  const openManageSessionModal = session => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "canceled", label: "Canceled" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
  ];

  return (
    <div className="px-4 py-6">
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <h2 className="mb-4 text-xl font-bold md:mb-0">Upcoming Sessions</h2>

        <Button variant="orangeFilled" onClick={openNewSessionModal} leftIcon={<span className="text-xl">+</span>}>
          New Session
        </Button>
      </div>

      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <FormField
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>
        <FormField
          type="select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          options={statusOptions}
          className="mb-0 min-w-[150px]"
        />
        <FormField
          type="select"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          options={typeOptions}
          className="mb-0 min-w-[150px]"
        />
      </div>

      {/* Sessions list */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400">No sessions match your filters</p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div
              key={session.id}
              className="overflow-hidden rounded-xl border border-[#333] bg-[rgba(20,20,20,0.9)] transition-all duration-300 hover:border-[#FF6B00]"
            >
              {/* Session header */}
              <div className="flex flex-col justify-between bg-[rgba(30,30,30,0.9)] px-5 py-3 md:flex-row">
                <div className="mb-3 md:mb-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{session.clientName}</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        session.status === "confirmed"
                          ? "bg-green-900/60 text-green-200"
                          : session.status === "pending"
                            ? "bg-yellow-900/60 text-yellow-200"
                            : "bg-red-900/60 text-red-200"
                      }`}
                    >
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                    <span>{session.date}</span>
                    <span>•</span>
                    <span>{session.time}</span>
                    <span>•</span>
                    <span>{session.type}</span>
                    {session.paid ? (
                      <span className="text-xs text-green-400">Paid</span>
                    ) : (
                      <span className="text-xs text-yellow-400">Not Paid</span>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="subtle" size="small" onClick={() => toggleExpand(session.id)}>
                    {expandedSessionId === session.id ? "Less" : "Details"}
                  </Button>
                  <Button variant="orangeFilled" size="small" onClick={() => openManageSessionModal(session)}>
                    Manage
                  </Button>
                </div>
              </div>

              {/* Expanded session information */}
              {expandedSessionId === session.id && (
                <div className="border-t border-[#333] bg-[rgba(30,30,30,0.5)] p-5">
                  <h4 className="mb-2 text-sm font-semibold text-white/90">Session Details</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-xs text-white/60">Location</p>
                      <p className="text-sm">{session.location}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-white/60">Focus</p>
                      <p className="text-sm">{session.focus}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-white/60">Notes</p>
                      <p className="text-sm">{session.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Only render the modal when modalOpen is true */}
      {modalOpen && <ScheduleSessionModal isOpen={modalOpen} onClose={closeModal} session={selectedSession} />}
    </div>
  );
};

export default SessionsPage;
