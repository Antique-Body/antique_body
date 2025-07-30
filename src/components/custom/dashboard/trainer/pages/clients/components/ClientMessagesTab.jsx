import { Icon } from "@iconify/react";
import React, { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function ClientMessagesTab({ client }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "client",
      text: "Hey! Just finished today's workout. The bench press felt much easier than last week!",
      timestamp: "2024-01-20T14:30:00Z",
      read: true,
    },
    {
      id: 2,
      sender: "trainer",
      text: "That's fantastic progress! How did the squats feel? Remember to focus on your form.",
      timestamp: "2024-01-20T14:45:00Z",
      read: true,
    },
    {
      id: 3,
      sender: "client",
      text: "The squats were challenging but I managed to complete all sets. My legs are definitely getting stronger!",
      timestamp: "2024-01-20T15:00:00Z",
      read: true,
    },
    {
      id: 4,
      sender: "trainer",
      text: "Perfect! Keep up the excellent work. Don't forget to stay hydrated and get enough rest.",
      timestamp: "2024-01-20T15:15:00Z",
      read: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "trainer",
        text: newMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Messages with {client.client.clientProfile.firstName}
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-zinc-400">Online</span>
        </div>
      </div>

      {/* Messages Container */}
      <Card variant="dark" className="overflow-visible h-96">
        <div className="flex flex-col h-full">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "trainer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "trainer"
                      ? "bg-[#3E92CC] text-white"
                      : "bg-zinc-700 text-zinc-100"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "trainer"
                        ? "text-blue-100"
                        : "text-zinc-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-zinc-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3E92CC] focus:border-transparent"
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2"
              >
                <Icon icon="mdi:send" width={16} height={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="secondary"
          fullWidth
          leftIcon={<Icon icon="mdi:calendar" width={20} height={20} />}
        >
          Schedule Check-in
        </Button>
        <Button
          variant="secondary"
          fullWidth
          leftIcon={<Icon icon="mdi:camera" width={20} height={20} />}
        >
          Request Progress Photos
        </Button>
        <Button
          variant="secondary"
          fullWidth
          leftIcon={<Icon icon="mdi:chart-line" width={20} height={20} />}
        >
          Share Progress Report
        </Button>
      </div>
    </div>
  );
}
