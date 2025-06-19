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
  <div className="space-y-4 sm:space-y-6">
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        About {trainer.name}
      </h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{trainer.bio}</p>

      {trainer.philosophy && (
        <div className="mt-3 sm:mt-4 bg-zinc-800/60 border border-zinc-700 rounded-lg p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 flex items-center">
            <Icon
              icon="mdi:lightbulb"
              className="mr-1.5 sm:mr-2 text-[#FF6B00] w-4 h-4 sm:w-5 sm:h-5"
            />
            Training Philosophy
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 italic">
            "{trainer.philosophy}"
          </p>
        </div>
      )}
    </div>

    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
      <InfoCard
        icon="mdi:account-multiple"
        title="Clients"
        value={`${trainer.clientCount} active clients`}
      />

      <InfoCard
        icon="mdi:certificate"
        title="Experience"
        value={trainer.experience}
      />

      <InfoCard
        icon="mdi:translate"
        title="Languages"
        value={trainer.languages ? trainer.languages.join(", ") : "English"}
      />

      <InfoCard
        icon="mdi:currency-usd"
        title="Session Price"
        value={`$${trainer.price} per ${trainer.priceUnit}`}
      />
    </div>
  </div>
);

const ExpertiseSection = ({ trainer }) => (
  <div className="space-y-4 sm:space-y-6">
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
        Certifications
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {trainer.certifications && trainer.certifications.length > 0 ? (
          trainer.certifications.map((cert, index) => (
            <div
              key={cert.id || index}
              className="flex items-center p-2.5 sm:p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg"
            >
              <div className="p-1.5 sm:p-2 bg-[#FF6B00]/20 rounded-full mr-2.5 sm:mr-3">
                <Icon
                  icon="mdi:certificate"
                  className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#FF6B00]"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm sm:text-base text-white">
                  {cert.name}
                </h4>
                <div className="text-xs sm:text-sm text-zinc-400">
                  {cert.issuer} • {new Date(cert.issueDate).getFullYear()}
                  {cert.expiryDate &&
                    ` - ${new Date(cert.expiryDate).getFullYear()}`}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-zinc-400">No certifications listed</div>
        )}
      </div>
    </div>
  </div>
);

const ScheduleSection = ({ trainer }) => {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeSlots = ["Morning", "Afternoon", "Evening"];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Availability
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 mb-3 sm:mb-4">
          Book a session with {trainer.name} during these available times:
        </p>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
          {/* Weekday selector */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4 sm:mb-6">
            {weekdays.map((day) => {
              const isAvailable =
                trainer.availability && trainer.availability.includes(day);

              return (
                <div key={day} className="flex flex-col items-center">
                  <div className="text-[10px] sm:text-xs text-zinc-400 mb-1">
                    {day}
                  </div>
                  <div
                    className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs ${
                      isAvailable
                        ? "bg-[#FF6B00] text-white"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {isAvailable ? (
                      <Icon
                        icon="mdi:check"
                        className="h-3.5 w-3.5 sm:h-5 sm:w-5"
                      />
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div className="space-y-2 sm:space-y-3">
            {timeSlots.map((slot) => {
              const isAvailable =
                trainer.availableTimes && trainer.availableTimes.includes(slot);

              return (
                <div
                  key={slot}
                  className={`flex items-center p-2.5 sm:p-3 rounded-lg border ${
                    isAvailable
                      ? "border-[#FF6B00]/30 bg-[#FF6B00]/10"
                      : "border-zinc-700 bg-zinc-800/30 opacity-50"
                  }`}
                >
                  <div
                    className={`p-1.5 sm:p-2 rounded-full mr-2.5 sm:mr-3 ${
                      isAvailable ? "bg-[#FF6B00]/20" : "bg-zinc-700"
                    }`}
                  >
                    <Icon
                      icon={
                        slot === "Morning"
                          ? "mdi:weather-sunny"
                          : slot === "Afternoon"
                          ? "mdi:weather-partly-cloudy"
                          : "mdi:weather-night"
                      }
                      className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${
                        isAvailable ? "text-[#FF6B00]" : "text-zinc-500"
                      }`}
                    />
                  </div>
                  <div>
                    <h4
                      className={`text-sm sm:text-base ${
                        isAvailable ? "font-medium text-white" : "text-zinc-500"
                      }`}
                    >
                      {slot}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-zinc-400">
                      {slot === "Morning"
                        ? "6:00 AM - 12:00 PM"
                        : slot === "Afternoon"
                        ? "12:00 PM - 5:00 PM"
                        : "5:00 PM - 10:00 PM"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {isAvailable && (
                      <span className="text-[10px] sm:text-xs bg-[#FF6B00]/20 text-[#FF6B00] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
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
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Location
        </h3>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-[#FF6B00]/20 rounded-full mr-2.5 sm:mr-3">
              <Icon
                icon="mdi:map-marker"
                className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#FF6B00]"
              />
            </div>
            <div>
              <h4 className="font-medium text-sm sm:text-base text-white">
                {trainer.location}
              </h4>
              <p className="text-[10px] sm:text-sm text-zinc-400">
                {trainer.proximity} from your location
              </p>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 bg-zinc-700/20 rounded-lg h-36 sm:h-48 flex items-center justify-center">
            <span className="text-xs sm:text-sm text-zinc-500">
              Map view will be displayed here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = ({ trainer }) => (
  <div className="space-y-4 sm:space-y-6">
    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1">
          Client Reviews
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400">
          See what others are saying about {trainer.name}
        </p>
      </div>

      <div className="flex items-center bg-zinc-800/70 border border-zinc-700 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 w-full sm:w-auto">
        <div className="mr-3">
          <div className="text-xl sm:text-3xl font-bold text-white">
            {trainer.rating.toFixed(1)}
          </div>
          <div className="text-[10px] sm:text-xs text-zinc-400">
            {trainer.reviewCount} reviews
          </div>
        </div>
        <RatingStars rating={trainer.rating} size={16} />
      </div>
    </div>

    {/* Reviews list */}
    <div className="space-y-3 sm:space-y-4">
      {trainer.testimonials ? (
        trainer.testimonials.map((review) => (
          <div
            key={review.id}
            className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 sm:p-4"
          >
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center mr-2 sm:mr-3">
                  <Icon
                    icon="mdi:account"
                    className="h-4 w-4 sm:h-6 sm:w-6 text-zinc-400"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm sm:text-base text-white">
                    {review.clientName}
                  </h4>
                  <div className="text-[10px] sm:text-xs text-zinc-400">
                    Verified Client
                  </div>
                </div>
              </div>
              <RatingStars rating={review.rating} size={12} />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 mb-2">
              {review.comment}
            </p>

            <div className="text-[10px] sm:text-xs text-zinc-500">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 sm:p-8 bg-zinc-800/30 border border-zinc-800 rounded-lg">
          <Icon
            icon="mdi:comment-text-outline"
            className="h-8 w-8 sm:h-12 sm:w-12 text-zinc-700 mx-auto mb-2 sm:mb-3"
          />
          <p className="text-sm text-zinc-400">No reviews yet</p>
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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Photo Gallery
        </h3>
        <p className="text-xs sm:text-sm text-zinc-300 mb-3 sm:mb-4">
          Take a look at {trainer.name}'s training environment and sessions
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden border border-zinc-700"
            >
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
  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-2.5 sm:p-4 flex items-start">
    <div className="p-1.5 sm:p-2 bg-[#FF6B00]/20 rounded-full mr-2.5 sm:mr-3">
      <Icon icon={icon} className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#FF6B00]" />
    </div>
    <div>
      <h4 className="text-xs sm:text-sm text-zinc-400">{title}</h4>
      <div className="font-medium text-sm sm:text-base text-white">{value}</div>
    </div>
  </div>
);
