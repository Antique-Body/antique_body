"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField } from "@/components/common/FormField";
import { Modal } from "@/components/common/Modal";
import { Card } from "@/components/custom/Card";
import { Button } from "@/omponents/common/Button";

const NewClientsPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedProfileClient, setSelectedProfileClient] = useState(null);
    const [acceptedClients, setAcceptedClients] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState("");
    const [clientEmail, setClientEmail] = useState("");

    // Mock trainer name - in real app this would come from user profile

    // Generate a unique invite link with trainer's name
    const generateInviteLink = () => {
        const uniqueId = Math.random().toString(36).substring(2, 15);
        const formattedName = session?.user?.name?.toLowerCase().replace(/\s+/g, '-') || 'trainer';
        const link = `${window.location.origin}/join/${formattedName}/${uniqueId}`;
        setInviteLink(link);
        return link;
    };

    // Sample data for demo purposes
    const newClients = [
        {
            id: 1,
            name: "Emma Roberts",
            requestDate: "Apr 8, 2025",
            goals: "Build muscle, improve conditioning",
            notes: "Looking for 2 sessions per week",
            plan: "Pro Athlete",
            location: "New York, NY",
            preference: "In-person training",
            weight: "145 lbs",
            height: "5'7\"",
            age: "28",
            gender: "Female",
            fitnessLevel: "Intermediate",
            bio: "Former college athlete looking to get back in shape. I enjoy challenging workouts and am committed to achieving my fitness goals.",
            dietaryPreferences: ["High Protein", "Gluten-Free"],
            healthConditions: ["None"],
            injuries: ["Recovered from ACL surgery 2 years ago"],
            trainingFrequency: "3-4 times per week",
            availableEquipment: ["Full Gym Access"],
            preferredTrainingTime: ["Early Morning (5-8 AM)", "Evening (5-8 PM)"],
            motivationLevel: "Highly self-motivated",
            contactEmail: "emma.roberts@email.com",
            contactPhone: "+1 (555) 123-4567",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSVbl2vBA5nMPrRs9_o9unOyKuPjwjD8UPw&s"
        },
        {
            id: 2,
            name: "David Wang",
            requestDate: "Apr 7, 2025",
            goals: "Weight loss, general fitness",
            notes: "Needs flexible scheduling",
            plan: "Fat Loss",
            location: "Boston, MA",
            preference: "Virtual sessions",
            weight: "210 lbs",
            height: "5'9\"",
            age: "35",
            gender: "Male",
            fitnessLevel: "Beginner",
            bio: "Office worker looking to improve overall health and fitness. Prefers virtual training sessions.",
            dietaryPreferences: ["No Special Diet"],
            healthConditions: ["None"],
            injuries: ["None"],
            trainingFrequency: "1-2 times per week",
            availableEquipment: ["No Equipment"],
            preferredTrainingTime: ["Evening (5-8 PM)"],
            motivationLevel: "Moderately self-motivated",
            contactEmail: "david.wang@email.com",
            contactPhone: "+1 (555) 234-5678",
            imageUrl: "https://cdn.muscleandstrength.com/sites/default/files/field/feature-wide-image/workout/john-cena-workout-wide.jpg"
        },
        {
            id: 3,
            name: "Aisha Johnson",
            requestDate: "Apr 5, 2025",
            goals: "Rehab for knee injury",
            notes: "Previously worked with physical therapist",
            plan: "Recovery",
            location: "Chicago, IL",
            preference: "Hybrid training",
            weight: "132 lbs",
            height: "5'4\"",
            age: "26",
            gender: "Female",
            fitnessLevel: "Intermediate",
            bio: "Former runner recovering from knee injury. Looking to rebuild strength and return to running.",
            dietaryPreferences: ["Vegetarian"],
            healthConditions: ["None"],
            injuries: ["Knee injury"],
            trainingFrequency: "3-4 times per week",
            availableEquipment: ["Basic Home Equipment"],
            preferredTrainingTime: ["Morning (8-11 AM)"],
            motivationLevel: "Highly self-motivated",
            contactEmail: "aisha.johnson@email.com",
            contactPhone: "+1 (555) 345-6789",
            imageUrl: "https://static.wikia.nocookie.net/p__/images/a/a2/AishaCobraKai.webp/revision/latest?cb=20240516210408&path-prefix=protagonist"
        },
    ];

    // Filter new clients based on search
    const filteredClients = newClients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.goals.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMessageClick = () => {
        router.push('/trainer/dashboard/messages');
    };

    const handleInviteClick = () => {
        setIsInviteModalOpen(true);
    };

    const handleAcceptClick = (client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleAcceptConfirm = () => {
        // Add client to accepted clients list
        setAcceptedClients([...acceptedClients, selectedClient.id]);
        
        // Show confirmation message
        setShowConfirmation(true);
        
        // Close modal immediately
        setIsModalOpen(false);
        
        // Hide confirmation after 3 seconds
        setTimeout(() => {
            setShowConfirmation(false);
        }, 3000);
    };

    const handleImageClick = (client) => {
        setSelectedProfileClient(client);
        setIsProfileModalOpen(true);
    };

    return (
        <div className="px-4 py-6">
            {/* Confirmation Toast */}
            {showConfirmation && (
                <div className="fixed top-4 right-4 z-50 animate-slideIn">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Client successfully accepted!</span>
                    </div>
                </div>
            )}

            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">New Client Requests</h2>
                <div className="flex items-center gap-4">
                    <FormField
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-0 w-full max-w-xs"
                        backgroundStyle="semi-transparent"
                    />
                    <Button
                        variant="orangeFilled"
                        size="default"
                        className="flex w-[240px] h-[44px] items-center justify-center gap-3 py-0 whitespace-nowrap"
                        onClick={handleInviteClick}
                        leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        }
                    >
                        <span className="tracking-wide font-medium leading-none whitespace-nowrap">Invite New Client</span>
                    </Button>
                </div>
            </div>

            <div className="space-y-5">
                {filteredClients.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-gray-400">No new client requests</p>
                    </div>
                ) : (
                    filteredClients.map((client) => (
                        <Card key={client.id} variant="entityCard" width="100%" maxWidth="100%" className="overflow-hidden">
                            <div className="flex-1">
                                <div className="-mx-5 -mt-5 mb-4 flex items-center justify-between border-b border-[#333] bg-[rgba(30,30,30,0.9)] px-5 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleImageClick(client)}>
                                            <Image
                                                src={client.imageUrl}
                                                alt={client.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-[#FF6B00]">
                                                {client.name}
                                            </h3>
                                            <p className="text-xs text-gray-400">Requested: {client.requestDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="subtle"
                                            size="small"
                                            onClick={handleMessageClick}
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5"
                                        >
                                            Message
                                        </Button>
                                        {acceptedClients.includes(client.id) ? (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm font-medium">Accepted</span>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="orangeFilled"
                                                size="small"
                                                onClick={() => handleAcceptClick(client)}
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
                                            >
                                                Accept
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Primary info section */}
                                <div className="mb-4 border-b border-[#333] pb-4">
                                    <h4 className="mb-2 text-sm font-semibold text-white/90">Training Goals</h4>
                                    <p className="rounded bg-[rgba(40,40,40,0.7)] px-3 py-2 text-sm">{client.goals}</p>
                                </div>

                                {/* Client details in grid */}
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Preferred Plan</h4>
                                        <p className="text-sm font-medium">{client.plan}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Location</h4>
                                        <p className="text-sm font-medium">{client.location}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Training Preference</h4>
                                        <p className="text-sm font-medium">{client.preference}</p>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-xs text-white/60">Physical Stats</h4>
                                        <p className="text-sm font-medium">
                                            {client.height} / {client.weight}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes section */}
                                <div className="mt-4 border-t border-[#333] pt-4">
                                    <h4 className="mb-1 text-xs text-white/60">Additional Notes</h4>
                                    <p className="text-sm italic text-white/80">{client.notes}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAcceptConfirm}
                title="Accept Client Request"
                message={
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full">
                                {selectedClient && (
                                    <Image
                                        src={selectedClient.imageUrl}
                                        alt={selectedClient.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="text-base text-gray-300">
                                Are you sure you want to accept {selectedClient?.name}'s training request?
                            </div>
                        </div>
                        <div className="rounded-lg bg-[rgba(40,40,40,0.7)] p-4">
                            <h4 className="mb-2 text-sm font-semibold text-white/90">Client Details</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-400">Plan:</span>
                                    <div className="font-medium text-white">{selectedClient?.plan}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Location:</span>
                                    <div className="font-medium text-white">{selectedClient?.location}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Preference:</span>
                                    <div className="font-medium text-white">{selectedClient?.preference}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Physical Stats:</span>
                                    <div className="font-medium text-white">
                                        {selectedClient?.height} / {selectedClient?.weight}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="text-gray-400">Goals:</span>
                                <div className="mt-1 font-medium text-white">{selectedClient?.goals}</div>
                            </div>
                            {selectedClient?.notes && (
                                <div className="mt-3">
                                    <span className="text-gray-400">Notes:</span>
                                    <div className="mt-1 italic text-white/80">{selectedClient?.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                }
                confirmButtonText="Accept Client"
                cancelButtonText="Cancel"
                size="large"
                primaryButtonText="Accept Client"
                secondaryButtonText="Cancel"
                primaryButtonAction={handleAcceptConfirm}
                secondaryButtonAction={() => setIsModalOpen(false)}
                footerBorder={true}
            />

            {/* Add Profile Modal */}
            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title={`${selectedProfileClient?.name}'s Profile`}
                message={
                    selectedProfileClient && (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center">
                                <div className="relative h-32 w-32 overflow-hidden rounded-full mb-4">
                                    <Image
                                        src={selectedProfileClient.imageUrl}
                                        alt={selectedProfileClient.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold mb-1">{selectedProfileClient.name}</div>
                                    <div className="text-gray-400">Requested: {selectedProfileClient.requestDate}</div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Basic Information</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Age:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.age}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Gender:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.gender}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Fitness Level:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.fitnessLevel}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Motivation Level:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.motivationLevel}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Stats */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Physical Stats</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Height:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.height}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Weight:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.weight}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Training Goals */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Training Goals</div>
                                    <div className="text-white/90">{selectedProfileClient.goals}</div>
                                </div>

                                {/* Training Preferences */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Training Preferences</div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Frequency:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.trainingFrequency || "Not specified"}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Preference:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.preference || "Not specified"}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Preferred Times:</span>
                                            <div className="font-medium text-white">
                                                {(selectedProfileClient.preferredTrainingTime || []).join(", ") || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Available Equipment:</span>
                                            <div className="font-medium text-white">
                                                {(selectedProfileClient.availableEquipment || []).join(", ") || "Not specified"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Health & Dietary Info */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Health & Dietary Information</div>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-400">Dietary Preferences:</span>
                                            <div className="font-medium text-white">
                                                {(selectedProfileClient.dietaryPreferences || []).join(", ") || "Not specified"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Health Conditions:</span>
                                            <div className="font-medium text-white">
                                                {(selectedProfileClient.healthConditions || []).join(", ") || "None"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Injuries:</span>
                                            <div className="font-medium text-white">
                                                {(selectedProfileClient.injuries || []).join(", ") || "None"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio & Contact */}
                                <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                    <div className="text-lg font-semibold mb-3">Bio & Contact</div>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-gray-400">Bio:</span>
                                            <div className="font-medium text-white mt-1">{selectedProfileClient.bio}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Contact Email:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.contactEmail}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Contact Phone:</span>
                                            <div className="font-medium text-white">{selectedProfileClient.contactPhone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                size="large"
                primaryButtonText="Accept Client"
                secondaryButtonText="Close"
                primaryButtonAction={() => {
                    setSelectedClient(selectedProfileClient);
                    setIsProfileModalOpen(false);
                    setIsModalOpen(true);
                }}
                secondaryButtonAction={() => setIsProfileModalOpen(false)}
                footerBorder={true}
            />

            {/* Add Invite Modal */}
            <Modal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                title="Invite New Client"
                message={
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Grow Your Training Business</h3>
                            <p className="text-gray-400">Invite potential clients to join your training program and help them achieve their fitness goals.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                <h4 className="text-sm font-semibold mb-3 text-white/90">Invite via Email</h4>
                                <FormField
                                    type="email"
                                    placeholder="Enter client's email address"
                                    value={clientEmail}
                                    onChange={(e) => setClientEmail(e.target.value)}
                                    className="w-full mb-3"
                                    backgroundStyle="semi-transparent"
                                />
                                <Button
                                    variant="orangeFilled"
                                    size="small"
                                    onClick={() => {
                                        // Here you would typically handle the email invitation
                                        setIsInviteModalOpen(false);
                                        setShowConfirmation(true);
                                        setTimeout(() => {
                                            setShowConfirmation(false);
                                        }, 3000);
                                    }}
                                    className="w-full"
                                >
                                    Send Email Invitation
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#1a1a1a] text-gray-400">or share this link</span>
                                </div>
                            </div>

                            <div className="bg-[rgba(40,40,40,0.7)] p-4 rounded-lg">
                                <h4 className="text-sm font-semibold mb-3 text-white/90">Share Invitation Link</h4>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[rgba(30,30,30,0.7)] rounded-lg p-3 text-sm text-gray-300 break-all">
                                        {inviteLink || `Click generate to create your personalized invitation link as ${session?.user?.name || 'trainer'}`}
                                    </div>
                                    <Button
                                        variant="subtle"
                                        size="small"
                                        onClick={() => {
                                            const link = generateInviteLink();
                                            navigator.clipboard.writeText(link);
                                            setShowConfirmation(true);
                                            setTimeout(() => {
                                                setShowConfirmation(false);
                                            }, 3000);
                                        }}
                                        className="whitespace-nowrap group hover:bg-orange-500/10 transition-colors duration-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={inviteLink ? "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                                            </svg>
                                            <span>{inviteLink ? "Copy Link" : "Generate Link"}</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-orange-500/10 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-semibold text-orange-500 mb-1">Pro Tip</h4>
                                        <p className="text-sm text-gray-400">Share your unique invitation link on social media or directly with potential clients. The link will expire in 7 days.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                size="large"
                primaryButtonText="Close"
                secondaryButtonText=""
                primaryButtonAction={() => setIsInviteModalOpen(false)}
                secondaryButtonAction={() => {}}
                footerBorder={true}
            />
        </div>
    );
};

export default NewClientsPage;
