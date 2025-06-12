"use client";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { SPECIALTIES } from "@/enums/specialties";

export const SpecialtySelector = ({
  selectedSpecialties = [],
  onChange,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const getSelectedSpecialtyLabels = () =>
    selectedSpecialties
      .map((id) => SPECIALTIES.find((spec) => spec.id === id)?.label)
      .filter(Boolean);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with search and counter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <FormField
            type="text"
            name="specialtySearch"
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-0 bg-[#1a1a1a] border-[#333] rounded-lg"
            prefixIcon="mdi:magnify"
          />
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg">
            <Icon
              icon="mdi:check-circle"
              width={16}
              height={16}
              className="text-[#FF6B00]"
            />
            <span className="text-sm text-[#FF6B00] font-medium">
              {selectedSpecialties.length} selected
            </span>
            <Button
              variant="orangeText"
              type="button"
              onClick={() => onChange([])}
              className="ml-2 text-xs text-[#FF6B00] hover:text-[#FF6B00]/80 font-medium transition-colors"
            >
              Clear
            </Button>
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
          className="flex flex-wrap gap-2"
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

      {/* Selected Specialties Preview */}
      {selectedSpecialties.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Icon
              icon="mdi:bookmark-check"
              className="mr-2 text-[#FF6B00]"
              width={16}
              height={16}
            />
            Your Selected Specialties
          </h4>
          <div className="flex flex-wrap gap-2">
            {getSelectedSpecialtyLabels().map((label, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[#FF6B00]/20 text-[#FF6B00] text-xs rounded-full font-medium flex items-center"
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
