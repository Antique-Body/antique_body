"use client";

import Image from "next/image";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";
import { Card } from "@/components/custom/Card";

export const TrainingPlanInfo = ({ planData, handleChange, handleImageChange }) => {
    const [previewImage, setPreviewImage] = useState(null);

    const handleLocalImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageChange(e);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>

                <FormField
                    label="Plan Title"
                    name="title"
                    placeholder="e.g., 8-Week Strength Program"
                    value={planData.title}
                    onChange={handleChange}
                    required
                />

                <FormField
                    label="Description"
                    name="description"
                    type="textarea"
                    placeholder="Describe the training plan and its goals..."
                    value={planData.description}
                    onChange={handleChange}
                    rows={4}
                />

                <FormField
                    label="Price ($)"
                    name="price"
                    type="number"
                    placeholder="e.g., 99.99"
                    value={planData.price}
                    onChange={handleChange}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Duration"
                        name="duration"
                        type="number"
                        placeholder="e.g., 4"
                        min="1"
                        value={planData.duration}
                        onChange={handleChange}
                    />

                    <FormField
                        label="Duration Type"
                        name="durationType"
                        type="select"
                        value={planData.durationType}
                        onChange={handleChange}
                        options={[
                            { value: "weeks", label: "Weeks" },
                            { value: "months", label: "Months" },
                            { value: "days", label: "Days" },
                        ]}
                    />
                </div>

                <FormField
                    label="Sessions Per Week"
                    name="sessionsPerWeek"
                    type="select"
                    value={planData.sessionsPerWeek}
                    onChange={handleChange}
                    options={[
                        { value: "1", label: "1 session" },
                        { value: "2", label: "2 sessions" },
                        { value: "3", label: "3 sessions" },
                        { value: "4", label: "4 sessions" },
                        { value: "5", label: "5 sessions" },
                        { value: "6", label: "6 sessions" },
                        { value: "7", label: "7 sessions" },
                    ]}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Training Format</h3>

                <FormField
                    label="Training Type"
                    name="trainingType"
                    type="select"
                    value={planData.trainingType}
                    onChange={handleChange}
                    options={[
                        { value: "with-trainer", label: "With Trainer" },
                        { value: "self-guided", label: "Self-Guided" },
                        { value: "hybrid", label: "Hybrid (3+1, 2+1, etc.)" },
                    ]}
                />

                <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <h4 className="font-medium text-white mb-3">Session Format</h4>

                    <div className="flex gap-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="sessionFormat.inPerson"
                                checked={planData.sessionFormat.inPerson}
                                onChange={handleChange}
                                className="rounded border-[#333] bg-[#1a1a1a] text-[#FF6B00] focus:ring-[#FF6B00] focus:ring-opacity-25"
                            />
                            <span>In-Person</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="sessionFormat.online"
                                checked={planData.sessionFormat.online}
                                onChange={handleChange}
                                className="rounded border-[#333] bg-[#1a1a1a] text-[#FF6B00] focus:ring-[#FF6B00] focus:ring-opacity-25"
                            />
                            <span>Online</span>
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cover Image</h3>

                    <Card variant="dark" width="100%" maxWidth="100%" className="p-4 flex flex-col items-center justify-center">
                        {previewImage ? (
                            <div className="relative w-full h-40 mb-4">
                                <Image src={previewImage} alt="Plan cover preview" fill className="object-cover rounded-md" />
                            </div>
                        ) : (
                            <div className="w-full h-40 mb-4 bg-[#222] rounded-md flex items-center justify-center">
                                <span className="text-gray-400">No image selected</span>
                            </div>
                        )}

                        <FormField
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleLocalImageChange}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-400 mt-2">Recommended size: 1200 x 800px</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
