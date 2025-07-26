import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { publishMessage } from "@/lib/ably";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coachingRequestId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Verify user has access to this coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id: coachingRequestId },
      include: {
        client: {
          include: { user: true },
        },
        trainer: {
          include: { user: true },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Check if user is either the client or trainer in this coaching request
    const isTrainer = coachingRequest.trainer.user.id === session.user.id;
    const isClient = coachingRequest.client.user.id === session.user.id;

    if (!isTrainer && !isClient) {
      return NextResponse.json(
        { error: "Unauthorized to access this conversation" },
        { status: 403 }
      );
    }

    // Only allow messaging for accepted coaching requests
    if (coachingRequest.status !== "accepted") {
      return NextResponse.json(
        { error: "Messages are only available for accepted coaching requests" },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        coachingRequestId,
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
          coachingRequestId,
          receiverId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      // Update conversation unread count
      const conversation = await prisma.conversation.findUnique({
        where: { coachingRequestId },
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
      coachingRequestId: message.coachingRequestId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      // Don't include isMine here - let frontend calculate it
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

    const { coachingRequestId } = params;
    const body = await request.json();
    const { content, messageType = "text", fileUrl, fileName } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id: coachingRequestId },
      include: {
        client: {
          include: { user: true },
        },
        trainer: {
          include: { user: true },
        },
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Check if user is either the client or trainer in this coaching request
    const isTrainer = coachingRequest.trainer.user.id === session.user.id;
    const isClient = coachingRequest.client.user.id === session.user.id;

    if (!isTrainer && !isClient) {
      return NextResponse.json(
        { error: "Unauthorized to send messages in this conversation" },
        { status: 403 }
      );
    }

    // Only allow messaging for accepted coaching requests
    if (coachingRequest.status !== "accepted") {
      return NextResponse.json(
        { error: "Messages can only be sent for accepted coaching requests" },
        { status: 403 }
      );
    }

    // Determine receiver
    const receiverId = isTrainer 
      ? coachingRequest.client.user.id 
      : coachingRequest.trainer.user.id;

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        messageType,
        fileUrl,
        fileName,
        senderId: session.user.id,
        receiverId,
        coachingRequestId,
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
      where: { coachingRequestId },
      update: {
        lastMessageAt: message.createdAt,
        ...(isTrainer 
          ? { clientUnreadCount: { increment: 1 } }
          : { trainerUnreadCount: { increment: 1 } }
        ),
      },
      create: {
        coachingRequestId,
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
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
      coachingRequestId: message.coachingRequestId,
      isRead: message.isRead,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      // Don't include isMine here - let frontend calculate it
    };

    // Publish message to Ably for real-time delivery
    await publishMessage(coachingRequestId, formattedMessage);

    return NextResponse.json({ message: formattedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
} 