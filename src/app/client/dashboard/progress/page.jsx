"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import { Modal } from "@/components/common";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { CalendarIcon, ChartBarIcon, LineChartIcon, PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { BodyMeasurementsVisual, WeeklyProgressChart } from "@/components/custom/client/dashboard/pages/progress";

export default function ProgressPage() {
    const { data: session } = useSession();
    
    // Sample user data
    const userData = {
        name: session?.user?.name || "Loading...",
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

    // Body measurements history
    const [measurementsHistory, setMeasurementsHistory] = useState([
        {
            date: "Apr 1, 2025",
            weight: 74,
            bodyFat: 19,
            chest: 102,
            waist: 84,
            hips: 95,
            thighs: 58,
            arms: 34
        },
        {
            date: "Mar 15, 2025",
            weight: 75,
            bodyFat: 19.5,
            chest: 101,
            waist: 85,
            hips: 96,
            thighs: 57,
            arms: 33.5
        },
        {
            date: "Mar 1, 2025",
            weight: 76,
            bodyFat: 20,
            chest: 100,
            waist: 86,
            hips: 97,
            thighs: 56.5,
            arms: 33
        },
        {
            date: "Feb 15, 2025",
            weight: 77,
            bodyFat: 20.5,
            chest: 99,
            waist: 87,
            hips: 98,
            thighs: 56,
            arms: 32.5
        },
        {
            date: "Feb 1, 2025",
            weight: 78,
            bodyFat: 21,
            chest: 98,
            waist: 88,
            hips: 99,
            thighs: 55,
            arms: 32
        },
    ]);
    
    // Current measurements
    const currentMeasurements = measurementsHistory[0] || {
        chest: 102,
        waist: 84,
        hips: 95,
        thighs: 58,
        arms: 34
    };
    
    // Previous measurements (for comparison)
    const previousMeasurements = measurementsHistory[measurementsHistory.length - 1] || {
        chest: 98,
        waist: 88,
        hips: 99,
        thighs: 55,
        arms: 32
    };

    // New state for weekly check-in
    const [isWeeklyCheckInOpen, setIsWeeklyCheckInOpen] = useState(false);
    const [weeklyCheckInData, setWeeklyCheckInData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: "",
        bodyFat: "",
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: "",
        notes: "",
        photo: null
    });
    const [lastCheckIn, setLastCheckIn] = useState(null);

    // State for tracking selected measurement
    const [selectedMeasurement, setSelectedMeasurement] = useState("waist");

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

    // Handle weekly check-in input changes
    const handleWeeklyCheckInChange = (e) => {
        const { name, value } = e.target;
        setWeeklyCheckInData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle weekly check-in photo upload
    const handleWeeklyCheckInPhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setWeeklyCheckInData(prev => ({
                ...prev,
                photo: {
                    file,
                    preview: URL.createObjectURL(file)
                }
            }));
        }
    };

    // Submit weekly check-in
    const handleWeeklyCheckInSubmit = () => {
        // In a real app, you would submit this data to your backend
        // For now, we'll just update our local state
        
        // Create a new progress history entry
        const newProgressEntry = {
            date: weeklyCheckInData.date.replace(/-/g, '/').split('/').reverse().slice(0, 2).join(' '),
            weight: parseFloat(weeklyCheckInData.weight) || userData.stats.weight,
            bodyFat: parseFloat(weeklyCheckInData.bodyFat) || userData.stats.bodyFat
        };
        
        // Update user data
        userData.stats.weight = newProgressEntry.weight;
        userData.stats.bodyFat = newProgressEntry.bodyFat;
        userData.progress_history = [newProgressEntry, ...userData.progress_history];
        
        // If there's a photo, add it to progress photos
        if (weeklyCheckInData.photo) {
            const newPhoto = {
                id: progressPhotos.length + 1,
                date: weeklyCheckInData.date,
                imageUrl: weeklyCheckInData.photo.preview,
                notes: weeklyCheckInData.notes || "Weekly check-in"
            };
            setProgressPhotos([newPhoto, ...progressPhotos]);
        }
        
        // Save last check-in date
        setLastCheckIn(new Date().toISOString());
        
        // Reset form and close modal
        setWeeklyCheckInData({
            date: new Date().toISOString().split('T')[0],
            weight: "",
            bodyFat: "",
            chest: "",
            waist: "",
            hips: "",
            thighs: "",
            arms: "",
            notes: "",
            photo: null
        });
        
        setIsWeeklyCheckInOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Weekly Check-in Banner */}
            <Card 
                variant="dark" 
                width="100%" 
                maxWidth="none" 
                className="bg-gradient-to-r from-[#1a1a1a] to-[#222] border-l-4 border-[#FF6B00]"
            >
                <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="mb-4 sm:mb-0">
                        <h2 className="text-xl font-bold mb-2 flex items-center">
                            <CalendarIcon size={20} className="mr-2 text-[#FF6B00]" />
                            Weekly Progress Check-in
                        </h2>
                        <p className="text-sm text-gray-400">
                            Tracking your progress consistently is key to achieving your fitness goals.
                            Update your measurements and upload progress photos weekly.
                        </p>
                    </div>
                    <Button 
                        variant="orangeFilled" 
                        onClick={() => setIsWeeklyCheckInOpen(true)}
                        className="whitespace-nowrap"
                    >
                        Log This Week
                    </Button>
                </div>
                
                {lastCheckIn && (
                    <div className="mt-3 pt-3 border-t border-[#333] text-sm text-gray-400">
                        Last check-in: {new Date(lastCheckIn).toLocaleDateString()} 
                        ({Math.floor((new Date() - new Date(lastCheckIn)) / (1000 * 60 * 60 * 24))} days ago)
                    </div>
                )}
            </Card>

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
                <h2 className="mb-4 text-xl font-bold flex items-center">
                    <LineChartIcon size={20} className="mr-2 text-[#FF6B00]" />
                    Progress History
                </h2>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <WeeklyProgressChart 
                        data={measurementsHistory}
                        measurement="weight"
                        unit="kg"
                        title="Weight Progression"
                    />

                    <WeeklyProgressChart 
                        data={measurementsHistory}
                        measurement="bodyFat"
                        unit="%"
                        title="Body Fat Progression"
                    />
                </div>

                <Button 
                    variant="orangeOutline" 
                    className="mt-4 w-full"
                    onClick={() => setIsWeeklyCheckInOpen(true)}
                >
                    Log New Measurements
                </Button>
            </Card>

            {/* Detailed Weekly Measurements Tracking */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold flex items-center">
                    <ChartBarIcon size={20} className="mr-2 text-[#FF6B00]" />
                    Detailed Measurements
                </h2>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left column - Chart selection */}
                    <div className="space-y-6">
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333]">
                            <h3 className="text-sm font-medium mb-3 flex items-center">
                                <ChartBarIcon size={16} className="mr-2 text-[#FF6B00]" />
                                Select Measurement to Track
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'weight', label: 'Weight', unit: 'kg', icon: '⚖️' },
                                    { id: 'bodyFat', label: 'Body Fat', unit: '%', icon: '💧' },
                                    { id: 'chest', label: 'Chest', unit: 'cm', icon: '💪' },
                                    { id: 'waist', label: 'Waist', unit: 'cm', icon: '👖' },
                                    { id: 'hips', label: 'Hips', unit: 'cm', icon: '🔄' },
                                    { id: 'thighs', label: 'Thighs', unit: 'cm', icon: '🦵' },
                                    { id: 'arms', label: 'Arms', unit: 'cm', icon: '💪' },
                                ].map(item => (
                                    <button 
                                        key={item.id}
                                        className={`p-3 rounded-lg border text-left text-sm transition-all duration-300 ${
                                            selectedMeasurement === item.id
                                                ? 'bg-[rgba(255,107,0,0.1)] border-[#FF6B00] text-white shadow-md' 
                                                : 'bg-[#222] border-[#333] text-gray-300 hover:bg-[#2a2a2a]'
                                        }`}
                                        onClick={() => setSelectedMeasurement(item.id)}
                                    >
                                        <div className="flex items-center mb-1">
                                            <span className="mr-2 text-base">{item.icon}</span>
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-gray-400">Last:</div>
                                            <div className={`text-xs font-medium ${selectedMeasurement === item.id ? 'text-[#FF6B00]' : 'text-white'}`}>
                                                {
                                                    measurementsHistory[0][item.id] !== undefined 
                                                        ? `${measurementsHistory[0][item.id]} ${item.unit}`
                                                        : 'N/A'
                                                }
                                            </div>
                                        </div>
                                        {selectedMeasurement === item.id && (
                                            <div className="mt-1 w-full h-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Selected measurement chart */}
                        <WeeklyProgressChart 
                            data={measurementsHistory}
                            measurement={selectedMeasurement}
                            unit={[
                                { id: 'weight', unit: 'kg' },
                                { id: 'bodyFat', unit: '%' },
                                { id: 'chest', unit: 'cm' },
                                { id: 'waist', unit: 'cm' },
                                { id: 'hips', unit: 'cm' },
                                { id: 'thighs', unit: 'cm' },
                                { id: 'arms', unit: 'cm' },
                            ].find(item => item.id === selectedMeasurement)?.unit || 'cm'}
                            title={`${selectedMeasurement.charAt(0).toUpperCase() + selectedMeasurement.slice(1)} Measurement`}
                        />
                    </div>
                    
                    {/* Right column - Body measurements visual */}
                    <BodyMeasurementsVisual 
                        measurements={currentMeasurements}
                        previousMeasurements={previousMeasurements}
                        highlightedMeasurement={selectedMeasurement}
                    />
                </div>
                
                <div className="mt-6 text-center">
                    <Button 
                        variant="orangeFilled" 
                        onClick={() => setIsWeeklyCheckInOpen(true)}
                    >
                        Update Measurements
                    </Button>
                </div>
            </Card>

            {/* Progress Photos Section */}
            <Card variant="dark" width="100%" maxWidth="none">
                <h2 className="mb-4 text-xl font-bold flex items-center">
                    <ChartBarIcon size={20} className="mr-2 text-[#FF6B00]" />
                    Progress Photos
                </h2>

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

            {/* Weekly Check-in Modal */}
            <Modal
                isOpen={isWeeklyCheckInOpen}
                onClose={() => setIsWeeklyCheckInOpen(false)}
                title="Weekly Progress Check-in"
                size="large"
                primaryButtonText="Save Check-in"
                primaryButtonAction={handleWeeklyCheckInSubmit}
                secondaryButtonText="Cancel"
                secondaryButtonAction={() => setIsWeeklyCheckInOpen(false)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column - Measurements */}
                    <div>
                        <h3 className="font-medium mb-4 text-lg">Body Measurements</h3>
                        
                        <div className="space-y-4">
                            <FormField
                                label="Date"
                                type="date"
                                name="date"
                                value={weeklyCheckInData.date}
                                onChange={handleWeeklyCheckInChange}
                                required
                            />
                            
                            <FormField
                                label="Weight (kg)"
                                type="number"
                                name="weight"
                                value={weeklyCheckInData.weight}
                                onChange={handleWeeklyCheckInChange}
                                placeholder={userData.stats.weight.toString()}
                                step="0.1"
                                min="40"
                                max="200"
                            />
                            
                            <FormField
                                label="Body Fat (%)"
                                type="number"
                                name="bodyFat"
                                value={weeklyCheckInData.bodyFat}
                                onChange={handleWeeklyCheckInChange}
                                placeholder={userData.stats.bodyFat.toString()}
                                step="0.1"
                                min="3"
                                max="50"
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    label="Chest (cm)"
                                    type="number"
                                    name="chest"
                                    value={weeklyCheckInData.chest}
                                    onChange={handleWeeklyCheckInChange}
                                    step="0.5"
                                />
                                
                                <FormField
                                    label="Waist (cm)"
                                    type="number"
                                    name="waist"
                                    value={weeklyCheckInData.waist}
                                    onChange={handleWeeklyCheckInChange}
                                    step="0.5"
                                />
                                
                                <FormField
                                    label="Hips (cm)"
                                    type="number"
                                    name="hips"
                                    value={weeklyCheckInData.hips}
                                    onChange={handleWeeklyCheckInChange}
                                    step="0.5"
                                />
                                
                                <FormField
                                    label="Thighs (cm)"
                                    type="number"
                                    name="thighs"
                                    value={weeklyCheckInData.thighs}
                                    onChange={handleWeeklyCheckInChange}
                                    step="0.5"
                                />
                                
                                <FormField
                                    label="Arms (cm)"
                                    type="number"
                                    name="arms"
                                    value={weeklyCheckInData.arms}
                                    onChange={handleWeeklyCheckInChange}
                                    step="0.5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Right column - Photos and notes */}
                    <div>
                        <h3 className="font-medium mb-4 text-lg">Progress Photo & Notes</h3>
                        
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#333] mb-4">
                            <p className="text-sm text-gray-400 mb-3">
                                Upload a photo to track your visual progress. Try to use consistent lighting and poses.
                            </p>
                            
                            {weeklyCheckInData.photo ? (
                                <div className="relative aspect-square w-full mb-3 bg-[#111] rounded-lg overflow-hidden">
                                    <Image
                                        src={weeklyCheckInData.photo.preview}
                                        alt="Progress photo preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        className="absolute top-2 right-2 bg-[#000] bg-opacity-70 rounded-full p-1"
                                        onClick={() => setWeeklyCheckInData(prev => ({ ...prev, photo: null }))}
                                    >
                                        <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                                            <path d="M10 8.586l4.293-4.293 1.414 1.414L11.414 10l4.293 4.293-1.414 1.414L10 11.414l-4.293 4.293-1.414-1.414L8.586 10 4.293 5.707l1.414-1.414L10 8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <label className="block text-center p-6 border-2 border-dashed border-[#333] rounded-lg cursor-pointer mb-3 hover:border-[#555] transition-colors">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <span className="mt-2 block text-sm font-medium text-gray-400">Upload Progress Photo</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleWeeklyCheckInPhotoUpload}
                                    />
                                </label>
                            )}
                            
                            <FormField
                                label="Notes"
                                type="textarea"
                                name="notes"
                                value={weeklyCheckInData.notes}
                                onChange={handleWeeklyCheckInChange}
                                placeholder="How are you feeling? Any changes you've noticed?"
                                rows={5}
                            />
                        </div>
                        
                        <div className="bg-[rgba(255,107,0,0.1)] rounded-lg p-4 border border-[#FF6B00]/20">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-[#FF6B00]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"></path>
                                </svg>
                                Why weekly check-ins matter
                            </h4>
                            <p className="text-xs text-gray-300">
                                Consistent tracking helps you stay accountable and allows your coach to make necessary adjustments 
                                to your program. Remember, progress isn't always linear - it's normal to have ups and downs.
                            </p>
                        </div>
                    </div>
                </div>
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
