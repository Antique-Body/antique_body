"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ProgressBar } from "@/components/common";
import { Button } from "@/components/common/Button";
import {
  ClockIcon,
  MessageIcon,
  NutritionIcon,
  PlusIcon,
  ProgressChartIcon,
  WorkoutIcon,
  EditIcon,
} from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { MacroDistribution } from "@/components/custom/client/dashboard/pages/nutrition/components";
import { BackgroundShapes } from "@/components/custom/shared";
import { ClientHeader, PerformanceMetrics } from "@/components/custom/trainer/dashboard/pages/clients";
import mockPlans from "@/components/custom/trainer/dashboard/pages/plans/data/mockPlans";
import { FormField } from "@/components/shared/FormField";

// Mock data for demonstration
const mockClients = [
  {
    id: "1",
    name: "John Doe",
    status: "Active",
    plan: "Pro Athlete",
    goal: "Build Muscle",
    joinDate: "Jan 15, 2025",
    nextSession: "Apr 12, 2025",
    type: "gym",
    assignedPlan: "gym-burn-fat", // ID of the assigned plan
    progress: [
      { date: "2025-04-01", benchPress: 80, squat: 100, deadlift: 120, weight: 80, bodyFat: 15 },
      { date: "2025-04-08", benchPress: 85, squat: 105, deadlift: 125, weight: 81, bodyFat: 14.8 },
      { date: "2025-04-15", benchPress: 87.5, squat: 110, deadlift: 130, weight: 81.5, bodyFat: 14.5 },
    ],
    nutrition: { protein: 160, carbs: 250, fats: 60, calories: 2200 },
  },
  {
    id: "2",
    name: "Sarah Williams",
    status: "Active",
    plan: "Recovery",
    goal: "football",
    joinDate: "Feb 3, 2025",
    nextSession: "Apr 10, 2025",
    type: "athlete",
    sport: "football",
    assignedPlan: "football-pro", // Football plan
    progress: [
      { date: "2025-04-01", sprint: 12.5, agility: 8.2, kickAccuracy: 75, weight: 65, bodyFat: 18 },
      { date: "2025-04-08", sprint: 12.2, agility: 8.0, kickAccuracy: 78, weight: 65.5, bodyFat: 17.8 },
      { date: "2025-04-15", sprint: 11.9, agility: 7.8, kickAccuracy: 82, weight: 65, bodyFat: 17.5 },
    ],
    nutrition: { protein: 120, carbs: 300, fats: 50, calories: 2100 },
  },
  {
    id: "3",
    name: "Mike Chen",
    status: "Active",
    plan: "Weight Loss",
    goal: "Fat Loss",
    joinDate: "Mar 10, 2025",
    nextSession: "Apr 15, 2025",
    type: "gym",
    // No assigned plan yet
    progress: [
      { date: "2025-04-01", cardio: 35, caloriesBurned: 450, weight: 92, bodyFat: 24 },
      { date: "2025-04-08", cardio: 40, caloriesBurned: 520, weight: 90.5, bodyFat: 23.5 },
      { date: "2025-04-15", cardio: 45, caloriesBurned: 580, weight: 89, bodyFat: 23 },
    ],
    nutrition: { protein: 140, carbs: 180, fats: 55, calories: 1800 },
  },
  {
    id: "4",
    name: "Emma Johnson",
    status: "Active",
    plan: "Elite Performance",
    goal: "basketball",
    joinDate: "Jan 5, 2025",
    nextSession: "Apr 14, 2025",
    type: "basketball",
    assignedPlan: "basketball-elite", // Basketball plan
    progress: [
      { date: "2025-04-01", verticalJump: 60, shootingAccuracy: 72, sprint: 8.6, weight: 75, bodyFat: 12 },
      { date: "2025-04-08", verticalJump: 62, shootingAccuracy: 75, sprint: 8.4, weight: 74.5, bodyFat: 11.8 },
      { date: "2025-04-15", verticalJump: 65, shootingAccuracy: 78, sprint: 8.2, weight: 74, bodyFat: 11.5 },
    ],
    nutrition: { protein: 150, carbs: 280, fats: 55, calories: 2200 },
  },
  {
    id: "5",
    name: "Carlos Rodriguez",
    status: "Active",
    plan: "Sports Conditioning",
    goal: "tennis",
    joinDate: "Feb 20, 2025",
    nextSession: "Apr 16, 2025",
    type: "tennis",
    // No assigned plan yet
    progress: [
      { date: "2025-04-01", serveSpeed: 165, forehandAccuracy: 75, backhandAccuracy: 70, weight: 72, bodyFat: 14 },
      { date: "2025-04-08", serveSpeed: 168, forehandAccuracy: 78, backhandAccuracy: 72, weight: 71.5, bodyFat: 13.8 },
      { date: "2025-04-15", serveSpeed: 172, forehandAccuracy: 80, backhandAccuracy: 75, weight: 71, bodyFat: 13.5 },
    ],
    nutrition: { protein: 145, carbs: 260, fats: 55, calories: 2100 },
  },
];

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

