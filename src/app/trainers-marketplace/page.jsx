"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { Navigation } from "@/components/custom/home-page/shared";
import {
  TrainersList,
  TrainerProfileModal,
  SearchFilters,
} from "@/components/custom/home-page/trainers-marketplace/components";
import { NoResults, Pagination } from "@/components/custom/shared";
import { mapSpecialtyToLabel } from "@/utils/specialtyMapper";

export default function TrainersMarketplace() {
  const [trainers, setTrainers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: [],
    availability: [],
    price: { min: 0, max: 200 },
    rating: 0,
    tags: [],
  });
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationResolved, setLocationResolved] = useState(false);
  const [sortOption, setSortOption] = useState("location");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 8; // Changed from 9 to 8 for better grid alignment
  const totalPages = Math.ceil(trainers.length / trainersPerPage);
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = trainers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Get user location on mount, then resolve
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationResolved(true);
        },
        () => {
          setUserLocation(null); // fallback to no location
          setLocationResolved(true);
        }
      );
    } else {
      setLocationResolved(true);
    }
  }, []);

  // Fetch trainers from API whenever filters/search/userLocation/locationResolved change
  useEffect(() => {
    if (!locationResolved) return;
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        let url = "/api/users/trainers?limit=100";
        const params = [];
        if (userLocation) {
          params.push(`lat=${userLocation.lat}`);
          params.push(`lon=${userLocation.lon}`);
        }
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        filters.location.forEach((loc) => {
          params.push(`location=${encodeURIComponent(loc)}`);
        });
        filters.availability.forEach((a) => {
          params.push(`availability=${encodeURIComponent(a)}`);
        });
        if (typeof filters.price.min === "number") {
          params.push(`priceMin=${filters.price.min}`);
        }
        if (typeof filters.price.max === "number") {
          params.push(`priceMax=${filters.price.max}`);
        }
        if (filters.rating > 0) {
          params.push(`rating=${filters.rating}`);
        }
        filters.tags.forEach((tag) => {
          params.push(`tag=${encodeURIComponent(tag)}`);
        });
        if (sortOption) {
          params.push(`sortBy=${sortOption}`);
        }
        if (sortOrder) {
          params.push(`sortOrder=${sortOrder}`);
        }
        if (params.length > 0) {
          url += "&" + params.join("&");
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();
        const formattedTrainers = data.trainers.map((trainer) => {
          // Map specialties to their proper labels
          const formattedSpecialties =
            trainer.specialties?.map((s) => mapSpecialtyToLabel(s.name)) || [];

          // Format gyms if available
          let gyms = [];
          if (trainer.location && Array.isArray(trainer.location.gyms)) {
            gyms = trainer.location.gyms;
          }

          return {
            id: trainer.id,
            name: `${trainer.firstName} ${trainer.lastName}`,
            firstName: trainer.firstName,
            lastName: trainer.lastName,
            bio: trainer.description || "",
            location: trainer.location ? `${trainer.location.city}` : "",
            rating: trainer.trainerInfo?.rating || 0,
            price: trainer.pricePerSession || 0,
            currency: trainer.currency || "USD",
            experience: trainer.trainingSince || 0,
            image:
              trainer.profileImage ||
              "https://st3.depositphotos.com/9998432/19552/v/450/depositphotos_195522150-stock-illustration-default-placeholder-fitness-trainer-in.jpg",
            specialties: formattedSpecialties,
            availability:
              trainer.availabilities?.map(
                (a) => `${a.weekday} ${a.timeSlot}`
              ) || [],
            tags: formattedSpecialties, // Use the same formatted specialties for tags
            contactEmail: trainer.contactEmail,
            contactPhone: trainer.contactPhone,
            sessionDuration: trainer.sessionDuration,
            cancellationPolicy: trainer.cancellationPolicy,
            certifications:
              trainer.certifications?.map((cert) => ({
                id: cert.id,
                name: cert.name,
                issuer: cert.issuer,
                expiryDate: cert.expiryDate,
                status: cert.status,
                issueDate: cert.createdAt,
              })) || [],
            reviewCount: trainer.trainerInfo?.reviewCount || 0,
            isVerified: trainer.trainerInfo?.isVerified || false,
            distance: trainer.distance ?? null,
            distanceSource: trainer.distanceSource ?? null,
            gyms,
          };
        });
        setTrainers(formattedTrainers);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainers();
  }, [
    userLocation,
    locationResolved,
    filters,
    searchQuery,
    sortOption,
    sortOrder,
  ]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handleTrainerClick = (trainer) => {
    setSelectedTrainer(trainer);
    setIsProfileOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      location: [],
      availability: [],
      price: { min: 0, max: 200 },
      rating: 0,
      tags: [],
    });
    setSearchQuery("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!locationResolved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-[#FF6B00] border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400">Loading trainers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="w-16 h-16 text-red-500 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Error Loading Trainers</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button
            variant="orangeFilled"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
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

        <main className="container mx-auto px-4 py-8 sm:py-16 mt-16 sm:mt-24">
          {/* Page Title with search stats */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              <div className="max-w-xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent mb-2 sm:mb-4">
                  Find Your Perfect Trainer
                </h1>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Connect with certified professionals who specialize in ancient
                  Greek training methods
                </p>
              </div>
              {!isLoading && (
                <div className="inline-flex items-center px-4 py-2.5 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 whitespace-nowrap">
                  <Icon
                    icon="mdi:account-group"
                    className="text-[#FF6B00] text-xl min-w-[20px] mr-2 sm:mr-3"
                  />
                  <span className="text-zinc-300">
                    <span className="font-semibold text-white">
                      {trainers.length}
                    </span>
                    <span className="mx-1">trainers found</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile filter toggle button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setIsFilterSidebarOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 py-3 text-base shadow-md hover:bg-zinc-800 transition-colors"
            >
              <Icon
                icon="mdi:filter-variant"
                className="w-5 h-5 text-[#FF6B00]"
              />
              <span className="font-medium">Filters</span>
              {Object.values(filters).flat().filter(Boolean).length > 0 && (
                <span className="bg-[#FF6B00] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center ml-1">
                  {Object.values(filters).flat().filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Filters sidebar for desktop */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
              <div className="sticky top-24">
                <SearchFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filters={filters}
                  setFilters={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            {/* Mobile filter sidebar */}
            <div
              className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
                isFilterSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsFilterSidebarOpen(false)}
              ></div>
              <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-900 border-r border-zinc-800 overflow-y-auto shadow-xl">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    className="p-1"
                  >
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-4">
                  <SearchFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>
                <div className="p-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-900 z-10">
                  <Button
                    variant="orangeFilled"
                    size="medium"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    className="w-full"
                  >
                    Apply Filters ({trainers.length} results)
                  </Button>
                </div>
              </div>
            </div>

            {/* Trainers section */}
            <div className="lg:col-span-9 xl:col-span-9">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] sm:min-h-[500px] bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-t-4 border-[#FF6B00] border-solid rounded-full animate-spin mb-4"></div>
                  <p className="text-zinc-400">Loading trainers...</p>
                </div>
              ) : trainers.length > 0 ? (
                <>
                  <TrainersList
                    trainers={currentTrainers}
                    onTrainerClick={handleTrainerClick}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      variant="orange"
                    />
                  )}
                </>
              ) : (
                <NoResults
                  onClearFilters={handleClearFilters}
                  variant="orange"
                  title="No trainers found"
                  message="We couldn't find any trainers matching your current filters. Try adjusting your search criteria or clearing all filters."
                />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Trainer Profile Modal */}
      {selectedTrainer && (
        <TrainerProfileModal
          trainer={selectedTrainer}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
}
