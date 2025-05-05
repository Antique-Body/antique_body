"use client";

import Image from "next/image";
import { useState } from "react";

import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export default function ProgressPage() {
    // Sample user data
    const userData = {
        name: "Jamie Smith",
        stats: {
            height: 175, // cm
            weight: 72, // kg
            bmi: 23.5,
            bodyFat: 18, // percentage
        },
        progress_history: [
            { date: "Apr 1, 2025", weight: 74, bodyFat: 19 },
            { date: "Mar 15, 2025", weight: 75, bodyFat: 19.5 },
            { date: "Mar 1, 2025", weight: 76, bodyFat: 20 },
            { date: "Feb 15, 2025", weight: 77, bodyFat: 20.5 },
            { date: "Feb 1, 2025", weight: 78, bodyFat: 21 },
        ],
    };

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

    return (
        <div className="space-y-6">
            {/* Current Stats */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold">Current Stats</h2>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card variant="dark" width="100%" maxWidth="none">
                        <p className="mb-1 text-xs text-gray-400">Height</p>
                        <p className="text-lg font-bold">{userData.stats.height} cm</p>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <p className="mb-1 text-xs text-gray-400">Current Weight</p>
                        <p className="text-lg font-bold">{userData.stats.weight} kg</p>
                        <p className="text-xs text-[#4CAF50]">-6kg from start</p>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <p className="mb-1 text-xs text-gray-400">BMI</p>
                        <p className="text-lg font-bold">{userData.stats.bmi}</p>
                        <p className="text-xs text-[#4CAF50]">Healthy range</p>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <p className="mb-1 text-xs text-gray-400">Body Fat</p>
                        <p className="text-lg font-bold">{userData.stats.bodyFat}%</p>
                        <p className="text-xs text-[#4CAF50]">-3% from start</p>
                    </Card>
                </div>
            </Card>

            {/* Progress Charts */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold">Progress History</h2>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card variant="dark" width="100%" maxWidth="none">
                        <h3 className="mb-3 font-medium">Weight Progression</h3>
                        <div className="relative h-64">
                            {/* Simple weight chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex flex-1 flex-col items-center">
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="w-8 rounded-t-sm bg-gradient-to-t from-[#FF6B00] to-[#FF9A00] transition-all duration-500 hover:w-10"
                                                style={{
                                                    height: `${((entry.weight - 70) / 10) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.weight} kg</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <h3 className="mb-3 font-medium">Body Fat Progression</h3>
                        <div className="relative h-64">
                            {/* Simple body fat chart - in real app, use a charting library */}
                            <div className="absolute inset-0 flex items-end">
                                {userData.progress_history.map((entry, index) => (
                                    <div key={index} className="flex flex-1 flex-col items-center">
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="w-8 rounded-t-sm bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500 hover:w-10"
                                                style={{
                                                    height: `${(entry.bodyFat / 25) * 100}%`,
                                                    minHeight: "10%",
                                                    maxHeight: "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">{entry.date.split(", ")[0]}</p>
                                        <p className="text-xs font-medium">{entry.bodyFat}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <Button variant="orangeOutline" className="mt-4 w-full">
                    Upload Progress Photo
                </Button>
            </Card>

            {/* Progress Photos Section */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold">Progress Photos</h2>

                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Track your visual progress with photos. Upload new photos to document your journey.
                        </p>
                        <label className="relative cursor-pointer">
                            <FormField
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden-file-input"
                            />
                            <Button variant="orangeFilled" leftIcon={<PlusIcon size={16} />} disabled={isUploading}>
                                {isUploading ? "Uploading..." : "Upload Photo"}
                            </Button>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {progressPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#333] bg-[rgba(30,30,30,0.6)]"
                            onClick={() => handleViewPhoto(photo)}
                        >
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={photo.imageUrl}
                                    alt={`Progress photo from ${photo.date}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-sm font-medium text-white">{photo.date}</p>
                                    {photo.notes && <p className="mt-1 text-xs text-gray-300">{photo.notes}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center text-sm text-gray-400">
                    <p>Tip: Take photos in consistent lighting and poses for better progress tracking</p>
                </div>
            </Card>

            {/* Progress Photos Modal */}
            <Modal
                isOpen={selectedPhoto !== null}
                onClose={handleClosePhoto}
                title={`Progress Photo - ${selectedPhoto?.date}`}
                size="large"
                footerButtons={false}
            >
                {selectedPhoto && (
                    <div>
                        <div className="mb-4 relative aspect-[4/3] w-full">
                            <Image
                                src={selectedPhoto.imageUrl}
                                alt={`Progress photo from ${selectedPhoto.date}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                className="rounded-lg object-cover"
                            />
                        </div>
                        <div className="text-sm text-gray-400">
                            <p>Date: {selectedPhoto.date}</p>
                            {selectedPhoto.notes && <p className="mt-2">Notes: {selectedPhoto.notes}</p>}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Performance Metrics */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold">Performance Metrics</h2>

                <div className="space-y-4">
                    <Card variant="dark" width="100%" maxWidth="none">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">Squat Max</h3>
                            <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                +10kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">85kg</span>
                            <span className="ml-2 text-sm text-gray-400">previous: 75kg</span>
                        </div>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">Bench Press Max</h3>
                            <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                +7.5kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">67.5kg</span>
                            <span className="ml-2 text-sm text-gray-400">previous: 60kg</span>
                        </div>
                    </Card>

                    <Card variant="dark" width="100%" maxWidth="none">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">Deadlift Max</h3>
                            <span className="rounded bg-[rgba(255,107,0,0.15)] px-2 py-1 text-xs font-medium text-[#FF6B00]">
                                +15kg
                            </span>
                        </div>
                        <div className="flex items-center text-lg">
                            <span className="font-bold">120kg</span>
                            <span className="ml-2 text-sm text-gray-400">previous: 105kg</span>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
}
