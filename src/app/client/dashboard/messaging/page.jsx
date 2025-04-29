"use client";

import { Button } from "@/components/common/Button";
import { ChevronDownIcon, MessageIcon, PlusIcon, SendIcon } from "@/components/common/Icons";
import { ChatHistory, ConversationList } from "@/components/custom/client/dashboard/pages/messaging";
import { BackgroundShapes } from "@/components/custom/shared";
import { FormField } from "@/components/shared/FormField";

export default function MessagesPage() {
    // ... existing code ...

    return (
        <div className="bg-[#0a0a0a] min-h-screen relative text-white">
            {/* Background shapes */}
            <BackgroundShapes />

            <div className="container mx-auto px-4 pt-4 pb-10 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Messages</h1>
                    <Button variant="orangeFilled" leftIcon={<PlusIcon size={16} />}>
                        New Message
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations list */}
                    <div className="lg:col-span-1">
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl p-4 border border-[#333] backdrop-blur-sm h-full max-h-[calc(100vh-150px)] flex flex-col">
                            <div className="mb-4">
                                <FormField
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="mb-0"
                                />
                            </div>

                            <div className="flex mb-4">
                                <Button
                                    variant={filter === "all" ? "orangeFilled" : "orangeOutline"}
                                    size="small"
                                    onClick={() => setFilter("all")}
                                    className="flex-1 justify-center"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filter === "unread" ? "orangeFilled" : "orangeOutline"}
                                    size="small"
                                    onClick={() => setFilter("unread")}
                                    className="flex-1 justify-center ml-2"
                                >
                                    Unread
                                </Button>
                            </div>

                            <div className="overflow-y-auto grow">
                                <ConversationList
                                    conversations={filteredConversations}
                                    activeConversationId={activeConversationId}
                                    onSelectConversation={setActiveConversationId}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="lg:col-span-2">
                        <div className="bg-[rgba(20,20,20,0.95)] rounded-xl border border-[#333] backdrop-blur-sm h-full max-h-[calc(100vh-150px)] flex flex-col">
                            {activeConversationId ? (
                                <>
                                    {/* Chat header */}
                                    <div className="p-4 border-b border-[#333] flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-[#333] overflow-hidden mr-3 flex-shrink-0">
                                                <img
                                                    src={activeConversation.avatar}
                                                    alt={activeConversation.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">{activeConversation.name}</div>
                                                <div className="text-xs text-gray-400">
                                                    {activeConversation.isOnline ? (
                                                        <span className="text-green-400 flex items-center">
                                                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>{" "}
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span>Last active {activeConversation.lastActive}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <Button variant="subtle" size="small" leftIcon={<MessageIcon size={16} />}>
                                                Call
                                            </Button>
                                            <Button
                                                variant="subtle"
                                                size="small"
                                                className="ml-2"
                                                leftIcon={<ChevronDownIcon size={16} />}
                                            >
                                                More
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="p-4 overflow-y-auto flex-grow" ref={chatContainerRef}>
                                        <ChatHistory
                                            messages={activeConversation.messages}
                                            userName="John Doe"
                                            otherUserName={activeConversation.name}
                                        />
                                    </div>

                                    {/* Message input */}
                                    <div className="p-4 border-t border-[#333]">
                                        <form onSubmit={handleSendMessage} className="flex items-center">
                                            <FormField
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                className="flex-grow mb-0"
                                            />
                                            <Button
                                                type="submit"
                                                variant="orangeFilled"
                                                className="ml-2"
                                                leftIcon={<SendIcon size={16} />}
                                            >
                                                Send
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                // Empty state
                                <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                                    <div className="bg-[#222] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <MessageIcon size={24} stroke="#FF6B00" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                                    <p className="text-gray-400 mb-6 max-w-md">
                                        Select a conversation from the list or start a new one to begin messaging.
                                    </p>
                                    <Button variant="orangeFilled">Start New Conversation</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
