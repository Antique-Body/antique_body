"use client";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/common/Button";
import { ErrorIcon } from "@/components/common/Icons";
import { TRAINING_ENVIRONMENTS } from "@/enums/specialties";
import { TRAINING_TYPES } from "@/enums/trainingTypes";

export const TrainingTypeSelector = ({
  selectedEnvironment,
  selectedTypes = [],
  onEnvironmentChange,
  onTypeToggle,
  errorEnvironment,
  errorTypes,
  className = "",
}) => {
  // Group training types by category
  const typesByCategory = TRAINING_TYPES.reduce((acc, type) => {
    const category = type.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(type);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(typesByCategory).sort();

  return (
    <div className={`space-y-4 sm:space-y-6 lg:space-y-8 ${className}`}>
      {/* Training Environment Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3 sm:space-y-4 lg:space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2 sm:gap-3">
              <div className="w-0.5 h-4 sm:w-1 sm:h-5 lg:h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full"></div>
              <Icon
                icon="mdi:home-variant"
                className="text-[#FF6B00]"
                width={18}
                height={18}
                className="sm:w-[20px] sm:h-[20px]"
              />
              Training Environment
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Where do you prefer to conduct your training sessions?
            </p>
          </div>

          {selectedEnvironment && (
            <div className="self-start sm:self-auto px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#FF6B00]/15 to-[#FF8A00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-semibold backdrop-blur-sm shadow-sm">
              {TRAINING_ENVIRONMENTS.find(
                (env) => env.id === selectedEnvironment
              )?.label || "Selected"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
          {TRAINING_ENVIRONMENTS.map((env) => (
            <motion.div
              key={env.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-full"
            >
              <Button
                variant={
                  selectedEnvironment === env.id ? "orangeOutline" : "secondary"
                }
                type="button"
                onClick={() => onEnvironmentChange(env.id)}
                className={`w-full h-full rounded-xl sm:rounded-2xl text-left transition-all duration-300 p-0 overflow-hidden border-2 group ${
                  selectedEnvironment === env.id
                    ? "border-[#FF6B00]/50 shadow-xl shadow-[#FF6B00]/10 bg-gradient-to-br from-[#FF6B00]/5 to-transparent"
                    : "border-zinc-800/50 hover:border-zinc-700/50 bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 backdrop-blur-sm"
                }`}
              >
                <div className="w-full h-full flex flex-col relative">
                  {/* Subtle gradient overlay */}
                  {selectedEnvironment === env.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/3 via-transparent to-transparent pointer-events-none" />
                  )}

                  {/* Header */}
                  <div className="relative z-10 p-3 sm:p-4 lg:p-6 flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg sm:rounded-xl transition-all duration-300 ${
                        selectedEnvironment === env.id
                          ? "bg-[#FF6B00]/20 border border-[#FF6B00]/30"
                          : "bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-zinc-700/50"
                      }`}
                    >
                      <Icon
                        icon={env.icon}
                        className={`text-lg sm:text-xl lg:text-2xl transition-colors duration-300 ${
                          selectedEnvironment === env.id
                            ? "text-[#FF6B00]"
                            : "text-zinc-400 group-hover:text-zinc-300"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                          selectedEnvironment === env.id
                            ? "text-[#FF6B00]"
                            : "text-white group-hover:text-zinc-100"
                        }`}
                      >
                        {env.label}
                      </h4>
                    </div>

                    {selectedEnvironment === env.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        <Icon
                          icon="mdi:check-circle"
                          className="text-[#FF6B00]"
                          width={20}
                          height={20}
                          className="sm:w-[24px] sm:h-[24px]"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="relative z-10 px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 flex-grow">
                    <p
                      className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                        selectedEnvironment === env.id
                          ? "text-zinc-300"
                          : "text-zinc-400 group-hover:text-zinc-300"
                      }`}
                    >
                      {env.description}
                    </p>
                  </div>

                  {/* Bottom accent line for selected */}
                  {selectedEnvironment === env.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent" />
                  )}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {errorEnvironment && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex items-center text-sm text-red-500"
          >
            <ErrorIcon size={16} className="mr-2" />
            {errorEnvironment}
          </motion.p>
        )}
      </motion.div>

      {/* Divider */}
      <hr className="h-px bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.2)] to-transparent my-4 sm:my-6" />

      {/* Training Types Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-5"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full"></div>
              <Icon
                icon="mdi:dumbbell"
                className="text-[#FF6B00]"
                width={20}
                height={20}
              />
              Training Types
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Select all types of training you offer (multiple selections
              allowed)
            </p>
          </div>

          {selectedTypes.length > 0 && (
            <div className="self-start sm:self-auto px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#FF6B00]/15 to-[#FF8A00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-semibold backdrop-blur-sm shadow-sm">
              {selectedTypes.length} selected
            </div>
          )}
        </div>

        <AnimatePresence>
          {sortedCategories.map((category) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5"
            >
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Icon
                  icon="mdi:folder"
                  className="mr-2 text-gray-500"
                  width={15}
                  height={15}
                />
                {category}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {typesByCategory[category].map((type) => {
                  const isSelected = selectedTypes.includes(type.id);

                  return (
                    <motion.div
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Button
                        variant={isSelected ? "orangeOutline" : "secondary"}
                        type="button"
                        onClick={() => onTypeToggle(type.id)}
                        className={`w-full justify-start flex p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-[#FF6B00]/10 border-[#FF6B00]/40 text-[#FF6B00]"
                            : "bg-[rgba(30,30,30,0.5)] text-gray-300 hover:border-[#444] hover:bg-[rgba(40,40,40,0.7)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${
                              isSelected
                                ? "bg-[#FF6B00]/20"
                                : "bg-[rgba(255,255,255,0.05)]"
                            }`}
                          >
                            <Icon
                              icon={type.icon || "mdi:star"}
                              className={
                                isSelected ? "text-[#FF6B00]" : "text-gray-400"
                              }
                              width={18}
                              height={18}
                            />
                          </div>
                          <span className="font-medium text-sm">
                            {type.label}
                          </span>
                          {isSelected && (
                            <Icon
                              icon="mdi:check-circle"
                              width={18}
                              height={18}
                              className="ml-auto text-[#FF6B00]"
                            />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {errorTypes && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 flex items-center text-sm text-red-500"
          >
            <ErrorIcon size={16} className="mr-2" />
            {errorTypes}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
