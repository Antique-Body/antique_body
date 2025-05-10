import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";

/**
 * ClientProfileModal component that displays a detailed client profile
 */
export const ClientProfileModal = ({ isOpen, onClose, client, onAcceptClient }) => {
    if (!client) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${client.name}'s Profile`}
            message={
                <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent rounded-t-lg h-24"></div>
                        <div className="flex items-end pt-16 pb-4 px-4 relative z-10">
                            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-[#222] shadow-xl">
                                <Image src={client.imageUrl} alt={client.name} fill className="object-cover" />
                            </div>
                            <div className="ml-4">
                                <div className="text-xl font-bold">{client.name}</div>
                                <div className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Icon icon="mdi:calendar" width={14} height={14} />
                                    <span>Requested: {client.requestDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="grid grid-cols-4 gap-2 px-4">
                        <div className="bg-[#222] rounded-lg px-3 py-2 text-center">
                            <div className="text-xs text-gray-400">Age</div>
                            <div className="text-lg font-semibold text-white">{client.age}</div>
                        </div>
                        <div className="bg-[#222] rounded-lg px-3 py-2 text-center">
                            <div className="text-xs text-gray-400">Height</div>
                            <div className="text-lg font-semibold text-white">{client.height}</div>
                        </div>
                        <div className="bg-[#222] rounded-lg px-3 py-2 text-center">
                            <div className="text-xs text-gray-400">Weight</div>
                            <div className="text-lg font-semibold text-white">{client.weight}</div>
                        </div>
                        <div className="bg-[#222] rounded-lg px-3 py-2 text-center">
                            <div className="text-xs text-gray-400">Level</div>
                            <div className="text-lg font-semibold text-white">{client.fitnessLevel.split(" ")[0]}</div>
                        </div>
                    </div>

                    {/* Tabbed information */}
                    <div className="px-4 mt-2">
                        <div className="bg-gradient-to-r from-[#222] to-[#292929] p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-3 border-b border-[#333] pb-2">
                                <Icon icon="mdi:target" className="text-[#FF6B00]" width={18} height={18} />
                                <span className="font-medium text-white">Training Goals</span>
                            </div>
                            <p className="text-sm text-gray-300">{client.goals}</p>

                            {/* Bio section */}
                            <div className="mt-4 pt-4 border-t border-[#333]">
                                <div className="text-sm text-gray-300 bg-[#1a1a1a] rounded-lg p-3 italic">"{client.bio}"</div>
                            </div>
                        </div>
                    </div>

                    {/* Information sections */}
                    <div className="grid grid-cols-2 gap-3 px-4">
                        {/* Training Preferences */}
                        <div className="bg-[#222] p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-blue-500/20 p-1.5 rounded-full">
                                    <Icon icon="mdi:dumbbell" className="text-blue-400" width={14} height={14} />
                                </div>
                                <span className="text-sm font-medium">Training</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Frequency:</span>
                                    <span className="font-medium bg-[#333] px-2 py-0.5 rounded-full">
                                        {client.trainingFrequency || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Preference:</span>
                                    <span className="font-medium bg-[#333] px-2 py-0.5 rounded-full">
                                        {client.preference || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Motivation:</span>
                                    <span className="font-medium bg-[#333] px-2 py-0.5 rounded-full">
                                        {client.motivationLevel.split(" ")[0] || "Not specified"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Health Info */}
                        <div className="bg-[#222] p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-green-500/20 p-1.5 rounded-full">
                                    <Icon icon="mdi:heart-pulse" className="text-green-400" width={14} height={14} />
                                </div>
                                <span className="text-sm font-medium">Health</span>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Diet:</span>
                                    <div>
                                        {(client.dietaryPreferences || []).map((pref, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block font-medium bg-[#333] px-2 py-0.5 rounded-full mr-1 mb-1"
                                            >
                                                {pref}
                                            </span>
                                        ))}
                                        {(!client.dietaryPreferences || client.dietaryPreferences.length === 0) && (
                                            <span className="font-medium bg-[#333] px-2 py-0.5 rounded-full">None</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Injuries:</span>
                                    <div>
                                        {(client.injuries || []).map((injury, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block font-medium bg-[#333] px-2 py-0.5 rounded-full mr-1 mb-1"
                                            >
                                                {injury}
                                            </span>
                                        ))}
                                        {(!client.injuries || client.injuries.length === 0) && (
                                            <span className="font-medium bg-[#333] px-2 py-0.5 rounded-full">None</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time preferences and Equipment */}
                    <div className="px-4">
                        <div className="bg-[#222] p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="bg-purple-500/20 p-1.5 rounded-full">
                                    <Icon icon="mdi:clock-outline" className="text-purple-400" width={14} height={14} />
                                </div>
                                <span className="text-sm font-medium">Time & Equipment</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs text-gray-400">Preferred Times:</span>
                                    <div className="mt-1">
                                        {(client.preferredTrainingTime || []).map((time, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block text-xs font-medium bg-[#333] px-2 py-0.5 rounded-full mr-1 mb-1"
                                            >
                                                {time}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400">Available Equipment:</span>
                                    <div className="mt-1">
                                        {(client.availableEquipment || []).map((equip, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block text-xs font-medium bg-[#333] px-2 py-0.5 rounded-full mr-1 mb-1"
                                            >
                                                {equip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact information */}
                    <div className="px-4">
                        <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#333]/30 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="mdi:contact-mail-outline" className="text-[#FF6B00]" width={16} height={16} />
                                <span className="text-sm font-medium">Contact Information</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:email-outline" className="text-gray-400" width={14} height={14} />
                                    <span className="text-xs text-gray-200">{client.contactEmail}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:phone-outline" className="text-gray-400" width={14} height={14} />
                                    <span className="text-xs text-gray-200">{client.contactPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            size="large"
            primaryButtonText="Accept Client"
            secondaryButtonText="Close"
            primaryButtonAction={() => onAcceptClient(client)}
            secondaryButtonAction={onClose}
            footerBorder={true}
        />
    );
};

export default ClientProfileModal;
