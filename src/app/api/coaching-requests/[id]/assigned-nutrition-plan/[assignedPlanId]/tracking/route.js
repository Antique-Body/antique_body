import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: coachingRequestId, assignedPlanId } = await context.params;

    // Get coaching request to verify trainer access
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id: coachingRequestId },
      include: { 
        client: {
          include: {
            clientProfile: true
          }
        }, 
        trainer: true 
      },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Verify trainer access
    const isTrainer = coachingRequest.trainer.userId === session.user.id;
    if (!isTrainer) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Only trainer can access this" },
        { status: 403 }
      );
    }

    // Get the specific assigned nutrition plan with full tracking data
    const assignedPlan = await prisma.dietPlanAssignment.findUnique({
      where: {
        id: assignedPlanId,
        clientId: coachingRequest.clientId,
      },
      include: {
        nutritionPlan: true,
        assignedBy: {
          include: {
            trainerProfile: true,
          },
        },
        dailyLogs: {
          include: {
            mealLogs: {
              orderBy: {
                createdAt: "asc",
              },
            },
            snackLogs: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        },
        progressSummary: true,
      },
    });

    if (!assignedPlan) {
      return NextResponse.json(
        { success: false, error: "Assigned nutrition plan not found" },
        { status: 404 }
      );
    }

    // Calculate additional progress metrics
    const totalDays = assignedPlan.dailyLogs.length;
    const completedDays = assignedPlan.dailyLogs.filter(log => log.isCompleted).length;
    const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    // Get average nutrition values
    const avgCalories = totalDays > 0 
      ? Math.round(assignedPlan.dailyLogs.reduce((sum, log) => sum + log.totalCalories, 0) / totalDays)
      : 0;
    
    const avgProtein = totalDays > 0 
      ? Math.round(assignedPlan.dailyLogs.reduce((sum, log) => sum + log.totalProtein, 0) / totalDays)
      : 0;

    // Prepare response data
    const trackingData = {
      assignedPlan,
      client: coachingRequest.client,
      progressMetrics: {
        totalDays,
        completedDays,
        completionRate,
        avgCalories,
        avgProtein,
      },
      dailyLogs: assignedPlan.dailyLogs,
    };

    return NextResponse.json(
      { success: true, data: trackingData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching nutrition tracking data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}