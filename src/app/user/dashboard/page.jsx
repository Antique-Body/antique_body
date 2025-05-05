"use client";
import { BrandLogo, Card } from "@components/custom";
import { useTranslation } from "react-i18next";

import Background from "@/components/background";

export default function UserDashboard() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
            <Background />

            <div className="max-w-[550px] mx-auto px-5 py-5 relative z-20 h-screen flex flex-col items-center">
                <header className="pt-10 w-full text-center justify-center">
                    <BrandLogo />
                </header>

                <div className="flex-1 flex items-center justify-center">
                    <Card width="100%">
                        <div className="text-2xl sm:text-3xl font-bold mb-4 text-center">{t("welcome_to_dashboard")}</div>
                        <div className="text-[#aaa] text-base text-center">{t("personalized_fitness_journey")}</div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
