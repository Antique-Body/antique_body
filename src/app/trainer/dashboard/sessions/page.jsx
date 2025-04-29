"use client";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components";
import { useState } from "react";

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

    return (
        <div className="px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold mb-4 md:mb-0">Upcoming Sessions</h2>

                <button
                    onClick={openNewSessionModal}
                    className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF8A00] flex items-center gap-2"
                >
                    <span className="text-xl">+</span> New Session
                </button>
            </div>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                </select>
                <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Types</option>
                    <option value="In-person">In-person</option>
                    <option value="Virtual">Virtual</option>
                </select>
            </div>

            {/* Sessions list */}
            <div className="space-y-4">
                {filteredSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No sessions match your filters</p>
                    </div>
                ) : (
                    filteredSessions.map(session => (
                        <div
                            key={session.id}
                            className="bg-[rgba(20,20,20,0.9)] rounded-xl overflow-hidden border border-[#333] hover:border-[#FF6B00] transition-all duration-300"
                        >
                            {/* Session header */}
                            <div className="flex flex-col md:flex-row justify-between bg-[rgba(30,30,30,0.9)] px-5 py-3">
                                <div className="mb-3 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold">{session.clientName}</h3>
                                        <span
                                            className={`px-2 py-0.5 rounded text-xs ${
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
                                    <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                        <span>{session.date}</span>
                                        <span>•</span>
                                        <span>{session.time}</span>
                                        <span>•</span>
                                        <span>{session.type}</span>
                                        {session.paid ? (
                                            <span className="text-green-400 text-xs">Paid</span>
                                        ) : (
                                            <span className="text-yellow-400 text-xs">Not Paid</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => toggleExpand(session.id)}
                                        className="text-white/80 hover:text-white text-sm border border-[#444] px-3 py-1.5 rounded-md hover:border-[#666] transition"
                                    >
                                        {expandedSessionId === session.id ? "Less" : "Details"}
                                    </button>
                                    <button
                                        onClick={() => openManageSessionModal(session)}
                                        className="bg-[#FF6B00] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#FF8A00] transition"
                                    >
                                        Manage
                                    </button>
                                </div>
                            </div>

                            {/* Expanded session information */}
                            {expandedSessionId === session.id && (
                                <div className="p-5 bg-[rgba(30,30,30,0.5)] border-t border-[#333]">
                                    <h4 className="text-sm font-semibold text-white/90 mb-2">Session Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-white/60 mb-1">Location</p>
                                            <p className="text-sm">{session.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/60 mb-1">Focus</p>
                                            <p className="text-sm">{session.focus}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/60 mb-1">Notes</p>
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
