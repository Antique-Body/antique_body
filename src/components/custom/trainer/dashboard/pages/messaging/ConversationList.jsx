import { FormField } from "@/components/shared/FormField";

export const ConversationList = ({
    conversations,
    selectedConversationId,
    onSelectConversation,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="flex flex-col h-full bg-[#0f0f0f]">
            {/* Search header */}
            <div className="p-4 border-b border-[#333]">
                <div className="relative">
                    <FormField
                        type="text"
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={e => onSearchChange(e.target.value)}
                        className="pl-10 bg-[#1a1a1a] text-gray-200 rounded-lg w-full"
                    />
                </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No conversations found</div>
                ) : (
                    conversations.map(conversation => (
                        <div
                            key={conversation.id}
                            className={`p-4 border-b border-[#333] cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                                selectedConversationId === conversation.id ? "bg-[#1a1a1a]" : ""
                            }`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="flex items-center">
                                {/* Avatar with online indicator */}
                                <div className="relative">
                                    <img
                                        src={conversation.avatar || "/assets/images/default-avatar.jpg"}
                                        alt={conversation.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {conversation.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></div>
                                    )}
                                </div>

                                {/* Contact info */}
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-gray-100 font-medium">{conversation.name}</h3>
                                        <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm text-gray-400 truncate max-w-[150px]">
                                            {conversation.lastMessage}
                                        </p>
                                        {conversation.isUnread && (
                                            <span className="ml-2 bg-blue-500 rounded-full w-2 h-2"></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
