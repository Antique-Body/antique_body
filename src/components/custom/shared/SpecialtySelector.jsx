"use client";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { SPECIALTIES } from "@/enums/specialties";

export const SpecialtySelector = ({
  selectedSpecialties = [],
  onChange,
  className = "",
}) => {
  const [searchTerm] = useState("");
  const [categorizedSpecialties, setCategorizedSpecialties] = useState({});
  const activeCategory = "all";
  // Extract unique categories and organize specialties by category
  useEffect(() => {
    const categories = {};

    // Add 'All' category
    categories.all = SPECIALTIES;

    // Group by category
    SPECIALTIES.forEach((specialty) => {
      const category = specialty.category || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(specialty);
    });

    setCategorizedSpecialties(categories);
  }, []);

  const filteredSpecialties = (
    categorizedSpecialties[activeCategory] || []
  ).filter((specialty) =>
    specialty.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpecialtyToggle = (specialtyId) => {
    const newSelection = selectedSpecialties.includes(specialtyId)
      ? selectedSpecialties.filter((id) => id !== specialtyId)
      : [...selectedSpecialties, specialtyId];

    onChange(newSelection);
  };

  return (
    <div className={`space-y-4 sm:space-y-5 lg:space-y-6 ${className}`}>
      {/* Header with title, description and counter */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-300 flex items-center">
            <Icon
              icon="mdi:star-circle"
              className="mr-2 text-[#FF6B00]"
              width={16}
              height={16}
              className="sm:w-[18px] sm:h-[18px]"
            />
            Choose Your Expertise Areas
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 leading-relaxed">
            Pick the fitness areas where you have knowledge and experience
          </p>
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="self-start sm:self-auto px-2.5 sm:px-3 py-1 sm:py-1.5 text-nowrap bg-gradient-to-r from-[#FF6B00]/15 to-[#FF8A00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-semibold backdrop-blur-sm shadow-sm">
            {selectedSpecialties.length} selected
          </div>
        )}
      </div>

      {/* Specialty Pills with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + searchTerm}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3"
        >
          {filteredSpecialties.map((specialty) => {
            const isSelected = selectedSpecialties.includes(specialty.id);

            return (
              <motion.div
                key={specialty.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant={isSelected ? "orangeFilled" : "secondary"}
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty.id)}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    isSelected
                      ? "shadow-lg shadow-[#FF6B00]/25 scale-105 ring-1 ring-[#FF6B00]/20"
                      : "border border-[rgba(255,107,0,0.2)] hover:border-[#FF6B00]/50 hover:text-white hover:bg-[#FF6B00]/15 hover:scale-105 backdrop-blur-sm"
                  }`}
                >
                  <Icon
                    icon={specialty.icon || "mdi:star"}
                    width={12}
                    height={12}
                    className={`flex-shrink-0 sm:w-[14px] sm:h-[14px] ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  />
                  <span className="text-xs leading-tight font-medium">
                    {specialty.label}
                  </span>
                  {isSelected && (
                    <Icon
                      icon="mdi:check"
                      width={10}
                      height={10}
                      className="text-white flex-shrink-0 sm:w-[12px] sm:h-[12px]"
                    />
                  )}
                </Button>
              </motion.div>
            );
          })}

          {/* No Results */}
          {filteredSpecialties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full text-center py-6 text-gray-400"
            >
              <Icon
                icon="mdi:magnify"
                width={24}
                height={24}
                className="mx-auto mb-2 opacity-50"
              />
              <p className="text-sm">
                {searchTerm
                  ? `No specialties found matching "${searchTerm}"`
                  : "No specialties in this category"}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
