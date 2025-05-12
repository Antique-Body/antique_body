import downloadIcon from "@iconify/icons-heroicons/arrow-down-tray-20-solid";
import dollarIcon from "@iconify/icons-heroicons/banknotes-20-solid";
import calendarIcon from "@iconify/icons-heroicons/calendar-20-solid";
import checkCircleIcon from "@iconify/icons-heroicons/check-circle-20-solid";
import clockIcon from "@iconify/icons-heroicons/clock-20-solid";
import infoIcon from "@iconify/icons-heroicons/information-circle-20-solid";
import userIcon from "@iconify/icons-heroicons/users-20-solid";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import mockDetails from "../data/mockDetails";

import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { generatePlanPDF } from "@/utils/pdfGenerator";

export const PlanPreviewModal = ({ plan, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [activeDay, setActiveDay] = useState("monday");
    const [isDownloading, setIsDownloading] = useState(false);

    if (!plan) return null;

    const { title, description, image, createdAt, planType, duration, clientCount = 0, price, weeklySchedule } = plan;

    const isNutrition = planType === "nutrition";

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Prepare mockDetails data based on plan type
    const planDetails = {
        overview: {
            ...mockDetails.overview,
            targetAudience: isNutrition
                ? mockDetails.overview.targetAudience.nutrition
                : mockDetails.overview.targetAudience.training,
        },
        schedule: {
            ...mockDetails.schedule,
            weeks: isNutrition ? mockDetails.schedule.weeks.nutrition : mockDetails.schedule.weeks.training,
            frequency: isNutrition ? mockDetails.schedule.frequency.nutrition : mockDetails.schedule.frequency.training,
        },
        clients: {
            activeCount: clientCount,
            ...mockDetails.clients,
        },
    };

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);

            // Collect only the essential data for the PDF
            const pdfData = {
                title,
                description,
                planType,
                duration,
                createdAt: formattedDate,
                image,
                overview: planDetails.overview,
                weeklySchedule,
                schedule: planDetails.schedule,
            };

            const success = await generatePlanPDF(pdfData);

            if (success) {
                // You could add a toast notification here if you have a toast component
                console.log("PDF generated successfully");
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "schedule", label: "Schedule & Timeline" },
        { id: "weekly", label: "Weekly Schedule" },
        { id: "clients", label: "Client Stats" },
    ];

    const days = [
        { id: "monday", label: "Monday" },
        { id: "tuesday", label: "Tuesday" },
        { id: "wednesday", label: "Wednesday" },
        { id: "thursday", label: "Thursday" },
        { id: "friday", label: "Friday" },
        { id: "saturday", label: "Saturday" },
        { id: "sunday", label: "Sunday" },
    ];

    // Render exercise item for training plan
    const renderExerciseItem = (exercise, index) => (
        <div key={exercise.id} className="mb-4 rounded-lg bg-[#1a1a1a] p-4">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-medium text-white">
                        {index + 1}. {exercise.name}
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-0.5 text-[#FF6B00]">
                            {exercise.sets} sets
                        </span>
                        <span className="rounded-md bg-[rgba(59,130,246,0.15)] px-2 py-0.5 text-blue-500">
                            {exercise.reps} reps
                        </span>
                        <span className="rounded-md bg-[rgba(234,179,8,0.15)] px-2 py-0.5 text-yellow-500">
                            {exercise.rest} rest
                        </span>
                    </div>
                </div>
            </div>
            {exercise.notes && (
                <div className="mt-2 text-sm text-gray-400">
                    <span className="text-gray-500">Notes:</span> {exercise.notes}
                </div>
            )}
        </div>
    );

    // Render meal item for nutrition plan
    const renderMealItem = (meal) => (
        <div key={meal.id} className="mb-4 rounded-lg bg-[#1a1a1a] p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{meal.name}</h4>
                        <span className="rounded-md bg-[rgba(255,107,0,0.2)] px-2 py-0.5 text-xs text-[#FF6B00]">
                            {meal.time}
                        </span>
                        <span
                            className={`rounded-md px-2 py-0.5 text-xs ${
                                meal.type === "breakfast"
                                    ? "bg-yellow-900/20 text-yellow-400"
                                    : meal.type === "lunch"
                                      ? "bg-green-900/20 text-green-400"
                                      : meal.type === "dinner"
                                        ? "bg-blue-900/20 text-blue-400"
                                        : "bg-purple-900/20 text-purple-400"
                            }`}
                        >
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                        </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-md bg-[rgba(255,107,0,0.15)] px-2 py-0.5 text-[#FF6B00]">
                            {meal.calories} kcal
                        </span>
                        <span className="rounded-md bg-[rgba(59,130,246,0.15)] px-2 py-0.5 text-blue-500">
                            P: {meal.protein}g
                        </span>
                        <span className="rounded-md bg-[rgba(34,197,94,0.15)] px-2 py-0.5 text-green-500">
                            C: {meal.carbs}g
                        </span>
                        <span className="rounded-md bg-[rgba(234,179,8,0.15)] px-2 py-0.5 text-yellow-500">F: {meal.fat}g</span>
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <div className="mb-2">
                    <span className="text-sm text-gray-500">Ingredients:</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {meal.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="rounded-md bg-[#333] px-2 py-0.5 text-xs text-gray-300">
                                {typeof ingredient === "string" ? ingredient : "Item"}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    <span className="text-gray-500">Instructions:</span> {meal.instructions}
                </div>
            </div>
        </div>
    );

    // Render daily schedule content based on plan type
    console.log("weeklySchedule", weeklySchedule);
    const renderDailySchedule = () => {
        if (!weeklySchedule || !weeklySchedule[activeDay]) {
            return (
                <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4 text-center">
                    <p className="text-gray-400">No schedule available for this day.</p>
                </div>
            );
        }

        const daySchedule = weeklySchedule[activeDay];
        const dayTitle = daySchedule.title || `${activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}`;

        return (
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{dayTitle}</h3>
                </div>

                {isNutrition ? (
                    // Render nutrition meals
                    <div className="space-y-2">
                        {daySchedule.meals && daySchedule.meals.length > 0 ? (
                            daySchedule.meals.map((meal) => renderMealItem(meal))
                        ) : (
                            <p className="text-gray-400">No meals scheduled for this day.</p>
                        )}
                    </div>
                ) : (
                    // Render training exercises
                    <div className="space-y-2">
                        {daySchedule.exercises && daySchedule.exercises.length > 0 ? (
                            daySchedule.exercises.map((exercise, index) => renderExerciseItem(exercise, index))
                        ) : (
                            <p className="text-gray-400">No exercises scheduled for this day.</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" size="large" footerButtons={false}>
            <div className="flex flex-col -mt-6 -mx-4 sm:-mx-5">
                {/* Banner image with gradient overlay */}
                <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                    {image && (
                        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[#111]"></div>

                    {/* Plan type badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${
                                isNutrition ? "bg-green-900/80 text-green-100" : "bg-blue-900/80 text-blue-100"
                            }`}
                        >
                            <Icon
                                icon={isNutrition ? "heroicons:beaker-20-solid" : "heroicons:bolt-20-solid"}
                                className="w-4 h-4"
                            />
                            {isNutrition ? "Nutrition Plan" : "Training Plan"}
                        </span>
                    </div>

                    {/* Price tag */}
                    {price && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-[#FF6B00] text-white">
                                <Icon icon={dollarIcon} className="w-4 h-4 mr-1" />${price}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content container */}
                <div className="px-4 sm:px-5">
                    {/* Title and metadata section */}
                    <div className="mt-6 mb-6">
                        <div className="flex justify-between mb-4 items-start gap-4 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                                {/* Download PDF Button */}
                                <Button
                                    variant="outline"
                                    className="whitespace-nowrap bg-gradient-to-r from-[rgba(255,107,0,0.05)] to-[rgba(255,107,0,0.1)] border-[#FF6B00]/30 hover:border-[#FF6B00]/70 hover:bg-gradient-to-r hover:from-[rgba(255,107,0,0.1)] hover:to-[rgba(255,107,0,0.2)] transition-all duration-300"
                                    onClick={handleDownloadPDF}
                                    loading={isDownloading}
                                    disabled={isDownloading}
                                >
                                    <Icon icon={downloadIcon} className="w-4 h-4 mr-2 text-[#FF6B00]" />
                                    {isDownloading ? "Generating PDF..." : "Download PDF"}
                                </Button>

                                {/* Client assignments button */}
                                <Button
                                    variant="orangeFilled"
                                    className="whitespace-nowrap"
                                    onClick={() => {
                                        /* Handle navigation to client assignments */
                                    }}
                                >
                                    <Icon icon={userIcon} className="w-4 h-4 mr-2" />
                                    View Client Assignments
                                </Button>
                            </div>
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base mb-4">{description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Icon icon={calendarIcon} className="w-4 h-4 text-[#FF6B00]" />
                                <span>Created: {formattedDate}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-300">
                                <Icon icon={clockIcon} className="w-4 h-4 text-[#FF6B00]" />
                                <span>Duration: {duration}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-300">
                                <Icon icon={userIcon} className="w-4 h-4 text-[#FF6B00]" />
                                <span>{clientCount} active clients</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="border-b border-[#333] mb-6">
                        <div className="flex space-x-6 overflow-x-auto pb-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-3 relative text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id ? "text-[#FF6B00]" : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTabLine"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B00]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="mb-6">
                        {/* Overview tab */}
                        {activeTab === "overview" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Plan Summary</h3>
                                    <p className="text-gray-300">{planDetails.overview.summary}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {planDetails.overview.keyFeatures.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <Icon
                                                    icon={checkCircleIcon}
                                                    className="w-[18px] h-[18px] text-[#FF6B00] mt-0.5 flex-shrink-0"
                                                />
                                                <span className="text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Ideal For</h3>
                                    <p className="text-gray-300">{planDetails.overview.targetAudience}</p>
                                </div>

                                <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                    <div className="flex items-start gap-3">
                                        <Icon icon={infoIcon} className="w-5 h-5 text-[#FF6B00] mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Plan Insights</h4>
                                            <p className="text-sm text-gray-300">
                                                This plan has been assigned to {clientCount} clients with an average success
                                                rate of {planDetails.clients.successRate}. Consider promoting this plan more if
                                                it continues to perform well.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Schedule tab */}
                        {activeTab === "schedule" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Timeline Structure</h3>
                                    <div className="space-y-4">
                                        {planDetails.schedule.weeks.map((week, index) => (
                                            <div key={index} className="relative pl-8">
                                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-[#FF6B00]">{index + 1}</span>
                                                </div>
                                                {index !== planDetails.schedule.weeks.length - 1 && (
                                                    <div className="absolute left-3 top-6 w-0.5 h-full max-h-12 bg-[#333]"></div>
                                                )}
                                                <div>
                                                    <h4 className="text-white font-medium">{week}</h4>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {isNutrition
                                                            ? "Focus on building consistent eating patterns and introducing key nutritional concepts."
                                                            : "Gradually increase intensity and volume while maintaining proper form and technique."}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3">Recommended Frequency</h3>
                                        <p className="text-gray-300">{planDetails.schedule.frequency}</p>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3">Adaptability</h3>
                                        <p className="text-gray-300">{planDetails.schedule.adaptability}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Weekly Schedule tab */}
                        {activeTab === "weekly" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Day selection tabs */}
                                <div className="mb-4 overflow-x-auto">
                                    <div className="flex space-x-2 pb-2">
                                        {days.map((day) => (
                                            <button
                                                key={day.id}
                                                onClick={() => setActiveDay(day.id)}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                                                    ${
                                                        activeDay === day.id
                                                            ? isNutrition
                                                                ? "bg-green-900/30 text-green-300"
                                                                : "bg-blue-900/30 text-blue-300"
                                                            : "bg-[#222] text-gray-400 hover:text-white"
                                                    }
                                                `}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Daily schedule content */}
                                {renderDailySchedule()}
                            </motion.div>
                        )}

                        {/* Clients tab */}
                        {activeTab === "clients" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <Icon icon={userIcon} className="w-6 h-6 text-[#FF6B00] mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-white mb-1">{clientCount}</div>
                                        <div className="text-sm text-gray-400">Active Clients</div>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <div className="text-[#FF6B00] mx-auto mb-2 text-2xl">%</div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {planDetails.clients.successRate}
                                        </div>
                                        <div className="text-sm text-gray-400">Success Rate</div>
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-4 text-center">
                                        <div className="flex justify-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Icon
                                                    key={i}
                                                    icon="heroicons:star-20-solid"
                                                    className={`w-5 h-5 ${i < Math.floor(planDetails.clients.averageRating) ? "text-[#FF6B00]" : "text-gray-600"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-1">
                                            {planDetails.clients.averageRating}
                                        </div>
                                        <div className="text-sm text-gray-400">Average Rating</div>
                                    </div>
                                </div>

                                <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
                                    <h3 className="text-lg font-semibold text-white mb-4">Client Testimonial</h3>
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 text-4xl text-[#FF6B00]/20">"</div>
                                        <blockquote className="pl-8 pr-8 relative z-10">
                                            <p className="text-gray-300 italic mb-3">{planDetails.clients.testimonial.text}</p>
                                            <footer className="text-sm text-gray-400">
                                                — {planDetails.clients.testimonial.author}
                                            </footer>
                                        </blockquote>
                                        <div className="absolute right-4 bottom-0 text-4xl text-[#FF6B00]/20">"</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};
