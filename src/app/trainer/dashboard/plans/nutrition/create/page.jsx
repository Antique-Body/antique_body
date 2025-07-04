import { NutritionPlanCreator } from "@/components/custom/dashboard/trainer/pages/plans/nutrition/create/NutritionPlanCreator";

export const metadata = {
  title: "Create Nutrition Plan | Trainer Dashboard | Antique Body Novo",
  description:
    "Easily create and customize nutrition plans for your clients. Streamline your workflow and enhance client results with the nutrition plan creator in the trainer dashboard.",
  breadcrumbs: [
    { label: "Dashboard", href: "/trainer/dashboard" },
    { label: "Plans", href: "/trainer/dashboard/plans" },
    { label: "Nutrition", href: "/trainer/dashboard/plans/nutrition" },
    { label: "Create", href: "/trainer/dashboard/plans/nutrition/create" },
  ],
};

export default function CreateNutritionPlanPage() {
  return <NutritionPlanCreator />;
}
