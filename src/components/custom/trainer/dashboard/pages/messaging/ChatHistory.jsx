import Image from "next/image";
import React from "react";

import { Button } from "@/components/common/Button";
import { MessageIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared/FormField";

export const ChatHistory = ({ conversation, messages }) => {
  const [reply, setReply] = React.useState("");

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#222]">
          <MessageIcon size={32} className="text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No Conversation Selected</h3>
        <p className="max-w-md text-gray-400">
          Select a conversation from the list or start a new message to begin chatting.
        </p>
      </div>
    );
  }

  const handleSendMessage = e => {
    e.preventDefault();
    if (reply.trim() === "") return;
    // Send message logic would go here
    setReply("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat header */}
      <div className="flex items-center border-b border-[#333] p-4">
        <div className="relative mr-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-[#333]">
            <Image src={conversation.avatar} alt={conversation.name} width={40} height={40} className="object-cover" />
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border border-[#0a0a0a] bg-green-400"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium">{conversation.name}</h3>
          <p className="text-xs text-gray-400">
            {conversation.isOnline ? "Online" : "Last seen " + conversation.lastSeen}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow space-y-4 overflow-y-auto p-4">
        {messages && messages.length > 0 ? (
          messages.map(message => (
            <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isMine
                    ? "rounded-tr-none bg-orange-900/20 text-white"
                    : "rounded-tl-none bg-[#222] text-white"
                }`}
              >
                <p>{message.content}</p>
                <div className={`mt-1 text-xs ${message.isMine ? "text-orange-300/70" : "text-gray-400"}`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-400">Start the conversation with {conversation.name}</div>
        )}
      </div>

      {/* Reply form */}
      <form onSubmit={handleSendMessage} className="border-t border-[#333] p-4">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <FormField
              type="text"
              placeholder={`Message ${conversation.name}...`}
              value={reply}
              onChange={e => setReply(e.target.value)}
              background="dark"
            />
          </div>
          <Button type="submit" variant="orangeFilled" size="default" disabled={reply.trim() === ""}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
