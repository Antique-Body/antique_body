"use client";
import { FrequencySelector, InjuryLocationSelector, MeasurementsInput, SelectionCard } from "@components/custom";
import { Icon } from "@iconify/react";
import { useCallback, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { stepConfig } from "@/app/utils/stepConfig";
import { Card } from "@/components/custom";

const SettingsDashboard = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState("training");
    const [notificationSettings, setNotificationSettings] = useState({
        workoutReminders: false,
        progressUpdates: false,
        nutritionReminders: false,
        communityUpdates: false,
        weeklyReport: false,
        newFeatures: false,
    });
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: false,
        activitySharing: false,
        locationServices: false,
    });
    const [appearanceSettings, setAppearanceSettings] = useState({
        darkMode: true,
        animations: false,
    });
    const [deviceSettings, setDeviceSettings] = useState({
        autoSync: false,
        backgroundSync: false,
    });

    // Training setup state
    const [trainingSettings, setTrainingSettings] = useState({
        hasInjury: "no",
        injuryLocations: [],
        wantsRehabilitation: null,
        environment: null,
        equipment: null,
        experience: null,
        goal: null,
        frequency: null,
        measurements: null,
    });

    const handleTrainingOptionSelect = useCallback((field, value) => {
        setTrainingSettings((prev) => {
            const newSettings = { ...prev, [field]: value };

            // Reset related fields when changing injury status
            if (field === "hasInjury" && value === "no") {
                newSettings.injuryLocations = [];
                newSettings.wantsRehabilitation = null;
            }

            return newSettings;
        });
    }, []);

    const handleInjuryLocations = useCallback((locations) => {
        setTrainingSettings((prev) => ({
            ...prev,
            injuryLocations: locations,
        }));
    }, []);

    const handleFrequencySelect = useCallback((value) => {
        setTrainingSettings((prev) => ({
            ...prev,
            frequency: value,
        }));
    }, []);

    const handleMeasurementsSelect = useCallback((value) => {
        setTrainingSettings((prev) => ({
            ...prev,
            measurements: value,
        }));
    }, []);

    // Map of Material Symbols icons for different training options
    const trainingIcons = useMemo(
        () => ({
            hasInjury: {
                no: "mdi:run-fast",
                past: "mdi:history",
                current: "mdi:medical-bag",
                chronic: "mdi:alert-circle-outline",
            },
            environment: {
                gym: "mdi:dumbbell",
                outside: "mdi:tree",
            },
            equipment: {
                with_equipment: "mdi:weight-lifter",
                no_equipment: "mdi:meditation",
            },
            experience: {
                beginner: "mdi:sprout",
                intermediate: "mdi:refresh",
                advanced: "mdi:arm-flex",
                expert: "mdi:trophy",
            },
            goal: {
                strength: "mdi:weight",
                muscle: "mdi:human-handsup",
                lose_weight: "mdi:fire",
                endurance: "mdi:run-fast",
            },
            wantsRehabilitation: {
                yes: "mdi:brain",
                no: "mdi:arm-flex",
            },
        }),
        []
    );

    const renderTrainingStepContent = useCallback(
        (step) => {
            if (step.isFrequencyStep) {
                return <FrequencySelector selectedFrequency={trainingSettings.frequency} onSelect={handleFrequencySelect} />;
            }

            if (step.isMeasurementsStep) {
                return <MeasurementsInput onSelect={handleMeasurementsSelect} />;
            }

            if (step.isInjuryLocationStep) {
                return (
                    <div className="flex w-full justify-center">
                        <div className="w-[52%]">
                            <InjuryLocationSelector
                                selectedLocations={trainingSettings.injuryLocations}
                                onSelect={handleInjuryLocations}
                            />
                        </div>
                    </div>
                );
            }

            if (!step.options) {
                return null;
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.options.map((option) => {
                        const isSelected = trainingSettings[step.field] === option.value;
                        const iconName =
                            trainingIcons[step.field]?.[option.value] || option.icon || "material-symbols:help-outline";

                        return (
                            <SelectionCard
                                key={option.value}
                                selected={isSelected}
                                onClick={() => handleTrainingOptionSelect(step.field, option.value)}
                                iconName={iconName}
                                title={option.title}
                                description={option.description}
                                accentColor="#FF6B00"
                                animateSelection={true}
                                cardStyle="premium"
                                iconBackground={true}
                                iconSize="24"
                                className="!p-3 !min-h-0"
                                aspect="aspect-auto"
                            />
                        );
                    })}
                </div>
            );
        },
        [
            trainingSettings,
            handleTrainingOptionSelect,
            handleInjuryLocations,
            handleFrequencySelect,
            handleMeasurementsSelect,
            trainingIcons,
        ]
    );

    // Only render steps that should be shown based on current selections
    const shouldShowStep = useCallback(
        (step) => {
            if (step.dependsOn) {
                const { field, values } = step.dependsOn;
                return values.includes(trainingSettings[field]);
            }
            return true;
        },
        [trainingSettings]
    );

    return (
        <div className="w-full">
            {/* Settings Navigation */}
            <div className="mb-8">
                <div className="border-b border-[#333] flex overflow-x-auto">
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "training" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("training")}
                    >
                        Training
                    </button>
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "profile" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("profile")}
                    >
                        Profile
                    </button>
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "notifications" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("notifications")}
                    >
                        Notifications
                    </button>
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "appearance" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("appearance")}
                    >
                        Appearance
                    </button>
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "devices" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("devices")}
                    >
                        Devices
                    </button>
                    <button
                        className={`px-6 py-3 whitespace-nowrap font-medium text-sm transition-colors ${activeSection === "privacy" ? "text-[#FF6B00] border-b-2 border-[#FF6B00]" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveSection("privacy")}
                    >
                        Privacy
                    </button>
                </div>
            </div>

            {/* Settings Content */}
            <div className="space-y-6">
                {activeSection === "training" && (
                    <div className="space-y-6">
                        {stepConfig.map(
                            (step) =>
                                shouldShowStep(step) && (
                                    <Card key={step.stepNumber} variant="darkStrong" className="overflow-hidden">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-[#FF6B00] bg-opacity-10 flex items-center justify-center">
                                                <Icon
                                                    icon={step.icon || "material-symbols:help-outline"}
                                                    width="24"
                                                    height="24"
                                                    className="text-[#FF6B00]"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold">{t(step.title)}</h3>
                                        </div>
                                        {renderTrainingStepContent(step)}
                                    </Card>
                                )
                        )}
                    </div>
                )}

                {activeSection === "profile" && (
                    <div className="space-y-6">
                        <Card variant="darkStrong">
                            <h3 className="text-xl font-bold mb-6">Personal Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-24 h-24 rounded-full bg-[#222] flex items-center justify-center overflow-hidden">
                                        <Icon
                                            icon="material-symbols:account-circle-outline"
                                            width="48"
                                            height="48"
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <button className="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-sm transition-colors">
                                        Change Photo
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Username</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
                                        placeholder="Choose a username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {activeSection === "notifications" && (
                    <div className="space-y-6">
                        <Card variant="darkStrong">
                            <h3 className="text-xl font-bold mb-6">Push Notifications</h3>
                            <div className="space-y-4">
                                {Object.entries({
                                    workoutReminders: {
                                        icon: "material-symbols:notifications-active-outline",
                                        description: "Get notified about scheduled workouts",
                                    },
                                    progressUpdates: {
                                        icon: "material-symbols:trending-up-outline",
                                        description: "Weekly progress and achievement notifications",
                                    },
                                    nutritionReminders: {
                                        icon: "material-symbols:restaurant-outline",
                                        description: "Meal tracking and water intake reminders",
                                    },
                                    communityUpdates: {
                                        icon: "material-symbols:groups-outline",
                                        description: "News and updates from your fitness community",
                                    },
                                }).map(([key, { icon, description }]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
                                                <Icon icon={icon} width="20" height="20" className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                </h4>
                                                <p className="text-sm text-gray-400">{description}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notificationSettings[key]}
                                                onChange={(e) =>
                                                    setNotificationSettings((prev) => ({
                                                        ...prev,
                                                        [key]: e.target.checked,
                                                    }))
                                                }
                                            />
                                            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeSection === "appearance" && (
                    <div className="space-y-6">
                        <Card variant="darkStrong">
                            <h3 className="text-xl font-bold mb-6">Theme Settings</h3>
                            <div className="space-y-4">
                                {Object.entries({
                                    darkMode: {
                                        icon: "material-symbols:dark-mode-outline",
                                        description: "Use dark theme throughout the app",
                                    },
                                    animations: {
                                        icon: "material-symbols:animation-outline",
                                        description: "Enable smooth transitions and animations",
                                    },
                                }).map(([key, { icon, description }]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
                                                <Icon icon={icon} width="20" height="20" className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                </h4>
                                                <p className="text-sm text-gray-400">{description}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={appearanceSettings[key]}
                                                onChange={(e) =>
                                                    setAppearanceSettings((prev) => ({
                                                        ...prev,
                                                        [key]: e.target.checked,
                                                    }))
                                                }
                                            />
                                            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeSection === "devices" && (
                    <div className="space-y-6">
                        <Card variant="darkStrong">
                            <h3 className="text-xl font-bold mb-6">Device Settings</h3>
                            <div className="space-y-4">
                                {Object.entries({
                                    autoSync: {
                                        icon: "material-symbols:sync-outline",
                                        description: "Automatically sync data from devices",
                                    },
                                    backgroundSync: {
                                        icon: "material-symbols:sync-saved-locally-outline",
                                        description: "Sync data when app is in background",
                                    },
                                }).map(([key, { icon, description }]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
                                                <Icon icon={icon} width="20" height="20" className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                </h4>
                                                <p className="text-sm text-gray-400">{description}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={deviceSettings[key]}
                                                onChange={(e) =>
                                                    setDeviceSettings((prev) => ({
                                                        ...prev,
                                                        [key]: e.target.checked,
                                                    }))
                                                }
                                            />
                                            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {activeSection === "privacy" && (
                    <div className="space-y-6">
                        <Card variant="darkStrong">
                            <h3 className="text-xl font-bold mb-6">Privacy Settings</h3>
                            <div className="space-y-4">
                                {Object.entries({
                                    profileVisibility: {
                                        icon: "material-symbols:visibility-outline",
                                        description: "Make your profile visible to others",
                                    },
                                    activitySharing: {
                                        icon: "material-symbols:share-outline",
                                        description: "Share your workout activities",
                                    },
                                    locationServices: {
                                        icon: "material-symbols:location-on-outline",
                                        description: "Allow access to your location",
                                    },
                                }).map(([key, { icon, description }]) => (
                                    <div key={key} className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center">
                                                <Icon icon={icon} width="20" height="20" className="text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">
                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                                </h4>
                                                <p className="text-sm text-gray-400">{description}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={privacySettings[key]}
                                                onChange={(e) =>
                                                    setPrivacySettings((prev) => ({
                                                        ...prev,
                                                        [key]: e.target.checked,
                                                    }))
                                                }
                                            />
                                            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsDashboard;
