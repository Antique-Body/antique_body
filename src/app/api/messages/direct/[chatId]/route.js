import { NextResponse } from "next/server";

import { auth } from "#/auth";
// Server-side Ably import for API routes
let Ably = null;
const getServerAbly = async () => {
  if (!Ably) {
    Ably = (await import("ably")).default;
  }
  return Ably;
};
import prisma from "@/lib/prisma";
import { parseChatId, isValidChatId } from "@/utils/chatUtils";

export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

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

    // Get messages for this chat
    const messages = await prisma.message.findMany({
      where: {
        chatId,
        deletedAt: null,
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      skip: offset,
      take: limit,
    });

    // Format messages for frontend
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      senderId: message.senderId,
      receiverId: message.receiverId,
      chatId: message.chatId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
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
    const body = await request.json();
    const { content, messageType = "text", fileUrl, fileName } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Validate message content length
    const MAX_MESSAGE_LENGTH = 500;
    if (content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message content cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

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
        { error: "Unauthorized to send messages in this conversation" },
        { status: 403 }
      );
    }

    // Get trainer and client info for receiver determination
    const trainer = await prisma.trainerInfo.findUnique({
      where: { id: trainerId },
      include: { user: true },
    });

    const client = await prisma.clientInfo.findUnique({
      where: { id: clientId },
      include: { user: true },
    });

    if (!trainer || !client) {
      return NextResponse.json(
        { error: "Trainer or client not found" },
        { status: 404 }
      );
    }

    // Check if chat is blocked for both trainer and client
    const chatBlock = await prisma.chatBlock.findUnique({
      where: {
        blockerId_blockedId_chatId: {
          blockerId: trainer.user.id,
          blockedId: client.user.id,
          chatId: chatId,
        },
      },
    });

    if (chatBlock) {
      if (isClient) {
        return NextResponse.json(
          {
            error: "You have been blocked.",
            blocked: true,
          },
          { status: 403 }
        );
      } else if (isTrainer) {
        return NextResponse.json(
          {
            error: "You have blocked this chat. Unblock to send messages.",
            blocked: true,
            isTrainerBlocked: true,
          },
          { status: 403 }
        );
      }
    }

    // Determine receiver
    const receiverId = isTrainer ? client.user.id : trainer.user.id;

    // Create message and update/create conversation in a single transaction
    const { message } = await prisma.$transaction(async (tx) => {
      // Create message
      const message = await tx.message.create({
        data: {
          content: content.trim(),
          messageType,
          fileUrl,
          fileName,
          senderId: session.user.id,
          receiverId,
          chatId,
        },
        include: {
          sender: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      // Check if conversation exists (including soft-deleted ones)
      const existingConversation = await tx.conversation.findFirst({
        where: { chatId },
      });

      let conversation;
      if (existingConversation) {
        // Conversation exists - update it and reactivate if it was soft-deleted
        conversation = await tx.conversation.update({
          where: { id: existingConversation.id },
          data: {
            lastMessageAt: message.createdAt,
            deletedAt: null, // Reactivate if it was soft-deleted
            ...(isTrainer
              ? { clientUnreadCount: { increment: 1 } }
              : { trainerUnreadCount: { increment: 1 } }),
          },
        });
      } else {
        // Create new conversation
        conversation = await tx.conversation.create({
          data: {
            chatId,
            clientId,
            trainerId,
            lastMessageAt: message.createdAt,
            clientUnreadCount: isTrainer ? 1 : 0,
            trainerUnreadCount: isClient ? 1 : 0,
          },
        });
      }

      return { message, conversation };
    });

    // Format message for response
    const formattedMessage = {
      id: message.id,
      content: message.content,
      messageType: message.messageType,
      fileUrl: message.fileUrl,
      fileName: message.fileName,
      senderId: message.senderId,
      receiverId: message.receiverId,
      chatId: message.chatId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
    };

    // Publish message to Ably for real-time delivery (server-side)
    const Ably = await getServerAbly();
    const ablyClient = new Ably.Rest({
      key: process.env.ABLY_API_KEY,
    });
    await ablyClient.channels
      .get(`chat:${chatId}`)
      .publish("message", formattedMessage);

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    // Soft delete the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { chatId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Soft delete the conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Soft delete all messages in this conversation
    await prisma.message.updateMany({
      where: { chatId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}
