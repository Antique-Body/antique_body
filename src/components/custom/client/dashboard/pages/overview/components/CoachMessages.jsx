import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/common/Button";
import { MessageIcon, PlusIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const CoachMessages = ({ messages }) => {
    const router = useRouter();

    return (
        <Card variant="dark" width="100%" maxWidth="none">
            <h2 className="mb-4 flex items-center text-xl font-bold">
                <MessageIcon className="mr-2" stroke="#FF6B00" />
                Coach Messages
            </h2>

            <div className="space-y-3">
                {messages.slice(0, 2).map((message) => (
                    <Card
                        key={message.id}
                        variant="dark"
                        className={`${message.unread && message.from === "Coach Alex" ? "border-[#FF6B00]" : ""}`}
                        width="100%"
                        maxWidth="none"
                    >
                        <div className="mb-1 flex items-center justify-between">
                            <p className="font-bold">{message.from}</p>
                            <p className="text-xs text-gray-400">{message.time}</p>
                        </div>
                        <p className="text-sm text-gray-300">{message.content}</p>
                    </Card>
                ))}
            </div>

            <Button
                variant="orangeFilled"
                fullWidth
                className="mt-4"
                leftIcon={<PlusIcon />}
                onClick={() => router.push("/client/dashboard/messages")}
            >
                Send Message
            </Button>
        </Card>
    );
};
