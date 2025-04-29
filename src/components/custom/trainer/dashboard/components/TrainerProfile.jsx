import { StatCard, UserProfile } from "@/components/custom/shared";

export const TrainerProfile = ({ trainerData }) => {
    const avatarContent = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
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
                subtext={<span className="text-[#4CAF50]">+10 clients from last month</span>}
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
