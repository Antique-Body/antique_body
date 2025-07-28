import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { publishMessage } from "@/lib/ably";
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
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Mark messages as read for the current user
    if (messages.length > 0) {
      await prisma.message.updateMany({
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
      const conversation = await prisma.conversation.findUnique({
        where: { chatId },
      });

      if (conversation) {
        const updateData = isTrainer
          ? { trainerUnreadCount: 0 }
          : { clientUnreadCount: 0 };

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: updateData,
        });
      }
    }

    // Format messages for frontend
    const formattedMessages = messages.reverse().map((message) => ({
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

    // Determine receiver
    const receiverId = isTrainer 
      ? client.user.id 
      : trainer.user.id;

    // Create message
    const message = await prisma.message.create({
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

    // Update or create conversation
    await prisma.conversation.upsert({
      where: { chatId },
      update: {
        lastMessageAt: message.createdAt,
        ...(isTrainer 
          ? { clientUnreadCount: { increment: 1 } }
          : { trainerUnreadCount: { increment: 1 } }
        ),
      },
      create: {
        chatId,
        clientId,
        trainerId,
        lastMessageAt: message.createdAt,
        clientUnreadCount: isTrainer ? 1 : 0,
        trainerUnreadCount: isClient ? 1 : 0,
      },
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

    // Publish message to Ably for real-time delivery
    await publishMessage(chatId, formattedMessage);

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 