"use client";

import { useParams } from "next/navigation";

import { RealTimeChatInterface } from "@/components/custom/dashboard/shared/chat/RealTimeChatInterface";

export default function ConversationPage() {
  const params = useParams();
  const conversationId = decodeURIComponent(params.conversationId);

  return (
    <div className="h-screen w-full">
      <RealTimeChatInterface conversationId={conversationId} />
    </div>
  );
} 