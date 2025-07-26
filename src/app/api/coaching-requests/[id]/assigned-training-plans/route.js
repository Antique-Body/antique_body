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
    const { id } = await params; // correct!
    // Fetch coaching request
    const coachingRequest = await prisma.coachingRequest.findUnique({
      where: { id },
      select: {
        client: { select: { userId: true } },
        trainer: { select: { userId: true } },
        clientId: true,
        trainerId: true,
      },
    });
    if (!coachingRequest) {
      return NextResponse.json(
        { success: false, error: "Coaching request not found" },
        { status: 404 }
      );
    }
    // Only the trainer or client can view
    if (
      session.user.id !== coachingRequest.trainer.userId &&
      session.user.id !== coachingRequest.client.userId
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }
    // Fetch all assigned plans for this client and trainer
    // Pagination parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page"), 10) || 1;
    const pageSize = parseInt(url.searchParams.get("pageSize"), 10) || 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const assignedPlans = await prisma.assignedTrainingPlan.findMany({
      where: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
      },
      select: {
        id: true,
        status: true,
        assignedAt: true,
        completedAt: true,
        originalPlanId: true,
        clientId: true,
        trainerId: true,
        planData: true, // <-- Add this line to include full plan data
        originalPlan: {
          select: {
            title: true,
            description: true,
            coverImage: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      skip,
      take,
    });
    // Add total count for pagination
    const totalCount = await prisma.assignedTrainingPlan.count({
      where: {
        clientId: coachingRequest.clientId,
        trainerId: coachingRequest.trainerId,
      },
    });
    return NextResponse.json({
      success: true,
      data: assignedPlans.map((plan) => ({
        ...plan,
        title: plan.originalPlan?.title || null,
        description: plan.originalPlan?.description || null,
        coverImage: plan.originalPlan?.coverImage || null,
      })),
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching assigned training plans:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
