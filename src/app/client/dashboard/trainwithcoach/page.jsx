"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

import { useUserLocation } from "@/app/layout";
import { FormField } from "@/components/common/FormField";
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
import { searchCities } from "@/lib/googlePlaces";

export default function TrainWithCoachPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [sportFilter, setSportFilter] = useState("");
  const [allTrainers, setAllTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [requestedTrainers, setRequestedTrainers] = useState([]);
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

  // Update sort option when user location becomes available
  useEffect(() => {
    if (userLocation) {
      setSortOption("location");
      setSortOrder("asc");
    }
  }, [userLocation]);

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
          console.log("Fetching with location:", {
            lat: userLocation.lat,
            lon: userLocation.lon,
          });
        } else {
          url += "&sortBy=rating&sortOrder=desc";
          console.log(
            "Fetching without location - user location not available"
          );
        }

        console.log("Fetching trainers from URL:", url);

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

        console.log("Received trainers:", {
          total: mapped.length,
          withDistance: mapped.filter((t) => t.distance !== null).length,
          firstFive: mapped.slice(0, 5).map((t) => ({
            name: `${t.firstName} ${t.lastName}`,
            distance: t.distance,
            distanceSource: t.distanceSource,
            location: t.location,
          })),
        });

        // Ensure initial sort by distance if available
        const sorted = sortTrainers(mapped, "location", "asc");

        console.log("After sorting:", {
          firstFive: sorted.slice(0, 5).map((t) => ({
            name: `${t.firstName} ${t.lastName}`,
            distance: t.distance,
            distanceSource: t.distanceSource,
            location: t.location,
          })),
        });

        setAllTrainers(sorted);
        setFilteredTrainers(sorted);
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

  // Handle location search
  useEffect(() => {
    const fetchLocationSuggestions = async () => {
      if (locationSearch.length < 2) {
        setLocationSuggestions([]);
        return;
      }
      setIsLoadingLocations(true);
      try {
        const suggestions = await searchCities(locationSearch);
        setLocationSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setLocationSuggestions([]);
      }
      setIsLoadingLocations(false);
    };

    const timeoutId = setTimeout(fetchLocationSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearch]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationSearch(location.label);
    setShowLocationSuggestions(false);
  };

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

  // Function to sort trainers
  const sortTrainers = (trainersToSort, option, order) => {
    console.log("Sorting trainers:", { option, order });

    return [...trainersToSort].sort((a, b) => {
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
  };

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
    setSelectedLocation("");
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
        {/* Search Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Search */}
          <div className="relative">
            <FormField
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trainers by name..."
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-[#3E92CC]/40 focus:border-[#3E92CC]"
              prefixIcon="mdi:magnify"
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <Icon
                  icon="mdi:close"
                  className="w-5 h-5 text-zinc-400 hover:text-white"
                />
              </button>
            )}
          </div>

          {/* Location Search */}
          <div className="relative">
            <FormField
              type="text"
              value={locationSearch}
              onChange={(e) => {
                setLocationSearch(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              placeholder="Search by location..."
              className="w-full bg-zinc-800 border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-[#3E92CC]/40 focus:border-[#3E92CC]"
              prefixIcon="mdi:map-marker"
            />
            {locationSearch && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => {
                  setLocationSearch("");
                  setSelectedLocation("");
                }}
              >
                <Icon
                  icon="mdi:close"
                  className="w-5 h-5 text-zinc-400 hover:text-white"
                />
              </button>
            )}

            {/* Location Suggestions Dropdown */}
            {showLocationSuggestions &&
              (locationSuggestions.length > 0 || isLoadingLocations) && (
                <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {isLoadingLocations ? (
                    <div className="p-3 text-center text-zinc-400">
                      Loading locations...
                    </div>
                  ) : (
                    locationSuggestions.map((location) => (
                      <button
                        key={location.value}
                        className="w-full px-4 py-2 text-left hover:bg-zinc-700 focus:bg-zinc-700 focus:outline-none"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="flex items-center">
                          <Icon
                            icon="mdi:map-marker"
                            className="w-5 h-5 mr-2 text-[#3E92CC]"
                          />
                          <span>{location.label}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedLocation) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="flex items-center bg-[#3E92CC] px-3 py-1 rounded-full text-sm">
                <span>Name: {searchTerm}</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            )}
            {selectedLocation && (
              <div className="flex items-center bg-[#3E92CC] px-3 py-1 rounded-full text-sm">
                <Icon icon="mdi:map-marker" className="w-4 h-4 mr-1" />
                <span>{selectedLocation.label}</span>
                <button
                  onClick={() => {
                    setSelectedLocation("");
                    setLocationSearch("");
                  }}
                  className="ml-2 hover:text-zinc-200"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            )}
            {(searchTerm || selectedLocation) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-[#3E92CC] hover:text-[#2D7EB8] flex items-center"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

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
