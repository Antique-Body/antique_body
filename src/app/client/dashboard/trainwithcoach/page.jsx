"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { CertificateIcon, MessageIcon, TimerIcon, UserProfileIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { BookingSessionModal, TrainerProfileModal } from "@/components/custom/client/dashboard/pages/trainwithcoach/components";

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
            experience: "8+ years",
            available: true,
            preferred: true,
            proximity: "1.2 km away",
            primaryGym: "Elite Performance Center",
            profileImage: "https://ai-previews.123rf.com/ai-txt2img/600nwm/74143221-4fc9-47bd-a919-0c6d55da9cc5.jpg",
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
            experience: "6+ years",
            available: false,
            preferred: false,
            proximity: "2.5 km away",
            primaryGym: "Wellness Hub",
            profileImage:
                "https://media.istockphoto.com/id/1497018234/photo/strong-and-healthy-people-working-out.jpg?s=1024x1024&w=is&k=20&c=5Hxmof3LgI6gyBUr1aI1bvopFn6krQhSxDVPxtobImY=",
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
            experience: "10+ years",
            available: true,
            preferred: false,
            proximity: "3.7 km away",
            primaryGym: "SportsMed Center",
            profileImage: "https://thumbs.wbm.im/pw/medium/210960354d062d6662846e36aae53ffb.jpg",
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
            experience: "7+ years",
            available: false,
            preferred: true,
            proximity: "0.8 km away",
            primaryGym: "CrossFit Box",
            profileImage:
                "https://media.istockphoto.com/id/1420697156/photo/leadership-manager-and-team-leader.jpg?s=1024x1024&w=is&k=20&c=Ly785VLGMCGJ87uFYp_cWaFaznmN6YT6m-m3pKcd4Cs=",
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
            experience: "9+ years",
            available: true,
            preferred: false,
            proximity: "4.1 km away",
            primaryGym: "Zen Fitness Studio",
            profileImage:
                "https://media.istockphoto.com/id/1359149467/photo/shot-of-a-handsome-young-man-standing-alone-and-stretching-during-his-outdoor-workout.jpg?s=1024x1024&w=is&k=20&c=-HVl9xVbCUrtb_2R1oKdbaxcR79QQ-QjHMvr5EYrM4c=",
        },
    ];

    // Function to handle booking a session with a trainer
    const handleBookSession = (trainer) => {
        setSelectedTrainer(trainer);
        setShowBookingModal(true);
    };

    // Function to handle viewing a trainer's profile
    const handleViewProfile = (trainer) => {
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
    const filteredTrainers = trainers.filter((trainer) => {
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
        <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
            <div className="relative z-20 mx-auto w-full">
                <Card variant="darkStrong" className="mb-5" width="100%" maxWidth="none">
                    <FormField
                        type="text"
                        placeholder="Search by profession, sport, or goal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                    />

                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                        <FormField
                            type="select"
                            value={goalFilter}
                            onChange={(e) => setGoalFilter(e.target.value)}
                            options={goalOptions}
                            className="mb-0 min-w-[140px]"
                        />

                        <FormField
                            type="select"
                            value={sportFilter}
                            onChange={(e) => setSportFilter(e.target.value)}
                            options={sportOptions}
                            className="mb-0 min-w-[140px]"
                        />
                    </div>
                </Card>

                {/* Trainer List */}
                <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 pb-20">
                    {filteredTrainers.length > 0 ? (
                        filteredTrainers.map((trainer) => (
                            <TrainerCard
                                key={trainer.id}
                                trainer={trainer}
                                onBookSession={handleBookSession}
                                onViewProfile={handleViewProfile}
                            />
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 px-5 py-12 text-center text-gray-400">
                            <h3 className="mb-2.5 text-lg font-semibold">No trainers match your criteria</h3>
                            <p className="mx-auto max-w-md text-sm">
                                Try adjusting your filters or search term to find trainers that match your needs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedTrainer && (
                <BookingSessionModal isOpen={showBookingModal} trainer={selectedTrainer} onClose={closeBookingModal} />
            )}

            {/* Profile Modal */}
            {showProfileModal && selectedTrainer && (
                <TrainerProfileModal isOpen={showProfileModal} trainer={selectedTrainer} onClose={closeProfileModal} />
            )}
        </div>
    );
}

const TrainerCard = ({ trainer, onBookSession, onViewProfile }) => {
    const router = useRouter();
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
        <Card
            variant="darkStrong"
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#222] transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:translate-y-[-4px]"
            padding="0"
            width="100%"
            maxWidth="100%"
        >
            <div className="relative flex h-full flex-col">
                {/* Left orange accent */}
                <div className="absolute bottom-0 left-0 top-0 w-[3px] bg-[#FF6B00] scale-y-[0.6] transform transition-transform duration-300 ease-in-out group-hover:scale-y-100"></div>

                <div className="p-5">
                    <div className="flex gap-4">
                        {/* Trainer photo */}
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.02]">
                            {trainer.profileImage ? (
                                <Image
                                    src={trainer.profileImage}
                                    alt={`${trainer.name} profile photo`}
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF9A00]">
                                    <UserProfileIcon size={40} stroke="white" strokeWidth="1.5" />
                                </div>
                            )}
                        </div>

                        {/* Trainer info */}
                        <div className="flex flex-1 flex-col">
                            <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                                {trainer.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm text-gray-400">{trainer.specialty}</p>
                                {/* Preferred badge */}
                                {trainer.preferred && (
                                    <span className="inline-flex rounded bg-[rgba(255,107,0,0.2)] px-2 py-0.5 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:bg-[rgba(255,107,0,0.3)]">
                                        Preferred
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Certification badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {trainer.certifications.map((cert, index) => (
                            <span
                                key={index}
                                className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[rgba(255,107,0,0.25)]"
                            >
                                <CertificateIcon size={12} />
                                {cert}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="mt-3 line-clamp-2 text-sm text-[#ddd]">{trainer.description}</p>

                    {/* Hourly rate */}
                    <p className="mt-4 text-xl font-bold text-[#FF6B00]">${trainer.hourlyRate}/hour</p>

                    {/* Rating and details */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                            <div className="flex gap-0.5 text-base">{renderStars(trainer.rating)}</div>
                            <span className="text-sm text-white">{trainer.rating}</span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-white">
                            <TimerIcon size={14} />
                            <span>{trainer.experience}</span>
                        </div>

                        {/* Availability tag */}
                        {trainer.available && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(40,167,69,0.2)] px-2 py-0.5 text-xs font-medium text-[#28a745]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#28a745]"></span>
                                Available Now
                            </span>
                        )}
                    </div>

                    {/* Primary Gym */}
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>{trainer.primaryGym}</span>
                    </div>
                </div>

                {/* Spacer to push buttons to bottom */}
                <div className="flex-grow"></div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 p-4 pt-2">
                    <Button
                        variant="orangeOutline"
                        size="small"
                        onClick={() => onViewProfile(trainer)}
                        className="w-full transition-transform duration-300 group-hover:-translate-y-1"
                    >
                        View Profile
                    </Button>
                    <Button
                        variant="orangeFilled"
                        size="small"
                        onClick={() => onBookSession(trainer)}
                        className="w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
                    >
                        Book Session
                    </Button>
                    <div className="col-span-2">
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => router.push("/client/dashboard/messages")}
                            leftIcon={<MessageIcon size={14} />}
                            className="w-full transition-transform duration-300 group-hover:-translate-y-1"
                        >
                            Send Message
                        </Button>
                    </div>
                </div>

                {/* Proximity */}
                <div className="absolute -bottom-2 right-4 text-xs text-gray-400">{trainer.proximity}</div>
            </div>
        </Card>
    );
};
