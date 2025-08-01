import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { blockedUserId, chatId, reason } = body;

    if (!blockedUserId || !chatId) {
      return NextResponse.json(
        { error: "Blocked user ID and chat ID are required" },
        { status: 400 }
      );
    }

    // Get current user with role info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        trainerInfo: true,
        clientInfo: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only trainers can block chat
    if (currentUser.role !== "trainer" || !currentUser.trainerInfo) {
      return NextResponse.json(
        { error: "Only trainers can block chat" },
        { status: 403 }
      );
    }

    // Check if user is trying to block themselves
    if (session.user.id === blockedUserId) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    // Get the user to be blocked
    const userToBlock = await prisma.user.findUnique({
      where: { id: blockedUserId },
      include: {
        clientInfo: true,
      },
    });

    if (!userToBlock) {
      return NextResponse.json(
        { error: "User to block not found" },
        { status: 404 }
      );
    }

    // Only allow blocking clients
    if (userToBlock.role !== "client" || !userToBlock.clientInfo) {
      return NextResponse.json(
        { error: "You can only block chat with clients" },
        { status: 400 }
      );
    }

    // Check if chat is already blocked
    const existingBlock = await prisma.chatBlock.findUnique({
      where: {
        blockerId_blockedId_chatId: {
          blockerId: session.user.id,
          blockedId: blockedUserId,
          chatId: chatId,
        },
      },
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: "Chat is already blocked" },
        { status: 400 }
      );
    }

    // Create the chat block
    const block = await prisma.chatBlock.create({
      data: {
        blockerId: session.user.id,
        blockedId: blockedUserId,
        chatId: chatId,
        reason: reason || null,
      },
      include: {
        blocked: {
          include: {
            clientInfo: {
              include: {
                clientProfile: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chat blocked successfully",
      block: {
        id: block.id,
        blockedUserId: block.blockedId,
        chatId: block.chatId,
        reason: block.reason,
        createdAt: block.createdAt,
        blockedUser: {
          id: block.blocked.clientInfo?.id,
          name: block.blocked.clientInfo?.clientProfile 
            ? `${block.blocked.clientInfo.clientProfile.firstName} ${block.blocked.clientInfo.clientProfile.lastName}`
            : "Unknown User",
        },
      },
    });
  } catch (error) {
    console.error("Error blocking chat:", error);
    return NextResponse.json(
      { error: "Failed to block chat" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockedUserId = searchParams.get("blockedUserId");
    const chatId = searchParams.get("chatId");

    if (!blockedUserId || !chatId) {
      return NextResponse.json(
        { error: "Blocked user ID and chat ID are required" },
        { status: 400 }
      );
    }

    // Get current user with role info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        trainerInfo: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only trainers can unblock chat
    if (currentUser.role !== "trainer" || !currentUser.trainerInfo) {
      return NextResponse.json(
        { error: "Only trainers can unblock chat" },
        { status: 403 }
      );
    }

    // Find and delete the chat block
    const block = await prisma.chatBlock.findUnique({
      where: {
        blockerId_blockedId_chatId: {
          blockerId: session.user.id,
          blockedId: blockedUserId,
          chatId: chatId,
        },
      },
    });

    if (!block) {
      return NextResponse.json(
        { error: "Chat is not blocked" },
        { status: 404 }
      );
    }

    await prisma.chatBlock.delete({
      where: { id: block.id },
    });

    return NextResponse.json({
      success: true,
      message: "Chat unblocked successfully",
    });
  } catch (error) {
    console.error("Error unblocking chat:", error);
    return NextResponse.json(
      { error: "Failed to unblock chat" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockedUserId = searchParams.get("blockedUserId");
    const chatId = searchParams.get("chatId");

    // Get current user with role info
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        trainerInfo: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only trainers can check chat blocked status
    if (currentUser.role !== "trainer" || !currentUser.trainerInfo) {
      return NextResponse.json(
        { error: "Only trainers can check chat blocked status" },
        { status: 403 }
      );
    }

    if (blockedUserId && chatId) {
      // Check if specific chat is blocked
      const block = await prisma.chatBlock.findUnique({
        where: {
          blockerId_blockedId_chatId: {
            blockerId: session.user.id,
            blockedId: blockedUserId,
            chatId: chatId,
          },
        },
      });

      return NextResponse.json({
        isBlocked: !!block,
        block: block ? {
          id: block.id,
          reason: block.reason,
          createdAt: block.createdAt,
        } : null,
      });
    } else {
      // Get all blocked chats for this trainer
      const blockedChats = await prisma.chatBlock.findMany({
        where: { blockerId: session.user.id },
        include: {
          blocked: {
            include: {
              clientInfo: {
                include: {
                  clientProfile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        blockedChats: blockedChats.map(block => ({
          id: block.id,
          blockedUserId: block.blockedId,
          chatId: block.chatId,
          reason: block.reason,
          createdAt: block.createdAt,
          blockedUser: {
            id: block.blocked.clientInfo?.id,
            name: block.blocked.clientInfo?.clientProfile 
              ? `${block.blocked.clientInfo.clientProfile.firstName} ${block.blocked.clientInfo.clientProfile.lastName}`
              : "Unknown User",
            email: block.blocked.email,
          },
        })),
      });
    }
  } catch (error) {
    console.error("Error checking chat blocked status:", error);
    return NextResponse.json(
      { error: "Failed to check chat blocked status" },
      { status: 500 }
    );
  }
} 