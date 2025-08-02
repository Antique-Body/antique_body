import { NextResponse } from "next/server";

import { auth } from "#/auth";
import prisma from "@/lib/prisma";

// GET: Get water intake for a specific date
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    // Find active diet plan assignment
    const activePlan = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId: clientInfo.id,
        status: "active",
        isActive: true,
      },
    });

    if (!activePlan) {
      // Return default water intake data when no plan is assigned
      return NextResponse.json({
        waterIntake: 0,
        waterGoal: 4000,
        date: date,
        hasActivePlan: false,
      });
    }

    // Find daily log for the specified date
    const dailyLog = await prisma.dailyDietLog.findFirst({
      where: {
        dietPlanAssignmentId: activePlan.id,
        date: new Date(date),
      },
    });

    if (!dailyLog) {
      return NextResponse.json({
        waterIntake: 0,
        waterGoal: 4000,
        date: date,
      });
    }

    return NextResponse.json({
      waterIntake: dailyLog.waterIntake,
      waterGoal: dailyLog.waterGoal,
      date: date,
    });

  } catch (error) {
    console.error("Error fetching water intake:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add water intake
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, date } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid water amount" },
        { status: 400 }
      );
    }

    const targetDate = date || new Date().toISOString().split("T")[0];

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    // Find active diet plan assignment
    const activePlan = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId: clientInfo.id,
        status: "active",
        isActive: true,
      },
    });

    if (!activePlan) {
      // Cannot add water intake without an active plan
      return NextResponse.json(
        { error: "No active diet plan found. Please have a plan assigned to track water intake." },
        { status: 400 }
      );
    }

    // Calculate day number based on start date
    const startDate = new Date(activePlan.startDate);
    const requestedDate = new Date(targetDate);
    const daysDiff = Math.floor((requestedDate - startDate) / (1000 * 60 * 60 * 24));
    const dayNumber = daysDiff + 1;

    // Find or create daily log for the specified date
    const dailyLog = await prisma.dailyDietLog.upsert({
      where: {
        dietPlanAssignmentId_date: {
          dietPlanAssignmentId: activePlan.id,
          date: new Date(targetDate),
        },
      },
      update: {
        waterIntake: {
          increment: amount,
        },
        updatedAt: new Date(),
      },
      create: {
        dietPlanAssignmentId: activePlan.id,
        date: new Date(targetDate),
        dayNumber: dayNumber,
        waterIntake: amount,
        waterGoal: 4000,
      },
    });

    // Sync water intake update back to trainer's view
    try {
      await prisma.dietPlanAssignment.update({
        where: { id: activePlan.id },
        data: {
          updatedAt: new Date(),
          planData: {
            ...activePlan.planData,
            lastClientUpdate: new Date().toISOString(),
            clientUpdateType: 'water_added',
            lastWaterUpdate: {
              amount: amount,
              newTotal: dailyLog.waterIntake,
              date: targetDate,
            },
          },
        },
      });
    } catch (syncError) {
      console.error('Error syncing water intake to trainer:', syncError);
      // Don't fail the main request if sync fails
    }

    return NextResponse.json({
      success: true,
      waterIntake: dailyLog.waterIntake,
      waterGoal: dailyLog.waterGoal,
      date: targetDate,
    });

  } catch (error) {
    console.error("Error adding water intake:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Reset water intake for a date
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date } = body;
    const targetDate = date || new Date().toISOString().split("T")[0];

    // Get client info
    const clientInfo = await prisma.clientInfo.findUnique({
      where: { userId: session.user.id },
    });

    if (!clientInfo) {
      return NextResponse.json(
        { error: "Client info not found" },
        { status: 404 }
      );
    }

    // Find active diet plan assignment
    const activePlan = await prisma.dietPlanAssignment.findFirst({
      where: {
        clientId: clientInfo.id,
        status: "active",
        isActive: true,
      },
    });

    if (!activePlan) {
      // Cannot reset water intake without an active plan
      return NextResponse.json(
        { error: "No active diet plan found. Please have a plan assigned to reset water intake." },
        { status: 400 }
      );
    }

    // Reset water intake for the daily log
    await prisma.dailyDietLog.updateMany({
      where: {
        dietPlanAssignmentId: activePlan.id,
        date: new Date(targetDate),
      },
      data: {
        waterIntake: 0,
        updatedAt: new Date(),
      },
    });

    // Sync water reset back to trainer's view
    try {
      await prisma.dietPlanAssignment.update({
        where: { id: activePlan.id },
        data: {
          updatedAt: new Date(),
          planData: {
            ...activePlan.planData,
            lastClientUpdate: new Date().toISOString(),
            clientUpdateType: 'water_reset',
            lastWaterUpdate: {
              newTotal: 0,
              date: targetDate,
            },
          },
        },
      });
    } catch (syncError) {
      console.error('Error syncing water reset to trainer:', syncError);
      // Don't fail the main request if sync fails
    }

    return NextResponse.json({
      success: true,
      waterIntake: 0,
      waterGoal: 4000,
      date: targetDate,
    });

  } catch (error) {
    console.error("Error resetting water intake:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}