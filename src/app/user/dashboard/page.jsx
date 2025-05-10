"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the default tab
    router.push("/user/dashboard/overview");
  }, [router]);

  return null;
}
