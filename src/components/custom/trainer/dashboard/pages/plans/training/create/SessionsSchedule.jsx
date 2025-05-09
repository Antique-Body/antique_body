"use client";

import { useState } from "react";

import { SessionExercises } from "./SessionExercises";

import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PlusIcon, TrashIcon, ClockIcon, EditIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const SessionsSchedule = ({ schedule, updateSchedule, exerciseLibrary }) => {
    const [expandedSession, setExpandedSession] = useState(null);
    const [editingSession, setEditingSession] = useState(null);

    const addSession = () => {
        const newSession = {
            id: crypto.randomUUID(),
            name: `Workout ${schedule.length + 1}`,
            duration: 60,
            day: DAYS_OF_WEEK[0],
            description: "",
            exercises: [],
        };
        updateSchedule([...schedule, newSession]);
    };

    const removeSession = (sessionId) => {
        updateSchedule(schedule.filter((session) => session.id !== sessionId));
    };

    const updateSession = (sessionId, field, value) => {
        updateSchedule(schedule.map((session) => (session.id === sessionId ? { ...session, [field]: value } : session)));
    };

    const updateSessionExercises = (sessionId, exercises) => {
        updateSchedule(schedule.map((session) => (session.id === sessionId ? { ...session, exercises } : session)));
    };

    const handleSaveSession = () => {
        setEditingSession(null);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Training Sessions</h3>
                <Button variant="orangeOutline" size="small" onClick={addSession} leftIcon={<PlusIcon size={16} />}>
                    Add Session
                </Button>
            </div>

            <div className="space-y-4">
                {schedule.map((session) => (
                    <Card key={session.id} variant="dark" width="100%" maxWidth="100%">
                        {editingSession === session.id ? (
                            // Editing mode
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Session Name"
                                        name="sessionName"
                                        value={session.name}
                                        onChange={(e) => updateSession(session.id, "name", e.target.value)}
                                        placeholder="e.g., Upper Body Workout"
                                        backgroundStyle="darker"
                                    />

                                    <FormField
                                        label="Day"
                                        name="sessionDay"
                                        type="select"
                                        value={session.day}
                                        onChange={(e) => updateSession(session.id, "day", e.target.value)}
                                        options={DAYS_OF_WEEK}
                                        backgroundStyle="darker"
                                    />

                                    <FormField
                                        label="Duration (minutes)"
                                        name="sessionDuration"
                                        type="number"
                                        min="15"
                                        step="5"
                                        value={session.duration}
                                        onChange={(e) => updateSession(session.id, "duration", e.target.value)}
                                        backgroundStyle="darker"
                                    />
                                </div>

                                <FormField
                                    label="Description"
                                    name="sessionDescription"
                                    type="textarea"
                                    rows={2}
                                    value={session.description}
                                    onChange={(e) => updateSession(session.id, "description", e.target.value)}
                                    placeholder="Brief description of this session..."
                                    backgroundStyle="darker"
                                />

                                <div className="flex justify-end mt-4">
                                    <Button variant="orangeFilled" size="small" onClick={handleSaveSession}>
                                        Save Session
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Display mode
                            <>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF6B00] flex items-center justify-center mr-3">
                                                <ClockIcon size={16} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white">{session.name}</h4>
                                                <p className="text-sm text-gray-400">
                                                    {session.day} • {session.duration} minutes
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                onClick={() => setEditingSession(session.id)}
                                                leftIcon={<EditIcon size={16} />}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="small"
                                                onClick={() => removeSession(session.id)}
                                                leftIcon={<TrashIcon size={16} />}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>

                                    {session.description && (
                                        <p className="text-gray-300 text-sm mt-2 mb-3">{session.description}</p>
                                    )}

                                    <div className="flex justify-between items-center mt-4">
                                        <div>
                                            <span className="text-gray-400 text-sm">{session.exercises.length} exercises</span>
                                        </div>
                                        <Button
                                            variant={expandedSession === session.id ? "orangeFilled" : "orangeOutline"}
                                            size="small"
                                            onClick={() =>
                                                setExpandedSession(expandedSession === session.id ? null : session.id)
                                            }
                                        >
                                            {expandedSession === session.id ? "Hide Exercises" : "Manage Exercises"}
                                        </Button>
                                    </div>
                                </div>

                                {expandedSession === session.id && (
                                    <div className="border-t border-[#333] p-4">
                                        <SessionExercises
                                            sessionExercises={session.exercises}
                                            updateSessionExercises={(exercises) =>
                                                updateSessionExercises(session.id, exercises)
                                            }
                                            exerciseLibrary={exerciseLibrary}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                ))}
            </div>

            {schedule.length === 0 && (
                <div className="text-center p-8 bg-[#1a1a1a] rounded-lg border border-dashed border-[#333]">
                    <p className="text-gray-400 mb-4">No training sessions added yet</p>
                    <Button variant="orangeOutline" onClick={addSession} leftIcon={<PlusIcon size={16} />}>
                        Add Your First Session
                    </Button>
                </div>
            )}
        </div>
    );
};
