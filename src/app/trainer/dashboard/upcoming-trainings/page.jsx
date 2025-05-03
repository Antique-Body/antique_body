"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/custom/Card";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components/ScheduleSessionModal";
import { FormField } from "@/components/shared/FormField";

export default function TrainerUpcomingTrainingsPage() {
  const [expandedTrainingId, setExpandedTrainingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

  // Add custom animation style
  const animationStyle = `
    @keyframes gradient-x {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    .animate-gradient-x {
      animation: gradient-x 3s ease infinite;
      background-size: 200% 100%;
    }
  `;

  // Sample trainings data
  const trainings = [
    {
      id: 1,
      clientName: "John Doe",
      clientId: 1,
      date: "Apr 12, 2025",
      time: "10:00 - 11:00",
      type: "In-person",
      location: "City Fitness Center",
      status: "confirmed",
      paid: true,
      focus: "Lower body power & mobility",
      notes: "Bring resistance bands",
      trainingName: "Strength & Conditioning"
    },
    {
      id: 2,
      clientName: "Sarah Williams",
      clientId: 2,
      date: "Apr 15, 2025",
      time: "14:00 - 15:00",
      type: "In-person",
      location: "Urban Gym Downtown",
      status: "confirmed",
      paid: true,
      focus: "Knee rehabilitation exercises",
      notes: "Foam roller needed",
      trainingName: "Rehabilitation Program"
    },
    {
      id: 3,
      clientName: "Mike Chen",
      clientId: 3,
      date: "Apr 18, 2025",
      time: "18:30 - 19:30",
      type: "Virtual",
      location: "Zoom",
      status: "confirmed",
      paid: false,
      focus: "HIIT workout & nutrition review",
      notes: "Check food diary before session",
      trainingName: "HIIT Program"
    },
    {
      id: 4,
      clientName: "Emma Taylor",
      clientId: 4,
      date: "Apr 20, 2025",
      time: "09:00 - 10:00",
      type: "In-person",
      location: "City Fitness Center",
      status: "pending",
      paid: false,
      focus: "Initial assessment",
      notes: "First session - evaluation and goal setting",
      trainingName: "Assessment"
    },
  ];

  // Sample past trainings
  const pastTrainings = [
    {
      id: 5,
      clientName: "John Doe",
      clientId: 1,
      date: "Apr 5, 2025",
      time: "10:00 - 11:00",
      type: "In-person",
      location: "City Fitness Center",
      status: "completed",
      paid: true,
      focus: "Full body workout",
      notes: "Client completed all exercises with good form",
      feedback: "Good form on squats, needs to work on shoulder mobility",
      trainingName: "Strength & Conditioning"
    },
    {
      id: 6,
      clientName: "Sarah Williams",
      clientId: 2,
      date: "Apr 2, 2025",
      time: "14:00 - 15:00",
      type: "In-person",
      location: "Urban Gym Downtown",
      status: "completed",
      paid: true,
      focus: "Core stability & conditioning",
      notes: "Client showed improvement in balance exercises",
      feedback: "Excellent effort on planks, improved endurance since last session",
      trainingName: "Core Blast"
    },
  ];

  // Filter and search functionality
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch =
      training.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.trainingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? training.status === filterStatus : true;
    const matchesType = filterType ? training.type === filterType : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpandTraining = id => {
    if (expandedTrainingId === id) {
      setExpandedTrainingId(null);
    } else {
      setExpandedTrainingId(id);
    }
  };

  const openNewTrainingModal = () => {
    setSelectedTraining(null);
    setModalOpen(true);
  };

  const openManageTrainingModal = training => {
    setSelectedTraining(training);
    setModalOpen(true);
  };

  const openRescheduleModal = (e, training) => {
    e.stopPropagation();
    setSelectedTraining(training);
    setRescheduleModalOpen(true);
  };

  const closeRescheduleModal = () => {
    setRescheduleModalOpen(false);
  };

  const handleReschedule = (sessionData) => {
    // Here you would update the training in your database
    console.log("Rescheduled session:", sessionData);
    // For demo purposes, we'll just close the modal
    setRescheduleModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTraining(null);
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pending", label: "Pending" },
    { value: "canceled", label: "Canceled" },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "In-person", label: "In-person" },
    { value: "Virtual", label: "Virtual" },
  ];

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: animationStyle }} />
      
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <h2 className="mb-4 text-xl font-bold md:mb-0">Upcoming Trainings</h2>

        <Button variant="orangeFilled" onClick={openNewTrainingModal} leftIcon={<span className="text-xl">+</span>}>
          New Training
        </Button>
      </div>

      {/* Search and filter controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="flex-1">
          <FormField
            type="text"
            placeholder="Search trainings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-0"
          />
        </div>
        <FormField
          type="select"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          options={statusOptions}
          className="mb-0 min-w-[150px]"
        />
        <FormField
          type="select"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          options={typeOptions}
          className="mb-0 min-w-[150px]"
        />
      </div>

      {/* Upcoming Trainings */}
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Upcoming Trainings</h2>

        <div className="space-y-4">
          {filteredTrainings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-400">No trainings match your filters</p>
            </div>
          ) : (
            filteredTrainings.map((training, index) => (
              <Card
                key={training.id}
                variant="dark"
                className={`cursor-pointer transition-all duration-300 hover:border-[#FF6B00] ${
                  index === 0 ? 'relative overflow-hidden' : ''
                }`}
                width="100%"
                maxWidth="none"
                onClick={() => toggleExpandTraining(training.id)}
              >
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.08)] to-transparent animate-gradient-x pointer-events-none"></div>
                )}
                
                {index === 0 && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#FF6B00]"></div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${index === 0 ? 'text-[#FF6B00]' : ''}`}>
                        {training.date}
                      </h3>
                      <p className="text-gray-400">{training.time}</p>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          training.status === "confirmed"
                            ? "bg-green-900/60 text-green-200"
                            : training.status === "pending"
                              ? "bg-yellow-900/60 text-yellow-200"
                              : "bg-red-900/60 text-red-200"
                        }`}
                      >
                        {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                      </span>
                      {index === 0 && (
                        <span className="text-xs font-medium text-[#FF6B00] border border-[#FF6B00] rounded px-1.5 py-0.5">Next</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-300">
                      <span>{training.clientName}</span>
                      <span className="mx-2">•</span>
                      <span>{training.type === "In-person" ? training.location : "Virtual Session"}</span>
                      {training.paid ? (
                        <span className="ml-2 text-xs text-green-400">Paid</span>
                      ) : (
                        <span className="ml-2 text-xs text-yellow-400">Not Paid</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                      {training.type}
                    </span>
                    <p className="mt-1 text-right text-sm font-medium text-gray-300">{training.trainingName}</p>
                  </div>
                </div>

                <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                  <div className="mt-2 border-t border-[#444] pt-3">
                    <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                    <p className="mb-3 text-gray-300">{training.focus}</p>

                    <p className="mb-1 font-medium text-[#FF6B00]">Location:</p>
                    <p className="mb-3 text-gray-300">{training.location}</p>

                    <p className="mb-1 font-medium text-[#FF6B00]">Notes:</p>
                    <p className="mb-3 text-gray-300">{training.notes}</p>

                    <div className="mt-4 flex space-x-3">
                      <Button 
                        variant="orangeFilled" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          openManageTrainingModal(training);
                        }}
                      >
                        Manage Training
                      </Button>
                      <Button 
                        variant="orangeOutline" 
                        className="flex-1"
                        onClick={(e) => openRescheduleModal(e, training)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Past Trainings */}
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Past Trainings</h2>

        <div className="space-y-4">
          {pastTrainings.map(training => (
            <Card
              key={training.id}
              variant="dark"
              className="cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
              width="100%"
              maxWidth="none"
              onClick={() => toggleExpandTraining(training.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{training.date}</h3>
                    <p className="text-gray-400">{training.time}</p>
                    <span className="rounded bg-blue-900/60 px-2 py-0.5 text-xs text-blue-200">
                      Completed
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-300">
                    <span>{training.clientName}</span>
                    <span className="mx-2">•</span>
                    <span>{training.type === "In-person" ? training.location : "Virtual Session"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">
                    {training.type}
                  </span>
                  <p className="mt-1 text-right text-sm font-medium text-gray-300">{training.trainingName}</p>
                </div>
              </div>

              <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                <div className="mt-2 border-t border-[#444] pt-3">
                  <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                  <p className="mb-3 text-gray-300">{training.focus}</p>

                  <p className="mb-1 font-medium text-[#FF6B00]">Your Feedback:</p>
                  <p className="mb-3 text-gray-300">{training.feedback}</p>

                  <p className="mb-1 font-medium text-[#FF6B00]">Notes:</p>
                  <p className="mb-3 text-gray-300">{training.notes}</p>

                  <div className="mt-4 flex space-x-3">
                    <Button variant="orangeFilled" className="flex-1">
                      Edit Feedback
                    </Button>
                    <Button 
                      variant="orangeOutline" 
                      className="flex-1"
                      onClick={(e) => openRescheduleModal(e, {
                        clientId: training.clientId,
                        clientName: training.clientName
                      })}
                    >
                      Schedule Follow-up
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="orangeOutline" fullWidth className="mt-4">
          View Training History
        </Button>
      </Card>

      {/* Modal would be implemented here */}
      {/* {modalOpen && <ScheduleTrainingModal isOpen={modalOpen} onClose={closeModal} training={selectedTraining} />} */}
      
      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedTraining && (
        <ScheduleSessionModal
          isOpen={rescheduleModalOpen}
          onClose={closeRescheduleModal}
          onSchedule={handleReschedule}
          client={{
            id: selectedTraining.clientId,
            name: selectedTraining.clientName
          }}
        />
      )}
    </div>
  );
}