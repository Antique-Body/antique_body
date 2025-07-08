"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Card } from "@/components/common/Card";

export default function OverviewPage() {
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTrainer = async () => {
      try {
        const response = await fetch(
          "/api/coaching-requests?role=client&status=accepted"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            setCurrentTrainer(data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching current trainer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrainer();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent"></div>
          <p className="mt-4 text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentTrainer) {
    return (
      <div className="px-4 py-5">
        <div className="text-center py-12">
          <Icon
            icon="mdi:account-multiple-outline"
            className="text-zinc-600 mx-auto mb-4"
            width={64}
            height={64}
          />
          <h2 className="text-2xl font-bold text-white mb-2">
            No Active Trainer
          </h2>
          <p className="text-zinc-400">
            You don't have an active trainer yet. Visit the "Train with Coach"
            section to find and request a trainer.
          </p>
        </div>
      </div>
    );
  }

  const trainer = currentTrainer.trainer;

  return (
    <div className="px-4 py-5">
      <h1 className="text-2xl font-bold text-white mb-6">
        Your Training Overview
      </h1>

      {/* Current Trainer Card */}
      <Card variant="default" className="mb-6">
        <div className="flex items-start gap-6">
          {/* Trainer Image */}
          <div className="relative h-24 w-24 overflow-hidden rounded-xl ring-2 ring-[#3E92CC]/20">
            {trainer.trainerProfile.profileImage ? (
              <Image
                src={trainer.trainerProfile.profileImage}
                alt={`${trainer.trainerProfile.firstName} profile`}
                className="object-cover w-full h-full"
                width={96}
                height={96}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
                <Icon icon="mdi:account" width={36} height={36} color="white" />
              </div>
            )}
          </div>

          {/* Trainer Info */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">
              Your Trainer: {trainer.trainerProfile.firstName}{" "}
              {trainer.trainerProfile.lastName}
            </h2>
            <p className="text-zinc-400 mb-4">
              {trainer.trainerProfile.bio || "No bio available"}
            </p>

            {/* Specialties */}
            {trainer.specialties && trainer.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((specialty) => (
                  <span
                    key={specialty.id}
                    className="px-3 py-1 rounded-full bg-[#3E92CC]/20 text-[#3E92CC] text-sm"
                  >
                    {specialty.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Placeholder for future sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Activities
          </h3>
          <p className="text-zinc-400">
            Your recent training activities will appear here soon.
          </p>
        </Card>

        <Card variant="default">
          <h3 className="text-lg font-semibold text-white mb-4">
            Progress Tracking
          </h3>
          <p className="text-zinc-400">
            Your training progress metrics will be displayed here.
          </p>
        </Card>
      </div>
    </div>
  );
}
