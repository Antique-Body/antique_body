import { useState } from "react";

export const NewClientsTab = () => {
    const [selectedClient, setSelectedClient] = useState(null);

    const clientRequests = [
        {
            id: 1,
            name: "Emma Rodriguez",
            initials: "ER",
            date: "Apr 3, 2025",
            city: "Barcelona, Spain",
            age: 28,
            height: "168 cm",
            weight: "72 kg",
            experience: "Beginner",
            goal: "Weight loss and strength building",
            sport: "General fitness",
            medicalNotes: "No injuries or health concerns",
            message:
                "I'm looking to get in better shape and build some muscle. I've never had a personal trainer before but I'm committed to making a change in my lifestyle.",
        },
        {
            id: 2,
            name: "Carlos Vega",
            initials: "CV",
            date: "Apr 5, 2025",
            city: "Madrid, Spain",
            age: 35,
            height: "182 cm",
            weight: "75 kg",
            experience: "Intermediate",
            goal: "Marathon preparation",
            sport: "Running",
            medicalNotes: "Previous knee injury (2023)",
            message:
                "I'm training for my second marathon and looking for a structured program. My first race didn't go as planned due to poor preparation, and I want to improve my time.",
        },
        {
            id: 3,
            name: "Aisha Johnson",
            initials: "AJ",
            date: "Apr 7, 2025",
            city: "Valencia, Spain",
            age: 22,
            height: "175 cm",
            weight: "68 kg",
            experience: "Advanced",
            goal: "Sports performance (basketball)",
            sport: "Basketball",
            medicalNotes: "No injuries",
            message:
                "I play semi-professional basketball and want to improve my vertical jump and agility. Looking for sport-specific training to complement my team practices.",
        },
        {
            id: 4,
            name: "Marco Rossi",
            initials: "MR",
            date: "Apr 8, 2025",
            city: "Milan, Italy",
            age: 42,
            height: "175 cm",
            weight: "81 kg",
            experience: "Beginner",
            goal: "Weight loss and improved mobility",
            sport: "Swimming",
            medicalNotes: "Lower back pain, mild hypertension",
            message:
                "After my doctor recommended I lose weight, I decided it's time to get serious about fitness. I enjoy swimming and would like to incorporate that into my routine.",
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Client List */}
                <div className="space-y-4">
                    <div className="bg-[rgba(20,20,20,0.9)] p-4 rounded-xl border border-[#333]">
                        <h3 className="text-lg font-semibold mb-3">Client Requests ({clientRequests.length})</h3>

                        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                            {clientRequests.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={`bg-[rgba(30,30,30,0.8)] p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:border-[#FF6B00] ${
                                        selectedClient?.id === client.id
                                            ? "border-[#FF6B00] shadow-[0_5px_15px_-5px_rgba(255,107,0,0.3)]"
                                            : "border-[#333]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold">
                                            {client.initials}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{client.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>{client.date}</span>
                                                <span>•</span>
                                                <span>{client.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-300 line-clamp-2">{client.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Client Details */}
                <div>
                    {selectedClient ? (
                        <div className="bg-[rgba(20,20,20,0.9)] p-5 rounded-xl border border-[#333] h-full">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex justify-center items-center text-white font-bold text-lg">
                                        {selectedClient.initials}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{selectedClient.name}</h3>
                                        <p className="text-gray-400 text-sm">Inquiry Date: {selectedClient.date}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-300 p-2 rounded-lg hover:bg-[rgba(255,107,0,0.1)]"
                                        title="Message client"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                        </svg>
                                    </button>
                                    <button
                                        className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-300 p-2 rounded-lg hover:bg-[rgba(255,107,0,0.1)]"
                                        title="Delete client"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-[rgba(30,30,30,0.7)] p-4 rounded-lg">
                                    <h4 className="text-[#FF6B00] font-medium mb-2">Client Message</h4>
                                    <p className="text-gray-300 text-sm">{selectedClient.message}</p>
                                </div>

                                <div className="bg-[rgba(30,30,30,0.7)] p-4 rounded-lg">
                                    <h4 className="text-[#FF6B00] font-medium mb-3">Client Profile</h4>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Location</span>
                                            <span className="font-medium">{selectedClient.city}</span>
                                        </div>
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Sport</span>
                                            <span className="font-medium">{selectedClient.sport}</span>
                                        </div>
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Experience</span>
                                            <span className="font-medium">{selectedClient.experience}</span>
                                        </div>
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Goal</span>
                                            <span className="font-medium line-clamp-2 text-xs">{selectedClient.goal}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Age</span>
                                            <span className="font-medium">{selectedClient.age}</span>
                                        </div>
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Height</span>
                                            <span className="font-medium">{selectedClient.height}</span>
                                        </div>
                                        <div className="bg-[rgba(40,40,40,0.7)] p-2 rounded-lg">
                                            <span className="text-gray-400 block mb-1">Weight</span>
                                            <span className="font-medium">{selectedClient.weight}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 p-2 bg-[rgba(40,40,40,0.7)] rounded-lg">
                                        <span className="text-gray-400 text-sm block mb-1">Medical Notes</span>
                                        <span className="text-sm">{selectedClient.medicalNotes}</span>
                                    </div>
                                </div>

                                <div className="bg-[rgba(30,30,30,0.7)] p-4 rounded-lg">
                                    <h4 className="text-[#FF6B00] font-medium mb-3">Assign Training Plan</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Fat Loss
                                        </button>
                                        <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Strength Building
                                        </button>
                                        <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Recovery
                                        </button>
                                        <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Pro Athlete
                                        </button>
                                        <button className="py-2 px-3 bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] rounded-lg text-sm font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)]">
                                            Sport Specific
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-5">
                                    <button className="bg-[#FF6B00] text-white py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FF9A00] flex-1">
                                        Accept Request
                                    </button>
                                    <button className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)] flex-1">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[rgba(20,20,20,0.9)] p-5 rounded-xl border border-[#333] h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[rgba(255,107,0,0.15)] flex items-center justify-center mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#FF6B00"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">No Client Selected</h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Select a client from the list to view their details and respond to their training request
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
