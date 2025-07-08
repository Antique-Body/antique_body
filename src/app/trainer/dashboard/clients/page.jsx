"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { InfoBanner } from "@/components/common/InfoBanner";
import { Modal } from "@/components/common/Modal";
import { ACTIVITY_TYPES } from "@/enums/activityTypes";
import { EXPERIENCE_LEVELS } from "@/enums/experienceLevels";
import { FITNESS_GOALS } from "@/enums/fitnessGoals";
import { calculateAge } from "@/utils/dateUtils";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showMessageInfo, setShowMessageInfo] = useState(false);

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

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleCloseModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
  };

  const handleShowMessageInfo = () => {
    setShowMessageInfo(true);
    setTimeout(() => setShowMessageInfo(false), 3000);
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
    if (!level) return "Unknown";

    const experienceLevel = EXPERIENCE_LEVELS.find(
      (exp) => exp.value === level
    );
    return experienceLevel ? experienceLevel.label : level;
  };

  const getFitnessGoalText = (goalId) => {
    if (!goalId) return "Unknown Goal";

    const fitnessGoal = FITNESS_GOALS.find((goal) => goal.id === goalId);
    return fitnessGoal ? fitnessGoal.label : goalId;
  };

  const mapActivityToLabel = (activityName) => {
    if (!activityName) return "Unknown Activity";

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
        <h1 className="text-2xl font-bold text-white mb-2">My Clients</h1>
        <p className="text-zinc-400">
          Manage your accepted clients and their fitness journeys
        </p>
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

            return (
              <Card
                key={clientRequest.id}
                variant="clientCard"
                hover={true}
                className="overflow-visible"
              >
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
                  </div>

                  {/* Client Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {profile.firstName} {profile.lastName}
                      </h3>
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
                          <Icon icon="mdi:map-marker" width={12} height={12} />
                          {profile.location.city}
                        </span>
                      )}
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
                        onClick={() => handleViewClient(clientRequest)}
                        leftIcon={
                          <Icon icon="mdi:eye" width={16} height={16} />
                        }
                      >
                        View Details
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
              </Card>
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

      {/* Client Detail Modal */}
      {showClientModal && selectedClient && (
        <Modal
          isOpen={showClientModal}
          onClose={handleCloseModal}
          title={
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:account-details"
                width={24}
                height={24}
                className="text-[#3E92CC]"
              />
              Client Details
            </div>
          }
          hideButtons={true}
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Profile Header */}
            <Card variant="dark" className="overflow-visible">
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 overflow-hidden rounded-xl ring-4 ring-[#3E92CC]/20">
                  {selectedClient.client.clientProfile.profileImage ? (
                    <Image
                      src={selectedClient.client.clientProfile.profileImage}
                      alt={`${selectedClient.client.clientProfile.firstName} profile`}
                      className="object-cover w-full h-full"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                      <Icon
                        icon="mdi:account"
                        width={48}
                        height={48}
                        color="white"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedClient.client.clientProfile.firstName}{" "}
                    {selectedClient.client.clientProfile.lastName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-sm rounded-full">
                      {getExperienceText(
                        selectedClient.client.clientProfile.experienceLevel
                      )}
                    </span>
                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-sm rounded-full">
                      {calculateAge(
                        selectedClient.client.clientProfile.dateOfBirth
                      )}{" "}
                      years
                    </span>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-sm rounded-full">
                      Active since {formatDate(selectedClient.respondedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:map-marker"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <span className="text-zinc-400 text-sm">Location</span>
                </div>
                <p className="text-white font-medium">
                  {selectedClient.client.clientProfile.location?.city ||
                    "Not specified"}
                </p>
              </Card>
              <Card variant="dark" className="overflow-visible">
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
                    selectedClient.client.clientProfile.primaryGoal
                  )}
                </p>
              </Card>
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    icon="mdi:human-male-height"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <span className="text-zinc-400 text-sm">Physical Stats</span>
                </div>
                <p className="text-white font-medium">
                  {selectedClient.client.clientProfile.height}cm •{" "}
                  {selectedClient.client.clientProfile.weight}kg
                </p>
              </Card>
            </div>

            {/* Preferred Activities */}
            {selectedClient.client.clientProfile.preferredActivities.length >
              0 && (
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:dumbbell"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">
                    Preferred Activities
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedClient.client.clientProfile.preferredActivities.map(
                    (activity) => (
                      <span
                        key={activity.id}
                        className="px-3 py-1.5 bg-green-900/30 text-green-400 text-sm rounded-full border border-green-800/30"
                      >
                        {mapActivityToLabel(activity.name)}
                      </span>
                    )
                  )}
                </div>
              </Card>
            )}

            {/* Medical Information */}
            {(selectedClient.client.clientProfile.medicalConditions ||
              selectedClient.client.clientProfile.allergies) && (
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:medical-bag"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">
                    Medical Information
                  </h4>
                </div>
                <div className="space-y-3">
                  {selectedClient.client.clientProfile.medicalConditions && (
                    <div className="flex items-start gap-2 bg-amber-900/20 rounded-lg p-3 border border-amber-700/30">
                      <Icon
                        icon="mdi:medical-bag"
                        className="text-amber-400 mt-1"
                        width={16}
                        height={16}
                      />
                      <div>
                        <p className="text-amber-400 font-medium text-sm mb-1">
                          Medical Conditions
                        </p>
                        <p className="text-amber-300/90 text-sm">
                          {
                            selectedClient.client.clientProfile
                              .medicalConditions
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedClient.client.clientProfile.allergies && (
                    <div className="flex items-start gap-2 bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                      <Icon
                        icon="mdi:alert"
                        className="text-red-400 mt-1"
                        width={16}
                        height={16}
                      />
                      <div>
                        <p className="text-red-400 font-medium text-sm mb-1">
                          Allergies
                        </p>
                        <p className="text-red-300/90 text-sm">
                          {selectedClient.client.clientProfile.allergies}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Initial Request Note */}
            {selectedClient.note && (
              <Card variant="dark" className="overflow-visible">
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    icon="mdi:message-text"
                    className="text-[#3E92CC]"
                    width={20}
                    height={20}
                  />
                  <h4 className="text-white font-medium">Initial Request</h4>
                </div>
                <p className="text-zinc-300 text-sm italic bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
                  "{selectedClient.note}"
                </p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-zinc-900 p-4 -mx-6 -mb-6 border-t border-zinc-800">
              <Button
                variant="primary"
                onClick={handleCloseModal}
                leftIcon={<Icon icon="mdi:check" width={20} height={20} />}
                fullWidth
              >
                Close
              </Button>
              <Button
                variant="success"
                onClick={handleShowMessageInfo}
                leftIcon={<Icon icon="mdi:message" width={20} height={20} />}
                fullWidth
              >
                Message Client
              </Button>
            </div>
            {showMessageInfo && (
              <div className="mt-2 text-green-400 text-xs text-center">
                Messaging feature coming soon!
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
