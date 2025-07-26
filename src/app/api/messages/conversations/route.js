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
          coachingRequest: {
            select: {
              id: true,
              status: true,
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
          coachingRequest: {
            select: {
              id: true,
              status: true,
            },
          },
        },
        orderBy: {
          lastMessageAt: "desc",
        },
      });
    }

    // Get accepted coaching requests that don't have conversations yet
    let availableChats = [];
    
    if (user.role === "trainer" && user.trainerInfo) {
      const acceptedRequests = await prisma.coachingRequest.findMany({
        where: {
          trainerId: user.trainerInfo.id,
          status: "accepted",
          conversation: null, // No conversation exists yet
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
      });

             availableChats = acceptedRequests.map((request) => ({
         id: `new-${request.id}`,
         coachingRequestId: request.id,
         participantId: request.client.user.id,
         name: request.client.clientProfile 
           ? `${request.client.clientProfile.firstName} ${request.client.clientProfile.lastName || ""}`.trim() 
           : "Unknown Client",
         avatar: request.client.clientProfile?.profileImage || null,
         lastMessageAt: null,
         unreadCount: 0,
         coachingRequestStatus: request.status,
         isNewChat: true,
       }));
    } else if (user.role === "client" && user.clientInfo) {
      const acceptedRequests = await prisma.coachingRequest.findMany({
        where: {
          clientId: user.clientInfo.id,
          status: "accepted",
          conversation: null, // No conversation exists yet
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
      });

             availableChats = acceptedRequests.map((request) => ({
         id: `new-${request.id}`,
         coachingRequestId: request.id,
         participantId: request.trainer.user.id,
         name: request.trainer.trainerProfile 
           ? `${request.trainer.trainerProfile.firstName} ${request.trainer.trainerProfile.lastName || ""}`.trim() 
           : "Unknown Trainer",
         avatar: request.trainer.trainerProfile?.profileImage || null,
         lastMessageAt: null,
         unreadCount: 0,
         coachingRequestStatus: request.status,
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
        id: conv.id,
        coachingRequestId: conv.coachingRequestId,
        participantId: participant.user.id,
        name: profile ? `${profile.firstName} ${profile.lastName || ""}`.trim() : "Unknown User",
        avatar: profile?.profileImage || null,
        lastMessageAt: conv.lastMessageAt,
        unreadCount: isTrainer ? conv.trainerUnreadCount : conv.clientUnreadCount,
        coachingRequestStatus: conv.coachingRequest.status,
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