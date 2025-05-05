"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";
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
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.goals.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="px-4 py-6">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">New Client Requests</h2>
                <FormField
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-0 w-full max-w-xs"
                    backgroundStyle="semi-transparent"
                />
            </div>

            <div className="space-y-5">
                {filteredClients.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-gray-400">No new client requests</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <Card key={client.id} variant="entityCard" width="100%" maxWidth="100%" className="overflow-hidden">
                            {/* Card content goes here */}
                            <div className="flex-1">
                                {/* Header with name and date */}
                                <div className="-mx-5 -mt-5 mb-4 flex items-center justify-between border-b border-[#333] bg-[rgba(30,30,30,0.9)] px-5 py-3">
                                    <div>
                                        <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-[#FF6B00]">
                                            {client.name}
                                        </h3>
                                        <p className="text-xs text-gray-400">Requested: {client.requestDate}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="subtle"
                                            size="small"
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5"
                                        >
                                            Message
                                        </Button>
                                        <Button
                                            variant="orangeFilled"
                                            size="small"
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
                                        >
                                            Accept
                                        </Button>
                                    </div>
                                </div>

                                {/* Primary info section */}
                                <div className="mb-4 border-b border-[#333] pb-4">
                                    <h4 className="mb-2 text-sm font-semibold text-white/90">Training Goals</h4>
                                    <p className="rounded bg-[rgba(40,40,40,0.7)] px-3 py-2 text-sm">{client.goals}</p>
                                </div>

                                {/* Client details in grid */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Preferred Plan</h4>
                                        <p className="text-sm font-medium">{client.plan}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Location</h4>
                                        <p className="text-sm font-medium">{client.location}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Training Preference</h4>
                                        <p className="text-sm font-medium">{client.preference}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Physical Stats</h4>
                                        <p className="text-sm font-medium">
                                            {client.height} / {client.weight}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes section */}
                                <div className="mt-4 border-t border-[#333] pt-4">
                                    <h4 className="mb-1 text-xs text-white/60">Additional Notes</h4>
                                    <p className="text-sm italic text-white/80">{client.notes}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewClientsPage;
