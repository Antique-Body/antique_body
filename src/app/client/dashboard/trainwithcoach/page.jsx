"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { CertificateIcon, MessageIcon, TimerIcon, UserProfileIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import {
  BookingSessionModal,
  TrainerProfileModal,
} from "@/components/custom/client/dashboard/pages/trainwithcoach/components";
import { FormField } from "@/components/shared/FormField";

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
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] text-white">
      <div className="relative z-20 mx-auto w-full">
        <Card variant="darkStrong" className="mb-5" width="100%" maxWidth="none">
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
        </Card>

        {/* Trainer List */}
        <div className="flex flex-wrap justify-center gap-5 pb-20">
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map(trainer => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onBookSession={handleBookSession}
                onViewProfile={handleViewProfile}
              />
            ))
          ) : (
            <div className="px-5 py-12 text-center text-gray-400">
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
    <Card variant="entityCard" width="100%" maxWidth="100%">
      {/* Trainer photo */}
      <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center self-start overflow-hidden rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-2xl font-semibold text-white transition-transform duration-300 ease-in-out group-hover:scale-105">
        <UserProfileIcon size={60} stroke="white" strokeWidth="1.5" />

        {/* Shine effect */}
        <div className="absolute left-[-50%] top-[-50%] h-[200%] w-[200%] rotate-45 transform bg-gradient-to-b from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] transition-transform duration-500 ease-in-out group-hover:translate-y-full"></div>
      </div>

      {/* Trainer info */}
      <div className="flex-1 text-left">
        <h3 className="mb-1 text-lg font-semibold transition-colors duration-300 group-hover:text-[#FF6B00]">
          {trainer.name}
        </h3>
        <p className="mb-2 text-sm text-gray-400">{trainer.specialty}</p>

        {/* Certification badges */}
        <div className="mb-3 flex flex-wrap gap-2">
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

        <p className="mb-3 line-clamp-2 text-sm text-[#ddd]">{trainer.description}</p>

        <p className="my-2.5 text-xl font-bold text-[#FF6B00] ">${trainer.hourlyRate}/hour</p>

        {/* Meta information */}
        <div className="mb-3 flex flex-wrap gap-3">
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
              <span className="rounded bg-[rgba(40,167,69,0.2)] px-2 py-0.5 text-xs font-medium text-[#28a745]">
                Available Now
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="orangeOutline"
            size="small"
            onClick={() => onViewProfile(trainer)}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          >
            View Profile
          </Button>
          <Button
            variant="orangeFilled"
            size="small"
            onClick={() => onBookSession(trainer)}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
          >
            Book Session
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleOpenChat(trainer)}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
            leftIcon={<MessageIcon size={14} />}
          >
            Send Message
          </Button>
        </div>
      </div>

      {/* Preferred badge (if applicable) */}
      {trainer.preferred && (
        <div className="absolute right-4 top-4 rounded bg-[rgba(255,107,0,0.2)] px-2 py-1 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:bg-[rgba(255,107,0,0.3)]">
          Preferred for your goals
        </div>
      )}

      {/* Proximity */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">{trainer.proximity}</div>
    </Card>
  );
};
