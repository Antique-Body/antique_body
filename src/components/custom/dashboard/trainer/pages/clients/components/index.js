// Existing components
export { ClientsGrid } from "./ClientsGrid";
export { ClientCard } from "./ClientCard";

// New abstracted components
export { ClientHeader } from "./ClientHeader";
export { ClientTabs } from "./ClientTabs";
export {
  ClientLoadingState,
  ClientsLoadingState,
  PlanLoadingState,
} from "./LoadingStates";
export {
  ClientErrorState,
  ClientsErrorState,
  ClientNotFoundState,
  PlanErrorState,
  PlanNotFoundState,
} from "./ErrorStates";
export { ClientOverviewTab } from "./ClientOverviewTab";
export { ClientProgressTab } from "./ClientProgressTab";
export { ClientWorkoutsTab } from "./ClientWorkoutsTab";
export { ClientNutritionTab } from "./ClientNutritionTab";
export { ClientMessagesTab } from "./ClientMessagesTab";
export { NutritionPlanModal } from "./NutritionPlanModal";
