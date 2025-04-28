import {
    About,
    Availability,
    Expertise,
    Testimonials,
} from "@/components/custom/client/dashboard/tabs/trainwithcoach/components";
import { useState } from "react";

// This component is the profile modal that appears when "View Profile" is clicked
export const TrainerProfileModal = ({ trainer, onClose }) => {
    const [activeTab, setActiveTab] = useState("about");

    // Function to render rating stars
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>
                );
            } else {
                stars.push(
                    <span key={i} className="text-[#444]">
                        ★
                    </span>
                );
            }
        }

        return stars;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div
                className="bg-[#121212] border border-[#333] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-fadeIn"
                style={{
                    animation: "fadeIn 0.3s ease-out",
                    boxShadow: "0 15px 40px -10px rgba(255,107,0,0.3)",
                }}
            >
                {/* Orange accent line at top */}
                <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Profile header */}
                <div className="p-6 pb-4 flex flex-col md:flex-row gap-6 items-start">
                    {/* Trainer photo */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-3xl overflow-hidden relative transition-transform duration-300 ease-in-out">
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

                        {/* Shine effect */}
                        <div
                            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] transform rotate-45"
                            style={{
                                animation: "shine 3s infinite",
                                animationTimingFunction: "ease-in-out",
                            }}
                        ></div>
                    </div>

                    {/* Trainer info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">{trainer?.name}</h2>
                            {trainer?.preferred && (
                                <span className="bg-[rgba(255,107,0,0.2)] text-[#FF6B00] py-1 px-3 rounded text-xs font-medium">
                                    Preferred for your goals
                                </span>
                            )}
                        </div>

                        <p className="text-[#FF6B00] text-lg font-medium mb-2">{trainer?.specialty}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {trainer?.certifications.map((cert, index) => (
                                <span
                                    key={index}
                                    className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                    </svg>
                                    {cert}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                            <div className="flex items-center gap-1">
                                <div className="flex gap-0.5">{renderStars(trainer?.rating)}</div>
                                <span className="ml-1">{trainer?.rating} Rating</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{trainer?.experience} Experience</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{trainer?.proximity}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button className="py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300 bg-[#FF6B00] text-white hover:bg-[#E66000] hover:shadow-lg hover:-translate-y-0.5">
                                Book Session
                            </button>

                            <button className="py-2.5 px-6 rounded-lg font-medium cursor-pointer transition-all duration-300 bg-transparent border border-gray-600 text-white hover:border-[#FF6B00] hover:-translate-y-0.5">
                                Message
                            </button>

                            <button className="py-2.5 px-4 rounded-lg font-medium cursor-pointer transition-all duration-300 bg-transparent border border-gray-600 text-white hover:border-[#FF6B00] hover:-translate-y-0.5 flex items-center gap-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs navigation */}
                <div className="border-b border-[#333] px-6">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("about")}
                            className={`py-3 px-4 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                                activeTab === "about"
                                    ? "border-[#FF6B00] text-[#FF6B00]"
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            About
                        </button>
                        <button
                            onClick={() => setActiveTab("expertise")}
                            className={`py-3 px-4 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                                activeTab === "expertise"
                                    ? "border-[#FF6B00] text-[#FF6B00]"
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            Expertise
                        </button>
                        <button
                            onClick={() => setActiveTab("availability")}
                            className={`py-3 px-4 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                                activeTab === "availability"
                                    ? "border-[#FF6B00] text-[#FF6B00]"
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            Availability
                        </button>
                        <button
                            onClick={() => setActiveTab("testimonials")}
                            className={`py-3 px-4 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${
                                activeTab === "testimonials"
                                    ? "border-[#FF6B00] text-[#FF6B00]"
                                    : "border-transparent text-gray-400 hover:text-white"
                            }`}
                        >
                            Testimonials
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {activeTab === "about" && <About trainer={trainer} />}
                    {activeTab === "expertise" && <Expertise trainer={trainer} />}
                    {activeTab === "availability" && <Availability trainer={trainer} />}
                    {activeTab === "testimonials" && <Testimonials trainer={trainer} renderStars={renderStars} />}
                </div>
            </div>
        </div>
    );
};
