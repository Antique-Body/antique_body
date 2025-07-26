import { Icon } from "@iconify/react";

import { Modal } from "@/components/common/Modal";
import { SPECIALTIES, TRAINING_ENVIRONMENTS } from "@/enums/specialties";
import { TRAINING_TYPES } from "@/enums/trainingTypes";
import { calculateAge } from "@/utils/dateUtils";

export const TrainerProfileModal = ({ trainerData, isOpen, onClose }) => {
  const getOrNoData = (val) => val ?? "No data";

  // Function to map training type names to proper labels
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

  // Get trainer info with fallback - data is now at root level
  const trainerInfo = trainerData?.trainerInfo || {};

  // Calculate real stats from API data
  const exerciseCount = trainerInfo?.exercises?.length || 0;
  const mealCount = trainerInfo?.meals?.length || 0;
  const totalClients = 15; // This would come from actual client count
  const totalSessions = 150; // This would come from actual session count
  const rating = 4.9; // This would come from actual ratings

  if (!trainerData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trainer Profile"
      footerButtons={false}
      size="large"
      isNested={true}
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
              {calculateExperience(trainerData?.trainerSince)}
            </div>
            <div className="text-xs text-zinc-400">Experience</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
            <div className="text-lg font-bold text-white">{totalSessions}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-zinc-400">Age</span>
              <p className="text-white">
                {calculateAge(trainerData?.dateOfBirth)} years old
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Gender</span>
              <p className="text-white capitalize">
                {getOrNoData(trainerData?.gender)}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Experience</span>
              <p className="text-white">
                {calculateExperience(trainerData?.trainerSince)}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Training Environment</span>
              <p className="text-white">
                {trainerData?.trainingEnvironment
                  ? mapTrainingEnvironmentToLabel(
                      trainerData.trainingEnvironment
                    )
                  : "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Trainer Since</span>
              <p className="text-white">
                {trainerData?.trainerSince || "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Session Duration</span>
              <p className="text-white">
                {trainerData?.sessionDuration
                  ? `${trainerData.sessionDuration} minutes`
                  : "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Cancellation Policy</span>
              <p className="text-white">
                {trainerData?.cancellationPolicy
                  ? `${trainerData.cancellationPolicy} hours notice`
                  : "No data"}
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
            <div>
              <span className="text-zinc-400">Location</span>
              <p className="text-white">
                {trainerData?.location
                  ? `${trainerData.location.city}, ${trainerData.location.country}`
                  : "No location data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Languages</span>
              <p className="text-white">
                {trainerData?.languages?.length > 0
                  ? trainerData.languages.map((lang) => lang.name).join(", ")
                  : "No languages listed"}
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
            <div className="flex flex-wrap gap-2 text-sm">
              {trainerData?.specialties?.length > 0 ? (
                trainerData.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#FF6B00]/20 text-[#FF6B00] rounded-full border border-[#FF6B00]/30"
                  >
                    {mapSpecialtyToLabel(specialty.name)}
                  </span>
                ))
              ) : (
                <span className="text-zinc-400">No specialties listed</span>
              )}
            </div>
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
            <div className="flex flex-wrap gap-2 text-sm">
              {trainerData?.trainingTypes?.length > 0 ? (
                trainerData.trainingTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-zinc-700/50 text-zinc-200 rounded-full border border-zinc-600/30"
                  >
                    {mapTrainingTypeToLabel(type.name)}
                  </span>
                ))
              ) : (
                <span className="text-zinc-400">No training types listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {trainerData?.description && (
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:text-account"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              About
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {trainerData.description}
            </p>
          </div>
        )}

        {/* Certifications */}
        {trainerData?.certifications?.length > 0 && (
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
            <div className="space-y-2">
              {trainerData.certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Icon
                    icon="mdi:check-circle"
                    width={16}
                    height={16}
                    className="text-green-500 flex-shrink-0"
                  />
                  <span className="text-white">{cert.name}</span>
                  {cert.issuedBy && (
                    <span className="text-zinc-400">by {cert.issuedBy}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:dumbbell"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Exercise Library
            </h4>
            <div className="text-2xl font-bold text-white mb-1">
              {exerciseCount}
            </div>
            <p className="text-sm text-zinc-400">Custom exercises created</p>
          </div>

          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:food"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Meal Plans
            </h4>
            <div className="text-2xl font-bold text-white mb-1">
              {mealCount}
            </div>
            <p className="text-sm text-zinc-400">Nutrition plans created</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
