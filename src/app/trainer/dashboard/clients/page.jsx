"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField } from "@/components/shared/FormField";

const ClientsPage = () => {
  // Sample data (in a real app, this would come from an API or context)
  const trainerData = {
    clients: [
      {
        id: 1,
        name: "John Doe",
        location: "Sarajevo",
        status: "active",
        plan: "Pro Athlete",
        goal: "Strength & Conditioning",
        joinDate: "Jan 15, 2025",
        nextSession: "Apr 12, 2025",
      },
      {
        id: 2,
        name: "Sarah Williams",
        location: "London",
        status: "active",
        plan: "Recovery",
        goal: "Rehabilitation",
        joinDate: "Feb 3, 2025",
        nextSession: "Apr 10, 2025",
      },
      {
        id: 3,
        name: "Mike Chen",
        location: "New York",
        status: "paused",
        plan: "Fat Loss",
        goal: "Weight Management",
        joinDate: "Dec 20, 2024",
        nextSession: "Apr 9, 2025",
      },
    ],
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGoalType, setFilterGoalType] = useState("");

  const router = useRouter();

  // Filter and search functionality
  const filteredClients = trainerData.clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? client.status === filterStatus : true;
    const matchesGoal = filterGoalType ? client.goal.includes(filterGoalType) : true;
    return matchesSearch && matchesStatus && matchesGoal;
  });

  // Handle viewing client details
  const handleViewClient = client => {
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
    { value: "Weight Management", label: "Weight Management" },
    { value: "Rehabilitation", label: "Rehabilitation" },
    { value: "Conditioning", label: "Conditioning" },
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Clients</h2>

      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <FormField
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search clients..."
            className="mb-0"
          />
        </div>
        <FormField
          type="select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          options={statusOptions}
          placeholder="All Statuses"
          className="mb-0 min-w-[150px]"
        />
        <FormField
          type="select"
          value={filterGoalType}
          onChange={e => setFilterGoalType(e.target.value)}
          options={goalOptions}
          placeholder="All Goals"
          className="mb-0 min-w-[180px]"
        />
      </div>

      {/* Client list */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400">No clients match your filters</p>
          </div>
        ) : (
          filteredClients.map(client => (
            <div
              key={client.id}
              onClick={() => handleViewClient(client)}
              className="group cursor-pointer rounded-xl border border-[#333] bg-[rgba(30,30,30,0.85)] p-5 transition-all duration-300 hover:border-[#FF6B00] hover:shadow-lg"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF9A00] text-lg font-bold text-white">
                    {client.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-[#FF6B00]">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-400">{client.location}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span
                        className={`rounded-md px-2 py-1 text-xs ${client.status === "active" ? "bg-green-900 text-green-200" : client.status === "paused" ? "bg-yellow-900 text-yellow-200" : "bg-red-900 text-red-200"}`}
                      >
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                      <span className="rounded-md bg-[rgba(50,50,50,0.7)] px-2 py-1 text-xs">{client.plan}</span>
                    </div>
                  </div>
                </div>
                <div className="flex min-w-[180px] flex-col gap-1 text-sm">
                  <div>
                    <span className="text-gray-400">Goal:</span> {client.goal}
                  </div>
                  <div>
                    <span className="text-gray-400">Next Session:</span> {client.nextSession}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
