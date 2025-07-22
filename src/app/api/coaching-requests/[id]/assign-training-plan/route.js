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
    const { id } = params; // coaching request id
    const body = await request.json();
    const { planId } = body;
    if (!planId) {
      return NextResponse.json(
        { success: false, error: "Missing planId" },
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
    // Only trainer can assign
    if (coachingRequest.trainer.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Check if client already has active assigned plan
    const existing = await prisma.assignedTrainingPlan.findFirst({
      where: {
        clientId: coachingRequest.clientId,
        status: "active",
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Client already has an active training plan. Complete it before assigning a new one.",
        },
        { status: 409 }
      );
    }
    // Get original plan
    const plan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
    });
    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Training plan not found" },
        { status: 404 }
      );
    }
    // Copy plan data as JSON
    const planData = { ...plan };
    delete planData.id;
    delete planData.trainerInfoId;
    delete planData.createdAt;
    delete planData.updatedAt;
    delete planData.deletedAt;
    // Assign plan
    const assigned = await prisma.assignedTrainingPlan.create({
      data: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
        originalPlanId: plan.id,
        planData,
        status: "active",
      },
    });
    return NextResponse.json(
      { success: true, data: assigned },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning training plan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
