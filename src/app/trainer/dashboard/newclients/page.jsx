"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Import all the components
import {
    Header,
    StatsRow,
    EmptyState,
    ClientTableRow,
    AcceptClientModal,
    ClientProfileModal,
    InviteClientModal,
    ToastNotification,
} from "@/components/custom/trainer/dashboard/pages/newclients/components";

export default function NewClientsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedProfileClient, setSelectedProfileClient] = useState(null);
    const [acceptedClients, setAcceptedClients] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

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
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaSVbl2vBA5nMPrRs9_o9unOyKuPjwjD8UPw&s",
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
            imageUrl:
                "https://cdn.muscleandstrength.com/sites/default/files/field/feature-wide-image/workout/john-cena-workout-wide.jpg",
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
            imageUrl:
                "https://static.wikia.nocookie.net/p__/images/a/a2/AishaCobraKai.webp/revision/latest?cb=20240516210408&path-prefix=protagonist",
        },
    ];

    const handleMessageClick = () => {
        router.push("/trainer/dashboard/messages");
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

        // Show toast notification
        showToastNotification("Client successfully accepted!");

        // Close modal immediately
        setIsModalOpen(false);
    };

    const handleProfileClick = (client) => {
        setSelectedProfileClient(client);
        setIsProfileModalOpen(true);
    };

    const showToastNotification = (message, type = "success") => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);

        // Hide toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className="px-4 py-5">
            {/* Toast notification */}
            <ToastNotification show={showToast} message={toastMessage} type={toastType} />

            {/* Header section */}
            <div className="flex flex-col space-y-5 mb-6">
                <Header onInviteClick={handleInviteClick} />

                {/* Stats row */}
                <StatsRow
                    pendingCount={newClients.length - acceptedClients.length}
                    acceptedCount={acceptedClients.length}
                    weeklyCount={newClients.length}
                />
            </div>

            {/* Clients list */}
            {newClients.length === 0 ? (
                <EmptyState onInviteClick={handleInviteClick} />
            ) : (
                <div className="overflow-hidden rounded-xl border border-[#2a2a2a]/70 bg-[rgba(20,20,20,0.4)]">
                    {/* Table header - Hidden on mobile, visible on md and up */}
                    <div className="hidden md:grid md:grid-cols-12 border-b border-[#333]/50 bg-[rgba(25,25,25,0.8)] py-2.5 px-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                        <div className="md:col-span-3">Client</div>
                        <div className="md:col-span-2">Plan & Location</div>
                        <div className="md:col-span-4">Goals</div>
                        <div className="md:col-span-1">Stats</div>
                        <div className="md:col-span-2 text-right">Actions</div>
                    </div>

                    {/* Table rows */}
                    <div className="divide-y divide-[#333]/30">
                        {newClients.map((client) => (
                            <div
                                key={client.id}
                                className={`group cursor-pointer relative flex flex-col md:grid md:grid-cols-12 md:items-center gap-3 md:gap-4 px-4 py-3 hover:bg-[rgba(30,30,30,0.4)] transition-colors duration-150 ${acceptedClients.includes(client.id) ? "bg-green-500/5" : ""}`}
                                onClick={() => handleProfileClick(client)}
                            >
                                <ClientTableRow
                                    client={client}
                                    isAccepted={acceptedClients.includes(client.id)}
                                    onAcceptClick={() => handleAcceptClick(client)}
                                    // eslint-disable-next-line no-console
                                    onDeclineClick={() => console.log("Declined client:", client.name)}
                                    onMessageClick={handleMessageClick}
                                    _onRowClick={() => handleProfileClick(client)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination/load more section */}
                    <div className="flex justify-between items-center border-t border-[#333]/50 bg-[rgba(25,25,25,0.5)] px-4 py-2.5">
                        <div className="text-xs text-gray-400">
                            Showing {newClients.length} of {newClients.length} requests
                        </div>
                        <div className="text-xs">{/* No load more button needed for this sample */}</div>
                    </div>
                </div>
            )}

            {/* Accept Client Modal */}
            <AcceptClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                client={selectedClient}
                onAccept={handleAcceptConfirm}
            />

            {/* Client Profile Modal */}
            <ClientProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                client={selectedProfileClient}
                onAcceptClient={(client) => {
                    setSelectedClient(client);
                    setIsProfileModalOpen(false);
                    setIsModalOpen(true);
                }}
            />

            {/* Invite Client Modal */}
            <InviteClientModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                userName={session?.user?.name}
                onInviteSuccess={(message) => showToastNotification(message)}
            />
        </div>
    );
}
