import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get trainer recommendations for a specific date
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { success: false, error: "Client info not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const assignedPlanId = searchParams.get("assignedPlanId");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!assignedPlanId) {
      return NextResponse.json(
        { success: false, error: "Assigned plan ID is required" },
        { status: 400 }
      );
    }

    // Get the diet plan assignment
    const dietPlanAssignment = await prisma.dietPlanAssignment.findFirst({
      where: {
        id: assignedPlanId,
        clientId: clientInfo.id,
      },
      include: {
        nutritionPlan: true,
        assignedBy: {
          include: {
            trainerProfile: true,
          },
        },
      },
    });

    if (!dietPlanAssignment) {
      return NextResponse.json(
        { success: false, error: "Diet plan assignment not found" },
        { status: 404 }
      );
    }

    // Get the assigned nutrition plan to access planData
    const assignedNutritionPlan = await prisma.assignedNutritionPlan.findFirst({
      where: {
        clientId: clientInfo.id,
        status: "active",
      },
    });

    // Get nutrition tracking data for the specific date
    const trackingData = await prisma.nutritionTrackingData.findFirst({
      where: {
        assignedNutritionPlanId: assignedPlanId,
        date: date,
      },
    });

    // Get plan description from the assigned nutrition plan
    let planGuidelines = null;
    if (
      assignedNutritionPlan?.planData &&
      typeof assignedNutritionPlan.planData === "object"
    ) {
      planGuidelines = assignedNutritionPlan.planData.description || null;
    }

    if (!trackingData) {
      return NextResponse.json({
        success: true,
        data: {
          notes: null,
          supplementation: null,
          planGuidelines: planGuidelines,
          meals: {},
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        notes: trackingData.notes,
        supplementation: trackingData.supplementation,
        planGuidelines: planGuidelines,
        meals: trackingData.meals || {},
      },
    });
  } catch (error) {
    console.error("Error getting trainer recommendations:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
