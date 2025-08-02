import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { parseChatId, isValidChatId } from "@/utils/chatUtils";

export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = params;

    // Validate chat ID format
    if (!isValidChatId(chatId)) {
      return NextResponse.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }

    const { trainerId, clientId } = parseChatId(chatId);

    if (!trainerId || !clientId) {
      return NextResponse.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }

    // Verify user has access to this chat
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        trainerInfo: true,
        clientInfo: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is either the trainer or client in this chat
    const isTrainer = user.trainerInfo?.id === trainerId;
    const isClient = user.clientInfo?.id === clientId;

    if (!isTrainer && !isClient) {
      return NextResponse.json(
        { error: "Unauthorized to access this conversation" },
        { status: 403 }
      );
    }

    // Mark messages as read and update conversation unread count in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mark messages as read for the current user
      const updatedMessages = await tx.message.updateMany({
        where: {
          chatId,
          receiverId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      // Update conversation unread count
      const conversation = await tx.conversation.findUnique({
        where: { chatId },
      });

      if (conversation) {
        const updateData = isTrainer
          ? { trainerUnreadCount: 0 }
          : { clientUnreadCount: 0 };

        await tx.conversation.update({
          where: { id: conversation.id },
          data: updateData,
        });
      }

      return { updatedMessages, conversation };
    });

    return NextResponse.json({
      success: true,
      markedAsRead: result.updatedMessages.count,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
