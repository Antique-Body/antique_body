import { StatCard, UserProfile } from "@/components/custom/shared";

export const ClientProfile = ({ userData }) => {
  const avatarContent = (
    <span className="text-4xl">
      {userData.name
        .split(" ")
        .map(n => n[0])
        .join("")}
    </span>
  );

  return (
    <UserProfile
      userData={userData}
      profileType="client"
      avatarContent={avatarContent}
      showProgressBar={true}
      progressData={userData.progress}
      profileTitle={userData.name}
      profileSubtitle={`Plan: ${userData.planName} • Coach: ${userData.coach}`}
    >
      <StatCard label="Next Session" value="Apr 12" subtext="10:00 AM" />

      <StatCard
        label="Current Weight"
        value={`${userData.stats.weight} kg`}
        subtext={<span className="text-[#4CAF50]">-2kg from start</span>}
      />

      <StatCard
        label="Body Fat"
        value={`${userData.stats.bodyFat}%`}
        subtext={<span className="text-[#4CAF50]">-2.5% from start</span>}
      />

      <StatCard label="Daily Calories" value={userData.stats.calorieGoal} subtext="Target intake" />
    </UserProfile>
  );
};
