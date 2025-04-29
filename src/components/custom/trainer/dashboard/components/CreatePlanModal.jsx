import { Button } from "@/components/common/Button";
import { CloseXIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared/FormField";
import { useState } from "react";

export const CreatePlanModal = ({ closeCreatePlanModal }) => {
    const [planName, setPlanName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [sessionsPerWeek, setSessionsPerWeek] = useState(2);
    const [price, setPrice] = useState("");
    const [sessions, setSessions] = useState(["", "", "", "", ""]);

    const handleSessionChange = (index, value) => {
        const newSessions = [...sessions];
        newSessions[index] = value;
        setSessions(newSessions);
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Handle plan creation logic here

        // Then close the modal
        closeCreatePlanModal();
    };

    const sessionsPerWeekOptions = [
        { value: 1, label: "1 session" },
        { value: 2, label: "2 sessions" },
        { value: 3, label: "3 sessions" },
        { value: 4, label: "4 sessions" },
        { value: 5, label: "5 sessions" },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold">Create New Training Plan</h3>

                    <Button variant="ghost" onClick={closeCreatePlanModal} className="text-gray-400 hover:text-white">
                        <CloseXIcon size={24} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <FormField
                            type="text"
                            label="Plan Name"
                            value={planName}
                            onChange={e => setPlanName(e.target.value)}
                            placeholder="E.g., Weight Loss, Marathon Prep, Strength Building..."
                            required
                        />
                    </div>

                    <div>
                        <FormField
                            type="textarea"
                            label="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the plan, its objectives, and target audience..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FormField
                                type="text"
                                label="Duration"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                placeholder="E.g., 8 weeks, 3 months..."
                                required
                            />
                        </div>

                        <div>
                            <FormField
                                type="select"
                                label="Sessions per Week"
                                value={sessionsPerWeek}
                                onChange={e => setSessionsPerWeek(parseInt(e.target.value))}
                                options={sessionsPerWeekOptions}
                                required
                            />
                        </div>

                        <div>
                            <FormField
                                type="number"
                                label="Price per Session ($)"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="E.g., 75"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm block mb-2">Session Components</label>
                        <p className="text-gray-400 text-xs mb-3">
                            List the key components or milestones included in this training plan
                        </p>

                        <div className="space-y-3">
                            {sessions.map((session, index) => (
                                <FormField
                                    key={index}
                                    type="text"
                                    value={session}
                                    onChange={e => handleSessionChange(index, e.target.value)}
                                    placeholder={`Session component ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="modalCancel" onClick={closeCreatePlanModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="orangeFilled">
                            Create Plan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
