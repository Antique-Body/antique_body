"use client";
import { Button } from "@/components/common/Button";
import { CertificateIcon, MessageIcon, TimerIcon, UserProfileIcon } from "@/components/common/Icons";
import { BookingSessionModal, TrainerProfileModal } from "@/components/custom/client/dashboard/pages/trainwithcoach/components";
import { FormField } from "@/components/shared/FormField";
import { useState } from "react";

export default function TrainWithCoachPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [goalFilter, setGoalFilter] = useState("");
    const [sportFilter, setSportFilter] = useState("");
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false); // New state for profile modal

    const trainers = [
        {
            id: 1,
            name: "Alex Miller",
            specialty: "Football Conditioning Specialist",
            certifications: ["UEFA A License", "NSCA CSCS"],
            description:
                "Specializing in elite football performance and recovery protocols. Worked with professional clubs for over 5 years, focusing on speed and agility development...",
            hourlyRate: 65,
            rating: 4.8,
            experience: "8 years",
            available: true,
            preferred: true,
            proximity: "1.2 km away",
        },
        {
            id: 2,
            name: "Sarah Jordan",
            specialty: "Strength & Conditioning, Nutrition",
            certifications: ["ACE CPT", "Precision Nutrition"],
            description:
                "Holistic approach to fitness combining strength training with evidence-based nutrition plans. Specializes in body transformation and metabolic optimization for sustainable results.",
            hourlyRate: 75,
            rating: 5.0,
            experience: "6 years",
            available: false,
            preferred: false,
            proximity: "2.5 km away",
        },
        {
            id: 3,
            name: "Michael Chen",
            specialty: "Sports Rehabilitation & Performance",
            certifications: ["DPT, CSCS", "FMS Certified"],
            description:
                "Specializing in injury prevention and performance enhancement. Expertise in functional movement screening and corrective exercise programming for athletes.",
            hourlyRate: 85,
            rating: 4.9,
            experience: "10 years",
            available: true,
            preferred: false,
            proximity: "3.7 km away",
        },
        {
            id: 4,
            name: "Emma Rodriguez",
            specialty: "CrossFit & Functional Training",
            certifications: ["CrossFit L3", "NASM CPT"],
            description:
                "High-intensity functional training expert with focus on metabolic conditioning. Developed training programs for competitive CrossFit athletes and weekend warriors alike.",
            hourlyRate: 70,
            rating: 4.7,
            experience: "7 years",
            available: false,
            preferred: true,
            proximity: "0.8 km away",
        },
        {
            id: 5,
            name: "David Kim",
            specialty: "Yoga & Mobility Specialist",
            certifications: ["RYT 500", "NASM CES"],
            description:
                "Combines traditional yoga practices with modern mobility training. Specializes in improving flexibility and movement patterns for athletes and desk warriors.",
            hourlyRate: 60,
            rating: 4.6,
            experience: "9 years",
            available: true,
            preferred: false,
            proximity: "4.1 km away",
        },
    ];

    // Function to handle booking a session with a trainer
    const handleBookSession = trainer => {
        setSelectedTrainer(trainer);
        setShowBookingModal(true);
    };

    // Function to handle viewing a trainer's profile
    const handleViewProfile = trainer => {
        setSelectedTrainer(trainer);
        setShowProfileModal(true);
    };

    // Function to close the booking modal
    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedTrainer(null);
    };

    // Function to close the profile modal
    const closeProfileModal = () => {
        setShowProfileModal(false);
        // Don't reset selectedTrainer here if you want to keep it for potential booking after viewing profile
    };

    // Filter trainers based on search term and selected filters
    const filteredTrainers = trainers.filter(trainer => {
        const matchesSearch =
            searchTerm === "" ||
            trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGoal = goalFilter === "" || true; // Would filter by goal if we had that data
        const matchesSport = sportFilter === "" || true; // Would filter by sport if we had that data

        return matchesSearch && matchesGoal && matchesSport;
    });

    const goalOptions = [
        { value: "", label: "Select Goal" },
        { value: "professional", label: "Professional Sports" },
        { value: "rehabilitation", label: "Rehabilitation" },
        { value: "lifestyle", label: "Healthy Lifestyle" },
        { value: "muscle", label: "Muscle Gain" },
        { value: "fat-loss", label: "Fat Loss" },
        { value: "functional", label: "Ultra Functional Body" },
    ];

    const sportOptions = [
        { value: "", label: "Select Sport" },
        { value: "football", label: "⚽ Football" },
        { value: "american-football", label: "🏈 American Football" },
        { value: "handball", label: "🤾 Handball" },
        { value: "volleyball", label: "🏐 Volleyball" },
        { value: "basketball", label: "🏀 Basketball" },
        { value: "tennis", label: "🎾 Tennis" },
        { value: "swimming", label: "🏊‍♂️ Swimming" },
        { value: "athletics", label: "🏃‍♂️ Athletics" },
        { value: "cycling", label: "🚴‍♂️ Cycling" },
        { value: "golf", label: "⛳ Golf" },
        { value: "boxing", label: "🥊 Boxing" },
        { value: "martial-arts", label: "🥋 Martial Arts" },
        { value: "other", label: "🏋️ Other" },
    ];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden relative">
            <div className="w-full max-w-6xl mx-auto px-4 relative z-20">
                <div className="bg-[rgba(20,20,20,0.95)] rounded-2xl p-4 mb-5 sticky top-3 z-30 backdrop-blur-lg border border-[#222] shadow-lg transition-all duration-300 ease-in-out hover:shadow-[0_15px_30px_-10px_rgba(255,107,0,0.2)]">
                    <FormField
                        type="text"
                        placeholder="Search by profession, sport, or goal..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />

                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                        <FormField
                            type="select"
                            value={goalFilter}
                            onChange={e => setGoalFilter(e.target.value)}
                            options={goalOptions}
                            className="mb-0 min-w-[140px]"
                        />

                        <FormField
                            type="select"
                            value={sportFilter}
                            onChange={e => setSportFilter(e.target.value)}
                            options={sportOptions}
                            className="mb-0 min-w-[140px]"
                        />
                    </div>
                </div>

                {/* Trainer List */}
                <div className="flex flex-wrap gap-5 pb-20 justify-center">
                    {filteredTrainers.length > 0 ? (
                        filteredTrainers.map(trainer => (
                            <TrainerCard
                                key={trainer.id}
                                trainer={trainer}
                                onBookSession={handleBookSession}
                                onViewProfile={handleViewProfile} // Pass the new handler
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 px-5 text-gray-400">
                            <h3 className="text-lg font-semibold mb-2.5">No trainers match your criteria</h3>
                            <p className="text-sm max-w-md mx-auto">
                                Try adjusting your filters or search term to find trainers that match your needs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedTrainer && (
                <BookingSessionModal trainer={selectedTrainer} onClose={closeBookingModal} />
            )}

            {/* Profile Modal */}
            {showProfileModal && selectedTrainer && (
                <TrainerProfileModal trainer={selectedTrainer} onClose={closeProfileModal} />
            )}
        </div>
    );
}

const TrainerCard = ({ trainer, onBookSession, onViewProfile }) => {
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

    const [, setShowChat] = useState(false);
    const [, setChatTrainer] = useState(null);

    const handleOpenChat = trainer => {
        setChatTrainer(trainer);
        setShowChat(true);
    };

    return (
        <div className="bg-[rgba(30,30,30,0.8)] rounded-2xl p-5 shadow-lg flex flex-row gap-5 transition-all duration-300 relative border border-[#333] overflow-hidden w-full md:w-[calc(50%-10px)] md:min-w-[450px] max-w-full hover:translate-y-[-3px] hover:shadow-xl hover:border-[#FF6B00]">
            {/* Left orange bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF6B00] scale-y-[0.4] transform transition-transform duration-300 ease-in-out group-hover:scale-y-100"></div>

            {/* Trainer photo */}
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] flex-shrink-0 flex justify-center items-center text-white font-semibold text-2xl overflow-hidden self-start relative transition-transform duration-300 ease-in-out hover:scale-105">
                <UserProfileIcon size={60} stroke="white" strokeWidth="1.5" />

                {/* Shine effect */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] transform rotate-45 transition-transform duration-500 ease-in-out hover:translate-y-full"></div>
            </div>

            {/* Trainer info */}
            <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold mb-1 transition-colors duration-300 hover:text-[#FF6B00]">
                    {trainer.name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">{trainer.specialty}</p>

                {/* Certification badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {trainer.certifications.map((cert, index) => (
                        <span
                            key={index}
                            className="bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium flex items-center gap-1 transition-all duration-300 hover:bg-[rgba(255,107,0,0.25)] hover:-translate-y-0.5"
                        >
                            <CertificateIcon size={12} />
                            {cert}
                        </span>
                    ))}
                </div>

                <p className="text-[#ddd] text-sm mb-3 line-clamp-2">{trainer.description}</p>

                <p className="text-xl font-bold text-[#FF6B00] my-2.5 transition-transform duration-300 hover:scale-105">
                    ${trainer.hourlyRate}/hour
                </p>

                {/* Meta information */}
                <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1 text-sm text-[#ddd]">
                        <div className="flex gap-0.5">{renderStars(trainer.rating)}</div>
                        <span>{trainer.rating}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[#ddd]">
                        <TimerIcon size={14} />
                        <span>{trainer.experience}</span>
                    </div>

                    {trainer.available && (
                        <div className="inline-block">
                            <span className="bg-[rgba(40,167,69,0.2)] text-[#28a745] py-0.5 px-2 rounded text-xs font-medium">
                                Available Now
                            </span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 flex-wrap">
                    <Button
                        variant="orangeOutline"
                        size="small"
                        onClick={() => onViewProfile(trainer)}
                        className="hover:-translate-y-0.5"
                    >
                        View Profile
                    </Button>
                    <Button
                        variant="orangeFilled"
                        size="small"
                        onClick={() => onBookSession(trainer)}
                        className="hover:-translate-y-0.5 hover:scale-105"
                    >
                        Book Session
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleOpenChat(trainer)}
                        className="hover:-translate-y-0.5"
                        leftIcon={<MessageIcon size={14} />}
                    >
                        Send Message
                    </Button>
                </div>
            </div>

            {/* Preferred badge (if applicable) */}
            {trainer.preferred && (
                <div className="absolute top-4 right-4 bg-[rgba(255,107,0,0.2)] text-[#FF6B00] py-1 px-2 rounded text-xs font-medium transition-all duration-300 hover:bg-[rgba(255,107,0,0.3)]">
                    Preferred for your goals
                </div>
            )}

            {/* Proximity */}
            <div className="absolute bottom-4 right-4 text-gray-400 text-xs">{trainer.proximity}</div>
        </div>
    );
};
