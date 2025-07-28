import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's role and info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        trainerInfo: true,
        clientInfo: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let conversations = [];

    if (user.role === "trainer" && user.trainerInfo) {
      // Get conversations for trainer
      conversations = await prisma.conversation.findMany({
        where: {
          trainerId: user.trainerInfo.id,
          isActive: true,
        },
        include: {
          client: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                },
              },
              clientProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                },
              },
            },
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      });
    } else if (user.role === "client" && user.clientInfo) {
      // Get conversations for client
      conversations = await prisma.conversation.findMany({
        where: {
          clientId: user.clientInfo.id,
          isActive: true,
        },
        include: {
          trainer: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  phone: true,
                },
              },
              trainerProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                  profileImage: true,
                },
              },
            },
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      });
    }

    // Get all available users to chat with
    let availableChats = [];
    
    if (user.role === "trainer" && user.trainerInfo) {
      // Get all clients that the trainer can chat with
      const allClients = await prisma.clientInfo.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
            },
          },
          clientProfile: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      });

      // Filter out clients that already have conversations
      const existingClientIds = conversations.map(conv => conv.clientId);
      const availableClients = allClients.filter(client => 
        !existingClientIds.includes(client.id)
      );

      availableChats = availableClients.map((client) => ({
        id: `chat:${user.trainerInfo.id}+${client.id}`,
        participantId: client.user.id,
        name: client.clientProfile 
          ? `${client.clientProfile.firstName} ${client.clientProfile.lastName || ""}`.trim() 
          : "Unknown Client",
        avatar: client.clientProfile?.profileImage || null,
        lastMessageAt: null,
        unreadCount: 0,
        isNewChat: true,
      }));
    } else if (user.role === "client" && user.clientInfo) {
      // Get all trainers that the client can chat with
      const allTrainers = await prisma.trainerInfo.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
            },
          },
          trainerProfile: {
            select: {
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
        },
      });

      // Filter out trainers that already have conversations
      const existingTrainerIds = conversations.map(conv => conv.trainerId);
      const availableTrainers = allTrainers.filter(trainer => 
        !existingTrainerIds.includes(trainer.id)
      );

      availableChats = availableTrainers.map((trainer) => ({
        id: `chat:${trainer.id}+${user.clientInfo.id}`,
        participantId: trainer.user.id,
        name: trainer.trainerProfile 
          ? `${trainer.trainerProfile.firstName} ${trainer.trainerProfile.lastName || ""}`.trim() 
          : "Unknown Trainer",
        avatar: trainer.trainerProfile?.profileImage || null,
        lastMessageAt: null,
        unreadCount: 0,
        isNewChat: true,
      }));
    }

    // Format existing conversations
    const formattedConversations = conversations.map((conv) => {
      const isTrainer = user.role === "trainer";
      const participant = isTrainer ? conv.client : conv.trainer;
      const profile = isTrainer 
        ? participant.clientProfile 
        : participant.trainerProfile;

      return {
        id: conv.chatId,
        participantId: participant.user.id,
        name: profile ? `${profile.firstName} ${profile.lastName || ""}`.trim() : "Unknown User",
        avatar: profile?.profileImage || null,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: isTrainer ? conv.trainerUnreadCount : conv.clientUnreadCount,
        isNewChat: false,
      };
    });

    // Combine existing conversations with available new chats
    const allConversations = [...formattedConversations, ...availableChats];
    
    // Sort by last message time (existing conversations first, then new chats)
    allConversations.sort((a, b) => {
      if (a.lastMessageAt && b.lastMessageAt) {
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      }
      if (a.lastMessageAt) return -1;
      if (b.lastMessageAt) return 1;
      return 0;
    });

    return NextResponse.json({ conversations: allConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to fetch conversations", 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
} 