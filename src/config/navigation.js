// Client Dashboard Navigation Configuration
export const CLIENT_NAVIGATION = [
  {
    id: "trainwithcoach",
    label: "Train with Coach",
    icon: "mdi:account-supervisor",
    route: "/client/dashboard/trainwithcoach",
    description: "Find and connect with trainers",
  },
  {
    id: "overview",
    label: "Overview",
    icon: "mdi:view-dashboard",
    route: "/client/dashboard/overview",
    description: "Your fitness dashboard",
  },
  {
    id: "upcoming-trainings",
    label: "Upcoming Trainings",
    icon: "mdi:calendar-clock",
    route: "/client/dashboard/upcoming-trainings",
    description: "Your scheduled sessions",
  },
  {
    id: "trainings",
    label: "Trainings",
    icon: "mdi:dumbbell",
    route: "/client/dashboard/trainings",
    description: "Your workout history",
  },
  {
    id: "progress",
    label: "Progress",
    icon: "mdi:chart-line",
    route: "/client/dashboard/progress",
    description: "Track your fitness journey",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "mdi:message-text",
    route: "/client/dashboard/messages",
    description: "Chat with your trainer",
    badgeCount: 0, // Will be updated dynamically
  },
  {
    id: "nutrition",
    label: "Nutrition",
    icon: "mdi:food-apple",
    route: "/client/dashboard/nutrition",
    description: "Your nutrition plan",
  },
  {
    id: "health",
    label: "Health",
    icon: "mdi:heart-pulse",
    route: "/client/dashboard/health",
    description: "Health monitoring",
  },
];

// Trainer Dashboard Navigation Configuration
export const TRAINER_NAVIGATION = [
  {
    id: "newClients",
    label: "New Clients",
    icon: "mdi:account-plus",
    route: "/trainer/dashboard/newclients",
    description: "Client requests and applications",
  },
  {
    id: "clients",
    label: "Clients",
    icon: "mdi:account-group",
    route: "/trainer/dashboard/clients",
    description: "Manage your clients",
  },
  {
    id: "upcomingTrainings",
    label: "Upcoming Trainings",
    icon: "mdi:calendar-clock",
    route: "/trainer/dashboard/upcoming-trainings",
    description: "Your scheduled sessions",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "mdi:message-text",
    route: "/trainer/dashboard/messages",
    description: "Chat with clients",
    badgeCount: 0, // Will be updated dynamically
  },
  {
    id: "plans",
    label: "Plans",
    icon: "mdi:clipboard-text",
    route: "/trainer/dashboard/plans",
    description: "Training and nutrition plans",
  },
  {
    id: "exercises",
    label: "Exercises",
    icon: "mdi:dumbbell",
    route: "/trainer/dashboard/exercises",
    description: "Exercise library",
  },
  {
    id: "meals",
    label: "Meals",
    icon: "mdi:food",
    route: "/trainer/dashboard/meals",
    description: "Meal library",
  },
];

// Helper function to get navigation config by profile type
export const getNavigationConfig = (profileType) =>
  profileType === "trainer" ? TRAINER_NAVIGATION : CLIENT_NAVIGATION;

// Helper function to update badge counts
export const updateNavigationBadges = (navigation, badges = {}) =>
  navigation.map((item) => ({
    ...item,
    badgeCount: badges[item.id] || 0,
  }));
