"use client";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";
import { ManageTrainingModal } from "@/components/custom/trainer/dashboard/components/ManageTrainingModal";
import { ScheduleSessionModal } from "@/components/custom/trainer/dashboard/components/ScheduleSessionModal";

export default function TrainerUpcomingTrainingsPage() {
    const [expandedTrainingId, setExpandedTrainingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [manageTrainingModalOpen, setManageTrainingModalOpen] = useState(false);
    const [isViewingPastTraining, setIsViewingPastTraining] = useState(false);
    const [trainings, setTrainings] = useState([
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
            trainingName: "Strength & Conditioning",
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
            trainingName: "Rehabilitation Program",
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
            trainingName: "HIIT Program",
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
            trainingName: "Assessment",
        },
    ]);
    const [pastTrainings, setPastTrainings] = useState([
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
            trainingName: "Strength & Conditioning",
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
            trainingName: "Core Blast",
        },
    ]);

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

    // Filter and search functionality
    const filteredTrainings = trainings.filter((training) => {
        const matchesSearch =
            training.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            training.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
            training.trainingName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType ? training.type === filterType : true;
        return matchesSearch && matchesType;
    });

    const toggleExpandTraining = (id) => {
        if (expandedTrainingId === id) {
            setExpandedTrainingId(null);
        } else {
            setExpandedTrainingId(id);
        }
    };

    const openNewTrainingModal = () => {
        setSelectedTraining(null);
    };

    const openManageTrainingModal = (training) => {
        setSelectedTraining(training);
        setIsViewingPastTraining(false);
        setManageTrainingModalOpen(true);
    };

    const openViewPastTrainingModal = (training) => {
        setSelectedTraining(training);
        setIsViewingPastTraining(true);
        setManageTrainingModalOpen(true);
    };

    const closeManageTrainingModal = () => {
        setManageTrainingModalOpen(false);
        setIsViewingPastTraining(false);
    };

    const handleManageTraining = (updatedTraining) => {
        if (updatedTraining.status === "completed") {
            // Remove from upcoming trainings
            setTrainings((prevTrainings) => prevTrainings.filter((training) => training.id !== updatedTraining.id));

            // Add to past trainings
            const pastTraining = {
                ...updatedTraining,
                feedback: "Training completed successfully",
            };
            setPastTrainings((prevPastTrainings) => [pastTraining, ...prevPastTrainings]);
        } else {
            // Update in upcoming trainings
            setTrainings((prevTrainings) =>
                prevTrainings.map((training) => (training.id === updatedTraining.id ? updatedTraining : training))
            );
        }

        setManageTrainingModalOpen(false);
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
        // eslint-disable-next-line no-console
        console.log("Rescheduled session:", sessionData);
        // For demo purposes, we'll just close the modal
        setRescheduleModalOpen(false);
    };

    const typeOptions = [
        { value: "", label: "All Types" },
        { value: "In-person", label: "In-person" },
        { value: "Virtual", label: "Virtual" },
    ];

    return (
        <div className="space-y-6 px-4 md:px-6">
            <style dangerouslySetInnerHTML={{ __html: animationStyle }} />

            <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <h2 className="text-xl font-bold">Upcoming Trainings</h2>

                <Button variant="orangeFilled" onClick={openNewTrainingModal} leftIcon={<span className="text-xl">+</span>}>
                    New Training
                </Button>
            </div>

            {/* Search and filter controls */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:flex-row">
                <div className="flex-1">
                    <FormField
                        type="text"
                        placeholder="Search trainings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-0 w-full"
                    />
                </div>

                <FormField
                    type="select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={typeOptions}
                    className="mb-0 w-full md:max-w-[200px]"
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
                                    index === 0 ? "relative overflow-hidden" : ""
                                }`}
                                width="100%"
                                maxWidth="none"
                                onClick={() => toggleExpandTraining(training.id)}
                            >
                                {index === 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,107,0,0.08)] to-transparent animate-gradient-x pointer-events-none"></div>
                                )}

                                {index === 0 && <div className="absolute left-0 top-0 h-full w-1 bg-[#FF6B00]"></div>}

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className={`text-lg font-bold ${index === 0 ? "text-[#FF6B00]" : ""}`}>
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
                                                <span className="text-xs font-medium text-[#FF6B00] border border-[#FF6B00] rounded px-1.5 py-0.5">
                                                    Next
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-300">
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
                                    <div className="mt-2 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
                                        <span className="rounded border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                            {training.type}
                                        </span>
                                        <p className="text-sm font-medium text-gray-300 sm:mt-1 sm:text-right">
                                            {training.trainingName}
                                        </p>
                                    </div>
                                </div>

                                <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                                    <div className="mt-2 border-t border-[#444] pt-3">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                            <div>
                                                <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                                                <p className="mb-3 text-gray-300">{training.focus}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 font-medium text-[#FF6B00]">Location:</p>
                                                <p className="mb-3 text-gray-300">{training.location}</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 font-medium text-[#FF6B00]">Notes:</p>
                                                <p className="mb-3 text-gray-300">{training.notes}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                            <Button
                                                variant="orangeFilled"
                                                className="w-full sm:flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openManageTrainingModal(training);
                                                }}
                                            >
                                                Manage Training
                                            </Button>
                                            <Button
                                                variant="orangeOutline"
                                                className="w-full sm:flex-1"
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
                    {pastTrainings.map((training) => (
                        <Card
                            key={training.id}
                            variant="dark"
                            className="cursor-pointer transition-all duration-300 hover:border-[#FF6B00]"
                            width="100%"
                            maxWidth="none"
                            onClick={() => toggleExpandTraining(training.id)}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold">{training.date}</h3>
                                        <p className="text-gray-400">{training.time}</p>
                                        <span className="rounded bg-blue-900/60 px-2 py-0.5 text-xs text-blue-200">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center text-sm text-gray-300">
                                        <span>{training.clientName}</span>
                                        <span className="mx-2">•</span>
                                        <span>{training.type === "In-person" ? training.location : "Virtual Session"}</span>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
                                    <span className="rounded bg-[rgba(40,40,40,0.8)] px-2 py-1 text-xs font-medium text-gray-300">
                                        {training.type}
                                    </span>
                                    <p className="text-sm font-medium text-gray-300 sm:mt-1 sm:text-right">
                                        {training.trainingName}
                                    </p>
                                </div>
                            </div>

                            <div className={`mt-3 ${expandedTrainingId === training.id ? "block" : "hidden"}`}>
                                <div className="mt-2 border-t border-[#444] pt-3">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        <div>
                                            <p className="mb-1 font-medium text-[#FF6B00]">Focus:</p>
                                            <p className="mb-3 text-gray-300">{training.focus}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 font-medium text-[#FF6B00]">Your Feedback:</p>
                                            <p className="mb-3 text-gray-300">{training.feedback}</p>
                                        </div>
                                        <div>
                                            <p className="mb-1 font-medium text-[#FF6B00]">Notes:</p>
                                            <p className="mb-3 text-gray-300">{training.notes}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                        <Button
                                            variant="orangeFilled"
                                            className="w-full sm:flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openViewPastTrainingModal(training);
                                            }}
                                        >
                                            View Exercises
                                        </Button>
                                        <Button
                                            variant="orangeOutline"
                                            className="w-full sm:flex-1"
                                            onClick={(e) =>
                                                openRescheduleModal(e, {
                                                    clientId: training.clientId,
                                                    clientName: training.clientName,
                                                })
                                            }
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
                        name: selectedTraining.clientName,
                    }}
                />
            )}

            {/* Manage Training Modal */}
            {manageTrainingModalOpen && selectedTraining && (
                <ManageTrainingModal
                    isOpen={manageTrainingModalOpen}
                    onClose={closeManageTrainingModal}
                    onSave={handleManageTraining}
                    training={selectedTraining}
                    isPastTraining={isViewingPastTraining}
                />
            )}
        </div>
    );
}
