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

    for (const plan of trainingPlans) {
      const activeAssignments = await prisma.assignedTrainingPlan.count({
        where: {
          originalPlanId: plan.id,
          status: "active",
        },
      });

      await prisma.trainingPlan.update({
        where: { id: plan.id },
        data: { clientCount: activeAssignments },
      });

      updatedCount++;
    }

    // Sync nutrition plans
    const nutritionPlans = await prisma.nutritionPlan.findMany({
      where: { trainerInfoId: trainerInfo.id },
      select: { id: true },
    });

    for (const plan of nutritionPlans) {
      const activeAssignments = await prisma.assignedTrainingPlan.count({
        where: {
          originalPlanId: plan.id,
          status: "active",
        },
      });

      await prisma.nutritionPlan.update({
        where: { id: plan.id },
        data: { clientCount: activeAssignments },
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
