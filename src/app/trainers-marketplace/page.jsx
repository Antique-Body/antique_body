"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { useUserLocation } from "@/app/layout";
import { Footer } from "@/components/common/Footer";
import { Navigation } from "@/components/custom/home-page/shared";
import { SearchFilters } from "@/components/custom/home-page/trainers-marketplace/components/SearchFilters";
import {
  NoResults,
  Pagination,
  SortControls,
} from "@/components/custom/shared";
import {
  TrainerCard,
  TrainerProfileModal,
} from "@/components/custom/shared/trainers-list";

export default function TrainersMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");

  // Access user location from context
  const { userLocation, locationResolved } = useUserLocation();

  // Filters state
  const [filters, setFilters] = useState({
    location: [],
    availability: [],
    price: { min: 0, max: 200 },
    rating: 0,
    tags: [],
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 9; // Show 9 trainers per page for marketplace
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Update sort option when user location becomes available
  useEffect(() => {
    if (userLocation) {
      setSortOption("location");
      setSortOrder("asc");
    }
  }, [userLocation]);

  // Initial fetch of trainers
  useEffect(() => {
    if (!locationResolved) return;

    const fetchTrainers = async () => {
      try {
        setLoading(true);
        let url = "/api/users/trainers?limit=100";

        // Include location parameters if available for distance calculation
        if (userLocation) {
          url += `&lat=${userLocation.lat}&lon=${userLocation.lon}&sortBy=location`;
          console.log("Fetching with location:", {
            lat: userLocation.lat,
            lon: userLocation.lon,
          });
        } else {
          url += `&sortBy=${sortOption}&sortOrder=${sortOrder}`;
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
        });

        // Sort trainers based on initial sort option
        const sorted = sortTrainers(mapped, sortOption, sortOrder);

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

  // Handle filtering based on search term and filters
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

    // Apply location filter from SearchFilters component
    if (filters.location.length > 0) {
      results = results.filter((trainer) => {
        if (!trainer.location) return false;

        return filters.location.some((location) => {
          const cityParts = location
            .split(",")[0]
            .split("-")
            .map((part) => part.trim());
          const trainerCity = trainer.location.city.toLowerCase();
          return cityParts.some(
            (part) =>
              trainerCity.includes(part.toLowerCase()) ||
              trainerCity === location.split(",")[0].toLowerCase()
          );
        });
      });
    }

    // Apply location filter from SortControls
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

    // Apply price filter
    if (filters.price.min > 0 || filters.price.max < 200) {
      results = results.filter((trainer) => {
        const price = trainer.pricePerSession || 0;
        return price >= filters.price.min && price <= filters.price.max;
      });
    }

    // Apply rating filter
    if (filters.rating > 0) {
      results = results.filter((trainer) => {
        const rating = trainer.trainerInfo?.rating || 0;
        return rating >= filters.rating;
      });
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      results = results.filter((trainer) =>
        trainer.specialties?.some((specialty) =>
          filters.tags.includes(specialty.name)
        )
      );
    }

    // Apply availability filter
    if (filters.availability.length > 0) {
      results = results.filter((trainer) => {
        if (!trainer.availability) return false;
        return filters.availability.some((day) =>
          trainer.availability.some((slot) => slot.weekday === day)
        );
      });
    }

    // Sort results
    results = sortTrainers(results, sortOption, sortOrder);

    setFilteredTrainers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm,
    selectedLocation,
    filters,
    allTrainers,
    sortOption,
    sortOrder,
  ]);

  // Function to handle viewing a trainer's profile
  const handleViewProfile = (trainer) => {
    setSelectedTrainer(trainer);
    setShowProfileModal(true);
  };

  // Function to close the profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

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
    setSelectedLocation(null);
    setFilters({
      location: [],
      availability: [],
      price: { min: 0, max: 200 },
      rating: 0,
      tags: [],
    });
    setFilteredTrainers(allTrainers);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
        {/* Background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
          <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <Navigation />

          <div className="flex h-64 w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FF6B00] border-t-transparent"></div>
              <p className="mt-4 text-zinc-400">Loading trainers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
        {/* Background effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
          <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10">
          <Navigation />

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
                className="mt-4 rounded-lg bg-[#FF6B00] px-4 py-2 text-white hover:bg-[#E65A00] transition-colors"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
        <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main className="max-w-[96rem] mx-auto px-4 py-8 sm:py-16 mt-16 sm:mt-24">
          {/* Page Title with search stats */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]">
              Find Your Perfect Trainer
            </h1>
            <p className="text-lg text-zinc-300 max-w-3xl mx-auto">
              Browse our marketplace of professional trainers, each specialized
              in different fitness areas. Filter by expertise, location, and
              availability to find your ideal match.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left sidebar with filters */}
            <div className="w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
              <SearchFilters
                searchQuery={searchTerm}
                setSearchQuery={setSearchTerm}
                filters={filters}
                setFilters={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main content */}
            <div className="w-full lg:w-3/4">
              {/* Enhanced SortControls with integrated search and location filters */}
              <SortControls
                sortOption={sortOption}
                setSortOption={setSortOption}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                itemCount={filteredTrainers.length}
                sortOptions={sortOptions}
                variant="orange"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {currentTrainers.map((trainer) => (
                    <TrainerCard
                      key={trainer.id}
                      trainer={trainer}
                      onRequestCoaching={() => {}}
                      onViewProfile={handleViewProfile}
                      hasRequested={false}
                      colorVariant="orange"
                    />
                  ))}
                </div>
              ) : (
                <NoResults
                  onClearFilters={handleClearFilters}
                  variant="orange"
                  title="No trainers match your criteria"
                  message="We couldn't find any trainers matching your current filters. Try adjusting your search criteria or clearing all filters."
                />
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  variant="orange"
                />
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

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
