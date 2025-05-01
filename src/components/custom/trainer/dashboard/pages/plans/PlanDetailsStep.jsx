"use client";

import { useState } from "react";

import { Button } from "@/components/common/Button";

export const PlanDetailsStep = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    summary: initialData.summary || "",
    description: initialData.description || "",
    forAthletes: initialData.forAthletes || "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
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
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-200">
              Plan Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="E.g., Basketball Elite Performance"
            />
          </div>

          <div>
            <label htmlFor="summary" className="mb-2 block text-sm font-medium text-gray-200">
              Short Summary
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Brief description (50-100 characters)"
            />
            <p className="mt-1 text-xs text-gray-500">This will appear on the plan card</p>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-200">
              Detailed Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="Detailed explanation of what the plan involves and its benefits"
            />
          </div>

          <div>
            <label htmlFor="forAthletes" className="mb-2 block text-sm font-medium text-gray-200">
              Target Athletes
            </label>
            <input
              type="text"
              id="forAthletes"
              name="forAthletes"
              value={formData.forAthletes}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-[#333] bg-[#222] px-4 py-3 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              placeholder="E.g., Basketball players looking to improve jumping ability"
            />
          </div>

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
