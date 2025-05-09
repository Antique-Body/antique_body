"use client";

import { Button } from "@/components/common/Button";
import { PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import TrainerChatInterface from "@/components/custom/trainer/dashboard/pages/messages/TrainerChatInterface";

export default function MessagesPage() {
  // Handle sending a message
  const handleSendMessage = (message, conversationId) => {
    // In a real app, this would send the message to an API

    // eslint-disable-next-line no-console
    console.log(
      "Trainer sending message:",
      message,
      "to conversation:",
      conversationId
    );
  };

  return (
    <div className="relative min-h-screen  text-white">
      <div className="container relative z-10 mx-auto px-4 pb-10 pt-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="orangeFilled" leftIcon={<PlusIcon size={16} />}>
            New Message
          </Button>
        </div>

        <Card
          variant="darkStrong"
          width="100%"
          maxWidth="none"
          className="flex h-full max-h-[calc(100vh-150px)] flex-col"
          padding="1.5rem">
          <TrainerChatInterface onSendMessage={handleSendMessage} />
        </Card>
      </div>
    </div>
  );
}
