import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: planId } = await params;

    // Fetch trainerInfoId using userId
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer info not found" },
        { status: 404 }
      );
    }

    // Try to find the plan in both training and nutrition tables
    let plan = await prisma.trainingPlan.findFirst({
      where: {
        id: planId,
        trainerInfoId: trainerInfo.id,
      },
    });

    let isNutritionPlan = false;
    
    if (!plan) {
      plan = await prisma.nutritionPlan.findFirst({
        where: {
          id: planId,
          trainerInfoId: trainerInfo.id,
        },
      });
      isNutritionPlan = true;
    }

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Plan not found or unauthorized" },
        { status: 404 }
      );
    }

    // Get all active assignments for this plan
    let assignments = [];
    
    if (isNutritionPlan) {
      // Get nutrition plan assignments
      assignments = await prisma.dietPlanAssignment.findMany({
        where: {
          nutritionPlanId: planId,
          isActive: true,
        },
        orderBy: { assignedAt: "desc" },
      });
    } else {
      // Get training plan assignments
      assignments = await prisma.assignedTrainingPlan.findMany({
        where: {
          originalPlanId: planId,
          status: "active",
        },
        orderBy: { assignedAt: "desc" },
      });
    }

    // Get client details for each assignment
    const formattedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Get client details directly
        const client = await prisma.clientInfo.findUnique({
          where: { id: assignment.clientId },
          include: {
            clientProfile: true,
          },
        });

        if (!client || !client.clientProfile) {
          return null; // Skip if no client found
        }

        // Find the coaching request
        const coachingRequest = await prisma.coachingRequest.findFirst({
          where: {
            clientId: assignment.clientId,
            trainerId: isNutritionPlan ? assignment.assignedById : assignment.trainerId,
            status: "accepted",
          },
        });

        // Get additional client info
        const profile = client.clientProfile;
        const age = profile.dateOfBirth 
          ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()
          : null;

        return {
          assignedPlanId: assignment.id,
          clientId: assignment.clientId,
          clientName: `${profile.firstName} ${profile.lastName}`,
          clientProfile: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            age: age,
            gender: profile.gender,
            profileImage: profile.profileImage,
            experienceLevel: profile.experienceLevel,
            primaryGoal: profile.primaryGoal,
          },
          status: isNutritionPlan ? assignment.status : assignment.status,
          assignedAt: assignment.assignedAt,
          startDate: isNutritionPlan ? assignment.startDate : null,
          progressInfo: isNutritionPlan ? {
            completedDays: assignment.completedDays || 0,
            totalDays: assignment.totalDays || 0,
            successRate: assignment.successRate || 0,
          } : null,
          coachingRequestId: coachingRequest?.id || null,
          planType: isNutritionPlan ? "nutrition" : "training",
        };
      })
    );

    // Filter out null results
    const validAssignments = formattedAssignments.filter(Boolean);

    return NextResponse.json({
      success: true,
      data: validAssignments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
