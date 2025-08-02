"use client";

import React from "react";

import { RealTimeChatInterface } from "@/components/custom/dashboard/shared/chat/RealTimeChatInterface";

function MessagesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-gray-400">
          Communicate with your clients and provide support
        </p>
      </div>

      <RealTimeChatInterface />
    </div>
  );
}

export default MessagesPage;
