"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/common/Button";
import { UserIcon } from "@/components/common/Icons";
import { PlanDetailTabs } from "@/components/custom/trainer/dashboard/pages/plans/components";
import mockPlans from "@/components/custom/trainer/dashboard/pages/plans/data/mockPlans";
const PlanDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [plan, setPlan] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        // In a real app, this would be an API call
        const foundPlan = mockPlans.find((p) => p.id === id);
        if (foundPlan) {
            setPlan(foundPlan);
        } else {
            router.push("/trainer/dashboard/plans");
        }
    }, [id, router]);

    if (!plan) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading plan details...</div>
            </div>
        );
    }

    return (
        <div className="w-full pb-12">
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-[#333] px-6 py-4">
                <div className="flex items-center">
                    <BackButton onClick={() => router.push("/trainer/dashboard/plans")} />

                    <div className="ml-8">
                        <h1 className="text-3xl font-bold text-white">{plan.title}</h1>
                        <div className="mt-2 flex items-center">
                            <span className="rounded bg-[#222] px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                                {plan.type}
                            </span>
                            <span className="ml-3 text-sm text-gray-400">{plan.forAthletes}</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="orangeFilled"
                    leftIcon={<UserIcon className="h-5 w-5" />}
                    className="mt-4 transform transition-all duration-300 hover:scale-105 sm:mt-0"
                >
                    Assign to Client
                </Button>
            </div>

            <div className="px-6">
                <PlanDetailTabs plan={plan} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </div>
    );
};

export default PlanDetailPage;
