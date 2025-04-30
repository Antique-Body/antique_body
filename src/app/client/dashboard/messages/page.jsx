"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { MessageIcon, SendIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FormField } from "@/components/shared";

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");

  // Sample user data with messages
  const userData = {
    messages: [
      {
        id: 1,
        sender: "Alex Campbell",
        sender_image: "/trainers/trainer1.jpg",
        content: "Great progress this week! Let's discuss adjusting your program on our next call.",
        time: "Today, 2:30 PM",
        unread: true,
      },
      {
        id: 2,
        sender: "NutritionBot",
        sender_image: "/logo/logo-icon.png",
        content:
          "Your nutrition log shows you're consistently under your protein goal. Consider adding protein-rich foods to your breakfast.",
        time: "Yesterday, 10:15 AM",
        unread: false,
      },
      {
        id: 3,
        sender: "Alex Campbell",
        sender_image: "/trainers/trainer1.jpg",
        content: "I've uploaded a new workout routine for next week. Check the training tab!",
        time: "Aug 15, 9:45 AM",
        unread: false,
      },
    ],
  };

  const handleSendMessage = e => {
    e.preventDefault();
    // In a real application, we would send the message to the server
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Messages List */}
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-6 flex items-center text-xl font-bold">
          <MessageIcon className="mr-2" stroke="#FF6B00" />
          Messages
        </h2>

        <div className="space-y-4">
          {userData.messages.map(message => (
            <div
              key={message.id}
              className={`rounded-lg border p-4 ${
                message.unread
                  ? "border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.05)]"
                  : "border-[#333] bg-[rgba(30,30,30,0.5)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <Image
                  src={message.sender_image}
                  alt={message.sender}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{message.sender}</h3>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="mt-1 text-gray-300">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Send Message Form */}
      <form onSubmit={handleSendMessage}>
        <Card variant="darkStrong" width="100%" maxWidth="none">
          <h3 className="mb-4 text-lg font-medium">Send Message</h3>
          <div className="space-y-4">
            <FormField
              label="Message"
              type="textarea"
              id="message"
              rows={4}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              backgroundStyle="dark"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={!newMessage.trim()} rightIcon={<SendIcon />}>
                Send Message
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
