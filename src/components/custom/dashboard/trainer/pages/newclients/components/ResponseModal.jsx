import { Icon } from "@iconify/react";
import Image from "next/image";
import { Modal } from "@/components/common/Modal";
import { FormField } from "@/components/common/FormField";
import { calculateAge } from "@/utils/dateUtils";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";

export const ResponseModal = ({
  isOpen,
  onClose,
  selectedRequest,
  responseType,
  rejectionReason,
  setRejectionReason,
  isSubmitting,
  onSubmit,
  responseError,
}) => {
  if (!selectedRequest) return null;

  // Helper function to get fitness goal text
  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Goal Not Specified";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  // Helper function to get experience text
  const getExperienceText = (level) => {
    if (!level) return "Experience Not Specified";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Icon
            icon={
              responseType === "accept"
                ? "mdi:check-circle"
                : "mdi:close-circle"
            }
            width={24}
            height={24}
            className={
              responseType === "accept" ? "text-green-400" : "text-red-400"
            }
          />
          {responseType === "accept" ? "Accept" : "Reject"} Coaching Request
        </div>
      }
      footerButtons={true}
      primaryButtonText={
        responseType === "accept" ? "Accept Client" : "Reject Request"
      }
      primaryButtonAction={onSubmit}
      primaryButtonDisabled={isSubmitting}
      secondaryButtonText="Cancel"
      secondaryButtonAction={onClose}
    >
      <div className="space-y-6">
        {/* Client Profile Summary */}
        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-lg ring-2 ring-slate-600/30 shadow-lg">
                {selectedRequest.client.clientProfile.profileImage ? (
                  <Image
                    src={selectedRequest.client.clientProfile.profileImage}
                    alt={`${selectedRequest.client.clientProfile.firstName} profile`}
                    className="object-cover w-full h-full"
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-700">
                    <Icon
                      icon="mdi:account"
                      width={32}
                      height={32}
                      className="text-slate-300"
                    />
                  </div>
                )}
              </div>
              {/* Gender Badge */}
              {selectedRequest.client.clientProfile.gender && (
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 shadow-lg ${
                    selectedRequest.client.clientProfile.gender.toLowerCase() ===
                    "male"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : selectedRequest.client.clientProfile.gender.toLowerCase() ===
                        "female"
                      ? "bg-gradient-to-br from-pink-500 to-pink-600"
                      : "bg-gradient-to-br from-slate-500 to-slate-600"
                  }`}
                >
                  <Icon
                    icon={
                      selectedRequest.client.clientProfile.gender.toLowerCase() ===
                      "male"
                        ? "mdi:gender-male"
                        : selectedRequest.client.clientProfile.gender.toLowerCase() ===
                          "female"
                        ? "mdi:gender-female"
                        : "mdi:help"
                    }
                    width={12}
                    height={12}
                    className="text-white"
                  />
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {selectedRequest.client.clientProfile.firstName}{" "}
                {selectedRequest.client.clientProfile.lastName}
              </h3>

              {/* Info Pills - Compact */}
              <div className="flex flex-wrap gap-2">
                {/* Experience Level */}
                <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="mdi:dumbbell"
                      width={14}
                      height={14}
                      className="text-blue-400"
                    />
                    <span className="text-slate-300 text-xs font-medium">
                      {getExperienceText(
                        selectedRequest.client.clientProfile.experienceLevel
                      )}
                    </span>
                  </div>
                </div>

                {/* Age */}
                <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                  <div className="flex items-center gap-1">
                    <Icon
                      icon="mdi:calendar"
                      width={14}
                      height={14}
                      className="text-purple-400"
                    />
                    <span className="text-slate-300 text-xs font-medium">
                      {calculateAge(
                        selectedRequest.client.clientProfile.dateOfBirth
                      )}{" "}
                      yrs
                    </span>
                  </div>
                </div>

                {/* Location */}
                {selectedRequest.client.clientProfile.location?.city && (
                  <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon="mdi:map-marker"
                        width={14}
                        height={14}
                        className="text-emerald-400"
                      />
                      <span className="text-slate-300 text-xs font-medium">
                        {selectedRequest.client.clientProfile.location.city}
                      </span>
                    </div>
                  </div>
                )}

                {/* Gender */}
                {selectedRequest.client.clientProfile.gender && (
                  <div className="bg-slate-900/30 rounded-lg px-2 py-1 border border-slate-700/30">
                    <div className="flex items-center gap-1">
                      <Icon
                        icon={
                          selectedRequest.client.clientProfile.gender.toLowerCase() ===
                          "male"
                            ? "mdi:gender-male"
                            : "mdi:gender-female"
                        }
                        width={14}
                        height={14}
                        className={
                          selectedRequest.client.clientProfile.gender.toLowerCase() ===
                          "male"
                            ? "text-blue-400"
                            : "text-pink-400"
                        }
                      />
                      <span className="text-slate-300 text-xs font-medium capitalize">
                        {selectedRequest.client.clientProfile.gender}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Primary Goal */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:target"
                className="text-[#3E92CC]"
                width={20}
                height={20}
              />
              <span className="text-zinc-400 text-sm">Primary Goal</span>
            </div>
            <p className="text-white font-medium">
              {getFitnessGoalText(
                selectedRequest.client.clientProfile.primaryGoal
              )}
            </p>
          </div>

          {/* Physical Stats */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon
                icon="mdi:human-male-height"
                className="text-[#3E92CC]"
                width={20}
                height={20}
              />
              <span className="text-zinc-400 text-sm">Physical Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Height</p>
                <p className="text-white font-medium">
                  {selectedRequest.client.clientProfile.height &&
                  selectedRequest.client.clientProfile.height > 0
                    ? `${selectedRequest.client.clientProfile.height}cm`
                    : "Not specified"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-xs mb-1">Weight</p>
                <p className="text-white font-medium">
                  {selectedRequest.client.clientProfile.weight &&
                  selectedRequest.client.clientProfile.weight > 0
                    ? `${selectedRequest.client.clientProfile.weight}kg`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Activities */}
        {selectedRequest.client.clientProfile.preferredActivities?.length >
          0 && (
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:dumbbell"
                className="text-[#3E92CC]"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Preferred Activities</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRequest.client.clientProfile.preferredActivities.map(
                (activity) => (
                  <span
                    key={activity.id}
                    className="px-3 py-1.5 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-800/30"
                  >
                    {activity.name}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Client Message */}
        {selectedRequest.note && (
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Icon
                icon="mdi:message-text"
                className="text-[#3E92CC]"
                width={20}
                height={20}
              />
              <h4 className="text-white font-medium">Message from Client</h4>
            </div>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
              <p className="text-zinc-300 text-sm italic">
                "{selectedRequest.note}"
              </p>
            </div>
          </div>
        )}

        {/* Medical Information Alert */}
        {(selectedRequest.client.clientProfile.medicalConditions ||
          selectedRequest.client.clientProfile.allergies) && (
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-900/10 rounded-xl p-4 border border-amber-700/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:medical-bag"
                className="text-amber-400 mt-1"
                width={20}
                height={20}
              />
              <div>
                <p className="text-amber-400 font-medium">
                  Important Health Information
                </p>
                <p className="text-amber-300/90 text-sm mt-1">
                  This client has disclosed medical conditions or allergies.
                  Please review their full profile for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {responseType === "accept" ? (
          <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 rounded-xl p-4 border border-green-700/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:information"
                className="text-green-400 mt-0.5"
                width={20}
                height={20}
              />
              <div>
                <p className="text-green-400 font-medium mb-1">
                  Ready to start coaching?
                </p>
                <p className="text-sm text-green-300">
                  By accepting this request, you'll be able to create
                  personalized workout plans and begin your coaching journey
                  with {selectedRequest.client.clientProfile.firstName}. You'll
                  have immediate access to create programs and communicate
                  directly.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 rounded-xl p-4 border border-red-700/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Icon
                  icon="mdi:alert"
                  className="text-red-400 mt-0.5"
                  width={20}
                  height={20}
                />
                <div>
                  <p className="text-red-400 font-medium mb-1">
                    Rejecting this request
                  </p>
                  <p className="text-sm text-red-300">
                    The client will be notified that their request was declined.
                    Please provide a brief reason.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-800/30 rounded-xl p-4 border border-zinc-700/50 backdrop-blur-sm">
              <FormField
                type="textarea"
                id="rejection-reason"
                name="rejectionReason"
                label="Reason for rejection (optional)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Currently at capacity, not a good fit for specialization, etc."
                rows={3}
                maxLength={200}
                disabled={isSubmitting}
                className="mb-0"
              />
              <p className="text-xs text-zinc-500 mt-2">
                {rejectionReason.length}/200 characters
              </p>
            </div>
          </div>
        )}

        {responseError && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 text-center text-red-400">
            {responseError}
          </div>
        )}
      </div>
    </Modal>
  );
};
