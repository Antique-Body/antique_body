import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";
import { generateChatId } from "@/utils/chatUtils";

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

    // Dynamic query configuration based on user role
    const isTrainer = user.role === "trainer" && user.trainerInfo;
    const isClient = user.role === "client" && user.clientInfo;
    
    if (isTrainer || isClient) {
      const whereClause = isTrainer 
        ? { trainerId: user.trainerInfo.id }
        : { clientId: user.clientInfo.id };
      
      const includeClause = isTrainer
        ? {
            client: {
              select: {
                id: true,
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
          }
        : {
            trainer: {
              select: {
                id: true,
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
          };

      conversations = await prisma.conversation.findMany({
        where: {
          ...whereClause,
          isActive: true,
          deletedAt: null,
        },
        select: {
          id: true,
          chatId: true,
          clientId: true,
          trainerId: true,
          lastMessageAt: true,
          clientUnreadCount: true,
          trainerUnreadCount: true,
          ...includeClause,
        },
        orderBy: {
          lastMessageAt: "desc",
        },
        take: 50, // Add pagination limit
      });

      // Add blocked status to conversations for trainers
      if (isTrainer) {
        const blockedChatIds = await prisma.chatBlock.findMany({
          where: { blockerId: session.user.id },
          select: { chatId: true },
        });
        
        const blockedChatIdSet = new Set(blockedChatIds.map(block => block.chatId));
        
        // Add isBlocked flag to conversations instead of filtering them out
        conversations = conversations.map(conversation => ({
          ...conversation,
          isBlocked: blockedChatIdSet.has(conversation.chatId)
        }));
      }


    }

    // Get available users to chat with (only those with coaching requests or existing conversations)
    let availableChats = [];
    
    if (isTrainer || isClient) {
      const coachingRequestWhere = isTrainer
        ? { trainerId: user.trainerInfo.id }
        : { clientId: user.clientInfo.id };
      
      const coachingRequestSelect = isTrainer
        ? {
            client: {
              select: {
                id: true,
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
          }
        : {
            trainer: {
              select: {
                id: true,
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
          };

      const coachingRequests = await prisma.coachingRequest.findMany({
        where: {
          ...coachingRequestWhere,
          status: {
            in: ["pending", "accepted"]
          }
        },
        select: coachingRequestSelect,
        take: 50, // Add pagination limit
      });

      // Filter out users that already have conversations
      const existingIds = conversations.map(conv => 
        isTrainer ? conv.clientId : conv.trainerId
      ).filter(Boolean); // Remove any null/undefined values
      
      let availableUsers = coachingRequests
        .map(cr => isTrainer ? cr.client : cr.trainer)
        .filter(user => user && !existingIds.includes(user.id));

      // Filter out blocked chats from available users for trainers
      if (isTrainer) {
        const blockedChatIds = await prisma.chatBlock.findMany({
          where: { blockerId: session.user.id },
          select: { chatId: true },
        });
        
        const blockedChatIdSet = new Set(blockedChatIds.map(block => block.chatId));
        
        availableUsers = availableUsers.filter(participant => {
          const chatId = generateChatId(
            user.trainerInfo.id,
            participant.id
          );
          return !blockedChatIdSet.has(chatId);
        });
      }



      availableChats = availableUsers.map((participant) => {
        const profile = isTrainer ? participant.clientProfile : participant.trainerProfile;
        const participantId = isTrainer ? user.trainerInfo.id : user.clientInfo.id;
        
        return {
          id: generateChatId(
            isTrainer ? participantId : participant.id,
            isTrainer ? participant.id : participantId
          ),
          participantId: participant.user.id,
          name: profile 
            ? `${profile.firstName} ${profile.lastName || ""}`.trim() 
            : `Unknown ${isTrainer ? 'Client' : 'Trainer'}`,
          avatar: profile?.profileImage || null,
          lastMessageAt: null,
          unreadCount: 0,
          isNewChat: true,
        };
      });
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
        isBlocked: conv.isBlocked || false,
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

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("Debug - Conversations:", {
        existingCount: formattedConversations.length,
        availableCount: availableChats.length,
        totalCount: allConversations.length,
        existingIds: conversations.map(conv => isTrainer ? conv.clientId : conv.trainerId),
        availableChatIds: availableChats.map(chat => chat.id)
      });
    }

    return NextResponse.json({ conversations: allConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to fetch conversations", 
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
} 