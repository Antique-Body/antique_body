import React from "react";
import { StatCard } from "@/components/shared";

export const TrainerProfile = ({ trainerData }) => {
    return (
        <div className="py-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-3xl overflow-hidden relative transition-transform duration-300 hover:scale-105">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </div>

            <div className="flex-1">
                <p className="text-[#FF6B00] font-medium mb-2">{trainerData.specialty}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {trainerData.certifications.map((cert, index) => (
                        <span
                            key={index}
                            className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium"
                        >
                            {cert}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <StatCard label="Total Sessions" value={trainerData.totalSessions} />

                    <StatCard
                        label="Active Clients"
                        value={trainerData.clients ? trainerData.clients.filter((c) => c.status === "active").length : 0}
                    />

                    <StatCard label="Upcoming Sessions" value={trainerData.upcomingSessions} />

                    <StatCard
                        label="Rating"
                        value={
                            <div className="flex items-center">
                                {trainerData.rating}
                                <span className="text-[#FF6B00] ml-1">★</span>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};
