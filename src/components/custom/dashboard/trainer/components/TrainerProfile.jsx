import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common/Button";
import { StatCard, UserProfile } from "@/components/custom/dashboard/shared";

export const TrainerProfile = ({ trainerData }) => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/trainer/edit-profile");
    console.log("edit profile");
  };

  return (
    <div className="relative">
      <UserProfile
        userData={trainerData}
        profileType="trainer"
        avatarContent={trainerData.avatarContent}
        profileSubtitle={trainerData.specialty}
        profileTitle={trainerData.name}
        certifications={trainerData.certifications}
      >
        <StatCard
          label="Total Sessions"
          value={trainerData.totalSessions}
          subtext={
            <span className="text-[#4CAF50]">
              +100 sessions from last month
            </span>
          }
        />

        <StatCard
          label="Active Clients"
          value={
            trainerData.clients
              ? trainerData.clients.filter((c) => c.status === "active").length
              : 0
          }
          subtext={
            <span className="text-[#4CAF50]">+1 clients from last month</span>
          }
        />

        <StatCard
          label="Upcoming Sessions"
          value={trainerData.upcomingSessions}
          subtext={
            <span className="text-[#4CAF50]">+10 sessions from last month</span>
          }
        />

        <StatCard
          label="Rating"
          value={`${trainerData.rating}`}
          subtext={<span className="text-[#FF6B00]">★</span>}
        />
      </UserProfile>

      {/* Edit Profile Button */}
      <Button
        variant="secondary"
        leftIcon={
          <Icon icon="material-symbols:settings" width={16} height={16} />
        }
        className="absolute right-0 top-0"
        onClick={handleEditProfile}
      >
        Edit Profile
      </Button>
    </div>
  );
};
