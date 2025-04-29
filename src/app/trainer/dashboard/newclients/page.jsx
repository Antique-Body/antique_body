"use client";
import { useState } from "react";

const NewClientsPage = () => {
    // Sample data for demo purposes
    const newClients = [
        {
            id: 1,
            name: "Emma Roberts",
            requestDate: "Apr 8, 2025",
            goals: "Build muscle, improve conditioning",
            notes: "Looking for 2 sessions per week",
            plan: "Pro Athlete",
            location: "New York, NY",
            preference: "In-person training",
            weight: "145 lbs",
            height: "5'7\"",
        },
        {
            id: 2,
            name: "David Wang",
            requestDate: "Apr 7, 2025",
            goals: "Weight loss, general fitness",
            notes: "Needs flexible scheduling",
            plan: "Fat Loss",
            location: "Boston, MA",
            preference: "Virtual sessions",
            weight: "210 lbs",
            height: "5'9\"",
        },
        {
            id: 3,
            name: "Aisha Johnson",
            requestDate: "Apr 5, 2025",
            goals: "Rehab for knee injury",
            notes: "Previously worked with physical therapist",
            plan: "Recovery",
            location: "Chicago, IL",
            preference: "Hybrid training",
            weight: "132 lbs",
            height: "5'4\"",
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");

    // Filter new clients based on search
    const filteredClients = newClients.filter(
        client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.goals.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Client Requests</h2>
                <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-[rgba(30,30,30,0.8)] border border-[#333] rounded-lg px-4 py-2 text-white w-full max-w-xs focus:outline-none focus:border-[#FF6B00]"
                />
            </div>

            <div className="space-y-4">
                {filteredClients.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No new client requests</p>
                    </div>
                ) : (
                    filteredClients.map(client => (
                        <div
                            key={client.id}
                            className="bg-[rgba(20,20,20,0.9)] rounded-lg overflow-hidden border border-[#333] hover:border-[#FF6B00] transition-all duration-300"
                        >
                            {/* Header with name and actions */}
                            <div className="flex justify-between items-center bg-[rgba(30,30,30,0.9)] px-4 py-2 border-b border-[#333]">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{client.name}</h3>
                                    <span className="text-xs text-gray-400">({client.requestDate})</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="text-white/80 hover:text-white text-xs border border-[#444] px-2 py-1 rounded hover:border-[#666] transition">
                                        Message
                                    </button>
                                    <button className="bg-[#FF6B00] text-white text-xs px-2 py-1 rounded hover:bg-[#FF8A00] transition">
                                        Accept
                                    </button>
                                </div>
                            </div>

                            {/* Main content - more compact */}
                            <div className="p-3">
                                <div className="flex mb-2">
                                    <div className="w-full">
                                        <span className="text-xs text-white/60">Goals:</span>
                                        <span className="text-sm ml-1">{client.goals}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                        <span className="text-white/60">Plan:</span>
                                        <span className="ml-1">{client.plan}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60">Location:</span>
                                        <span className="ml-1">{client.location}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60">Preference:</span>
                                        <span className="ml-1">{client.preference}</span>
                                    </div>
                                </div>

                                <div className="flex mt-2 pt-2 border-t border-[#333]/50 text-xs">
                                    <div className="flex-1">
                                        <span className="text-white/60">Stats:</span>
                                        <span className="ml-1">
                                            {client.height} / {client.weight}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-white/60">Notes:</span>
                                        <span className="ml-1 italic">{client.notes}</span>
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

export default NewClientsPage;
