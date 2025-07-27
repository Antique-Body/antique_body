import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = await params;
    const body = await request.json();
    const { planId } = body;
    if (!planId || typeof planId !== "string" || planId.length < 5) {
      return NextResponse.json(
        { success: false, error: "Invalid planId format." },
        { status: 400 }
      );
    }
    // Get coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: { client: true, trainer: true },
    });
    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Find active plan
    const activePlan = await prisma.assignedTrainingPlan.findFirst({
      where: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
        status: "active",
      },
    });
    // Prepare planData for new assignment
    const plan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      );
    }
    const {
      id: _id,

      ...planData
    } = plan;
    // Transaction: complete old plan and assign new one atomically
    const result = await prisma.$transaction(async (tx) => {
      if (activePlan) {
        await tx.assignedTrainingPlan.update({
          where: { id: activePlan.id },
          data: { status: "completed", completedAt: new Date() },
        });
      }
      return await tx.assignedTrainingPlan.create({
        data: {
          clientId: coachingRequest.clientId,
          trainerId: coachingRequest.trainerId,
          originalPlanId: plan.id,
          planData,
          status: "active",
        },
      });
    });
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error replacing training plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
