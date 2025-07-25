import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get all assigned training plans for client (by coaching request)
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id } = params; // coaching request id
    // Get coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      include: {
        trainer: true,
        client: true,
      },
    });
    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }
    // Only trainer or client can view
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Get all assigned plans for this client and trainer
    const assignedPlans = await prisma.assignedTrainingPlan.findMany({
      where: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
      },
      orderBy: { assignedAt: "desc" },
    });
    return NextResponse.json({ success: true, data: assignedPlans });
  } catch (error) {
    console.error("Error fetching assigned training plans:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
