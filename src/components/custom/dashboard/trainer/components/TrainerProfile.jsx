import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { StatCard, UserProfile } from "@/components/custom/dashboard/shared";
import { SPECIALTIES } from "@/enums/specialties";
import { TRAINING_TYPES } from "@/enums/trainingTypes";

export const TrainerProfile = ({ trainerData }) => {
  const router = useRouter();
  const info = trainerData?.trainerInfo || {};
  const getOrNoData = (val) => val ?? "No data";

  // Combine first and last name
  const fullName =
    (trainerData?.firstName || "") +
      (trainerData?.lastName ? ` ${trainerData.lastName}` : "") ||
    trainerData?.name ||
    "No data";

  // Specialties (array of objects with .name or array of strings)
  const specialties =
    trainerData?.specialties?.map((s) => s.name) ||
    trainerData?.specialties ||
    [];

  // Training types (array of objects with .name or array of strings)
  const trainingTypes =
    trainerData?.trainingTypes?.map((t) => t.name) ||
    trainerData?.trainingTypes ||
    [];

  return (
    <div className="relative">
      <UserProfile
        userData={trainerData}
        profileType="trainer"
        avatarContent={trainerData?.profileImage || trainerData?.avatarContent}
        profileTitle={fullName}
        certifications={[]}
        className="py-2"
      >
        <div className="w-full space-y-4">
          {/* Specialties section - prvi red */}
          <div className="w-full bg-[rgba(0,180,255,0.05)] p-3 rounded-lg border border-[rgba(0,180,255,0.1)]">
            <h3 className="text-xs font-medium text-white mb-2 flex items-center">
              <Icon
                icon="mdi:star-circle"
                className="mr-1 text-[#00B4FF]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#00B4FF] to-white bg-clip-text text-transparent">
                Specialties
              </span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {specialties.length > 0 ? (
                specialties.map((spec, idx) => {
                  const obj = SPECIALTIES.find((s) => s.id === spec);
                  const label = obj?.label || spec;
                  const icon = obj?.icon;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md border border-[rgba(0,180,255,0.3)] bg-[rgba(0,180,255,0.15)] px-2 py-0.5 text-xs font-medium text-[#00B4FF] shadow-sm"
                    >
                      {icon && <Icon icon={icon} width={12} height={12} />}
                      {label}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400 text-xs">No specialties</span>
              )}
            </div>
          </div>

          {/* Training Types section - drugi red */}
          <div className="w-full bg-[rgba(255,107,0,0.05)] p-3 rounded-lg border border-[rgba(255,107,0,0.1)]">
            <h3 className="text-xs font-medium text-white mb-2 flex items-center">
              <Icon
                icon="mdi:dumbbell"
                className="mr-1 text-[#FF6B00]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#FF6B00] to-white bg-clip-text text-transparent">
                Training Types
              </span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {trainingTypes.length > 0 ? (
                trainingTypes.map((type, idx) => {
                  const obj = TRAINING_TYPES.find((t) => t.id === type);
                  const label = obj?.label || type;
                  const icon = obj?.icon;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-0.5 text-xs font-medium text-[#FF6B00] shadow-sm"
                    >
                      {icon && <Icon icon={icon} width={12} height={12} />}
                      {label}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-400 text-xs">No training types</span>
              )}
            </div>
          </div>

          {/* Stats Section - treći red */}
          <div className="w-full bg-[rgba(151,71,255,0.05)] p-3 rounded-lg border border-[rgba(151,71,255,0.1)]">
            <h3 className="text-xs font-medium text-white mb-2 flex items-center">
              <Icon
                icon="mdi:chart-bar"
                className="mr-1 text-[#9747FF]"
                width={16}
                height={16}
              />
              <span className="bg-gradient-to-r from-[#9747FF] to-white bg-clip-text text-transparent">
                Performance Statistics
              </span>
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
              <StatCard
                label="Total Sessions"
                value={getOrNoData(info.totalSessions)}
                subtext={<span className="text-[#4CAF50]">+100 sessions</span>}
              />
              <StatCard
                label="Active Clients"
                value={
                  trainerData?.clients
                    ? trainerData.clients.filter((c) => c.status === "active")
                        .length
                    : "No data"
                }
                subtext={<span className="text-[#4CAF50]">+1 clients</span>}
              />
              <StatCard
                label="Upcoming Sessions"
                value={getOrNoData(info.upcomingSessions)}
                subtext={<span className="text-[#4CAF50]">+10 sessions</span>}
              />
              <StatCard
                label="Total Earnings"
                value={
                  info.totalEarnings ? `$${info.totalEarnings}` : "No data"
                }
                subtext={<span className="text-[#4CAF50]">+$1,200</span>}
              />
              <StatCard
                label="Rating"
                value={getOrNoData(info.rating)}
                subtext={<span className="text-[#FF6B00]">★★★★★</span>}
              />
            </div>
          </div>
        </div>
      </UserProfile>
      {/* Edit Profile Button */}
      <Button
        variant="secondary"
        leftIcon={
          <Icon icon="material-symbols:settings" width={16} height={16} />
        }
        className="absolute right-0 top-0"
        onClick={() => router.push("/trainer/edit-profile")}
      >
        Edit Profile
      </Button>
    </div>
  );
};
