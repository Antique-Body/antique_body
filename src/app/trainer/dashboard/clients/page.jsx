"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";
import mockClients from "@/components/custom/trainer/dashboard/pages/clients/data/mockClients";

const ClientsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterGoalType, setFilterGoalType] = useState("");

    const router = useRouter();

    // Filter and search functionality
    const filteredClients = mockClients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? client.status.toLowerCase() === filterStatus.toLowerCase() : true;
        const matchesGoal = filterGoalType
            ? client.goal.toLowerCase().includes(filterGoalType.toLowerCase()) || client.type === filterGoalType.toLowerCase()
            : true;
        return matchesSearch && matchesStatus && matchesGoal;
    });

    // Handle viewing client details
    const handleViewClient = (client) => {
        router.push(`/trainer/dashboard/clients/${client.id}`);
    };

    const statusOptions = [
        { value: "", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "completed", label: "Completed" },
    ];

    const goalOptions = [
        { value: "", label: "All Goals" },
        { value: "Strength", label: "Strength" },
        { value: "Build Muscle", label: "Build Muscle" },
        { value: "Weight Management", label: "Weight Management" },
        { value: "Fat Loss", label: "Fat Loss" },
        { value: "basketball", label: "Basketball" },
        { value: "tennis", label: "Tennis" },
        { value: "football", label: "Football" },
        { value: "gym", label: "Gym Training" },
        { value: "athlete", label: "Athlete" },
    ];

    // Helper function to get progress color
    const getProgressColor = (progress) => {
        if (progress < 40) return "from-red-600 to-red-400";
        if (progress < 70) return "from-yellow-600 to-yellow-400";
        return "from-green-600 to-green-400";
    };

    // Helper function to get client progress percentage
    const getClientProgress = (client) => {
        if (client.training && client.training.overallProgress) {
            return client.training.overallProgress;
        }
        return 0;
    };

    // Helper to get client nutrition plan info
    const getClientNutrition = (client) => {
        if (client.nutritionPlan && client.nutritionPlan.title) {
            return client.nutritionPlan.title;
        }
        return "No Nutrition Plan";
    };

    // Helper to get client sport or type icon
    const getClientTypeIcon = (client) => {
        const type = client.type?.toLowerCase() || "";

        if (type === "basketball") return "mdi:basketball";
        if (type === "football") return "mdi:soccer";
        if (type === "tennis") return "mdi:tennis";
        if (type === "gym") return "mdi:weight-lifter";
        if (type === "athlete") return "mdi:run-fast";

        return "mdi:account-group";
    };

    return (
        <div className="px-4 py-6">
            {/* Header section with stats */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="text-2xl font-bold sm:text-3xl">My Clients</h1>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-green-500/20 p-2">
                                <Icon icon="mdi:account-multiple" className="text-green-500" width={24} height={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Active</p>
                                <p className="font-semibold">
                                    {mockClients.filter((c) => c.status.toLowerCase() === "active").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-[#FF6B00]/20 p-2">
                                <Icon icon="mdi:dumbbell" className="text-[#FF6B00]" width={24} height={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Training</p>
                                <p className="font-semibold">
                                    {mockClients.filter((c) => c.plan !== "No Plan Assigned").length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-500/20 p-2">
                                <Icon icon="mdi:food-apple" className="text-blue-500" width={24} height={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Nutrition</p>
                                <p className="font-semibold">{mockClients.filter((c) => c.nutritionPlan).length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[rgba(0,0,0,0.2)] p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-purple-500/20 p-2">
                                <Icon icon="mdi:calendar-check" className="text-purple-500" width={24} height={24} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Sessions</p>
                                <p className="font-semibold">{mockClients.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced search and filter controls */}
            <div className="mb-8 rounded-xl border border-[#333]/50 bg-[rgba(30,30,30,0.3)] p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-[#FF6B00]/20 p-2">
                        <Icon icon="material-symbols:search" className="text-[#FF6B00]" width={20} height={20} />
                    </div>
                    <h3 className="text-lg font-medium">Find Clients</h3>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <FormField
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search clients..."
                            className="mb-0"
                        />
                    </div>
                    <FormField
                        type="select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        options={statusOptions}
                        placeholder="All Statuses"
                        className="mb-0 min-w-[150px]"
                    />
                    <FormField
                        type="select"
                        value={filterGoalType}
                        onChange={(e) => setFilterGoalType(e.target.value)}
                        options={goalOptions}
                        placeholder="All Goals"
                        className="mb-0 min-w-[180px]"
                    />
                </div>
            </div>

            {/* Client grid - 3 per row on desktop */}
            {filteredClients.length === 0 ? (
                <div className="rounded-xl border border-[#333] bg-[rgba(20,20,20,0.5)] py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <Icon icon="mdi:account-off" className="text-gray-500" width={48} height={48} />
                        <p className="text-gray-400">No clients match your search criteria</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Card
                            key={client.id}
                            variant="clientCard"
                            hover={true}
                            hoverScale="1.02"
                            className="group relative overflow-hidden cursor-pointer border border-[#222]/80"
                            onClick={() => handleViewClient(client)}
                        >
                            <div className="flex h-full flex-col">
                                {/* Stylish status indicator that doesn't use a colored top border */}
                                <div className="absolute top-3 right-3 z-10">
                                    <div
                                        className={`flex items-center gap-1.5 rounded-full py-1 px-2 ${
                                            client.status.toLowerCase() === "active"
                                                ? "bg-green-900/40 text-green-400 group-hover:bg-green-900/60"
                                                : client.status.toLowerCase() === "paused"
                                                  ? "bg-amber-900/40 text-amber-400 group-hover:bg-amber-900/60"
                                                  : "bg-blue-900/40 text-blue-400 group-hover:bg-blue-900/60"
                                        } transition-all duration-300`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                client.status.toLowerCase() === "active"
                                                    ? "bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]"
                                                    : client.status.toLowerCase() === "paused"
                                                      ? "bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                                                      : "bg-blue-400 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                                            }`}
                                        ></span>
                                        <span className="text-xs font-medium">{client.status}</span>
                                    </div>
                                </div>

                                {/* Subtle background gradient for visual interest */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,20,20,0.5)] to-[rgba(30,30,30,0.3)] opacity-50"></div>

                                {/* Client header with flex layout */}
                                <div className="relative flex items-start gap-3 p-4 pb-3">
                                    {/* Client image with animation */}
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl transform transition-transform duration-300 group-hover:scale-105">
                                        {client.profileImage ? (
                                            <Image
                                                src={client.profileImage}
                                                alt={client.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-xl font-bold text-white">
                                                {client.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                        )}

                                        {/* Decorative corner accent */}
                                        <div className="absolute -right-1 -top-1 h-5 w-5 overflow-hidden">
                                            <div
                                                className={`absolute h-7 w-7 rotate-45 transform origin-bottom-left ${
                                                    client.status.toLowerCase() === "active"
                                                        ? "bg-green-500/30"
                                                        : client.status.toLowerCase() === "paused"
                                                          ? "bg-amber-500/30"
                                                          : "bg-blue-500/30"
                                                }`}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Client info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold group-hover:text-[#FF6B00] transition-colors duration-300">
                                            {client.name}
                                        </h3>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Icon
                                                    icon={getClientTypeIcon(client)}
                                                    className="text-[#FF6B00]"
                                                    width={14}
                                                    height={14}
                                                />
                                                <span>
                                                    {client.type
                                                        ? client.type.charAt(0).toUpperCase() + client.type.slice(1)
                                                        : "General"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Icon icon="mdi:clock-outline" width={14} height={14} />
                                                <span>Since {client.joinDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar - with animation */}
                                <div className="relative px-4 pb-3 pt-1">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Progress</span>
                                        <span className="text-xs font-medium">{getClientProgress(client)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2a2a2a] transition-all duration-500">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(getClientProgress(client))} transition-all duration-700 ease-out group-hover:brightness-110`}
                                            style={{ width: `${getClientProgress(client)}%`, transitionDelay: "100ms" }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Subtle visual separator */}
                                <div className="relative mx-4 h-px bg-gradient-to-r from-transparent via-[#333]/80 to-transparent opacity-70"></div>

                                {/* Client details in a clean layout with hover effects */}
                                <div className="relative grid grid-cols-1 gap-3 rounded-lg p-4 transition-all duration-300">
                                    <div className="flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-1">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF6B00]/10 transition-all duration-300 group-hover:bg-[#FF6B00]/20">
                                            <Icon icon="mdi:weight-lifter" className="text-[#FF6B00]" width={16} height={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="text-xs text-gray-400">Training Plan</h4>
                                            <p className="text-sm font-medium">{client.plan}</p>
                                        </div>
                                    </div>

                                    <div
                                        className="flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-1"
                                        style={{ transitionDelay: "50ms" }}
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/10 transition-all duration-300 group-hover:bg-blue-500/20">
                                            <Icon icon="mdi:food-apple" className="text-blue-500" width={16} height={16} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="text-xs text-gray-400">Nutrition</h4>
                                            <p className="text-sm font-medium">{getClientNutrition(client)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div
                                            className="flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-1"
                                            style={{ transitionDelay: "100ms" }}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/10 transition-all duration-300 group-hover:bg-purple-500/20">
                                                <Icon icon="mdi:target" className="text-purple-500" width={16} height={16} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="text-xs text-gray-400">Goal</h4>
                                                <p className="text-sm font-medium">{client.goal}</p>
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-1"
                                            style={{ transitionDelay: "150ms" }}
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10 transition-all duration-300 group-hover:bg-green-500/20">
                                                <Icon
                                                    icon="mdi:calendar-clock"
                                                    className="text-green-500"
                                                    width={16}
                                                    height={16}
                                                />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <h4 className="text-xs text-gray-400">Next Session</h4>
                                                <p className="text-sm font-medium">{client.nextSession}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* View button that appears on hover with improved animation */}
                                <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-orange-500/20">
                                        <Icon icon="mdi:eye" className="mr-2" width={16} height={16} />
                                        View Client Details
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
