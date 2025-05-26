import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export const FilterChips = ({ filters, setFilters, searchQuery, setSearchQuery }) => {
    const removeSpecialty = (specialty) => {
        setFilters((prev) => ({
            ...prev,
            specialty: prev.specialty.filter((s) => s !== specialty),
        }));
    };

    const removeLocation = (location) => {
        setFilters((prev) => ({
            ...prev,
            location: prev.location.filter((l) => l !== location),
        }));
    };

    const removeAvailability = (day) => {
        setFilters((prev) => ({
            ...prev,
            availability: prev.availability.filter((d) => d !== day),
        }));
    };

    const removeTag = (tag) => {
        setFilters((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const resetPrice = () => {
        setFilters((prev) => ({
            ...prev,
            price: { min: 0, max: 200 },
        }));
    };

    const resetRating = () => {
        setFilters((prev) => ({
            ...prev,
            rating: 0,
        }));
    };

    const chipVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 10,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.2,
            },
        },
    };

    return (
        <div className="flex flex-wrap gap-2">
            <AnimatePresence>
                {searchQuery && (
                    <motion.div
                        key="search-query"
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full"
                    >
                        <Icon icon="mdi:magnify" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-white truncate max-w-[150px]">{searchQuery}</span>
                        <button onClick={() => setSearchQuery("")} className="ml-1.5 text-[#FF6B00] hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}

                {filters.specialty.map((specialty) => (
                    <motion.div
                        key={`specialty-${specialty}`}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <span className="text-xs text-zinc-300 truncate max-w-[120px]">{specialty}</span>
                        <button onClick={() => removeSpecialty(specialty)} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}

                {filters.location.map((location) => (
                    <motion.div
                        key={`location-${location}`}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-zinc-300 truncate max-w-[120px]">{location}</span>
                        <button onClick={() => removeLocation(location)} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}

                {filters.availability.map((day) => (
                    <motion.div
                        key={`day-${day}`}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <Icon icon="mdi:calendar" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-zinc-300">{day}</span>
                        <button onClick={() => removeAvailability(day)} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}

                {(filters.price.min > 0 || filters.price.max < 200) && (
                    <motion.div
                        key="price-range"
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <Icon icon="mdi:currency-usd" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-zinc-300">
                            ${filters.price.min} - ${filters.price.max}
                        </span>
                        <button onClick={resetPrice} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}

                {filters.rating > 0 && (
                    <motion.div
                        key="rating-filter"
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <Icon icon="mdi:star" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-zinc-300">{filters.rating}+ Stars</span>
                        <button onClick={resetRating} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}

                {filters.tags.map((tag) => (
                    <motion.div
                        key={`tag-${tag}`}
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-full"
                    >
                        <Icon icon="mdi:tag" className="w-3.5 h-3.5 text-[#FF6B00] mr-1" />
                        <span className="text-xs text-zinc-300 truncate max-w-[100px]">{tag}</span>
                        <button onClick={() => removeTag(tag)} className="ml-1.5 text-zinc-400 hover:text-white">
                            <Icon icon="mdi:close" className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
