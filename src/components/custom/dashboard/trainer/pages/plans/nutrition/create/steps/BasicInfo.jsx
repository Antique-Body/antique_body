"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import Image from "next/image";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { FormField } from "@/components/common/FormField";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { UPLOAD_CONFIG } from "@/config/upload";
import { updateFormData } from "@/lib/utils";

import { CoverImageUpload } from "../../../training/create/components/CoverImageUpload";

const GOAL_TYPES = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    description: "Calorie deficit focused",
    icon: "mdi:scale-bathroom",
  },
  {
    id: "muscle-gain",
    label: "Muscle Gain",
    description: "Protein and calorie surplus",
    icon: "mdi:dumbbell",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    description: "Balanced nutrition",
    icon: "mdi:scale-balance",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Athletic optimization",
    icon: "mdi:lightning-bolt",
  },
];

export const BasicInfo = ({ data, onChange, prefillForm, templates }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);

  // Handle edit mode - if coverImage is a string URL, set it as preview
  useEffect(() => {
    if (typeof data.coverImage === "string" && data.coverImage) {
      setPreviewImage(data.coverImage);
    } else if (!data.coverImage) {
      setPreviewImage(null);
    }
  }, [data.coverImage]);

  // Filter templates based on search term
  useEffect(() => {
    if (templates) {
      setFilteredTemplates(
        templates.filter(
          (tpl) =>
            tpl.title.toLowerCase().includes(search.toLowerCase()) ||
            tpl.description.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, templates]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSize = UPLOAD_CONFIG?.coverImage?.maxSize || 5; // Default to 5MB if config not available

    if (file) {
      // File size validation
      if (file.size > maxSize * 1024 * 1024) {
        setImageError(
          `File size exceeds ${maxSize}MB limit. Please choose a smaller image.`
        );
        setPreviewImage(null);
        onChange({ coverImage: null });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        setImageError("");
        onChange({ coverImage: file });
      };
      reader.onerror = () => {
        setImageError(
          "Failed to read the image file. Please try another image."
        );
        setPreviewImage(null);
        onChange({ coverImage: null });
      };
      reader.readAsDataURL(file);
    } else {
      setImageError("");
      setPreviewImage(null);
      onChange({ coverImage: null });
    }
  };

  const handleChange = (e) => {
    onChange(
      updateFormData
        ? updateFormData(data, e)
        : {
            ...data,
            [e.target.name]: e.target.value,
          }
    );
  };

  const handleGoalSelect = useCallback(
    (goalId) => {
      onChange({ targetGoal: goalId });
    },
    [onChange]
  );

  const handleGoalKeyDown = useCallback(
    (e, id) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleGoalSelect(id);
      }
    },
    [handleGoalSelect]
  );

  const handleSelectTemplate = (template) => {
    prefillForm(template);
    setShowTemplateModal(false);
  };

  // Template selector modal
  const renderTemplateSelector = () => (
    <Modal
      isOpen={showTemplateModal}
      onClose={() => setShowTemplateModal(false)}
      title="Nutrition Plan Templates"
      size="large"
      primaryButtonText="Cancel"
      primaryButtonAction={() => setShowTemplateModal(false)}
      footerButtons={true}
    >
      <div className="flex flex-col h-full">
        {/* Info message about templates */}
        <div className="mb-4">
          <InfoBanner
            icon="mdi:template"
            title="Pre-built nutrition plan templates"
            subtitle="These templates help you quickly create plans. Customize with your own details as needed."
            variant="primary"
          />
        </div>

        {/* Search input */}
        <div className="mb-4">
          <FormField
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            prefixIcon="mdi:magnify"
            className="mb-0"
          />
        </div>

        {/* Template list */}
        <div
          className="overflow-y-auto pr-2 -mr-2"
          style={{ minHeight: 200, maxHeight: 400 }}
        >
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((tpl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className="w-full text-left bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 hover:from-zinc-700/80 hover:to-zinc-800/80 border border-zinc-700/50 hover:border-orange-500/40 rounded-2xl p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-md hover:shadow-2xl backdrop-blur-md flex flex-row items-stretch"
                >
                  {/* Image on the left */}
                  <div className="h-full w-24 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-700 border border-zinc-600 shadow-inner">
                    <Image
                      src={tpl.coverImage}
                      alt={tpl.title}
                      className="w-full h-full object-cover"
                      width={96}
                      height={144}
                    />
                  </div>

                  {/* Content on the right */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between pl-3 py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold text-base">
                          {tpl.title}
                        </h3>
                        <span className="bg-[#FF6B00] text-white text-xs px-2 py-1 rounded-full">
                          {tpl.duration} {tpl.durationType}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mb-2 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {tpl.keyFeatures.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 bg-orange-900/40 text-orange-200 rounded-full border border-orange-700/40 shadow-sm"
                        >
                          {f}
                        </span>
                      ))}
                      {tpl.keyFeatures.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded-full border border-zinc-600/30 shadow-sm">
                          +{tpl.keyFeatures.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Icon
                icon="mdi:file-document-outline"
                className="w-12 h-12 text-zinc-600 mb-2"
              />
              <p className="text-zinc-400">
                No templates found
                {search ? ` matching "${search}"` : ""}
              </p>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setSearch("")}
                className="mt-2 h-8 px-3"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-8">
      {/* Template Browse Banner */}
      {templates && templates.length > 0 && (
        <InfoBanner
          icon="mdi:information"
          title="Quick Start with Templates"
          subtitle="Use pre-built nutrition plan templates to save time"
          variant="primary"
          buttonText="Browse Templates"
          onButtonClick={() => setShowTemplateModal(true)}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Basic Information */}
        <Card variant="dark" className="border border-[#333]">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:information" className="text-[#FF6B00]" />
            Basic Information
          </h2>

          <div className="space-y-4">
            <FormField
              label="Plan Title"
              name="title"
              value={data.title}
              onChange={handleChange}
              placeholder="e.g., 12-Week Weight Loss Nutrition Plan"
              required
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={data.description}
              onChange={handleChange}
              placeholder="Describe what makes your nutrition plan unique and effective..."
              required
              rows={3}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Price ($)"
                name="price"
                type="number"
                value={data.price}
                onChange={handleChange}
                placeholder="99.99"
                required
                prefixIcon="mdi:currency-usd"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Duration"
                  name="duration"
                  type="number"
                  value={data.duration}
                  onChange={handleChange}
                  placeholder="8"
                  required
                  prefixIcon="mdi:calendar-range"
                />
                <FormField
                  label="Duration Type"
                  name="durationType"
                  type="select"
                  value={data.durationType}
                  onChange={handleChange}
                  options={[
                    { value: "weeks", label: "Weeks" },
                    { value: "months", label: "Months" },
                    { value: "days", label: "Days" },
                  ]}
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Cover Image */}
        <Card variant="dark" className="border border-[#333] h-auto">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Icon icon="mdi:image" className="text-[#FF6B00]" />
            Cover Image
          </h2>
          <p className="text-gray-400 text-md mb-8 mt-2">
            A high-quality cover image will make your plan more attractive to
            clients. Recommended size: 1920×1080px (16:9 ratio).
          </p>
          <div className="flex flex-col items-center justify-center">
            <CoverImageUpload
              previewImage={previewImage}
              imageError={imageError}
              handleImageChange={handleImageChange}
            />
          </div>
        </Card>
      </div>

      {/* Nutrition Targets Section */}
      <Card variant="dark" className="border border-[#333]">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Icon icon="mdi:nutrition" className="text-[#FF6B00]" />
          Daily Nutrition Targets
        </h2>
        <p className="text-gray-400 mb-4">
          Set default daily nutrition goals for your plan
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="Daily Calories"
            name="nutritionInfo.calories"
            type="number"
            value={data.nutritionInfo?.calories || ""}
            onChange={handleChange}
            placeholder="2000"
            min={0}
            prefixIcon="mdi:fire"
          />
          <FormField
            label="Protein (g)"
            name="nutritionInfo.protein"
            type="number"
            value={data.nutritionInfo?.protein || ""}
            onChange={handleChange}
            placeholder="150"
            min={0}
            prefixIcon="mdi:food-drumstick"
          />
          <FormField
            label="Carbohydrates (g)"
            name="nutritionInfo.carbs"
            type="number"
            value={data.nutritionInfo?.carbs || ""}
            onChange={handleChange}
            placeholder="200"
            min={0}
            prefixIcon="mdi:bread-slice"
          />
          <FormField
            label="Fats (g)"
            name="nutritionInfo.fats"
            type="number"
            value={data.nutritionInfo?.fats || ""}
            onChange={handleChange}
            placeholder="70"
            min={0}
            prefixIcon="mdi:oil"
          />
        </div>
      </Card>

      {/* Target Goal Section */}
      <Card variant="dark" className="border border-[#333]">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Icon icon="mdi:target" className="text-[#FF6B00]" />
          Target Goal
        </h2>
        <p className="text-gray-400 mb-4">
          Select the primary goal to customize nutrition recommendations
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          role="radiogroup"
          aria-label="Target Goal"
        >
          {GOAL_TYPES.map((goal) => {
            const isSelected = data.targetGoal === goal.id;

            return (
              <div
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                onKeyDown={(e) => handleGoalKeyDown(e, goal.id)}
                tabIndex={0}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${goal.label}${
                  goal.description ? `: ${goal.description}` : ""
                }`}
                className={clsx(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#FF6B00]",
                  isSelected
                    ? "border-[#FF6B00] bg-[#FF6B00]/10"
                    : "border-[#333] hover:border-[#FF6B00]/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "p-2 rounded-lg",
                      isSelected
                        ? "bg-[#FF6B00] text-white"
                        : "bg-[#1a1a1a] text-gray-400"
                    )}
                  >
                    <Icon icon={goal.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{goal.label}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {goal.description}
                    </div>
                  </div>

                  {/* Check indicator */}
                  {isSelected && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center">
                      <Icon icon="mdi:check" className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Template selector modal */}
      {renderTemplateSelector()}
    </div>
  );
};

BasicInfo.propTypes = {
  data: PropTypes.shape({
    coverImage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object, // File object
    ]),
    title: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    durationType: PropTypes.string,
    nutritionInfo: PropTypes.shape({
      calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      protein: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      carbs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      fats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    targetGoal: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  prefillForm: PropTypes.func,
  templates: PropTypes.array,
};
