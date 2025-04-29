"use client";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/shared";
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
                <FormField
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs mb-0"
                    backgroundStyle="semi-transparent"
                />
            </div>

            <div className="space-y-5">
                {filteredClients.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No new client requests</p>
                    </div>
                ) : (
                    filteredClients.map(client => (
                        <div
                            key={client.id}
                            className="bg-[rgba(20,20,20,0.9)] rounded-xl overflow-hidden border border-[#333] hover:border-[#FF6B00] transition-all duration-300"
                        >
                            {/* Header with name and date */}
                            <div className="flex justify-between items-center bg-[rgba(30,30,30,0.9)] px-5 py-3 border-b border-[#333]">
                                <div>
                                    <h3 className="text-lg font-semibold">{client.name}</h3>
                                    <p className="text-xs text-gray-400">Requested: {client.requestDate}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="subtle" size="small">
                                        Message
                                    </Button>
                                    <Button variant="orangeFilled" size="small">
                                        Accept
                                    </Button>
                                </div>
                            </div>

                            {/* Main content */}
                            <div className="p-5">
                                {/* Primary info section */}
                                <div className="mb-4 pb-4 border-b border-[#333]">
                                    <h4 className="text-sm font-semibold text-white/90 mb-2">Training Goals</h4>
                                    <p className="text-sm bg-[rgba(40,40,40,0.7)] px-3 py-2 rounded">{client.goals}</p>
                                </div>

                                {/* Client details in grid */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div>
                                        <h4 className="text-xs text-white/60 mb-1">Preferred Plan</h4>
                                        <p className="text-sm font-medium">{client.plan}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-white/60 mb-1">Location</h4>
                                        <p className="text-sm font-medium">{client.location}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-white/60 mb-1">Training Preference</h4>
                                        <p className="text-sm font-medium">{client.preference}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs text-white/60 mb-1">Physical Stats</h4>
                                        <p className="text-sm font-medium">
                                            {client.height} / {client.weight}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes section */}
                                <div className="mt-4 pt-4 border-t border-[#333]">
                                    <h4 className="text-xs text-white/60 mb-1">Additional Notes</h4>
                                    <p className="text-sm italic text-white/80">{client.notes}</p>
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
