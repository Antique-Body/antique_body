import { useState } from "react";

export const ClientsTab = ({
    clients,
    handleViewClient,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGoalType,
    setFilterGoalType,
}) => {
    const [expandedClientId, setExpandedClientId] = useState(null);

    // Filter and search functionality
    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? client.status === filterStatus : true;
        const matchesGoal = filterGoalType ? client.goal.includes(filterGoalType) : true;
        return matchesSearch && matchesStatus && matchesGoal;
    });

    const toggleExpand = (clientId) => {
        setExpandedClientId(expandedClientId === clientId ? null : clientId);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Clients</h2>

            {/* Search and filter controls */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                </select>
                <select
                    value={filterGoalType}
                    onChange={(e) => setFilterGoalType(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00]"
                >
                    <option value="">All Goals</option>
                    <option value="Strength">Strength</option>
                    <option value="Weight Management">Weight Management</option>
                    <option value="Rehabilitation">Rehabilitation</option>
                    <option value="Conditioning">Conditioning</option>
                </select>
            </div>

            {/* Client list */}
            <div className="space-y-4">
                {filteredClients.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No clients match your filters</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <div
                            key={client.id}
                            className="bg-[rgba(30,30,30,0.8)] p-4 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00]"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="mb-2 md:mb-0">
                                    <h3 className="text-lg font-semibold">{client.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs ${
                                                client.status === "active"
                                                    ? "bg-green-900 text-green-200"
                                                    : client.status === "paused"
                                                    ? "bg-yellow-900 text-yellow-200"
                                                    : "bg-red-900 text-red-200"
                                            }`}
                                        >
                                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                        </span>
                                        <span className="px-2 py-1 bg-[rgba(50,50,50,0.7)] rounded-md text-xs">
                                            {client.plan}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => toggleExpand(client.id)}
                                        className="bg-[rgba(40,40,40,0.7)] text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 hover:bg-[rgba(60,60,60,0.7)]"
                                    >
                                        {expandedClientId === client.id ? "Less" : "More"}
                                    </button>
                                    <button
                                        onClick={() => handleViewClient(client)}
                                        className="bg-[#FF6B00] text-white py-1 px-3 rounded-lg text-sm transition-all duration-300 hover:bg-[#FF9A00]"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Expanded client information */}
                            {expandedClientId === client.id && (
                                <div className="mt-4 pt-4 border-t border-[#333] grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Goal</p>
                                        <p className="text-sm">{client.goal}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Join Date</p>
                                        <p className="text-sm">{client.joinDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Next Session</p>
                                        <p className="text-sm">{client.nextSession}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
