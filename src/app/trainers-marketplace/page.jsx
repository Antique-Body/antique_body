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
import { extendedTrainers } from "@/data/trainersData";

export default function TrainersMarketplace() {
    const [filteredTrainers, setFilteredTrainers] = useState(extendedTrainers);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        specialty: [],
        location: [],
        availability: [],
        price: { min: 0, max: 200 },
        rating: 0,
        tags: [],
    });
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const trainersPerPage = 9;
    const totalPages = Math.ceil(filteredTrainers.length / trainersPerPage);
    const indexOfLastTrainer = currentPage * trainersPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
    const currentTrainers = filteredTrainers.slice(indexOfFirstTrainer, indexOfLastTrainer);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Handle search and filtering
    useEffect(() => {
        let results = [...extendedTrainers];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            results = results.filter(
                (trainer) =>
                    trainer.name.toLowerCase().includes(query) ||
                    trainer.specialty.toLowerCase().includes(query) ||
                    trainer.bio.toLowerCase().includes(query) ||
                    (trainer.tags && trainer.tags.some((tag) => tag.toLowerCase().includes(query)))
            );
        }

        // Specialty filter
        if (filters.specialty.length > 0) {
            results = results.filter((trainer) => filters.specialty.includes(trainer.specialty));
        }

        // Location filter
        if (filters.location.length > 0) {
            results = results.filter((trainer) => filters.location.includes(trainer.location));
        }

        // Availability filter
        if (filters.availability.length > 0) {
            results = results.filter(
                (trainer) => trainer.availability && trainer.availability.some((day) => filters.availability.includes(day))
            );
        }

        // Price filter
        results = results.filter((trainer) => trainer.price >= filters.price.min && trainer.price <= filters.price.max);

        // Rating filter
        if (filters.rating > 0) {
            results = results.filter((trainer) => trainer.rating >= filters.rating);
        }

        // Tags filter
        if (filters.tags.length > 0) {
            results = results.filter((trainer) => trainer.tags && trainer.tags.some((tag) => filters.tags.includes(tag)));
        }

        setFilteredTrainers(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchQuery, filters]);

    const handleTrainerClick = (trainer) => {
        setSelectedTrainer(trainer);
        setIsProfileOpen(true);
    };

    const handleClearFilters = () => {
        setFilters({
            specialty: [],
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
        // Scroll to top smoothly when changing pages
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
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };

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

                <main className="container mx-auto px-4 py-16 mt-24">
                    {/* Page Title with search stats - Made more flexible for translations */}
                    <div className="mb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="max-w-xl">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent mb-4">
                                    Find Your Perfect Trainer
                                </h1>
                                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                                    Connect with certified professionals who specialize in ancient Greek training methods
                                </p>
                            </div>
                            {!isLoading && (
                                <div className="inline-flex items-center px-5 py-3 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-800 whitespace-nowrap">
                                    <Icon icon="mdi:account-group" className="text-[#FF6B00] text-xl min-w-[20px] mr-3" />
                                    <span className="text-zinc-300">
                                        <span className="font-semibold text-white">{filteredTrainers.length}</span>
                                        <span className="mx-1">trainers found</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Filters sidebar - Increased width for translation flexibility */}
                        <div className="lg:col-span-3 xl:col-span-3">
                            <div className="sticky top-24">
                                <SearchFilters
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    filters={filters}
                                    setFilters={setFilters}
                                    onClearFilters={handleClearFilters}
                                    trainers={extendedTrainers}
                                />
                            </div>
                        </div>

                        {/* Trainers section - Adapted to fill remaining space */}
                        <div className="lg:col-span-9 xl:col-span-9">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center min-h-[500px] bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-800">
                                    <div className="w-16 h-16 border-t-4 border-[#FF6B00] border-solid rounded-full animate-spin mb-4"></div>
                                    <p className="text-zinc-400">Loading trainers...</p>
                                </div>
                            ) : (
                                <>
                                    {filteredTrainers.length > 0 ? (
                                        <>
                                            <TrainersList trainers={currentTrainers} onTrainerClick={handleTrainerClick} />

                                            {/* Pagination - Made more flexible for translations */}
                                            {totalPages > 1 && (
                                                <div className="mt-12 mb-8 flex justify-center">
                                                    <nav className="flex flex-wrap items-center justify-center gap-2">
                                                        {/* Previous page button with text label for better accessibility */}
                                                        <button
                                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                            disabled={currentPage === 1}
                                                            className={`flex items-center px-4 py-2 rounded-lg ${
                                                                currentPage === 1
                                                                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                                                            }`}
                                                            aria-label="Go to previous page"
                                                        >
                                                            <Icon icon="mdi:chevron-left" className="w-5 h-5 mr-1" />
                                                            <span className="text-sm">Previous</span>
                                                        </button>

                                                        {/* Page numbers - in a scrollable container on small screens */}
                                                        <div className="flex items-center overflow-x-auto max-w-[250px] sm:max-w-none hide-scrollbar py-1">
                                                            {generatePaginationNumbers().map((pageNum, index) => (
                                                                <div key={index} className="px-1">
                                                                    {pageNum === "..." ? (
                                                                        <span className="px-3 py-2 text-zinc-500">...</span>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handlePageChange(pageNum)}
                                                                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                                                                                currentPage === pageNum
                                                                                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium"
                                                                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                                                            }`}
                                                                        >
                                                                            {pageNum}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Next page button with text label for better accessibility */}
                                                        <button
                                                            onClick={() =>
                                                                handlePageChange(Math.min(totalPages, currentPage + 1))
                                                            }
                                                            disabled={currentPage === totalPages}
                                                            className={`flex items-center px-4 py-2 rounded-lg ${
                                                                currentPage === totalPages
                                                                    ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                                                            }`}
                                                            aria-label="Go to next page"
                                                        >
                                                            <span className="text-sm">Next</span>
                                                            <Icon icon="mdi:chevron-right" className="w-5 h-5 ml-1" />
                                                        </button>
                                                    </nav>
                                                </div>
                                            )}

                                            {/* Page indication for better user orientation */}
                                            {totalPages > 1 && (
                                                <div className="text-center text-zinc-500 text-sm mb-4">
                                                    Page {currentPage} of {totalPages}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-24 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800">
                                            <Icon icon="mdi:account-search" className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
                                            <h3 className="text-xl font-medium mb-4">No trainers found</h3>
                                            <p className="text-zinc-400 mb-8 max-w-md mx-auto px-4">
                                                We couldn't find any trainers matching your current filters. Try adjusting your
                                                search criteria or clearing all filters.
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
                <TrainerProfileModal trainer={selectedTrainer} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            )}
        </div>
    );
}
