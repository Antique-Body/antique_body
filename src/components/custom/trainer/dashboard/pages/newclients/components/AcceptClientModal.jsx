import { Icon } from "@iconify/react";
import Image from "next/image";

import { Modal } from "@/components/common/Modal";

/**
 * AcceptClientModal component that shows when accepting a client request
 */
export const AcceptClientModal = ({ isOpen, onClose, client, onAccept }) => {
    if (!client) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Accept Client Request"
            message={
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent rounded-t-lg h-16"></div>
                        <div className="flex items-center gap-4 relative z-10 pt-4 px-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-[#222] shadow-lg">
                                <Image src={client.imageUrl} alt={client.name} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="text-base text-white font-medium mb-1">Accept {client.name}'s request?</div>
                                <div className="text-xs text-gray-400">
                                    You'll be able to message and schedule sessions with this client
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-[rgba(35,35,35,0.7)] p-4 border border-[#333]/40">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex-shrink-0 bg-[#FF6B00]/20 p-1.5 rounded-full">
                                <Icon icon="mdi:clipboard-text-outline" className="text-[#FF6B00]" width={16} height={16} />
                            </div>
                            <h4 className="text-sm font-semibold text-white/90">Client Details</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-[#222] p-2 rounded-lg">
                                <span className="text-xs text-gray-400">Plan</span>
                                <div className="font-medium text-white">{client.plan}</div>
                            </div>
                            <div className="bg-[#222] p-2 rounded-lg">
                                <span className="text-xs text-gray-400">Location</span>
                                <div className="font-medium text-white">{client.location}</div>
                            </div>
                            <div className="bg-[#222] p-2 rounded-lg">
                                <span className="text-xs text-gray-400">Preference</span>
                                <div className="font-medium text-white">{client.preference}</div>
                            </div>
                            <div className="bg-[#222] p-2 rounded-lg">
                                <span className="text-xs text-gray-400">Physical Stats</span>
                                <div className="font-medium text-white">
                                    {client.height} / {client.weight}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 bg-[#222] p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Icon icon="mdi:target" className="text-[#FF6B00]" width={14} height={14} />
                                <span className="text-xs text-gray-400">Goals</span>
                            </div>
                            <div className="font-medium text-white text-sm">{client.goals}</div>
                        </div>

                        {client.notes && (
                            <div className="mt-2 bg-[#222] p-3 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon icon="mdi:note-text-outline" className="text-blue-400" width={14} height={14} />
                                    <span className="text-xs text-gray-400">Notes</span>
                                </div>
                                <div className="italic text-white/80 text-sm">{client.notes}</div>
                            </div>
                        )}
                    </div>

                    <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        <div className="flex items-start gap-2">
                            <Icon
                                icon="mdi:check-circle"
                                className="text-green-400 flex-shrink-0 mt-0.5"
                                width={16}
                                height={16}
                            />
                            <div className="text-xs text-gray-300">
                                By accepting this client, they'll be added to your client list and you can start creating
                                workouts and tracking their progress.
                            </div>
                        </div>
                    </div>
                </div>
            }
            size="medium"
            primaryButtonText="Accept Client"
            secondaryButtonText="Cancel"
            primaryButtonAction={onAccept}
            secondaryButtonAction={onClose}
            footerBorder={true}
        />
    );
};

export default AcceptClientModal;
