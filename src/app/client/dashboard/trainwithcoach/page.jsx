"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { useUserLocation } from "@/app/layout";
import { Modal } from "@/components/common/Modal";
import {
  TrainerProfileModal,
  TrainerCard,
} from "@/components/custom/dashboard/client/pages/trainwithcoach/components";
import {
  NoResults,
  Pagination,
  SortControls,
} from "@/components/custom/shared";

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
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

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

        console.log("Trainers with distance data:", mapped);
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

    // Sort the results
    results = sortTrainers(results, sortOption, sortOrder);

    setFilteredTrainers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, goalFilter, sportFilter, trainers, sortOption, sortOrder]);

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
          comparison = (a.trainingSince || 0) - (b.trainingSince || 0);
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
          }
          break;
        default:
          comparison = 0;
      }

      // Reverse for descending order
      return order === "asc" ? comparison : -comparison;
    });

  // Define sort options
  const sortOptions = [
    ...(trainers.some((t) => typeof t.distance === "number")
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
        {/* Sort Controls */}
        <SortControls
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          itemCount={filteredTrainers.length}
          sortOptions={sortOptions}
          variant="blue"
        />

        {/* Trainer List */}
        {currentTrainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
            {currentTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onRequestCoaching={handleRequestCoaching}
                onViewProfile={handleViewProfile}
                hasRequested={hasRequestedTrainer(trainer.id)}
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

      {/* Confirmation Modal */}
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
                className="text-[#3E92CC]"
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
                <img
                  src={selectedTrainer.profileImage}
                  alt={`${selectedTrainer.firstName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
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
              <p className="text-sm text-zinc-400">
                {selectedTrainer.specialties.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>

          <p className="mb-6 text-zinc-300">
            If they accept your request, they will be able to create workout
            plans for you and provide guidance on your fitness journey.
          </p>

          <p className="mb-2 text-sm text-zinc-400">
            Note: The standard rate shown below is a starting point. You can
            discuss and negotiate the final price directly with the trainer
            based on your specific needs and training schedule.
          </p>

          <p className="mb-6 text-sm text-zinc-400">
            Standard rate:{" "}
            <span className="text-base font-bold text-[#3E92CC]">
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
    </div>
  );
}
