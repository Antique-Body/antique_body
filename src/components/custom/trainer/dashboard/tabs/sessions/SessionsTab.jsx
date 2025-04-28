import { useState } from "react";

export const SessionsTab = ({ sessions, handleViewSession }) => {
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterPaid, setFilterPaid] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter and search functionality
    const filteredSessions = sessions.filter((session) => {
        const matchesSearch =
            session.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.focus.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType ? session.type === filterType : true;
        const matchesStatus = filterStatus ? session.status === filterStatus : true;
        const matchesPaid = filterPaid === "" ? true : filterPaid === "paid" ? session.paid : !session.paid;

        return matchesSearch && matchesType && matchesStatus && matchesPaid;
    });

    // Sort sessions by date (most recent first)
    const sortedSessions = [...filteredSessions].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Sessions</h2>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Types</option>
                    <option value="In-person">In-person</option>
                    <option value="Virtual">Virtual</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                </select>
                <select
                    value={filterPaid}
                    onChange={(e) => setFilterPaid(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Payment</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                </select>
            </div>

            {/* Add new session button */}
            <div className="mb-6">
                <button className="bg-[#FF6B00] text-white py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#FF9A00]">
                    Schedule New Session
                </button>
            </div>

            {/* Sessions list */}
            <div className="space-y-4">
                {sortedSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No sessions match your filters</p>
                    </div>
                ) : (
                    sortedSessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00]"
                        >
                            <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">{session.clientName}</h3>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs ${
                                                session.status === "confirmed"
                                                    ? "bg-green-900 text-green-200"
                                                    : session.status === "pending"
                                                    ? "bg-yellow-900 text-yellow-200"
                                                    : "bg-red-900 text-red-200"
                                            }`}
                                        >
                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs ${
                                                session.paid ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                                            }`}
                                        >
                                            {session.paid ? "Paid" : "Unpaid"}
                                        </span>
                                    </div>
                                    <div className="mt-1 text-gray-400 text-sm">
                                        {session.date} • {session.time} • {session.type} • {session.location}
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm">{session.focus}</p>
                                        {session.notes && <p className="text-xs text-gray-400 mt-1">Notes: {session.notes}</p>}
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-0 flex gap-2">
                                    <button
                                        onClick={() => handleViewSession(session)}
                                        className="bg-[#FF6B00] text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 hover:bg-[#FF9A00]"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
