import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { RatingStars } from "./RatingStars";

export const TrainerDetails = ({ trainer, activeTab }) => {
    const renderTabContent = () => {
        switch (activeTab) {
            case "about":
                return <AboutSection trainer={trainer} />;
            case "expertise":
                return <ExpertiseSection trainer={trainer} />;
            case "schedule":
                return <ScheduleSection trainer={trainer} />;
            case "reviews":
                return <ReviewsSection trainer={trainer} />;
            case "gallery":
                return <GallerySection trainer={trainer} />;
            default:
                return <AboutSection trainer={trainer} />;
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {renderTabContent()}
            </motion.div>
        </AnimatePresence>
    );
};

const AboutSection = ({ trainer }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-3">About {trainer.name}</h3>
            <p className="text-zinc-300 leading-relaxed">{trainer.bio}</p>

            {trainer.philosophy && (
                <div className="mt-4 bg-zinc-800/60 border border-zinc-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Icon icon="mdi:lightbulb" className="mr-2 text-[#FF6B00]" />
                        Training Philosophy
                    </h4>
                    <p className="text-zinc-300 text-sm italic">"{trainer.philosophy}"</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon="mdi:account-multiple" title="Clients" value={`${trainer.clientCount} active clients`} />

            <InfoCard icon="mdi:certificate" title="Experience" value={trainer.experience} />

            <InfoCard
                icon="mdi:translate"
                title="Languages"
                value={trainer.languages ? trainer.languages.join(", ") : "English"}
            />

            <InfoCard icon="mdi:currency-usd" title="Session Price" value={`$${trainer.price} per ${trainer.priceUnit}`} />
        </div>
    </div>
);

const ExpertiseSection = ({ trainer }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-semibold mb-3">Areas of Expertise</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {trainer.specializations ? (
                    trainer.specializations.map((spec, index) => (
                        <div key={index} className="flex items-start p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                            <div className="p-2 bg-[#FF6B00]/20 rounded-full mr-3">
                                <Icon icon="mdi:check" className="h-5 w-5 text-[#FF6B00]" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{spec}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-zinc-400">No specializations listed</div>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-3">Certifications</h3>

            <div className="grid grid-cols-1 gap-3">
                {trainer.certifications ? (
                    trainer.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                            <div className="p-2 bg-[#FF6B00]/20 rounded-full mr-3">
                                <Icon icon="mdi:certificate" className="h-5 w-5 text-[#FF6B00]" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{cert}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-zinc-400">No certifications listed</div>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-3">Achievements</h3>

            <div className="grid grid-cols-1 gap-3">
                {trainer.achievements ? (
                    trainer.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                            <div className="p-2 bg-[#FF6B00]/20 rounded-full mr-3">
                                <Icon icon="mdi:trophy" className="h-5 w-5 text-[#FF6B00]" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{achievement}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-zinc-400">No achievements listed</div>
                )}
            </div>
        </div>
    </div>
);

const ScheduleSection = ({ trainer }) => {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const timeSlots = ["Morning", "Afternoon", "Evening"];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Availability</h3>
                <p className="text-zinc-300 mb-4">Book a session with {trainer.name} during these available times:</p>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    {/* Weekday selector */}
                    <div className="grid grid-cols-7 gap-1 mb-6">
                        {weekdays.map((day) => {
                            const isAvailable = trainer.availability && trainer.availability.includes(day);

                            return (
                                <div key={day} className="flex flex-col items-center">
                                    <div className="text-xs text-zinc-400 mb-1">{day}</div>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                            isAvailable ? "bg-[#FF6B00] text-white" : "bg-zinc-800 text-zinc-500"
                                        }`}
                                    >
                                        {isAvailable ? <Icon icon="mdi:check" className="h-5 w-5" /> : "—"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Time slots */}
                    <div className="space-y-3">
                        {timeSlots.map((slot) => {
                            const isAvailable = trainer.availableTimes && trainer.availableTimes.includes(slot);

                            return (
                                <div
                                    key={slot}
                                    className={`flex items-center p-3 rounded-lg border ${
                                        isAvailable
                                            ? "border-[#FF6B00]/30 bg-[#FF6B00]/10"
                                            : "border-zinc-700 bg-zinc-800/30 opacity-50"
                                    }`}
                                >
                                    <div className={`p-2 rounded-full mr-3 ${isAvailable ? "bg-[#FF6B00]/20" : "bg-zinc-700"}`}>
                                        <Icon
                                            icon={
                                                slot === "Morning"
                                                    ? "mdi:weather-sunny"
                                                    : slot === "Afternoon"
                                                      ? "mdi:weather-partly-cloudy"
                                                      : "mdi:weather-night"
                                            }
                                            className={`h-5 w-5 ${isAvailable ? "text-[#FF6B00]" : "text-zinc-500"}`}
                                        />
                                    </div>
                                    <div>
                                        <h4 className={isAvailable ? "font-medium text-white" : "text-zinc-500"}>{slot}</h4>
                                        <p className="text-xs text-zinc-400">
                                            {slot === "Morning"
                                                ? "6:00 AM - 12:00 PM"
                                                : slot === "Afternoon"
                                                  ? "12:00 PM - 5:00 PM"
                                                  : "5:00 PM - 10:00 PM"}
                                        </p>
                                    </div>
                                    <div className="ml-auto">
                                        {isAvailable && (
                                            <span className="text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-2 py-1 rounded-full">
                                                Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-[#FF6B00]/20 rounded-full mr-3">
                            <Icon icon="mdi:map-marker" className="h-5 w-5 text-[#FF6B00]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-white">{trainer.location}</h4>
                            <p className="text-sm text-zinc-400">{trainer.proximity} from your location</p>
                        </div>
                    </div>

                    <div className="mt-4 bg-zinc-700/20 rounded-lg h-48 flex items-center justify-center">
                        <span className="text-zinc-500">Map view will be displayed here</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewsSection = ({ trainer }) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            <div>
                <h3 className="text-lg font-semibold mb-1">Client Reviews</h3>
                <p className="text-zinc-400">See what others are saying about {trainer.name}</p>
            </div>

            <div className="flex items-center bg-zinc-800/70 border border-zinc-700 rounded-lg px-4 py-2">
                <div className="mr-3">
                    <div className="text-3xl font-bold text-white">{trainer.rating.toFixed(1)}</div>
                    <div className="text-xs text-zinc-400">{trainer.reviewCount} reviews</div>
                </div>
                <RatingStars rating={trainer.rating} size={20} />
            </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
            {trainer.testimonials ? (
                trainer.testimonials.map((review) => (
                    <div key={review.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center mr-3">
                                    <Icon icon="mdi:account" className="h-6 w-6 text-zinc-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{review.clientName}</h4>
                                    <div className="text-xs text-zinc-400">Verified Client</div>
                                </div>
                            </div>
                            <RatingStars rating={review.rating} size={14} />
                        </div>

                        <p className="text-zinc-300 mb-2">{review.comment}</p>

                        <div className="text-xs text-zinc-500">
                            {new Date(review.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center p-8 bg-zinc-800/30 border border-zinc-800 rounded-lg">
                    <Icon icon="mdi:comment-text-outline" className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-400">No reviews yet</p>
                </div>
            )}
        </div>
    </div>
);

const GallerySection = ({ trainer }) => {
    // Mock gallery if not available
    const galleryImages = trainer.galleryImages || [
        trainer.image,
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGd5bXxlbnwwfHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhaW5lcnxlbnwwfHwwfHx8MA%3D%3D",
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Photo Gallery</h3>
                <p className="text-zinc-300 mb-4">Take a look at {trainer.name}'s training environment and sessions</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden border border-zinc-700">
                            <Image
                                src={image}
                                alt={`Gallery image ${index + 1}`}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, value }) => (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-start">
        <div className="p-2 bg-[#FF6B00]/20 rounded-full mr-3">
            <Icon icon={icon} className="h-5 w-5 text-[#FF6B00]" />
        </div>
        <div>
            <h4 className="text-sm text-zinc-400">{title}</h4>
            <div className="font-medium text-white">{value}</div>
        </div>
    </div>
);
