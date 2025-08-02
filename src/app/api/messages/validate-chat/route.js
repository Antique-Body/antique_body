import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { parseChatId, isValidChatId } from "@/utils/chatUtils";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await request.json();

    if (!chatId || !isValidChatId(chatId)) {
      return NextResponse.json(
        { error: "Invalid chat ID format" },
        { status: 400 }
      );
    }

    const { trainerId, clientId } = parseChatId(chatId);

    // Get current user info
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

    // Check if user has access to this chat
    const isTrainer = user.trainerInfo?.id === trainerId;
    const isClient = user.clientInfo?.id === clientId;

    if (!isTrainer && !isClient) {
      return NextResponse.json(
        { error: "Unauthorized to access this conversation" },
        { status: 403 }
      );
    }

    // Check if chat is blocked (only block clients, allow trainers to access for unblocking)
    if (isClient) {
      const trainer = await prisma.trainerInfo.findUnique({
        where: { id: trainerId },
        include: { user: true },
      });

      if (trainer) {
        const chatBlock = await prisma.chatBlock.findUnique({
          where: {
            blockerId_blockedId_chatId: {
              blockerId: trainer.user.id,
              blockedId: session.user.id,
              chatId: chatId,
            },
          },
        });

        if (chatBlock) {
          return NextResponse.json(
            { error: "You have been blocked from this conversation" },
            { status: 403 }
          );
        }
      }
    }

    // Get participant information
    const participantInfo = await (async () => {
      if (isTrainer) {
        // Current user is trainer, get client info
        const client = await prisma.clientInfo.findUnique({
          where: { id: clientId },
          include: {
            clientProfile: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        });

        if (client?.clientProfile) {
          return {
            name: `${client.clientProfile.firstName} ${client.clientProfile.lastName || ""}`.trim(),
            avatar: client.clientProfile.profileImage,
            id: client.id,
          };
        }
      } else if (isClient) {
        // Current user is client, get trainer info
        const trainer = await prisma.trainerInfo.findUnique({
          where: { id: trainerId },
          include: {
            trainerProfile: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        });

        if (trainer?.trainerProfile) {
          return {
            name: `${trainer.trainerProfile.firstName} ${trainer.trainerProfile.lastName || ""}`.trim(),
            avatar: trainer.trainerProfile.profileImage,
            id: trainer.id,
          };
        }
      }

      return null;
    })();

    // Check if there's an existing conversation (not deleted)
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        chatId,
        deletedAt: null,
      },
    });

    return NextResponse.json({
      hasAccess: true,
      participantInfo,
      hasExistingConversation: !!existingConversation,
    });
  } catch (error) {
    console.error("Error validating chat access:", error);
    return NextResponse.json(
      { error: "Failed to validate chat access" },
      { status: 500 }
    );
  }
}
