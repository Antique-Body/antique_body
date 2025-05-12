"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EffectBackground } from "@/components/background";
import { Button } from "@/components/common/Button";
import {
    BodyCompositionCard,
    ClientHeader,
    NotesCard,
    NutritionGoalsCard,
    ProgressPhotoModal,
    ProgressPhotosCard,
    ProgressTrackingCard,
    TrainingPlanModal,
    TrainingProgramCard,
    TrainingProgressCard,
    UpcomingSessionsCard,
    WorkoutDetailModal,
    WorkoutScheduleModal,
} from "@/components/custom/trainer/dashboard/pages/clients/components";
import mockClients from "@/components/custom/trainer/dashboard/pages/clients/data/mockClients";
import mockPlans from "@/components/custom/trainer/dashboard/pages/plans/training/create/data/mockPlans";

// Dynamically generate performance fields based on client type
const getPerformanceFields = (clientType, sport) => {
    if (clientType === "gym") {
        return [
            { id: "benchPress", label: "Bench Press (kg)" },
            { id: "squat", label: "Squat (kg)" },
            { id: "deadlift", label: "Deadlift (kg)" },
            { id: "cardio", label: "Cardio (min)" },
            { id: "caloriesBurned", label: "Calories Burned" },
        ];
    } else if (clientType === "athlete" && sport === "football") {
        return [
            { id: "sprint", label: "Sprint (s)" },
            { id: "agility", label: "Agility (s)" },
            { id: "kickAccuracy", label: "Kick Accuracy (%)" },
            { id: "endurance", label: "Endurance (min)" },
        ];
    } else if (clientType === "athlete" && sport === "basketball") {
        return [
            { id: "verticalJump", label: "Vertical Jump (cm)" },
            { id: "shootingAccuracy", label: "Shooting (%)" },
            { id: "sprint", label: "Sprint (s)" },
        ];
    } else if (clientType === "basketball") {
        return [
            { id: "verticalJump", label: "Vertical Jump (cm)" },
            { id: "shootingAccuracy", label: "Shooting (%)" },
            { id: "sprint", label: "Sprint (s)" },
            { id: "agility", label: "Agility (s)" },
        ];
    } else if (clientType === "tennis") {
        return [
            { id: "serveSpeed", label: "Serve Speed (km/h)" },
            { id: "forehandAccuracy", label: "Forehand (%)" },
            { id: "backhandAccuracy", label: "Backhand (%)" },
            { id: "agility", label: "Agility (s)" },
        ];
    }

    // Default fields
    return [
        { id: "performance", label: "Performance (1-10)" },
        { id: "endurance", label: "Endurance (min)" },
    ];
};

