import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export const ClientProfileModal = ({ clientData, isOpen, onClose }) => {
  const getOrNoData = (val) => val ?? "No data";

  // Function to map activity names to proper labels
  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Unknown Activity";

    const activity = ACTIVITY_TYPES.find(
      (a) =>
        a.id === activityName ||
        a.label.toLowerCase() === activityName.toLowerCase()
    );
    return activity
      ? activity.label
      : activityName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Function to map goal names to proper labels
  const mapGoalToLabel = (goalName) => {
    if (!goalName) return "Unknown Goal";

    const goal = FITNESS_GOALS.find(
      (g) =>
        g.id === goalName || g.label.toLowerCase() === goalName.toLowerCase()
    );
    return goal
      ? goal.label
      : goalName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get client info with fallback
  const clientInfo = clientData?.clientInfo || {};

  // Progress data state
  const [progressData, setProgressData] = useState({
    goalsCompleted: 0,
    totalGoals: 0,
    workoutsThisMonth: 0,
    averageRating: 0,
  });
  const [_progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !clientData) return;
    setProgressLoading(true);
    // Example: fetch from /api/users/client?mode=basic (adjust if you have a dedicated endpoint)
    fetch("/api/users/client?mode=basic")
      .then((res) => res.json())
      .then((data) => {
        // You may need to adjust this mapping based on your API response
        const d = data.data || {};
        setProgressData({
          goalsCompleted: d.goalsCompleted ?? 0,
          totalGoals: d.totalGoals ?? 0,
          workoutsThisMonth: d.workoutsThisMonth ?? 0,
          averageRating: d.averageRating ?? 0,
        });
      })
      .catch(() => {
        setProgressData({
          goalsCompleted: 0,
          totalGoals: 0,
          workoutsThisMonth: 0,
          averageRating: 0,
        });
      })
      .finally(() => setProgressLoading(false));
  }, [isOpen, clientData]);

  if (!clientData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client Profile"
      footerButtons={false}
      size="large"
      isNested={true}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
            <div className="text-lg font-bold text-white">
              {progressData.goalsCompleted}/{progressData.totalGoals}
            </div>
            <div className="text-xs text-zinc-400">Goals</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
            <div className="text-lg font-bold text-white">
              {clientInfo?.totalSessions || 0}
            </div>
            <div className="text-xs text-zinc-400">Sessions</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
            <div className="text-lg font-bold text-white">
              {Math.round(
                progressData.totalGoals > 0
                  ? (progressData.goalsCompleted / progressData.totalGoals) *
                      100
                  : 0
              )}
              %
            </div>
            <div className="text-xs text-zinc-400">Progress</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700/30">
            <div className="text-lg font-bold text-white">
              {progressData.averageRating}
            </div>
            <div className="text-xs text-zinc-400">Rating</div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
          <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
            <Icon
              icon="mdi:account-circle"
              width={16}
              height={16}
              className="text-[#FF6B00]"
            />
            Personal Information
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-zinc-400">Age</span>
              <p className="text-white">
                {calculateAge(clientData?.dateOfBirth)} years old
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Gender</span>
              <p className="text-white capitalize">
                {getOrNoData(clientData?.gender)}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Height</span>
              <p className="text-white">
                {clientData?.height ? `${clientData.height} cm` : "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Weight</span>
              <p className="text-white">
                {clientData?.weight ? `${clientData.weight} kg` : "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Experience</span>
              <p className="text-white capitalize">
                {clientData?.experienceLevel
                  ? clientData.experienceLevel.replace(/_/g, "-")
                  : "No data"}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Member Since</span>
              <p className="text-white">
                {clientInfo?.createdAt
                  ? new Date(clientInfo.createdAt).toLocaleDateString()
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
                {getOrNoData(clientData?.contactEmail)}
              </p>
            </div>
            <div>
              <span className="text-zinc-400">Phone</span>
              <p className="text-white">
                {getOrNoData(clientData?.contactPhone)}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-zinc-400">Location</span>
              <p className="text-white">
                {clientData?.location
                  ? `${clientData.location.city}, ${clientData.location.country}`
                  : "No location data"}
              </p>
            </div>
          </div>
        </div>

        {/* Goals & Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fitness Goals */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:target"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Fitness Goals
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Primary Goal</span>
                <p className="text-white capitalize">
                  {mapGoalToLabel(getOrNoData(clientData?.primaryGoal))}
                </p>
              </div>
              {clientData?.secondaryGoal && (
                <div>
                  <span className="text-zinc-400">Secondary Goal</span>
                  <p className="text-white capitalize">
                    {mapGoalToLabel(clientData.secondaryGoal)}
                  </p>
                </div>
              )}
              {clientData?.goalDescription && (
                <div>
                  <span className="text-zinc-400">Description</span>
                  <p className="text-white">{clientData.goalDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* Preferred Activities */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:run"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Preferred Activities
            </h4>
            {clientData?.preferredActivities &&
            clientData.preferredActivities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {clientData.preferredActivities.map((activity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#FF6B00]/20 border border-[#FF6B00]/30 text-[#FF6B00] rounded text-xs"
                  >
                    {mapActivityToLabel(activity.name)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm">
                No preferred activities specified
              </p>
            )}
          </div>
        </div>

        {/* Languages & Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {clientData?.languages && clientData.languages.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {clientData.languages.map((language, index) => (
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

          {/* Health Information */}
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <Icon
                icon="mdi:heart-pulse"
                width={16}
                height={16}
                className="text-[#FF6B00]"
              />
              Health Information
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-400">Medical Conditions</span>
                <p className="text-white">
                  {getOrNoData(clientData?.medicalConditions)}
                </p>
              </div>
              <div>
                <span className="text-zinc-400">Allergies</span>
                <p className="text-white">
                  {getOrNoData(clientData?.allergies)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Me */}
        {(clientData?.description || clientData?.previousActivities) && (
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
            <div className="space-y-3 text-sm">
              {clientData?.description && (
                <div>
                  <span className="text-zinc-400">Description</span>
                  <p className="text-white leading-relaxed">
                    {clientData.description}
                  </p>
                </div>
              )}
              {clientData?.previousActivities && (
                <div>
                  <span className="text-zinc-400">Previous Activities</span>
                  <p className="text-white leading-relaxed">
                    {clientData.previousActivities}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
