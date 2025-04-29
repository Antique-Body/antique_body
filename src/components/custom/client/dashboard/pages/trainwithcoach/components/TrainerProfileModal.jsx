import { Button } from "@/components/common/Button";
import { BookmarkIcon, CertificateIcon, ClockIcon, CloseXIcon, LocationIcon, UserProfileIcon } from "@/components/common/Icons";
import {
    About,
    Availability,
    Expertise,
    Testimonials,
} from "@/components/custom/client/dashboard/pages/trainwithcoach/components";
import { useState } from "react";

// This component is the profile modal that appears when "View Profile" is clicked
export const TrainerProfileModal = ({ trainer, onClose }) => {
    const [activeTab, setActiveTab] = useState("about");

    // Function to render rating stars
    const renderStars = rating => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>,
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <span key={i} className="text-[#FF6B00]">
                        ★
                    </span>,
                );
            } else {
                stars.push(
                    <span key={i} className="text-[#444]">
                        ★
                    </span>,
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
                <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <CloseXIcon size={24} />
                </Button>

                {/* Profile header */}
                <div className="p-6 pb-4 flex flex-col md:flex-row gap-6 items-start">
                    {/* Trainer photo */}
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-3xl overflow-hidden relative transition-transform duration-300 ease-in-out">
                        <UserProfileIcon size={80} className="text-white" />

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
                                    <CertificateIcon size={12} />
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
                                <ClockIcon size={16} />
                                <span>{trainer?.experience} Experience</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <LocationIcon size={16} />
                                <span>{trainer?.proximity}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="orangeFilled">Book Session</Button>

                            <Button variant="secondary">Message</Button>

                            <Button variant="secondary" leftIcon={<BookmarkIcon size={16} />}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs navigation */}
                <div className="border-b border-[#333] px-6">
                    <div className="flex overflow-x-auto">
                        <Button variant="tab" onClick={() => setActiveTab("about")} isActive={activeTab === "about"}>
                            About
                        </Button>
                        <Button variant="tab" onClick={() => setActiveTab("expertise")} isActive={activeTab === "expertise"}>
                            Expertise
                        </Button>
                        <Button
                            variant="tab"
                            onClick={() => setActiveTab("availability")}
                            isActive={activeTab === "availability"}
                        >
                            Availability
                        </Button>
                        <Button
                            variant="tab"
                            onClick={() => setActiveTab("testimonials")}
                            isActive={activeTab === "testimonials"}
                        >
                            Testimonials
                        </Button>
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
