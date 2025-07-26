// Client Dashboard Navigation Configuration
export const CLIENT_NAVIGATION = Object.freeze([
  Object.freeze({
    id: "trainwithcoach",
    label: "Train with Coach",
    icon: "mdi:account-supervisor",
    route: "/client/dashboard/trainwithcoach",
    description: "Find and connect with trainers",
    badgeCount: 0, // Will be updated dynamically
  }),
  Object.freeze({
    id: "overview",
    label: "Overview",
    icon: "mdi:view-dashboard",
    route: "/client/dashboard/overview",
    description: "Your fitness dashboard",
  }),
  Object.freeze({
    id: "upcoming-trainings",
    label: "Upcoming Trainings",
    icon: "mdi:calendar-clock",
    route: "/client/dashboard/upcoming-trainings",
    description: "Your scheduled sessions",
  }),
  Object.freeze({
    id: "trainings",
    label: "Trainings",
    icon: "mdi:dumbbell",
    route: "/client/dashboard/trainings",
    description: "Your workout history",
  }),
  Object.freeze({
    id: "progress",
    label: "Progress",
    icon: "mdi:chart-line",
    route: "/client/dashboard/progress",
    description: "Track your fitness journey",
  }),
  Object.freeze({
    id: "messages",
    label: "Messages",
    icon: "mdi:message-text",
    route: "/client/dashboard/messages",
    description: "Chat with your trainer",
    badgeCount: 0, // Will be updated dynamically
  }),
  Object.freeze({
    id: "diet-tracker",
    label: "Diet Tracker",
    icon: "mdi:food-apple",
    route: "/client/dashboard/diet-tracker",
    description: "Your nutrition plan",
  }),
  Object.freeze({
    id: "health",
    label: "Health",
    icon: "mdi:heart-pulse",
    route: "/client/dashboard/health",
    description: "Health monitoring",
  }),
]);

// Client Dashboard Bottom Navigation
export const CLIENT_BOTTOM_NAVIGATION = Object.freeze([
  Object.freeze({
    id: "edit",
    label: "Edit Profile",
    icon: "mdi:pencil",
    route: "/client/dashboard/edit",
    description: "Edit your profile information",
  }),
  Object.freeze({
    id: "settings",
    label: "Settings",
    icon: "mdi:cog",
    route: "/client/dashboard/settings",
    description: "Manage your account settings",
  }),
  Object.freeze({
    id: "logout",
    label: "Logout",
    icon: "mdi:logout",
    route: "#logout",
    description: "Sign out of your account",
  }),
]);

// Trainer Dashboard Navigation Configuration
export const TRAINER_NAVIGATION = Object.freeze([
  Object.freeze({
    id: "newClients",
    label: "New Clients",
    icon: "mdi:account-plus",
    route: "/trainer/dashboard/newclients",
    description: "Client requests and applications",
    badgeCount: 0, // Will be updated dynamically
  }),
  Object.freeze({
    id: "clients",
    label: "Clients",
    icon: "mdi:account-group",
    route: "/trainer/dashboard/clients",
    description: "Manage your clients",
    badgeCount: 0, // Will be updated dynamically
  }),
  Object.freeze({
    id: "upcomingTrainings",
    label: "Upcoming Trainings",
    icon: "mdi:calendar-clock",
    route: "/trainer/dashboard/upcoming-trainings",
    description: "Your scheduled sessions",
  }),
  Object.freeze({
    id: "messages",
    label: "Messages",
    icon: "mdi:message-text",
    route: "/trainer/dashboard/messages",
    description: "Chat with clients",
    badgeCount: 0, // Will be updated dynamically
  }),
  Object.freeze({
    id: "plans",
    label: "Plans",
    icon: "mdi:clipboard-text",
    route: "/trainer/dashboard/plans",
    description: "Training and nutrition plans",
  }),
  Object.freeze({
    id: "exercises",
    label: "Exercises",
    icon: "mdi:dumbbell",
    route: "/trainer/dashboard/exercises",
    description: "Exercise library",
  }),
  Object.freeze({
    id: "meals",
    label: "Meals",
    icon: "mdi:food",
    route: "/trainer/dashboard/meals",
    description: "Meal library",
  }),
]);

// Trainer Dashboard Bottom Navigation
export const TRAINER_BOTTOM_NAVIGATION = Object.freeze([
  Object.freeze({
    id: "edit",
    label: "Edit Profile",
    icon: "mdi:pencil",
    route: "/trainer/dashboard/edit",
    description: "Edit your profile information",
  }),
  Object.freeze({
    id: "settings",
    label: "Settings",
    icon: "mdi:cog",
    route: "/trainer/dashboard/settings",
    description: "Manage your account settings",
  }),
  Object.freeze({
    id: "logout",
    label: "Logout",
    icon: "mdi:logout",
    route: "#logout",
    description: "Sign out of your account",
  }),
]);

// Helper function to get navigation config by profile type
export const getNavigationConfig = (profileType) =>
  profileType === "trainer" ? TRAINER_NAVIGATION : CLIENT_NAVIGATION;

// Helper function to get bottom navigation config by profile type
export const getBottomNavigationConfig = (profileType) =>
  profileType === "trainer"
    ? TRAINER_BOTTOM_NAVIGATION
    : CLIENT_BOTTOM_NAVIGATION;

// Helper function to update badge counts
export const updateNavigationBadges = (navigation, badges = {}) =>
  navigation.map((item) => ({
    ...item,
    badgeCount: badges[item.id] || 0,
  }));
