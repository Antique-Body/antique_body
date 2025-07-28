import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// POST: Save supplementation recommendations for a specific date
export async function POST(request, context) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, planId } = await context.params;
    const body = await request.json();
    const { date, supplementation } = body;

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date is required" },
        { status: 400 }
      );
    }

    // Get coaching request to verify permissions
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { trainer: true, client: true },
    });

    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }

    // Only trainer can save supplementation recommendations
    if (session.user.id !== coachingRequest.trainer.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get or create tracking data for the date
    const trackingData = await prisma.nutritionTrackingData.upsert({
      where: {
        assignedNutritionPlanId_date: {
          assignedNutritionPlanId: planId,
          date: date,
        },
      },
      update: {
        supplementation: supplementation || null,
      },
      create: {
        assignedNutritionPlanId: planId,
        date: date,
        meals: {},
        notes: null,
      },
    });

    return NextResponse.json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    console.error("Error saving supplementation:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
