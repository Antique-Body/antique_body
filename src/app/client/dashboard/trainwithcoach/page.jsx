"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { useUserLocation } from "@/app/layout";
import { InfoBanner } from "@/components/common/InfoBanner";
import {
  NoResults,
  Pagination,
  SortControls,
} from "@/components/custom/shared";
import {
  TrainerCard,
  TrainerProfileModal,
  RequestCoachingModal,
} from "@/components/custom/shared/trainers-list";

export default function TrainWithCoachPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sportFilter, setSportFilter] = useState("");
  const [allTrainers, setAllTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [requestedTrainers, setRequestedTrainers] = useState([]);
  const [activeCooldowns, setActiveCooldowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [hasAcceptedRequest, setHasAcceptedRequest] = useState(false);
  const [acceptedTrainer, setAcceptedTrainer] = useState(null);
  const [unrequestError, setUnrequestError] = useState("");

  // Constants
  const MAX_TRAINER_REQUESTS = 5;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 8; // Changed to 8 for 4 columns in desktop view
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  const { userLocation, locationResolved } = useUserLocation();

  // Update sort option when user location becomes available
  useEffect(() => {
    if (userLocation) {
      setSortOption("location");
      setSortOrder("asc");
    }
  }, [userLocation]);

  // Fetch coaching requests
  const fetchCoachingRequests = async () => {
    try {
      const response = await fetch("/api/coaching-requests?role=client");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const requests = data.data;
          const requestedTrainerIds = requests.map((req) => req.trainerId);
          setRequestedTrainers(requestedTrainerIds);

          // Check for accepted request
          const acceptedRequest = requests.find(
            (req) => req.status === "accepted"
          );
          setHasAcceptedRequest(!!acceptedRequest);
          if (acceptedRequest) {
            setAcceptedTrainer(acceptedRequest.trainer);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching coaching requests:", err);
    }
  };

  // Fetch active cooldowns
  const fetchActiveCooldowns = async () => {
    try {
      const response = await fetch(
        "/api/coaching-requests/cooldowns?role=client"
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setActiveCooldowns(data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching cooldowns:", err);
    }
  };

  // Initial fetch of trainers sorted by location
  useEffect(() => {
    if (!locationResolved) return;

    const fetchTrainers = async () => {
      try {
        setLoading(true);
        let url = "/api/users/trainers?limit=100";

        // Always include location parameters if available for initial sorting
        if (userLocation) {
          url += `&lat=${userLocation.lat}&lon=${userLocation.lon}&sortBy=location`;
        } else {
          url += "&sortBy=rating&sortOrder=desc";
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

        // Ensure initial sort by distance if available
        const sorted = sortTrainers(mapped, "location", "asc");

        setAllTrainers(sorted);
        setFilteredTrainers(sorted);

        // Also fetch coaching requests and cooldowns
        await Promise.all([fetchCoachingRequests(), fetchActiveCooldowns()]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [userLocation, locationResolved]);

  // Handle filtering based on search term and location
  useEffect(() => {
    if (!allTrainers.length) return;

    let results = [...allTrainers];

    // Apply name search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter((trainer) => {
        const fullName = `${trainer.firstName} ${
          trainer.lastName || ""
        }`.toLowerCase();
        const hasNameMatch = fullName.includes(searchTermLower);
        const hasSpecialtyMatch = trainer.specialties?.some((specialty) =>
          specialty.name.toLowerCase().includes(searchTermLower)
        );
        const hasDescriptionMatch = trainer.description
          ?.toLowerCase()
          .includes(searchTermLower);

        return hasNameMatch || hasSpecialtyMatch || hasDescriptionMatch;
      });
    }

    // Apply location filter
    if (selectedLocation) {
      const cityParts = selectedLocation.label
        .split(",")[0]
        .split("-")
        .map((part) => part.trim());
      results = results.filter((trainer) => {
        if (!trainer.location) return false;

        const trainerCity = trainer.location.city.toLowerCase();
        return cityParts.some(
          (part) =>
            trainerCity.includes(part.toLowerCase()) ||
            trainerCity === selectedLocation.label.split(",")[0].toLowerCase()
        );
      });
    }

    // Apply sport filter
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

    // Sort results
    results = sortTrainers(results, sortOption, sortOrder);

    setFilteredTrainers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm,
    selectedLocation,
    sportFilter,
    allTrainers,
    sortOption,
    sortOrder,
  ]);

  // Function to open the coaching request modal
  const handleRequestCoaching = (trainer) => {
    setSelectedTrainer(trainer);
    setShowRequestModal(true);
  };

  // Function to handle viewing a trainer's profile
  const handleViewProfile = (trainer) => {
    setSelectedTrainer(trainer);
    setShowProfileModal(true);
  };

  // Function to close the request modal
  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedTrainer(null);
  };

  // Function to close the profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  // Function to submit coaching request
  const handleSubmitRequest = async (trainer) => {
    try {
      // Add trainer to requested list immediately for UI feedback
      setRequestedTrainers((prev) => [...prev, trainer.id]);

      // The API call is now handled in the RequestCoachingModal
      // This is just for UI updates

      // Immediately fetch updated cooldowns and coaching requests after request
      await Promise.all([fetchActiveCooldowns(), fetchCoachingRequests()]);
    } catch (error) {
      console.error("Error submitting coaching request:", error);
      // Remove from requested list if there was an error
      setRequestedTrainers((prev) => prev.filter((id) => id !== trainer.id));
    }
  };

  // Function to unrequest a trainer
  const handleUnrequestTrainer = async (trainerId) => {
    try {
      // Find the coaching request to delete
      const response = await fetch("/api/coaching-requests?role=client");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const request = data.data.find((req) => req.trainerId === trainerId);
          if (request) {
            // Don't allow unrequesting if the request is accepted
            if (request.status === "accepted") {
              setUnrequestError(
                "You cannot remove an active trainer. Please contact support if you need to change trainers."
              );
              setTimeout(() => setUnrequestError(""), 3000);
              return;
            }

            const deleteResponse = await fetch(
              `/api/coaching-requests/${request.id}`,
              {
                method: "DELETE",
              }
            );

            if (deleteResponse.ok) {
              // Remove trainer from requested list
              setRequestedTrainers((prev) =>
                prev.filter((id) => id !== trainerId)
              );

              // Immediately fetch updated cooldowns and coaching requests after removal
              await Promise.all([
                fetchActiveCooldowns(),
                fetchCoachingRequests(),
              ]);

              // Refresh badge counts
              if (
                typeof window !== "undefined" &&
                typeof window.refreshClientBadges === "function"
              ) {
                window.refreshClientBadges();
              }

              // No alert - the confirmation modal already handled the user interaction
            } else {
              const errorData = await deleteResponse.json();
              throw new Error(errorData.error || "Failed to remove request");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error unrequesting trainer:", error);
      // Show error message to user
      setUnrequestError("Failed to remove trainer request. Please try again.");
      setTimeout(() => setUnrequestError(""), 3000);
    }
  };

  // Function to submit message
  const handleSubmitMessage = async () => {
    // No action for now
  };

  // Check if user has already requested a trainer
  const hasRequestedTrainer = (trainerId) =>
    requestedTrainers.includes(trainerId);

  // Check if user can request more trainers
  const canRequestMoreTrainers = () =>
    requestedTrainers.length < MAX_TRAINER_REQUESTS;

  // Check if trainer is in cooldown
  const isTrainerInCooldown = (trainerId) =>
    activeCooldowns.some((cooldown) => cooldown.trainerId === trainerId);

  // Get cooldown info for a trainer
  const getCooldownInfo = (trainerId) =>
    activeCooldowns.find((cooldown) => cooldown.trainerId === trainerId);

  // Function to sort trainers
  const sortTrainers = (trainersToSort, option, order) =>
    [...trainersToSort].sort((a, b) => {
      let comparison = 0;

      switch (option) {
        case "rating":
          comparison =
            (a.trainerInfo?.rating || 0) - (b.trainerInfo?.rating || 0);
          break;
        case "price":
          comparison = (a.pricePerSession || 0) - (b.pricePerSession || 0);
          break;
        case "experience":
          comparison = (a.trainerSince || 0) - (b.trainerSince || 0);
          break;
        case "name":
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
          break;
        case "location":
          // If distance is available, sort by distance
          if (
            typeof a.distance === "number" &&
            typeof b.distance === "number"
          ) {
            comparison = a.distance - b.distance;
          } else if (typeof a.distance === "number") {
            comparison = -1; // a comes first if only a has distance
          } else if (typeof b.distance === "number") {
            comparison = 1; // b comes first if only b has distance
          }
          // If neither has distance, maintain current order
          break;
        default:
          comparison = 0;
      }

      // Reverse for descending order
      return order === "asc" ? comparison : -comparison;
    });

  // Define sort options
  const sortOptions = [
    ...(allTrainers.some((t) => typeof t.distance === "number")
      ? [{ value: "location", label: "Location (Closest)" }]
      : []),
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price" },
    { value: "experience", label: "Experience" },
    { value: "name", label: "Name" },
  ];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationSearch("");
    setSelectedLocation(null);
    setSportFilter("");
    setFilteredTrainers(allTrainers);
  };

  if (loading || !locationResolved) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading trainers...</p>
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
          <p className="mt-2 text-zinc-400">{error}</p>
          <button
            className="mt-4 rounded-lg bg-[#3E92CC] px-4 py-2 text-white hover:bg-[#2D7EB8] transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      <div className="relative z-10">
        {/* Trainer Request Status Banner */}
        <div className="mb-6">
          <InfoBanner
            icon="mdi:account-multiple"
            title={
              hasAcceptedRequest
                ? "You Have an Active Trainer"
                : `Trainer Requests (${requestedTrainers.length}/${MAX_TRAINER_REQUESTS})`
            }
            subtitle={
              hasAcceptedRequest
                ? `You are currently training with ${acceptedTrainer?.trainerProfile?.firstName} ${acceptedTrainer?.trainerProfile?.lastName}. You cannot request other trainers at this time.`
                : requestedTrainers.length === 0
                ? "You haven't requested any trainers yet. You can request up to 5 trainers."
                : requestedTrainers.length >= MAX_TRAINER_REQUESTS
                ? "You've reached the maximum number of trainer requests. Remove a request to add a new one."
                : `You have ${
                    requestedTrainers.length
                  } active requests. You can request ${
                    MAX_TRAINER_REQUESTS - requestedTrainers.length
                  } more trainers.`
            }
            variant={
              hasAcceptedRequest
                ? "success"
                : requestedTrainers.length >= MAX_TRAINER_REQUESTS
                ? "primary"
                : "info"
            }
          />
        </div>

        {/* Enhanced SortControls with integrated search and location filters */}
        <SortControls
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          itemCount={filteredTrainers.length}
          sortOptions={sortOptions}
          variant="blue"
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          locationSearch={locationSearch}
          setLocationSearch={setLocationSearch}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onClearFilters={handleClearFilters}
        />

        {/* Trainer List */}
        {currentTrainers.length > 0 ? (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8 cursor-pointer">
            {currentTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onRequestCoaching={handleRequestCoaching}
                onViewProfile={handleViewProfile}
                onUnrequestTrainer={handleUnrequestTrainer}
                hasRequested={hasRequestedTrainer(trainer.id)}
                canRequestMore={
                  !hasAcceptedRequest &&
                  canRequestMoreTrainers() &&
                  !isTrainerInCooldown(trainer.id)
                }
                colorVariant="blue"
                cooldownInfo={getCooldownInfo(trainer.id)}
                isAccepted={
                  hasAcceptedRequest && acceptedTrainer?.id === trainer.id
                }
              />
            ))}
          </div>
        ) : (
          <NoResults
            onClearFilters={handleClearFilters}
            variant="blue"
            title="No trainers match your criteria"
            message="We couldn't find any trainers matching your current filters. Try adjusting your search criteria or clearing all filters."
          />
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            variant="blue"
          />
        )}
      </div>

      {/* Request Coaching Modal */}
      <RequestCoachingModal
        isOpen={showRequestModal}
        onClose={closeRequestModal}
        trainer={selectedTrainer}
        onSubmitRequest={handleSubmitRequest}
        onSubmitMessage={handleSubmitMessage}
        hasRequested={
          selectedTrainer ? hasRequestedTrainer(selectedTrainer.id) : false
        }
        canRequestMore={canRequestMoreTrainers()}
        requestedCount={requestedTrainers.length}
        maxRequests={MAX_TRAINER_REQUESTS}
      />

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
            experience: selectedTrainer.trainerSince
              ? `${
                  new Date().getFullYear() - selectedTrainer.trainerSince
                }+ years`
              : "Experience not specified",
            proximity: selectedTrainer.location
              ? `${selectedTrainer.location.city}`
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
      {unrequestError && (
        <div className="text-center text-red-400 py-2 absolute left-0 right-0 bottom-0 z-20 bg-black/80">
          {unrequestError}
        </div>
      )}
    </div>
  );
}
