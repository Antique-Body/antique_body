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
    <div className={`space-y-8 ${className}`}>
      {/* Training Environment Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-300 flex items-center">
              <Icon
                icon="mdi:home-variant"
                className="mr-2 text-[#FF6B00]"
                width={18}
                height={18}
              />
              Training Environment
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Where do you prefer to conduct your training sessions?
            </p>
          </div>

          {selectedEnvironment && (
            <div className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-medium">
              {TRAINING_ENVIRONMENTS.find(
                (env) => env.id === selectedEnvironment
              )?.label || "Selected"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAINING_ENVIRONMENTS.map((env) => (
            <motion.div
              key={env.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-full"
            >
              <Button
                variant={
                  selectedEnvironment === env.id ? "orangeOutline" : "secondary"
                }
                type="button"
                onClick={() => onEnvironmentChange(env.id)}
                className={`w-full h-full rounded-xl text-left transition-all duration-200 p-0 overflow-hidden ${
                  selectedEnvironment === env.id
                    ? "border-[#FF6B00]/40 shadow-lg shadow-[#FF6B00]/5"
                    : "border-[#333] hover:border-[#444]"
                }`}
              >
                <div className={`w-full h-full flex flex-col`}>
                  {/* Header */}
                  <div
                    className={`p-4 flex items-center gap-3 ${
                      selectedEnvironment === env.id
                        ? "bg-[#FF6B00]/10"
                        : "bg-[rgba(35,35,35,0.7)]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
                        selectedEnvironment === env.id
                          ? "bg-[#FF6B00]/20"
                          : "bg-[rgba(255,255,255,0.05)]"
                      }`}
                    >
                      <Icon
                        icon={env.icon}
                        className={`text-2xl ${
                          selectedEnvironment === env.id
                            ? "text-[#FF6B00]"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium text-base ${
                        selectedEnvironment === env.id
                          ? "text-[#FF6B00]"
                          : "text-gray-300"
                      }`}
                    >
                      {env.label}
                    </span>

                    {selectedEnvironment === env.id && (
                      <Icon
                        icon="mdi:check-circle"
                        className="ml-auto text-[#FF6B00]"
                        width={20}
                        height={20}
                      />
                    )}
                  </div>

                  {/* Description */}
                  <div
                    className={`p-4 flex-grow ${
                      selectedEnvironment === env.id
                        ? "bg-[#FF6B00]/5"
                        : "bg-[rgba(30,30,30,0.5)]"
                    }`}
                  >
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {env.description}
                    </p>
                  </div>
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
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />

      {/* Training Types Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-300 flex items-center">
              <Icon
                icon="mdi:dumbbell"
                className="mr-2 text-[#FF6B00]"
                width={18}
                height={18}
              />
              Training Types
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Select all types of training you offer (multiple selections
              allowed)
            </p>
          </div>

          {selectedTypes.length > 0 && (
            <div className="px-3 py-1 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg text-[#FF6B00] text-xs font-medium">
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
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
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

      {/* Selected summary */}
      {(selectedEnvironment || selectedTypes.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#333] rounded-lg space-y-3"
        >
          <h4 className="text-sm font-medium text-gray-300 flex items-center">
            <Icon
              icon="mdi:check-circle"
              className="mr-2 text-[#FF6B00]"
              width={16}
              height={16}
            />
            Your Training Preferences
          </h4>

          <div className="space-y-3 text-sm">
            {selectedEnvironment && (
              <div className="flex items-center gap-2">
                <div className="w-24 text-gray-400">Environment:</div>
                <div className="px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-xs rounded-full font-medium inline-flex items-center">
                  <Icon
                    icon="mdi:home-variant"
                    className="mr-1"
                    width={14}
                    height={14}
                  />
                  {
                    TRAINING_ENVIRONMENTS.find(
                      (env) => env.id === selectedEnvironment
                    )?.label
                  }
                </div>
              </div>
            )}

            {selectedTypes.length > 0 && (
              <div className="flex gap-2">
                <div className="w-24 text-gray-400 shrink-0 pt-1">Types:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((typeId) => {
                    const type = TRAINING_TYPES.find((t) => t.id === typeId);
                    return (
                      <div
                        key={typeId}
                        className="px-3 py-1 bg-[#FF6B00]/20 text-[#FF6B00] text-xs rounded-full font-medium inline-flex items-center"
                      >
                        <Icon
                          icon={type?.icon || "mdi:star"}
                          className="mr-1"
                          width={14}
                          height={14}
                        />
                        {type?.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
