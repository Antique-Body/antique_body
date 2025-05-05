"use client";

import { useState } from "react";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";

export const PlanDetailsStep = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: initialData.title || "",
        summary: initialData.summary || "",
        description: initialData.description || "",
        forAthletes: initialData.forAthletes || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">Plan Details</h2>
            <p className="mb-8 text-gray-400">
                Provide basic information about your training plan. Be specific to help clients understand the purpose and
                benefits.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <FormField
                        label="Plan Title"
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Fat Loss Plan"
                        backgroundStyle="darker"
                    />

                    <FormField
                        label="Short Summary"
                        id="summary"
                        name="summary"
                        type="text"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                        placeholder="Brief description (50-100 characters)"
                        backgroundStyle="darker"
                        subLabel="This will appear on the plan card"
                    />

                    <FormField
                        label="Detailed Description"
                        id="description"
                        name="description"
                        type="textarea"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Detailed explanation of what the plan involves and its benefits"
                        backgroundStyle="darker"
                    />

                    <FormField
                        label="Target Athletes"
                        id="forAthletes"
                        name="forAthletes"
                        type="text"
                        value={formData.forAthletes}
                        onChange={handleChange}
                        required
                        placeholder="E.g., Basketball players looking to improve jumping ability"
                        backgroundStyle="darker"
                    />

                    <div className="pt-6">
                        <Button type="submit" variant="orangeFilled" className="w-full py-3">
                            Continue to Training Schedule
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
