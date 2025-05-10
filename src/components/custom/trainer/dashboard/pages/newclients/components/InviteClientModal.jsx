import { Icon } from "@iconify/react";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";

/**
 * InviteClientModal component for inviting new clients
 */
export const InviteClientModal = ({ isOpen, onClose, userName, onInviteSuccess }) => {
    const [inviteLink, setInviteLink] = useState("");
    const [clientEmail, setClientEmail] = useState("");

    const generateInviteLink = () => {
        const uniqueId = Math.random().toString(36).substring(2, 15);
        const formattedName = userName?.toLowerCase().replace(/\s+/g, "-") || "trainer";
        const link = `${window.location.origin}/join/${formattedName}/${uniqueId}`;
        setInviteLink(link);
        return link;
    };

    const handleEmailInvite = () => {
        // Here you would typically handle the email invitation
        onClose();
        onInviteSuccess("Email invitation sent successfully!");
    };

    const handleGenerateLink = () => {
        const link = generateInviteLink();
        navigator.clipboard.writeText(link);
        onInviteSuccess("Invite link copied to clipboard!");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Invite New Client"
            message={
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 to-transparent rounded-t-lg h-16"></div>
                        <div className="relative z-10 text-center pt-12 pb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 mb-3">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Grow Your Training Business</h3>
                            <p className="text-sm text-gray-400">Invite potential clients to join your training program</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="bg-[rgba(35,35,35,0.7)] p-4 rounded-lg border border-[#333]/40">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex-shrink-0 bg-blue-500/20 p-1.5 rounded-full">
                                    <Icon icon="mdi:email-outline" className="text-blue-400" width={16} height={16} />
                                </div>
                                <h4 className="text-sm font-semibold text-white/90">Invite via Email</h4>
                            </div>

                            <FormField
                                type="email"
                                placeholder="Enter client's email address"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                className="w-full mb-3"
                                backgroundStyle="semi-transparent"
                            />

                            <button
                                onClick={handleEmailInvite}
                                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:from-[#FF8A00] hover:to-[#FF6B00] text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
                            >
                                <Icon icon="mdi:email-send-outline" width={18} height={18} />
                                <span>Send Email Invitation</span>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#1a1a1a] text-gray-400">or share this link</span>
                            </div>
                        </div>

                        <div className="bg-[rgba(35,35,35,0.7)] p-4 rounded-lg border border-[#333]/40">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex-shrink-0 bg-green-500/20 p-1.5 rounded-full">
                                    <Icon icon="mdi:link-variant" className="text-green-400" width={16} height={16} />
                                </div>
                                <h4 className="text-sm font-semibold text-white/90">Share Invitation Link</h4>
                            </div>

                            <div className="bg-[rgba(25,25,25,0.7)] rounded-lg p-3 border border-[#333]/30 mb-2">
                                <p className="text-sm text-gray-300 break-all line-clamp-2">
                                    {inviteLink ||
                                        `Click generate to create your personalized invitation link as ${userName || "trainer"}`}
                                </p>
                            </div>

                            <button
                                onClick={handleGenerateLink}
                                className={`w-full ${inviteLink ? "bg-[#333] hover:bg-[#444]" : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"} text-white rounded-lg py-2 font-medium transition-all duration-300 flex items-center justify-center gap-2`}
                            >
                                <svg
                                    className={`w-4 h-4 ${inviteLink ? "" : "animate-pulse"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={
                                            inviteLink
                                                ? "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        }
                                    />
                                </svg>
                                <span>{inviteLink ? "Copy Link" : "Generate Link"}</span>
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-[#FF6B00]/5 to-[#FF6B00]/10 p-3 rounded-lg border border-[#FF6B00]/10">
                            <div className="flex items-start gap-2">
                                <Icon
                                    icon="mdi:lightbulb-on-outline"
                                    className="text-[#FF6B00] flex-shrink-0 mt-0.5"
                                    width={16}
                                    height={16}
                                />
                                <div>
                                    <h4 className="text-xs font-semibold text-[#FF6B00] mb-1">Pro Tip</h4>
                                    <p className="text-xs text-gray-400">
                                        Share your unique invitation link on social media or directly with potential clients.
                                        The link will expire in 7 days.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            size="medium"
            primaryButtonText="Close"
            primaryButtonAction={onClose}
            footerBorder={true}
        />
    );
};

export default InviteClientModal;
