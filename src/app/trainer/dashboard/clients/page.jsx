"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ClientsPage = () => {
    // Sample data (in a real app, this would come from an API or context)
    const trainerData = {
        clients: [
            {
                id: 1,
                name: "John Doe",
                location: "Sarajevo",
                status: "active",
                plan: "Pro Athlete",
                goal: "Strength & Conditioning",
                joinDate: "Jan 15, 2025",
                nextSession: "Apr 12, 2025",
            },
            {
                id: 2,
                name: "Sarah Williams",
                location: "London",
                status: "active",
                plan: "Recovery",
                goal: "Rehabilitation",
                joinDate: "Feb 3, 2025",
                nextSession: "Apr 10, 2025",
            },
            {
                id: 3,
                name: "Mike Chen",
                location: "New York",
                status: "paused",
                plan: "Fat Loss",
                goal: "Weight Management",
                joinDate: "Dec 20, 2024",
                nextSession: "Apr 9, 2025",
            },
        ],
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterGoalType, setFilterGoalType] = useState("");
    const [expandedClientId, setExpandedClientId] = useState(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const router = useRouter();

    // Filter and search functionality
    const filteredClients = trainerData.clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? client.status === filterStatus : true;
        const matchesGoal = filterGoalType ? client.goal.includes(filterGoalType) : true;
        return matchesSearch && matchesStatus && matchesGoal;
    });

    const toggleExpand = clientId => {
        setExpandedClientId(expandedClientId === clientId ? null : clientId);
    };

    // Handle viewing client details
    const handleViewClient = client => {
        router.push(`/trainer/dashboard/clients/${client.id}`);
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
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                </select>
                <select
                    value={filterGoalType}
                    onChange={e => setFilterGoalType(e.target.value)}
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
                    filteredClients.map(client => (
                        <div
                            key={client.id}
                            onClick={() => handleViewClient(client)}
                            className="cursor-pointer bg-[rgba(30,30,30,0.85)] p-5 rounded-xl border border-[#333] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                                        {client.name
                                            .split(" ")
                                            .map(n => n[0])
                                            .join("")}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold group-hover:text-[#FF6B00] transition-colors">
                                            {client.name}
                                        </h3>
                                        <p className="text-sm text-gray-400">{client.location}</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs ${client.status === "active" ? "bg-green-900 text-green-200" : client.status === "paused" ? "bg-yellow-900 text-yellow-200" : "bg-red-900 text-red-200"}`}
                                            >
                                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                            </span>
                                            <span className="px-2 py-1 bg-[rgba(50,50,50,0.7)] rounded-md text-xs">
                                                {client.plan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-sm min-w-[180px]">
                                    <div>
                                        <span className="text-gray-400">Goal:</span> {client.goal}
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Next Session:</span> {client.nextSession}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientsPage;
