"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/trainer/dashboard/newclients");
  }, [router]);

  return null;
}
