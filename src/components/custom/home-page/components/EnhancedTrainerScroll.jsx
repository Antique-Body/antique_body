import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/common/Button";

export const EnhancedTrainerScroll = ({ trainers }) => {
    const [activeTrainer, setActiveTrainer] = useState(null);
    const [visibleIndex, setVisibleIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Function to check if scrolling is possible and update visible index
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

            // Check if we can scroll left/right
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

            // Calculate which card is most visible (centered in view)
            const cardWidth = 320 + 32; // Card width + gap
            const centerPosition = scrollLeft + clientWidth / 2;
            const newVisibleIndex = Math.min(Math.floor(centerPosition / cardWidth), trainers.length - 1);
            setVisibleIndex(Math.max(0, newVisibleIndex));
        }
    };

    // Set up scroll event listener
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScrollPosition);
            // Initial check
            checkScrollPosition();

            return () => {
                scrollContainer.removeEventListener("scroll", checkScrollPosition);
            };
        }
    }, [trainers.length]);

    const scrollToCard = (index) => {
        if (scrollContainerRef.current) {
            const cardWidth = 320 + 32; // Card width + gap
            const containerWidth = scrollContainerRef.current.clientWidth;
            const scrollPosition = index * cardWidth - (containerWidth - cardWidth) / 2;

            scrollContainerRef.current.scrollTo({
                left: Math.max(0, scrollPosition),
                behavior: "smooth",
            });
        }
    };

    const scrollLeft = () => {
        const newIndex = Math.max(0, visibleIndex - 1);
        scrollToCard(newIndex);
    };

    const scrollRight = () => {
        const newIndex = Math.min(trainers.length - 1, visibleIndex + 1);
        scrollToCard(newIndex);
    };

    return (
        <div className="relative w-full py-10">
            <div className="mb-12">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 gap-2 mb-4 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20">
                            <span className="text-[#FF6B00]">
                                <span className="mdi mdi-account-group text-sm" />
                            </span>
                            <span className="text-sm font-medium text-[#FF6B00]">Expert Trainers</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                                Connect with Top Trainers
                            </span>
                        </h2>

                        <p className="text-gray-300 max-w-2xl mt-3">
                            Connect with certified professionals who specialize in ancient Greek training methods, providing
                            personalized guidance for your unique fitness journey.
                        </p>
                    </div>

                    <Link href="/trainers" className="hidden md:block">
                        <Button variant="orangeOutline" size="small" className="flex items-center gap-2">
                            View All
                            <span className="mdi mdi-arrow-right" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Navigation Buttons - Always visible but conditionally active */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 md:left-4 z-20">
                <button
                    onClick={scrollLeft}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 group ${
                        canScrollLeft
                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:shadow-lg hover:shadow-[#FF6B00]/20"
                            : "bg-gray-800/50 backdrop-blur-sm cursor-not-allowed"
                    }`}
                    disabled={!canScrollLeft}
                >
                    <span
                        className={`mdi mdi-chevron-left text-2xl transform transition-transform ${canScrollLeft ? "group-hover:-translate-x-0.5" : "opacity-50"}`}
                    />
                </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-0 md:right-4 z-20">
                <button
                    onClick={scrollRight}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 group ${
                        canScrollRight
                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] hover:shadow-lg hover:shadow-[#FF6B00]/20"
                            : "bg-gray-800/50 backdrop-blur-sm cursor-not-allowed"
                    }`}
                    disabled={!canScrollRight}
                >
                    <span
                        className={`mdi mdi-chevron-right text-2xl transform transition-transform ${canScrollRight ? "group-hover:translate-x-0.5" : "opacity-50"}`}
                    />
                </button>
            </div>

            {/* Trainer Cards Container */}
            <div className="relative">
                {/* Fade gradient on edges - always present but animated based on scroll position */}
                <div
                    className="absolute left-0 top-0 bottom-8 w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent opacity-0 transition-opacity duration-300"
                    style={{ opacity: canScrollLeft ? 1 : 0 }}
                />

                <div
                    className="absolute right-0 top-0 bottom-8 w-16 md:w-24 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent opacity-0 transition-opacity duration-300"
                    style={{ opacity: canScrollRight ? 1 : 0 }}
                />

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-8 px-4 md:px-10 hide-scrollbar mask-image-fade-horizontal"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        scrollBehavior: "smooth",
                        maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent 100%)",
                    }}
                >
                    {trainers.map((trainer, index) => (
                        <div
                            key={trainer.id}
                            className="flex-shrink-0 w-[320px] snap-center"
                            onMouseEnter={() => setActiveTrainer(index)}
                            onMouseLeave={() => setActiveTrainer(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: activeTrainer === index ? 1.03 : 1,
                                }}
                                transition={{
                                    duration: 0.3,
                                    delay: Math.min(index * 0.05, 0.5),
                                    scale: { type: "spring", stiffness: 150 },
                                }}
                                className={`h-full bg-gradient-to-b from-[#121212] to-black/90 backdrop-blur-sm border rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6B00]/10 ${
                                    visibleIndex === index ? "border-[#FF6B00]/50" : "border-gray-800"
                                }`}
                            >
                                {/* Trainer image with enhanced overlay */}
                                <div className="h-[220px] relative overflow-hidden">
                                    {trainer.image ? (
                                        <Image
                                            src={trainer.image}
                                            alt={trainer.name}
                                            width={320}
                                            height={220}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                            <span className="mdi mdi-account text-4xl text-gray-700" />
                                        </div>
                                    )}

                                    {/* Enhanced image overlay with gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                                    {/* Refined specialization tag */}
                                    <div className="absolute top-3 right-3 bg-[#FF6B00]/10 backdrop-blur-sm px-2 py-1 rounded-full border border-[#FF6B00]/20">
                                        <span className="text-xs font-medium text-[#FF6B00]">{trainer.specialization}</span>
                                    </div>

                                    {/* Trainer info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-transform duration-300 group-hover:translate-y-1">
                                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{trainer.name}</h3>
                                        <p className="text-sm text-gray-400 flex items-center">
                                            <span className="mdi mdi-map-marker text-[#FF6B00] mr-1"></span>
                                            {trainer.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Trainer details and stats */}
                                <div className="p-4">
                                    {/* Rating and review count */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <div className="flex mr-1">
                                                {[...Array(Math.floor(trainer.rating))].map((_, i) => (
                                                    <span key={i} className="mdi mdi-star text-[#FF6B00] text-sm" />
                                                ))}
                                                {trainer.rating % 1 !== 0 && (
                                                    <span className="mdi mdi-star-half text-[#FF6B00] text-sm" />
                                                )}
                                            </div>
                                            <span className="text-white text-sm font-semibold">{trainer.rating}</span>
                                            <span className="text-gray-400 ml-1 text-xs">({trainer.reviewCount})</span>
                                        </div>

                                        <div className="bg-[#FF6B00]/10 px-2 py-1 rounded-full text-xs border border-[#FF6B00]/10">
                                            <span className="text-[#FF6B00]">{trainer.clientCount} clients</span>
                                        </div>
                                    </div>

                                    {/* Bio with line clamp */}
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

                                    {/* CTA button */}
                                    <Link href={`/trainers/${trainer.id}`}>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            className="w-full group border-gray-700 hover:border-[#FF6B00] transition-colors"
                                        >
                                            <span className="group-hover:text-[#FF6B00] transition-colors">View Profile</span>
                                            <span className="mdi mdi-arrow-right ml-2 group-hover:translate-x-1 transition-transform group-hover:text-[#FF6B00]" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Enhanced hover glow effect */}
                                <motion.div
                                    className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    animate={{
                                        boxShadow:
                                            activeTrainer === index || visibleIndex === index
                                                ? "0 0 20px 1px rgba(255, 107, 0, 0.2)"
                                                : "0 0 0px 0px rgba(255, 107, 0, 0)",
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Scroll indicator - progress bar style */}
            <div className="flex flex-col items-center mt-6 gap-2">
                {/* Elegant progress bar */}
                <div className="h-1 w-full max-w-md bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: `${(visibleIndex / Math.max(1, trainers.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Elegant dot indicators */}
                <div className="flex gap-2 mt-2">
                    {trainers.map((_, index) => (
                        <button key={index} className="group outline-none" onClick={() => scrollToCard(index)}>
                            <div
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === visibleIndex
                                        ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] scale-110"
                                        : "bg-gray-700 group-hover:bg-gray-500"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile CTA */}
            <div className="flex justify-center mt-8 md:hidden">
                <Link href="/trainers">
                    <Button variant="orangeOutline" size="small" className="flex items-center gap-2">
                        View All Trainers
                        <span className="mdi mdi-arrow-right" />
                    </Button>
                </Link>
            </div>
        </div>
    );
};
