import Image from "next/image";

import { FormField } from "@/components/shared/FormField";

export const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}) => (
  <div className="flex h-full flex-col bg-[#0f0f0f]">
    {/* Search header */}
    <div className="border-b border-[#333] p-4">
      <div className="relative">
        <FormField
          type="text"
          placeholder="Search conversations"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full rounded-lg bg-[#1a1a1a] pl-10 text-gray-200"
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
            className={`cursor-pointer border-b border-[#333] p-4 transition-colors hover:bg-[#1a1a1a] ${
              selectedConversationId === conversation.id ? "bg-[#1a1a1a]" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-center">
              {/* Avatar with online indicator */}
              <div className="relative">
                <Image
                  src={conversation.avatar || "/assets/images/default-avatar.jpg"}
                  alt={conversation.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                {conversation.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f0f] bg-green-500"></div>
                )}
              </div>

              {/* Contact info */}
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-100">{conversation.name}</h3>
                  <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="max-w-[150px] truncate text-sm text-gray-400">{conversation.lastMessage}</p>
                  {conversation.isUnread && <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
