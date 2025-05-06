"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Background from "@/components/background";
import { BrandLogo } from "@components/custom";
import { useSession } from "next-auth/react";
import { useState } from "react";
import NutritionDashboard from "./components/NutritionDashboard";
import ProgressDashboard from "./components/ProgressDashboard";
import SettingsDashboard from "./components/SettingsDashboard";
import WorkoutDashboard from "./components/WorkoutDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("workout");

  useEffect(() => {
    // Redirect to the default tab
    router.push("/user/dashboard/overview");
  }, [router]);

  return null;
}
