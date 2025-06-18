"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useUserLocation } from "@/app/layout";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import { TrainerProfileModal } from "@/components/custom/dashboard/client/pages/trainwithcoach/components/TrainerProfileModal";

export default function TrainWithCoachPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [goalFilter, setGoalFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [requestedTrainers, setRequestedTrainers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 6;
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  const { userLocation, locationResolved } = useUserLocation();

  // Fetch trainers from API only after location is resolved
  useEffect(() => {
    if (!locationResolved) return;
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        let url = "/api/users/trainers";
        if (userLocation) {
          url += `?lat=${userLocation.lat}&lon=${userLocation.lon}&sortBy=location&limit=100`;
        } else {
          url += `?limit=100`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();
        // Map distance and distanceSource for each trainer
        const mapped = data.trainers.map((trainer) => ({
          ...trainer,
          distance: trainer.distance ?? null,
          distanceSource: trainer.distanceSource ?? null,
        }));
        setTrainers(mapped);
        setFilteredTrainers(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [userLocation, locationResolved]);

  // Function to open the coaching request confirmation
  const handleRequestCoaching = (trainer) => {
    setSelectedTrainer(trainer);
    setShowConfirmationModal(true);
  };

  // Function to handle viewing a trainer's profile
  const handleViewProfile = (trainer) => {
    setSelectedTrainer(trainer);
    setShowProfileModal(true);
  };

  // Function to close the confirmation modal
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  // Function to close the profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  // Function to submit coaching request
  const submitCoachingRequest = () => {
    if (!selectedTrainer) return;

    // In a real app, you would send this to your backend

    // Add trainer to requested list
    setRequestedTrainers((prev) => [...prev, selectedTrainer.id]);

    // Close the modal
    setShowConfirmationModal(false);
    setSelectedTrainer(null);
  };

  // Check if user has already requested a trainer
  const hasRequestedTrainer = (trainerId) =>
    requestedTrainers.includes(trainerId);

  // Filter trainers based on search term and selected filters
  useEffect(() => {
    let results = [...trainers];

    // Search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      results = results.filter(
        (trainer) =>
          (trainer.firstName &&
            trainer.firstName.toLowerCase().includes(query)) ||
          (trainer.lastName &&
            trainer.lastName.toLowerCase().includes(query)) ||
          (trainer.description &&
            trainer.description.toLowerCase().includes(query)) ||
          (trainer.specialties &&
            trainer.specialties.some((specialty) =>
              specialty.name.toLowerCase().includes(query)
            ))
      );
    }

    // Goal filter (matching specialties)
    if (goalFilter) {
      results = results.filter(
        (trainer) =>
          trainer.specialties &&
          trainer.specialties.some(
            (specialty) =>
              specialty.name.toLowerCase() === goalFilter.toLowerCase()
          )
      );
    }

    // Sport filter (matching specialties or training types)
    if (sportFilter) {
      results = results.filter(
        (trainer) =>
          trainer.specialties &&
          trainer.specialties.some(
            (specialty) =>
              specialty.name.toLowerCase() === sportFilter.toLowerCase()
          )
      );
    }

    setFilteredTrainers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, goalFilter, sportFilter, trainers]);

  // Create goal options from unique specialties across all trainers
  const allSpecialties = trainers.flatMap(
    (trainer) => trainer.specialties?.map((specialty) => specialty.name) || []
  );
  const uniqueSpecialties = [...new Set(allSpecialties)];

  const goalOptions = [
    { value: "", label: "Select Goal" },
    ...uniqueSpecialties.map((specialty) => ({
      value: specialty.toLowerCase(),
      label: specialty,
    })),
  ];

  const sportOptions = [
    { value: "", label: "Select Sport" },
    ...uniqueSpecialties
      .filter((specialty) =>
        [
          "football",
          "basketball",
          "tennis",
          "swimming",
          "running",
          "cycling",
          "golf",
          "boxing",
          "martial arts",
        ].some((sport) => specialty.toLowerCase().includes(sport))
      )
      .map((specialty) => ({
        value: specialty.toLowerCase(),
        label: specialty,
      })),
  ];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setGoalFilter("");
    setSportFilter("");
  };

  if (loading || !locationResolved) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading trainers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Failed to load trainers
          </p>
          <p className="mt-2 text-gray-400">{error}</p>
          <Button
            variant="orangeFilled"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div className="relative z-20 mx-auto w-full">
        <Card
          variant="darkStrong"
          className="mb-5"
          width="100%"
          maxWidth="none"
        >
          <FormField
            type="text"
            placeholder="Search by name, specialty, or description..."
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

            {(searchTerm || goalFilter || sportFilter) && (
              <Button
                variant="secondary"
                size="small"
                onClick={handleClearFilters}
                className="mb-0 whitespace-nowrap"
                leftIcon={
                  <Icon icon="mdi:filter-remove" width={16} height={16} />
                }
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>

        {/* Search results summary */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-white">
              {filteredTrainers.length}
            </span>{" "}
            trainers found
          </div>
        </div>

        {/* Trainer List */}
        <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 pb-8">
          {currentTrainers.length > 0 ? (
            currentTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onRequestCoaching={handleRequestCoaching}
                onViewProfile={handleViewProfile}
                hasRequested={hasRequestedTrainer(trainer.id)}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 px-5 py-12 text-center text-gray-400">
              <h3 className="mb-2.5 text-lg font-semibold">
                No trainers match your criteria
              </h3>
              <p className="mx-auto max-w-md text-sm">
                Try adjusting your filters or search term to find trainers that
                match your needs.
              </p>
              <Button
                variant="orangeOutline"
                size="medium"
                onClick={handleClearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mb-12 flex justify-center">
            <nav className="flex flex-wrap items-center justify-center gap-2">
              <Button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant={currentPage === 1 ? "ghost" : "secondary"}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                }`}
                aria-label="Go to previous page"
                leftIcon={
                  <Icon icon="mdi:chevron-left" className="w-5 h-5 mr-1" />
                }
              >
                <span className="text-sm">Previous</span>
              </Button>

              <div className="flex items-center overflow-x-auto max-w-[250px] sm:max-w-none hide-scrollbar py-1">
                {generatePaginationNumbers().map((pageNum, index) => (
                  <div key={index} className="px-1">
                    {pageNum === "..." ? (
                      <span className="px-3 py-2 text-zinc-500">...</span>
                    ) : (
                      <Button
                        onClick={() => handlePageChange(pageNum)}
                        variant={
                          currentPage === pageNum ? "orangeFilled" : "secondary"
                        }
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                variant={currentPage === totalPages ? "ghost" : "secondary"}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                }`}
                aria-label="Go to next page"
                rightIcon={
                  <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-1" />
                }
              >
                <span className="text-sm">Next</span>
              </Button>
            </nav>
          </div>
        )}

        {/* Page indication */}
        {totalPages > 1 && (
          <div className="text-center text-zinc-500 text-sm mb-8">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Confirmation Modal using the Modal component */}
      {showConfirmationModal && selectedTrainer && (
        <Modal
          isOpen={showConfirmationModal}
          onClose={closeConfirmationModal}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:account-multiple"
                width={18}
                height={18}
                className="text-[#FF6B00]"
              />
              Request Coaching
            </div>
          }
          message={`You're about to request ${selectedTrainer.firstName} ${
            selectedTrainer.lastName || ""
          } as your coach`}
          confirmButtonText="Confirm Request"
          cancelButtonText="Cancel"
          onConfirm={submitCoachingRequest}
          primaryButtonAction={submitCoachingRequest}
          secondaryButtonAction={closeConfirmationModal}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full">
              {selectedTrainer.profileImage ? (
                <Image
                  src={selectedTrainer.profileImage}
                  alt={`${selectedTrainer.firstName} profile`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF9A00]">
                  <Icon
                    icon="mdi:account"
                    width={32}
                    height={32}
                    color="white"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedTrainer.firstName} {selectedTrainer.lastName || ""}
              </h3>
              <p className="text-sm text-gray-400">
                {selectedTrainer.specialties.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>

          <p className="mb-6 text-gray-300">
            If they accept your request, they will be able to create workout
            plans for you and provide guidance on your fitness journey.
          </p>

          <p className="mb-2 text-sm text-gray-400">
            Note: The standard rate shown below is a starting point. You can
            discuss and negotiate the final price directly with the trainer
            based on your specific needs and training schedule.
          </p>

          <p className="mb-6 text-sm text-gray-400">
            Standard rate:{" "}
            <span className="text-base font-bold text-[#FF6B00]">
              ${selectedTrainer.pricePerSession}/
              {selectedTrainer.pricingType === "per_session"
                ? "session"
                : "package"}
            </span>
          </p>
        </Modal>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedTrainer && (
        <TrainerProfileModal
          isOpen={showProfileModal}
          trainer={{
            ...selectedTrainer,
            name: `${selectedTrainer.firstName} ${
              selectedTrainer.lastName || ""
            }`,
            specialty: selectedTrainer.specialties
              .map((s) => s.name)
              .join(", "),
            rating: selectedTrainer.trainerInfo?.rating || 0,
            experience: selectedTrainer.trainingSince
              ? `${
                  new Date().getFullYear() - selectedTrainer.trainingSince
                }+ years`
              : "Experience not specified",
            proximity: selectedTrainer.location
              ? `${selectedTrainer.location.city}, ${
                  selectedTrainer.location.state || ""
                }`
              : "Location not specified",
            hourlyRate: selectedTrainer.pricePerSession || 0,
            certifications: selectedTrainer.certifications.map(
              (cert) => cert.name
            ),
            testimonials: [
              {
                name: "John D.",
                rating: 5,
                text: "Amazing trainer! Helped me achieve my fitness goals in just 3 months.",
                date: "2 weeks ago",
                relationship: "Client (6 months)",
                avatar: "/images/avatars/client-1.jpg",
              },
              {
                name: "Sarah M.",
                rating: 4.5,
                text: "Very knowledgeable and supportive. Great at customizing workouts for my specific needs.",
                date: "1 month ago",
                relationship: "Client (3 months)",
                avatar: "/images/avatars/client-2.jpg",
              },
            ],
          }}
          onClose={closeProfileModal}
        />
      )}
    </div>
  );
}

const TrainerCard = ({
  trainer,
  onRequestCoaching,
  onViewProfile,
  hasRequested,
}) => {
  const router = useRouter();
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

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

  // Calculate experience years based on trainingSince field
  const experienceYears = trainer.trainingSince
    ? `${new Date().getFullYear() - trainer.trainingSince}+ years`
    : trainer.trainerInfo?.totalSessions
    ? `${trainer.trainerInfo.totalSessions}+ sessions`
    : "Experience not specified";

  // Check if trainer has paid ads (featured)
  const isFeatured = trainer.paidAds && new Date(trainer.paidAds) > new Date();

  return (
    <Card
      variant="darkStrong"
      className={`group flex h-full flex-col overflow-hidden rounded-lg border ${
        hasRequested
          ? "border-[#FF6B00]"
          : isFeatured
          ? "border-[#FFD700]"
          : "border-[#222]"
      } transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg hover:translate-y-[-4px]`}
      padding="0"
      width="100%"
      maxWidth="100%"
    >
      <div className="relative flex h-full flex-col">
        {/* Left accent */}
        <div
          className={`absolute bottom-0 left-0 top-0 w-[3px] ${
            isFeatured ? "bg-[#FFD700]" : "bg-[#FF6B00]"
          } scale-y-[0.6] transform transition-transform duration-300 ease-in-out group-hover:scale-y-100`}
        ></div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute right-0 top-0 z-10">
            <div className="flex items-center gap-1 bg-[#FFD700] px-2 py-0.5 text-xs font-medium text-black">
              <Icon icon="mdi:star" width={12} height={12} />
              Featured
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="flex gap-4">
            {/* Trainer photo */}
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.02]">
              {trainer.profileImage ? (
                <Image
                  src={trainer.profileImage}
                  alt={`${trainer.firstName} profile photo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF9A00]">
                  <Icon
                    icon="mdi:account"
                    width={40}
                    height={40}
                    color="white"
                  />
                </div>
              )}
            </div>

            {/* Trainer info */}
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                  {trainer.firstName} {trainer.lastName || ""}
                </h3>

                {/* Pending status badge - small dot style */}
                {hasRequested && (
                  <div className="flex items-center gap-1 bg-[#FF6B00] rounded-full px-2 py-0.5 text-xs font-medium text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                    Pending
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-gray-400">
                  {trainer.specialties
                    .map((s) => s.name)
                    .slice(0, 2)
                    .join(", ")}
                  {trainer.specialties.length > 2 ? "..." : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Certification badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {trainer.certifications.slice(0, 3).map((cert, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-[rgba(255,107,0,0.25)]"
              >
                <Icon icon="mdi:certificate" width={12} height={12} />
                {cert.name}
              </span>
            ))}
            {trainer.certifications.length > 3 && (
              <span className="flex items-center rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                +{trainer.certifications.length - 3} more
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-3 line-clamp-2 text-sm text-[#ddd]">
            {trainer.description || "No description available."}
          </p>

          {/* Hourly rate */}
          <p className="mt-4 text-xl font-bold text-[#FF6B00]">
            ${trainer.pricePerSession || "--"}/
            {trainer.pricingType === "per_session" ? "session" : "package"}
          </p>

          {/* Rating and details */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 text-base">
                {renderStars(trainer.trainerInfo?.rating)}
              </div>
              <span className="text-sm text-white">
                {trainer.trainerInfo?.rating || "--"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-white">
              <Icon icon="mdi:clock-outline" width={14} height={14} />
              <span>{experienceYears}</span>
            </div>

            {/* Session count badge */}
            {trainer.trainerInfo?.totalSessions && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(40,167,69,0.2)] px-2 py-0.5 text-xs font-medium text-[#28a745]">
                <Icon icon="mdi:dumbbell" width={12} height={12} />
                {trainer.trainerInfo.totalSessions}+ sessions
              </span>
            )}
          </div>

          {/* Location */}
          {trainer.location && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-400">
              <Icon icon="mdi:map-marker" width={16} height={16} />
              <span>
                {trainer.location.city},{" "}
                {trainer.location.state || trainer.location.country}
              </span>
              {/* Distance and source badge */}
              <span className="ml-2 text-xs text-white font-semibold">
                {typeof trainer.distance === "number"
                  ? `${trainer.distance.toFixed(1)} km`
                  : "Nepoznata udaljenost"}
              </span>
              {trainer.distanceSource === "gym" && (
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-[#FF6B00]/20 text-[#FF6B00] rounded-full font-medium">
                  Najbliža teretana
                </span>
              )}
              {trainer.distanceSource === "city" && (
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-zinc-700 text-zinc-200 rounded-full font-medium">
                  Grad
                </span>
              )}
              {(!trainer.distanceSource || trainer.distanceSource === null) && (
                <span className="ml-2 px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded-full font-medium">
                  Nepoznata udaljenost
                </span>
              )}
            </div>
          )}
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
            variant={hasRequested ? "secondary" : "orangeFilled"}
            size="small"
            onClick={() => onRequestCoaching(trainer)}
            disabled={hasRequested}
            className="w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
          >
            {hasRequested ? (
              <>
                <Icon
                  icon="mdi:check-circle"
                  width={14}
                  height={14}
                  className="mr-1"
                />{" "}
                Requested
              </>
            ) : (
              <>
                <Icon
                  icon="mdi:account-multiple"
                  width={14}
                  height={14}
                  className="mr-1"
                />{" "}
                Request Coach
              </>
            )}
          </Button>
          <div className="col-span-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() =>
                router.push(`/client/dashboard/messages?trainer=${trainer.id}`)
              }
              leftIcon={
                <Icon icon="mdi:message-outline" width={14} height={14} />
              }
              className="w-full transition-transform duration-300 group-hover:-translate-y-1"
            >
              Send Message
            </Button>
          </div>
        </div>

        {/* Session duration */}
        {trainer.sessionDuration && (
          <div className="absolute -bottom-2 right-4 text-xs text-gray-400">
            {trainer.sessionDuration} min sessions
          </div>
        )}
      </div>
    </Card>
  );
};
