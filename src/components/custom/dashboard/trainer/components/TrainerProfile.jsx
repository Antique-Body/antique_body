import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Modal } from "@/components/common/Modal";
import { UserProfile } from "@/components/custom/dashboard/shared";
import { SPECIALTIES, TRAINING_ENVIRONMENTS } from "@/enums/specialties";
import { TRAINING_TYPES } from "@/enums/trainingTypes";
import { calculateAge } from "@/utils/dateUtils";

export const TrainerProfile = ({ trainerData, onProfileUpdate }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const getOrNoData = (val) => val ?? "No data";

  // Combine first and last name
  const fullName =
    (trainerData?.firstName || "") +
      (trainerData?.lastName ? ` ${trainerData.lastName}` : "") ||
    trainerData?.name ||
    "No data";

  const mapTrainingTypeToLabel = (typeName) => {
    const type = TRAINING_TYPES.find(
      (t) =>
        t.id === typeName || t.label.toLowerCase() === typeName.toLowerCase()
    );
    return type
      ? type.label
      : typeName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Function to map specialty names to proper labels
  const mapSpecialtyToLabel = (specialtyName) => {
    const specialty = SPECIALTIES.find(
      (s) =>
        s.id === specialtyName ||
        s.label.toLowerCase() === specialtyName.toLowerCase()
    );
    return specialty
      ? specialty.label
      : specialtyName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Function to map training environment to proper label
  const mapTrainingEnvironmentToLabel = (environment) => {
    const env = TRAINING_ENVIRONMENTS.find((e) => e.id === environment);
    return env
      ? env.label
      : environment.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Calculate experience in years from trainerSince
  const calculateExperience = (trainerSince) => {
    if (!trainerSince) return "N/A";
    const currentYear = new Date().getFullYear();
    const yearsExperience = currentYear - parseInt(trainerSince);

    if (yearsExperience === 0) {
      return "Less than 1 year";
    }
    return `${yearsExperience} year${yearsExperience !== 1 ? "s" : ""}`;
  };

  // Get trainer info with fallback
  const trainerInfo = trainerData?.trainerInfo || {};

  // Calculate real stats from API data
  const exerciseCount = trainerInfo?.exercises?.length || 0;
  const mealCount = trainerInfo?.meals?.length || 0;
  const totalClients = 15; // This would come from actual client count
  const totalSessions = 150; // This would come from actual session count
  const rating = 4.9; // This would come from actual ratings

  // Subtitle with stats using real data
  const profileSubtitle = (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5">
        <Icon
          icon="mdi:star"
          width={14}
          height={14}
          className="text-[#FF6B00] flex-shrink-0"
        />
        <span className="whitespace-nowrap">{rating} rating</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon
          icon="mdi:account-group"
          width={14}
          height={14}
          className="text-[#FF6B00] flex-shrink-0"
        />
        <span className="whitespace-nowrap">{totalClients} clients</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon
          icon="mdi:calendar"
          width={14}
          height={14}
          className="text-[#FF6B00] flex-shrink-0"
        />
        <span className="whitespace-nowrap">
          {calculateExperience(trainerInfo.trainerSince)} experience
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Icon
          icon="mdi:dumbbell"
          width={14}
          height={14}
          className="text-[#FF6B00] flex-shrink-0"
        />
        <span className="whitespace-nowrap">{totalSessions} sessions</span>
      </div>
    </div>
  );

  const handleHeaderClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <UserProfile
        profileType="trainer"
        avatarContent={trainerData?.profileImage}
        profileTitle={fullName}
        profileSubtitle={profileSubtitle}
        certifications={trainerData?.certifications || []}
        userData={trainerData}
        onProfileUpdate={onProfileUpdate}
        onHeaderClick={handleHeaderClick}
        showDetailedView={true}
      />

      {/* Simplified Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Trainer Profile"
        size="large"
        primaryButtonText="Close"
        footerButtons={true}
        primaryButtonAction={() => setShowDetailModal(false)}
        secondaryButtonText=""
      >
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
              <div className="text-lg font-bold text-white">{rating}</div>
              <div className="text-xs text-zinc-400">Rating</div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
              <div className="text-lg font-bold text-white">{totalClients}</div>
              <div className="text-xs text-zinc-400">Clients</div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
              <div className="text-lg font-bold text-white">
                {calculateExperience(trainerInfo.trainerSince)}
              </div>
              <div className="text-xs text-zinc-400">Experience</div>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
              <div className="text-lg font-bold text-white">
                {totalSessions}
              </div>
              <div className="text-xs text-zinc-400">Sessions</div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:account-tie"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Professional Information
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-zinc-400">Age</span>
                <p className="text-white">
                  {calculateAge(trainerData?.dateOfBirth)} years old
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Experience</span>
                <p className="text-white">
                  {calculateExperience(trainerInfo.trainerSince)}
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Session Duration</span>
                <p className="text-white">
                  {trainerData?.sessionDuration || "N/A"} minutes
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Cancellation Policy</span>
                <p className="text-white">
                  {trainerData?.cancellationPolicy || "N/A"} hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:contact-mail"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Contact & Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-zinc-400">Email</span>
                <p className="text-white break-all">
                  {getOrNoData(trainerData?.contactEmail)}
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Phone</span>
                <p className="text-white">
                  {getOrNoData(trainerData?.contactPhone)}
                </p>
              </div>
              <div className="md:col-span-2">
                <span className="text-zinc-400">Location</span>
                <p className="text-white">
                  {trainerData?.location
                    ? `${trainerData.location.city}, ${trainerData.location.country}`
                    : "No location data"}
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Training Environment</span>
                <p className="text-white capitalize">
                  {trainerInfo?.trainingEnvironment
                    ? mapTrainingEnvironmentToLabel(
                        trainerInfo.trainingEnvironment
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Specialties & Training Types */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Specialties */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:medal"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Specialties
              </h4>
              {trainerData?.specialties &&
              trainerData.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {trainerData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FF6B00] rounded text-xs"
                    >
                      {mapSpecialtyToLabel(specialty.name || specialty)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">
                  No specialties specified
                </p>
              )}
            </div>

            {/* Training Types */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:dumbbell"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Training Types
              </h4>
              {trainerData?.trainingTypes &&
              trainerData.trainingTypes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {trainerData.trainingTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FF6B00] rounded text-xs"
                    >
                      {mapTrainingTypeToLabel(type.name || type)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">
                  No training types specified
                </p>
              )}
            </div>
          </div>

          {/* Certifications & Languages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Certifications */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:certificate"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Certifications
              </h4>
              {trainerData?.certifications &&
              trainerData.certifications.length > 0 ? (
                <div className="space-y-2">
                  {trainerData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          cert.status === "approved"
                            ? "bg-green-500"
                            : cert.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <span className="text-white text-sm font-medium">
                          {cert.name}
                        </span>
                        {cert.issuer && (
                          <p className="text-zinc-400 text-xs">
                            Issued by: {cert.issuer}
                          </p>
                        )}
                        {cert.expiryDate && (
                          <p className="text-zinc-400 text-xs">
                            Expires:{" "}
                            {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                            cert.status === "approved"
                              ? "bg-green-500/20 text-green-400"
                              : cert.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {cert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">
                  No certifications specified
                </p>
              )}
            </div>

            {/* Languages */}
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:translate"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Languages
              </h4>
              {trainerData?.languages && trainerData.languages.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {trainerData.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-zinc-700/50 border border-zinc-600/50 text-zinc-300 rounded text-xs"
                    >
                      {language.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">No languages specified</p>
              )}
            </div>
          </div>

          {/* Content Stats */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:library"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Content Library
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-zinc-400">Exercise Library</span>
                <p className="text-white">{exerciseCount} exercises</p>
              </div>
              <div>
                <span className="text-zinc-400">Meal Library</span>
                <p className="text-white">{mealCount} meals</p>
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          {trainerData?.galleryImages &&
            trainerData.galleryImages.length > 0 && (
              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
                <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                  <Icon
                    icon="mdi:image-multiple"
                    width={16}
                    height={16}
                    className="text-[#FF6B00]"
                  />
                  Gallery
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {trainerData.galleryImages.slice(0, 6).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-zinc-700"
                    >
                      <Image
                        src={image.url || image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                        fill
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* About Me */}
          {trainerData?.description && (
            <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
              <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:information"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                About Me
              </h4>
              <p className="text-white leading-relaxed text-sm">
                {trainerData.description}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
