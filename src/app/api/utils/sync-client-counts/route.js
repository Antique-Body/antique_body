import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

export async function POST(_request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Optional: Add admin check if needed
    // For now, allow any authenticated trainer to sync their own plans

    // Get trainer info
    const trainerInfo = await prisma.trainerInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!trainerInfo) {
      return NextResponse.json(
        { success: false, error: "Trainer info not found" },
        { status: 404 }
      );
    }

    let updatedCount = 0;

    // Sync training plans
    const trainingPlans = await prisma.trainingPlan.findMany({
      where: { trainerInfoId: trainerInfo.id },
      select: { id: true },
    });
    const trainingPlanIds = trainingPlans.map((plan) => plan.id);
    const trainingCounts = await prisma.assignedTrainingPlan.groupBy({
      by: ["originalPlanId"],
      where: {
        originalPlanId: { in: trainingPlanIds },
        status: "active",
      },
      _count: { originalPlanId: true },
    });
    const trainingCountMap = Object.fromEntries(
      trainingCounts.map((c) => [c.originalPlanId, c._count.originalPlanId])
    );
    for (const plan of trainingPlans) {
      const clientCount = trainingCountMap[plan.id] || 0;
      await prisma.trainingPlan.update({
        where: { id: plan.id },
        data: { clientCount },
      });
      updatedCount++;
    }

    // Sync nutrition plans
    const nutritionPlans = await prisma.nutritionPlan.findMany({
      where: { trainerInfoId: trainerInfo.id },
      select: { id: true },
    });
    const nutritionPlanIds = nutritionPlans.map((plan) => plan.id);
    const nutritionCounts = await prisma.assignedTrainingPlan.groupBy({
      by: ["originalPlanId"],
      where: {
        originalPlanId: { in: nutritionPlanIds },
        status: "active",
      },
      _count: { originalPlanId: true },
    });
    const nutritionCountMap = Object.fromEntries(
      nutritionCounts.map((c) => [c.originalPlanId, c._count.originalPlanId])
    );
    for (const plan of nutritionPlans) {
      const clientCount = nutritionCountMap[plan.id] || 0;
      await prisma.nutritionPlan.update({
        where: { id: plan.id },
        data: { clientCount },
      });
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced client counts for ${updatedCount} plans`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error syncing client counts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