const ClientId = () => {
  const { id } = useParams();
  const client = useMemo(() => mockClients.find(c => c.id === id), [id]);

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

  // Get performance fields based on client type
  const performanceFields = useMemo(
    () => getPerformanceFields(client?.type, client?.sport),
    [client?.type, client?.sport],
  );

  if (!client) {
    return <div className="p-8 text-center text-gray-400">Client not found.</div>;
  }

  // Handle progress update
  const handleProgressUpdate = e => {
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
  const handleNutritionUpdate = e => {
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
  const handleAddMetric = metricId => {
    setActiveMetric(metricId);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Background shapes */}
      <BackgroundShapes />

      <div className="relative z-10 w-full px-4 py-6">
        {/* Client header */}
        <ClientHeader client={client} />

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Progress Tracking */}
          <div className="space-y-6 lg:col-span-2">
            {/* Training Program Section */}
            <Card variant="darkStrong" width="100%" maxWidth="none">
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <WorkoutIcon size={20} stroke="#FF6B00" className="mr-2" />
                Training Program
              </h3>

              {client.assignedPlan ? (
                <div className="mb-4">
                  <div className="mb-2 font-medium">Current Program:</div>
                  <div className="mb-4 rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
                    <div className="mb-2 text-lg text-[#FF6B00]">
                      {mockPlans.find(p => p.id === client.assignedPlan)?.title || "Custom Program"}
                    </div>
                    <p className="text-sm text-gray-400">
                      {mockPlans.find(p => p.id === client.assignedPlan)?.summary ||
                        "Custom training program for client's specific needs."}
                    </p>
                  </div>
                  <Link href="/trainer/dashboard/plans">
                    <Button variant="outlineOrange" leftIcon={<EditIcon size={16} />}>
                      Change Program
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                      <WorkoutIcon size={20} stroke="#FF6B00" />
                    </div>
                    <div>
                      <div className="font-medium">No Program Assigned</div>
                      <p className="text-sm text-gray-400">
                        Assign a training program to help your client achieve their goals
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#333] bg-[rgba(30,30,30,0.3)] p-4">
                    <div className="mb-3 flex items-center">
                      <div className="mr-2 rounded-full bg-yellow-600 px-2 py-1 text-xs font-medium">Action Needed</div>
                      <span className="text-sm text-gray-400">Create a personalized training experience</span>
                    </div>
                    <Link href="/trainer/dashboard/plans">
                      <Button
                        variant="orangeFilled"
                        leftIcon={<PlusIcon size={16} />}
                        className="w-full justify-center py-2.5 text-sm font-medium"
                      >
                        Assign Training Program
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>

            {/* Progress Tracking Section */}
            <Card variant="darkStrong" width="100%" maxWidth="none">
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <ProgressChartIcon size={20} stroke="#FF6B00" className="mr-2" />
                Progress Tracking
              </h3>

              <form
                className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
                onSubmit={handleProgressUpdate}
              >
                <FormField
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="mb-0"
                  min="0"
                  step="0.1"
                />
                <FormField
                  type="number"
                  placeholder="Body Fat (%)"
                  value={bodyFat}
                  onChange={e => setBodyFat(e.target.value)}
                  className="mb-0"
                  min="0"
                  step="0.1"
                />

                {/* Dynamic performance metrics based on client type */}
                {activeMetric ? (
                  <FormField
                    type="number"
                    placeholder={performanceFields.find(f => f.id === activeMetric)?.label || activeMetric}
                    value={newMeasurements[activeMetric] || ""}
                    onChange={e => handleMeasurementChange(activeMetric, e.target.value)}
                    className="mb-0"
                    step="0.1"
                  />
                ) : (
                  <FormField
                    type="select"
                    value={activeMetric}
                    onChange={e => setActiveMetric(e.target.value)}
                    options={[
                      { value: "", label: "Select Metric" },
                      ...performanceFields.map(field => ({
                        value: field.id,
                        label: field.label,
                      })),
                    ]}
                    className="mb-0"
                  />
                )}

                <Button type="submit" variant="orangeFilled" className="md:col-span-2 lg:col-span-3">
                  Add Progress Entry
                </Button>
              </form>

              {/* Client performance metrics visualization */}
              <PerformanceMetrics
                clientType={client.type}
                clientGoal={client.goal}
                progress={progress}
                onMetricAdd={handleAddMetric}
              />

              {/* Progress history table */}
              <div className="mt-6">
                <h4 className="mb-3 font-medium">Progress History</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#333] text-gray-400">
                        <th className="px-2 py-2 text-left">Date</th>
                        <th className="px-2 py-2 text-left">Weight (kg)</th>
                        <th className="px-2 py-2 text-left">Body Fat (%)</th>

                        {/* Dynamic headers based on client type */}
                        {performanceFields
                          .filter(field => progress.some(entry => entry[field.id] !== undefined))
                          .map(field => (
                            <th key={field.id} className="px-2 py-2 text-left">
                              {field.label}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...progress].reverse().map((entry, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-[rgba(30,30,30,0.3)]" : ""}>
                          <td className="px-2 py-2">{entry.date}</td>
                          <td className="px-2 py-2">{entry.weight ?? "-"}</td>
                          <td className="px-2 py-2">{entry.bodyFat ?? "-"}</td>

                          {/* Dynamic cells based on client type */}
                          {performanceFields
                            .filter(field => progress.some(entry => entry[field.id] !== undefined))
                            .map(field => (
                              <td key={field.id} className="px-2 py-2">
                                {entry[field.id] !== undefined ? entry[field.id] : "-"}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Session notes & feedback */}
            <Card variant="darkStrong" width="100%" maxWidth="none">
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <MessageIcon size={20} stroke="#FF6B00" className="mr-2" />
                Notes & Feedback
              </h3>
              <FormField
                type="textarea"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this client's progress, challenges, or feedback..."
                className="mb-3"
              />
              <Button onClick={handleSaveNotes} variant="orangeFilled">
                Save Notes
              </Button>
            </Card>
          </div>

          {/* Right Column - Nutrition & Sessions */}
          <div className="space-y-6">
            {/* Body Composition Summary */}
            <Card variant="darkStrong" width="100%" maxWidth="none">
              <h3 className="mb-4 text-xl font-semibold">Body Composition</h3>

              {progress.length > 1 && (
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Current Weight</span>
                      <span>{progress[progress.length - 1].weight} kg</span>
                    </div>
                    <ProgressBar
                      value={progress[0].weight}
                      maxValue={progress[progress.length - 1].weight}
                      color={progress[progress.length - 1].weight <= progress[0].weight ? "bg-green-500" : "bg-red-500"}
                      showValues={false}
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                      <span>Initial: {progress[0].weight} kg</span>
                      <span
                        className={
                          progress[progress.length - 1].weight <= progress[0].weight ? "text-green-400" : "text-red-400"
                        }
                      >
                        {progress[progress.length - 1].weight <= progress[0].weight ? "Lost" : "Gained"}{" "}
                        {Math.abs(progress[progress.length - 1].weight - progress[0].weight).toFixed(1)} kg
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Current Body Fat</span>
                      <span>{progress[progress.length - 1].bodyFat}%</span>
                    </div>
                    <ProgressBar
                      value={progress[0].bodyFat}
                      maxValue={progress[progress.length - 1].bodyFat}
                      color={
                        progress[progress.length - 1].bodyFat <= progress[0].bodyFat ? "bg-green-500" : "bg-red-500"
                      }
                      showValues={false}
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                      <span>Initial: {progress[0].bodyFat}%</span>
                      <span
                        className={
                          progress[progress.length - 1].bodyFat <= progress[0].bodyFat
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {progress[progress.length - 1].bodyFat <= progress[0].bodyFat ? "Lost" : "Gained"}{" "}
                        {Math.abs(progress[progress.length - 1].bodyFat - progress[0].bodyFat).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Nutrition Goals Section */}
            <Card variant="darkStrong" hover={true} width="100%" maxWidth="none">
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <NutritionIcon size={20} stroke="#FF6B00" className="mr-2" />
                Nutrition Goals
              </h3>

              <form className="mb-4 grid grid-cols-1 gap-3" onSubmit={handleNutritionUpdate}>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    type="number"
                    label="Protein (g)"
                    value={nutrition.protein || ""}
                    onChange={e => setNutrition({ ...nutrition, protein: parseInt(e.target.value) })}
                    className="mb-0"
                  />
                  <FormField
                    type="number"
                    label="Carbs (g)"
                    value={nutrition.carbs || ""}
                    onChange={e => setNutrition({ ...nutrition, carbs: parseInt(e.target.value) })}
                    className="mb-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    type="number"
                    label="Fats (g)"
                    value={nutrition.fats || ""}
                    onChange={e => setNutrition({ ...nutrition, fats: parseInt(e.target.value) })}
                    className="mb-0"
                  />
                  <FormField
                    type="number"
                    label="Calories"
                    value={nutrition.calories || ""}
                    onChange={e => setNutrition({ ...nutrition, calories: parseInt(e.target.value) })}
                    className="mb-0"
                  />
                </div>

                <Button type="submit" variant="orangeFilled" className="mt-2">
                  Update Nutrition Goals
                </Button>
              </form>

              {/* Macro distribution visualization */}
              <div className="mb-5">
                <h4 className="mb-2 text-sm font-medium">Macronutrient Distribution</h4>
                <MacroDistribution
                  protein={nutrition.protein || 0}
                  carbs={nutrition.carbs || 0}
                  fat={nutrition.fats || 0}
                />
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Nutrition Recommendations</h4>
                <div className="text-sm text-gray-300">
                  <ul className="ml-5 list-disc space-y-1 text-gray-400">
                    <li>Maintain high protein intake for recovery</li>
                    <li>Consider {client.goal === "Fat Loss" ? "reducing" : "increasing"} carb intake</li>
                    <li>Stay hydrated (3-4 liters per day)</li>
                    <li>Track food intake daily</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Upcoming Sessions */}
            <Card variant="darkStrong" hover={true} width="100%" maxWidth="none">
              <h3 className="mb-4 flex items-center text-xl font-semibold">
                <ClockIcon size={20} stroke="#FF6B00" className="mr-2" />
                Upcoming Sessions
              </h3>

              <div className="mb-4 rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{client.nextSession}</div>
                    <div className="text-sm text-gray-400">Regular Training</div>
                  </div>
                  <div className="rounded bg-[rgba(255,107,0,0.2)] px-2 py-1 text-xs text-[#FF6B00]">Upcoming</div>
                </div>
              </div>

              <Button variant="orangeFilled" className="w-full" leftIcon={<PlusIcon size={16} />}>
                Schedule New Session
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientId;
