"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { InfoBanner } from "@/components/common/InfoBanner";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { getGenderStyles } from "@/lib/utils";

// Utility function to get gender icon and background class
function getGenderIconAndClass(gender) {
  const g = (gender || "").toLowerCase();
  if (g === "male") {
    return {
      icon: "mdi:gender-male",
      bgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
      pillClass: "bg-blue-900/30 text-blue-400",
    };
  } else if (g === "female") {
    return {
      icon: "mdi:gender-female",
      bgClass: "bg-gradient-to-br from-pink-500 to-pink-600",
      pillClass: "bg-pink-900/30 text-pink-400",
    };
  } else {
    return {
      icon: "mdi:help",
      bgClass: "bg-gradient-to-br from-slate-500 to-slate-600",
      pillClass: "bg-slate-900/30 text-slate-400",
    };
  }
}

export default function ClientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get tracking parameters
  const planId = searchParams.get('planId');
  const planType = searchParams.get('type');

  // Fetch accepted clients
  const fetchAcceptedClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/coaching-requests?role=trainer&status=accepted"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch clients");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedClients();
  }, []);

  const handleViewClient = (clientRequest) => {
    if (planId) {
      // If tracking a specific plan, navigate to the assigned plan page
      router.push(`/trainer/dashboard/clients/${clientRequest.id}/plans/${planId}?type=${planType}`);
    } else {
      // Normal client dashboard navigation
      router.push(`/trainer/dashboard/clients/${clientRequest.id}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExperienceText = (level) => {
    if (!level) return "Experience Not Specified";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Goal Not Specified";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Activity Not Specified";

    const activity = ACTIVITY_TYPES.find(
      (a) =>
        a.id === activityName ||
        (a.label && a.label.toLowerCase() === activityName.toLowerCase())
    );
    return activity
      ? activity.label
      : activityName
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
            <p className="mt-4 text-zinc-400">Loading clients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-5">
        <div className="flex h-64 w-full items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <Icon
              icon="mdi:alert-circle"
              className="text-red-500"
              width={48}
              height={48}
            />
            <p className="mt-4 text-lg font-medium text-white">
              Failed to load clients
            </p>
            <p className="mt-2 text-zinc-400">{error}</p>
            <Button
              variant="primary"
              onClick={fetchAcceptedClients}
              leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {planId ? 'Track Plan Progress' : 'My Clients'}
        </h1>
        <p className="text-zinc-400">
          {planId 
            ? 'Select a client to track their progress with this plan'
            : 'Manage your accepted clients and their fitness journeys'
          }
        </p>
        {planId && (
          <div className="mt-3 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg flex items-center gap-3">
            <Icon icon="mdi:information" className="text-orange-400" width={20} height={20} />
            <div>
              <p className="text-orange-200 text-sm font-medium">
                Plan Tracking Mode: {planType === 'nutrition' ? 'Nutrition Plan' : 'Training Plan'}
              </p>
              <p className="text-orange-300/80 text-xs">
                Click on a client to view their progress with the selected plan
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Banner */}
      <div className="mb-6">
        <InfoBanner
          icon="mdi:account-group"
          title={`Active Clients (${clients.length})`}
          subtitle={
            clients.length === 0
              ? "No active clients yet. Accept client requests to start coaching!"
              : `You are currently coaching ${clients.length} client${
                  clients.length === 1 ? "" : "s"
                }.`
          }
          variant="success"
        />
      </div>

      {/* Clients List */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {clients.map((clientRequest) => {
            const client = clientRequest.client;
            const profile = client.clientProfile;
            const clientGender = profile?.gender;
            const genderStyles = getGenderStyles(clientGender);
            const isMale = clientGender?.toLowerCase() === "male";
            const isFemale = clientGender?.toLowerCase() === "female";

            return (
              <div
                key={clientRequest.id}
                className={`relative group w-full ${genderStyles.background} border ${genderStyles.border} rounded-xl shadow-lg ${genderStyles.shadow} transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden cursor-pointer`}
                role="button"
                tabIndex={0}
                onClick={() => handleViewClient(clientRequest)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleViewClient(clientRequest);
                  }
                }}
              >
                {/* Gender Accent Strip */}
                {(isMale || isFemale) && (
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${genderStyles.accent} opacity-70`}
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Profile Image */}
                    <div className="relative group">
                      <div className="h-20 w-20 overflow-hidden rounded-xl ring-2 ring-[#3E92CC]/20 transition-all duration-300 group-hover:ring-[#3E92CC]/50">
                        {profile.profileImage ? (
                          <Image
                            src={profile.profileImage}
                            alt={`${profile.firstName} profile`}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            width={80}
                            height={80}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                            <Icon
                              icon="mdi:account"
                              width={32}
                              height={32}
                              color="white"
                            />
                          </div>
                        )}
                      </div>
                      {/* Gender Badge */}
                      {profile.gender &&
                        (() => {
                          const { icon, bgClass } = getGenderIconAndClass(
                            profile.gender
                          );
                          return (
                            <div
                              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border border-slate-800 shadow-lg ${bgClass}`}
                            >
                              <Icon
                                icon={icon}
                                width={12}
                                height={12}
                                className="text-white"
                              />
                            </div>
                          );
                        })()}
                    </div>

                    {/* Client Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <Icon
                          icon="mdi:arrow-right"
                          className="text-[#3E92CC] opacity-0 group-hover:opacity-100 transition-opacity"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                          Active Client
                        </span>
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                          {getExperienceText(profile.experienceLevel)}
                        </span>
                        {profile.location && (
                          <span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                            <Icon
                              icon="mdi:map-marker"
                              width={12}
                              height={12}
                            />
                            {profile.location.city}
                          </span>
                        )}
                        {/* Gender Pill */}
                        {profile.gender &&
                          (() => {
                            const { icon, pillClass } = getGenderIconAndClass(
                              profile.gender
                            );
                            return (
                              <span
                                className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${pillClass}`}
                              >
                                <Icon icon={icon} width={12} height={12} />
                                {profile.gender}
                              </span>
                            );
                          })()}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-zinc-800/50 rounded-lg p-2">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              icon="mdi:target"
                              className="text-[#3E92CC]"
                              width={16}
                              height={16}
                            />
                            <span className="text-zinc-400 text-xs">Goal</span>
                          </div>
                          <p className="text-white text-sm mt-0.5 truncate">
                            {getFitnessGoalText(profile.primaryGoal)}
                          </p>
                        </div>
                        <div className="bg-zinc-800/50 rounded-lg p-2">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              icon="mdi:calendar-check"
                              className="text-[#3E92CC]"
                              width={16}
                              height={16}
                            />
                            <span className="text-zinc-400 text-xs">
                              Client Since
                            </span>
                          </div>
                          <p className="text-white text-sm mt-0.5">
                            {formatDate(clientRequest.respondedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Preferred Activities */}
                      {profile.preferredActivities.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon
                              icon="mdi:dumbbell"
                              className="text-[#3E92CC]"
                              width={16}
                              height={16}
                            />
                            <span className="text-zinc-400 text-xs">
                              Activities
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.preferredActivities
                              .slice(0, 3)
                              .map((activity) => (
                                <span
                                  key={activity.id}
                                  className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full"
                                >
                                  {mapActivityToLabel(activity.name)}
                                </span>
                              ))}
                            {profile.preferredActivities.length > 3 && (
                              <span className="px-2 py-1 bg-zinc-700 text-zinc-400 text-xs rounded-full">
                                +{profile.preferredActivities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Medical Alerts */}
                      {(profile.medicalConditions || profile.allergies) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {profile.medicalConditions && (
                            <span className="px-2 py-1 bg-amber-900/30 text-amber-400 text-xs rounded-full flex items-center gap-1">
                              <Icon
                                icon="mdi:medical-bag"
                                width={12}
                                height={12}
                              />
                              Medical Info
                            </span>
                          )}
                          {profile.allergies && (
                            <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full flex items-center gap-1">
                              <Icon icon="mdi:alert" width={12} height={12} />
                              Allergies
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClient(clientRequest);
                          }}
                          leftIcon={
                            <Icon icon={planId ? "mdi:chart-line" : "mdi:eye"} width={16} height={16} />
                          }
                        >
                          {planId ? "Track Plan" : "View Dashboard"}
                        </Button>
                        <div className="group relative">
                          <Button
                            variant="success"
                            size="small"
                            disabled
                            leftIcon={
                              <Icon icon="mdi:message" width={16} height={16} />
                            }
                          >
                            Message
                          </Button>
                          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-zinc-800 text-xs text-green-400 rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-lg border border-zinc-700">
                            Messaging feature coming soon!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon
            icon="mdi:account-group-outline"
            className="text-zinc-600 mx-auto mb-4"
            width={64}
            height={64}
          />
          <p className="text-xl font-medium text-zinc-400 mb-2">
            No Active Clients
          </p>
          <p className="text-zinc-500">
            Accept client requests from the "New Clients" tab to start coaching!
          </p>
        </div>
      )}
    </div>
  );
}
