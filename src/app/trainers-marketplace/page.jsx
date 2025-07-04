"use client";

import { Icon } from "@iconify/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [trainers, setTrainers] = useState([]);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Access user location from context
  const { userLocation, locationResolved } = useUserLocation();

  // State derived from URL
  const searchTerm = searchParams.get("search") || "";
  const locationSearch = searchParams.get("locationSearch") || "";
  const selectedLocation = searchParams.get("location")
    ? {
        label: searchParams.get("location"),
        value: searchParams.get("location"),
      }
    : null;
  const sortOption = searchParams.get("sortBy") || "rating";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [filters, setFilters] = useState({
    availability: searchParams.getAll("availability") || [],
    price: {
      min: parseInt(searchParams.get("priceMin") || "0", 10),
      max: parseInt(searchParams.get("priceMax") || "200", 10),
    },
    rating: parseInt(searchParams.get("rating") || "0", 10),
    tags: searchParams.getAll("tag") || [],
  });

  const trainersPerPage = 12;
  const totalPages = Math.ceil(totalTrainers / trainersPerPage);

  const updateUrlParams = useCallback(
    (newParams, resetPage = false) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      // Only reset to page 1 if explicitly requested
      if (resetPage) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const setSearchTerm = (value) => updateUrlParams({ search: value }, true);
  const setLocationSearch = (value) =>
    updateUrlParams({ locationSearch: value }, true);
  const setSelectedLocation = (value) =>
    updateUrlParams({ location: value ? value.label : null }, true);
  const setSortOption = (value) => updateUrlParams({ sortBy: value }, true);
  const setSortOrder = (value) => updateUrlParams({ sortOrder: value }, true);
  const setCurrentPage = (value) => updateUrlParams({ page: value }, false);

  // Track previous filters to prevent unnecessary resets
  const [prevFilters, setPrevFilters] = useState(null);

  useEffect(() => {
    setFilters({
      availability: searchParams.getAll("availability") || [],
      price: {
        min: parseInt(searchParams.get("priceMin") || "0", 10),
        max: parseInt(searchParams.get("priceMax") || "200", 10),
      },
      rating: parseInt(searchParams.get("rating") || "0", 10),
      tags: searchParams.getAll("tag") || [],
    });
  }, [searchParams]);

  useEffect(() => {
    // Only update URL if filters actually changed
    if (
      prevFilters &&
      JSON.stringify(filters) === JSON.stringify(prevFilters)
    ) {
      return;
    }

    const newParams = {};
    if (filters.availability.length > 0) {
      newParams.availability = filters.availability;
    } else {
      newParams.availability = null;
    }
    if (filters.price.min > 0) {
      newParams.priceMin = filters.price.min;
    } else {
      newParams.priceMin = null;
    }
    if (filters.price.max < 200) {
      newParams.priceMax = filters.price.max;
    } else {
      newParams.priceMax = null;
    }
    if (filters.rating > 0) {
      newParams.rating = filters.rating;
    } else {
      newParams.rating = null;
    }
    if (filters.tags.length > 0) {
      newParams.tag = filters.tags;
    } else {
      newParams.tag = null;
    }

    // Only reset page if this is a user-initiated filter change (not initial load)
    const shouldResetPage = prevFilters !== null;
    updateUrlParams(newParams, shouldResetPage);
    setPrevFilters(filters);
  }, [filters, prevFilters, updateUrlParams]);

  // Initial fetch of trainers
  useEffect(() => {
    if (!locationResolved) return;

    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams.toString());

        // We need lat/lon for distance calculation even if not sorting by location
        if (userLocation) {
          params.set("lat", userLocation.lat);
          params.set("lon", userLocation.lon);
        }

        // Ensure default sort is location if user location is present and no other sort is set
        if (userLocation && !params.has("sortBy")) {
          params.set("sortBy", "location");
          params.set("sortOrder", "asc");
        } else if (!params.has("sortBy")) {
          params.set("sortBy", "rating");
          params.set("sortOrder", "desc");
        }

        params.set("limit", trainersPerPage);
        params.set("page", currentPage);

        const url = `/api/users/trainers?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();

        setTrainers(data.trainers);
        setTotalTrainers(data.pagination.total);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [
    searchParams,
    userLocation,
    locationResolved,
    trainersPerPage,
    currentPage,
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

  // Define sort options
  const sortOptions = [
    ...(userLocation
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
    setPrevFilters(null); // Reset the prev filters tracking
    router.push(pathname);
  };

  // Count active filters for mobile filter button
  const countActiveFilters = () => {
    let count = 0;
    count += filters.availability.length;
    count += filters.price.min > 0 || filters.price.max < 200 ? 1 : 0;
    count += filters.rating > 0 ? 1 : 0;
    count += filters.tags.length;
    return count;
  };

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
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <main className="max-w-[96rem] mx-auto px-4 py-6 sm:py-8 md:py-16 mt-16 sm:mt-20 md:mt-24">
          {/* Page Title with search stats */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]">
              Find Your Perfect Trainer
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-3xl mx-auto px-4">
              Browse our marketplace of professional trainers, each specialized
              in different fitness areas. Filter by expertise, location, and
              availability to find your ideal match.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Left sidebar with filters - Desktop */}
            <div className="hidden lg:block w-full lg:w-1/4 lg:sticky lg:top-24 lg:self-start">
              <SearchFilters
                filters={filters}
                setFilters={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center justify-center w-full px-4 py-3 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 text-white hover:bg-zinc-800/50 transition-colors"
              >
                <Icon icon="mdi:filter-variant" className="w-5 h-5 mr-2" />
                <span className="font-medium">Filters</span>
                {countActiveFilters() > 0 && (
                  <span className="ml-2 bg-[#FF6B00] text-white text-xs rounded-full px-2 py-0.5">
                    {countActiveFilters()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowMobileFilters(false)}
                />
                <div className="absolute inset-x-0 bottom-0 bg-zinc-900 rounded-t-2xl max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 text-zinc-400 hover:text-white"
                    >
                      <Icon icon="mdi:close" className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <SearchFilters
                      filters={filters}
                      setFilters={setFilters}
                      onClearFilters={handleClearFilters}
                    />
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-[#FF6B00] text-white py-3 rounded-lg font-medium hover:bg-[#E65A00] transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="w-full lg:w-3/4">
              {/* Enhanced SortControls with integrated search and location filters */}
              <SortControls
                sortOption={sortOption}
                setSortOption={setSortOption}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                itemCount={totalTrainers}
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
              {loading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                  <Icon
                    icon="line-md:loading-loop"
                    className="w-8 h-8 sm:w-12 sm:h-12 text-[#FF6B00]"
                  />
                </div>
              ) : (
                <>
                  {trainers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 lg:max-xl:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8">
                      {trainers.map((trainer) => (
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
                </>
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
            experience: selectedTrainer.trainerSince
              ? `${
                  new Date().getFullYear() - selectedTrainer.trainerSince
                }+ years`
              : "",
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
