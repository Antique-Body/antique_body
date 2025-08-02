import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { parseChatId, isValidChatId } from "@/utils/chatUtils";

// Helper function to determine the correct trainer and client IDs from chat ID
async function determineTrainerAndClientIds(chatId) {
  const { firstId, secondId } = parseChatId(chatId);

  if (!firstId || !secondId) {
    throw new Error("Invalid chat ID format");
  }

  // Try both combinations to see which one exists in the database
  const [trainer1, trainer2, client1, client2] = await Promise.all([
    prisma.trainerInfo.findUnique({ where: { id: firstId } }),
    prisma.trainerInfo.findUnique({ where: { id: secondId } }),
    prisma.clientInfo.findUnique({ where: { id: firstId } }),
    prisma.clientInfo.findUnique({ where: { id: secondId } }),
  ]);

  // Check which combination is valid
  if (trainer1 && client2) {
    // First ID is trainer, second ID is client
    return { trainerId: firstId, clientId: secondId };
  } else if (trainer2 && client1) {
    // Second ID is trainer, first ID is client
    return { trainerId: secondId, clientId: firstId };
  } else {
    throw new Error(
      "Invalid chat ID - no valid trainer/client combination found"
    );
  }
}

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

    let trainerId, clientId;
    try {
      const result = await determineTrainerAndClientIds(chatId);
      trainerId = result.trainerId;
      clientId = result.clientId;
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
    // Since generateChatId sorts IDs alphabetically, we need to check both combinations
    const isTrainer =
      user.trainerInfo?.id === trainerId || user.trainerInfo?.id === clientId;
    const isClient =
      user.clientInfo?.id === clientId || user.clientInfo?.id === trainerId;

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