export default function ClientId() {
    const { id } = useParams();
    const client = useMemo(() => mockClients.find((c) => c.id === id), [id]);

    // State for progress tracking
    const [weight, setWeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [newMeasurements, setNewMeasurements] = useState({});
    const [progress, setProgress] = useState(client?.progress || []);

    // State for nutrition tracking
    const [nutrition, setNutrition] = useState(client?.nutrition || {});

    // State for notes
    const [notes, setNotes] = useState("");

    // State for tracking additional metrics
    const [activeMetric, setActiveMetric] = useState("");

    // State for viewing workout details
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    // State for progress photos
    const [progressPhotos, setProgressPhotos] = useState([
        {
            id: 1,
            date: "2025-04-15",
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Front view - 2 months into program",
        },
        {
            id: 2,
            date: "2025-03-15",
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Front view - 1 month into program",
        },
        {
            id: 3,
            date: "2025-02-15",
            imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60",
            notes: "Front view - Initial photo",
        },
    ]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // State for managing training plans
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [customPlans, setCustomPlans] = useState([]);
    const [clientData, setClientData] = useState(client);
    const [scheduledWorkouts, setScheduledWorkouts] = useState([]);

    // State for managing nutrition plans
    const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
    const [customNutritionPlans, setCustomNutritionPlans] = useState([]);

    // Get performance fields based on client type
    const performanceFields = useMemo(() => getPerformanceFields(client?.type, client?.sport), [client?.type, client?.sport]);

    // Update client data when client changes
    useEffect(() => {
        if (client) {
            setClientData(client);
            setProgress(client.progress || []);
            setNutrition(client.nutrition || {});
        }
    }, [client]);

    if (!client) {
        return <div className="p-8 text-center text-gray-400">Client not found.</div>;
    }

    // Handle progress update
    const handleProgressUpdate = (e) => {
        e.preventDefault();
        if (!weight && !bodyFat && Object.keys(newMeasurements).length === 0) return;

        const newEntry = {
            date: new Date().toISOString().slice(0, 10),
            weight: weight ? parseFloat(weight) : undefined,
            bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
            ...newMeasurements,
        };

        setProgress([...progress, newEntry]);
        setWeight("");
        setBodyFat("");
        setNewMeasurements({});
    };

    // Handle measurement input change
    const handleMeasurementChange = (field, value) => {
        setNewMeasurements({
            ...newMeasurements,
            [field]: parseFloat(value),
        });
    };

    // Handle nutrition update
    const handleNutritionUpdate = (e) => {
        e.preventDefault();
        // In a real app, update backend here
    };

    // Handle notes save
    const handleSaveNotes = () => {
        // In a real app, save notes to backend
        // Show a success message
        alert("Notes saved successfully!");
    };

    // Handle adding a metric to track
    const handleAddMetric = (metricId) => {
        setActiveMetric(metricId);
    };

    // Handle workout detail view
    const handleViewWorkoutDetail = (workout) => {
        setSelectedWorkout(workout);
    };

    const handleCloseWorkoutDetail = () => {
        setSelectedWorkout(null);
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            // In a real app, you would upload to your backend/storage here
            // For now, we'll simulate an upload with a timeout
            setTimeout(() => {
                const newPhoto = {
                    id: progressPhotos.length + 1,
                    date: new Date().toISOString().slice(0, 10),
                    imageUrl: URL.createObjectURL(file),
                    notes: "",
                };
                setProgressPhotos([newPhoto, ...progressPhotos]);
                setIsUploading(false);
            }, 1000);
        }
    };

    // Handle photo view
    const handleViewPhoto = (photo) => {
        setSelectedPhoto(photo);
    };

    // Handle photo close
    const handleClosePhoto = () => {
        setSelectedPhoto(null);
    };

    // Handle opening the training plan modal
    const handleOpenPlanModal = () => {
        setIsPlanModalOpen(true);
    };

    // Handle opening the workout schedule modal
    const handleOpenWorkoutModal = () => {
        setIsWorkoutModalOpen(true);
    };

    // Handle opening the nutrition plan modal
    const handleOpenNutritionModal = () => {
        setIsNutritionModalOpen(true);
    };

    // Handle scheduling a workout
    const handleScheduleWorkout = (workout) => {
        // Format the date for display
        const date = new Date(workout.date);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

        const newWorkout = {
            ...workout,
            date: formattedDate,
            stats: {
                exercises: `${workout.details.exercises.length} exercise${workout.details.exercises.length !== 1 ? "s" : ""}`,
                water: "0%",
                duration: "0min",
            },
        };

        setScheduledWorkouts([newWorkout, ...scheduledWorkouts]);

        // If we have client training data, add to upcoming
        if (clientData.training) {
            const updatedClientData = {
                ...clientData,
                nextSession: formattedDate,
                training: {
                    ...clientData.training,
                    remaining: (clientData.training.remaining || 0) + 1,
                },
            };
            setClientData(updatedClientData);
        }
    };

    // Handle assigning a plan to the client
    const handleAssignPlan = ({ assignedPlanId, customPlan }) => {
        // If a custom plan was created, add it to the list
        if (customPlan) {
            setCustomPlans([...customPlans, customPlan]);
        }

        // Update client data with the new plan
        setClientData({
            ...clientData,
            assignedPlan: assignedPlanId,
        });
    };

    // Handle assigning a nutrition plan to the client
    const handleAssignNutritionPlan = ({ nutritionPlanId, customPlan }) => {
        // If a custom plan was created, add it to the list
        if (customPlan) {
            setCustomNutritionPlans([...customNutritionPlans, customPlan]);
        }

        // Update client data with the new plan
        setClientData({
            ...clientData,
            nutritionPlan: customPlan || {
                id: nutritionPlanId,
                title: "Weight Loss Nutrition",
                description:
                    "Balanced nutrition plan focused on gradual weight loss with sufficient protein intake and moderate carbs.",
                image: "https://cdn.squats.in/kc_articles/16571113701456e93e41b1330b0dc.png",
                createdAt: new Date().toISOString().slice(0, 10),
                planType: "nutrition",
                duration: "8 weeks",
                dailyCalories: 1800,
                macros: {
                    protein: "35%",
                    carbs: "40%",
                    fats: "25%",
                },
                mealFrequency: 4,
                mealPlan: "Caloric deficit of 300-500 calories below maintenance. Focus on protein and fiber for satiety.",
            },
        });

        setIsNutritionModalOpen(false);
    };

    // Get current plan data
    const getCurrentPlan = () => {
        if (!clientData.assignedPlan) return null;

        // Check if it's a custom plan
        const customPlan = customPlans.find((p) => p.id === clientData.assignedPlan);
        if (customPlan) return customPlan;

        // Otherwise find from standard plans
        return mockPlans.find((p) => p.id === clientData.assignedPlan);
    };

    const currentPlan = getCurrentPlan();
    const currentNutritionPlan = clientData.nutritionPlan;

    // Get all workouts (scheduled + from client data)
    const getAllWorkouts = () => {
        const clientWorkouts = clientData.training?.recentWorkouts || [];
        return [...scheduledWorkouts, ...clientWorkouts].sort((a, b) => {
            // Sort by date (most recent first)
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
    };

    const allWorkouts = getAllWorkouts();

    return (
        <div className="relative min-h-screen  text-white">
            <EffectBackground />

            {/* Modals */}
            <WorkoutDetailModal
                isOpen={selectedWorkout !== null}
                onClose={handleCloseWorkoutDetail}
                workout={selectedWorkout}
            />

            <ProgressPhotoModal isOpen={selectedPhoto !== null} onClose={handleClosePhoto} photo={selectedPhoto} />

            <TrainingPlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setIsPlanModalOpen(false)}
                onAssignPlan={handleAssignPlan}
                client={clientData}
                existingPlanId={clientData.assignedPlan}
            />

            {/* Add Nutrition Plan Modal when it's implemented */}
            {/* For now, simulate opening a modal */}
            {isNutritionModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsNutritionModalOpen(false)}
                >
                    <div className="bg-[#222] p-6 rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Nutrition Plan Assignment</h3>
                        <p className="text-gray-300 mb-4">
                            This is a placeholder for the nutrition plan modal. In the actual implementation, this would allow
                            assigning nutrition plans.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsNutritionModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="orangeFilled" onClick={() => handleAssignNutritionPlan({ nutritionPlanId: "1" })}>
                                Assign Plan
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <WorkoutScheduleModal
                isOpen={isWorkoutModalOpen}
                onClose={() => setIsWorkoutModalOpen(false)}
                onScheduleWorkout={handleScheduleWorkout}
                client={clientData}
                existingPlan={currentPlan}
            />

            <div className="relative z-10 w-full px-4 py-6">
                {/* Client header */}
                <ClientHeader client={client} />

                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Progress Tracking */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Training Program Section */}
                        <TrainingProgramCard
                            currentPlan={currentPlan}
                            nutritionPlan={currentNutritionPlan}
                            onOpenPlanModal={handleOpenPlanModal}
                            onOpenWorkoutModal={handleOpenWorkoutModal}
                            onOpenNutritionModal={handleOpenNutritionModal}
                        />

                        {/* Client Training Progress Section */}
                        <TrainingProgressCard
                            clientData={clientData}
                            allWorkouts={allWorkouts}
                            scheduledWorkouts={scheduledWorkouts}
                            onOpenWorkoutModal={handleOpenWorkoutModal}
                            onViewWorkoutDetail={handleViewWorkoutDetail}
                        />

                        {/* Progress Tracking Section */}
                        <ProgressTrackingCard
                            weight={weight}
                            bodyFat={bodyFat}
                            activeMetric={activeMetric}
                            progress={progress}
                            newMeasurements={newMeasurements}
                            performanceFields={performanceFields}
                            onWeightChange={setWeight}
                            onBodyFatChange={setBodyFat}
                            onActiveMetricChange={setActiveMetric}
                            onMeasurementChange={handleMeasurementChange}
                            onProgressUpdate={handleProgressUpdate}
                            onMetricAdd={handleAddMetric}
                            clientType={client.type}
                            clientGoal={client.goal}
                        />

                        {/* Notes & Feedback Section */}
                        <NotesCard notes={notes} onNotesChange={setNotes} onSaveNotes={handleSaveNotes} />

                        {/* Progress Photos Section */}
                        <ProgressPhotosCard
                            progressPhotos={progressPhotos}
                            onViewPhoto={handleViewPhoto}
                            onPhotoUpload={handlePhotoUpload}
                            isUploading={isUploading}
                        />
                    </div>

                    {/* Right Column - Nutrition & Sessions */}
                    <div className="space-y-6">
                        {/* Body Composition Summary */}
                        <BodyCompositionCard progress={progress} />

                        {/* Nutrition Goals Section */}
                        <NutritionGoalsCard
                            nutrition={nutrition}
                            onNutritionChange={setNutrition}
                            onSubmit={handleNutritionUpdate}
                            clientGoal={client.goal}
                            nutritionPlan={currentNutritionPlan}
                        />

                        {/* Upcoming Sessions */}
                        <UpcomingSessionsCard
                            scheduledWorkouts={scheduledWorkouts}
                            clientData={clientData}
                            onOpenWorkoutModal={handleOpenWorkoutModal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
