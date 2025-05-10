"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { MessageClientModal } from "./MessageClientModal";

import { Button } from "@/components/common/Button";
import { CalendarIcon, MessageIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components";

export const ClientHeader = ({ client }) => {
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Format client type and sport for display
    const getClientTypeLabel = () => {
        let label = client.type.charAt(0).toUpperCase() + client.type.slice(1);
        if (client.sport) {
            label += ` (${client.sport.charAt(0).toUpperCase() + client.sport.slice(1)})`;
        }
        return label;
    };

    // Get client type icon
    const getClientTypeIcon = () => {
        const type = client.type?.toLowerCase() || "";

        if (type === "basketball") return "mdi:basketball";
        if (type === "football") return "mdi:soccer";
        if (type === "tennis") return "mdi:tennis";
        if (type === "gym") return "mdi:weight-lifter";
        if (type === "athlete") return "mdi:run-fast";

        return "mdi:account-group";
    };

    return (
        <>
            <Card
                variant="clientCard"
                width="100%"
                maxWidth="none"
                className="relative mb-6 overflow-hidden"
                shadow="0 10px 25px rgba(0,0,0,0.25)"
                borderColor="#2a2a2a"
                padding="0"
            >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,20,20,0.9)] to-[rgba(20,20,20,0.7)] z-10"></div>

                {/* Optional decorative pattern - can be toggled */}
                <div className="absolute inset-0 bg-[url('/patterns/pattern-dark.png')] opacity-10 z-0"></div>

                {/* Client header content */}
                <div className="relative z-20 p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        {/* Client info section */}
                        <div className="flex items-start gap-5">
                            {/* Client avatar/image with fancy border */}
                            <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border-2 border-[#FF6B00] shadow-lg">
                                {client.profileImage ? (
                                    <Image
                                        src={client.profileImage}
                                        alt={client.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-2xl font-bold text-white">
                                        {client.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                )}

                                {/* Status indicator - small glowing dot */}
                                <div
                                    className={`absolute bottom-1 right-1 h-3 w-3 rounded-full border border-[#222] ${
                                        client.status.toLowerCase() === "active"
                                            ? "bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                                            : client.status.toLowerCase() === "paused"
                                              ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                              : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    }`}
                                ></div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold">{client.name}</h1>

                                    {/* Verification badge for premium clients if needed */}
                                    {client.plan !== "No Plan Assigned" && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00]/20">
                                            <Icon icon="mdi:check-circle" className="text-[#FF6B00]" width={16} height={16} />
                                        </span>
                                    )}
                                </div>

                                {/* Extra client info row - type, goal, joined date */}
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <Icon icon={getClientTypeIcon()} className="text-[#FF6B00]" width={16} height={16} />
                                        <span>{getClientTypeLabel()}</span>
                                    </div>

                                    <span className="text-gray-500">•</span>

                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:target" className="text-purple-400" width={16} height={16} />
                                        <span>{client.goal}</span>
                                    </div>

                                    <span className="text-gray-500">•</span>

                                    <div className="flex items-center gap-1">
                                        <Icon icon="mdi:clock-outline" className="text-gray-400" width={16} height={16} />
                                        <span>Since {client.joinDate}</span>
                                    </div>
                                </div>

                                {/* Status badges */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            client.status.toLowerCase() === "active"
                                                ? "bg-green-900/40 text-green-400"
                                                : client.status.toLowerCase() === "paused"
                                                  ? "bg-amber-900/40 text-amber-400"
                                                  : "bg-blue-900/40 text-blue-400"
                                        }`}
                                    >
                                        {client.status}
                                    </span>

                                    <span className="rounded-full bg-[rgba(255,107,0,0.15)] px-3 py-1 text-xs font-medium text-[#FF6B00] border border-[#FF6B00]/20">
                                        {client.plan}
                                    </span>

                                    {client.nutritionPlan && (
                                        <span className="rounded-full bg-blue-900/20 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                                            <Icon icon="mdi:food-apple" className="mr-1 inline-block" width={12} height={12} />
                                            Nutrition Plan
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="flex flex-wrap gap-3 self-end md:self-start">
                            <Button
                                variant="secondary"
                                onClick={() => setShowMessageModal(true)}
                                leftIcon={<MessageIcon size={16} />}
                                className="hover:bg-[#333] hover:text-white transition-colors"
                            >
                                Message
                            </Button>

                            <Button
                                variant="orangeFilled"
                                onClick={() => setShowScheduleModal(true)}
                                leftIcon={<CalendarIcon size={16} />}
                                className="shadow-lg hover:shadow-[#FF6B00]/20 transition-all"
                            >
                                Schedule Session
                            </Button>
                        </div>
                    </div>

                    {/* Client progress indicators */}
                    <div className="mt-6 flex items-center gap-1">
                        <div className="mr-2 text-sm font-medium text-gray-300">Overall Progress</div>
                        <div className="h-2.5 flex-1 rounded-full bg-[#333] overflow-hidden">
                            <div
                                className={`h-full rounded-full ${
                                    client.training?.overallProgress < 40
                                        ? "bg-gradient-to-r from-red-600 to-red-400"
                                        : client.training?.overallProgress < 70
                                          ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                                          : "bg-gradient-to-r from-green-600 to-green-400"
                                }`}
                                style={{ width: `${client.training?.overallProgress || 0}%` }}
                            ></div>
                        </div>
                        <div className="ml-2 min-w-[40px] text-center text-sm font-medium">
                            {client.training?.overallProgress || 0}%
                        </div>
                    </div>

                    {/* Client summary stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                        <Card
                            variant="dark"
                            width="100%"
                            maxWidth="none"
                            borderColor="#333"
                            bgGradientFrom="rgba(25,25,25,0.4)"
                            bgGradientTo="rgba(25,25,25,0.4)"
                            className="backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10">
                                    <Icon icon="mdi:target" className="text-purple-500" width={16} height={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Goal</div>
                                    <div className="text-sm font-medium">{client.goal}</div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            variant="dark"
                            width="100%"
                            maxWidth="none"
                            borderColor="#333"
                            bgGradientFrom="rgba(25,25,25,0.4)"
                            bgGradientTo="rgba(25,25,25,0.4)"
                            className="backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF6B00]/10">
                                    <Icon icon="mdi:calendar-month" className="text-[#FF6B00]" width={16} height={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Client Since</div>
                                    <div className="text-sm font-medium">{client.joinDate}</div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            variant="dark"
                            width="100%"
                            maxWidth="none"
                            borderColor="#333"
                            bgGradientFrom="rgba(25,25,25,0.4)"
                            bgGradientTo="rgba(25,25,25,0.4)"
                            className="backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10">
                                    <Icon icon="mdi:calendar-clock" className="text-green-500" width={16} height={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Next Session</div>
                                    <div className="text-sm font-medium">{client.nextSession}</div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            variant="dark"
                            width="100%"
                            maxWidth="none"
                            borderColor="#333"
                            bgGradientFrom="rgba(25,25,25,0.4)"
                            bgGradientTo="rgba(25,25,25,0.4)"
                            className="backdrop-blur-sm"
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10">
                                    <Icon icon="mdi:calendar-check" className="text-blue-500" width={16} height={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Total Sessions</div>
                                    <div className="text-sm font-medium">{client.progress?.length || 0}</div>
                                </div>
                            </div>
                        </Card>

                        {client.training?.totalWorkoutsCompleted && (
                            <Card
                                variant="dark"
                                width="100%"
                                maxWidth="none"
                                borderColor="#333"
                                bgGradientFrom="rgba(25,25,25,0.4)"
                                bgGradientTo="rgba(25,25,25,0.4)"
                                className="backdrop-blur-sm sm:col-span-3 md:col-span-1"
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/10">
                                        <Icon icon="mdi:weight-lifter" className="text-amber-500" width={16} height={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">Completed Workouts</div>
                                        <div className="text-sm font-medium">
                                            {client.training?.totalWorkoutsCompleted || 0}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </Card>

            {/* Message modal */}
            {showMessageModal && (
                <MessageClientModal
                    client={client}
                    onClose={() => setShowMessageModal(false)}
                    isOpen={showMessageModal}
                    onSend={() => {}}
                />
            )}

            {/* Schedule session modal */}
            {showScheduleModal && (
                <ScheduleSessionModal
                    client={client}
                    onClose={() => setShowScheduleModal(false)}
                    isOpen={showScheduleModal}
                    onSchedule={() => {}}
                />
            )}
        </>
    );
};
