"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { Footer } from "@/components/common/Footer";
import { Navigation } from "@/components/custom/home-page/shared";
import {
  TrainersList,
  SearchFilters,
  TrainerProfileModal,
} from "@/components/custom/home-page/trainers-marketplace/components";
import { mapSpecialtyToLabel } from "@/utils/specialtyMapper";

export default function TrainersMarketplace() {
  const [trainers, setTrainers] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 8; // Changed from 9 to 8 for better grid alignment
  const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(
    indexOfFirstTrainer,
    indexOfLastTrainer
  );

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/trainers");
        if (!response.ok) {
          throw new Error("Failed to fetch trainers");
        }
        const data = await response.json();
        const formattedTrainers = data.trainers.map((trainer) => {
          // Map specialties to their proper labels
          const formattedSpecialties =
            trainer.specialties?.map((s) => mapSpecialtyToLabel(s.name)) || [];

          return {
            id: trainer.id,
            name: `${trainer.firstName} ${trainer.lastName}`,
            firstName: trainer.firstName,
            lastName: trainer.lastName,
            bio: trainer.description || "",
            location: trainer.location
              ? `${trainer.location.city}, ${trainer.location.country}`
              : "",
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
          };
        });
        setTrainers(formattedTrainers);
        setFilteredTrainers(formattedTrainers);
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let results = [...trainers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (trainer) =>
          trainer.name.toLowerCase().includes(query) ||
          trainer.bio.toLowerCase().includes(query) ||
          (trainer.specialties &&
            trainer.specialties.some((specialty) =>
              specialty.toLowerCase().includes(query)
            ))
      );
    }

    // Location filter
    if (filters.location.length > 0) {
      results = results.filter((trainer) =>
        filters.location.includes(trainer.location)
      );
    }

    // Availability filter
    if (filters.availability.length > 0) {
      results = results.filter(
        (trainer) =>
          trainer.availability &&
          trainer.availability.some((day) => filters.availability.includes(day))
      );
    }

    // Price filter
    results = results.filter(
      (trainer) =>
        trainer.price >= filters.price.min && trainer.price <= filters.price.max
    );

    // Rating filter
    if (filters.rating > 0) {
      results = results.filter((trainer) => trainer.rating >= filters.rating);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      results = results.filter(
        (trainer) =>
          trainer.specialties &&
          trainer.specialties.some((tag) => filters.tags.includes(tag))
      );
    }

    setFilteredTrainers(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, trainers]);

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
                      {filteredTrainers.length}
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
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 py-3 text-base"
            >
              <Icon icon="mdi:filter-variant" className="w-5 h-5" />
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
                  trainers={trainers}
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
              <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
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
                    trainers={trainers}
                    isMobile={true}
                  />
                </div>
                <div className="p-4 border-t border-zinc-800">
                  <Button
                    variant="orangeFilled"
                    size="medium"
                    onClick={() => setIsFilterSidebarOpen(false)}
                    className="w-full"
                  >
                    Apply Filters ({filteredTrainers.length} results)
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
              ) : (
                <>
                  {filteredTrainers.length > 0 ? (
                    <>
                      <TrainersList
                        trainers={currentTrainers}
                        onTrainerClick={handleTrainerClick}
                      />

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 flex justify-center">
                          <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                            <Button
                              onClick={() =>
                                handlePageChange(Math.max(1, currentPage - 1))
                              }
                              disabled={currentPage === 1}
                              variant={
                                currentPage === 1 ? "ghost" : "secondary"
                              }
                              className={`flex items-center px-2 sm:px-4 py-2 rounded-lg ${
                                currentPage === 1
                                  ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                              }`}
                              aria-label="Go to previous page"
                              leftIcon={
                                <Icon
                                  icon="mdi:chevron-left"
                                  className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-1"
                                />
                              }
                            >
                              <span className="text-xs sm:text-sm hidden sm:inline">
                                Previous
                              </span>
                            </Button>

                            <div className="flex items-center overflow-x-auto max-w-[180px] sm:max-w-none hide-scrollbar py-1">
                              {generatePaginationNumbers().map(
                                (pageNum, index) => (
                                  <div key={index} className="px-0.5 sm:px-1">
                                    {pageNum === "..." ? (
                                      <span className="px-2 sm:px-3 py-2 text-zinc-500">
                                        ...
                                      </span>
                                    ) : (
                                      <Button
                                        onClick={() =>
                                          handlePageChange(pageNum)
                                        }
                                        variant={
                                          currentPage === pageNum
                                            ? "orangeFilled"
                                            : "secondary"
                                        }
                                        className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
                                          currentPage === pageNum
                                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium"
                                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                        }`}
                                      >
                                        {pageNum}
                                      </Button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>

                            <Button
                              onClick={() =>
                                handlePageChange(
                                  Math.min(totalPages, currentPage + 1)
                                )
                              }
                              disabled={currentPage === totalPages}
                              variant={
                                currentPage === totalPages
                                  ? "ghost"
                                  : "secondary"
                              }
                              className={`flex items-center px-2 sm:px-4 py-2 rounded-lg ${
                                currentPage === totalPages
                                  ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                              }`}
                              aria-label="Go to next page"
                              rightIcon={
                                <Icon
                                  icon="mdi:chevron-right"
                                  className="w-4 h-4 sm:w-5 sm:h-5 ml-0 sm:ml-1"
                                />
                              }
                            >
                              <span className="text-xs sm:text-sm hidden sm:inline">
                                Next
                              </span>
                            </Button>
                          </nav>
                        </div>
                      )}

                      {/* Page indication */}
                      {totalPages > 1 && (
                        <div className="text-center text-zinc-500 text-xs sm:text-sm mb-4">
                          Page {currentPage} of {totalPages}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 sm:py-24 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800">
                      <Icon
                        icon="mdi:account-search"
                        className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-600 mx-auto mb-4 sm:mb-6"
                      />
                      <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4">
                        No trainers found
                      </h3>
                      <p className="text-zinc-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                        We couldn't find any trainers matching your current
                        filters. Try adjusting your search criteria or clearing
                        all filters.
                      </p>
                      <Button
                        variant="orangeOutline"
                        size="medium"
                        onClick={handleClearFilters}
                        className="min-w-[150px]"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
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
