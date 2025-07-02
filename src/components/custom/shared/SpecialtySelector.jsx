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
    <div className={`space-y-6 ${className}`}>
      {/* Header with title, description and counter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-300 flex items-center">
            <Icon
              icon="mdi:star-circle"
              className="mr-2 text-[#FF6B00]"
              width={18}
              height={18}
            />
            Choose Your Expertise Areas
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Pick the fitness areas where you have knowledge and experience
          </p>
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-medium">
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
          className="flex flex-wrap gap-3"
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
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "shadow-lg shadow-[#FF6B00]/25 scale-105"
                      : "border border-[#333] hover:border-[#FF6B00]/50 hover:text-white hover:bg-[#FF6B00]/10"
                  }`}
                >
                  <Icon
                    icon={specialty.icon || "mdi:star"}
                    width={16}
                    height={16}
                    className={isSelected ? "text-white" : "text-gray-400"}
                  />
                  <span>{specialty.label}</span>
                  {isSelected && (
                    <Icon
                      icon="mdi:check"
                      width={14}
                      height={14}
                      className="text-white ml-1"
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
