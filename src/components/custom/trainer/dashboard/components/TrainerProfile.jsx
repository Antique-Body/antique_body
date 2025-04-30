import { StatCard, UserProfile } from "@/components/custom/shared";

export const TrainerProfile = ({ trainerData }) => {
  const avatarContent = (
    <span className="text-4xl">
      {trainerData.name
        .split(" ")
        .map(n => n[0])
        .join("")}
    </span>
  );

  return (
    <UserProfile
      userData={trainerData}
      profileType="trainer"
      avatarContent={avatarContent}
      profileSubtitle={trainerData.specialty}
      profileTitle={trainerData.name}
      certifications={trainerData.certifications}
    >
      <StatCard
        label="Total Sessions"
        value={trainerData.totalSessions}
        subtext={<span className="text-[#4CAF50]">+100 sessions from last month</span>}
      />

      <StatCard
        label="Active Clients"
        value={trainerData.clients ? trainerData.clients.filter(c => c.status === "active").length : 0}
        subtext={<span className="text-[#4CAF50]">+1 clients from last month</span>}
      />

      <StatCard
        label="Upcoming Sessions"
        value={trainerData.upcomingSessions}
        subtext={<span className="text-[#4CAF50]">+10 sessions from last month</span>}
      />

      <StatCard label="Rating" value={`${trainerData.rating}`} subtext={<span className="text-[#FF6B00]">★</span>} />
    </UserProfile>
  );
};
