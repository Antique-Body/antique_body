import { Icon } from "@iconify/react";
import { useState } from "react";

import { Modal } from "@/components/common/Modal";
import { UserProfile } from "@/components/custom/dashboard/shared";
import { SPECIALTIES } from "@/enums/specialties";
import { TRAINING_TYPES } from "@/enums/trainingTypes";

export const TrainerProfile = ({ trainerData, onProfileUpdate }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const info = trainerData?.trainerInfo || {};
  const getOrNoData = (val) => val ?? "No data";

  // Combine first and last name
  const fullName =
    (trainerData?.firstName || "") +
      (trainerData?.lastName ? ` ${trainerData.lastName}` : "") ||
    trainerData?.name ||
    "No data";

  // Subtitle with stats
  const profileSubtitle = (
    <div className="flex items-center gap-4 text-xs text-zinc-400">
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:star"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>4.8 rating</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:account-group"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>24 clients</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:calendar"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>5+ years</span>
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="mdi:dumbbell"
          width={12}
          height={12}
          className="text-[#FF6B00]"
        />
        <span>120+ sessions</span>
      </div>
    </div>
  );

  // Format specialties
  const formatSpecialties = (specialties) => {
    if (!specialties || !Array.isArray(specialties)) return [];
    return specialties.map((specialty) => {
      const specialtyData = SPECIALTIES.find((s) => s.id === specialty);
      return specialtyData ? specialtyData.label : specialty;
    });
  };

  // Format training types
  const formatTrainingTypes = (trainingTypes) => {
    if (!trainingTypes || !Array.isArray(trainingTypes)) return [];
    return trainingTypes.map((type) => {
      const typeData = TRAINING_TYPES.find((t) => t.id === type);
      return typeData ? typeData.label : type;
    });
  };

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
        userData={trainerData}
        onProfileUpdate={onProfileUpdate}
        onHeaderClick={handleHeaderClick}
        showDetailedView={true}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
              {trainerData?.profileImage ? (
                <img
                  src={trainerData.profileImage}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon
                    icon="mdi:account"
                    width={24}
                    height={24}
                    className="text-zinc-400"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{fullName}</h3>
              <p className="text-sm text-zinc-400">Personal Trainer</p>
            </div>
          </div>
        }
        size="large"
        primaryButtonText="Close"
        primaryButtonAction={() => setShowDetailModal(false)}
      >
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:star"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">4.8</div>
              <div className="text-xs text-zinc-400">Rating</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:account-group"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">24</div>
              <div className="text-xs text-zinc-400">Clients</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:calendar"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">5+</div>
              <div className="text-xs text-zinc-400">Years</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4 text-center">
              <Icon
                icon="mdi:dumbbell"
                width={24}
                height={24}
                className="text-[#FF6B00] mx-auto mb-2"
              />
              <div className="text-xl font-bold text-white">120+</div>
              <div className="text-xs text-zinc-400">Sessions</div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:account-tie"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Professional Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Experience:</span>
                <span className="text-white">
                  {getOrNoData(info.experience)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Certification:</span>
                <span className="text-white">
                  {getOrNoData(info.certification)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Training Environment:</span>
                <span className="text-white">
                  {getOrNoData(info.trainingEnvironment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Session Rate:</span>
                <span className="text-white">
                  {getOrNoData(info.sessionRate)}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:contact-mail"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white">
                  {getOrNoData(trainerData?.email)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Phone:</span>
                <span className="text-white">
                  {getOrNoData(trainerData?.phone)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">City:</span>
                <span className="text-white">
                  {getOrNoData(trainerData?.city)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Country:</span>
                <span className="text-white">
                  {getOrNoData(trainerData?.country)}
                </span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          {info.specialties && info.specialties.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:star-circle"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {formatSpecialties(info.specialties).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Training Types */}
          {info.trainingTypes && info.trainingTypes.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:dumbbell"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                Training Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {formatTrainingTypes(info.trainingTypes).map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-zinc-700 text-zinc-300 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {info.bio && (
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Icon
                  icon="mdi:information"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                About Me
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {info.bio}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
